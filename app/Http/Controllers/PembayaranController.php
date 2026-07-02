<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Transaction;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Auth;
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Str;
use App\Models\CorporateVoucher;
use App\Models\Notification;
use App\Models\TrainingRequest;
use Illuminate\Support\Facades\DB;

class PembayaranController extends Controller
{
    // ✅ Helper: cek apakah user adalah pembeli voucher (korporat atau instansi/ASN)
    private function isVoucherBuyer($user): bool
    {
        return in_array($user->kategori_pensiun, ['korporat', 'asn']);
    }

    // ✅ Helper: prefix kode voucher berdasarkan kategori
    private function generateVoucherCode($kategori): string
    {
        $prefix = $kategori === 'asn' ? 'ASN' : 'CORP';
        return $prefix . '-' . strtoupper(Str::random(5)) . '-' . rand(100, 999);
    }

    public function konfirmasiGratis($slug)
    {
        $user   = Auth::user();
        $course = Course::with('category')->where('slug', $slug)->firstOrFail();

        $enrolled = Enrollment::where('user_id', $user->user_id)
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->exists();

        if (!$enrolled) {
            return redirect()->route('beli-pelatihan')
                ->with('error', 'Anda belum terdaftar pada kelas ini.');
        }

        return Inertia::render('Pelatihan/KonfirmasiPendaftaranGratis', ['course' => $course]);
    }

    // =================================================================
    // 1. CHECKOUT — Halaman publik (non-korporat/instansi)
    // =================================================================
    public function checkout(Request $request, $slug)
    {
        $user            = Auth::user();
        $course          = Course::where('slug', $slug)->firstOrFail();
        $jumlahPeserta   = (int) $request->query('qty', 1);
        $hargaPerPeserta = (int) $course->price;
        $nominalTotal    = $hargaPerPeserta * $jumlahPeserta;

        // Cek double beli HANYA untuk user Publik (bukan korporat/asn)
        // ✅ FIX BUG 2: ASN & Korporat tidak diblokir di sini
        if (!$this->isVoucherBuyer($user)) {
            $sudahBeli = Enrollment::where('user_id', $user->user_id)
                ->where('course_id', $course->id)
                ->where('status', 'active')
                ->exists();

            if ($sudahBeli) {
                return redirect()->route('payment.success', $course->slug)
                    ->with('success', 'Anda sudah memiliki pelatihan ini.');
            }
        }

        // Kelas gratis
        if ($nominalTotal == 0) {
            if ($this->isVoucherBuyer($user)) {
                // ✅ FIX BUG 3: Simpan target_kategori
                CorporateVoucher::create([
                    'corporate_user_id' => $user->user_id,
                    'course_id'         => $course->id,
                    'code'              => $this->generateVoucherCode($user->kategori_pensiun),
                    'max_uses'          => $jumlahPeserta,
                    'used_count'        => 0,
                    'target_kategori'   => $user->kategori_pensiun,
                ]);
            } else {
                Enrollment::create([
                    'user_id'        => $user->user_id,
                    'course_id'      => $course->id,
                    'tanggal_daftar' => now(),
                    'status'         => 'active',
                ]);
            }
            return redirect()->route('payment.success', $course->slug)
                ->with('success', 'Pelatihan gratis berhasil diklaim!');
        }

        // Setup Midtrans
        Config::$serverKey    = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized  = true;
        Config::$is3ds        = true;

        $pendingTransaction = Transaction::where('user_id', $user->user_id)
            ->where('course_id', $course->id)
            ->where('status', 'pending')
            ->where('batas_waktu', '>', now()) // Hanya ambil yang belum expired
            ->latest() // Ambil yang terbaru jika ada beberapa
            ->first();

        if (
            $pendingTransaction &&
            $pendingTransaction->snap_token &&
            now()->lessThan($pendingTransaction->batas_waktu) &&
            $pendingTransaction->jumlah_peserta === $jumlahPeserta
        ) {
            $snapToken   = $pendingTransaction->snap_token;
            $transaction = $pendingTransaction;
        } else {
            if ($pendingTransaction) {
                $pendingTransaction->update(['status' => 'failed']);
            }

            $orderId   = 'INV-' . date('Ymd') . '-' . rand(1000, 9999);
            $params    = [
                'transaction_details' => ['order_id' => $orderId, 'gross_amount' => $nominalTotal],
                'customer_details'    => ['first_name' => $user->name, 'email' => $user->email],
                'item_details'        => [[
                    'id'       => $course->id,
                    'price'    => $hargaPerPeserta,
                    'quantity' => $jumlahPeserta,
                    'name'     => mb_substr($course->title, 0, 49),
                ]],
                'expiry' => ['unit' => 'minute', 'duration' => 3],
            ];
            $snapToken   = Snap::getSnapToken($params);
            $transaction = Transaction::create([
                'user_id'           => $user->user_id,
                'course_id'         => $course->id,
                'nomor_transaksi'   => $orderId,
                'jumlah_peserta'    => $jumlahPeserta,
                'harga_per_peserta' => $hargaPerPeserta,
                'nominal'           => $nominalTotal,
                'status'            => 'pending',
                'snap_token'        => $snapToken,
                'batas_waktu'       => now()->addMinutes(3),
            ]);
        }

        return Inertia::render('Payment/DetailPembelian', [
            'course'            => $course,
            'transaction'       => $transaction,
            'snapToken'         => $snapToken,
            'midtransClientKey' => env('MIDTRANS_CLIENT_KEY'),
        ]);
    }

    /**
     * Halaman pembayaran booking offline.
     * Dipakai jalur A (langsung dari store) & jalur B (setelah admin approve).
     * Route-model-binding {trainingRequest} otomatis pakai PK request_id.
     */
    public function offlineCheckout(TrainingRequest $trainingRequest)
    {
        // 🔒 Keamanan: cuma pemilik booking yang boleh akses
        abort_if($trainingRequest->user_id !== Auth::id(), 403);

        // 🔒 Guard status: cuma bisa bayar kalau statusnya MENUNGGU_BAYAR
        // (jalur B yang masih menunggu_approval / ditolak nggak boleh masuk sini)
        if ($trainingRequest->status !== TrainingRequest::MENUNGGU_BAYAR) {
            return redirect()->route('instansi.pelatihan-dibeli')
                ->with('error', 'Booking ini belum bisa dibayar atau sudah diproses.');
        }

        $trainingRequest->load('course');

        return Inertia::render('Instansi/PembayaranOffline', [
            'request' => [
                'id'              => $trainingRequest->request_id,
                'course_title'    => $trainingRequest->course->title,
                'thumbnail'       => $trainingRequest->course->thumbnail,
                'tanggal_mulai'   => $trainingRequest->tanggal_mulai?->locale('id')->isoFormat('D MMM YYYY'),
                'tanggal_selesai' => $trainingRequest->tanggal_selesai?->locale('id')->isoFormat('D MMM YYYY'),
                'lokasi'          => $trainingRequest->usulan_lokasi
                    ?: ($trainingRequest->course->lokasi_default ?? 'Akan dikonfirmasi'),
                'jumlah_peserta'  => $trainingRequest->jumlah_peserta,
                'harga_satuan'    => (int) $trainingRequest->course->price,
                'total'           => (int) $trainingRequest->estimasi_harga,
                'is_custom'       => $trainingRequest->is_custom,
            ],
            'payHref'  => route('instansi.pembayaran.proses', $trainingRequest->request_id),
            'backHref' => route('instansi.beli-pelatihan'),
        ]);
    }

    /**
     * Proses pembayaran: tandai LUNAS + generate CorporateVoucher.
     * Voucher observer otomatis kirim notif ke instansi.
     */
    public function prosesPembayaranOffline(TrainingRequest $trainingRequest)
    {
        abort_if($trainingRequest->user_id !== Auth::id(), 403);

        // 🔒 Cegah double-bayar (idempotent)
        if ($trainingRequest->status !== TrainingRequest::MENUNGGU_BAYAR) {
            return redirect()->route('instansi.pelatihan-dibeli')
                ->with('error', 'Booking ini sudah diproses sebelumnya.');
        }

        $user = Auth::user();
        $trainingRequest->load('course');

        // Prefix kode voucher sesuai kategori instansi
        $prefix = $user->kategori_pensiun === 'asn' ? 'ASN-' : 'CORP-';

        // Bungkus transaksi biar voucher + update status atomik (nggak setengah jadi)
        DB::transaction(function () use ($trainingRequest, $user, $prefix) {
            // Generate kode unik (ulang kalau kebetulan bentrok)
            do {
                $code = $prefix . strtoupper(Str::random(8));
            } while (CorporateVoucher::where('code', $code)->exists());

            // max_uses = jumlah peserta yang dibooking
            $voucher = CorporateVoucher::create([
                'corporate_user_id' => $trainingRequest->user_id,
                'course_id'         => $trainingRequest->course_id,
                'code'              => $code,
                'max_uses'          => $trainingRequest->jumlah_peserta,
                'used_count'        => 0,
                'target_kategori'   => $user->kategori_pensiun,
            ]);
            // ↑ CorporateVoucherObserver fire di sini → notif "Voucher berhasil dibuat" 🔔

            // Tandai lunas + simpan relasi voucher
            $trainingRequest->update([
                'status'     => TrainingRequest::LUNAS,
                'voucher_id' => $voucher->id,
            ]);
        });

        return redirect()->route('instansi.pembayaran-berhasil', $trainingRequest->request_id)
            ->with('success', 'Pembayaran berhasil! Kode voucher sudah dibuat, silakan bagikan ke peserta.');
    }

    /**
     * Finalisasi pembayaran dari popup Midtrans (jalur A langsung).
     * Endpoint ini dipanggil via axios dari frontend.
     */
    public function finalizeOfflinePayment(TrainingRequest $trainingRequest)
    {
        abort_if($trainingRequest->user_id !== Auth::id(), 403);

        if ($trainingRequest->status !== TrainingRequest::MENUNGGU_BAYAR) {
            return response()->json(['ok' => true, 'redirect' => route('instansi.pembayaran-berhasil', $trainingRequest->request_id)]); // sudah diproses, idempotent
        }

        $user = Auth::user();
        $trainingRequest->load('course');

        $prefix = $user->kategori_pensiun === 'asn' ? 'ASN-' : 'CORP-';

        try {
            DB::transaction(function () use ($trainingRequest, $user, $prefix) {
                do {
                    $code = $prefix . strtoupper(Str::random(8));
                } while (CorporateVoucher::where('code', $code)->exists());

                $voucher = CorporateVoucher::create([
                    'corporate_user_id' => $trainingRequest->user_id,
                    'course_id'         => $trainingRequest->course_id,
                    'code'              => $code,
                    'max_uses'          => $trainingRequest->jumlah_peserta,
                    'used_count'        => 0,
                    'target_kategori'   => $user->kategori_pensiun,
                ]);
                // ↑ CorporateVoucherObserver fire di sini → notif "Voucher berhasil dibuat" 🔔

                // Tandai lunas + simpan relasi voucher
                $trainingRequest->update([
                    'status'     => TrainingRequest::LUNAS,
                    'voucher_id' => $voucher->id,
                ]);
            });

            return response()->json(['ok' => true, 'redirect' => route('instansi.pembayaran-berhasil', $trainingRequest->request_id)]);
        } catch (\Exception $e) {
            // Log the exception for debugging
            \Log::error('Error in finalizeOfflinePayment: ' . $e->getMessage() . "\n" . $e->getTraceAsString());

            // Return a generic error response to the client
            return response()->json(['ok' => false, 'message' => 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi nanti.'], 500);
        }
    }

    // =================================================================
    public function finish(Request $request)
    {
        $orderId           = $request->query('order_id');
        $transactionStatus = $request->query('transaction_status');
        $statusCode        = $request->query('status_code');

        $transaction = Transaction::where('nomor_transaksi', $orderId)->first();
        if (!$transaction) {
            return redirect()->route('beli-pelatihan')->with('error', 'Transaksi tidak ditemukan.');
        }

        $course = Course::find($transaction->course_id);
        if (!$course) {
            return redirect()->route('beli-pelatihan');
        }

        // Anti-double process
        if ($transaction->status === 'success') {
            return redirect()->route('payment.success', $course->slug);
        }

        if (
            in_array($transactionStatus, ['settlement', 'capture']) ||
            $request->query('flag') === 'success'
        ) {
            $transaction->update(['status' => 'success']);

            // Batalkan semua transaksi pending lain untuk kursus yang sama
            Transaction::where('user_id', $transaction->user_id)
                ->where('course_id', $transaction->course_id)
                ->where('status', 'pending')
                ->where('id', '!=', $transaction->id)
                ->update(['status' => 'failed']);

            Notification::send(
                $transaction->user_id,
                'Pembayaran Berhasil!',
                "Anda kini memiliki akses penuh ke {$course->title}.",
                'success',
                'Mulai Belajar',
                "/pelatihan/{$course->id}/belajar"
            );

            $buyer = \App\Models\User::find($transaction->user_id);

            // ✅ FIX BUG 1 + BUG 3: Korporat DAN ASN sama-sama dapat voucher
            if ($buyer && $this->isVoucherBuyer($buyer)) {
                $voucherLama = CorporateVoucher::where('corporate_user_id', $buyer->user_id)
                    ->where('course_id', $transaction->course_id)
                    ->first();

                if ($voucherLama) {
                    $voucherLama->increment('max_uses', $transaction->jumlah_peserta);
                } else {
                    // ✅ FIX BUG 3: Simpan target_kategori agar hanya ASN/korporat yang bisa redeem
                    CorporateVoucher::create([
                        'corporate_user_id' => $buyer->user_id,
                        'course_id'         => $transaction->course_id,
                        'code'              => $this->generateVoucherCode($buyer->kategori_pensiun),
                        'max_uses'          => $transaction->jumlah_peserta,
                        'used_count'        => 0,
                        'target_kategori'   => $buyer->kategori_pensiun, // 'korporat' atau 'asn'
                    ]);
                }
            } else {
                // User Publik → langsung enrollment
                $cekEnrollment = Enrollment::where('user_id', $transaction->user_id)
                    ->where('course_id', $transaction->course_id)
                    ->exists();

                if (!$cekEnrollment) {
                    Enrollment::create([
                        'user_id'         => $transaction->user_id,
                        'course_id'       => $transaction->course_id,
                        'tanggal_daftar'  => now(),
                        'status'          => 'active',
                        'progress_persen' => 0,
                        'is_completed'    => false,
                    ]);
                }
            }

            return redirect()->route('payment.success', $course->slug);
        }

        // Expired / gagal
        if (in_array($transactionStatus, ['expire', 'cancel', 'deny']) || $statusCode == 407) {
            $transaction->update(['status' => 'failed']);

            Notification::send(
                $transaction->user_id,
                'Transaksi Gagal',
                'Silakan coba lagi atau hubungi bantuan jika kendala berlanjut.',
                'danger',
                'Coba Lagi',
                "/pelatihan/{$course->slug}/pembelian"
            );

            return redirect()->route('payment.detail', $course->slug)
                ->with('error', 'Waktu pembayaran habis atau dibatalkan.');
        }

        // Pending
        return redirect()->route('payment.detail', $course->slug)
            ->with('info', 'Pembayaran sedang diproses.');
    }

    // =================================================================
    // 3. SUCCESS — Halaman struk sukses
    // =================================================================
    public function success($slug)
    {
        $user   = Auth::user();
        $course = Course::with(['modules.materials', 'category'])->where('slug', $slug)->firstOrFail();
        $course->setAttribute('firstLessonId', $this->firstMaterialId($course));

        $transaction = Transaction::where('user_id', $user->user_id)
            ->where('course_id', $course->id)
            ->where('status', 'success')
            ->latest()
            ->first();

        if ($user && $user->kategori_pensiun === 'korporat') {
            $voucher = CorporateVoucher::where('corporate_user_id', $user->user_id)
                ->where('course_id', $course->id)
                ->latest()
                ->first();

            return Inertia::render('Korporat/PembayaranBerhasilKorporat', [
                'course'      => $course,
                'transaction' => $transaction,
                'voucher'     => $voucher,
            ]);
        }

        if ($user && $user->kategori_pensiun === 'asn') {
            $voucher = CorporateVoucher::where('corporate_user_id', $user->user_id)
                ->where('course_id', $course->id)
                ->latest()
                ->first();

            return Inertia::render('Instansi/PembayaranBerhasilInstansi', [
                'course'      => $course,
                'transaction' => $transaction,
                'voucher'     => $voucher,
            ]);
        }

        // Publik
        return Inertia::render('Payment/PembayaranBerhasil', [
            'course'      => $course,
            'transaction' => $transaction,
        ]);
    }

    // =================================================================
    // 4. CHECKOUT KORPORAT & INSTANSI
    // =================================================================
    public function checkoutKorporat(Request $request, $slug)
    {
        $user            = Auth::user();
        $course          = Course::where('slug', $slug)->firstOrFail();
        $jumlahPeserta   = max(1, (int) $request->query('qty', 1));
        $hargaPerPeserta = (int) $course->price;
        $nominalTotal    = $hargaPerPeserta * $jumlahPeserta;

        Config::$serverKey    = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized  = true;
        Config::$is3ds        = true;

        $pendingTransaction = Transaction::where('user_id', $user->user_id)
            ->where('course_id', $course->id)
            ->where('status', 'pending')
            ->where('batas_waktu', '>', now())
            ->latest()
            ->first();

        if (
            $pendingTransaction &&
            $pendingTransaction->snap_token &&
            now()->lessThan($pendingTransaction->batas_waktu) &&
            $pendingTransaction->jumlah_peserta == $jumlahPeserta
        ) {
            $transaction = $pendingTransaction;
            $snapToken   = $transaction->snap_token;
        } else {
            if ($pendingTransaction) {
                $pendingTransaction->update(['status' => 'failed']);
            }

            $orderId   = 'INV-' . date('Ymd') . '-' . rand(1000, 9999);
            $params    = [
                'transaction_details' => ['order_id' => $orderId, 'gross_amount' => $nominalTotal],
                'customer_details'    => ['first_name' => $user->name, 'email' => $user->email],
                'item_details'        => [[
                    'id'       => $course->id,
                    'price'    => $hargaPerPeserta,
                    'quantity' => $jumlahPeserta,
                    'name'     => mb_substr($course->title, 0, 49),
                ]],
                'expiry' => ['unit' => 'minute', 'duration' => 3],
            ];
            $snapToken   = Snap::getSnapToken($params);
            $transaction = Transaction::create([
                'user_id'           => $user->user_id,
                'course_id'         => $course->id,
                'nomor_transaksi'   => $orderId,
                'jumlah_peserta'    => $jumlahPeserta,
                'harga_per_peserta' => $hargaPerPeserta,
                'nominal'           => $nominalTotal,
                'status'            => 'pending',
                'snap_token'        => $snapToken,
                'batas_waktu'       => now()->addMinutes(3),
            ]);
        }

        // ✅ Render halaman sesuai kategori user (korporat atau asn/instansi)
        $viewFolder = $user->kategori_pensiun === 'asn' ? 'Instansi' : 'Korporat';
        $routeName  = $user->kategori_pensiun === 'asn' ? 'instansi.pelatihan.detail' : 'korporat.pelatihan.detail';

        return Inertia::render("{$viewFolder}/DetailPembelianOnline", [
            'course'            => $course,
            'transaction'       => $transaction,
            'snapToken'         => $snapToken,
            'midtransClientKey' => env('MIDTRANS_CLIENT_KEY'),
            'quantity'          => $jumlahPeserta,
            'backHref'          => route($routeName, $course->slug),
        ]);
    }

    // =================================================================
    // 5. WEBHOOK
    // =================================================================
    public function webhook(Request $request)
    {
        \Log::info('MIDTRANS WEBHOOK', $request->all());
        return response()->json(['status' => 'ok']);
    }

    private function firstMaterialId(Course $course): mixed
    {
        $course->loadMissing('modules.materials');
        return $course->modules
            ->flatMap(fn($module) => $module->materials)
            ->first()
            ?->id;
    }
}
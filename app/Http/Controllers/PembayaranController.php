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
    //56ujn Helper: cek apakah user adalah pembeli voucher (korporat atau instansi/ASN)
    private function isVoucherBuyer($user): bool
    {
        return in_array($user->kategori_pensiun, ['korporat', 'asn']);
    }

    // Helper: prefix kode voucher berdasarkan kategori
    private function generateVoucherCode($kategori): string
    {
        $prefix = $kategori === 'asn' ? 'ASN' : 'CORP';
        return $prefix . '-' . strtoupper(Str::random(5)) . '-' . rand(100, 999);
    }

    // =================================================================
    // HELPER: Konfigurasi Midtrans dari config/services.php
    // (JANGAN pakai env() langsung — null jika config di-cache)
    // =================================================================
    private function setMidtransConfig(): void
    {
        Config::$serverKey    = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production', false);
        Config::$isSanitized  = true;
        Config::$is3ds        = true;
    }

    // =================================================================
    // HELPER IDEMPOTENT: Selesaikan pembayaran hybrid/online korporat & publik
    // Dipanggil dari cekStatus() (lokal) dan webhook() (produksi).
    // =================================================================
    protected function selesaikanPembayaran(Transaction $t): void
    {
        // Guard idempotent: sudah selesai sebelumnya
        if ($t->status === 'success') {
            return;
        }

        DB::transaction(function () use ($t) {
            // Lock row agar tidak ada race condition
            $t = Transaction::lockForUpdate()->find($t->id);

            // Double-check setelah lock
            if ($t->status === 'success') {
                return;
            }

            // Update status transaksi → 'success' (sesuai enum: pending|success|failed|expired)
            $t->update(['status' => 'success']);

            $user   = \App\Models\User::find($t->user_id);
            $course = Course::find($t->course_id);

            if (!$user || !$course) {
                \Log::error("selesaikanPembayaran: user/course tidak ditemukan untuk transaction_id={$t->id}");
                return;
            }

            if ($this->isVoucherBuyer($user)) {
                // Guard idempotent: cegah dobel voucher untuk 1 transaksi
                if (!CorporateVoucher::where('transaction_id', $t->id)->exists()) {
                    // Buat CorporateVoucher
                    // CorporateVoucherObserver otomatis akan mengirim notifikasi dengan kode voucher
                    CorporateVoucher::create([
                        'corporate_user_id' => $user->user_id,
                        'course_id'         => $course->id,
                        'transaction_id'    => $t->id,
                        'code'              => $this->generateVoucherCode($user->kategori_pensiun),
                        'max_uses'          => $t->jumlah_peserta,
                        'used_count'        => 0,
                        'target_kategori'   => 'publik', // voucher ini untuk dibagikan ke peserta publik
                    ]);
                }
            } else {
                // Public user: langsung gabung kelas (Enrollment)
                $cekEnrollment = Enrollment::where('user_id', $user->user_id)
                    ->where('course_id', $course->id)
                    ->exists();

                if (!$cekEnrollment) {
                    Enrollment::create([
                        'user_id'         => $user->user_id,
                        'course_id'       => $course->id,
                        'tanggal_daftar'  => now(),
                        'status'          => 'active',
                        'progress_persen' => 0,
                        'is_completed'    => false,
                    ]);
                }

                // Notifikasi untuk public user (tanpa kode voucher)
                Notification::send(
                    $user->user_id,
                    'Pembayaran Berhasil!',
                    "Anda kini memiliki akses penuh ke {$course->title}.",
                    'success',
                    'Mulai Belajar',
                    "/pelatihan/{$course->id}/belajar"
                );
            }
        });
    }

    // =================================================================
    // ENDPOINT CEK STATUS — dipanggil onSuccess dari Snap (jalan di lokal)
    // Verifikasi ke API Midtrans, lalu finalisasi transaksi.
    // =================================================================
    public function cekStatus($orderId)
    {
        $this->setMidtransConfig();

        $transaction = Transaction::where('nomor_transaksi', $orderId)->firstOrFail();

        // Hanya pemilik transaksi yang boleh akses
        abort_if($transaction->user_id !== Auth::user()->user_id, 403);

        try {
            // Verifikasi status ke Midtrans (jangan percaya frontend)
            $statusMidtrans = \Midtrans\Transaction::status($orderId);
            $txStatus = $statusMidtrans->transaction_status ?? '';
            $fraudStatus = $statusMidtrans->fraud_status ?? 'accept';
        } catch (\Exception $e) {
            \Log::error("cekStatus: Gagal cek ke Midtrans untuk order_id={$orderId}: " . $e->getMessage());

            // Jika sudah paid sebelumnya (idempotent), tetap redirect dengan sukses
            if (in_array($transaction->status, ['paid', 'success'])) {
                $transaction->load('course');
                return redirect()->route('payment.success', $transaction->course->slug);
            }

            return back()->with('error', 'Gagal memverifikasi pembayaran ke Midtrans. Silakan coba lagi.');
        }

        if (in_array($txStatus, ['settlement', 'capture']) && $fraudStatus !== 'deny') {
            $this->selesaikanPembayaran($transaction);
            $transaction->load('course');

            return redirect()->route('payment.success', $transaction->course->slug);
        }

        if (in_array($txStatus, ['expire', 'cancel', 'deny'])) {
            if ($transaction->status === 'pending') {
                $transaction->update(['status' => 'failed']);
            }
            $user   = Auth::user();
            $course = Course::find($transaction->course_id);
            $backRoute = $user->kategori_pensiun === 'asn'
                ? route('instansi.beli-pelatihan')
                : route('korporat.beli-pelatihan');
            return redirect($backRoute)->with('error', 'Pembayaran gagal atau dibatalkan.');
        }

        // Pending — belum ada konfirmasi dari Midtrans
        $user    = Auth::user();
        $backRoute = $user->kategori_pensiun === 'asn'
            ? route('instansi.beli-pelatihan')
            : route('korporat.beli-pelatihan');
        return redirect($backRoute)->with('info', 'Pembayaran sedang diproses. Voucher akan segera tersedia.');
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
    // AJAX: Regenerate snap token untuk korporat/instansi (tanpa reload halaman)
    // =================================================================
    public function regenerateSnapTokenKorporat(Request $request, $slug)
    {
        $user   = Auth::user();
        $course = Course::with('category')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('slug', $slug)
            ->firstOrFail();

        if (!in_array($user->kategori_pensiun, ['korporat', 'asn'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $jumlahPeserta = max(1, (int) $request->input('qty', 1));
        $hargaPerPeserta = (int) $course->price;
        $nominalTotal = $hargaPerPeserta * $jumlahPeserta;

        $this->setMidtransConfig();

        $pendingTransaction = Transaction::where('user_id', $user->user_id)
            ->where('course_id', $course->id)
            ->where('status', 'pending')
            ->where('batas_waktu', '>', now())
            ->latest()
            ->first();

        // Jika qty sama, gunakan token yang ada
        if (
            $pendingTransaction &&
            $pendingTransaction->snap_token &&
            now()->lessThan($pendingTransaction->batas_waktu) &&
            $pendingTransaction->jumlah_peserta == $jumlahPeserta
        ) {
            return response()->json([
                'snapToken' => $pendingTransaction->snap_token,
                'transaction' => $pendingTransaction,
            ]);
        }

        // Qty berubah — buat transaction baru
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

        return response()->json([
            'snapToken' => $snapToken,
            'transaction' => $transaction,
        ]);
    }

    // =================================================================
    // 1. CHECKOUT — Halaman publik (non-korporat/instansi)
    // =================================================================
    public function checkout(Request $request, $slug)
    {
        $user            = Auth::user();
        $course          = Course::with('category')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('slug', $slug)
            ->firstOrFail();

        if ($user->kategori_pensiun === 'publik' && $course->tipe_kelas !== 'Online') {
            return redirect()->route('beli-pelatihan')
                ->with('error', 'Kelas Offline & Hybrid hanya tersedia untuk peserta ASN & Korporat.');
        }

        $jumlahPeserta   = (int) $request->query('qty', 1);
        $hargaPerPeserta = (int) $course->price;
        $nominalTotal    = $hargaPerPeserta * $jumlahPeserta;

        // Cek double beli HANYA untuk user Publik (bukan korporat/asn)
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
        $this->setMidtransConfig();

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
            'midtransClientKey' => config('services.midtrans.client_key'),
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
        $user = Auth::user();
        $prefix = $user->kategori_pensiun === 'korporat' ? 'korporat' : 'instansi';

        if ($trainingRequest->status !== TrainingRequest::MENUNGGU_BAYAR) {
            return redirect()->route("{$prefix}.pelatihan-dibeli")
                ->with('error', 'Booking ini belum bisa dibayar atau sudah diproses.');
        }

        $trainingRequest->load('course');

        // Render komponen sesuai kategori user
        $component = $prefix === 'korporat' ? 'Korporat/PembayaranOffline' : 'Instansi/PembayaranOffline';

        return Inertia::render($component, [
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
            'payHref'  => route("{$prefix}.pembayaran.proses", $trainingRequest->request_id),
            'backHref' => route("{$prefix}.beli-pelatihan"),
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
        $user = Auth::user();
        $routePrefix = $user->kategori_pensiun === 'korporat' ? 'korporat' : 'instansi';

        if ($trainingRequest->status !== TrainingRequest::MENUNGGU_BAYAR) {
            return redirect()->route("{$routePrefix}.pelatihan-dibeli")
                ->with('error', 'Booking ini sudah diproses sebelumnya.');
        }

        $trainingRequest->load('course');

        $voucherPrefix = $user->kategori_pensiun === 'asn' ? 'ASN-' : 'CORP-';

        DB::transaction(function () use ($trainingRequest, $user, $voucherPrefix) {
            do {
                $code = $voucherPrefix . strtoupper(Str::random(8));
            } while (CorporateVoucher::where('code', $code)->exists());

            $voucher = CorporateVoucher::create([
                'corporate_user_id' => $trainingRequest->user_id,
                'course_id'         => $trainingRequest->course_id,
                'code'              => $code,
                'max_uses'          => $trainingRequest->jumlah_peserta,
                'used_count'        => 0,
                'target_kategori'   => $user->kategori_pensiun,
            ]);

            $trainingRequest->update([
                'status'     => TrainingRequest::LUNAS,
                'voucher_id' => $voucher->id,
            ]);
        });

        return redirect()->route("{$routePrefix}.pembayaran-berhasil", $trainingRequest->request_id)
            ->with('success', 'Pembayaran berhasil! Kode voucher sudah dibuat, silakan bagikan ke peserta.');
    }

    /**
     * Finalisasi pembayaran dari popup Midtrans (jalur A langsung).
     */
    public function finalizeOfflinePayment(TrainingRequest $trainingRequest)
    {
        abort_if($trainingRequest->user_id !== Auth::id(), 403);

        $user = Auth::user();
        $routePrefix = $user->kategori_pensiun === 'korporat' ? 'korporat' : 'instansi';

        if ($trainingRequest->status !== TrainingRequest::MENUNGGU_BAYAR) {
            return response()->json(['ok' => true, 'redirect' => route("{$routePrefix}.pembayaran-berhasil", $trainingRequest->request_id)]);
        }

        $trainingRequest->load('course');

        $voucherPrefix = $user->kategori_pensiun === 'asn' ? 'ASN-' : 'CORP-';

        try {
            DB::transaction(function () use ($trainingRequest, $user, $voucherPrefix) {
                do {
                    $code = $voucherPrefix . strtoupper(Str::random(8));
                } while (CorporateVoucher::where('code', $code)->exists());

                $voucher = CorporateVoucher::create([
                    'corporate_user_id' => $trainingRequest->user_id,
                    'course_id'         => $trainingRequest->course_id,
                    'code'              => $code,
                    'max_uses'          => $trainingRequest->jumlah_peserta,
                    'used_count'        => 0,
                    'target_kategori'   => $user->kategori_pensiun,
                ]);

                // Catatan: CorporateVoucherObserver akan otomatis mengirim notifikasi "Voucher Berhasil Dibuat!"
                $trainingRequest->update([
                    'status'     => TrainingRequest::LUNAS,
                    'voucher_id' => $voucher->id,
                ]);
            });

            return response()->json(['redirect' => route("{$routePrefix}.pembayaran-berhasil", $trainingRequest->request_id)]);
        } catch (\Exception $e) {
            \Log::error('Error in finalizeOfflinePayment for request_id=' . $trainingRequest->request_id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan saat memproses pembayaran.'], 500);
        }
    }

    // =================================================================
    // FINISH — redirect setelah pembayaran publik (non-hybrid)
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

        if ($transaction->status === 'success') {
            return redirect()->route('payment.success', $course->slug);
        }

        if (
            in_array($transactionStatus, ['settlement', 'capture']) ||
            $request->query('flag') === 'success'
        ) {
            // Selesaikan pembayaran secara terpusat untuk semua tipe user
            $this->selesaikanPembayaran($transaction);

            // Ganti status transaksi pending lainnya menjadi failed
            Transaction::where('user_id', $transaction->user_id)
                ->where('course_id', $transaction->course_id)
                ->where('status', 'pending')
                ->where('id', '!=', $transaction->id)
                ->update(['status' => 'failed']);

            return redirect()->route('payment.success', $course->slug);
        }

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
    // 4. CHECKOUT KORPORAT & INSTANSI (Hybrid/Online)
    // =================================================================
    public function checkoutKorporat(Request $request, $slug)
    {
        $user            = Auth::user();
        $course          = Course::with('category')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('slug', $slug)
            ->firstOrFail();

        // Ambil review asli untuk "Apa Kata Mereka"
        $reviews = \App\Models\Review::with('user')
            ->where('course_id', $course->id)
            ->latest()
            ->get()
            ->map(function ($review) {
                return [
                    'name'       => $review->user->name ?? 'Peserta',
                    'profession' => $review->user->kategori_pensiun === 'asn'
                        ? 'ASN/TNI/Polri'
                        : ($review->user->kategori_pensiun === 'korporat'
                            ? 'Karyawan Korporat'
                            : 'Peserta Publik'),
                    'text'       => $review->comment ?? '',
                    'rating'     => $review->rating,
                ];
            });

        $jumlahPeserta   = max(1, (int) $request->query('qty', 1));
        $hargaPerPeserta = (int) $course->price;
        $nominalTotal    = $hargaPerPeserta * $jumlahPeserta;

        // Gunakan config() bukan env() langsung
        $this->setMidtransConfig();

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

        // Render halaman sesuai kategori user (korporat atau asn/instansi)
        $viewFolder    = $user->kategori_pensiun === 'asn' ? 'Instansi' : 'Korporat';
        $componentName = $user->kategori_pensiun === 'asn' ? 'DetailPembelianOnline' : 'DetailPembelianOnline';
        $routeName     = $user->kategori_pensiun === 'asn' ? 'instansi.beli-pelatihan' : 'korporat.beli-pelatihan';

        return Inertia::render("{$viewFolder}/{$componentName}", [
            'course'            => $course,
            'transaction'       => $transaction,       // PENTING: dibutuhkan frontend untuk nomor_transaksi
            'snapToken'         => $snapToken,
            'midtransClientKey' => config('services.midtrans.client_key'),
            'quantity'          => $jumlahPeserta,
            'backHref'          => route($routeName),
            'reviews'           => $reviews,
            'ratingAverage'     => $course->reviews_avg_rating ?? 0,
            'totalReviews'      => $course->reviews_count ?? 0,
        ]);
    }

    // =================================================================
    // 5. WEBHOOK MIDTRANS — berjalan di PRODUKSI (dengan ngrok/domain publik)
    // =================================================================
    public function webhook(Request $request)
    {
        $payload = $request->all();
        \Log::info('MIDTRANS WEBHOOK', $payload);

        $orderId           = $payload['order_id'];
        $statusCode        = $payload['status_code'];
        $grossAmount       = $payload['gross_amount'];
        $signatureKey      = $payload['signature_key'];
        $transactionStatus = $payload['transaction_status'];
        $fraudStatus       = $payload['fraud_status'] ?? 'accept';

        // 1. Verifikasi Signature menggunakan config()
        $serverKey = config('services.midtrans.server_key');
        $hashed    = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        if ($hashed !== $signatureKey) {
            \Log::warning("Midtrans webhook: Invalid signature for order_id {$orderId}");
            return response()->json(['status' => 'error', 'message' => 'Invalid signature'], 403);
        }

        // 2. Proses berdasarkan prefix order_id
        if (Str::startsWith($orderId, 'OFFLINE-')) {
            // Transaksi offline (TrainingRequest)
            $parts     = explode('-', $orderId);
            $requestId = $parts[1] ?? null;

            if (!$requestId) {
                \Log::error("Midtrans webhook: Invalid OFFLINE- order_id format: {$orderId}");
                return response()->json(['status' => 'error', 'message' => 'Invalid order ID format'], 400);
            }

            $trainingRequest = TrainingRequest::find($requestId);

            if (!$trainingRequest) {
                \Log::warning("Midtrans webhook: TrainingRequest not found for request_id {$requestId}");
                return response()->json(['status' => 'error', 'message' => 'Training request not found'], 404);
            }

            $isSuccess = in_array($transactionStatus, ['settlement', 'capture']) && $fraudStatus !== 'deny';
            $isFailed  = in_array($transactionStatus, ['cancel', 'deny', 'expire']);

            if ($isSuccess) {
                $this->_finalizeTrainingRequestPayment($trainingRequest);
                \Log::info("Midtrans webhook: TrainingRequest {$requestId} finalized.");
            } elseif ($isFailed && $trainingRequest->status === TrainingRequest::MENUNGGU_BAYAR) {
                $trainingRequest->update(['status' => TrainingRequest::KADALUARSA]);
                \Log::info("Midtrans webhook: TrainingRequest {$requestId} marked as KADALUARSA.");
            }
        } else {
            // Transaksi online/hybrid (INV-)
            $transaction = Transaction::where('nomor_transaksi', $orderId)->first();

            if (!$transaction) {
                \Log::warning("Midtrans webhook: Transaction not found for order_id {$orderId}");
                return response()->json(['status' => 'ok']); // return 200 agar Midtrans tidak retry terus
            }

            $isSuccess = in_array($transactionStatus, ['settlement', 'capture']) && $fraudStatus !== 'deny';
            $isFailed  = in_array($transactionStatus, ['cancel', 'deny', 'expire']);

            if ($isSuccess) {
                $this->selesaikanPembayaran($transaction);
                \Log::info("Midtrans webhook: Transaction {$orderId} finalized via selesaikanPembayaran.");
            } elseif ($isFailed && $transaction->status === 'pending') {
                $transaction->update(['status' => 'failed']);
                \Log::info("Midtrans webhook: Transaction {$orderId} marked as failed.");
            }
        }

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

    /**
     * Helper privat untuk finalisasi TrainingRequest (tandai LUNAS + generate voucher).
     * Idempotent: hanya proses jika status MENUNGGU_BAYAR.
     */
    private function _finalizeTrainingRequestPayment(TrainingRequest $trainingRequest): void
    {
        if ($trainingRequest->status !== TrainingRequest::MENUNGGU_BAYAR) {
            return;
        }

        $user = \App\Models\User::find($trainingRequest->user_id);
        if (!$user) {
            \Log::error("User not found for training request ID: {$trainingRequest->request_id}");
            return;
        }

        $trainingRequest->load('course');
        $voucherPrefix = $user->kategori_pensiun === 'asn' ? 'ASN-' : 'CORP-';

        DB::transaction(function () use ($trainingRequest, $user, $voucherPrefix) {
            do {
                $code = $voucherPrefix . strtoupper(Str::random(8));
            } while (CorporateVoucher::where('code', $code)->exists());

            $voucher = CorporateVoucher::create([
                'corporate_user_id' => $trainingRequest->user_id,
                'course_id'         => $trainingRequest->course_id,
                'code'              => $code,
                'max_uses'          => $trainingRequest->jumlah_peserta,
                'used_count'        => 0,
                'target_kategori'   => $user->kategori_pensiun,
            ]);

            // Catatan: CorporateVoucherObserver otomatis mengirim notifikasi "Voucher Berhasil Dibuat!" saat voucher di-create.
            // Tidak perlu lagi memanggil Notification::send manual di sini untuk menghindari notifikasi ganda.

            $trainingRequest->update([
                'status'     => TrainingRequest::LUNAS,
                'voucher_id' => $voucher->id,
            ]);
        });
    }
}
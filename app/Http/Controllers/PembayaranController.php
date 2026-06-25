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
use App\Models\CorporateVoucher;

class PembayaranController extends Controller
{
    // Tampilkan halaman konfirmasi setelah berhasil daftar kelas GRATIS
    public function konfirmasiGratis($slug)
    {
        $user = Auth::user();

        $course = Course::with('category')->where('slug', $slug)->firstOrFail();

        // Pastikan user memang sudah terdaftar di kelas gratis ini
        $enrolled = Enrollment::where('user_id', $user->user_id)
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->exists();

        if (! $enrolled) {
            return redirect()->route('beli-pelatihan')
                ->with('error', 'Anda belum terdaftar pada kelas ini.');
        }

        return Inertia::render('Pelatihan/KonfirmasiPendaftaranGratis', [
            'course' => $course,
        ]);
    }

    // =================================================================
    // 1. FUNGSI UNTUK MENAMPILKAN HALAMAN CHECKOUT & BIKIN TOKEN MIDTRANS
    // =================================================================
    // Jangan lupa tambahkan (Request $request) untuk menangkap parameter dari frontend
    public function checkout(Request $request, $slug)
    {
        $user = Auth::user();
        
        // Tarik data kursusnya
        $course = Course::where('slug', $slug)->firstOrFail();

        // 1. TANGKAP QTY DARI REACT (Default 1 kalau tidak ada)
        $jumlahPeserta = (int) $request->query('qty', 1);
        $hargaPerPeserta = (int) $course->price;
        $nominalTotal = $hargaPerPeserta * $jumlahPeserta; // Total yang dibayar ke Midtrans

        // 2. CEK DOUBLE BELI (Hanya berlaku untuk user Publik/ASN)
        // User Korporat bebas beli berkali-kali untuk nambah kuota voucher karyawan
        $sudahBeli = Enrollment::where('user_id', $user->user_id)
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->exists();

        if ($sudahBeli) {
            return redirect()->route('payment.success', $course->slug)
                ->with('success', 'Anda sudah memiliki pelatihan ini.');
        }

        // 3. CEK KELAS GRATIS (Bypass Midtrans)
        if ($nominalTotal == 0) {
            // Kalau Korporat yang klaim gratis, buatkan voucher. Kalau Publik, buatkan enrollment.
            if ($user->kategori_pensiun === 'korporat') {
                \App\Models\CorporateVoucher::create([
                    'corporate_user_id' => $user->user_id,
                    'course_id'         => $course->id,
                    'code'              => 'CORP-' . strtoupper(\Illuminate\Support\Str::random(5)) . '-' . rand(100, 999),
                    'max_uses'          => $jumlahPeserta,
                    'used_count'        => 0,
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

        // 4. SETUP MIDTRANS
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;

        // 5. CEK TRANSAKSI PENDING
        $pendingTransaction = Transaction::where('user_id', $user->user_id)
            ->where('course_id', $course->id)
            ->where('status', 'pending')
            ->first();

        // PENTING: Pastikan qty yang dibeli SAMA dengan qty di transaksi pending. 
        // Kalau beda (misal awalnya klik beli 1, terus balik lagi klik beli 5), batalkan yang lama!
        if ($pendingTransaction && $pendingTransaction->snap_token && now()->lessThan($pendingTransaction->batas_waktu) && $pendingTransaction->jumlah_peserta === $jumlahPeserta) {
            $snapToken = $pendingTransaction->snap_token;
            $transaction = $pendingTransaction;
        } else {
            if ($pendingTransaction) {
                // Ubah status yang lama jadi failed biar rapi di DB
                $pendingTransaction->update(['status' => 'failed']);
            }

            $orderId = 'INV-' . date('Ymd') . '-' . rand(1000, 9999);

            $params = [
                'transaction_details' => [
                    'order_id'     => $orderId,
                    'gross_amount' => $nominalTotal, // Pakai nominal total
                ],
                'customer_details' => [
                    'first_name' => $user->name,
                    'email'      => $user->email,
                ],
                'item_details' => [
                    [
                        'id'       => $course->id,
                        'price'    => $hargaPerPeserta, // Harga satuan
                        'quantity' => $jumlahPeserta,   // Jumlah yang dibeli
                        'name'     => mb_substr($course->title, 0, 49),
                    ]
                ],
                'expiry' => [
                    'unit'     => 'minute',
                    'duration' => 3 
                ],
                'callbacks' => [
                    'finish'  => 'http://127.0.0.1:8000/payment/finish',
                    'error'   => 'http://127.0.0.1:8000/payment/finish',
                    'pending' => 'http://127.0.0.1:8000/payment/finish',
                ]
            ];

            $snapToken = Snap::getSnapToken($params);

            // Simpan transaksi baru dengan kolom yang baru kita buat
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

        // 6. Lempar semua data ke halaman React
        return Inertia::render('Payment/DetailPembelian', [
            'course'            => $course,
            'transaction'       => $transaction,
            'snapToken'         => $snapToken,
            'midtransClientKey' => env('MIDTRANS_CLIENT_KEY')
        ]);
    }

    // =================================================================
    // 2. FUNGSI UNTUK MENANGKAP LEMPARAN BALIK DARI POP-UP MIDTRANS
    // =================================================================
    public function finish(Request $request)
    {
        $orderId = $request->query('order_id');
        $transactionStatus = $request->query('transaction_status');
        $statusCode = $request->query('status_code');

        $transaction = Transaction::where('nomor_transaksi', $orderId)->first();

        if (!$transaction) {
            return redirect()->route('beli-pelatihan')
                ->with('error', 'Transaksi tidak ditemukan.');
        }

        $course = \App\Models\Course::find($transaction->course_id);
        
        if (!$course) {
            return redirect()->route('beli-pelatihan');
        }

        // SATPAM ANTI-REFRESH: Cegah proses double jika transaksi sudah sukses
        if ($transaction->status === 'success') {
            return redirect()->route('payment.success', $course->slug);
        }

        if (
            $transactionStatus === 'settlement' || 
            $transactionStatus === 'capture' || 
            $statusCode == 200 || 
            $request->query('flag') === 'success'
        ) {
            
            $transaction->update(['status' => 'success']);
            $buyer = \App\Models\User::find($transaction->user_id);

            // LOGIKA KORPORAT
            if ($buyer && $buyer->kategori_pensiun === 'korporat') {
                $voucherLama = \App\Models\CorporateVoucher::where('corporate_user_id', $buyer->user_id)
                    ->where('course_id', $transaction->course_id)
                    ->first();

                if ($voucherLama) {
                    $voucherLama->increment('max_uses', $transaction->jumlah_peserta);
                } else {
                    \App\Models\CorporateVoucher::create([
                        'corporate_user_id' => $buyer->user_id,
                        'course_id'         => $transaction->course_id,
                        'code'              => 'CORP-' . strtoupper(\Illuminate\Support\Str::random(5)) . '-' . rand(100, 999),
                        'max_uses'          => $transaction->jumlah_peserta,
                        'used_count'        => 0,
                    ]);
                }
            } 
            // LOGIKA PUBLIK / ASN
            else {
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

        // JIKA EXPIRED / GAGAL
        if ($transactionStatus === 'expire' || $transactionStatus === 'cancel' || $transactionStatus === 'deny' || $statusCode == 407) {
            $transaction->update(['status' => 'failed']);

            return redirect()->route('payment.detail', $course->slug)
                ->with('error', 'Waktu pembayaran habis atau dibatalkan.');
        }

        // JIKA PENDING
        return redirect()->route('payment.detail', $course->slug)
            ->with('info', 'Pembayaran sedang diproses.');
    }
    // =================================================================
    // 4. FUNGSI UNTUK NAMPILIN HALAMAN STRUK SUKSES (DINAMIS ASLI)
    // =================================================================
    public function success($slug)
    {
        $user = Auth::user();
        
        // REVISI DI SINI: Tambahkan 'category' ke dalam fungsi with()
        $course = Course::with(['modules.materials', 'category'])->where('slug', $slug)->firstOrFail();
        
        $course->setAttribute('firstLessonId', $this->firstMaterialId($course));
        
        // Cari data transaksi sukses terbaru milik user untuk kursus ini
        $transaction = Transaction::where('user_id', $user->user_id)
            ->where('course_id', $course->id)
            ->where('status', 'success')
            ->latest()
            ->first();

        // ==========================================
        // LOGIKA PENGECEKAN KATEGORI AKUN
        // ==========================================
        if ($user && $user->kategori_pensiun === 'korporat') {
            $voucher = \App\Models\CorporateVoucher::where('corporate_user_id', $user->user_id)
                ->where('course_id', $course->id)
                ->latest()
                ->first();

            return Inertia::render('Korporat/PembayaranBerhasilKorporat', [
                'course' => $course,
                'transaction' => $transaction,
                'voucher' => $voucher,
            ]);
        }

        // Lempar ke halaman sukses umum (Publik / ASN)
        return Inertia::render('Payment/PembayaranBerhasil', [
            'course' => $course,
            'transaction' => $transaction,
        ]);
    }

    // =================================================================
    // 3. FUNGSI WEBHOOK (NOTIFIKASI BELAKANG LAYAR DARI SERVER MIDTRANS)
    // =================================================================
    public function webhook(Request $request)
    {
        // Nanti kita racik logika notifikasinya di sini
        // Sementara kasih respons OK dulu biar server Midtrans seneng
        return response()->json(['status' => 'ok']);
    }

    private function learningRouteParams(Course $course): array
    {
        $params = ['id' => $course->id];
        $firstMaterialId = $this->firstMaterialId($course);

        if ($firstMaterialId) {
            $params['lesson'] = $firstMaterialId;
        }

        return $params;
    }

    private function firstMaterialId(Course $course): mixed
    {
        $course->loadMissing('modules.materials');

        return $course->modules
            ->flatMap(fn ($module) => $module->materials)
            ->first()
            ?->id;
    }
}

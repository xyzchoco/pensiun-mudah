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

class PembayaranController extends Controller
{
    // =================================================================
    // 1. FUNGSI UNTUK MENAMPILKAN HALAMAN CHECKOUT & BIKIN TOKEN MIDTRANS
    // =================================================================
    public function checkout($slug)
    {
        $user = Auth::user();
        
        // Tarik data kursusnya
        $course = Course::where('slug', $slug)->firstOrFail();

        // 1. CEK DOUBLE BELI: Apakah user udah punya kelas ini?
        $sudahBeli = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->exists();

        if ($sudahBeli) {
            return redirect()->route('pelatihan.kelas', $course->id)
                ->with('success', 'Lu udah punya kelas ini bos, langsung gass belajar!');
        }

        // 2. CEK KELAS GRATIS: Kalau harga Rp0, bypass langsung kasih akses
        if ($course->price == 0) {
            Enrollment::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'tanggal_daftar' => now(),
                'status' => 'active',
            ]);

            return redirect()->route('pelatihan.kelas', $course->id)
                ->with('success', 'Pelatihan gratis berhasil diklaim!');
        }

        // 3. SETUP MIDTRANS
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;

        // 4. CEK TRANSAKSI PENDING
        $pendingTransaction = Transaction::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'pending')
            ->first();

        if ($pendingTransaction && $pendingTransaction->snap_token && now()->lessThan($pendingTransaction->batas_waktu)) {
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
                    'order_id' => $orderId,
                    'gross_amount' => (int) $course->price,
                ],
                'customer_details' => [
                    'first_name' => $user->name,
                    'email' => $user->email,
                ],
                'item_details' => [
                    [
                        'id' => $course->id,
                        'price' => (int) $course->price,
                        'quantity' => 1,
                        'name' => mb_substr($course->title, 0, 49),
                    ]
                ],
                // REVISI DI SINI BOS: start_time dihapus & duration dinaikin ke 3 menit
                'expiry' => [
                    'unit' => 'minute',
                    'duration' => 3 
                ],
                'callbacks' => [
                    'finish' => 'http://127.0.0.1:8000/payment/finish',
                    'error' => 'http://127.0.0.1:8000/payment/finish',
                    'pending' => 'http://127.0.0.1:8000/payment/finish',
                ]
            ];

            $snapToken = Snap::getSnapToken($params);

            // Simpan transaksi baru fresh ke database
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'nomor_transaksi' => $orderId,
                'nominal' => $course->price,
                'status' => 'pending',
                'snap_token' => $snapToken,
                'batas_waktu' => now()->addMinutes(3), // Di DB set 3 menit juga
            ]);
        }

        // 5. Lempar semua data ke halaman React
        return Inertia::render('Payment/DetailPembelian', [
            'course' => $course,
            'transaction' => $transaction,
            'snapToken' => $snapToken,
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

        // REVISI: Pakai first() biasa biar gak nendang layar 404 kalau data dihapus manual
        $transaction = Transaction::where('nomor_transaksi', $orderId)->first();

        // Proteksi: Jika transaksi gak ketemu di DB (karena abis dihapus pas testing)
        if (!$transaction) {
            return redirect()->route('beli-pelatihan')
                ->with('error', 'Transaksi lama tidak ditemukan atau sudah dihapus bos. Silakan buat pesanan baru.');
        }

        $course = \App\Models\Course::find($transaction->course_id);
        
        if (!$course) {
            return redirect()->route('beli-pelatihan');
        }

        // 1. Kalau Berhasil Bayar
        if ($transactionStatus === 'settlement' || $transactionStatus === 'capture') {
            return redirect()->route('payment.success', $course->slug);
        }

        // 2. Kalau Expire / Gagal / Cancel
        if ($transactionStatus === 'expire' || $transactionStatus === 'cancel' || $transactionStatus === 'deny') {
            // Update status di DB lu jadi failed
            $transaction->update(['status' => 'failed']);

            // Tendang balik ke halaman pembelian dengan pesan error
            return redirect()->route('payment.detail', $course->slug)
                ->with('error', 'Waktu pembayaran lu udah habis (expired) bos. Silakan klik tombol bayar lagi buat dapet invoice baru!');
        }

        return redirect()->route('beli-pelatihan');
    }

    // =================================================================
    // 4. FUNGSI UNTUK NAMPILIN HALAMAN STRUK SUKSES (DINAMIS ASLI)
    // =================================================================
    public function success($slug)
    {
        $user = Auth::user();
        
        // Cari data kursus berdasarkan slug di URL
        $course = Course::where('slug', $slug)->firstOrFail();
        
        // Cari data transaksi sukses terbaru milik user untuk kursus ini
        $transaction = Transaction::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'success')
            ->latest()
            ->first();

        // Lempar data aslinya ke React
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
}
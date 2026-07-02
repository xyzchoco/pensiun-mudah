<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\TrainingRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;
use Midtrans\Config;
use Illuminate\Support\Facades\Storage;
use Midtrans\Snap;

class TrainingRequestController extends Controller
{
    /**
     * Titik masuk TUNGGAL dari tombol "Konfirmasi Jadwal".
     * Sistem yang nentuin: ini request custom (perlu approval)
     * atau pakai default (langsung bayar).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id'       => ['required', 'exists:courses,id'],
            'tanggal_mulai'   => ['required', 'date', 'after_or_equal:today'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'jam_mulai'       => ['nullable'],
            'jam_selesai'     => ['nullable'],
            'jumlah_peserta'  => ['required', 'integer', 'min:1'],
            'usulan_lokasi'   => ['nullable', 'string', 'max:255'],
        ]);

        $course = Course::findOrFail($validated['course_id']);

        // === Hitung harga di BACKEND (jangan percaya angka frontend) ===
        $estimasi = $course->price * $validated['jumlah_peserta'];

        // === INTI: deteksi custom vs default ===
        $isCustom = $this->isCustomBooking($course, $validated);

        // === Buat record buat KEDUA jalur (biar admin tetap bisa konfirmasi jadwal) ===
        $trainingRequest = TrainingRequest::create([
            'user_id'         => Auth::id(),
            'course_id'       => $course->id,
            'tanggal_mulai'   => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'jam_mulai'       => $validated['jam_mulai'] ?? null,
            'jam_selesai'     => $validated['jam_selesai'] ?? null,
            'jumlah_peserta'  => $validated['jumlah_peserta'],
            'usulan_lokasi'   => $validated['usulan_lokasi'] ?? null,
            'estimasi_harga'  => $estimasi,
            'is_custom'       => $isCustom,
            'status'          => $isCustom
                ? TrainingRequest::MENUNGGU_APPROVAL   // Jalur B → wajib approval admin
                : TrainingRequest::MENUNGGU_BAYAR,     // Jalur A → skip approval, langsung bayar
        ]);

        // === PERCABANGAN: ini "dimana"-nya logika jalur A vs B ===
        if ($isCustom) {
            // ┌─ JALUR B (request custom) ─────────────────────────┐
            Notification::send(
                $trainingRequest->user_id,
                'Request Sedang Ditinjau',
                "Request jadwal untuk \"{$course->title}\" sedang ditinjau admin. Kami akan mengabari hasilnya.",
                'info'
            );

            return response()->json([
                'is_custom'    => true,
                'redirect_url' => route('instansi.request-ditinjau', $trainingRequest->request_id),
            ]);
            // └────────────────────────────────────────────────────┘
        }

        // ┌─ JALUR A (korporat/ASN TIDAK request) ──────────────────┐
        // Nggak perlu approval → langsung lempar ke pembayaran (Midtrans Snap)
        
        // Setup Midtrans
        Config::$serverKey    = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized  = true;
        Config::$is3ds        = true;

        $user = Auth::user();
        $orderId = 'OFFLINE-' . $trainingRequest->request_id . '-' . time();
        
        $params = [
            'transaction_details' => [
                'order_id'     => $orderId,
                'gross_amount' => (int) $estimasi,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email'      => $user->email,
            ],
            'item_details' => [[
                'id'       => $course->id,
                'price'    => (int) $course->price,
                'quantity' => $validated['jumlah_peserta'],
                'name'     => mb_substr($course->title, 0, 49),
            ]],
            'expiry' => ['unit' => 'minute', 'duration' => 60],
        ];

        $snapToken = Snap::getSnapToken($params);

        return response()->json([
            'is_custom'  => false,
            'snap_token' => $snapToken,
            'request_id' => $trainingRequest->request_id,
        ]);
        // └──────────────────────────────────────────────────────────┘
    }

    /**
     * Halaman "Sedang Ditinjau" (status request jalur B).
     */
    public function statusRequest(TrainingRequest $trainingRequest)
    {
        abort_if($trainingRequest->user_id !== Auth::id(), 403);

        $trainingRequest->load('course');

        return Inertia::render('Instansi/RequestDitinjau', [
            'request' => [
                'id'               => $trainingRequest->request_id,
                'course_title'     => $trainingRequest->course->title,
                'tanggal_mulai'    => $trainingRequest->tanggal_mulai?->locale('id')->isoFormat('D MMM YYYY'),
                'tanggal_selesai'  => $trainingRequest->tanggal_selesai?->locale('id')->isoFormat('D MMM YYYY'),
                'lokasi'           => $trainingRequest->usulan_lokasi ?: 'Lokasi default',
                'jumlah_peserta'   => $trainingRequest->jumlah_peserta,
                'total'            => (int) $trainingRequest->estimasi_harga,
                'status'           => $trainingRequest->status,
                'alasan_penolakan' => $trainingRequest->alasan_penolakan,
            ],
            'payHref'  => route('instansi.pembayaran', $trainingRequest->request_id),
            'backHref' => route('instansi.beli-pelatihan'),
        ]);
    }

        /**
     * Tampilkan halaman "Pilih Jadwal".
     * Nerima Course lewat route-model-binding, load semua data dari DB.
     */
    public function pembayaranBerhasil(TrainingRequest $trainingRequest)
    {
        abort_if($trainingRequest->user_id !== Auth::id(), 403);

        $trainingRequest->load(['course', 'voucher']);
        $voucher = $trainingRequest->voucher;

        return Inertia::render('Instansi/PembayaranBerhasilInstansi', [
            'course' => [
                'id'        => $trainingRequest->course->id,
                'title'     => $trainingRequest->course->title,
                'thumbnail' => $trainingRequest->course->thumbnail,
            ],

            'transaction' => [
                'jumlah_peserta' => $trainingRequest->jumlah_peserta,
                'total'          => (int) $trainingRequest->estimasi_harga,
            ],

            'voucher' => $voucher ? [
                'code'       => $voucher->code,
                'max_uses'   => $voucher->max_uses,
                'used_count' => $voucher->used_count,
            ] : null,

            'lihatVoucherHref' => route('instansi.pelatihan-dibeli'),
        ]);
    }

    /**
     * Tampilkan halaman "Pilih Jadwal".
     * Nerima Course lewat route-model-binding, load semua data dari DB.
     */
    public function pilihJadwal(Request $request, Course $course)
    {
        // Jumlah peserta dibawa dari tombol "Beli Sekarang" (default 1)
        $quantity = max(1, (int) $request->query('qty', 1));

        // Tanggal default kursus (buat pre-fill kalender + patokan deteksi custom)
        $defaultDate = $course->tanggal_default
            ? Carbon::parse($course->tanggal_default)->format('Y-m-d')
            : null;

        return Inertia::render('Instansi/PilihJadwal', [
            // === Data kursus (dari DB, bukan query string) ===
            'course' => [
                'id'    => $course->id,
                'slug'  => $course->slug,
                'title' => $course->title,
                'price' => (int) $course->price,   // harga asli buat hitung total di UI
            ],

            // === Nilai default buat pre-fill form ===
            // Frontend bandingin input user vs nilai ini buat nentuin "berubah/nggak"
            'defaultDate'     => $defaultDate,
            'defaultLocation' => $course->lokasi_default ?? 'Lokasi akan dikonfirmasi',
            'eventTime'       => $course->jadwal_default ?? 'Jadwal akan dikonfirmasi',

            // === Jumlah peserta awal ===
            'quantity' => $quantity,

            // === Navigasi ===
            'backHref' => route('instansi.pelatihan-offline.detail', $course->slug),

            // === Endpoint submit (tombol "Konfirmasi Jadwal") ===
            'submitUrl' => route('instansi.request-jadwal'),

            // === Midtrans Client Key ===
            'midtransClientKey' => env('MIDTRANS_CLIENT_KEY'),
        ]);
    }

    

    /**
     * Deteksi apakah instansi mengubah tanggal/lokasi dari default kursus.
     *   true  = custom  → butuh approval admin (Jalur B)
     *   false = default → langsung bayar        (Jalur A)
     */
    private function isCustomBooking(Course $course, array $data): bool
    {
        // 1. User nulis usulan lokasi → pasti custom
        if (! empty($data['usulan_lokasi'])) {
            return true;
        }

        // 2. Kursus punya tanggal default & user milih tanggal beda → custom
        if ($course->tanggal_default) {
            $default = $course->tanggal_default->format('Y-m-d');
            if ($data['tanggal_mulai'] !== $default) {
                return true;
            }
        }

        // Selain itu → pakai default → Jalur A
        return false;
    }
}
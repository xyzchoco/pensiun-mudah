<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\TrainingRequest;
use App\Models\Notification;
use App\Models\SesiSeminar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Midtrans\Config;
use Midtrans\Snap;

class TrainingRequestController extends Controller
{
    /**
     * Helper: tentukan prefix route berdasarkan kategori user.
     * korporat → 'korporat', asn → 'instansi'
     */
    private function routePrefix(): string
    {
        $kategori = Auth::user()->kategori_pensiun ?? 'instansi';
        return $kategori === 'korporat' ? 'korporat' : 'instansi';
    }

    /**
     * Status yang dianggap "masih berjalan" (belum selesai/ditolak).
     * Selama masih salah satu dari ini, user TIDAK boleh bikin request baru
     * untuk kursus yang sama.
     */
    private function activeStatuses(): array
    {
        return [
            TrainingRequest::MENUNGGU_APPROVAL,
            TrainingRequest::MENUNGGU_BAYAR,
        ];
    }

    /**
     * Tandai request menunggu_bayar yang sudah basi (> 24 jam) menjadi kadaluarsa.
     */
    private function expireStalePendingPayments(int $userId, int $courseId): void
    {
        TrainingRequest::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->where('status', TrainingRequest::MENUNGGU_BAYAR)
            ->whereNotNull('payment_due_at')
            ->where('payment_due_at', '<', now())
            ->update(['status' => TrainingRequest::KADALUARSA]);
    }

    /**
     * Cari request pending milik user untuk kursus tertentu (kalau ada).
     */
    private function findPendingRequest(int $courseId): ?TrainingRequest
    {
        return TrainingRequest::where('user_id', Auth::id())
            ->where('course_id', $courseId)
            ->whereIn('status', $this->activeStatuses())
            ->latest()
            ->first();
    }

    /**
     * URL tujuan sesuai status request (mau bayar / masih ditinjau).
     * Diperbarui: untuk status MENUNGGU_BAYAR, tidak lagi mengarahkan ke halaman pembayaran offline,
     * melainkan akan ditangani langsung via Midtrans Snap popup di frontend.
     */
    private function resolvePendingUrl(TrainingRequest $req): string
    {
        $prefix = $this->routePrefix();
        return route("{$prefix}.request-ditinjau", $req->request_id);
    }

    /**
     * Generate Midtrans Snap token untuk TrainingRequest yang statusnya MENUNGGU_BAYAR.
     */
    public function snapTokenOffline(TrainingRequest $trainingRequest)
    {
        // Guard kepemilikan
        abort_if($trainingRequest->user_id !== Auth::id(), 403);

        $prefix = $this->routePrefix();

        // Guard status: hanya boleh kalau status MENUNGGU_BAYAR
        if ($trainingRequest->status !== TrainingRequest::MENUNGGU_BAYAR) {
            return response()->json([
                'redirect_url' => route("{$prefix}.request-ditinjau", $trainingRequest->request_id),
                'message'      => 'Status pengajuan tidak lagi menunggu pembayaran.',
            ], 409);
        }

        Config::$serverKey    = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized  = true;
        Config::$is3ds        = true;

        $user    = Auth::user();
        $orderId = 'OFFLINE-' . $trainingRequest->request_id . '-' . time();
        $grossAmount = (int) $trainingRequest->estimasi_harga;

        $params = [
            'transaction_details' => [
                'order_id'     => $orderId,
                'gross_amount' => $grossAmount,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email'      => $user->email,
            ],
            'item_details' => [[
                'id'       => $trainingRequest->course_id,
                'price'    => (int) ($grossAmount / $trainingRequest->jumlah_peserta), // Harga per peserta
                'quantity' => $trainingRequest->jumlah_peserta,
                'name'     => mb_substr($trainingRequest->course->title, 0, 49),
            ]],
            'expiry' => ['unit' => 'minute', 'duration' => 60],
        ];

        $snapToken = Snap::getSnapToken($params);

        return response()->json([
            'snap_token'  => $snapToken,
            'request_id'  => $trainingRequest->request_id,
            'finalize_url' => route("{$prefix}.pembayaran.finalize", $trainingRequest->request_id),
        ]);
    }

    /**
     * Titik masuk TUNGGAL dari tombol "Konfirmasi Jadwal".
     * Sistem yang nentuin: request custom (perlu approval) atau default (langsung bayar).
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
        $this->expireStalePendingPayments(Auth::id(), $course->id);

        // 🔒 GUARD: Cek apakah jadwal sudah lewat
        if ($course->tanggal_default) {
            $eventDateTime = Carbon::parse($course->tanggal_default, 'Asia/Jakarta')->endOfDay();
            if ($eventDateTime->isPast()) {
                return response()->json(['message' => 'Jadwal kelas ini sudah berlalu, pendaftaran ditutup.'], 422);
            }
        }

        $prefix = $this->routePrefix();

        // 🔒 GUARD: cegah request dobel untuk kursus yang sama selama masih aktif.
        $pending = $this->findPendingRequest($course->id);
        if ($pending) {
            return response()->json([
                'is_custom'    => (bool) $pending->is_custom,
                'redirect_url' => $pending->status === TrainingRequest::MENUNGGU_BAYAR
                                    ? route("{$prefix}.pilih-jadwal", $course->slug)
                                    : $this->resolvePendingUrl($pending),
                'message'      => 'Anda sudah memiliki pengajuan yang sedang diproses untuk kelas ini.',
            ], 409);
        }

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
            'payment_due_at'  => $isCustom ? null : now()->addMinutes(90),
        ]);

        // === PERCABANGAN: logika jalur A vs B ===
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
                'redirect_url' => route("{$prefix}.request-ditinjau", $trainingRequest->request_id),
            ]);
            // └────────────────────────────────────────────────────┘
        }

        // ┌─ JALUR A (korporat/ASN TIDAK request) ──────────────────┐
        // Nggak perlu approval → langsung lempar ke pembayaran (Midtrans Snap)
        Config::$serverKey    = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized  = true;
        Config::$is3ds        = true;

        $user    = Auth::user();
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
            'finalize_url' => route("{$prefix}.pembayaran.finalize", $trainingRequest->request_id),
        ]);
        // └──────────────────────────────────────────────────────────┘
    }

    /**
     * Halaman "Sedang Ditinjau" (status request jalur B).
     */
    public function statusRequest(TrainingRequest $trainingRequest)
    {
        abort_if($trainingRequest->user_id !== Auth::id(), 403);

        $prefix = $this->routePrefix();
        $trainingRequest->load('course');

        // Render komponen sesuai kategori user
        $component = $prefix === 'korporat' ? 'Korporat/RequestDitinjau' : 'Instansi/RequestDitinjau';

        return Inertia::render($component, [
            'request' => [
                'id'               => $trainingRequest->request_id,
                'course_title'     => $trainingRequest->course->title,
                'thumbnail'        => $trainingRequest->course->thumbnail,
                'tanggal_mulai'    => $trainingRequest->tanggal_mulai?->locale('id')->isoFormat('D MMM YYYY'),
                'tanggal_selesai'  => $trainingRequest->tanggal_selesai?->locale('id')->isoFormat('D MMM YYYY'),
                'lokasi'           => $trainingRequest->usulan_lokasi ?: 'Lokasi akan dikonfirmasi',
                'jumlah_peserta'   => $trainingRequest->jumlah_peserta,
                'total'            => (int) $trainingRequest->estimasi_harga,
                'status'           => $trainingRequest->status,
                'alasan_penolakan' => $trainingRequest->alasan_penolakan,
            ],
            'payHref'           => route("{$prefix}.pembayaran", $trainingRequest->request_id),
            'backHref'          => route("{$prefix}.beli-pelatihan"),
            'midtransClientKey' => config('midtrans.client_key'),
        ]);
    }

    /**
     * Halaman "Pembayaran Berhasil" — tampilkan kode voucher + info kelas.
     */
    public function pembayaranBerhasil(TrainingRequest $trainingRequest)
    {
        abort_if($trainingRequest->user_id !== Auth::id(), 403);

        $prefix = $this->routePrefix();
        $trainingRequest->load(['course', 'voucher']);
        $voucher = $trainingRequest->voucher;

        // Render komponen sesuai kategori user
        $component = $prefix === 'korporat' ? 'Korporat/PembayaranBerhasilKorporat' : 'Instansi/PembayaranBerhasilInstansi';

        return Inertia::render($component, [
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
            'lihatVoucherHref' => route("{$prefix}.pelatihan-dibeli"),
        ]);
    }

    /**
     * Tampilkan halaman "Pilih Jadwal".
     * Nerima Course lewat route-model-binding, load semua data dari DB.
     */
    public function pilihJadwal(Request $request, Course $course)
    {
        $prefix = $this->routePrefix();

        // Jumlah peserta dibawa dari tombol "Beli Sekarang" (default 1)
        $quantity = max(1, (int) $request->query('qty', 1));

        // Tanggal default kursus (buat pre-fill kalender + patokan deteksi custom)
        $defaultDate = $course->tanggal_default
            ? Carbon::parse($course->tanggal_default)->format('Y-m-d')
            : null;

        $defaultEndDate = $course->tanggal_selesai_default
            ? Carbon::parse($course->tanggal_selesai_default)->format('Y-m-d')
            : null;

        $this->expireStalePendingPayments(Auth::id(), $course->id);

        // 🔎 Kalau user udah punya request pending untuk kursus ini,
        // kirim info-nya biar frontend bisa ganti tombol jadi "Lihat Status"/"Bayar".
        $pending = $this->findPendingRequest($course->id);

        $isEventPassed = false;
        $eventStartAt = null;

        if ($course->tanggal_default) {
            $eventDateTime = Carbon::parse($course->tanggal_default, 'Asia/Jakarta')->endOfDay();
            $isEventPassed = $eventDateTime->isPast();
            $eventStartAt = $eventDateTime->toISOString();
        }

        // Render komponen sesuai kategori user
        $component = $prefix === 'korporat' ? 'Korporat/PilihJadwal' : 'Instansi/PilihJadwalInstansi';

        return Inertia::render($component, [
            // === Data kursus (dari DB, bukan query string) ===
            'course' => [
                'id'    => $course->id,
                'slug'  => $course->slug,
                'title' => $course->title,
                'price' => (int) $course->price,
            ],

            // === Nilai default buat pre-fill form ===
            'defaultDate'     => $defaultDate,
            'defaultEndDate'  => $defaultEndDate,
            'defaultLocation' => $course->lokasi_default ?? 'Lokasi akan dikonfirmasi',
            'eventTime'       => $course->jadwal_default ?? 'Jadwal akan dikonfirmasi',

            // === Jumlah peserta awal ===
            'quantity' => $quantity,

            // === Info request yang sedang berjalan (null kalau nggak ada) ===
            'pendingRequest' => $pending ? [
                'id'             => $pending->request_id,
                'status'         => $pending->status,
                'jumlah_peserta' => $pending->jumlah_peserta,
                'total'          => (int) $pending->estimasi_harga,
                'statusUrl'      => route("{$prefix}.request-ditinjau", $pending->request_id),
                'snapTokenUrl'   => $pending->status === TrainingRequest::MENUNGGU_BAYAR
                                      ? route("{$prefix}.pembayaran.snap-token", $pending->request_id)
                                      : null,
            ] : null,

            // === Status event ===
            'isEventPassed' => $isEventPassed,
            'eventStartAt'  => $eventStartAt,

            // === Navigasi ===
            'backHref' => route("{$prefix}.pelatihan-offline.detail", $course->slug),

            // === Endpoint submit (tombol "Konfirmasi Jadwal") ===
            'submitUrl' => route("{$prefix}.request-jadwal"),

            // === Midtrans Client Key ===
            'midtransClientKey' => config('services.midtrans.client_key'),
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

        // 1b. User nulis usulan jam_mulai atau jam_selesai → pasti custom
        if (! empty($data['jam_mulai']) || ! empty($data['jam_selesai'])) {
            return true;
        }

        // 2. Kursus punya tanggal default & user milih tanggal mulai beda → custom
        if ($course->tanggal_default) {
            $default = $course->tanggal_default->format('Y-m-d');
            if ($data['tanggal_mulai'] !== $default) {
                return true;
            }
        }

        // 3. Kursus punya tanggal selesai default & user milih tanggal selesai beda → custom
        if ($course->tanggal_selesai_default) {
            $defaultEnd = $course->tanggal_selesai_default->format('Y-m-d');
            if ($data['tanggal_selesai'] !== $defaultEnd) {
                return true;
            }
        } else {
            // Fallback: jika tanggal_selesai_default null, bandingkan tanggal_selesai terhadap tanggal_default
            if ($course->tanggal_default) {
                $defaultFallback = $course->tanggal_default->format('Y-m-d');
                if ($data['tanggal_selesai'] !== $defaultFallback) {
                    return true;
                }
            }
        }

        // Selain itu → pakai default → Jalur A
        return false;
    }

    public function pilihJadwalHybrid(Request $request, Course $course)
    {
        $prefix = $this->routePrefix();

        // Tanggal default kursus (jika ada)
        $defaultDate = $course->tanggal_default
            ? Carbon::parse($course->tanggal_default)->format('Y-m-d')
            : null;

        $defaultEndDate = $course->tanggal_selesai_default
            ? Carbon::parse($course->tanggal_selesai_default)->format('Y-m-d')
            : null;

        $component = $prefix === 'korporat' ? 'Korporat/PilihJadwalHybrid' : 'Instansi/PilihJadwalHybridInstansi';

        return Inertia::render($component, [
            'course' => [
                'id'    => $course->id,
                'slug'  => $course->slug,
                'title' => $course->title,
                'price' => (int) $course->price,
            ],
            'defaultDate'     => $defaultDate,
            'defaultEndDate'  => $defaultEndDate,
            'defaultLocation' => $course->lokasi_default ?? 'Lokasi akan dikonfirmasi',
            'eventTime'       => $course->jadwal_default ?? 'Jadwal akan dikonfirmasi',
        ]);
    }

    public function storeJadwalHybrid(Request $request)
    {
        $request->validate([
            'course_id'       => 'required|exists:courses,id',
            'tanggal_mulai'   => 'required|date',
            'tanggal_selesai' => 'nullable|date',
            'usulan_lokasi'   => 'required|string|max:255',
            'judul'           => 'nullable|string|max:255',
            'jam'             => 'nullable|string|max:255',
            'catatan'         => 'nullable|string',
        ]);

        $course = Course::findOrFail($request->course_id);
        $user = Auth::user();

        // 🔒 GUARD: Cegah spam request jika masih pending atau sudah disetujui
        $existingRequest = SesiSeminar::where('course_id', $course->id)
            ->where('requester_id', $user->user_id)
            ->whereIn('status', ['pending', 'disetujui'])
            ->first();

        if ($existingRequest) {
            $statusText = $existingRequest->status === 'pending' ? 'sedang ditinjau oleh Admin' : 'sudah disetujui';
            return back()->withErrors([
                'course_id' => "Anda sudah mengajukan usulan jadwal untuk kelas ini yang {$statusText}."
            ]);
        }

        // Cari voucher korporat/instansi untuk mendapatkan jumlah kapasitas terdaftar
        $voucher = \App\Models\CorporateVoucher::where('corporate_user_id', $user->user_id)
            ->where('course_id', $course->id)
            ->first();

        $kapasitas = $voucher ? $voucher->max_uses : 999;

        // Simpan ke sesi_seminar (langsung masuk ke admin panel sesi seminar)
        $judul = $request->judul ?: 'Sesi Praktik Hybrid - ' . $course->title;
        $jam = $request->jam ?: '08:00';
        $catatan = $request->catatan ?: 'Diusulkan oleh ' . ($user->corporateProfile?->nama_perusahaan ?: $user->name);

        $sesi = SesiSeminar::create([
            'course_id'         => $course->id,
            'judul'             => $judul,
            'tanggal'           => $request->tanggal_mulai,
            'jam'               => Carbon::parse($jam)->format('H:i:s'),
            'lokasi'            => $request->usulan_lokasi,
            'kapasitas_ruangan' => $kapasitas,
            'catatan'           => $catatan,
            'status'            => 'pending',
            'requester_id'      => $user->user_id,
        ]);

        $prefix = $this->routePrefix();

        // format tanggal untuk kemudahan display halaman sukses
        $formattedDate = Carbon::parse($request->tanggal_mulai)->locale('id')->isoFormat('D MMMM YYYY');

        return response()->json([
            'success'      => true,
            'redirect_url' => route("{$prefix}.jadwal-berhasil", [
                'tanggal' => $formattedDate,
                'jam'     => $jam . ' WIB',
                'lokasi'  => $request->usulan_lokasi,
            ]),
        ]);
    }
}
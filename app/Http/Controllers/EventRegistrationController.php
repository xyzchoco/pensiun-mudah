<?php

namespace App\Http\Controllers;

use App\Mail\EventKonfirmasiMail;
use App\Models\Notification;
use App\Models\Webinar;
use App\Models\WebinarRegistration;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class EventRegistrationController extends Controller
{
    /**
     * POST /event/{webinar}/daftar  →  event.daftar.store
     * Mendaftarkan user yang sedang login ke event (gratis, tanpa pembayaran).
     */
    public function daftar(Request $request, Webinar $webinar): RedirectResponse
    {
        // 1. Pastikan event ter-publish
        abort_unless($webinar->is_published, 404);

        $user   = Auth::user();
        $userId = $user->user_id;

        // 2. Cek event belum mulai (pendaftaran ditutup saat event dimulai)
        if ($webinar->mulai_at && Carbon::parse($webinar->mulai_at)->isPast()) {
            return back()->with('error', 'Pendaftaran sudah ditutup.');
        }

        // 3. Cek duplikat (status aktif, bukan 'batal')
        $sudahDaftar = WebinarRegistration::where('webinar_id', $webinar->id)
            ->where('user_id', $userId)
            ->where('status', '!=', WebinarRegistration::STATUS_BATAL)
            ->exists();

        if ($sudahDaftar) {
            return back()->with('info', 'Anda sudah terdaftar pada event ini.');
        }

        // 4. Transaksi anti-overbooking dengan row-level lock
        try {
            DB::transaction(function () use ($webinar, $userId) {
                // Kunci baris webinar agar hitung kuota akurat saat request bersamaan
                $locked = Webinar::whereKey($webinar->id)->lockForUpdate()->firstOrFail();

                $terpakai = WebinarRegistration::where('webinar_id', $locked->id)
                    ->where('status', '!=', WebinarRegistration::STATUS_BATAL)
                    ->count();

                if ((int) $locked->kapasitas > 0 && $terpakai >= (int) $locked->kapasitas) {
                    throw new RuntimeException('KUOTA_PENUH');
                }

                // updateOrCreate menangani user yang pernah 'batal' lalu daftar lagi
                WebinarRegistration::updateOrCreate(
                    ['webinar_id' => $locked->id, 'user_id' => $userId],
                    ['status' => WebinarRegistration::STATUS_TERDAFTAR, 'registered_at' => now()]
                );
            });
        } catch (RuntimeException $e) {
            if ($e->getMessage() === 'KUOTA_PENUH') {
                return back()->with('error', 'Maaf, kuota event sudah penuh.');
            }
            throw $e;
        }

        // 5. Kirim email konfirmasi (queue → butuh queue:work jalan)
        Mail::to($user->email)->queue(new EventKonfirmasiMail($webinar, $user));

        // 6. Kirim notifikasi in-app ke user
        Notification::send(
            $userId,
            'Pendaftaran Event Berhasil',
            "Anda berhasil terdaftar pada event \"{$webinar->judul}\".",
            'success',
            'Lihat Event',
            route('event.detail', $webinar->id)
        );

        // 7. Redirect ke halaman konfirmasi
        return redirect()->route('event.berhasil')
            ->with('success', 'Pendaftaran berhasil!');
    }

    /**
     * GET /event/pendaftaran-berhasil  →  event.berhasil
     */
    public function berhasil(): Response
    {
        return Inertia::render('Event/PendaftaranBerhasil', [
            'message' => session('success'),
        ]);
    }
}
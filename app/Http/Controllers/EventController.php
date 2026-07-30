<?php

namespace App\Http\Controllers;

use App\Models\Webinar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        $webinars = Webinar::where('is_published', true)
            ->orderBy('tanggal')
            ->get();
        return Inertia::render('Event/SemuaEvent', ['events' => $webinars]);
    }

    public function show(Webinar $webinar): Response
    {
        abort_unless($webinar->is_published, 404);

        $related = Webinar::where('is_published', true)
            ->where('kategori', $webinar->kategori)
            ->where('id', '!=', $webinar->id)
            ->whereDate('tanggal', '>=', now()->toDateString())
            ->limit(3)
            ->get();

        if (!Auth::check()) {
            return Inertia::render('Landing/DetailEventLanding', [
                'event' => $webinar->append(['registered_count', 'sisa_kuota', 'status_label', 'image_url', 'mulai_at']),
                'relatedEvents' => $related->map->append(['image_url']),
                'loginRedirect' => route('login', ['redirect' => route('event.daftar', $webinar->id)]),
            ]);
        }

        $sudahDaftar = $webinar->registrations()
            ->where('user_id', Auth::user()->user_id)
            ->where('status', '!=', 'batal')
            ->exists();

        return Inertia::render('Event/DetailEvent', [
            'event' => $webinar,
            'relatedEvents' => $related,
            'sudahDaftar' => $sudahDaftar,
            'daftarHref' => route('event.daftar', $webinar->id),
        ]);
    }

    public function formDaftar(Webinar $webinar): Response
    {
        abort_unless($webinar->is_published, 404);

        $sudahDaftar = $webinar->registrations()
            ->where('user_id', Auth::user()->user_id)
            ->where('status', '!=', 'batal')
            ->exists();

        return Inertia::render('Event/DaftarEvent', [
            'event'      => $webinar,
            'sudahDaftar'=> $sudahDaftar,
            'daftarHref' => route('event.daftar.store', $webinar->id),
        ]);
    }
}

<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Notification;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? $request->user()->load('corporateProfile') : null,
            ],
            // Flash session untuk notifikasi setelah redirect
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
            // ✅ Jumlah notif belum dibaca — tersedia di SEMUA halaman (buat badge bell)
            'unreadNotifCount' => fn () => $request->user()
                ? Notification::where('user_id', $request->user()->user_id)
                    ->where('is_read', false)
                    ->count()
                : 0,
        ];
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $userId = Auth::id(); // ✅ FIX 1: definisikan $userId (sebelumnya undefined)

        // 1. Ambil data dulu (biar tampilan masih nunjukin status asli)
        $notifications = Notification::where('user_id', $userId)
            ->latest()
            ->take(20)
            ->get()
            ->map(fn ($n) => [
                'id'          => $n->notif_id,
                'title'       => $n->judul,
                'body'        => $n->isi,
                'type'        => $n->type,
                'is_read'     => $n->is_read,
                'time'        => $n->created_at->diffForHumans(),
                'actionLabel' => $n->action_label,
                'actionUrl'   => $n->action_url,
            ]);

        // 2. Tandai semua yang belum dibaca jadi sudah dibaca
        Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        // 3. Render — unreadNotifCount otomatis jadi 0 → red dot hilang
        return Inertia::render('Notifikasi', [
            'notifications' => $notifications,
        ]);
    } // ✅ FIX 2: cuma SATU kurung penutup index() (tadi ada 2)

    // Tandai 1 notif dibaca
    public function markRead($id)
    {
        Notification::where('notif_id', $id)
            ->where('user_id', Auth::id())
            ->update(['is_read' => true]);

        return back();
    }

    // Tandai SEMUA dibaca (tombol "Tandai semua dibaca" di UI)
    public function markAllRead()
    {
        Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return back();
    }
}
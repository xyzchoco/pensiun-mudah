<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DashboardBanner;
use App\Models\Webinar;
use App\Models\Enrollment;
use App\Models\LearningActivity;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // =========================================================
        // 0. ROUTING PER KATEGORI — redirect DULU sebelum ngitung apa-apa.
        //    Korporat & ASN punya dashboard + controller sendiri
        //    (query "pernah dibeli" mereka berbasis voucher, bukan Enrollment),
        //    jadi jangan render inline pakai $data punya publik.
        // =========================================================
        if ($user->kategori_pensiun === 'korporat') {
            return redirect()->route('korporat.dashboard');
        }

        if ($user->kategori_pensiun === 'asn') {
            return redirect()->route('instansi.dashboard'); // ✅ nama route, bukan nama komponen
        }

        // =========================================================
        // Mulai sini KHUSUS user publik.
        // =========================================================
        $kategoriUser = trim(strtolower($user->kategori_pensiun));

        $banners = DashboardBanner::where('is_active', true)->latest()->get();
        $events  = Webinar::where('is_published', true)->latest()->take(3)->get();

        // 1. Enrollment aktif (hanya kursus yang visible untuk kategori user)
        $activeCourses = Enrollment::where('user_id', $user->user_id)
            ->where('progress_persen', '<', 100)
            ->whereHas('course', function ($query) use ($kategoriUser) {
                $query->where('is_visible_' . $kategoriUser, true);
            })
            ->with('course')
            ->latest('updated_at')
            ->take(3)
            ->get()
            ->map(function ($enrollment) {
                // Proteksi kalau relasi course kosong/terhapus
                if (! $enrollment->course) {
                    return null;
                }

                $progress = $enrollment->progress_persen;

                if ($progress >= 75) {
                    $barColor     = 'bg-[#008740]';
                    $percentColor = 'text-[#008740]';
                } elseif ($progress >= 40) {
                    $barColor     = 'bg-[#9CA3AF]';
                    $percentColor = 'text-[#6B7280]';
                } else {
                    $barColor     = 'bg-[#B45309]';
                    $percentColor = 'text-[#B45309]';
                }

                return [
                    'id'           => $enrollment->id,
                    'title'        => $enrollment->course->title,
                    'progress'     => $progress,
                    'barColor'     => $barColor,
                    'percentColor' => $percentColor,
                    'emoji'        => '📖',
                ];
            })
            ->filter()  // buang null
            ->values();

        // 2. Grafik aktivitas belajar 7 hari terakhir
        $chartData = [];
        $dayNames  = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

        for ($i = 6; $i >= 0; $i--) {
            $date    = Carbon::today()->subDays($i);
            $dayName = $dayNames[$date->dayOfWeek]; // 0=Min, 6=Sab

            $activity = LearningActivity::where('user_id', $user->user_id)
                ->whereDate('tanggal', $date->format('Y-m-d'))
                ->first();

            $hours     = $activity ? round($activity->durasi_jam, 1) : 0;
            $barHeight = min($hours * 5, 20); // maks 20 biar nggak overflow

            $chartData[] = [
                'day'   => $dayName,
                'val'   => $barHeight,
                'label' => $hours > 0 ? $hours . 'h' : '0h',
            ];
        }

        // 3. Statistik Kursus
        $totalKursus = Enrollment::where('user_id', $user->user_id)->count();

        $kursusBulanIni = Enrollment::where('user_id', $user->user_id)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // 4. Statistik Jam Belajar
        $totalJamBelajar = round(
            LearningActivity::where('user_id', $user->user_id)->sum('durasi_jam')
        );

        $startOfWeek = now()->startOfWeek()->format('Y-m-d');
        $jamBelajarMingguIni = round(
            LearningActivity::where('user_id', $user->user_id)
                ->where('tanggal', '>=', $startOfWeek)
                ->sum('durasi_jam')
        );

        // 5. Statistik Sertifikat
        $totalSertifikat = Enrollment::where('user_id', $user->user_id)
            ->where('progress_persen', '>=', 100)
            ->count();

        $sertifikatProses = Enrollment::where('user_id', $user->user_id)
            ->where('progress_persen', '>', 0)
            ->where('progress_persen', '<', 100)
            ->count();

        // 6. Kirim ke halaman Dashboard publik
        return Inertia::render('Dashboard', [
            'banners'             => $banners,
            'events'              => $events,
            'activeCourses'       => $activeCourses,
            'chartData'           => $chartData,
            'totalKursus'         => $totalKursus,
            'kursusBulanIni'      => $kursusBulanIni,
            'totalJamBelajar'     => $totalJamBelajar,
            'jamBelajarMingguIni' => $jamBelajarMingguIni,
            'totalSertifikat'     => $totalSertifikat,
            'sertifikatProses'    => $sertifikatProses,
        ]);
    }
}
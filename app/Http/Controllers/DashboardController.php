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
use App\Models\LearningProgress;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $user = Auth::user();
        $kategoriUser = $user ? trim(strtolower($user->kategori_pensiun)) : null;

        $banners = DashboardBanner::where('is_active', true)->latest()->get();
        $events  = Webinar::where('is_published', true)->latest()->take(3)->get();

        // 1. FIX JITU: Tarik data enrollment aktif (HANYA yang kategori kursusnya COCOK dengan kategori user)
        $activeCourses = Enrollment::where('user_id', $user->user_id)
            ->where('progress_persen', '<', 100)
            ->whereHas('course', function ($query) use ($kategoriUser) {
                $query->where('is_visible_' . $kategoriUser, true);
            })
            ->with('course') // Load data kursusnya setelah difilter ketat
            ->latest('updated_at')
            ->take(3)
            ->get()
            ->map(function ($enrollment) {
                // Jika data relasi kosong/terhapus, beri proteksi agar tidak error objek kosong
                if (!$enrollment->course) return null;

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
            ->filter() // Membuang nilai null jika ada data relasi yang miss
            ->values();

        // 2. Grafik aktivitas belajar 7 hari terakhir dari database
        $chartData = [];
        $dayNames  = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

        for ($i = 6; $i >= 0; $i--) {
            $date    = Carbon::today()->subDays($i);
            $dayName = $dayNames[$date->dayOfWeek]; // 0=Min, 6=Sab

            // Ambil aktivitas nyata dari database
            $activity = LearningActivity::where('user_id', $user->user_id)
                ->whereDate('tanggal', $date->format('Y-m-d'))
                ->first();

            // Durasi dalam jam, default 0 kalau belum ada
            $hours = $activity ? round($activity->durasi_jam, 1) : 0;

            // Tinggi bar UI (maks 20 agar tidak overflow)
            $barHeight = min($hours * 5, 20);

            $chartData[] = [
                'day'   => $dayName,
                'val'   => $barHeight,
                'label' => $hours > 0 ? $hours . 'h' : '0h',
            ];
        }

        // 3. Hitung Statistik Kursus
        $totalKursus = Enrollment::where('user_id', $user->user_id)->count();

        $kursusBulanIni = Enrollment::where('user_id', $user->user_id)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // 4. Hitung Statistik Jam Belajar
        $totalJamBelajar = round(LearningActivity::where('user_id', $user->user_id)->sum('durasi_jam'));
        
        $startOfWeek = now()->startOfWeek()->format('Y-m-d');
        $jamBelajarMingguIni = round(LearningActivity::where('user_id', $user->user_id)
            ->where('tanggal', '>=', $startOfWeek)
            ->sum('durasi_jam'));

        // 5. Hitung Statistik Sertifikat (Selesai & Dalam Proses)
        $totalSertifikat = Enrollment::where('user_id', $user->user_id)
            ->where('progress_persen', '>=', 100)
            ->count();

        $sertifikatProses = Enrollment::where('user_id', $user->user_id)
            ->where('progress_persen', '>', 0)
            ->where('progress_persen', '<', 100)
            ->count();

        // 6. Gabung semua variabel ke dalam satu array $data
        $data = [
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
        ];

        // 7. Arahin halamannya sesuai kategori
        switch ($user->kategori_pensiun) {
            case 'korporat':
                // Kalau korporat ada dashboard sendiri
                return redirect()->route('korporat.dashboard');

            case 'asn':
                return Inertia::render('Instansi/DashboardInstansi', $data);

            case 'publik':
            default:
                // Mengirim FULL $data ke halaman Dashboard publik
                return Inertia::render('Dashboard', $data);
        }
    }
}
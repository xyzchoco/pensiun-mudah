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
use App\Traits\HasRecentActivities;
use App\Models\User as AppModelsUser;

class DashboardController extends Controller
{
    use HasRecentActivities;

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

        // 5.5. Hitung Target Kesiapan Pensiun (Mental, Keuangan, Kesehatan, Sosial) secara Dinamis
        $enrollmentsForReadiness = Enrollment::where('user_id', $user->user_id)
            ->with('course.category')
            ->get();

        $aspectProgress = [
            'mental' => [],
            'keuangan' => [],
            'kesehatan' => [],
            'sosial' => []
        ];

        foreach ($enrollmentsForReadiness as $enrollment) {
            if (!$enrollment->course) {
                continue;
            }

            $course = $enrollment->course;
            $category = $course->category;

            $titleLower = strtolower($course->title);
            $categoryNameLower = $category ? strtolower($category->nama) : '';
            $categoryDescLower = $category ? strtolower($category->deskripsi) : '';

            $aspect = null;

            // 1. Check title keywords first
            if (str_contains($titleLower, 'keuangan') || str_contains($titleLower, 'finansial') || str_contains($titleLower, 'investasi') || str_contains($titleLower, 'dana') || str_contains($titleLower, 'uang') || str_contains($titleLower, 'saham') || str_contains($titleLower, 'reksadana')) {
                $aspect = 'keuangan';
            } elseif (str_contains($titleLower, 'mental') || str_contains($titleLower, 'jiwa') || str_contains($titleLower, 'psikologi') || str_contains($titleLower, 'emosi') || str_contains($titleLower, 'stres') || str_contains($titleLower, 'stress') || str_contains($titleLower, 'mindfulness') || str_contains($titleLower, 'bahagia') || str_contains($titleLower, 'spiritual') || str_contains($titleLower, 'religi') || str_contains($titleLower, 'batin')) {
                $aspect = 'mental';
            } elseif (str_contains($titleLower, 'kesehatan') || str_contains($titleLower, 'sehat') || str_contains($titleLower, 'fisik') || str_contains($titleLower, 'olahraga') || str_contains($titleLower, 'diet') || str_contains($titleLower, 'penyakit') || str_contains($titleLower, 'medis') || str_contains($titleLower, 'tubuh') || str_contains($titleLower, 'nutrisi') || str_contains($titleLower, 'gizi')) {
                $aspect = 'kesehatan';
            } elseif (str_contains($titleLower, 'sosial') || str_contains($titleLower, 'komunitas') || str_contains($titleLower, 'hobi') || str_contains($titleLower, 'wirausaha') || str_contains($titleLower, 'umkm') || str_contains($titleLower, 'usaha') || str_contains($titleLower, 'berkebun') || str_contains($titleLower, 'tani') || str_contains($titleLower, 'ternak') || str_contains($titleLower, 'hubungan') || str_contains($titleLower, 'keluarga') || str_contains($titleLower, 'komunikasi')) {
                $aspect = 'sosial';
            }

            // 2. Check category name & description if no title match
            if (!$aspect && $category) {
                if (str_contains($categoryNameLower, 'keuangan') || str_contains($categoryNameLower, 'investasi') || str_contains($categoryNameLower, 'finansial')) {
                    $aspect = 'keuangan';
                } elseif (str_contains($categoryNameLower, 'mental') || str_contains($categoryDescLower, 'mental')) {
                    $aspect = 'mental';
                } elseif (str_contains($categoryNameLower, 'kesehatan') || str_contains($categoryNameLower, 'sehat') || str_contains($categoryNameLower, 'fisik')) {
                    $aspect = 'kesehatan';
                } elseif (str_contains($categoryNameLower, 'wirausaha') || str_contains($categoryNameLower, 'sosial') || str_contains($categoryNameLower, 'komunitas') || str_contains($categoryNameLower, 'kewirausahaan')) {
                    $aspect = 'sosial';
                }
            }

            // 3. Fallbacks based on category ID or general defaults
            if (!$aspect) {
                if ($category) {
                    if ($category->id == 1) { // Kesehatan Pensiun
                        $aspect = 'kesehatan';
                    } elseif ($category->id == 2) { // Keuangan pensiun
                        $aspect = 'keuangan';
                    } elseif ($category->id == 3) { // Kewirausahaan
                        $aspect = 'sosial';
                    } else {
                        $aspect = 'sosial';
                    }
                } else {
                    $aspect = 'sosial';
                }
            }

            $aspectProgress[$aspect][] = $enrollment->progress_persen;
        }

        $targetPensiunData = [];
        foreach ($aspectProgress as $key => $values) {
            if (empty($values)) {
                $targetPensiunData[$key] = 0;
            } else {
                $targetPensiunData[$key] = (int) round(array_sum($values) / count($values));
            }
        }
        $targetPensiunData['overall'] = (int) round(array_sum($targetPensiunData) / count($targetPensiunData));

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
            'targetPensiun'       => $targetPensiunData,
            'recentActivities'    => $this->recentActivities($user),
        ]);
    }
}
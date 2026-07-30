<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\LearningProgress;
use App\Models\LearningActivity;
use App\Services\LearningService;

class LearningController extends Controller
{
    /**
     * Catat progres materi yang diselesaikan user, lalu hitung ulang
     * progress kursus lewat LearningService (satu sumber rumus).
     */
    public function catatProgres(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'course_id'    => 'required|integer',
            'module_id'    => 'required|integer',
            'material_id'  => 'required|integer|min:1',
            'durasi_menit' => 'required|numeric|min:0',
        ]);

        // Ambil material untuk cek durasi aslinya
        $material = \App\Models\Material::find($request->material_id);
        if (!$material) {
            return redirect()->back()->with('error', 'Materi tidak ditemukan.');
        }

        // 1. Catat / update progres materi (akumulasi durasi belajar)
        $progress = LearningProgress::firstOrNew([
            'user_id'     => $user->user_id,
            'course_id'   => $request->course_id,
            'material_id' => $request->material_id,
        ]);

        $progress->module_id      = $request->module_id; // pastikan module_id selalu benar
        $progress->durasi_belajar = ($progress->durasi_belajar ?? 0) + $request->durasi_menit;
        
        // Hanya tandai as_completed jika durasi yang dilaporkan >= 80% dari durasi materi asli
        // Ini mencegah user menandai done hanya dengan membuka materi sebentar
        $materialDuration = $material->durasi_menit ?? 0;
        $reportedDuration = $request->durasi_menit ?? 0;
        $completionThreshold = $materialDuration > 0 ? ($materialDuration * 0.8) : 1;
        
        if ($reportedDuration >= $completionThreshold) {
            $progress->is_completed = true;
            $progress->persentase   = 100;
        } else {
            // Kalau durasi belum cukup, hitung persentase
            $progress->is_completed = false;
            $progress->persentase   = $materialDuration > 0 ? (int) round(($reportedDuration / $materialDuration) * 100) : 0;
        }
        
        $progress->last_accessed  = Carbon::now();
        $progress->save();

        // 2. Update aktivitas harian (buat grafik belajar mingguan)
        $activity = LearningActivity::firstOrNew([
            'user_id' => $user->user_id,
            'tanggal' => Carbon::today(),
        ]);
        $activity->durasi_jam = ($activity->durasi_jam ?? 0) + ($request->durasi_menit / 60);
        $activity->modul      = 'Modul: ' . $request->module_id;
        $activity->save();

        // 3. Recompute progress kursus (materi + kuis) → update enrollments
        app(LearningService::class)->recomputeProgress($user->user_id, $request->course_id);

        return redirect()->back()->with('success', 'Progress tersimpan!');
    }

    /**
     * Halaman detail aktivitas belajar (durasi mingguan + riwayat materi).
     */
    public function detailAktivitas(Request $request)
    {
        $user = auth()->user();

        $activities = LearningActivity::where('user_id', $user->user_id)
            ->orderBy('tanggal')
            ->get();

        $weeklyDuration = $activities->map(function ($act) {
            return [
                'day'        => Carbon::parse($act->tanggal)->format('D'),
                'percentage' => min(($act->durasi_jam / 5) * 100, 100),
            ];
        });

        $learnedMaterials = $activities->map(function ($act) {
            return [
                'day'       => Carbon::parse($act->tanggal)->isoFormat('dddd'),
                'course'    => $act->modul ?? 'Modul Umum',
                'topic'     => $act->topik ?? 'Materi Dipelajari',
                'duration'  => round($act->durasi_jam * 60) . ' Menit',
                'iconBg'    => 'bg-[#E5F0E9]',
                'iconColor' => 'text-[#006B32]',
            ];
        });

        return inertia('DetailAktivitasPelatihan', [
            'totalHours'       => round($activities->sum('durasi_jam'), 1),
            'weeklyDuration'   => $weeklyDuration,
            'learnedMaterials' => $learnedMaterials,
            'currentPeriod'    => $request->query('period', 7),
        ]);
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\LearningProgress;
use App\Models\LearningActivity;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;

class LearningController extends Controller
{
    public function catatProgres(Request $request)
    {
        $user = auth()->user();
        
        $request->validate([
            'course_id'   => 'required|integer',
            'module_id'   => 'required|integer',
            'material_id' => 'required|integer',
            'durasi_menit'=> 'required|numeric',
        ]);

        // 1. Catat/Update Progres Materi (Sesuai Diagram: last_accessed di sini)
        $progress = LearningProgress::where([
            'user_id'     => $user->user_id,
            'course_id'   => $request->course_id,
            'material_id' => $request->material_id,
        ])->first();

        if ($progress) {
            $progress->durasi_belajar += $request->durasi_menit;
            $progress->is_completed = true;
            $progress->last_accessed = Carbon::now();
            $progress->persentase = 100;
            $progress->save();
        } else {
            LearningProgress::create([
                'user_id'        => $user->user_id,
                'course_id'      => $request->course_id,
                'module_id'      => $request->module_id,
                'material_id'    => $request->material_id,
                'is_completed'   => true,
                'durasi_belajar' => $request->durasi_menit,
                'last_accessed'  => Carbon::now(),
                'persentase'     => 100,
            ]);
        }

        // 2. Update aktivitas harian
        $activity = LearningActivity::firstOrNew([
            'user_id' => $user->user_id, 
            'tanggal' => Carbon::today()
        ]);
        $activity->durasi_jam += ($request->durasi_menit / 60);
        $activity->modul = "Modul: " . $request->module_id; 
        $activity->save();

        // 3. Update Enrollment (Hanya update progress_persen, last_accessed_at dihapus)
        $selesai = LearningProgress::where('user_id', $user->user_id)
            ->where('course_id', $request->course_id)
            ->where('is_completed', true)
            ->count();
            
        $total = 10; 
        
        Enrollment::where('user_id', $user->user_id)
            ->where('course_id', $request->course_id)
            ->update([
                'progress_persen' => round(($selesai / $total) * 100),
                // last_accessed_at dihapus karena tidak ada di desain diagram lu
            ]);

        return redirect()->back()->with('success', 'Progress tersimpan!');
    }

    public function detailAktivitas(Request $request)
{
    $user = auth()->user();

    // AMBIL SEMUA DATA TANPA FILTER APAPUN
    $activities = LearningActivity::where('user_id', $user->user_id)->get();
    //     dd([
    //     'user_id_login' => $user->user_id,
    //     'data_mentah'   => $activities,
    // ]);

    // LOG UNTUK DEBUG
    \Log::info("Data aktivitas user " . $user->user_id . ": " . $activities->count() . " records");

    // Jika kosong, berarti user_id yang login tidak sama dengan user_id di tabel
    if ($activities->isEmpty()) {
        \Log::warning("Data kosong untuk user_id: " . $user->user_id);
    }

    $weeklyDuration = $activities->map(function ($act) {
        return [
            'day' => \Carbon\Carbon::parse($act->tanggal)->format('D'),
            'percentage' => min(($act->durasi_jam / 5) * 100, 100),
        ];
    });

    $learnedMaterials = $activities->map(function ($act) {
        return [
            'day'      => \Carbon\Carbon::parse($act->tanggal)->isoFormat('dddd'),
            'course'   => $act->modul ?? 'Modul Umum',
            'topic'    => $act->topik ?? 'Materi Dipelajari',
            'duration' => round($act->durasi_jam * 60) . ' Menit',
            'iconBg'   => 'bg-[#E5F0E9]',
            'iconColor'=> 'text-[#006B32]',
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
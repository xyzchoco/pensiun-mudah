<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Material;
use App\Models\Enrollment;

class CourseController extends Controller
{
    public function show(Request $request, $id)
    {
        // 1. PENTING: Ambil data kategori user dari session/auth hasil onboarding ('asn', 'publik', 'korporat')
        $user = auth()->user();
        $kategoriUser = $user ? trim(strtolower($user->kategori_pensiun)) : null;

        // 2. QUERY JITU: Cari kursus berdasarkan ID/Slug dengan teknik eager loading yang efisien
        $courseQuery = Course::with(['modules' => function ($query) {
            $query->orderBy('urutan', 'asc')
                  ->with(['materials' => function ($q) {
                      $q->orderBy('urutan', 'asc');
                  }, 'quizzes']);
        }]);

        // Eager load sesiSeminar dan status absensi jika tipe kelas Hybrid/Offline
        if ($user && in_array($courseQuery->first()?->tipe_kelas, ['Hybrid', 'Offline'])) {
            $courseQuery->with(['sesiSeminar' => function ($query) use ($user) {
                $query->where('sesi_seminar.status', 'disetujui')
                ->leftJoin('absensi_seminar', function ($join) use ($user) {
                    $join->on('sesi_seminar.id', '=', 'absensi_seminar.sesi_seminar_id')
                         ->where('absensi_seminar.user_id', '=', $user->user_id);
                })
                ->select('sesi_seminar.*', 'absensi_seminar.status as absensi_status', 'absensi_seminar.waktu_absen');
            }]);
        }

        $course = $courseQuery
        ->where(function ($query) use ($id) {
            if (is_numeric($id)) {
                $query->where('id', $id)->orWhere('slug', $id);
            } else {
                $query->where('slug', $id);
            }
        })
        ->visibleFor($user) // Terapkan scope visibilitas
        ->first();

        // 3. PROTEKSI: Jika user mencoba bypass URL kelas aktor lain, langsung gagalkan secara anggun
        if (!$course) {
            if ($kategoriUser === 'publik') {
                // Redirect publik jika mencoba akses kelas offline/hybrid
                return redirect()->route('courses.index')->with('error', 'Kelas ini tidak tersedia untuk akun Anda.');
            }
            if ($request->is('api/*')) {
                return response()->json([
                    'meta' => ['code' => 404, 'status' => 'error', 'message' => 'Kursus tidak ditemukan atau Anda tidak memiliki hak akses.'],
                    'data' => null
                ], 404);
            }
            abort(404); 
        }

        if ($request->is('api/*')) {
            return response()->json([
                'meta' => ['code' => 200, 'status' => 'success', 'message' => 'Detail kursus berhasil diambil.'],
                'data' => $course
            ]);
        }

        return Inertia::render('DetailPelatihan', [
            'course' => $course,
            'sesiSeminar' => $course->tipe_kelas === 'Online' ? [] : $course->sesiSeminar,
        ]);
    }

    public function markMaterialAsDone(Request $request)
    {
        $validated = $request->validate([
            'material_id' => ['required', 'exists:materials,id'],
        ]);

        $userId = auth()->id();

        if (! $userId) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        // Eager load data module seminim mungkin untuk efisiensi memory
        $material = Material::with('module:id,course_id')
            ->findOrFail($validated['material_id']);

        $courseId = $material->module->course_id;

        // Validasi pendaftaran user di kelas ini
        $enrollment = Enrollment::where([
            'user_id'   => $userId,
            'course_id' => $courseId,
        ])->first();

        if (! $enrollment) {
            return response()->json([
                'message' => 'Anda belum terdaftar di kursus ini.',
            ], 403);
        }

        // Menggunakan updateOrInsert bawaan DB Query Builder untuk speed eksekusi
        DB::table('material_user')->updateOrInsert(
            [
                'user_id' => $userId,
                'material_id' => $material->id,
            ],
            [
                'updated_at' => now(),
            ]
        );

        // Kalkulasi total materi pada course terkait
        $totalMaterials = Material::whereHas(
            'module',
            fn ($query) => $query->where('course_id', $courseId)
        )->count();

        // Hitung materi yang berhasil diselesaikan oleh user aktif
        $completedMaterials = DB::table('material_user')
            ->join('materials', 'materials.id', '=', 'material_user.material_id')
            ->join('modules', 'modules.id', '=', 'materials.module_id')
            ->where('material_user.user_id', $userId)
            ->where('modules.course_id', $courseId)
            ->count();

        // Penghitungan persentase progress
        $progress = $totalMaterials > 0
            ? round(($completedMaterials / $totalMaterials) * 100, 2)
            : 0;

        $enrollment->update(['progress_persen' => $progress]);

        return response()->json([
            'success' => true,
            'message' => 'Progress berhasil diperbarui.',
            'progress' => $progress,
        ]);
    }
}
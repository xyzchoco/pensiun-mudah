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
        // Cari kursus beserta relasinya
        $course = Course::with(['modules' => function ($query) {
            $query->orderBy('urutan', 'asc')
                  ->with(['materials' => function ($q) {
                      $q->orderBy('urutan', 'asc');
                  }, 'quizzes']);
        }])->find($id);

        if (!$course) {
            if ($request->is('api/*')) {
                return response()->json([
                    'meta' => ['code' => 404, 'status' => 'error', 'message' => 'Kursus tidak ditemukan.'],
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

        return Inertia::render('CourseDetail', [
            'course' => $course
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

        $material = Material::with('module:id,course_id')
            ->findOrFail($validated['material_id']);

        $courseId = $material->module->course_id;

        $enrollment = Enrollment::where([
            'user_id'   => $userId,
            'course_id' => $courseId,
        ])->first();

        if (! $enrollment) {
            return response()->json([
                'message' => 'Anda belum terdaftar di kursus ini.',
            ], 403);
        }

        // Insert hanya jika belum pernah selesai
        DB::table('material_user')->updateOrInsert(
            [
                'user_id' => $userId,
                'material_id' => $material->id,
            ],
            [
                'updated_at' => now(),
            ]
        );

        $totalMaterials = Material::whereHas(
            'module',
            fn ($query) => $query->where('course_id', $courseId)
        )->count();

        $completedMaterials = DB::table('material_user')
            ->join('materials', 'materials.id', '=', 'material_user.material_id')
            ->join('modules', 'modules.id', '=', 'materials.module_id')
            ->where('material_user.user_id', $userId)
            ->where('modules.course_id', $courseId)
            ->count();

        $progress = $totalMaterials > 0
            ? round(($completedMaterials / $totalMaterials) * 100, 2)
            : 0;

        $enrollment->update([
            'progress_percentage' => $progress,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Progress berhasil diperbarui.',
            'progress' => $progress,
        ]);
    }
}
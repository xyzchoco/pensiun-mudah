<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class LearningService
{
    public function isModuleCompleted(int $userId, int $courseId, \App\Models\Module $module): bool
    {
        // 1. Cek semua materi di modul ini selesai
        $materialIds = $module->materials->pluck('id')->all();
        $allMaterialsCompleted = true;

        if (!empty($materialIds)) {
            $completedMaterialCount = DB::table('learning_progress')
                ->where('user_id', $userId)
                ->where('course_id', $courseId)
                ->where('module_id', $module->id)
                ->whereIn('material_id', $materialIds)
                ->where('is_completed', true)
                ->distinct()
                ->count('material_id'); // ← titik koma yang hilang

            $allMaterialsCompleted = ($completedMaterialCount === count($materialIds));
        }

        if (!$allMaterialsCompleted) {
            return false;
        }

        // 2. Jika modul punya kuis, cek kuisnya sudah lulus
        $quiz = $module->quizzes->first();
        if ($quiz) {
            return DB::table('quiz_user')
                ->where('user_id', $userId)
                ->where('quiz_id', $quiz->id)
                ->where('is_passed', true)
                ->exists();
        }

        // Jika tidak ada kuis dan semua materi selesai, modul dianggap selesai
        return true;
    }

    public function recomputeProgress(int $userId, int $courseId): void
    {
        $course = Course::with(['modules.materials', 'modules.quizzes'])->findOrFail($courseId);
        $modules = $course->modules->sortBy('urutan')->values();

        $totalSteps = 0;
        $completedSteps = 0;
        $finalQuizPassed = false;

        foreach ($modules as $module) {
            // Hitung langkah materi
            $totalSteps += $module->materials->count();

            $completedMaterialCount = DB::table('learning_progress')
                ->where('user_id', $userId)
                ->where('course_id', $courseId)
                ->where('module_id', $module->id)
                ->whereIn('material_id', $module->materials->pluck('id'))
                ->where('is_completed', true)
                ->distinct()
                ->count('material_id'); // ← diperbaiki (sebelumnya distinct('material_id')->count())

            $completedSteps += $completedMaterialCount;

            // Hitung langkah kuis
            $quiz = $module->quizzes->first();
            if ($quiz) {
                $totalSteps += 1; // Kuis dihitung 1 langkah

                $quizUser = DB::table('quiz_user')
                    ->where('user_id', $userId)
                    ->where('quiz_id', $quiz->id)
                    ->first();

                if ($quizUser && $quizUser->is_passed) {
                    $completedSteps += 1;
                    if ($quiz->is_final) {
                        $finalQuizPassed = true;
                    }
                }
            }
        }

        $progress = $totalSteps > 0 ? (int) round(($completedSteps / $totalSteps) * 100) : 0;
        $progress = max(0, min(100, $progress)); // Clamp 0-100

        // Kursus "selesai" HANYA jika kuis FINAL sudah lulus DAN progress 100%
        $isCourseCompleted = ($progress >= 100 && $finalQuizPassed);

        Enrollment::updateOrCreate(
            ['user_id' => $userId, 'course_id' => $courseId],
            [
                'progress_persen' => $progress,
                'is_completed'    => $isCourseCompleted,
                'tanggal_selesai' => $isCourseCompleted ? now() : null,
                'updated_at'      => now(),
            ]
        );
    }

    public function buildLearningPayload(int $userId, Course $course): array
    {
        $course->loadMissing(['modules.materials', 'modules.quizzes.questions.options']);
        $modules = $course->modules->sortBy('urutan')->values();

        $completedMaterialIds = DB::table('learning_progress')
            ->where('user_id', $userId)
            ->where('course_id', $course->id)
            ->whereNotNull('material_id')
            ->where('is_completed', true)
            ->pluck('material_id')
            ->map(fn($id) => (int) $id)
            ->all();

        $completedQuizIds = DB::table('quiz_user')
            ->where('user_id', $userId)
            ->whereIn('quiz_id', $course->modules->flatMap(fn($m) => $m->quizzes->pluck('id')))
            ->where('is_passed', true)
            ->pluck('quiz_id')
            ->map(fn($id) => (int) $id)
            ->all();

        $prevModuleCompleted = true; // Modul pertama selalu terbuka

        // ===== Bangun data tiap modul =====
        $processedModules = $modules->map(function ($module) use ($userId, $course, $completedMaterialIds, $completedQuizIds, &$prevModuleCompleted) {
            $quiz = $module->quizzes->first();

            $materials = $module->materials->values()->map(function ($material) use ($completedMaterialIds) {
                return [
                    'id'        => $material->id,
                    'title'     => $material->judul,
                    'type'      => $material->tipe,
                    'duration'  => $material->durasi_menit . ' Menit',
                    'video_url' => $material->url_video,
                    'konten'    => $material->konten,
                    'done'      => in_array($material->id, $completedMaterialIds, true),
                ];
            })->all();

            // Penguncian PER USER: modul pertama selalu terbuka,
            // modul ke-N terkunci jika modul ke-(N-1) belum selesai.
            $lockedForUser = !$prevModuleCompleted;

            // Update status untuk iterasi modul berikutnya
            $prevModuleCompleted = $this->isModuleCompleted($userId, $course->id, $module);

            // Modul "selesai" (centang hijau) jika semua materi done DAN kuis (jika ada) done
            $allMaterialsDone = collect($materials)->every(fn($m) => $m['done']);
            $quizDone = $quiz ? in_array($quiz->id, $completedQuizIds, true) : true;
            $moduleDone = $allMaterialsDone && $quizDone;

            return [
                'id'        => $module->id,
                'title'     => $module->judul,
                'subtitle'  => $module->deskripsi,
                'locked'    => $lockedForUser,
                'done'      => $moduleDone,
                'materials' => $materials,
                'lessons'   => $materials, // jaga-jaga kalau frontend nyari nama ini
                'quiz'      => $quiz ? [
                    'id'             => $quiz->id,
                    'title'          => $quiz->judul,
                    'duration'       => $quiz->durasi_menit,
                    'passingScore'   => $quiz->nilai_lulus,
                    'is_final'       => (bool) $quiz->is_final,
                    'done'           => in_array($quiz->id, $completedQuizIds, true),
                    'totalQuestions' => $quiz->total_soal ?: max($quiz->questions->count(), 10),
                    'questions'      => $quiz->questions->values()->map(function ($question) {
                        $options = $question->options->values();
                        return [
                            'id'           => $question->id,
                            'text'         => $question->teks_soal,
                            'options'      => $options->pluck('teks_opsi')->all(),
                            // ⚠️ CATATAN KEAMANAN: correctIndex ini kebaca di browser (bisa dilihat via DevTools).
                            // Penilaian sudah server-side di QuizController, jadi idealnya field ini dihapus.
                            // Gua biarin dulu biar nggak nabrak Kuis.jsx yang mungkin masih pakai.
                            'correctIndex' => max($options->search(fn ($o) => (bool) $o->is_correct), 0),
                        ];
                    })->all(),
                ] : null,
            ];
        })->all();

        // ===== Bangun steps SETELAH processedModules jadi (INI YANG DIPAKAI NontonMateri.jsx) =====
        $steps = [];
        foreach ($processedModules as $mod) {
            foreach ($mod['materials'] as $material) {
                $steps[] = [
                    'type'     => 'material',
                    'id'       => $material['id'],
                    'moduleId' => $mod['id'],
                    'done'     => $material['done'],
                ];
            }
            if ($mod['quiz']) {
                $steps[] = [
                    'type'     => 'quiz',
                    'id'       => $mod['quiz']['id'],
                    'moduleId' => $mod['id'],
                    'quizId'   => $mod['quiz']['id'],
                    'done'     => $mod['quiz']['done'],
                ];
            }
        }

        // ===== firstLessonId: materi pertama di modul terbuka pertama =====
        $firstLessonId = null;
        foreach ($processedModules as $mod) {
            if (!$mod['locked'] && !empty($mod['materials'])) {
                $firstLessonId = $mod['materials'][0]['id'];
                break;
            }
        }

        // ===== nextLessonId: materi belum-selesai pertama (HANYA materi, buat HasilKuis) =====
        $nextLessonId = null;
        foreach ($processedModules as $mod) {
            if ($mod['locked']) {
                continue;
            }
            foreach ($mod['materials'] as $material) {
                if (!$material['done']) {
                    $nextLessonId = $material['id'];
                    break 2;
                }
            }
        }

        $enrollment = Enrollment::where('user_id', $userId)->where('course_id', $course->id)->first();
        $progress = $enrollment ? (int) $enrollment->progress_persen : 0;

        return [
            'course' => [
                'id'            => $course->id,
                'title'         => $course->title,
                'description'   => $course->description,
                'category'      => $course->category?->nama ?? 'Umum',
                'progress'      => $progress,
                'firstLessonId' => $firstLessonId,
                'nextLessonId'  => $nextLessonId,
                'thumbnailUrl'  => $course->thumbnail
                    ? Storage::url(preg_replace('/^public\//', '', $course->thumbnail))
                    : '/images/course-preview.png',
            ],
            'modules'  => $processedModules,
            'progress' => $progress,
            'steps'    => $steps, // ← sekarang KEISI, tombol Selesai bakal hidup
        ];
    }
}
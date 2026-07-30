<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Services\LearningService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    // --- 1. MENYIMPAN HASIL JAWABAN KUIS ---
    public function storeQuizResult(Request $request, $courseId)
    {
        \Log::info('=== QUIZ SUBMIT ===', [
        'quiz_id'       => $request->input('quiz_id'),
        'answers_count' => count($request->input('answers_recap', [])),
        'answers'       => $request->input('answers_recap'),
    ]);

        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Bersihkan session kuis yang lama
        session()->forget('last_quiz_result');

        $quizId         = $request->input('quiz_id');
        $answersRecap   = $request->input('answers_recap', []);

        // Hitung total soal asli dinamis dari database
        $totalQuestions = DB::table('quiz_questions')
            ->where('quiz_id', $quizId)
            ->count();

        if ($totalQuestions === 0) {
            $totalQuestions = count($answersRecap) ?: 1;
        }

        $correctCount   = 0;
        $wrongQuestions = [];
        $indexNoSoal    = 1;

        foreach ($answersRecap as $recap) {
            // FIX BUG NILAI 0: Guard jika user_answer null/kosong
            $userAnswer = $recap['user_answer'] ?? null;

            if (!empty($userAnswer)) {
                // Cek ke DB berdasarkan teks_opsi dan question_id
                $checkOption = DB::table('quiz_options')
                    ->where('quiz_question_id', $recap['question_id'])
                    ->where('teks_opsi', $userAnswer)
                    ->first();

                if ($checkOption && (bool)$checkOption->is_correct === true) {
                    $correctCount++;
                } else {
                    $wrongQuestions[] = $indexNoSoal;
                }
            } else {
                // Jawaban kosong = salah
                $wrongQuestions[] = $indexNoSoal;
            }

            $indexNoSoal++;
        }

        // Kalkulasi nilai akhir skala 100
        $finalScore = (int) round(($correctCount / $totalQuestions) * 100);

        // Ambil data kuis dari DB
        $quizData     = DB::table('quizzes')->where('id', $quizId)->first();
        $passingScore = $quizData ? (int)$quizData->nilai_lulus : 70;
        $isFinal      = $quizData ? (bool)$quizData->is_final : false;

        $timeTakenMinutes = (int)$request->input('time_taken_minutes', 0);

        // Simpan/update ke tabel quiz_user
        \App\Models\QuizUser::updateOrCreate(
            ['user_id' => $userId, 'quiz_id' => $quizId],
            [
                'score'              => $finalScore,
                'is_passed'          => $finalScore >= $passingScore,
                'correct_count'      => $correctCount,
                'total_questions'    => $totalQuestions,
                'time_taken_minutes' => $timeTakenMinutes,
                'wrong_questions'    => $wrongQuestions,
                'updated_at'         => now(),
            ]
        );

        // Setelah menyimpan hasil kuis, recompute progress kursus
        app(LearningService::class)->recomputeProgress($userId, $courseId);

        // Simpan rekap ke session
        session()->put('last_quiz_result', [
            'quiz_id'            => $quizId,
            'score'              => $finalScore,
            'passing_score'      => $passingScore,
            'is_final'           => $isFinal,
            'total_questions'    => $totalQuestions,
            'correct_count'      => $correctCount,
            'time_taken_minutes' => $timeTakenMinutes,
            'wrong_questions'    => $wrongQuestions,
        ]);

        // FIX BUG DATA TIDAK TAMPIL:
        // Gunakan redirect() Laravel biasa agar session terjamin terflush
        // SEBELUM halaman hasil di-render — bukan JSON + client-side router.visit()
        return redirect()->route('kuis.hasil', ['id' => $courseId, 'quiz' => $quizId]);
    }

    // --- 2. MENAMPILKAN HALAMAN HASIL KUIS ---
    public function showQuizResult(Request $request, $courseId)
    {
        $course  = Course::findOrFail($courseId);
        $userId  = auth()->id();
        $quizId  = $request->query('quiz'); // Ambil quiz_id dari query string

        $quizResult = session()->get('last_quiz_result');

        // Fallback: ambil dari DB jika session sudah kosong (misal setelah refresh)
        if (!$quizResult || ($quizId && $quizResult['quiz_id'] != $quizId)) {
            $userQuizQuery = DB::table('quiz_user')
                ->join('quizzes', 'quizzes.id', '=', 'quiz_user.quiz_id')
                ->join('modules', 'modules.id', '=', 'quizzes.module_id')
                ->where('modules.course_id', $courseId)
                ->where('quiz_user.user_id', $userId)
                ->select(
                    'quiz_user.*',
                    'quizzes.nilai_lulus',
                    'quizzes.is_final'
                );
            
            if ($quizId) {
                $userQuizQuery->where('quiz_user.quiz_id', $quizId);
            }

            $latestUserQuiz = $userQuizQuery->latest('quiz_user.updated_at')->first();

            if ($latestUserQuiz) {
                $dbTotalQuestions = DB::table('quiz_questions')
                    ->where('quiz_id', $latestUserQuiz->quiz_id)
                    ->count();

                $dbCorrectCount = (int) round(
                    ($latestUserQuiz->score / 100) * ($dbTotalQuestions ?: 1)
                );

                // FIX BUG #5: Decode wrong_questions dari JSON kolom DB
                $dbWrongQuestions = [];
                if (!empty($latestUserQuiz->wrong_questions)) {
                    $decoded = json_decode($latestUserQuiz->wrong_questions, true);
                    $dbWrongQuestions = is_array($decoded) ? $decoded : [];
                }

                $quizResult = [
                    'quiz_id'            => (int)$latestUserQuiz->quiz_id, // Tambahkan quiz_id
                    'score'              => (int)$latestUserQuiz->score,
                    'passing_score'      => (int)$latestUserQuiz->nilai_lulus,
                    'is_final'           => (bool)$latestUserQuiz->is_final,
                    'total_questions'    => $dbTotalQuestions ?: 4,
                    'correct_count'      => $dbCorrectCount,
                    'time_taken_minutes' => (int)($latestUserQuiz->time_taken_minutes ?? 0),
                    'wrong_questions'    => $dbWrongQuestions,
                ];
            } else {
                // Default kosong jika belum pernah mengerjakan kuis
                $quizResult = [
                    'quiz_id'            => (int)$quizId, // Gunakan quizId dari query string
                    'score'              => 0,
                    'passing_score'      => 70,
                    'is_final'           => false,
                    'total_questions'    => 4,
                    'correct_count'      => 0,
                    'time_taken_minutes' => 0,
                    'wrong_questions'    => [],
                ];
            }
        }

        // Hitung accumulated (rata-rata skor terbaik semua kuis modul di course ini)
        $accumulated = DB::table('quiz_user')
            ->join('quizzes', 'quizzes.id', '=', 'quiz_user.quiz_id')
            ->join('modules', 'modules.id', '=', 'quizzes.module_id')
            ->where('modules.course_id', $courseId)
            ->where('quiz_user.user_id', $userId)
            ->avg('quiz_user.score');
        $accumulated = round($accumulated ?? 0);

        // Ambil payload learning yang lengkap dari LearningService
        $learningService = new LearningService();
        $learningPayload = $learningService->buildLearningPayload($userId, $course);

        // Siapkan riwayat kuis per modul
        $quizHistory = DB::table('quiz_user')
            ->join('quizzes', 'quizzes.id', '=', 'quiz_user.quiz_id')
            ->join('modules', 'modules.id', '=', 'quizzes.module_id')
            ->where('modules.course_id', $courseId)
            ->where('quiz_user.user_id', $userId)
            ->select(
                'modules.judul as module_title',
                'quiz_user.score',
                'quiz_user.is_passed'
            )
            ->orderBy('modules.urutan')
            ->get()
            ->map(function ($item) {
                $item->is_passed = (bool) $item->is_passed;
                return $item;
            })
            ->all();

        return Inertia::render('Pelatihan/HasilKuis', [
            'learning'     => $learningPayload,
            'quizResult'   => array_merge($quizResult, [
                'accumulated' => $accumulated,
                'history'     => $quizHistory,
            ]),
            // nextLessonId sudah ada di learningPayload['course']['nextLessonId']
            // accumulated sudah digabung ke quizResult
        ]);
    }
}

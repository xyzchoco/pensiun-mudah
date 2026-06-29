<?php

namespace App\Http\Controllers;

use App\Models\Course;
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
        // FIX BUG #5: Simpan wrong_questions sebagai JSON ke DB agar tidak hilang saat refresh
        DB::table('quiz_user')->updateOrInsert(
            ['user_id' => $userId, 'quiz_id' => $quizId],
            [
                'score'           => $finalScore,
                'is_passed'       => $finalScore >= $passingScore,
                'wrong_questions' => json_encode($wrongQuestions), // ← tambahkan kolom ini di migrasi
                'time_taken'      => $timeTakenMinutes,
                'updated_at'      => now(),
            ]
        );

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
        return redirect()->route('kuis.hasil', ['id' => $courseId]);
    }

    // --- 2. MENAMPILKAN HALAMAN HASIL KUIS ---
    public function showQuizResult($courseId)
    {
        $course  = Course::findOrFail($courseId);
        $userId  = auth()->id();

        $quizResult = session()->get('last_quiz_result');

        // Fallback: ambil dari DB jika session sudah kosong (misal setelah refresh)
        if (!$quizResult) {
            $latestUserQuiz = DB::table('quiz_user')
                ->join('quizzes', 'quizzes.id', '=', 'quiz_user.quiz_id')
                ->join('modules', 'modules.id', '=', 'quizzes.module_id')
                ->where('modules.course_id', $courseId)
                ->where('quiz_user.user_id', $userId)
                ->select(
                    'quiz_user.*',
                    'quizzes.nilai_lulus',
                    'quizzes.is_final'
                )
                ->latest('quiz_user.updated_at')
                ->first();

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
                    'score'              => (int)$latestUserQuiz->score,
                    'passing_score'      => (int)$latestUserQuiz->nilai_lulus,
                    'is_final'           => (bool)$latestUserQuiz->is_final,
                    'total_questions'    => $dbTotalQuestions ?: 4,
                    'correct_count'      => $dbCorrectCount,
                    'time_taken_minutes' => (int)($latestUserQuiz->time_taken ?? 0),
                    'wrong_questions'    => $dbWrongQuestions,
                ];
            } else {
                // Default kosong jika belum pernah mengerjakan kuis
                $quizResult = [
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

        return Inertia::render('Pelatihan/HasilKuis', [
            'learning'   => ['course' => $course, 'modules' => []],
            'quizResult' => $quizResult,
        ]);
    }
}
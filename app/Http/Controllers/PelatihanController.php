<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DashboardBanner;
use App\Models\CourseCategory;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\CorporateVoucher;
use App\Models\VoucherRedemption;

class PelatihanController extends Controller
{
    public function index()
    {
        $banners = DashboardBanner::where('is_active', true)->latest()->get();
        $categories = CourseCategory::all();
        $user = Auth::user();
        
        $kategoriUser = $user ? $user->kategori_pensiun : 'publik';

        $courses = Course::with('category')
            ->where('status', 'published')
            ->where('is_visible_' . $kategoriUser, true) 
            ->latest()
            ->get();

        return Inertia::render('BeliPelatihan', [
            'banners' => $banners,
            'categories' => $categories,
            'courses' => $courses,
        ]);
    }

    public function show(Request $request, $slug)
    {
        // 1. Ambil data course (Tambahan: Pastikan hanya status 'published' yang bisa diakses)
        $course = Course::with(['category', 'lessons'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        // 2. VALIDASI VISIBILITAS (Mencegah URL Bypass)
        $kategoriUser = $request->user() ? $request->user()->kategori_pensiun : 'publik';
        $kolomVisibilitas = 'is_visible_' . $kategoriUser;

        if (!$course->$kolomVisibilitas) {
            // Tolak akses jika kolom is_visible_{kategori} bernilai false
            abort(404, 'Akses Ditolak: Pelatihan ini tidak tersedia untuk kategori akun Anda.');
            // Tips: Ganti jadi abort(404) kalau lu mau pura-pura halamannya beneran nggak ada.
        }

        // 3. Ambil data course terkait (Tambahan: Pastikan related course juga difilter visibilitasnya!)
        $relatedCourses = Course::with('category')
            ->where('category_id', $course->category_id)
            ->where('id', '!=', $course->id)
            ->where('status', 'published')
            ->where($kolomVisibilitas, true) // <-- Biar rekomendasi kelas di bawah ga bocor
            ->take(3)
            ->get();

        // 4. Tentukan URL tombol "Kembali"
        $isCorporateUser = $kategoriUser === 'korporat';
        $backUrl = $request->routeIs('korporat.*') || $isCorporateUser
            ? '/korporat/beli-pelatihan'
            : '/beli-pelatihan';

        return Inertia::render('Pelatihan/DetailPelatihan', [
            'course'         => $course,
            'relatedCourses' => $relatedCourses,
            'backUrl'        => $backUrl,
        ]);
    }

    public function kelas($id)
    {
        $enrollment = $this->activeEnrollment($id);

        if ($enrollment instanceof \Illuminate\Http\RedirectResponse) {
            return $enrollment;
        }

        return redirect()->route('pelatihan.belajar', $this->learningRouteParams($enrollment->course));
    }

    public function belajar(Request $request, $id)
    {
        $enrollment = $this->activeEnrollment($id);

        if ($enrollment instanceof \Illuminate\Http\RedirectResponse) {
            return $enrollment;
        }

        return Inertia::render('Pelatihan/NontonMateri', [
            'learning' => $this->learningPayload($enrollment),
        ]);
    }

    public function kuis($id)
    {
        $enrollment = $this->activeEnrollment($id);

        if ($enrollment instanceof \Illuminate\Http\RedirectResponse) {
            return $enrollment;
        }

        return Inertia::render('Pelatihan/Kuis', [
            'learning' => $this->learningPayload($enrollment),
        ]);
    }

    public function hasilKuis($id)
    {
        $enrollment = $this->activeEnrollment($id);
        if ($enrollment instanceof \Illuminate\Http\RedirectResponse) {
            return $enrollment;
        }

        // Baca dari session dulu
        $quizResult = session()->get('last_quiz_result');

        // Fallback: ambil dari DB jika session kosong (misal setelah refresh)
        if (!$quizResult) {
            $latestUserQuiz = DB::table('quiz_user')
                ->join('quizzes', 'quizzes.id', '=', 'quiz_user.quiz_id')
                ->join('modules', 'modules.id', '=', 'quizzes.module_id')
                ->where('modules.course_id', $id)
                ->where('quiz_user.user_id', $enrollment->user_id)
                ->select('quiz_user.*', 'quizzes.nilai_lulus', 'quizzes.is_final')
                ->latest('quiz_user.updated_at')
                ->first();

            if ($latestUserQuiz) {
                $dbTotal        = DB::table('quiz_questions')->where('quiz_id', $latestUserQuiz->quiz_id)->count();
                $dbCorrectCount = (int) round(($latestUserQuiz->score / 100) * ($dbTotal ?: 1));

                $quizResult = [
                    'score'              => (int)$latestUserQuiz->score,
                    'passing_score'      => (int)$latestUserQuiz->nilai_lulus,
                    'is_final'           => (bool)$latestUserQuiz->is_final,
                    'total_questions'    => $dbTotal ?: 4,
                    'correct_count'      => $dbCorrectCount,
                    'time_taken_minutes' => 0,
                    'wrong_questions'    => [],
                ];
            } else {
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
            'learning'   => $this->learningPayload($enrollment),
            'quizResult' => $quizResult,  // ✅ Sekarang dikirim!
        ]);
    }

    public function selesaiKuis(Request $request, $id)
    {
        $user = Auth::user();
        $enrollment = $this->activeEnrollment($id);
        if ($enrollment instanceof \Illuminate\Http\RedirectResponse) {
            return $enrollment;
        }

        session()->forget('last_quiz_result');

        $quizId       = $request->input('quiz_id');
        $answersRecap = $request->input('answers_recap', []);

        // Hitung total soal dari DB
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
            $userAnswer = $recap['user_answer'] ?? null;

            if (!empty($userAnswer)) {
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
                $wrongQuestions[] = $indexNoSoal;
            }

            $indexNoSoal++;
        }

        $finalScore = (int) round(($correctCount / $totalQuestions) * 100);

        $quizData     = DB::table('quizzes')->where('id', $quizId)->first();
        $passingScore = $quizData ? (int)$quizData->nilai_lulus : 70;
        $isFinal      = $quizData ? (bool)$quizData->is_final : false;
        $timeTaken    = (int)$request->input('time_taken_minutes', 0);

        // Simpan ke quiz_user
        DB::table('quiz_user')->updateOrInsert(
            ['user_id' => $user->user_id, 'quiz_id' => $quizId],
            [
                'score'      => $finalScore,
                'is_passed'  => $finalScore >= $passingScore,
                'updated_at' => now(),
            ]
        );

        // Catat juga ke learning_progress (supaya modul berikutnya unlock)
        $moduleId = $quizData ? $quizData->module_id : null;
        if ($moduleId) {
            \App\Models\LearningProgress::updateOrCreate(
                [
                    'user_id'     => $user->user_id,
                    'course_id'   => $id,
                    'module_id'   => $moduleId,
                    'material_id' => null,
                ],
                [
                    'is_completed' => true,
                    'persentase'   => $finalScore,
                    'last_accessed'=> now(),
                ]
            );
        }

        // Simpan ke session untuk ditampilkan di HasilKuis
        session()->put('last_quiz_result', [
            'quiz_id'            => $quizId,
            'score'              => $finalScore,
            'passing_score'      => $passingScore,
            'is_final'           => $isFinal,
            'total_questions'    => $totalQuestions,
            'correct_count'      => $correctCount,
            'time_taken_minutes' => $timeTaken,
            'wrong_questions'    => $wrongQuestions,
        ]);

        // ✅ Redirect ke halaman hasil
        return redirect("/pelatihan/{$id}/kuis/hasil");
    }


    public function myCourses()
    {
        $user = Auth::user();

        // 1. Tarik kelas yang SEDANG BERJALAN (Udah dibalikin ke materials)
        $ongoing = Enrollment::with(['course.category', 'course.modules.materials'])
            ->where('user_id', $user->user_id)
            ->where('status', 'active')
            ->where('is_completed', false)
            ->latest()
            ->get()
            ->map(function($enroll) {
                return [
                    'id' => $enroll->course->id,
                    'title' => $enroll->course->title,
                    'category' => $enroll->course->category?->nama ?? 'Umum',
                    'progress' => (int) $enroll->progress_persen,
                    'firstLessonId' => $this->firstMaterialId($enroll->course),
                    'thumbnail' => $enroll->course->thumbnail 
                        ? '/storage/' . preg_replace('/^public\//', '', $enroll->course->thumbnail) 
                        : '/images/course-preview.png',
                    'image' => $enroll->course->thumbnail 
                        ? '/storage/' . preg_replace('/^public\//', '', $enroll->course->thumbnail) 
                        : '/images/course-preview.png'
                ];
            });

        // 2. Tarik kelas yang SUDAH SELESAI
        $completed = Enrollment::with(['course.category'])
            ->where('user_id', $user->user_id)
            ->where(function($query) {
                $query->where('status', 'completed')
                      ->orWhere('is_completed', true);
            })
            ->latest()
            ->get()
            ->map(function($enroll) {
                return [
                    'id' => $enroll->course->id,
                    'title' => $enroll->course->title,
                    'category' => $enroll->course->category?->nama ?? 'Umum',
                    'thumbnail' => $enroll->course->thumbnail 
                        ? '/storage/' . preg_replace('/^public\//', '', $enroll->course->thumbnail) 
                        : '/images/course-preview.png',
                    'image' => $enroll->course->thumbnail 
                        ? '/storage/' . preg_replace('/^public\//', '', $enroll->course->thumbnail) 
                        : '/images/course-preview.png'
                ];
            });

        return Inertia::render('Pelatihan', [
            'ongoingCourses' => $ongoing,
            'completedCourses' => $completed
        ]);
    }

    private function activeEnrollment($courseId)
    {
        $user = Auth::user();

        // UDAH DIBALIKIN JADI materials
        $enrollment = Enrollment::with(['course.category', 'course.modules.materials', 'course.modules.quizzes.questions.options'])
            ->where('user_id', $user->user_id)
            ->where('course_id', $courseId)
            ->first();

        if (!$enrollment) {
            return redirect()->route('beli-pelatihan')
                ->with('error', 'Hayo, lu harus daftar/beli pelatihannya dulu bos!');
        }

        if ($enrollment->status === 'dropped') {
            return redirect()->route('beli-pelatihan')
                ->with('error', 'Akses pelatihan ini sudah ditutup.');
        }

        return $enrollment;
    }

    private function learningPayload(Enrollment $enrollment): array
    {
        $course = $enrollment->course;
        $completedMaterialIds = $this->completedMaterialIds($enrollment->user_id, $course);

        return [
            'course' => $this->coursePayload($course),
            'modules' => $this->modulePayload($course, $completedMaterialIds),
            'progress' => (int) $enrollment->progress_persen,
        ];
    }

    private function coursePayload(Course $course): array
    {
        return [
            'id' => $course->id,
            'title' => $course->title,
            'description' => $course->description,
            'category' => $course->category?->nama ?? 'Umum',
            'progress' => 15,
            'firstLessonId' => $this->firstMaterialId($course),
            'thumbnailUrl' => $this->storageUrl($course->thumbnail),
        ];
    }

    private function learningRouteParams(Course $course): array
    {
        $params = ['id' => $course->id];
        $firstMaterialId = $this->firstMaterialId($course);

        if ($firstMaterialId) {
            $params['lesson'] = $firstMaterialId;
        }

        return $params;
    }

    private function firstMaterialId(Course $course): mixed
    {
        // UDAH DIBALIKIN JADI materials
        $course->loadMissing('modules.materials');

        return $course->modules
            ->flatMap(fn ($module) => $module->materials)
            ->first()
            ->id ?? null;
    }

    private function modulePayload(Course $course, array $completedMaterialIds): array
    {
        $sortedModules = $course->modules->sortBy('urutan')->values();

        return $sortedModules->map(function ($module, $moduleIndex) use ($sortedModules, $completedMaterialIds) {
            $quiz = $module->quizzes->first();
            
            $materials = $module->materials->values()->map(function ($material) use ($completedMaterialIds) {
                return [
                    'id' => $material->id,
                    'title' => $material->judul,
                    'type' => $material->tipe,
                    'duration' => $material->durasi_menit . ' Menit',
                    'video_url' => $material->url_video, 
                    'konten' => $material->konten,
                    'done' => in_array($material->id, $completedMaterialIds, true),
                ];
            })->all();

            // Logika penguncian dinamis:
            // Modul pertama (index 0) selalu terbuka.
            // Modul berikutnya terbuka jika SEMUA materi modul sebelumnya sudah selesai
            // DAN kuis modul sebelumnya sudah dikerjakan (jika ada kuis).
            $isLocked = false;
            if ($moduleIndex > 0) {
                $prevModule = $sortedModules[$moduleIndex - 1];

                // Cek apakah SEMUA materi modul sebelumnya sudah done
                $prevMaterialIds = $prevModule->materials->pluck('id')->all();
                $allPrevMaterialsDone = empty($prevMaterialIds) || 
                    collect($prevMaterialIds)->every(fn ($id) => in_array((int) $id, $completedMaterialIds, true));

                // Cek apakah kuis modul sebelumnya sudah dikerjakan
                $prevQuiz = $prevModule->quizzes->first();
                $prevQuizDone = true; // Default true kalau modul sebelumnya ga punya kuis
                if ($prevQuiz) {
                    // Cek di learning_progress: record kuis ditandai dengan material_id = NULL
                    $prevQuizDone = DB::table('learning_progress')
                        ->where('user_id', auth()->id())
                        ->where('module_id', $prevModule->id)
                        ->whereNull('material_id')
                        ->where('is_completed', true)
                        ->exists();
                }

                $isLocked = !($allPrevMaterialsDone && $prevQuizDone);
            }

            return [
                'id' => $module->id,
                'title' => $module->judul,
                'subtitle' => $module->deskripsi,
                'locked' => $isLocked,
                
                'materials' => $materials, 
                'lessons' => $materials, // Tetap dibiarkan jaga-jaga kalau frontend nyari nama ini
                
                'quiz' => $quiz ? [
                    'id' => $quiz->id,
                    'title' => $quiz->judul,
                    'duration' => $quiz->durasi_menit,
                    'passingScore' => $quiz->nilai_lulus,
                    'totalQuestions' => $quiz->total_soal ?: max($quiz->questions->count(), 10),
                    'questions' => $quiz->questions->values()->map(function ($question) {
                        $options = $question->options->values();
                        return [
                            'id' => $question->id,
                            'text' => $question->teks_soal,
                            'options' => $options->pluck('teks_opsi')->all(),
                            'correctIndex' => max($options->search(fn ($option) => (bool) $option->is_correct), 0),
                        ];
                    })->all(),
                ] : null,
            ];
        })->all();
    }

    private function completedMaterialIds(int $userId, Course $course): array
    {
        // UDAH DIBALIKIN JADI materials
        $materialIds = $course->modules
            ->flatMap(fn ($module) => $module->materials->pluck('id'))
            ->all();

        if (empty($materialIds)) {
            return [];
        }

        return DB::table('learning_progress') 
            ->where('user_id', $userId)
            ->whereIn('material_id', $materialIds)
            ->where('is_completed', true)
            ->pluck('material_id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    private function storageUrl(?string $path): string
    {
        return $path ? '/storage/' . preg_replace('/^public\//', '', $path) : '';
    }
    public function klaimVoucher(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $user = auth()->user();

        // 1. Cari kodenya di database
        $voucher = \App\Models\CorporateVoucher::where('code', $request->code)->first();

        if (!$voucher) {
            return back()->with('error', 'Kode voucher tidak valid atau salah ketik bos.');
        }

        // 2. Cek apakah kuota vouchernya sudah habis
        if ($voucher->used_count >= $voucher->max_uses) {
            return back()->with('error', 'Maaf, kuota penggunaan kode voucher ini sudah habis.');
        }

        // 3. Cek history klaim akun ini biar ga double claim
        $sudahKlaimKodeIni = \App\Models\VoucherRedemption::where('user_id', $user->user_id)
            ->where('corporate_voucher_id', $voucher->id)
            ->exists();

        if ($sudahKlaimKodeIni) {
            return back()->with('error', 'Akun anda sudah klaim kode voucher ini.');
        }

        // 4. Cek apakah user sebenarnya sudah punya kelas ini lewat jalur lain
        $sudahEnrollKelas = \App\Models\Enrollment::where('user_id', $user->user_id)
            ->where('course_id', $voucher->course_id)
            ->exists();

        if ($sudahEnrollKelas) {
            return back()->with('error', 'Anda sudah terdaftar di kelas ini.');
        }

        // 5. Eksekusi klaim menggunakan DB Transaction
        \Illuminate\Support\Facades\DB::transaction(function () use ($voucher, $user) {
            $voucher->increment('used_count');

            \App\Models\Enrollment::create([
                'user_id'         => $user->user_id,
                'course_id'       => $voucher->course_id,
                'tanggal_daftar'  => now(),
                'status'          => 'active',
                'progress_persen' => 0,
                'is_completed'    => false,
            ]);

            \App\Models\VoucherRedemption::create([
                'user_id'              => $user->user_id,
                'corporate_voucher_id' => $voucher->id,
                'redeemed_at'          => now(),
            ]);
        });

        return back()->with('success', 'Kode berhasil diklaim, silakan cek menu pelatihan.');
    }

    public function detailModul($slug)
    {
        $user = auth()->user();

        // 1. Cari kelas berdasarkan slug
        $course = Course::where('slug', $slug)->firstOrFail();

        // 2. Cari voucher korporat milik perusahaan ini untuk kelas tersebut
        $voucher = CorporateVoucher::where('corporate_user_id', $user->user_id)
            ->where('course_id', $course->id)
            ->firstOrFail();

        // 3. Tarik data karyawan yang nge-redeem voucher ini, limit 5 per halaman
        $redemptions = VoucherRedemption::with(['user'])
            ->where('corporate_voucher_id', $voucher->id)
            ->latest('redeemed_at')
            ->paginate(5);

        // 4. Format datanya untuk React (suntikkan progress dari tabel enrollment)
        $redemptions->getCollection()->transform(function ($redemption) use ($course) {
            $enrollment = Enrollment::where('user_id', $redemption->user_id)
                ->where('course_id', $course->id)
                ->first();

            return [
                'id'       => $redemption->id,
                'name'     => $redemption->user->name,
                'email'    => $redemption->user->email,
                'progress' => $enrollment ? $enrollment->progress_persen : 0,
            ];
        });

        // 5. Lempar ke React
        return Inertia::render('Korporat/DetailModulKaryawan', [
            'moduleName'   => $course->title,
            'memberCount'  => $voucher->used_count,
            'totalMembers' => $voucher->max_uses,
            'employees'    => $redemptions, // Bawa data pagination lengkap
        ]);
    }
}

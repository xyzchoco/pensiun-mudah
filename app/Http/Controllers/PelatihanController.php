<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DashboardBanner;
use App\Models\CourseCategory;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\CorporateVoucher;
use App\Models\VoucherRedemption;
use App\Services\LearningService;
use App\Models\Review;
use Pdf;

class PelatihanController extends Controller
{
    public function index()
    {
        $banners = DashboardBanner::where('is_active', true)->latest()->get();
        $categories = CourseCategory::all();
        $user = Auth::user();
        
        $kategoriUser = $user ? $user->kategori_pensiun : 'publik';

        $courses = Course::with('category')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
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

        // 4. Ambil data review asli untuk kursus ini
        $reviews = Review::with('user')
            ->where('course_id', $course->id)
            ->latest()
            ->get()
            ->map(function ($review) {
                return [
                    'name'       => $review->user->name ?? 'Peserta',
                    'profession' => $review->user->kategori_pensiun === 'asn'
                        ? 'ASN/TNI/Polri'
                        : ($review->user->kategori_pensiun === 'korporat'
                            ? 'Karyawan Korporat'
                            : 'Peserta Publik'),
                    'text'       => $review->comment ?? '',
                    'rating'     => $review->rating,
                    'avatar'     => $review->user->profile_photo_path
                        ? \Illuminate\Support\Facades\Storage::disk('public')->url($review->user->profile_photo_path)
                        : null,
                ];
            });

        $totalReviews = $reviews->count();
        $ratingAverage = $totalReviews > 0
            ? round($reviews->avg('rating'), 1)
            : 0;

        // 5. Tentukan URL tombol "Kembali"
        $isCorporateUser = $kategoriUser === 'korporat';
        $backUrl = $request->routeIs('instansi.*')
            ? '/instansi/beli-pelatihan'
            : ($request->routeIs('korporat.*') || $isCorporateUser
                ? '/korporat/beli-pelatihan'
                : '/beli-pelatihan');

        $sesiSeminar = \App\Models\SesiSeminar::where('course_id', $course->id)
            ->where('status', 'disetujui')
            ->orderBy('tanggal', 'asc')
            ->get();

        return Inertia::render('Pelatihan/DetailPelatihan', [
            'course'         => $course,
            'sesiSeminar'    => $sesiSeminar,
            'relatedCourses' => $relatedCourses,
            'backUrl'        => $backUrl,
            'reviews'        => $reviews,
            'ratingAverage'  => $ratingAverage,
            'totalReviews'   => $totalReviews,
        ]);
    }

    public function detailOffline($id)
    {
        $course = Course::findOrFail($id);
        $enrollment = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->first();

        if (!$enrollment) {
            abort(403, 'Anda tidak memiliki akses ke kelas ini.');
        }

        $user = \Illuminate\Support\Facades\Auth::user();
        $voucher = \App\Models\CorporateVoucher::where('course_id', $course->id)
            ->whereHas('redemptions', fn($q) => $q->where('user_id', $user->user_id))
            ->with('corporateUser.corporateProfile')
            ->first();

        // Tentukan tanggal: gunakan yang custom dari enrollment, fallback ke course default
        if ($enrollment->tanggal_mulai) {
            $tanggalDisplay = \Illuminate\Support\Carbon::parse($enrollment->tanggal_mulai)->locale('id')->isoFormat('D MMMM YYYY');
            if ($enrollment->tanggal_selesai) {
                $tanggalDisplay .= ' – ' . \Illuminate\Support\Carbon::parse($enrollment->tanggal_selesai)->locale('id')->isoFormat('D MMMM YYYY');
            }
        } else {
            $tanggalDisplay = $course->tanggal_default
                ? \Illuminate\Support\Carbon::parse($course->tanggal_default)->locale('id')->isoFormat('D MMMM YYYY') .
                    ($course->tanggal_selesai_default
                        ? ' – ' . \Illuminate\Support\Carbon::parse($course->tanggal_selesai_default)->locale('id')->isoFormat('D MMMM YYYY')
                        : '')
                : 'Akan dikonfirmasi';
        }

        // Tentukan jadwal: gunakan yang custom dari enrollment, fallback ke course default
        $jadwalDisplay = $enrollment->jam_mulai
            ? \Illuminate\Support\Carbon::parse($enrollment->jam_mulai)->format('H:i') .
              ($enrollment->jam_selesai ? ' - ' . \Illuminate\Support\Carbon::parse($enrollment->jam_selesai)->format('H:i') : '')
            : ($course->jadwal_default ?? 'Akan dikonfirmasi');

        // Tentukan tempat: gunakan yang custom dari enrollment, fallback ke course default
        $tempatDisplay = $enrollment->usulan_lokasi ?? ($course->lokasi_default ?? 'Akan dikonfirmasi');

        // Generate download link untuk PDF
        $downloadHref = route('pelatihan.download-bukti', $course->id);

        return Inertia::render('Pelatihan/DetailKelasOffline', [
            'course' => [
                'title'      => $course->title,
                'instruktur' => $course->instruktur ?? 'Akan dikonfirmasi',
                'perusahaan' => $voucher?->corporateUser?->corporateProfile->nama_perusahaan ?? 'Akan dikonfirmasi',
                'tanggal'    => $tanggalDisplay,
                'jadwal'     => $jadwalDisplay,
                'tempat'     => $tempatDisplay,
                'durasi'     => $course->durasi ?? 'Akan dikonfirmasi',
            ],
            'downloadHref' => $downloadHref,
        ]);
    }

    public function downloadBuktiPendaftaran($courseId)
    {
        $user = Auth::user();
        $course = Course::findOrFail($courseId);
        $enrollment = Enrollment::where('user_id', $user->user_id)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $voucher = \App\Models\CorporateVoucher::where('course_id', $course->id)
            ->whereHas('redemptions', fn($q) => $q->where('user_id', $user->user_id))
            ->with('corporateUser.corporateProfile')
            ->first();

        // Tentukan tanggal: gunakan yang custom dari enrollment, fallback ke course default
        if ($enrollment->tanggal_mulai) {
            $tanggalDisplay = \Illuminate\Support\Carbon::parse($enrollment->tanggal_mulai)->locale('id')->isoFormat('dddd, D MMMM YYYY');
            if ($enrollment->tanggal_selesai) {
                $tanggalDisplay .= ' – ' . \Illuminate\Support\Carbon::parse($enrollment->tanggal_selesai)->locale('id')->isoFormat('dddd, D MMMM YYYY');
            }
        } else {
            $tanggalDisplay = $course->tanggal_default
                ? \Illuminate\Support\Carbon::parse($course->tanggal_default)->locale('id')->isoFormat('dddd, D MMMM YYYY') .
                    ($course->tanggal_selesai_default
                        ? ' – ' . \Illuminate\Support\Carbon::parse($course->tanggal_selesai_default)->locale('id')->isoFormat('dddd, D MMMM YYYY')
                        : '')
                : 'Akan dikonfirmasi';
        }

        // Tentukan jadwal: gunakan yang custom dari enrollment, fallback ke course default
        $jadwalDisplay = $enrollment->jam_mulai
            ? \Illuminate\Support\Carbon::parse($enrollment->jam_mulai)->format('H:i') .
              ($enrollment->jam_selesai ? ' - ' . \Illuminate\Support\Carbon::parse($enrollment->jam_selesai)->format('H:i') : '')
            : ($course->jadwal_default ?? 'Akan dikonfirmasi');

        // Tentukan tempat: gunakan yang custom dari enrollment, fallback ke course default
        $tempatDisplay = $enrollment->usulan_lokasi ?? ($course->lokasi_default ?? 'Akan dikonfirmasi');

        // Format durasi agar lebih informatif
        $durasiDisplay = $course->durasi 
            ? (is_numeric($course->durasi) ? $course->durasi . ' Hari' : $course->durasi)
            : 'Akan dikonfirmasi';

        $html = view('pdf.bukti-pendaftaran', [
            'userName' => $user->name,
            'userEmail' => $user->email,
            'title' => $course->title,
            'instruktur' => $course->instruktur ?? 'Akan dikonfirmasi',
            'perusahaan' => $voucher?->corporateUser?->corporateProfile->nama_perusahaan ?? 'Pensiun Mudah',
            'tanggal' => $tanggalDisplay,
            'jadwal' => $jadwalDisplay,
            'tempat' => $tempatDisplay,
            'durasi' => $durasiDisplay,
            'generatedAt' => now()->setTimezone('Asia/Jakarta')->locale('id')->isoFormat('dddd, D MMMM YYYY [pukul] HH:mm') . ' WIB',
        ])->render();

        $pdf = Pdf::html($html)
            ->format('a4') // Menggunakan format() untuk ukuran kertas
            ->orientation('portrait') // Menggunakan orientation() untuk orientasi
            ->margins(10, 10, 10, 10);

        $filename = 'Bukti-Pendaftaran-' . str_replace(' ', '-', $course->title) . '-' . $user->name . '.pdf';

        return $pdf->download($filename);
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
        if ($enrollment instanceof \Illuminate\Http\RedirectResponse) return $enrollment;

        $learningService = new LearningService();
        $payload = $learningService->buildLearningPayload($enrollment->user_id, $enrollment->course);
        $materialId = (int) $request->query('lesson');
        
        // Gating: Cek apakah modul materi ini terkunci
        foreach ($payload['modules'] as $module) {
            $material = collect($module['materials'])->firstWhere('id', $materialId);
            // Gunakan $module['locked'] yang sudah dihitung oleh LearningService
            if ($material && $module['locked']) { 
                return redirect()->route('pelatihan.kelas', $id)->with('error', 'Modul terkunci!');
            }
        }

        return Inertia::render('Pelatihan/NontonMateri', [
            'learning' => $payload,
        ]);
    }

    public function kuis(Request $request, $id)
    {
        $enrollment = $this->activeEnrollment($id);
        if ($enrollment instanceof \Illuminate\Http\RedirectResponse) return $enrollment;

        $learningService = new LearningService();
        $payload = $learningService->buildLearningPayload($enrollment->user_id, $enrollment->course);
        $moduleId = (int) $request->query('module');
        
        // Gating: Cek apakah modul kuis ini terkunci
        $module = collect($payload['modules'])->firstWhere('id', $moduleId);
        // Gunakan $module['locked'] yang sudah dihitung oleh LearningService
        if ($module && $module['locked']) { 
            return redirect()->route('pelatihan.kelas', $id)->with('error', 'Modul terkunci!');
        }

        // ✅ PERBAIKAN: Saat user masuk ke halaman kuis, hapus data quiz_user lama
        // agar percobaan kuis dihitung sebagai attempt baru. Ini mencegah progress
        // tetap 100% saat user sedang mengerjakan ulang kuis.
        $quizId = (int)$request->query('quiz_id');
        if (!$quizId && $module && isset($module['quiz'])) {
            $quizId = (int)$module['quiz']['id'];
        }
        
        if ($quizId) {
            // Hapus data quiz_user lama untuk kuis ini (percobaan sebelumnya)
            DB::table('quiz_user')
                ->where('user_id', $enrollment->user_id)
                ->where('quiz_id', $quizId)
                ->delete();
            
            // Recompute progress agar enrollment ter-update tanpa kuis ini
            $learningService->recomputeProgress($enrollment->user_id, $id);
        }

        return Inertia::render('Pelatihan/Kuis', [
            'learning' => $payload,
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

        $existingReview = Review::where('user_id', Auth::id())
            ->where('course_id', $id)
            ->first();

        return Inertia::render('Pelatihan/HasilKuis', [
            'learning'   => $this->learningPayload($enrollment),
            'quizResult' => $quizResult,
            'courseId'   => $id,
            'existingReview' => $existingReview ? [
                'rating' => $existingReview->rating,
                'comment' => $existingReview->comment,
            ] : null,
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

        // Setelah menyimpan hasil kuis, recompute progress kursus
        app(LearningService::class)->recomputeProgress($user->user_id, $id);

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

    public function lanjutModul($id, $moduleId)
    {
        $enrollment = $this->activeEnrollment($id);
        if ($enrollment instanceof \Illuminate\Http\RedirectResponse) return $enrollment;

        $course = $enrollment->course;
        $nextStep = $this->getNextStep($course, (int)$moduleId, null, true);

        if ($nextStep) {
            if ($nextStep['type'] === 'material') {
                return redirect()->route('pelatihan.belajar', ['id' => $id, 'lesson' => $nextStep['id']]);
            }
        }

        return redirect()->route('pelatihan.kelas', $id)->with('success', 'Selamat, Anda telah menyelesaikan modul!');
    }

    public function selesaiKuis_Old(Request $request, $id)
    {
        if ($finalScore >= $passingScore) {
            Notification::send($user->user_id, 'Selamat, Kamu Lulus Kuis!',
                "Nilai kamu {$finalScore}. Lanjut ke modul berikutnya!", 'success',
                'Lihat Hasil', "/pelatihan/{$id}/kuis/hasil");
        } else {
            Notification::send($user->user_id, 'Nilai Kuis Belum Cukup',
                "Nilai kamu {$finalScore}, minimal {$passingScore}. Coba lagi ya!", 'warning',
                'Ulangi Kuis', "/pelatihan/{$id}/kuis");
        }
    }


    public function myCourses()
    {
        $user = Auth::user();

        $enrollments = Enrollment::with(['course.category', 'course.modules.materials'])
            ->where('user_id', $user->user_id)
            ->whereIn('status', ['active', 'completed'])
            ->latest()
            ->get();

        $ongoing = [];
        $completed = [];

        foreach ($enrollments as $enroll) {
            $executionDate = $enroll->tanggal_mulai ?: $enroll->course->tanggal_default;
            $isOfflinePassed = false;
            if ($enroll->course->tipe_kelas === 'Hybrid') {
                $session = \App\Models\SesiSeminar::where('course_id', $enroll->course_id)
                    ->where('status', 'disetujui')
                    ->first();
                if ($session) {
                    $sessionStart = \Carbon\Carbon::parse($session->tanggal->format('Y-m-d') . ' ' . \Carbon\Carbon::parse($session->jam)->format('H:i:s'));
                    $sessionEnd = $sessionStart->copy()->addHours(2);
                    if (now()->gt($sessionEnd)) {
                        $isOfflinePassed = true;
                    }
                }
            } elseif ($enroll->course->tipe_kelas === 'Offline') {
                if ($executionDate && \Carbon\Carbon::parse($executionDate)->startOfDay()->lt(now()->startOfDay())) {
                    $isOfflinePassed = true;
                }
            }

            $isFinished = $enroll->is_completed || $enroll->status === 'completed' || $isOfflinePassed;
            if ($enroll->course->tipe_kelas === 'Hybrid') {
                $isFinished = $isOfflinePassed;
            }

            $courseData = [
                'id' => $enroll->course->id,
                'title' => $enroll->course->title,
                'category' => $enroll->course->category?->nama ?? 'Umum',
                'tipe_kelas' => $enroll->course->tipe_kelas,
                'thumbnail' => $enroll->course->thumbnail 
                    ? '/storage/' . preg_replace('/^public\//', '', $enroll->course->thumbnail) 
                    : '/images/course-preview.png',
                'image' => $enroll->course->thumbnail 
                    ? '/storage/' . preg_replace('/^public\//', '', $enroll->course->thumbnail) 
                    : '/images/course-preview.png'
            ];

            if ($enroll->course->tipe_kelas === 'Hybrid') {
                $session = \App\Models\SesiSeminar::where('course_id', $enroll->course_id)
                    ->where('status', 'disetujui')
                    ->first();
                if ($session) {
                    $sessionStart = \Carbon\Carbon::parse($session->tanggal->format('Y-m-d') . ' ' . \Carbon\Carbon::parse($session->jam)->format('H:i:s'));
                    $sessionEnd = $sessionStart->copy()->addHours(2);
                    if (now()->lt($sessionEnd)) {
                        $courseData['next_session'] = [
                            'tanggal' => $session->tanggal->locale('id')->isoFormat('D MMMM YYYY'),
                            'jam' => \Carbon\Carbon::parse($session->jam)->format('H:i') . ' - ' . $sessionEnd->format('H:i') . ' WIB',
                            'lokasi' => $session->lokasi,
                            'link_maps' => $session->link_maps,
                        ];
                    }
                }
            }

            if ($isFinished) {
                $completed[] = $courseData;
            } else {
                $courseData['progress'] = (int) $enroll->progress_persen;
                $courseData['firstLessonId'] = $this->firstMaterialId($enroll->course);
                $ongoing[] = $courseData;
            }
        }

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
        // Gunakan LearningService untuk membangun payload
        $learningService = new LearningService();
        return $learningService->buildLearningPayload($enrollment->user_id, $enrollment->course);
    }

    private function learningRouteParams(Course $course): array
    {
        $params = ['id' => $course->id];
        $learningService = new LearningService();
        $learningPayload = $learningService->buildLearningPayload(Auth::id(), $course);

        if ($learningPayload['course']['firstLessonId']) {
            $params['lesson'] = $learningPayload['course']['firstLessonId'];
        }

        return $params;
    }

    private function firstMaterialId(Course $course): mixed
    {
        // This method is no longer needed as firstLessonId is calculated in LearningService
        // but kept for compatibility if other parts of the code still call it.
        $course->loadMissing('modules.materials');

        return $course->modules
            ->sortBy('urutan')
            ->first()
            ?->materials
            ?->sortBy('urutan')
            ?->first()
            ?->id ?? null;
    }

    // getNextStep, modulePayload, completedQuizIds, completedMaterialIds, storageUrl
    // are now handled by LearningService and can be removed or refactored if not used elsewhere.
    // For now, we will remove them as they are no longer directly used by PelatihanController
    // after integrating LearningService.

    public function klaimVoucher(Request $request)
    {
    $request->validate([
        'code' => ['required', 'string'],
    ]);

    $user    = auth()->user();
    $voucher = \App\Models\CorporateVoucher::where('code', $request->code)->first();

    // 1. Cek kode valid
    if (!$voucher) {
        return back()->with('error', 'Kode voucher tidak ditemukan.');
    }

    // 2. ✅ Cek target_kategori — voucher ASN hanya bisa diklaim user ASN, dst.
    // if ($voucher->target_kategori && $voucher->target_kategori !== $user->kategori_pensiun) {
    //     $labelMap = [
    //         'asn'     => 'ASN/TNI/Polri',
    //         'korporat'=> 'Korporat',
    //         'publik'  => 'Publik',
    //     ];
    //     $labelKategori = $labelMap[$voucher->target_kategori] ?? ucfirst($voucher->target_kategori);
    //     return back()->with('error', "Kode voucher ini hanya berlaku untuk akun {$labelKategori}.");
    // }

    // 3. Cek kuota
    if ($voucher->used_count >= $voucher->max_uses) {
        return back()->with('error', 'Kode voucher sudah mencapai batas pemakaian.');
    }

    // 4. Cek double klaim kode yang sama
    $sudahKlaimKodeIni = \App\Models\VoucherRedemption::where('user_id', $user->user_id)
        ->where('corporate_voucher_id', $voucher->id)
        ->exists();

    if ($sudahKlaimKodeIni) {
        return back()->with('error', 'Kamu sudah pernah menggunakan kode ini.');
    }

    // 5. Cek sudah enroll kelas ini lewat jalur lain
    $sudahEnrollKelas = \App\Models\Enrollment::where('user_id', $user->user_id)
        ->where('course_id', $voucher->course_id)
        ->exists();

    if ($sudahEnrollKelas) {
        return back()->with('error', 'Anda sudah terdaftar di kelas ini.');
    }

    // 6. Eksekusi klaim
    DB::transaction(function () use ($voucher, $user) {
        $voucher->increment('used_count');

        // Cari training request terkait untuk menyalin jadwal kustom jika ada
        $trainingRequest = \App\Models\TrainingRequest::where('voucher_id', $voucher->id)->first();

        \App\Models\Enrollment::create([
            'user_id'         => $user->user_id,
            'course_id'       => $voucher->course_id,
            'voucher_id'      => $voucher->id,
            'tanggal_daftar'  => now(),
            'status'          => 'active',
            'progress_persen' => 0,
            'is_completed'    => false,
            'tanggal_mulai'   => $trainingRequest?->tanggal_mulai,
            'jam_mulai'       => $trainingRequest?->jam_mulai,
            'jam_selesai'     => $trainingRequest?->jam_selesai,
            'usulan_lokasi'   => $trainingRequest?->usulan_lokasi,
        ]);

        \App\Models\VoucherRedemption::firstOrCreate([
            'user_id'              => $user->user_id,
            'corporate_voucher_id' => $voucher->id,
            'redeemed_at'          => now(),
        ]);

        Notification::send(
            $user->user_id,
            'Berhasil Gabung Kelas!',
            'Kamu berhasil bergabung ke kelas menggunakan kode voucher. Selamat belajar!',
            'success',
            'Mulai Belajar',
            "/pelatihan/{$voucher->course_id}/belajar"
        );
    });

        return back()->with('success', 'Kode voucher berhasil digunakan! Kamu sudah terdaftar di kursus.');
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
        // [DATA] Sumber daftar karyawan berasal dari voucher_redemptions (scoped corporate_user_id)
        $redemptions = VoucherRedemption::with(['user.corporateProfile'])
            ->where('corporate_voucher_id', $voucher->id)
            ->latest('redeemed_at')
            ->paginate(5);

        // 4. Format datanya untuk React (suntikkan progress dari tabel enrollment)
        $redemptions->getCollection()->transform(function ($redemption) use ($course) {
            $enrollment = Enrollment::where('user_id', $redemption->user_id)
                ->where('course_id', $course->id)
                ->first();

            $u = $redemption->user;
            return [
                'id'       => $redemption->id,
                'name'     => $u->name,
                'email'    => $u->email,
                // Kirim URL penuh jika ada foto, null jika tidak (frontend fallback ke inisial)
                'photo'    => $u->profile_photo_path
                    ? \Illuminate\Support\Facades\Storage::disk('public')->url($u->profile_photo_path)
                    : null,
                'jabatan'  => $u->corporateProfile?->jabatan ?? null,
                'progress' => $enrollment ? (int) $enrollment->progress_persen : 0,
            ];
        });

        // 5. Hitung status hybrid & kelayakan buka jadwal (semua anggota progress >= 80%)
        $isHybrid = $course->tipe_kelas === 'Hybrid';
        $redeemUserIds = VoucherRedemption::where('corporate_voucher_id', $voucher->id)
            ->pluck('user_id')
            ->all();

        $canOpenHybrid = false;
        if ($isHybrid && !empty($redeemUserIds)) {
            $totalRedeemed = count($redeemUserIds);
            $highProgressCount = Enrollment::where('course_id', $course->id)
                ->whereIn('user_id', $redeemUserIds)
                ->where('progress_persen', '>=', 80)
                ->count();
            $canOpenHybrid = ($highProgressCount === $totalRedeemed);
        }

        $existingHybridSession = \App\Models\SesiSeminar::where('course_id', $course->id)
            ->where('requester_id', $user->user_id)
            ->whereIn('status', ['pending', 'disetujui'])
            ->first();

        // 6. Lempar ke React
        $isInstansi = str_contains(request()->path(), 'instansi');

        return Inertia::render(
            $isInstansi ? 'Instansi/DetailModulKaryawanInstansi' : 'Korporat/DetailModulKaryawan',
            [
                'moduleName'          => $course->title,
                'memberCount'         => $voucher->used_count,
                'totalMembers'        => $voucher->max_uses,
                'employees'           => $redemptions,
                'backHref'            => $isInstansi ? route('instansi.dashboard') : route('korporat.dashboard'),
                'isHybrid'            => $isHybrid,
                'canOpenHybrid'       => $canOpenHybrid,
                'hybridSessionStatus' => $existingHybridSession ? $existingHybridSession->status : null,
                'courseSlug'          => $course->slug,
            ]
        );
    }
}

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

class PelatihanController extends Controller
{
    public function index()
    {
        $banners = DashboardBanner::where('is_active', true)->latest()->get();
        $categories = CourseCategory::all();
        $courses = Course::with('category')
            ->where('status', 'published')
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
       $course = Course::with(['category', 'lessons'])->where('slug', $slug)->firstOrFail();

        $relatedCourses = Course::with('category')
            ->where('category_id', $course->category_id)
            ->where('id', '!=', $course->id)
            ->where('status', 'published')
            ->take(3)
            ->get();

        // Tentukan URL tombol "Kembali" berdasarkan route atau kategori user login.
        $isCorporateUser = $request->user()?->kategori_pensiun === 'korporat';
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

        return Inertia::render('Pelatihan/HasilKuis', [
            'learning' => $this->learningPayload($enrollment),
        ]);
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
        return $course->modules->values()->map(function ($module, $moduleIndex) use ($completedMaterialIds) {
            $quiz = $module->quizzes->first();
            
            // 👇 UDAH DIBALIKIN JADI materials 👇
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

            return [
                'id' => $module->id,
                'title' => $module->judul,
                'subtitle' => $module->deskripsi,
                'locked' => (bool) $module->is_locked && $moduleIndex > 0,
                
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

        return DB::table('material_user') 
            ->where('user_id', $userId)
            ->whereIn('material_id', $materialIds) 
            ->pluck('material_id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    private function storageUrl(?string $path): string
    {
        return $path ? '/storage/' . preg_replace('/^public\//', '', $path) : '';
    }
}

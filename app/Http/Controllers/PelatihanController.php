<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DashboardBanner;
use App\Models\CourseCategory;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Auth;

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

    public function show($slug)
    {
        $course = Course::with('category')->where('slug', $slug)->firstOrFail();

        $relatedCourses = Course::with('category')
            ->where('category_id', $course->category_id)
            ->where('id', '!=', $course->id)
            ->where('status', 'published') 
            ->take(3)
            ->get();

        return Inertia::render('Pelatihan/DetailPelatihan', [
            'course' => $course,
            'relatedCourses' => $relatedCourses,
        ]);
    }

    public function kelas($id)
    {
        $user = Auth::user();

        $enrollment = Enrollment::with('course') 
            ->where('user_id', $user->id)
            ->where('course_id', $id)
            ->first();

        if (!$enrollment) {
            return redirect()->route('beli-pelatihan')
                ->with('error', 'Hayo, lu harus daftar/beli pelatihannya dulu bos!');
        }

        if ($enrollment->status === 'dropped') {
            return redirect()->route('beli-pelatihan')
                ->with('error', 'Akses pelatihan ini sudah ditutup.');
        }

        return Inertia::render('Pelatihan/KelasSaya', [
            'enrollment' => $enrollment,
        ]);
    }

    public function myCourses()
    {
        $user = Auth::user();

        // 1. Tarik kelas yang SEDANG BERJALAN (status active & belum completed)
        $ongoing = Enrollment::with(['course.category'])
            ->where('user_id', $user->id)
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
                    'image' => $enroll->course->thumbnail 
                        ? '/storage/' . preg_replace('/^public\//', '', $enroll->course->thumbnail) 
                        : '/images/course-preview.png'
                ];
            });

        // 2. Tarik kelas yang SUDAH SELESAI (status completed ATAU is_completed = true)
        $completed = Enrollment::with(['course.category'])
            ->where('user_id', $user->id)
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
                    'image' => $enroll->course->thumbnail 
                        ? '/storage/' . preg_replace('/^public\//', '', $enroll->course->thumbnail) 
                        : '/images/course-preview.png'
                ];
            });

        // Lempar kedua data tersebut ke React Pelatihan
        return Inertia::render('Pelatihan', [
            'ongoingCourses' => $ongoing,
            'completedCourses' => $completed
        ]);
    }
}
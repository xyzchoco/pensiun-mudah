<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Show the form for creating a new review.
     */
    public function create(Course $course)
    {
        $userId = Auth::id();

        // Pastikan user memiliki enrollment yang sudah selesai
        $enrollment = Enrollment::where('user_id', $userId)
            ->where('course_id', $course->id)
            ->where('is_completed', true)
            ->first();

        if (!$enrollment) {
            return redirect()->route('pelatihan.kelas')->with('error', 'Anda harus menyelesaikan kelas ini terlebih dahulu sebelum memberikan penilaian.');
        }

        $existingReview = Review::where('user_id', $userId)
            ->where('course_id', $course->id)
            ->first();

        return Inertia::render('Pelatihan/ReviewCourse', [
            'course' => $course,
            'existingReview' => $existingReview,
        ]);
    }

    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request, Course $course)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $userId = Auth::id();

        // 1. Pastikan user memiliki enrollment yang sudah selesai (is_completed = true) untuk kursus ini
        $enrollment = Enrollment::where('user_id', $userId)
            ->where('course_id', $course->id)
            ->where('is_completed', true)
            ->first();

        if (!$enrollment) {
            return back()->with('error', 'Anda harus menyelesaikan kelas ini terlebih dahulu sebelum memberikan penilaian.');
        }

        // 2. Simpan atau update review
        Review::updateOrCreate(
            [
                'user_id' => $userId,
                'course_id' => $course->id,
            ],
            [
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]
        );

        return back()->with('message', 'Terima kasih atas ulasan dan penilaian yang Anda berikan!');
    }
}
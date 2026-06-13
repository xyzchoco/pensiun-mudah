<?php

namespace App\Http\Controllers; // Pindahin ke folder Controller biasa, bukan Api

use App\Models\DashboardBanner;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia; // Import Inertia

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $banners = DashboardBanner::where('is_active', true)->latest()->get();
        $courses = Course::withCount('modules')->latest()->get();

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'meta' => ['code' => 200, 'status' => 'success'],
                'data' => ['banners' => $banners, 'courses' => $courses]
            ]);
        }

        return Inertia::render('Dashboard', [
            'banners' => $banners,
            'courses' => $courses
        ]);
    }
}
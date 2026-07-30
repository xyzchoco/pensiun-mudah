<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->query('q', '');
        
        if (empty(trim($query))) {
            return redirect()->route('beli-pelatihan');
        }

        $user = Auth::user();
        $kategoriUser = $user ? $user->kategori_pensiun : 'publik';

        $courses = Course::with('category')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('status', 'published')
            ->where('is_visible_' . $kategoriUser, true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'ilike', "%{$query}%")
                  ->orWhere('description', 'ilike', "%{$query}%");
            })
            ->latest()
            ->get();

        return Inertia::render('SearchResult', [
            'query' => $query,
            'courses' => $courses,
        ]);
    }

    public function live(Request $request)
    {
        $query = $request->query('q', '');
        
        if (empty(trim($query))) {
            return response()->json([]);
        }

        $user = Auth::user();
        $kategoriUser = $user ? $user->kategori_pensiun : 'publik';

        $courses = Course::with('category')
            ->where('status', 'published')
            ->where('is_visible_' . $kategoriUser, true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'ilike', "%{$query}%")
                  ->orWhere('description', 'ilike', "%{$query}%");
            })
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($course) {
                $priceVal = (float) $course->price;
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'price' => $priceVal > 0 ? 'Rp ' . number_format($priceVal, 0, ',', '.') : 'GRATIS',
                    'isFree' => $priceVal == 0,
                    'thumbnail' => $course->thumbnail 
                        ? '/storage/' . preg_replace('/^public\//', '', $course->thumbnail) 
                        : null,
                ];
            });

        return response()->json($courses);
    }
}

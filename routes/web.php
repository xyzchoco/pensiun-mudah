<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CourseController;
use App\Models\LandingPage;
use App\Models\Webinar;
use Inertia\Inertia;
use App\Models\CourseCategory;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PelatihanController;

Route::get('/', function () {
    $landingData = LandingPage::first(); 
    $events = Webinar::where('is_published', true)->latest()->take(6)->get();

    $categories = CourseCategory::withCount('courses')->get();

    return Inertia::render('Beranda', [
        'landing' => $landingData,
        'events' => $events,
        'categories' => $categories
    ]);
})->name('beranda');

Route::get('/api/home', [HomeController::class, 'index']);
Route::get('/api/courses/{id}', [CourseController::class, 'show']);

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/sertifikat', function () {
    return Inertia::render('Sertifikat');
});

    // Ini route baru yang ditambahin buat halaman Pelatihan
    Route::get('/beli-pelatihan', [PelatihanController::class, 'index'])->name('beli-pelatihan');
    
    Route::post('/api/mark-done', [CourseController::class, 'markMaterialAsDone']);
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
});

require __DIR__.'/auth.php';
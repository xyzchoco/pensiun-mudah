<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CourseController;
use App\Models\LandingPage;
use App\Models\Webinar;
use App\Models\User;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use App\Models\CourseCategory;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PelatihanController;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    $landingData = LandingPage::first();

    $events = Webinar::where('is_published', true)
        ->latest()
        ->take(6)
        ->get();

    $categories = CourseCategory::withCount('courses')->get();

    return Inertia::render('Beranda', [
        'landing' => $landingData,
        'events' => $events,
        'categories' => $categories
    ]);
})->name('beranda');

Route::get('/auth/google/redirect', function () {
    return Socialite::driver('google')->redirect();
})->name('google.redirect');

Route::get('/auth/google/callback', function () {
    try {
        $googleUser = Socialite::driver('google')->user();

        $user = User::updateOrCreate([
            'email' => $googleUser->email,
        ], [
            'name' => $googleUser->name,
            'password' => bcrypt(str()->random(16)),
            'role_id' => 2
        ]);

        Auth::login($user);

        return redirect()->intended('/dashboard');

    } catch (\Exception $e) {
        dd($e->getMessage());
    }
});

Route::get('/api/home', [HomeController::class, 'index']);
Route::get('/api/courses/{id}', [CourseController::class, 'show']);

Route::middleware(['auth'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/sertifikat', function () {
        return Inertia::render('Sertifikat');
    });

    Route::get('/beli-pelatihan', [PelatihanController::class, 'index'])
        ->name('beli-pelatihan');

    Route::get('/pelatihan', function () {
        return Inertia::render('Pelatihan');
    });

    Route::post('/api/mark-done', [CourseController::class, 'markMaterialAsDone']);

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');
});

require __DIR__.'/auth.php';

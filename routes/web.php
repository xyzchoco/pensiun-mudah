<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CourseController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Beranda');
});

Route::get('/api/home', [HomeController::class, 'index']);
Route::get('/api/courses/{id}', [CourseController::class, 'show']);

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');
    
    Route::get('/beli-pelatihan', function () {
        return Inertia::render('BeliPelatihan');
    });

    Route::get('/sertifikat', function () {
    return Inertia::render('Sertifikat');
});

    // Ini route baru yang ditambahin buat halaman Pelatihan
    Route::get('/pelatihan', function () {
        return Inertia::render('Pelatihan');
    });
    
    Route::post('/api/mark-done', [CourseController::class, 'markMaterialAsDone']);
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
});

require __DIR__.'/auth.php';
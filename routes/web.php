<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- RUTE PUBLIK (BISA DIAKSES SIAPA SAJA) ---
Route::get('/', function () {
    return Inertia::render('Beranda');
});

// --- RUTE PROTEKSI (WAJIB LOGIN) ---
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
});

require __DIR__.'/auth.php';
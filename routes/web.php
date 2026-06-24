<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PelatihanController;
use App\Http\Controllers\PembayaranController;
use App\Models\{LandingPage, Webinar, User, CourseCategory, Course, DashboardBanner};
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

// ==========================================
// PUBLIC ROUTES
// ==========================================
Route::get('/', function () {
    return Inertia::render('Beranda', [
        'landing' => LandingPage::first(),
        'events' => Webinar::where('is_published', true)->latest()->take(6)->get(),
        'categories' => CourseCategory::withCount('courses')->get()
    ]);
})->name('beranda');

// Route Detail Pelatihan (Bisa diakses publik, tombol kembali bersifat dinamis)
Route::get('/pelatihan/{slug}', [PelatihanController::class, 'show'])->name('pelatihan.detail');

Route::get('/auth/google/redirect', fn () => Socialite::driver('google')->redirect())->name('google.redirect');
Route::get('/auth/google/callback', function () {
    $googleUser = Socialite::driver('google')->user();
    $user = User::updateOrCreate(['email' => $googleUser->email], [
        'name' => $googleUser->name,
        'password' => bcrypt(str()->random(16)),
        'role_id' => 2
    ]);
    Auth::login($user);
    if (!$user->kategori_pensiun) return redirect()->route('onboarding.kategori');
    return redirect()->intended($user->kategori_pensiun === 'korporat' ? '/korporat/dashboard' : '/dashboard');
});

// ==========================================
// PROTECTED ROUTES (Wajib Login)
// ==========================================
Route::middleware(['auth'])->group(function () {

    // Onboarding & Korporat
    Route::get('/onboarding/pilih-kategori', fn () => Inertia::render('Onboarding/PilihKategori'))->name('onboarding.kategori');
    Route::post('/onboarding/kategori', function () {
        $kategori = request()->validate(['kategori' => ['required', 'in:publik,korporat,asn']])['kategori'];
        if ($kategori === 'korporat') {
            session(['pending_kategori' => 'korporat']);
            return redirect()->route('korporat.verifikasi');
        }
        request()->user()->forceFill(['kategori_pensiun' => $kategori])->save();
        return redirect()->route('dashboard');
    });

    Route::get('/korporat/verifikasi', fn () => Inertia::render('Korporat/VerifikasiKorporat'))
        ->name('korporat.verifikasi');

    // --- RUTE POST VERIFIKASI ANDA ---
    Route::post('/korporat/verifikasi', function (Illuminate\Http\Request $request) {
        $data = $request->validate([
            'namaPerusahaan' => ['required', 'string', 'max:255'],
            'jabatan'        => ['required', 'string', 'max:255'],
        ]);

        $user = $request->user();

        $user->forceFill([
            'kategori_pensiun' => session('pending_kategori', 'korporat'),
        ])->save();

        $user->corporateProfile()->updateOrCreate(
            ['user_id' => $user->user_id],
            [
                'nama_perusahaan'  => $data['namaPerusahaan'],
                'jabatan'          => $data['jabatan'],
                'kategori_bisnis'  => '-',
                'email_perusahaan' => '-',
                'alamat_kantor'    => '-',
                'email_bisnis'     => '-',
                'no_telepon'       => '-',
            ]
        );

        session()->forget('pending_kategori');
        return redirect()->route('korporat.dashboard');
    })->name('korporat.verifikasi.store');

    Route::post('/korporat/profil-perusahaan/update', function (Illuminate\Http\Request $request) {
        $data = $request->validate([
            'namaPerusahaan'  => ['required', 'string'],
            'jabatan'         => ['required', 'string'],
            'kategoriBisnis'  => ['required', 'string'],
            'emailPerusahaan' => ['required', 'email'],
            'alamatKantor'    => ['required', 'string'],
            'emailBisnis'     => ['required', 'email'],
            'noTelepon'       => ['required', 'string'],
        ]);

        $request->user()->corporateProfile()->update($data); // Sesuaikan key array dengan nama kolom di DB

        return back()->with('message', 'Profil berhasil diperbarui!');
    })->name('korporat.profil-perusahaan.update');

    Route::get('/korporat/dashboard', function () {
        return Inertia::render('Korporat/DashboardKorporat', [
            'banners' => DashboardBanner::where('is_active', true)->latest()->get(),
            'events'  => Webinar::where('is_published', true)->latest()->take(3)->get(),
        ]);
    })->name('korporat.dashboard');

    Route::get('/korporat/beli-pelatihan', function () {
    $banners = \App\Models\DashboardBanner::where('is_active', true)->latest()->get(); 
    
    // Gunakan with('category') agar data kategori ikut terbawa
    $courses = \App\Models\Course::with('category')->latest()->get();

    return Inertia::render('Korporat/BeliPelatihanKorporat', [
        'banners' => $banners,
        'courses' => $courses,
    ]);
    })->name('korporat.beli-pelatihan');

    Route::get('/korporat/profil-perusahaan', fn () => Inertia::render('Korporat/ProfilPerusahaan'))
        ->name('korporat.profil-perusahaan');

    Route::get('/korporat/pelatihan/{slug}', [PelatihanController::class, 'show'])
    ->name('korporat.pelatihan.detail');

    // Dashboard Umum
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Pelatihan User
    Route::get('/beli-pelatihan', [PelatihanController::class, 'index'])->name('beli-pelatihan');
    Route::get('/pelatihan', [PelatihanController::class, 'myCourses'])->name('pelatihan.index');
    
    // Rute lain tetap sama...
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
});

require __DIR__.'/auth.php';
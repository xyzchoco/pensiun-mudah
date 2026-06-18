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
use App\Http\Controllers\PembayaranController;
use Illuminate\Support\Facades\Auth;

// ==========================================
// PUBLIC ROUTES (Bisa diakses tanpa login)
// ==========================================
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

// Webhook / callback dari payment gateway (server-to-server)
Route::post('/payment/callback', [PembayaranController::class, 'webhook'])
    ->name('payment.callback');


// ==========================================
// CLOSURE UNTUK PAYLOAD EVENT
// ==========================================
$eventPayload = function (string|int $id) {
    $webinar = Webinar::find($id);

    if (! $webinar) {
        return [
            'id' => $id,
            'slug' => $id,
        ];
    }

    $imagePath = $webinar->image_path
        ? '/storage/' . preg_replace('/^public\//', '', $webinar->image_path)
        : '/images/event-placeholder.svg';
    $isOnline = $webinar->jenis_event === 'Online';
    $capacity = $webinar->kapasitas;
    $availableSlots = $webinar->sisa_kuota;

    return [
        'id' => $webinar->id,
        'slug' => $webinar->id,
        'title' => $webinar->judul,
        'judul' => $webinar->judul,
        'description' => $webinar->deskripsi,
        'deskripsi' => $webinar->deskripsi,
        'thumbnail' => $imagePath,
        'image_path' => $webinar->image_path,
        'type' => $isOnline ? 'Seminar Online' : 'Workshop Offline',
        'jenis_event' => $webinar->jenis_event,
        'speaker' => $webinar->narasumber,
        'speaker_name' => $webinar->narasumber,
        'capacity' => $capacity,
        'available_slots' => $availableSlots,
        'registered_count' => is_numeric($capacity) && is_numeric($availableSlots)
            ? max((int) $capacity - (int) $availableSlots, 0)
            : 0,
        'location' => $isOnline ? null : $webinar->lokasi_link,
        'platform' => $isOnline ? $webinar->lokasi_link : null,
        'start_date' => $webinar->tanggal,
        'date' => $webinar->tanggal,
        'start_time' => $webinar->jam,
        'time' => $webinar->jam,
        'is_online' => $isOnline,
        'price' => 0,
    ];
};


// ==========================================
// PROTECTED ROUTES (Wajib Login)
// ==========================================
Route::middleware(['auth'])->group(function () use ($eventPayload) {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // -- Event --
    Route::get('/event', fn () => Inertia::render('Event/SemuaEvent', [
        'events' => Webinar::where('is_published', true)
            ->latest()
            ->get()
            ->map(fn (Webinar $webinar) => $eventPayload($webinar->id)),
    ]))->name('event.index');

    Route::get('/event/{slug}', fn (string $slug) => Inertia::render('Event/DetailEvent', [
        'event' => $eventPayload($slug),
    ]))->name('event.detail');

    Route::get('/event/{slug}/daftar', fn (string $slug) => Inertia::render('Event/DaftarEvent', [
        'event' => $eventPayload($slug),
    ]))->name('event.daftar');

    Route::post('/event/{slug}/register', function (string $slug) {
        request()->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:30',
        ]);
        return redirect()->route('event.success', $slug);
    })->name('event.register');

    Route::get('/event/{slug}/berhasil', fn (string $slug) => Inertia::render('Event/PendaftaranBerhasil', [
        'event' => $eventPayload($slug),
    ]))->name('event.success');

    // -- Sertifikat --
    Route::get('/sertifikat', function () {
        return Inertia::render('Sertifikat');
    })->name('sertifikat.index');

    Route::get('/sertifikat/{id}', fn (string $id) => Inertia::render('Sertifikat/DetailSertifikat', [
        'certificate' => ['id' => $id],
    ]))->name('sertifikat.detail');

    // -- Pelatihan / Kelas --
    Route::get('/beli-pelatihan', [PelatihanController::class, 'index'])
        ->name('beli-pelatihan');

    Route::get('/pelatihan', [PelatihanController::class, 'myCourses'])->name('pelatihan.index');

    Route::get('/pelatihan/{slug}', [PelatihanController::class, 'show'])
        ->name('pelatihan.detail');

    Route::get('/pelatihan/{id}/kelas', [PelatihanController::class, 'kelas'])
        ->name('pelatihan.kelas');

    Route::post('/api/mark-done', [CourseController::class, 'markMaterialAsDone']);

    // -- Pembayaran & Midtrans --
    Route::get('/pelatihan/{slug}/pembelian', [PembayaranController::class, 'checkout'])
        ->name('payment.detail');

    // INI YANG TADI KETINGGALAN DAN BIKIN 404 BOS:
    Route::get('/payment/finish', [PembayaranController::class, 'finish'])
        ->name('payment.finish');

    Route::get('/pelatihan/{slug}/pembayaran/berhasil', [PembayaranController::class, 'success'])
        ->name('payment.success');

    // -- Profile --
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');
});

require __DIR__.'/auth.php';
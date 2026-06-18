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

Route::middleware(['auth'])->group(function () use ($eventPayload) {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/sertifikat', function () {
        return Inertia::render('Sertifikat');
    })->name('sertifikat.index');

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

    Route::get('/sertifikat/{id}', fn (string $id) => Inertia::render('Sertifikat/DetailSertifikat', [
        'certificate' => ['id' => $id],
    ]))->name('sertifikat.detail');

    Route::get('/beli-pelatihan', [PelatihanController::class, 'index'])
        ->name('beli-pelatihan');

    Route::get('/pelatihan', function () {
        return Inertia::render('Pelatihan');
    });

    Route::get('/pelatihan/{slug}', fn (string $slug) => Inertia::render('Pelatihan/DetailPelatihan', [
        'course' => ['slug' => $slug, 'id' => $slug],
    ]))->name('pelatihan.detail');

    // "Kelas Saya" / Mulai Belajar (post-enrollment learning hub)
    Route::get('/pelatihan/{id}/kelas', fn (string $id) => Inertia::render('Pelatihan/KelasSaya', [
        'enrollment' => ['course' => ['id' => $id]],
    ]))->name('pelatihan.kelas');

    Route::post('/api/mark-done', [CourseController::class, 'markMaterialAsDone']);

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');
});

Route::middleware(['auth'])->group(function () {
    // Langkah 1: Detail pembelian + pilih metode pembayaran
    Route::get('/pelatihan/{slug}/pembelian', fn (string $slug) => Inertia::render('Payment/DetailPembelian', [
        'order' => ['courseId' => $slug, 'slug' => $slug, 'backHref' => '/beli-pelatihan'],
    ]))->name('payment.detail');

    // Langkah 2: Halaman pembayaran per metode
    Route::get('/pelatihan/{slug}/pembayaran/virtual-account', fn (string $slug) => Inertia::render('Payment/PembayaranVirtualAccount', [
        'payment' => ['courseId' => $slug, 'slug' => $slug, 'backHref' => '/beli-pelatihan'],
    ]))->name('payment.va');

    Route::get('/pelatihan/{slug}/pembayaran/qris', fn (string $slug) => Inertia::render('Payment/PembayaranQRIS', [
        'payment' => ['courseId' => $slug, 'slug' => $slug, 'backHref' => '/beli-pelatihan'],
    ]))->name('payment.qris');

    Route::get('/pelatihan/{slug}/pembayaran/e-wallet', fn (string $slug) => Inertia::render('Payment/PembayaranEWallet', [
        'payment' => ['courseId' => $slug, 'slug' => $slug, 'backHref' => '/beli-pelatihan'],
    ]))->name('payment.ewallet');

    // Langkah 3: Pembayaran berhasil / struk
    Route::get('/pelatihan/{slug}/pembayaran/berhasil', fn (string $slug) => Inertia::render('Payment/PembayaranBerhasil', [
        'receipt' => ['courseId' => $slug, 'slug' => $slug, 'backHref' => '/beli-pelatihan'],
    ]))->name('payment.success');

    // Webhook / callback dari payment gateway (server-to-server)
    Route::post('/payment/callback', fn () => response()->json(['status' => 'ok']))
        ->withoutMiddleware(['auth', 'verified'])
        ->name('payment.callback');
});

require __DIR__.'/auth.php';
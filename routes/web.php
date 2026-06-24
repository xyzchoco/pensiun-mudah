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

// Event Registration (Public - No Auth Required)
Route::post('/event/{slug}/register', function ($slug, Illuminate\Http\Request $request) {
    $request->validate([
        'full_name' => 'required|string|max:255',
        'email'     => 'required|email|max:255',
        'phone'     => 'required|string|max:20',
    ]);

    $event = \App\Models\Webinar::all()->first(function ($webinar) use ($slug) {
        return \Illuminate\Support\Str::slug($webinar->judul) === $slug;
    });

    $mappedEvent = null;
    if ($event) {
        if ($event->sisa_kuota > 0) {
            $event->decrement('sisa_kuota');
        }

        $mappedEvent = [
            'id' => $event->id,
            'slug' => \Illuminate\Support\Str::slug($event->judul),
            'title' => $event->judul,
            'date' => $event->tanggal,
            'time' => $event->jam,
            'platform' => $event->jenis_event === 'Online' ? 'Google Meet' : $event->lokasi_link,
        ];
    }

    return redirect()->route('event.pendaftaran-berhasil')->with('registered_event', $mappedEvent);
})->name('event.register');

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

    Route::get('/korporat/profil-perusahaan/edit', function () {
        $profile = auth()->user()->corporateProfile;
        return Inertia::render('Korporat/EditProfilPerusahaan', [
            'profile' => $profile,
        ]);
    })->name('korporat.profil-perusahaan.edit');

    Route::get('/korporat/pelatihan/{slug}', [PelatihanController::class, 'show'])
    ->name('korporat.pelatihan.detail');

    Route::get('/korporat/pelatihan-dibeli', fn () => Inertia::render('Korporat/PelatihanDibeli'))
        ->name('korporat.pelatihan-dibeli');

    Route::get('/korporat/pembayaran-berhasil', fn () => Inertia::render('Korporat/PembayaranBerhasilKorporat'))
        ->name('korporat.pembayaran-berhasil');

    Route::get('/korporat/modul/{slug}', fn ($slug) => Inertia::render('Korporat/DetailModulKaryawan', ['moduleName' => $slug]))
        ->name('korporat.modul.detail');

    // Dashboard Umum
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Pelatihan User
    Route::get('/beli-pelatihan', [PelatihanController::class, 'index'])->name('beli-pelatihan');
    Route::get('/pelatihan', [PelatihanController::class, 'myCourses'])->name('pelatihan.index');
    Route::get('/sertifikat', fn () => Inertia::render('Sertifikat'))->name('sertifikat');
    Route::get('/sertifikat/{id}', fn ($id) => Inertia::render('Sertifikat/DetailSertifikat', ['certificateId' => $id]))
        ->name('sertifikat.detail');

    // Event Pages
    Route::get('/event', function () {
        $events = \App\Models\Webinar::where('is_published', true)->latest()->get()->map(function ($event) {
            return [
                'id' => $event->id,
                'slug' => \Illuminate\Support\Str::slug($event->judul),
                'title' => $event->judul,
                'description' => $event->deskripsi,
                'thumbnail' => $event->image_path ? '/storage/' . preg_replace('/^public\//', '', $event->image_path) : '/images/event-placeholder.svg',
                'type' => $event->jenis_event === 'Online' ? 'Seminar Online' : 'Workshop Offline',
                'speaker' => $event->narasumber,
                'capacity' => $event->kapasitas,
                'available_slots' => $event->sisa_kuota,
                'location' => $event->jenis_event === 'Online' ? null : $event->lokasi_link,
                'platform' => $event->jenis_event === 'Online' ? 'Google Meet' : null,
                'start_date' => $event->tanggal,
                'start_time' => $event->jam,
                'is_online' => $event->jenis_event === 'Online',
            ];
        });

        return Inertia::render('Event/SemuaEvent', [
            'events' => $events
        ]);
    })->name('event.index');

    Route::get('/event/daftar', fn () => Inertia::render('Event/DaftarEvent'))->name('event.daftar');

    Route::get('/event/{slug}/daftar', function ($slug) {
        $event = \App\Models\Webinar::all()->first(function ($webinar) use ($slug) {
            return \Illuminate\Support\Str::slug($webinar->judul) === $slug;
        });

        $mappedEvent = null;
        if ($event) {
            $mappedEvent = [
                'id' => $event->id,
                'slug' => \Illuminate\Support\Str::slug($event->judul),
                'title' => $event->judul,
                'thumbnail' => $event->image_path ? '/storage/' . preg_replace('/^public\//', '', $event->image_path) : '/images/event-placeholder.svg',
                'description' => $event->deskripsi,
                'date' => $event->tanggal,
                'time' => $event->jam,
                'platform' => $event->jenis_event === 'Online' ? 'Google Meet' : $event->lokasi_link,
                'price' => 0,
            ];
        }

        return Inertia::render('Event/DaftarEvent', [
            'eventSlug' => $slug,
            'event' => $mappedEvent
        ]);
    })->name('event.daftar.slug');

    Route::get('/event/pendaftaran-berhasil', function () {
        return Inertia::render('Event/PendaftaranBerhasil', [
            'event' => session('registered_event')
        ]);
    })->name('event.pendaftaran-berhasil');

    Route::get('/event/semua', function () {
        return redirect()->route('event.index');
    })->name('event.semua');

    Route::get('/event/{slug}', function ($slug) {
        $event = \App\Models\Webinar::all()->first(function ($webinar) use ($slug) {
            return \Illuminate\Support\Str::slug($webinar->judul) === $slug;
        });

        $mappedEvent = null;
        if ($event) {
            $mappedEvent = [
                'id' => $event->id,
                'title' => $event->judul,
                'slug' => \Illuminate\Support\Str::slug($event->judul),
                'description' => $event->deskripsi,
                'thumbnail' => $event->image_path ? '/storage/' . preg_replace('/^public\//', '', $event->image_path) : '/images/event-placeholder.svg',
                'type' => $event->jenis_event === 'Online' ? 'Seminar Online' : 'Workshop Offline',
                'status' => 'Akan Datang',
                'speaker_name' => $event->narasumber,
                'speaker_title' => 'Narasumber',
                'speaker_photo' => '/images/event-placeholder.svg',
                'speaker_quote' => 'Mari tingkatkan kesiapan pensiun bersama.',
                'capacity' => $event->kapasitas,
                'registered_count' => max(0, $event->kapasitas - $event->sisa_kuota),
                'location' => $event->jenis_event === 'Online' ? 'Online' : $event->lokasi_link,
                'platform' => $event->jenis_event === 'Online' ? 'Google Meet' : null,
                'start_date' => $event->tanggal,
                'end_date' => null,
                'start_time' => $event->jam,
                'registration_deadline' => \Carbon\Carbon::parse($event->tanggal)->subDays(2)->format('Y-m-d'),
                'benefits' => [
                    'E-Sertifikat Resmi',
                    'Materi PPT & Rekaman',
                    'Sesi Konsultasi Grup',
                ],
                'topics' => [
                    'Pemahaman mendalam mengenai materi',
                    'Sesi tanya jawab interaktif',
                    'Tips dan trik praktis',
                ],
            ];
        }

        return Inertia::render('Event/DetailEvent', [
            'eventSlug' => $slug,
            'event' => $mappedEvent
        ]);
    })->name('event.detail');

    // Payment Pages
    Route::get('/pelatihan/{slug}/pembelian', [PembayaranController::class, 'checkout'])->name('payment.detail');
    Route::get('/payment/finish', [PembayaranController::class, 'finish'])->name('payment.finish');
    Route::get('/payment/{slug}/berhasil', [PembayaranController::class, 'success'])->name('payment.success');
    Route::get('/payment/berhasil', fn () => Inertia::render('Payment/PembayaranBerhasil'))->name('payment.berhasil');
    Route::get('/payment/ewallet', fn () => Inertia::render('Payment/PembayaranEWallet'))->name('payment.ewallet');
    Route::get('/payment/qris', fn () => Inertia::render('Payment/PembayaranQRIS'))->name('payment.qris');
    Route::get('/payment/virtual-account', fn () => Inertia::render('Payment/PembayaranVirtualAccount'))->name('payment.virtual-account');

    // Pelatihan Learning Pages
    Route::get('/pelatihan/kelas-saya', fn () => Inertia::render('Pelatihan/KelasSaya'))->name('pelatihan.kelas-saya');
    Route::get('/pelatihan/{slug}/konfirmasi-gratis', [PembayaranController::class, 'konfirmasiGratis'])->name('pelatihan.gratis.konfirmasi');
    Route::get('/pelatihan/konfirmasi-gratis', fn () => Inertia::render('Pelatihan/KonfirmasiPendaftaranGratis'))->name('pelatihan.konfirmasi-gratis');
    Route::get('/pelatihan/{id}/kelas', [PelatihanController::class, 'kelas'])->name('pelatihan.kelas');
    Route::get('/pelatihan/{id}/belajar', [PelatihanController::class, 'belajar'])->name('pelatihan.belajar');
    Route::get('/pelatihan/belajar/{id}', fn ($id) => redirect()->route('pelatihan.belajar', $id));
    Route::get('/pelatihan/{id}/kuis', [PelatihanController::class, 'kuis'])->name('pelatihan.kuis');
    Route::get('/pelatihan/kuis/{id}', fn ($id) => redirect()->route('pelatihan.kuis', $id));
    Route::get('/pelatihan/{id}/kuis/hasil', [PelatihanController::class, 'hasilKuis'])->name('pelatihan.hasil-kuis');
    Route::get('/pelatihan/hasil-kuis/{id}', fn ($id) => redirect()->route('pelatihan.hasil-kuis', $id));

    // Profile Pages
    Route::get('/profile/edit', fn () => Inertia::render('Profile/Edit'))->name('profile.edit.detail');

    // Other Pages
    Route::get('/detail-aktivitas', fn () => Inertia::render('DetailAktivitasPelatihan'))->name('detail-aktivitas');
    Route::get('/gabung-kelas', fn () => Inertia::render('GabungKelas'))->name('gabung-kelas');
    Route::get('/korporat/pilih-jadwal', fn () => Inertia::render('Korporat/PilihJadwal'))->name('korporat.pilih-jadwal');
    Route::get('/statistik-waktu-belajar', fn () => Inertia::render('StatistikWaktuBelajar'))->name('statistik-waktu');
    Route::get('/statistik-waktu', fn () => redirect()->route('statistik-waktu'));
    Route::get('/welcome', fn () => Inertia::render('Welcome'))->name('welcome');

    // Rute lain tetap sama...
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
});

require __DIR__.'/auth.php';
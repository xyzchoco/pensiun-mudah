<?php

use App\Http\Controllers\{ProfileController, HomeController, CourseController, DashboardController, PelatihanController, PembayaranController};
use App\Models\{LandingPage, Webinar, User, CourseCategory, Course, DashboardBanner};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Route, Auth};
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

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

// Event Registration (Public)
Route::post('/event/{slug}/register', function ($slug, Request $request) {
    $request->validate([
        'full_name' => 'required|string|max:255',
        'email'     => 'required|email|max:255',
        'phone'     => 'required|string|max:20',
    ]);

    $event = Webinar::all()->first(fn ($webinar) => \Illuminate\Support\Str::slug($webinar->judul) === $slug);

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

    // 1. AREA ONBOARDING
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

    Route::get('/korporat/verifikasi', fn () => Inertia::render('Korporat/VerifikasiKorporat'))->name('korporat.verifikasi');
    Route::post('/korporat/verifikasi', function (Request $request) {
        $data = $request->validate([
            'namaPerusahaan' => ['required', 'string', 'max:255'],
            'jabatan'        => ['required', 'string', 'max:255'],
        ]);

        $user = $request->user();
        $user->forceFill(['kategori_pensiun' => session('pending_kategori', 'korporat')])->save();

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

    // 2. AREA TERPROTEKSI (Middleware 'onboarding')
    Route::middleware(['onboarding'])->group(function () {

        // Korporat
        Route::get('/korporat/dashboard', function () {
            return Inertia::render('Korporat/DashboardKorporat', [
                'banners' => DashboardBanner::where('is_active', true)->latest()->get(),
                'events'  => Webinar::where('is_published', true)->latest()->take(3)->get(),
            ]);
        })->name('korporat.dashboard');

        Route::get('/korporat/beli-pelatihan', function () {
            return Inertia::render('Korporat/BeliPelatihanKorporat', [
                'banners' => DashboardBanner::where('is_active', true)->latest()->get(),
                'courses' => Course::with('category')->latest()->get(),
            ]);
        })->name('korporat.beli-pelatihan');

        Route::get('/korporat/profil-perusahaan', fn () => Inertia::render('Korporat/ProfilPerusahaan'))->name('korporat.profil-perusahaan');
        Route::post('/korporat/profil-perusahaan/update', function (Request $request) {
            $data = $request->validate([
                'namaPerusahaan'  => ['required', 'string'],
                'jabatan'         => ['required', 'string'],
                'kategoriBisnis'  => ['required', 'string'],
                'emailPerusahaan' => ['required', 'email'],
                'alamatKantor'    => ['required', 'string'],
                'emailBisnis'     => ['required', 'email'],
                'noTelepon'       => ['required', 'string'],
            ]);
            $request->user()->corporateProfile()->update($data);
            return back()->with('message', 'Profil berhasil diperbarui!');
        })->name('korporat.profil-perusahaan.update');

        Route::get('/korporat/profil-perusahaan/edit', fn () => Inertia::render('Korporat/EditProfilPerusahaan', ['profile' => auth()->user()->corporateProfile]))->name('korporat.profil-perusahaan.edit');
        Route::get('/korporat/pelatihan/{slug}', [PelatihanController::class, 'show'])->name('korporat.pelatihan.detail');
        Route::get('/korporat/pelatihan-dibeli', fn () => Inertia::render('Korporat/PelatihanDibeli'))->name('korporat.pelatihan-dibeli');
        Route::get('/korporat/pembayaran-berhasil', fn () => Inertia::render('Korporat/PembayaranBerhasilKorporat'))->name('korporat.pembayaran-berhasil');
        Route::get('/korporat/modul/{slug}', fn ($slug) => Inertia::render('Korporat/DetailModulKaryawan', ['moduleName' => $slug]))->name('korporat.modul.detail');
        Route::get('/korporat/pilih-jadwal', fn () => Inertia::render('Korporat/PilihJadwal'))->name('korporat.pilih-jadwal');

        // Dashboard & Pelatihan Umum
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/beli-pelatihan', [PelatihanController::class, 'index'])->name('beli-pelatihan');
        Route::get('/pelatihan', [PelatihanController::class, 'myCourses'])->name('pelatihan.index');
        Route::get('/sertifikat', fn () => Inertia::render('Sertifikat'))->name('sertifikat');
        Route::get('/sertifikat/{id}', fn ($id) => Inertia::render('Sertifikat/DetailSertifikat', ['certificateId' => $id]))->name('sertifikat.detail');

        // Events
        $mapWebinar = function ($e) {
            $isOnline = $e->jenis_event === 'Online';
            $eventLink = $e->lokasi_link;

            return [
                'id' => $e->id,
                'slug' => \Illuminate\Support\Str::slug($e->judul),
                'title' => $e->judul,
                'description' => $e->deskripsi,
                'thumbnail' => $e->image_path ? '/storage/' . preg_replace('/^public\//', '', $e->image_path) : '/images/event-placeholder.svg',
                'image_path' => $e->image_path,
                'category' => $e->kategori,
                'type' => $isOnline ? 'Seminar Online' : 'Workshop Offline',
                'status' => $e->tanggal && $e->tanggal < now()->toDateString() ? 'Selesai' : 'Akan Datang',
                'speaker_name' => $e->narasumber,
                'speaker_title' => $e->kategori,
                'speaker_photo' => null,
                'speaker_quote' => null,
                'capacity' => (int) $e->kapasitas,
                'registered_count' => max(0, (int) $e->kapasitas - (int) $e->sisa_kuota),
                'available_slots' => (int) $e->sisa_kuota,
                'location' => $isOnline ? 'Online' : $eventLink,
                'platform' => $isOnline ? 'Google Meet' : null,
                'location_url' => $isOnline ? null : $eventLink,
                'platform_url' => $isOnline ? $eventLink : null,
                'is_online' => $isOnline,
                'start_date' => $e->tanggal,
                'date' => $e->tanggal,
                'start_time' => $e->jam,
                'time' => $e->jam,
                'registration_deadline' => $e->tanggal,
                'benefits' => [],
                'topics' => [],
            ];
        };

        Route::get('/event', function () use ($mapWebinar) {
            $events = Webinar::where('is_published', true)->latest()->get()->map($mapWebinar);
            return Inertia::render('Event/SemuaEvent', ['events' => $events]);
        })->name('event.index');

        Route::get('/event/daftar', fn () => Inertia::render('Event/DaftarEvent'))->name('event.daftar');
        Route::get('/event/{slug}/daftar', function ($slug) use ($mapWebinar) {
            $event = Webinar::where('is_published', true)
                ->get()
                ->first(fn($w) => \Illuminate\Support\Str::slug($w->judul) === $slug);

            abort_unless($event, 404);

            return Inertia::render('Event/DaftarEvent', [
                'eventSlug' => $slug,
                'event' => $mapWebinar($event)
            ]);
        })->name('event.daftar.slug');
        Route::get('/event/pendaftaran-berhasil', fn() => Inertia::render('Event/PendaftaranBerhasil', ['event' => session('registered_event')]))->name('event.pendaftaran-berhasil');
        Route::get('/event/{slug}', function ($slug) use ($mapWebinar) {
            $event = Webinar::where('is_published', true)
                ->get()
                ->first(fn($w) => \Illuminate\Support\Str::slug($w->judul) === $slug);

            abort_unless($event, 404);

            $relatedEvents = Webinar::where('is_published', true)
                ->where('id', '!=', $event->id)
                ->latest()
                ->take(3)
                ->get()
                ->map($mapWebinar);

            return Inertia::render('Event/DetailEvent', [
                'event' => $mapWebinar($event),
                'relatedEvents' => $relatedEvents,
            ]);
        })->name('event.detail');

        // Payments & Learning
        Route::get('/pelatihan/{slug}/pembelian', [PembayaranController::class, 'checkout'])->name('payment.detail');
        Route::get('/payment/finish', [PembayaranController::class, 'finish'])->name('payment.finish');
        Route::get('/payment/{slug}/berhasil', [PembayaranController::class, 'success'])->name('payment.success');
        Route::get('/payment/berhasil', fn () => Inertia::render('Payment/PembayaranBerhasil'))->name('payment.berhasil');
        Route::get('/payment/ewallet', fn () => Inertia::render('Payment/PembayaranEWallet'))->name('payment.ewallet');
        Route::get('/payment/qris', fn () => Inertia::render('Payment/PembayaranQRIS'))->name('payment.qris');
        Route::get('/payment/virtual-account', fn () => Inertia::render('Payment/PembayaranVirtualAccount'))->name('payment.virtual-account');
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

        // Profile & Misc
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::get('/profile/edit', fn () => Inertia::render('Profile/Edit'))->name('profile.edit.detail');
        Route::get('/detail-aktivitas', fn () => Inertia::render('DetailAktivitasPelatihan'))->name('detail-aktivitas');
        Route::get('/gabung-kelas', fn () => Inertia::render('GabungKelas'))->name('gabung-kelas');
        Route::get('/statistik-waktu-belajar', fn () => Inertia::render('StatistikWaktuBelajar'))->name('statistik-waktu');
        Route::get('/statistik-waktu', fn () => redirect()->route('statistik-waktu'));
        Route::get('/welcome', fn () => Inertia::render('Welcome'))->name('welcome');
    });
});

require __DIR__.'/auth.php';

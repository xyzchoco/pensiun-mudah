<?php

use App\Http\Controllers\{ProfileController, HomeController, CourseController, QuizController, DashboardController, PelatihanController, PembayaranController, SertifikatController, EventController, EventRegistrationController, ReviewController};
use App\Models\{LandingPage, Webinar, User, CourseCategory, Course, DashboardBanner, WebinarRegistration};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Route, Auth};
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;
use Laravel\Socialite\Facades\Socialite;

// ==========================================
// PUBLIC ROUTES
// ==========================================
Route::get('/', function () {
    $reviews = \App\Models\Review::with('user')
        ->latest()
        ->take(6)
        ->get()
        ->map(function ($review) {
            return [
                'name'       => $review->user->name ?? 'Peserta',
                'text'       => $review->comment ?? '',
                'rating'     => $review->rating,
                'avatar'     => $review->user->profile_photo_path
                    ? \Illuminate\Support\Facades\Storage::disk('public')->url($review->user->profile_photo_path)
                    : null,
            ];
        });

    return Inertia::render('Beranda', [
        'landing' => LandingPage::first(),
        'events' => Webinar::where('is_published', true)->latest()->take(6)->get(),
        'categories' => CourseCategory::withCount('courses')->get(),
        'reviews' => $reviews,
    ]);
})->name('beranda');

Route::get('/pelatihan/{course:slug}', [PelatihanController::class, 'show'])->name('pelatihan.detail');
Route::get('/pelatihan/{course}/detail-offline', [PelatihanController::class, 'detailOffline'])->name('pelatihan.detail-offline');

Route::get('/event-landing/{webinar:id}', [EventController::class, 'show'])->name('event-landing.detail');

Route::get('/katalog-pelatihan', function () {
    $categories = \App\Models\CourseCategory::all()->map(function ($cat) {
        return [
            'id' => $cat->id,
            'nama' => $cat->nama,
            'icon' => $cat->icon,
            'warna_bg_icon' => $cat->warna_bg_icon,
            'warna_teks_icon' => $cat->warna_teks_icon,
        ];
    });

    $courses = \App\Models\Course::with('category')
        ->withAvg('reviews', 'rating')
        ->withCount('reviews')
        ->where('status', 'published')
        ->where('is_visible_publik', true)
        ->latest()
        ->get()
        ->map(function ($course) {
            $priceVal = (float) $course->price;
            return [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'desc' => \Illuminate\Support\Str::limit(strip_tags($course->description), 100),
                'price' => $priceVal > 0 ? 'Rp ' . number_format($priceVal, 0, ',', '.') : 'GRATIS',
                'isFree' => $priceVal == 0,
                'category' => $course->category ? $course->category->nama : 'Umum',
                'category_warna' => $course->category ? ($course->category->warna_teks_icon ?? '#006B32') : '#006B32',
                'category_bg' => $course->category ? ($course->category->warna_bg_icon ?? '#E6F4EA') : '#E6F4EA',
                'rating' => $course->reviews_avg_rating ? round($course->reviews_avg_rating, 1) : 4.8,
                'reviews' => $course->reviews_count ?? 0,
                'thumbnail' => $course->thumbnail 
                    ? '/storage/' . preg_replace('/^public\//', '', $course->thumbnail) 
                    : null,
            ];
        });

    return Inertia::render('Landing/KatalogPelatihanLanding', [
        'categories' => $categories,
        'courses' => $courses,
        'banners' => \App\Models\DashboardBanner::where('is_active', true)->latest()->get(),
    ]);
})->name('katalog-pelatihan.landing');

// ==========================================
// WEBHOOK MIDTRANS
// ==========================================
Route::post('/midtrans/notification', [PembayaranController::class, 'webhook'])->name('midtrans.notification');

Route::get('/auth/google/redirect', fn () => Socialite::driver('google')->redirect())->name('google.redirect');

Route::get('/auth/google/callback', function () {
    $googleUser = Socialite::driver('google')->user();
    
    // Cek apakah user sudah terdaftar di database
    $user = User::where('email', $googleUser->email)->first();

    if ($user) {
        // Jika ADA, langsung login
        Auth::login($user);
        
        // Cek apakah sudah lewat masa onboarding
        if (!$user->kategori_pensiun) {
            return redirect()->route('onboarding.kategori');
        }
        
        return redirect()->intended($user->kategori_pensiun === 'korporat' ? '/korporat/dashboard' : '/dashboard');
    }

    return redirect()->route('register')->with([
        'error' => 'Akun belum terdaftar. Silakan registrasi terlebih dahulu.',
        'google_name' => $googleUser->name,
        'google_email' => $googleUser->email,
    ]);
});


// ==========================================
// PROTECTED ROUTES (Wajib Login)
// ==========================================
Route::middleware(['auth'])->group(function () {

    // Search
    Route::get('/search', [\App\Http\Controllers\SearchController::class, 'index'])->name('search');
    Route::get('/search/live', [\App\Http\Controllers\SearchController::class, 'live'])->name('search.live');

    // 1. AREA ONBOARDING
    Route::post('/belajar/catat-progres', [\App\Http\Controllers\LearningController::class, 'catatProgres'])->name('belajar.catat');

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
        Route::get('/korporat/dashboard', [\App\Http\Controllers\KorporatDashboardController::class, 'index'])->name('korporat.dashboard');

        Route::get('/korporat/beli-pelatihan', function () {
            return Inertia::render('Korporat/BeliPelatihanKorporat', [
                'banners' => DashboardBanner::where('is_active', true)->latest()->get(),
        'courses' => Course::with('category')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('status', 'published')
            ->where('is_visible_korporat', true)
            ->latest()
            ->get(),
            ]);
        })->name('korporat.beli-pelatihan');

        Route::get('/korporat/anggota', [\App\Http\Controllers\CorporateMemberController::class, 'index'])->name('korporat.anggota');
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

        Route::put('/korporat/profil-perusahaan/update', [\App\Http\Controllers\CorporateProfileController::class, 'update'])->name('korporat.profil.update');

        Route::get('/korporat/pelatihan-dibeli', [\App\Http\Controllers\KorporatPelatihanDibeliController::class, 'index'])->name('korporat.pelatihan-dibeli');

        // Notification
        Route::get('/notifikasi', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifikasi.index');

        Route::post('/notifikasi/{id}/baca', [\App\Http\Controllers\NotificationController::class, 'markRead'])->name('notifikasi.baca');

        Route::post('/notifikasi/baca-semua', [\App\Http\Controllers\NotificationController::class, 'markAllRead'])->name('notifikasi.baca-semua');

        Route::get('/korporat/profil-perusahaan/edit', fn () => Inertia::render('Korporat/EditProfilPerusahaan', ['profile' => auth()->user()->corporateProfile]))->name('korporat.profil-perusahaan.edit');
        Route::get('/korporat/pelatihan/{slug}/detail', function ($slug) {
            $course = Course::with(['category', 'lessons'])
                ->withAvg('reviews', 'rating')
                ->withCount('reviews')
                ->where('slug', $slug)->firstOrFail();

            $reviews = \App\Models\Review::with('user')
                ->where('course_id', $course->id)
                ->latest()
                ->get()
                ->map(function ($review) {
                    return [
                        'name'       => $review->user->name ?? 'Peserta',
                        'profession' => $review->user->kategori_pensiun === 'asn'
                            ? 'ASN/TNI/Polri'
                            : ($review->user->kategori_pensiun === 'korporat'
                                ? 'Karyawan Korporat'
                                : 'Peserta Publik'),
                        'text'       => $review->comment ?? '',
                        'rating'     => $review->rating,
                        'avatar'     => $review->user->profile_photo_path
                            ? \Illuminate\Support\Facades\Storage::disk('public')->url($review->user->profile_photo_path)
                            : null,
                    ];
                });

            $totalReviews = $reviews->count();
            $ratingAverage = $totalReviews > 0
                ? round($reviews->avg('rating'), 1)
                : 0;

            return Inertia::render('Korporat/DetailKelasKorporat', [
                'course' => $course,
                'backHref' => route('korporat.beli-pelatihan'),
                'reviews' => $reviews,
                'ratingAverage' => $ratingAverage,
                'totalReviews' => $totalReviews,
            ]);
        })->name('korporat.pelatihan.detail-kelas');
        Route::get(
            '/korporat/pelatihan/{slug}/pembelian-online',
            [PembayaranController::class, 'checkoutKorporat']
        )->name('korporat.pelatihan.pembelian-online');
        Route::get('/korporat/pelatihan-offline/{course:slug}', function (Course $course, Request $request) {
            $course->loadAvg('reviews', 'rating');
            $course->loadCount('reviews');
            // Pastikan course ditemukan, jika tidak akan 404 otomatis
            // Ambil data langsung dari objek course
            $title = $course->title;
            $description = strip_tags($course->description ?? '');
            $location = $course->location ?? 'Lokasi akan dikonfirmasi';
            $eventTime = $course->time ?? 'Jadwal akan dikonfirmasi';
            $price = $course->price;

            // Quantity bisa dari query param, default 1
            $qty = max(1, (int) $request->query('qty', 1));

            // Bangun scheduleHref dengan data yang konsisten
            $scheduleParams = http_build_query([
                'qty' => $qty,
                'location' => $location,
                'time' => $eventTime,
                'back' => $request->fullUrl(),
            ]);

            return Inertia::render('Korporat/DetailPelatihanOffline', [
                'title' => $title,
                'about' => $description,
                'location' => $location,
                'eventTime' => $eventTime,
                'price' => $price > 0 ? 'Rp ' . number_format($price, 0, ',', '.') : 'Gratis',
                'rawPrice' => $price,
                'backHref' => route('korporat.beli-pelatihan'),
                'scheduleHref' => route('korporat.pilih-jadwal', ['course' => $course->slug]) . '?' . $scheduleParams,
                'rating' => $course->rating ?? '4.8', // Default jika tidak ada
                'reviewCount' => $course->reviews_count ?? 124, // Default jika tidak ada
                'instructor' => $course->instructor ?? 'Instruktur akan dikonfirmasi', // Default jika tidak ada
                'duration' => $course->duration ?? 'Durasi akan dikonfirmasi', // Default jika tidak ada
                'quantity' => $qty, // Kirim quantity ke frontend
                'slug' => $course->slug,
            ]);
        })->name('korporat.pelatihan-offline.detail');
        // Route for hybrid purchase detail page - now calls checkoutKorporat
        Route::get('/korporat/pelatihan-hybrid/{slug}/pembelian', [PembayaranController::class, 'checkoutKorporat'])->name('korporat.pelatihan-hybrid.pembelian');
        // AJAX: Regenerate snap token tanpa reload halaman
        Route::post('/korporat/pelatihan-hybrid/{slug}/snap-token', [PembayaranController::class, 'regenerateSnapTokenKorporat'])->name('korporat.pelatihan-hybrid.snap-token');
        Route::get('/korporat/pelatihan-hybrid/{slug}', function ($slug, Request $request) {
            $course = Course::with(['category', 'lessons'])
                ->withAvg('reviews', 'rating')
                ->withCount('reviews')
                ->where('slug', $slug)->first();
            $price = $course?->price ?? (int) $request->query('price', 0);
            $title = $course?->title ?? $request->query('title', 'Kelas Hybrid Korporat');
            $description = strip_tags($course?->description ?? $request->query('description', ''));
            $purchaseParams = http_build_query([
                'qty' => max(1, (int) $request->query('qty', 5)),
                'title' => $title,
                'description' => $description,
                'price' => $price,
                'back' => $request->fullUrl(),
            ]);

            $reviews = \App\Models\Review::with('user')
                ->where('course_id', $course?->id)
                ->latest()
                ->get()
                ->map(function ($review) {
                    return [
                        'name'       => $review->user->name ?? 'Peserta',
                        'text'       => $review->comment ?? '',
                        'rating'     => $review->rating,
                        'avatar'     => $review->user->profile_photo_path
                            ? \Illuminate\Support\Facades\Storage::disk('public')->url($review->user->profile_photo_path)
                            : null,
                    ];
                });

            $totalReviews = $reviews->count();
            $ratingAverage = $totalReviews > 0
                ? round($reviews->avg('rating'), 1)
                : 0;

            return Inertia::render('Korporat/DetailPelatihanHybrid', [
                'course' => $course,
                'title' => $title,
                'about' => $description,
                'duration' => $request->query('time', $course?->time ?? 'Jadwal akan dikonfirmasi'),
                'hybridLocation' => $request->query('location', $course?->location ?? 'Lokasi akan dikonfirmasi'),
                'price' => $price > 0 ? 'Rp ' . number_format($price, 0, ',', '.') : 'Gratis',
                'backHref' => route('korporat.beli-pelatihan'),
                'purchaseHref' => route('korporat.pelatihan-hybrid.pembelian', $slug) . '?' . $purchaseParams,
                'reviews' => $reviews,
                'ratingAverage' => $ratingAverage,
                'totalReviews' => $totalReviews,
            ]);
        })->name('korporat.pelatihan-hybrid.detail');
        // Sertifikat publik
        Route::get('/sertifikat', [SertifikatController::class, 'index'])->name('sertifikat.index');
        Route::get('/sertifikat/{course}', [SertifikatController::class, 'show'])->name('sertifikat.show');
        Route::get('/sertifikat/{course}/download', [SertifikatController::class, 'download'])->name('sertifikat.download');

        Route::middleware(['auth'])->group(function () {
            Route::get('/korporat/pelatihan/{slug}', [PelatihanController::class, 'show'])->name('korporat.pelatihan.detail');
            Route::get('/korporat/modul/{slug}', fn ($slug) => Inertia::render('Korporat/DetailModulKaryawan', ['moduleName' => $slug]))->name('korporat.modul.detail');
            Route::get('/korporat/pilih-jadwal/{course:slug}', [\App\Http\Controllers\TrainingRequestController::class, 'pilihJadwal'])->name('korporat.pilih-jadwal');
            Route::post('/korporat/request-jadwal', [\App\Http\Controllers\TrainingRequestController::class, 'store'])->name('korporat.request-jadwal');
            Route::get('/korporat/request-ditinjau/{trainingRequest}', [\App\Http\Controllers\TrainingRequestController::class, 'statusRequest'])->name('korporat.request-ditinjau');
            Route::get('/korporat/pembayaran/{trainingRequest}', [PembayaranController::class, 'offlineCheckout'])->name('korporat.pembayaran');
            Route::post('/korporat/pembayaran/{trainingRequest}', [PembayaranController::class, 'prosesPembayaranOffline'])->name('korporat.pembayaran.proses');
            Route::post('/korporat/pembayaran/{trainingRequest}/finalize', [PembayaranController::class, 'finalizeOfflinePayment'])->name('korporat.pembayaran.finalize');
            Route::post('/korporat/pembayaran/snap-token/{trainingRequest}', [\App\Http\Controllers\TrainingRequestController::class, 'snapTokenOffline'])->name('korporat.pembayaran.snap-token');
            Route::get('/korporat/pembayaran-berhasil/{trainingRequest}', [\App\Http\Controllers\TrainingRequestController::class, 'pembayaranBerhasil'])->name('korporat.pembayaran-berhasil');
            Route::get('/korporat/modul/{slug}', [PelatihanController::class, 'detailModul'])->name('korporat.modul.detail');
            Route::get('/korporat/pilih-jadwal-hybrid/{course:slug}', [\App\Http\Controllers\TrainingRequestController::class, 'pilihJadwalHybrid'])->name('korporat.pilih-jadwal-hybrid');
            Route::post('/korporat/request-jadwal-hybrid', [\App\Http\Controllers\TrainingRequestController::class, 'storeJadwalHybrid'])->name('korporat.request-jadwal-hybrid');
            Route::get('/korporat/jadwal-berhasil', function (\Illuminate\Http\Request $request) {
                return Inertia::render('Korporat/JadwalBerhasil', [
                    'tanggal' => $request->query('tanggal'),
                    'jam' => $request->query('jam'),
                    'lokasi' => $request->query('lokasi'),
                ]);
            })->name('korporat.jadwal-berhasil');
        });

        // Dashboard & Pelatihan Umum
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/beli-pelatihan', [PelatihanController::class, 'index'])->name('beli-pelatihan');
        Route::get('/pelatihan', [PelatihanController::class, 'myCourses'])->name('pelatihan.index');

        // Events
        Route::get('/event', [EventController::class, 'index'])->name('event.index');
        Route::get('/event/pendaftaran-berhasil', [EventRegistrationController::class, 'berhasil'])->name('event.berhasil');

        Route::middleware('auth')->group(function () {
            Route::get('/event/{webinar}/daftar', [EventController::class, 'formDaftar'])->whereNumber('webinar')->name('event.daftar');
            Route::post('/event/{webinar}/daftar', [EventRegistrationController::class, 'daftar'])->whereNumber('webinar')->name('event.daftar.store');
        });

        Route::get('/event/{webinar}', [EventController::class, 'show'])->whereNumber('webinar')->name('event.detail');

        // Payments & Learning
        Route::get('/pelatihan/{course}/review', [ReviewController::class, 'create'])->name('pelatihan.review.create');
        Route::post('/pelatihan/{course}/review', [ReviewController::class, 'store'])->name('pelatihan.review.store');
        Route::post('/pelatihan/klaim-voucher', [PelatihanController::class, 'klaimVoucher'])->name('pelatihan.voucher.klaim');
        Route::get('/pelatihan/{slug}/pembelian', [PembayaranController::class, 'checkout'])->name('payment.detail');
        Route::get('/pembayaran/{orderId}/cek', [PembayaranController::class, 'cekStatus'])->name('pembayaran.cek');
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
        Route::post('/pelatihan/{id}/kuis/selesai', [PelatihanController::class, 'selesaiKuis'])->name('pelatihan.kuis.selesai');
        Route::post('/pelatihan/{id}/modul/{moduleId}/lanjut', [PelatihanController::class, 'lanjutModul'])->name('pelatihan.modul.lanjut');
        Route::get('/pelatihan/hasil-kuis/{id}', fn ($id) => redirect()->route('pelatihan.hasil-kuis', $id));
        Route::get('/pelatihan/{id}/download-bukti', [PelatihanController::class, 'downloadBuktiPendaftaran'])->name('pelatihan.download-bukti');

        // Profile & Misc
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::get('/profile/edit', fn () => Inertia::render('Profile/Edit'))->name('profile.edit.detail');
        Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo');
        Route::get('/detail-aktivitas', [App\Http\Controllers\LearningController::class, 'detailAktivitas'])->middleware(['auth'])->name('detail-aktivitas');
        Route::get('/gabung-kelas', fn () => Inertia::render('GabungKelas'))->name('gabung-kelas');
        Route::get('/statistik-waktu-belajar', fn () => Inertia::render('StatistikWaktuBelajar'))->name('statistik-waktu');
        Route::get('/statistik-waktu', fn () => redirect()->route('statistik-waktu'));
        Route::get('/welcome', fn () => Inertia::render('Welcome'))->name('welcome');
    });
});

Route::get('/jalankan-migrasi', function () {
    // Menjalankan migrasi database
    Artisan::call('migrate', ['--force' => true]);
    
    // Clear cache
    try {
        Artisan::call('optimize:clear');
    } catch (\Throwable $e) {
        // Ignore optimization error if functions are restricted
    }
    
    // Safe storage link fallback (prevents crash if exec() is disabled in hosting)
    try {
        $target = storage_path('app/public');
        $shortcut = public_path('storage');
        if (!file_exists($shortcut)) {
            @symlink($target, $shortcut);
        }
    } catch (\Throwable $e) {
        // Ignore if symlink/exec is disabled on hosting
    }
    
    return 'Migrasi Database dan Setup Berhasil!';
});

require __DIR__.'/auth.php';
require __DIR__.'/instansi.php';
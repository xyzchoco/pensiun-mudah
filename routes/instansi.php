<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DashboardBanner;
use App\Models\Course;
use App\Models\Webinar;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\TrainingRequestController;
use App\Http\Controllers\PelatihanController;
use Illuminate\Support\Carbon;

/*
|--------------------------------------------------------------------------
| Rute ASN / TNI / Polri (segmen: instansi)
|--------------------------------------------------------------------------
| Mirror 1:1 dari rute Korporat. URL prefix /instansi, nama rute instansi.*,
| dan render halaman dari folder resources/js/Pages/Instansi.
| Controller & model di-REUSE (sama persis dgn korporat) agar langsung jalan.
|
| Cara pasang: tambahkan baris ini di paling bawah routes/web.php:
|     require __DIR__.'/instansi.php';
*/

Route::middleware(['auth'])->group(function () {

    Route::get('/instansi/verifikasi', fn () => Inertia::render('Instansi/VerifikasiInstansi'))->name('instansi.verifikasi');
        Route::post('/instansi/verifikasi', function (Request $request) {
            $data = $request->validate([
                'namaPerusahaan' => ['required', 'string', 'max:255'],
                'jabatan'        => ['required', 'string', 'max:255'],
            ]);

            $user = $request->user();
            $user->forceFill(['kategori_pensiun' => session('pending_kategori', 'asn')])->save();

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
            return redirect()->route('instansi.dashboard');
        })->name('instansi.verifikasi.store');

    Route::middleware(['onboarding'])->group(function () {

        Route::get('/instansi/dashboard', [\App\Http\Controllers\InstansiDashboardController::class, 'index'])->name('instansi.dashboard');

                Route::get('/instansi/beli-pelatihan', function () {
                    return Inertia::render('Instansi/BeliPelatihanInstansi', [
                        'banners' => DashboardBanner::where('is_active', true)->latest()->get(),
                        'courses' => Course::with('category')
                            ->withAvg('reviews', 'rating')
                            ->withCount('reviews')
                            ->where('status', 'published')
                            ->where('is_visible_asn', true)
                            ->latest()
                            ->get(),
                    ]);
                })->name('instansi.beli-pelatihan');

                Route::get('/instansi/anggota', [\App\Http\Controllers\CorporateMemberController::class, 'index'])->name('instansi.anggota');
                Route::get('/instansi/profil-perusahaan', fn () => Inertia::render('Instansi/ProfilPerusahaanInstansi'))->name('instansi.profil-perusahaan');
                Route::post('/instansi/profil-perusahaan/update', function (Request $request) {
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
                })->name('instansi.profil-perusahaan.update');

                Route::put('/instansi/profil-perusahaan/update', [\App\Http\Controllers\CorporateProfileController::class, 'update'])->name('instansi.profil.update');

                Route::get('/instansi/pelatihan-dibeli', [\App\Http\Controllers\InstansiPelatihanDibeliController::class, 'index'])->name('instansi.pelatihan-dibeli');

                Route::get('/instansi/profil-perusahaan/edit', fn () => Inertia::render('Instansi/EditProfilPerusahaanInstansi', ['profile' => auth()->user()->corporateProfile]))->name('instansi.profil-perusahaan.edit');
                Route::get('/instansi/pelatihan/{slug}/detail', function ($slug) {
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

                    return Inertia::render('Instansi/DetailKelasInstansi', [
                        'course' => $course,
                        'backHref' => route('instansi.beli-pelatihan'),
                        'reviews' => $reviews,
                        'ratingAverage' => $ratingAverage,
                        'totalReviews' => $totalReviews,
                    ]);
                })->name('instansi.pelatihan.detail-kelas');
                Route::get(
                    '/instansi/pelatihan/{slug}/pembelian-online',
                    [PembayaranController::class, 'checkoutKorporat']
                )->name('instansi.pelatihan.pembelian-online');

                Route::get('/instansi/pelatihan-offline/{slug}', function ($slug, Request $request) {
                    $course = Course::with('category')
                        ->withAvg('reviews', 'rating')
                        ->withCount('reviews')
                        ->where('slug', $slug)->firstOrFail();
                    $qty = max(1, (int) $request->query('qty', 1));

                    $eventDate = $course->tanggal_default
                        ? Carbon::parse($course->tanggal_default)->locale('id')->isoFormat('dddd, D MMMM YYYY')
                        : 'Tanggal akan dikonfirmasi';

                    return Inertia::render('Instansi/DetailPelatihanOfflineInstansi', [
                        'title'      => $course->title,
                        'about'      => strip_tags($course->description ?? ''),
                        'location'   => $course->lokasi_default ?? 'Lokasi akan dikonfirmasi',
                        'eventDate'  => $eventDate,
                        'eventTime'  => $course->jadwal_default ?? 'Jadwal akan dikonfirmasi',
                        'instructor' => $course->instruktur ?? 'Instruktur akan diumumkan',
                        'duration'   => $course->durasi ?? '-',
                        'price'      => $course->price > 0
                            ? 'Rp ' . number_format($course->price, 0, ',', '.')
                            : 'Gratis',
                        'quantity'   => $qty,
                        'backHref'   => route('instansi.beli-pelatihan'),
                        'scheduleHref' => route('instansi.pilih-jadwal', [
                            'course' => $course->slug,
                            'qty'    => $qty,
                        ]),
                    ]);
                })->name('instansi.pelatihan-offline.detail');

                Route::get('/instansi/pelatihan-hybrid/{slug}/pembelian', function ($slug, Request $request) {
                    $course = Course::with('category')
                        ->withAvg('reviews', 'rating')
                        ->withCount('reviews')
                        ->where('slug', $slug)->first();
                    $quantity = max(1, (int) $request->query('qty', 1));
                    $price = $course?->price ?? (int) $request->query('price', 0);
                    $title = $course?->title ?? $request->query('title', 'Kelas Hybrid Instansi');
                    $description = strip_tags($course?->description ?? $request->query('description', ''));

                    $purchaseCourse = $course ?? [
                        'id' => $slug,
                        'title' => $title,
                        'description' => $description,
                        'price' => $price,
                        'category' => ['nama' => 'Hybrid'],
                    ];

                    return Inertia::render('Instansi/DetailPembelianHybridInstansi', [
                        'course' => $purchaseCourse,
                        'quantity' => $quantity,
                        'backHref' => $request->query('back', route('instansi.beli-pelatihan')),
                    ]);
                })->name('instansi.pelatihan-hybrid.pembelian');
                Route::get('/instansi/pelatihan-hybrid/{slug}', function ($slug, Request $request) {
                    $course = Course::with(['category', 'lessons'])
                        ->withAvg('reviews', 'rating')
                        ->withCount('reviews')
                        ->where('slug', $slug)->first();
                    $price = $course?->price ?? (int) $request->query('price', 0);
                    $title = $course?->title ?? 'Kelas Hybrid Instansi';
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

                    return Inertia::render('Instansi/DetailPelatihanHybridInstansi', [
                        'course' => $course,
                        'title' => $title,
                        'about' => $description,
                        'duration' => $course?->durasi ?? $request->query('time', 'Jadwal akan dikonfirmasi'),
                        'hybridLocation' => $course?->lokasi_default ?? $request->query('location', 'Lokasi akan dikonfirmasi'),
                        'price' => $price > 0 ? 'Rp ' . number_format($price, 0, ',', '.') : 'Gratis',
                        'backHref' => route('instansi.beli-pelatihan'),
                        'purchaseHref' => route('instansi.pelatihan-hybrid.pembelian', $slug) . '?' . $purchaseParams,
                        'reviews' => $reviews,
                        'ratingAverage' => $ratingAverage,
                        'totalReviews' => $totalReviews,
                    ]);
                })->name('instansi.pelatihan-hybrid.detail');
                Route::get('/instansi/pelatihan/{slug}', [PelatihanController::class, 'show'])->name('instansi.pelatihan.detail');
                Route::get('/instansi/pembayaran-berhasil/{trainingRequest}', [TrainingRequestController::class, 'pembayaranBerhasil'])
                    ->name('instansi.pembayaran-berhasil');
                Route::get('/instansi/pilih-jadwal/{course:slug}', [TrainingRequestController::class, 'pilihJadwal'])->name('instansi.pilih-jadwal');
                Route::post('/instansi/request-jadwal', [TrainingRequestController::class, 'store'])->name('instansi.request-jadwal');
                Route::get('/instansi/pembayaran/{trainingRequest}', [PembayaranController::class, 'offlineCheckout'])->name('instansi.pembayaran');
                Route::post('/instansi/pembayaran/{trainingRequest}', [PembayaranController::class, 'prosesPembayaranOffline'])->name('instansi.pembayaran.proses');
                Route::post('/instansi/pembayaran/{trainingRequest}/finalize', [PembayaranController::class, 'finalizeOfflinePayment'])->name('instansi.pembayaran.finalize');
                Route::get('/instansi/request-ditinjau/{trainingRequest}', [TrainingRequestController::class, 'statusRequest'])->name('instansi.request-ditinjau');

                // Tambahkan rute baru untuk snapTokenOffline
                Route::post('/instansi/pembayaran/snap-token/{trainingRequest}', [TrainingRequestController::class, 'snapTokenOffline'])->name('instansi.pembayaran.snap-token');

                Route::get('/instansi/modul/{slug}', [PelatihanController::class, 'detailModul'])->name('instansi.modul.detail');
                Route::get('/instansi/pilih-jadwal-hybrid/{course:slug}', [\App\Http\Controllers\TrainingRequestController::class, 'pilihJadwalHybrid'])->name('instansi.pilih-jadwal-hybrid');
                Route::post('/instansi/request-jadwal-hybrid', [\App\Http\Controllers\TrainingRequestController::class, 'storeJadwalHybrid'])->name('instansi.request-jadwal-hybrid');
                Route::get('/instansi/jadwal-berhasil', function (\Illuminate\Http\Request $request) {
                    return Inertia::render('Instansi/JadwalBerhasilInstansi', [
                        'tanggal' => $request->query('tanggal'),
                        'jam' => $request->query('jam'),
                        'lokasi' => $request->query('lokasi'),
                    ]);
                })->name('instansi.jadwal-berhasil');
    });
});
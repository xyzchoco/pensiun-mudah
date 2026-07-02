<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DashboardBanner;
use App\Models\Course;
use App\Models\Webinar;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\PelatihanController;

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

        Route::get('/instansi/dashboard', function () {
            $user = auth()->user();

            // Ambil 3 data voucher/kelas terakhir yang dibeli oleh korporat ini
            $purchasedCourses = \App\Models\CorporateVoucher::with('course.category')
                ->where('corporate_user_id', $user->user_id)
                ->latest()
                ->take(3) // Kita batasi 3 karena ada tombol "Lihat Semua"
                ->get()
                ->map(function ($voucher) {
                    return [
                        'id' => $voucher->course->id,
                        'slug' => $voucher->course->slug,
                        'title' => $voucher->course->title,
                        // Hilangkan tag HTML dari deskripsi
                        'desc' => \Illuminate\Support\Str::limit(strip_tags($voucher->course->description), 80),
                        'thumbnail' => $voucher->course->thumbnail,
                        'max_uses' => $voucher->max_uses,
                        'used_count' => $voucher->used_count,
                        'category_color' => $voucher->course->category->warna_bg_icon ?? '#006B32',
                    ];
                });

            // AMBIL DATA AKTIVITAS TERBARU DARI TABEL VOUCHER REDEMPTION
            // Cari id voucher apa aja yang dimiliki perusahaan ini
            $voucherIds = \App\Models\CorporateVoucher::where('corporate_user_id', $user->user_id)->pluck('id');

            // Tarik 5 riwayat klaim terakhir berdasarkan voucher tersebut
            $recentActivities = \App\Models\VoucherRedemption::with(['user', 'voucher.course'])
                ->whereIn('corporate_voucher_id', $voucherIds)
                ->latest('redeemed_at')
                ->take(5)
                ->get()
                ->map(function ($redemption) {
                    // Gunakan Carbon untuk bikin teks "5 menit yang lalu" otomatis!
                    \Carbon\Carbon::setLocale('id'); // Pastikan bahasa Indonesia
                    $timeAgo = \Carbon\Carbon::parse($redemption->redeemed_at)->diffForHumans();

                    return [
                        'variant' => 'join',
                        'text'    => $redemption->user->name . ' bergabung ke ' . $redemption->voucher->course->title,
                        'time'    => $timeAgo,
                    ];
                });

            // AMBIL DATA PROGRES BELAJAR KARYAWAN
            $memberProgressData = \App\Models\VoucherRedemption::with(['user', 'voucher.course'])
                ->whereIn('corporate_voucher_id', $voucherIds)
                ->latest('redeemed_at')
                ->take(5) // Ambil 5 progres terbaru
                ->get()
                ->map(function ($redemption) {
                    // Cari data progres di tabel enrollment
                    $enrollment = \App\Models\Enrollment::where('user_id', $redemption->user_id)
                        ->where('course_id', $redemption->voucher->course_id)
                        ->first();

                    $progress = $enrollment ? $enrollment->progress_persen : 0;
                    $name = $redemption->user->name;

                    // Bikin inisial nama (misal: Agus Setiawan -> AS)
                    $initials = collect(explode(' ', $name))
                        ->map(fn($p) => substr($p, 0, 1))
                        ->take(2)
                        ->implode('');

                    // Tentukan warna bar otomatis berdasarkan persentase
                    $colorClass     = $progress >= 80 ? 'bg-[#00A553]'   : ($progress >= 40 ? 'bg-[#FF8928]'   : 'bg-[#A8632A]');
                    $textColorClass = $progress >= 80 ? 'text-[#00A553]' : ($progress >= 40 ? 'text-[#FF8928]' : 'text-[#A8632A]');

                    return [
                        'initials'     => strtoupper($initials),
                        'name'         => $name,
                        'course'       => $redemption->voucher->course->title,
                        'percent'      => $progress,
                        'barColor'     => $colorClass,
                        'percentColor' => $textColorClass,
                    ];
                });

            return Inertia::render('Instansi/DashboardInstansi', [
                'banners'            => \App\Models\DashboardBanner::where('is_active', true)->latest()->get(),
                'events'             => \App\Models\Webinar::where('is_published', true)->latest()->take(3)->get(),
                'purchasedCourses'   => $purchasedCourses,
                'recentActivities'   => $recentActivities,
                'memberProgressData' => $memberProgressData, // Lempar ke React
            ]);
        })->name('instansi.dashboard');

                Route::get('/instansi/beli-pelatihan', function () {
                    return Inertia::render('Instansi/BeliPelatihanInstansi', [
                        'banners' => DashboardBanner::where('is_active', true)->latest()->get(),
                        'courses' => Course::with('category')
                            ->where('status', 'published')
                            ->where('is_visible_asn', true) 
                            ->latest()
                            ->get(),
                    ]);
                })->name('instansi.beli-pelatihan');

                Route::get('/instansi/anggota', fn () => Inertia::render('Instansi/AnggotaInstansi'))->name('instansi.anggota');
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

                Route::get('/instansi/pelatihan-dibeli', function () {
                    $user = auth()->user();

                    // Ambil SEMUA data voucher/kelas yang dibeli oleh korporat ini
                    $purchasedCourses = \App\Models\CorporateVoucher::with('course')
                        ->where('corporate_user_id', $user->user_id)
                        ->latest()
                        ->get()
                        ->map(function ($voucher) {
                            return [
                                'id' => $voucher->course->id,
                                'title' => $voucher->course->title,
                                'slug' => $voucher->course->slug,
                                'thumbnail' => $voucher->course->thumbnail,
                                'used_count' => $voucher->used_count,
                                'max_uses' => $voucher->max_uses,
                            ];
                        });

                    return Inertia::render('Instansi/PelatihanDibeliInstansi', [
                        'purchasedCourses' => $purchasedCourses
                    ]);
                })->name('instansi.pelatihan-dibeli');

                Route::get('/instansi/profil-perusahaan/edit', fn () => Inertia::render('Instansi/EditProfilPerusahaanInstansi', ['profile' => auth()->user()->corporateProfile]))->name('instansi.profil-perusahaan.edit');
                Route::get('/instansi/pelatihan/{slug}/detail', function ($slug) {
                    $course = Course::with(['category', 'lessons'])->where('slug', $slug)->firstOrFail();
                    return Inertia::render('Instansi/DetailKelasInstansi', [
                        'course' => $course,
                        'backHref' => route('instansi.beli-pelatihan'),
                    ]);
                })->name('instansi.pelatihan.detail-kelas');
                Route::get(
                    '/instansi/pelatihan/{slug}/pembelian-online',
                    [PembayaranController::class, 'checkoutKorporat']
                )->name('instansi.pelatihan.pembelian-online');
                Route::get('/instansi/pelatihan-offline/{slug}', function ($slug, Request $request) {
                    $course = Course::with('category')->where('slug', $slug)->first();
                    $price = $course?->price ?? (int) $request->query('price', 0);
                    $title = $course?->title ?? $request->query('title', 'Kelas Offline Instansi');
                    $location = $request->query('location', $course?->location ?? 'Lokasi akan dikonfirmasi');
                    $eventTime = $request->query('time', $course?->time ?? 'Jadwal akan dikonfirmasi');
                    $scheduleParams = http_build_query([
                        'course_id' => $course?->id ?? $slug,
                        'title' => $title,
                        'qty' => max(1, (int) $request->query('qty', 5)),
                        'price' => $price,
                        'location' => $location,
                        'time' => $eventTime,
                        'back' => $request->fullUrl(),
                    ]);

                    return Inertia::render('Instansi/DetailPelatihanOfflineInstansi', [
                        'title' => $title,
                        'about' => strip_tags($course?->description ?? $request->query('description', '')),
                        'location' => $location,
                        'eventTime' => $eventTime,
                        'price' => $price > 0 ? 'Rp ' . number_format($price, 0, ',', '.') : 'Gratis',
                        'backHref' => route('instansi.beli-pelatihan'),
                        'scheduleHref' => route('instansi.pilih-jadwal') . '?' . $scheduleParams,
                    ]);
                })->name('instansi.pelatihan-offline.detail');
                Route::get('/instansi/pelatihan-hybrid/{slug}/pembelian', function ($slug, Request $request) {
                    $course = Course::with('category')->where('slug', $slug)->first();
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
                    $course = Course::with('category')->where('slug', $slug)->first();
                    $price = $course?->price ?? (int) $request->query('price', 0);
                    $title = $course?->title ?? $request->query('title', 'Kelas Hybrid Instansi');
                    $description = strip_tags($course?->description ?? $request->query('description', ''));
                    $purchaseParams = http_build_query([
                        'qty' => max(1, (int) $request->query('qty', 5)),
                        'title' => $title,
                        'description' => $description,
                        'price' => $price,
                        'back' => $request->fullUrl(),
                    ]);

                    return Inertia::render('Instansi/DetailPelatihanHybridInstansi', [
                        'title' => $title,
                        'about' => $description,
                        'duration' => $request->query('time', $course?->time ?? 'Jadwal akan dikonfirmasi'),
                        'hybridLocation' => $request->query('location', $course?->location ?? 'Lokasi akan dikonfirmasi'),
                        'price' => $price > 0 ? 'Rp ' . number_format($price, 0, ',', '.') : 'Gratis',
                        'backHref' => route('instansi.beli-pelatihan'),
                        'purchaseHref' => route('instansi.pelatihan-hybrid.pembelian', $slug) . '?' . $purchaseParams,
                    ]);
                })->name('instansi.pelatihan-hybrid.detail');
                Route::get('/instansi/pelatihan/{slug}', [PelatihanController::class, 'show'])->name('instansi.pelatihan.detail');
                Route::get('/instansi/pembayaran-berhasil', fn () => Inertia::render('Instansi/PembayaranBerhasilInstansi'))->name('instansi.pembayaran-berhasil');
                Route::get('/instansi/modul/{slug}', fn ($slug) => Inertia::render('Instansi/DetailModulKaryawanInstansi', ['moduleName' => $slug]))->name('instansi.modul.detail');
                Route::get('/instansi/pilih-jadwal', function (Request $request) {
                    return Inertia::render('Instansi/PilihJadwalInstansi', [
                        'title' => $request->query('title', 'Kelas Offline Instansi'),
                        'location' => $request->query('location', 'Lokasi akan dikonfirmasi'),
                        'eventTime' => $request->query('time', 'Jadwal akan dikonfirmasi'),
                        'price' => (int) $request->query('price', 0),
                        'quantity' => max(1, (int) $request->query('qty', 5)),
                        'backHref' => $request->query('back', route('instansi.beli-pelatihan')),
                        'confirmHref' => route('instansi.pembayaran-berhasil'),
                    ]);
                })->name('instansi.pilih-jadwal');
                Route::get('/instansi/modul/{slug}', [PelatihanController::class, 'detailModul'])->name('instansi.modul.detail');
                Route::get('/instansi/pilih-jadwal-hybrid', fn () => Inertia::render('Instansi/PilihJadwalHybridInstansi'))->name('instansi.pilih-jadwal-hybrid');
                Route::get('/instansi/jadwal-berhasil', fn () => Inertia::render('Instansi/JadwalBerhasilInstansi'))->name('instansi.jadwal-berhasil');
    });
});

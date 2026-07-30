<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DashboardBanner;
use App\Models\Webinar;
use App\Models\CorporateVoucher;
use App\Models\User as AppModelsUser;
use App\Models\VoucherRedemption; // Added for recentActivities
use App\Models\Enrollment; // Added for memberProgressData
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Traits\HasRecentActivities;

class InstansiDashboardController extends Controller
{
    use HasRecentActivities;

    public function index()
    {
        $user = Auth::user();
        $RECENT_LIMIT = 4;

        // Ambil 3 data voucher/kelas terakhir yang dibeli oleh instansi ini
        $purchasedCourses = CorporateVoucher::with('course.category')
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
                    'desc' => Str::limit(strip_tags($voucher->course->description), 80),
                    'thumbnail' => $voucher->course->thumbnail,
                    'max_uses' => $voucher->max_uses,
                    'used_count' => $voucher->used_count,
                    'category_color' => $voucher->course->category->warna_bg_icon ?? '#006B32',
                ];
            });

        // AMBIL DATA AKTIVITAS TERBARU DARI TABEL VOUCHER REDEMPTION
        // Cari id voucher apa aja yang dimiliki perusahaan ini
        $voucherIds = CorporateVoucher::where('corporate_user_id', $user->user_id)->pluck('id');

        // Tarik 4 riwayat klaim terakhir berdasarkan voucher tersebut
        $recentActivities = VoucherRedemption::with(['user', 'voucher.course'])
            ->whereIn('corporate_voucher_id', $voucherIds)
            ->latest('redeemed_at')
            ->take($RECENT_LIMIT)
            ->get()
            ->map(function ($redemption) {
                // Gunakan Carbon untuk bikin teks "5 menit yang lalu" otomatis!
                Carbon::setLocale('id'); // Pastikan bahasa Indonesia
                $timeAgo = Carbon::parse($redemption->redeemed_at)->diffForHumans();

                return [
                    'variant' => 'join',
                    'text'    => ($redemption->user?->name ?? 'Seseorang') . ' bergabung ke ' . ($redemption->voucher->course?->title ?? 'Pelatihan Tidak Dikenal'),
                    'time'    => $timeAgo,
                ];
            });

        // AMBIL DATA PROGRES BELAJAR KARYAWAN
        $memberProgressData = VoucherRedemption::with(['user', 'voucher.course'])
            ->whereIn('corporate_voucher_id', $voucherIds)
            ->latest('redeemed_at')
            ->take($RECENT_LIMIT)
            ->get()
            ->map(function ($redemption) {
                $enrollment = Enrollment::where('user_id', $redemption->user_id)
                    ->where('course_id', $redemption->voucher->course_id)
                    ->first();

                $progress = $enrollment ? $enrollment->progress_persen : 0;
                $user = $redemption->user;

                return [
                    'name'     => $user?->name ?? 'Seseorang',
                    'photo'    => $user?->profile_photo_path ? \Illuminate\Support\Facades\Storage::disk('public')->url($user->profile_photo_path) : null,
                    'course'   => $redemption->voucher->course?->title ?? 'Pelatihan Tidak Dikenal',
                    'progress' => $progress,
                ];
            });

        return Inertia::render('Instansi/DashboardInstansi', [
            'banners'            => DashboardBanner::where('is_active', true)->latest()->get(),
            'events'             => Webinar::where('is_published', true)->latest()->take(3)->get(),
            'purchasedCourses'   => $purchasedCourses,
            'recentActivities'   => $this->recentActivities($user), // Gunakan trait
            'memberProgressData' => $memberProgressData, // Lempar ke React
        ]);
    }
}
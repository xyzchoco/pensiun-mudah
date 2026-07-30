<?php

namespace App\Http\Controllers;

use App\Models\CorporateVoucher;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\VoucherRedemption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CorporateMemberController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $pembeliId = $user->user_id;

        // Pastikan hanya user korporat/instansi yang bisa mengakses
        if (!in_array($user->kategori_pensiun, ['korporat', 'asn'])) {
            abort(403, 'Akses Ditolak: Anda bukan pengguna korporat atau instansi.');
        }

        // TOTAL pelatihan yang dibeli pihak login (course unik dari semua vouchernya) — hitung SEKALI
        $totalPelatihanDibeli = CorporateVoucher::where('corporate_user_id', $pembeliId)
            ->pluck('course_id')
            ->unique()
            ->count();

        // Ambil user unik yang redeem voucher milik pembeli ini (paginate anggotanya)
        $anggotaPaginator = User::query()
            ->whereHas('voucherRedemptions.voucher', fn ($q) => $q->where('corporate_user_id', $pembeliId))
            ->paginate(10);

        // Untuk tiap anggota, hitung: daftar course (dari voucher pembeli ini), progres rata2, jumlah diikuti/total dibeli
        $members = collect($anggotaPaginator->items())->map(function ($u) use ($pembeliId, $totalPelatihanDibeli) {
            // course_id yg didapat user ini DARI voucher pembeli login
            $redemptions = VoucherRedemption::where('user_id', $u->user_id)
                ->whereHas('voucher', fn ($q) => $q->where('corporate_user_id', $pembeliId))
                ->with('voucher.course')
                ->get();

            $courses = $redemptions->pluck('voucher.course')->filter()->unique('id');
            $courseIds = $courses->pluck('id');

            // Enrollment user tsb untuk course-course itu (buat progres)
            $enrolls = Enrollment::where('user_id', $u->user_id)
                ->whereIn('course_id', $courseIds)
                ->get();

            $diikuti   = $courses->count();
            $avgProg   = $enrolls->count() ? round($enrolls->avg('progress_persen')) : 0;

            return [
                'name'      => $u->name,
                'email'     => $u->email,
                'photo'     => $u->profile_photo_path ? \Illuminate\Support\Facades\Storage::disk('public')->url($u->profile_photo_path) : null,
                'progress'  => $avgProg,
                'done'      => "{$diikuti} dari {$totalPelatihanDibeli}",
                'trainings' => $courses->pluck('title')->implode(', '),
            ];
        })->all();

        // Stat cards
        $totalAnggota = User::whereHas('voucherRedemptions.voucher',
            fn ($q) => $q->where('corporate_user_id', $pembeliId))->count();

        // rata-rata progres seluruh anggota (hanya untuk pelatihan yang dibeli pihak ini)
        $memberIds = VoucherRedemption::whereHas('voucher', fn ($q) => $q->where('corporate_user_id', $pembeliId))
            ->pluck('user_id')
            ->unique();

        $corporateCourseIds = CorporateVoucher::where('corporate_user_id', $pembeliId)
            ->pluck('course_id')
            ->unique();

        $rataProgres = round(
            Enrollment::whereIn('user_id', $memberIds)
                ->whereIn('course_id', $corporateCourseIds)
                ->avg('progress_persen') ?? 0
        );

        $viewName = $user->kategori_pensiun === 'asn'
            ? 'Instansi/AnggotaInstansi'
            : 'Korporat/AnggotaKorporat';

        return Inertia::render($viewName, [
            'members'      => $members,
            'totalAnggota' => $totalAnggota,
            'rataProgres'  => $rataProgres,
            'pagination'   => [
                'current' => $anggotaPaginator->currentPage(),
                'last'    => $anggotaPaginator->lastPage(),
                'from'    => $anggotaPaginator->firstItem(),
                'to'      => $anggotaPaginator->lastItem(),
                'total'   => $anggotaPaginator->total(),
            ],
        ]);
    }
}
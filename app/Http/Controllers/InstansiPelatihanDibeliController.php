<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CorporateVoucher;
use Illuminate\Support\Facades\Auth;

class InstansiPelatihanDibeliController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Ambil SEMUA data voucher/kelas yang dibeli oleh instansi ini
        $purchasedCourses = CorporateVoucher::with('course')
            ->where('corporate_user_id', $user->user_id)
            ->latest()
            ->get()
            ->map(function ($voucher) {
                return [
                    'id'         => $voucher->course->id,
                    'title'      => $voucher->course->title,
                    'slug'       => $voucher->course->slug,
                    'thumbnail'  => $voucher->course->thumbnail,
                    'code'       => $voucher->code,        // kode voucher untuk dibagikan ke peserta
                    'voucher_id' => $voucher->id,
                    'used_count' => $voucher->used_count,
                    'max_uses'   => $voucher->max_uses,
                    'sisa_kuota' => $voucher->max_uses - $voucher->used_count,
                ];
            });

        return Inertia::render('Instansi/PelatihanDibeliInstansi', [
            'purchasedCourses' => $purchasedCourses
        ]);
    }
}
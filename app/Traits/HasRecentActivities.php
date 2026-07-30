<?php

namespace App\Traits;

use App\Models\User as AppModelsUser;
use App\Models\VoucherRedemption;
use App\Models\QuizAttempt; // Assuming QuizAttempt model exists
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

trait HasRecentActivities
{
    private function recentActivities(AppModelsUser $pembeli): array
    {
        // Karyawan = user yang redeem voucher milik pembeli ini
        $employeeIds = VoucherRedemption::whereHas(
            'voucher',
            fn ($q) => $q->where('corporate_user_id', $pembeli->user_id)
        )->pluck('user_id')->unique();

        // 1) Aktivitas BERGABUNG
        $joins = VoucherRedemption::whereHas(
            'voucher',
            fn ($q) => $q->where('corporate_user_id', $pembeli->user_id)
        )
            ->with(['user', 'voucher.course'])
            ->latest('redeemed_at')
            ->take(15)
            ->get()
            ->map(fn ($r) => [
                'variant'  => 'join',
                'text'     => ($r->user?->name ?? 'Seseorang') . ' bergabung dengan pelatihan ' . ($r->voucher?->course?->title ?? 'sebuah pelatihan'),
                'time_raw' => $r->redeemed_at,
            ]);

        // 2) Aktivitas KUIS (hanya kalau tabel quiz_attempts ada)
        $quizzes = collect();
        if (Schema::hasTable('quiz_attempts') && $employeeIds->isNotEmpty()) {
            $quizzes = QuizAttempt::whereIn('user_id', $employeeIds)
                ->with(['user', 'quiz'])
                ->latest('submitted_at')
                ->take(15)
                ->get()
                ->map(fn ($a) => [
                    'variant'  => 'done',
                    'text'     => ($a->user?->name ?? 'Seseorang') . ' menyelesaikan ' . ($a->quiz?->title ?? 'Kuis'),
                    'time_raw' => $a->submitted_at,
                ]);
        }

        // Gabung, urut terbaru, ambil 10, format waktu relatif Bahasa Indonesia
        return $joins->concat($quizzes)
            ->filter(fn ($a) => $a['time_raw'] !== null)
            ->sortByDesc('time_raw')
            ->take(10)
            ->map(fn ($a) => [
                'variant' => $a['variant'],
                'text'    => $a['text'],
                'time'    => Carbon::parse($a['time_raw'])->locale('id')->diffForHumans(),
            ])
            ->values()
            ->all();
    }
}
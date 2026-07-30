<?php

namespace App\Filament\Widgets;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\TrainingRequest;
use App\Models\Transaction;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalRevenue = Transaction::where('status', 'success')->sum('nominal');
        $pendingTransactions = Transaction::where('status', 'pending')->count();
        $failedTransactions = Transaction::where('status', 'failed')->count();
        $successTransactions = Transaction::where('status', 'success')->count();

        $totalUsers = User::count();
        $publikUsers = User::where('kategori_pensiun', 'publik')->count();
        $asnUsers = User::where('kategori_pensiun', 'asn')->count();
        $korporatUsers = User::where('kategori_pensiun', 'korporat')->count();

        $totalCourses = Course::where('status', 'published')->count();
        $totalEnrollments = Enrollment::count();
        $pendingRequests = TrainingRequest::where('status', TrainingRequest::MENUNGGU_APPROVAL)->count();

        return [
            Stat::make('Total Pendapatan', 'Rp ' . number_format($totalRevenue, 0, ',', '.'))
                ->description('Dari transaksi sukses')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),

            Stat::make('Transaksi Sukses', $successTransactions)
                ->description($pendingTransactions . ' pending / ' . $failedTransactions . ' failed')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Transaksi Pending', $pendingTransactions)
                ->description('Menunggu pembayaran')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),

            Stat::make('Transaksi Gagal', $failedTransactions)
                ->description('Pembayaran tidak berhasil')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),

            Stat::make('Total Pengguna', $totalUsers)
                ->description($publikUsers . ' Publik / ' . $asnUsers . ' ASN / ' . $korporatUsers . ' Korporat')
                ->descriptionIcon('heroicon-m-users')
                ->color('info'),

            Stat::make('Course Terbit', $totalCourses)
                ->description('Total enrollment: ' . $totalEnrollments)
                ->descriptionIcon('heroicon-m-book-open')
                ->color('primary'),

            Stat::make('Training Request', $pendingRequests)
                ->description('Menunggu approval')
                ->descriptionIcon('heroicon-m-document-text')
                ->color($pendingRequests > 0 ? 'warning' : 'success'),
        ];
    }
}
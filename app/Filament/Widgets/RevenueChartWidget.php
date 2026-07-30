<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class RevenueChartWidget extends ChartWidget
{
    protected ?string $heading = 'Pendapatan Bulanan';
    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $data = Transaction::where('status', 'success')
            ->where('created_at', '>=', now()->subMonths(12))
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as bulan"),
                DB::raw('SUM(nominal) as total')
            )
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Pendapatan (Rp)',
                    'data' => $data->pluck('total')->toArray(),
                    'backgroundColor' => '#36A2EB',
                    'borderColor' => '#9BD0F5',
                    'fill' => false,
                ],
            ],
            'labels' => $data->pluck('bulan')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
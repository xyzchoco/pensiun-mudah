<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentTransactionsWidget extends BaseWidget
{
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Transaction::query()
                    ->with(['user.corporateProfile', 'course'])
                    ->latest()
                    ->limit(10)
            )
            ->columns([
                Tables\Columns\TextColumn::make('nomor_transaksi')
                    ->label('No. Transaksi')
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Pengguna')
                    ->formatStateUsing(function ($state, Transaction $record) {
                        $user = $record->user;
                        if (!$user) return '-';

                        $company = $user->corporateProfile?->nama_perusahaan;
                        if ($company) {
                            return strtolower($user->name) === 'korporat'
                                ? $company
                                : "{$user->name} ({$company})";
                        }

                        return $user->name ?? '-';
                    })
                    ->searchable(query: function ($query, string $search) {
                        $query->whereHas('user', function ($q) use ($search) {
                            $q->where('name', 'ilike', "%{$search}%")
                              ->orWhere('email', 'ilike', "%{$search}%")
                              ->orWhereHas('corporateProfile', function ($cq) use ($search) {
                                  $cq->where('nama_perusahaan', 'ilike', "%{$search}%");
                              });
                        });
                    }),
                Tables\Columns\TextColumn::make('course.title')
                    ->label('Course')
                    ->limit(30)
                    ->searchable(),
                Tables\Columns\TextColumn::make('nominal')
                    ->label('Nominal')
                    ->money('IDR'),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->searchable()
                    ->color(fn (string $state): string => match ($state) {
                        'success' => 'success',
                        'pending' => 'warning',
                        'failed' => 'danger',
                        'expired' => 'gray',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tanggal')
                    ->dateTime('d M Y H:i'),
            ])
            ->defaultPaginationPageOption(5);
    }
}
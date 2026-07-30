<?php

namespace App\Filament\Resources\SesiSeminars\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use App\Models\Notification;
use App\Models\Enrollment;

class SesiSeminarsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('judul')
                    ->label('Judul Sesi')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('course.title')
                    ->badge()
                    ->label('Kursus')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('tanggal')
                    ->label('Tanggal')
                    ->date('d M Y')
                    ->sortable(),
                TextColumn::make('jam')
                    ->label('Jam')
                    ->time('H:i')
                    ->sortable(),
                TextColumn::make('lokasi')
                    ->label('Lokasi')
                    ->searchable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'disetujui' => 'success',
                        'ditolak' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('peserta')
                    ->label('Peserta')
                    ->getStateUsing(function ($record) {
                        $attended = $record->absensi()->count();
                        $capacity = $record->kapasitas_ruangan;

                        if ($capacity === null) {
                            return "{$attended} / Tidak Terbatas";
                        }

                        $color = $attended > $capacity ? 'danger' : 'success';
                        return (string) new \Illuminate\Support\HtmlString("<span class='fi-badge fi-badge--{$color} fi-badge--size-md fi-badge--success fi-color-gray-700 flex items-center justify-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset'>{$attended} / {$capacity}</span>");
                    })
                    ->html()
                    ->sortable(query: function (Builder $query, string $direction) {
                        return $query->withCount('absensi')->orderBy('absensi_count', $direction);
                    }),
            ])
            ->filters([
                SelectFilter::make('course_id')
                    ->label('Kursus')
                    ->relationship('course', 'title')
                    ->searchable(),
                TernaryFilter::make('tanggal')
                    ->label('Status Tanggal')
                    ->trueLabel('Akan Datang')
                    ->falseLabel('Sudah Lewat')
                    ->nullable(false)
                    ->default(true)
                    ->queries(
                        true: fn (Builder $query) => $query->where('tanggal', '>=', Carbon::today()),
                        false: fn (Builder $query) => $query->where('tanggal', '<', Carbon::today()),
                    ),
            ])
            ->recordActions([
                EditAction::make(),
                Action::make('setujui')
                    ->label('Setujui')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->action(function ($record) {
                        $record->update(['status' => 'disetujui']);

                        \Filament\Notifications\Notification::make()
                            ->title('Sesi seminar disetujui')
                            ->success()
                            ->send();
                    }),
                Action::make('tolak')
                    ->label('Tolak')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->schema([
                        Textarea::make('alasan_penolakan')
                            ->label('Alasan Penolakan')
                            ->required()
                            ->maxLength(500),
                    ])
                    ->action(function (array $data, $record) {
                        $record->update([
                            'status' => 'ditolak',
                            'alasan_penolakan' => $data['alasan_penolakan'],
                        ]);

                        \Filament\Notifications\Notification::make()
                            ->title('Sesi seminar ditolak')
                            ->danger()
                            ->send();
                    }),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('tanggal', 'asc');
    }
}

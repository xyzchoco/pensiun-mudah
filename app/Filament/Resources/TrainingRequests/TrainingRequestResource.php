<?php

namespace App\Filament\Resources\TrainingRequests;

use App\Filament\Resources\TrainingRequests\Pages\CreateTrainingRequest;
use App\Filament\Resources\TrainingRequests\Pages\EditTrainingRequest;
use App\Filament\Resources\TrainingRequests\Pages\ListTrainingRequests;
use App\Filament\Resources\TrainingRequests\Schemas\TrainingRequestForm;
use App\Filament\Resources\TrainingRequests\Tables\TrainingRequestsTable;
use App\Models\TrainingRequest;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use App\Models\Notification;

class TrainingRequestResource extends Resource
{
    protected static ?string $model = TrainingRequest::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return TrainingRequestForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('course.title')
                    ->label('Kursus')
                    ->searchable()
                    ->wrap(),

                TextColumn::make('user.name')
                    ->label('Pemohon')
                    ->searchable(),

                TextColumn::make('jumlah_peserta')
                    ->label('Peserta')
                    ->suffix(' org'),

                TextColumn::make('tanggal_mulai')
                    ->label('Jadwal Diminta')
                    ->formatStateUsing(fn ($record) =>
                        $record->tanggal_mulai?->format('d M Y')
                        . ' — ' . $record->tanggal_selesai?->format('d M Y'))
                    ->wrap(),

                TextColumn::make('usulan_lokasi')
                    ->label('Usulan Lokasi')
                    ->placeholder('— (pakai default)')
                    ->wrap(),

                // Bedain jelas request custom vs booking default
                TextColumn::make('is_custom')
                    ->label('Jenis')
                    ->badge()
                    ->formatStateUsing(fn ($state) => $state ? 'Custom (perlu approval)' : 'Default')
                    ->color(fn ($state) => $state ? 'warning' : 'gray'),

                TextColumn::make('estimasi_harga')
                    ->label('Estimasi')
                    ->money('IDR'),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn ($state) => match ($state) {
                        TrainingRequest::MENUNGGU_APPROVAL => 'warning',
                        TrainingRequest::MENUNGGU_BAYAR    => 'info',
                        TrainingRequest::LUNAS             => 'success',
                        TrainingRequest::DITOLAK           => 'danger',
                        default                            => 'gray',
                    }),
            ])
            ->recordActions([
                // ===== SETUJUI =====
                Action::make('setujui')
                    ->label('Setujui')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    // Cuma muncul kalau masih nunggu approval
                    ->visible(fn (TrainingRequest $record) =>
                        $record->status === TrainingRequest::MENUNGGU_APPROVAL)
                    ->action(function (TrainingRequest $record) {
                        // Approve → lanjut ke tahap bayar
                        $record->update(['status' => TrainingRequest::MENUNGGU_BAYAR]);

                        // Notif ke instansi: silakan bayar (link ke halaman pembayaran)
                        Notification::send(
                            $record->user_id,
                            'Jadwal Disetujui 🎉',
                            "Request jadwal untuk \"{$record->course->title}\" telah disetujui. Silakan lanjutkan pembayaran.",
                            'success',
                            'Bayar Sekarang',
                            route('instansi.pembayaran', $record->request_id),
                        );

                        \Filament\Notifications\Notification::make()
                            ->title('Request disetujui')
                            ->success()
                            ->send();
                    }),

                // ===== TOLAK =====
                Action::make('tolak')
                    ->label('Tolak')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn (TrainingRequest $record) =>
                        $record->status === TrainingRequest::MENUNGGU_APPROVAL)
                    // Minta alasan penolakan
                    ->schema([
                        Textarea::make('alasan_penolakan')
                            ->label('Alasan Penolakan')
                            ->required()
                            ->maxLength(500),
                    ])
                    ->action(function (array $data, TrainingRequest $record) {
                        $record->update([
                            'status'           => TrainingRequest::DITOLAK,
                            'alasan_penolakan' => $data['alasan_penolakan'],
                        ]);

                        // Notif ke instansi: ditolak + alasannya
                        Notification::send(
                            $record->user_id,
                            'Jadwal Ditolak',
                            "Maaf, request jadwal untuk \"{$record->course->title}\" ditolak. Alasan: {$data['alasan_penolakan']}",
                            'danger',
                        );

                        \Filament\Notifications\Notification::make()
                            ->title('Request ditolak')
                            ->danger()
                            ->send();
                    }),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTrainingRequests::route('/'),
            'create' => CreateTrainingRequest::route('/create'),
            'edit' => EditTrainingRequest::route('/{record}/edit'),
        ];
    }
}

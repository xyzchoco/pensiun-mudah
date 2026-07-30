<?php

namespace App\Filament\Resources\Courses\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use App\Models\Course;

class CoursesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('thumbnail')
                    ->label('Gambar')
                    ->disk('public')
                    ->visibility('public')
                    ->defaultImageUrl(url('/images/placeholder.png'))
                    ->height(48),

                TextColumn::make('title')
                    ->label('Judul Kursus')
                    ->searchable()
                    ->sortable()
                    ->limit(30), // Dibatasi 30 huruf biar tabel gak kepanjangan

                TextColumn::make('category.icon')
                    ->label('Kategori')
                    ->sortable(),

                TextColumn::make('akses')
                    ->label('Target Akses')
                    ->getStateUsing(function (Course $record): string {
                        $target = [];
                        if ($record->is_visible_publik) $target[] = 'Publik';
                        if ($record->is_visible_asn) $target[] = 'ASN';
                        if ($record->is_visible_korporat) $target[] = 'Korporat';
                        return count($target) > 0 ? implode(', ', $target) : 'Tidak Ada';
                    }),

                TextColumn::make('tipe_kelas')
                    ->label('Tipe Kelas')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Online' => 'info',
                        'Offline' => 'warning',
                        'Hybrid' => 'success',
                        default => 'gray',
                    }),

                TextColumn::make('price')
                    ->label('Harga')
                    ->money('IDR') // Langsung diformat ke Rupiah
                    ->sortable(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'draft' => 'gray',
                        'published' => 'success',
                    }),
            ])
            ->filters([
                SelectFilter::make('course_type')
                    ->label('Akses')
                    ->options([
                        'free' => 'Gratis',
                        'premium' => 'Premium',
                    ]),
                SelectFilter::make('tipe_kelas')
                    ->label('Tipe Kelas')
                    ->options([
                        'Online' => 'Online',
                        'Offline' => 'Offline',
                        'Hybrid' => 'Hybrid',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()->requiresConfirmation(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()->requiresConfirmation(),
                ]),
            ]);
    }
}
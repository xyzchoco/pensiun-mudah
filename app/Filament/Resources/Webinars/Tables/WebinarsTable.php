<?php

namespace App\Filament\Resources\Webinars\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\SelectFilter;

class WebinarsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image_path')
                    ->disk('public')
                    ->label('Poster'),

                TextColumn::make('judul')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('kategori')
                    ->searchable(),

                TextColumn::make('jenis_event')
                    ->badge()
                    ->color(fn (string $state): string => $state === 'Online' ? 'info' : 'warning'),

                TextColumn::make('tanggal')
                    ->date('d M Y')
                    ->sortable(),

                TextColumn::make('jam')
                    ->time('H:i'),

                TextColumn::make('kapasitas'),

                TextColumn::make('sisa_kuota')
                    ->label('Sisa Kuota'),

                IconColumn::make('is_published')
                    ->boolean()
                    ->label('Publish'),
            ])
            ->filters([
                SelectFilter::make('jenis_event')
                    ->options(['Online' => 'Online', 'Offline' => 'Offline']),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
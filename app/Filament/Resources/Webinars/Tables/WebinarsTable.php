<?php

namespace App\Filament\Resources\Webinars\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\IconColumn;

class WebinarsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image_path')
                    ->label('Poster'),

                TextColumn::make('judul')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('kategori')
                    ->searchable(),

                TextColumn::make('narasumber'),

                TextColumn::make('tanggal')
                    ->date(),

                IconColumn::make('is_published')
                    ->boolean()
                    ->label('Publish'),
            ])
            ->filters([
                //
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

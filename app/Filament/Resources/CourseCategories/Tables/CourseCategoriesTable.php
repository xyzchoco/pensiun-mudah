<?php

namespace App\Filament\Resources\CourseCategories\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CourseCategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('category_name')
                    ->label('Nama Kategori')
                    ->searchable() // Biar bisa dicari lewat kolom search
                    ->sortable(),  // Biar bisa diurutin A-Z

                TextColumn::make('created_at')
                    ->label('Dibuat Pada')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true), // Sembunyiin default, tapi bisa dimunculin kalau butuh
            ])
            ->filters([
                // Filter belum terlalu butuh karena datanya simple
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()->requiresConfirmation(), // Tambah delete sekalian biar aman ada konfirmasinya
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()->requiresConfirmation(),
                ]),
            ]);
    }
}
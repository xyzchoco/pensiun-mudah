<?php

namespace App\Filament\Resources\CourseCategories\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\ColorColumn;
use Filament\Tables\Columns\TextColumn;

class CourseCategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('icon')
                    ->label('Nama ')
                    ->searchable()
                    ->weight('bold'),

                TextColumn::make('nama')
                    ->label('Label Kategori')
                    ->searchable()
                    ->sortable(),
                    
                TextColumn::make('deskripsi')
                    ->limit(20)
                    ->searchable(),
                
                ColorColumn::make('warna_bg_icon')
                    ->label('BG Icon'),
                    
                ColorColumn::make('warna_teks_icon')
                    ->label('Teks Icon'),
                
                TextColumn::make('courses_count')
                    ->counts('courses')
                    ->label('Jumlah Kursus')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
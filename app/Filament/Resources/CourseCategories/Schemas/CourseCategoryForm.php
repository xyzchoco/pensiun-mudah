<?php

namespace App\Filament\Resources\CourseCategories\Schemas;

use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Schema;

class CourseCategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('nama')
                    ->required()
                    ->maxLength(255),
                    
                Textarea::make('deskripsi')
                    ->nullable()
                    ->columnSpanFull(),

                FileUpload::make('gambar')
                    ->label('Gambar Kategori')
                    ->image()
                    ->disk('public') // Wajib public biar bisa diakses React
                    ->directory('kategori-images') // Masuk ke folder khusus
                    ->columnSpanFull(),
                    
                TextInput::make('icon')
                    ->label('Teks Label/Badge')
                    ->nullable()
                    ->placeholder('Contoh: Populer, Terbaru, Bisnis')
                    ->maxLength(50),
                    
                ColorPicker::make('warna_bg_icon')
                    ->label('Warna Background Icon')
                    ->nullable(),
                    
                ColorPicker::make('warna_teks_icon')
                    ->label('Warna Teks Icon')
                    ->nullable(),
            ]);
    }
}
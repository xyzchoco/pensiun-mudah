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
                TextInput::make('icon')
                    ->label('Nama Kategori')
                    ->nullable()
                    ->maxLength(50),

                TextInput::make('nama')
                    ->label('Label Kategori')
                    ->placeholder('Contoh: Populer, Terbaru, Bisnis')
                    ->required()
                    ->maxLength(255),
                    
                Textarea::make('deskripsi')
                    ->label('Deskripsi Kategori')
                    ->nullable()
                    ->columnSpanFull(),

                FileUpload::make('gambar')
                    ->label('Gambar Kategori')
                    ->image()
                    ->disk('public') // Wajib public biar bisa diakses React
                    ->directory('kategori-images') // Masuk ke folder khusus
                    ->columnSpanFull(),
                    
                ColorPicker::make('warna_bg_icon')
                    ->label('Warna Background Icon')
                    ->nullable(),
                    
                ColorPicker::make('warna_teks_icon')
                    ->label('Warna Teks Icon')
                    ->nullable(),
            ]);
    }
}
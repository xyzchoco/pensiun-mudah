<?php

namespace App\Filament\Resources\Courses\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\FileUpload;
use Illuminate\Support\Str;

class CourseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Relasi ke Pembuat (Admin/Instruktur) & Kategori
                Select::make('created_by')
                    ->relationship('creator', 'name')
                    ->label('Dibuat Oleh')
                    ->required(),
                
                Select::make('category_id')
                    ->relationship('category', 'nama')
                    ->label('Kategori Kursus')
                    ->required(),

                Select::make('tipe_kelas')
                    ->label('Tipe Kelas')
                    ->options([
                        'Online' => 'Online',
                        'Offline' => 'Offline',
                        'Hybrid' => 'Hybrid',
                    ])
                    ->required()
                    ->default('Online'),

                // Info Utama Kursus
                TextInput::make('title')
                    ->label('Judul Kursus')
                    ->required()
                    ->maxLength(100)
                    ->live(onBlur: true) 
                    ->afterStateUpdated(fn (string $operation, $state, $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),

                TextInput::make('slug')
                    ->label('URL Slug')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),

                RichEditor::make('description')
                    ->label('Deskripsi Kursus')
                    ->columnSpanFull(),

                FileUpload::make('thumbnail')
                    ->label('Thumbnail Kursus')
                    ->image()
                    ->disk('public')
                    ->directory('course-thumbnails'), // Nanti gambarnya tersimpan di folder ini

                // Harga & Status
                Select::make('course_type')
                    ->label('Tipe Kursus')
                    ->options([
                        'free' => 'Gratis (Free)',
                        'premium' => 'Berbayar (Premium)',
                    ])
                    ->required()
                    ->default('free'),

                TextInput::make('price')
                    ->label('Harga (Rp)')
                    ->numeric()
                    ->default(0)
                    ->prefix('Rp'),

                Select::make('status')
                    ->label('Status Publikasi')
                    ->options([
                        'draft' => 'Draft (Belum Rilis)',
                        'published' => 'Published (Rilis)',
                    ])
                    ->required()
                    ->default('draft'),
            ]);
    }
}
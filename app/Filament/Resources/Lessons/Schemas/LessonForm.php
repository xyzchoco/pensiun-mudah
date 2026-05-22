<?php

namespace App\Filament\Resources\Lessons\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Toggle;
use Illuminate\Support\Str;

class LessonForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('course_id')
                    ->relationship('course', 'title')
                    ->label('Bagian dari Kursus')
                    ->required()
                    ->searchable(), // Biar gampang dicari kalau kursusnya udah banyak

                TextInput::make('title')
                    ->label('Judul Materi (Contoh: Bab 1 - Pengenalan)')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (string $operation, $state, $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),

                TextInput::make('slug')
                    ->label('URL Slug')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),

                TextInput::make('video_url')
                    ->label('Link Video (YouTube/Vimeo)')
                    ->url() // Validasi harus format URL
                    ->nullable()
                    ->maxLength(255),

                TextInput::make('order')
                    ->label('Urutan Materi')
                    ->numeric()
                    ->default(1)
                    ->required(),

                Toggle::make('is_free')
                    ->label('Materi Gratis (Preview)')
                    ->default(false)
                    ->helperText('Aktifkan jika bab ini boleh ditonton tanpa perlu beli kursus.'),

                RichEditor::make('content')
                    ->label('Teks Penjelasan / Rangkuman')
                    ->columnSpanFull(),
            ]);
    }
}
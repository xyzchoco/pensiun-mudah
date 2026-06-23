<?php

namespace App\Filament\Resources\Lessons\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Toggle;

class LessonForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('course_id')
                    ->relationship('course', 'title')
                    ->label('Pilih Kursus')
                    ->required()
                    ->searchable(),

                TextInput::make('video_url')
                    ->label('Link Video Preview (YouTube)')
                    ->url()
                    ->required() // Preview harus ada videonya dong biar user tertarik
                    ->maxLength(255),

                Toggle::make('is_free')
                    ->label('Aktifkan Preview')
                    ->default(true)
                    ->helperText('Aktifkan agar user bisa menonton video trailer ini sebelum beli.'),

                RichEditor::make('content')
                    ->label('Deskripsi Singkat Cuplikan')
                    ->placeholder('Tulis kalimat pancingan biar user tertarik beli...')
                    ->columnSpanFull(),
            ]);
    }
}
<?php

namespace App\Filament\Resources\Enrollments\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;

class EnrollmentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->label('Nama Siswa')
                    ->required()
                    ->searchable(),

                Select::make('course_id')
                    ->relationship('course', 'title')
                    ->label('Kursus yang Diambil')
                    ->required()
                    ->searchable(),

                Select::make('status')
                    ->label('Status Akses')
                    ->options([
                        'active' => 'Aktif Belajar',
                        'completed' => 'Lulus / Selesai',
                        'dropped' => 'Dikeluarkan / Batal',
                    ])
                    ->default('active')
                    ->required(),

                TextInput::make('progress_percentage')
                    ->label('Persentase Progres (%)')
                    ->numeric()
                    ->default(0)
                    ->minValue(0)
                    ->maxValue(100)
                    ->helperText('Otomatis diupdate oleh sistem saat user menonton video, tapi admin bisa ubah manual.'),
            ]);
    }
}
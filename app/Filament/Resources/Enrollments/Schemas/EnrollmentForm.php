<?php

namespace App\Filament\Resources\Enrollments\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DateTimePicker; // Jangan lupa import ini
use Filament\Forms\Components\Toggle;         // Sama import ini juga

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

                TextInput::make('progress_persen')
                    ->label('Persentase Progres (%)')
                    ->numeric()
                    ->default(0)
                    ->minValue(0)
                    ->maxValue(100)
                    ->helperText('Otomatis diupdate oleh sistem saat user menonton video, tapi admin bisa ubah manual.'),

                // ==========================================
                // TAMBAHAN FIELD BIAR LENGKAP SAMA DATABASE
                // ==========================================
                DateTimePicker::make('tanggal_daftar')
                    ->label('Tanggal & Waktu Daftar')
                    ->default(now())
                    ->required()
                    ->helperText('Bisa diubah manual kalau mau masukin siswa dari tanggal lampau.'),

                Toggle::make('is_completed')
                    ->label('Status Kelulusan')
                    ->helperText('Aktifkan jika siswa sudah menyelesaikan seluruh modul.')
                    ->inline(false),

                DateTimePicker::make('tanggal_selesai')
                    ->label('Tanggal Selesai / Kelulusan')
                    ->helperText('Akan terisi otomatis oleh sistem saat lulus, tapi admin bebas mengubahnya.'),
            ]);
    }
}
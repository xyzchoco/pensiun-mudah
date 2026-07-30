<?php

namespace App\Filament\Resources\SesiSeminars\Schemas;

use App\Models\Course;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TimePicker;
use Filament\Schemas\Schema;

class SesiSeminarForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('course_id')
                    ->label('Kursus')
                    ->relationship('course', 'title', fn ($query) => $query->where('tipe_kelas', 'Hybrid'))
                    ->searchable()
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('judul')
                    ->label('Judul Sesi')
                    ->required()
                    ->maxLength(255)
                    ->columnSpanFull(),
                DatePicker::make('tanggal')
                    ->label('Tanggal')
                    ->required()
                    ->native(false)
                    ->displayFormat('d M Y')
                    ->locale('id')
                    ->columnSpan(1),
                TimePicker::make('jam')
                    ->label('Jam')
                    ->required()
                    ->native(false)
                    ->displayFormat('H:i')
                    ->columnSpan(1),
                TextInput::make('lokasi')
                    ->label('Lokasi')
                    ->required()
                    ->maxLength(255)
                    ->columnSpanFull(),
                TextInput::make('link_maps')
                    ->label('Link Google Maps')
                    ->url()
                    ->nullable()
                    ->maxLength(255)
                    ->columnSpanFull(),
                TextInput::make('kapasitas_ruangan')
                    ->label('Kapasitas Ruangan')
                    ->numeric()
                    ->minValue(1)
                    ->nullable()
                    ->columnSpan(1),
                Select::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Pending',
                        'disetujui' => 'Disetujui',
                        'ditolak' => 'Ditolak',
                    ])
                    ->live()
                    ->required()
                    ->default('disetujui')
                    ->columnSpan(1),
                Textarea::make('alasan_penolakan')
                    ->label('Alasan Penolakan')
                    ->nullable()
                    ->visible(fn ($get) => $get('status') === 'ditolak')
                    ->columnSpanFull(),
                Textarea::make('catatan')
                    ->label('Catatan')
                    ->nullable()
                    ->columnSpanFull(),
            ]);
    }
}

<?php

namespace App\Filament\Resources\Courses\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\DatePicker;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Notifications\Notification;
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
                        'Online'  => 'Online',
                        'Offline' => 'Offline',
                        'Hybrid'  => 'Hybrid',
                    ])
                    ->required()
                    ->default('Online')
                    ->live()
                    ->afterStateUpdated(function ($state, Get $get, Set $set) {
                        if (in_array($state, ['Offline', 'Hybrid']) && $get('is_visible_publik')) {
                            Notification::make()
                                ->title('Disesuaikan')
                                ->body('Kelas Offline & Hybrid otomatis disembunyikan dari Publik.')
                                ->warning()
                                ->send();
                            $set('is_visible_publik', false); // revert otomatis
                        }
                    }),

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
                    ->directory('course-thumbnails'),

                // Harga
                Select::make('course_type')
                    ->label('Tipe Kursus')
                    ->options([
                        'free'    => 'Gratis (Free)',
                        'premium' => 'Berbayar (Premium)',
                    ])
                    ->required()
                    ->default('free')
                    ->live()
                    ->afterStateUpdated(function ($state, Set $set) {
                        // Jika dipilih free, otomatis set harga ke 0
                        if ($state === 'free') {
                            $set('price', 0);
                        }
                    }),

                TextInput::make('price')
                    ->label('Harga (Rp)')
                    ->numeric()
                    ->default(0)
                    ->prefix('Rp')
                    ->visible(fn (Get $get) => $get('course_type') === 'premium') // Hanya tampil kalau premium
                    ->required(fn (Get $get) => $get('course_type') === 'premium'), // Wajib kalau premium

                // ==========================================
                // PENGATURAN KELAS OFFLINE
                // ==========================================
                Section::make('Detail Pelaksanaan Offline') // Changed title
                    ->description('Wajib diisi untuk kelas Offline. Jadi jadwal, lokasi & pemateri DEFAULT — sekaligus patokan sistem mendeteksi request custom dari instansi.')
                    // Section cuma muncul kalau tipe kelas Offline
                    ->visible(fn (Get $get) => $get('tipe_kelas') === 'Offline') // Conditional visibility
                    ->schema([
                        // ✅ FIELD PEMATERI/INSTRUKTUR (muncul otomatis untuk Offline)
                        TextInput::make('instruktur')
                            ->label('Pemateri / Instruktur')
                            ->placeholder('cth: Dr. Budi Santoso, M.M.')
                            ->maxLength(255)
                            ->required(fn (Get $get) => $get('tipe_kelas') === 'Offline'), // Conditional required

                        // ✅ DURASI (dipakai di halaman detail kelas offline)
                        TextInput::make('durasi')
                            ->label('Durasi')
                            ->placeholder('cth: 3 Hari / 12 Jam')
                            ->maxLength(100)
                            ->required(fn (Get $get) => $get('tipe_kelas') === 'Offline'), // Conditional required

                        DatePicker::make('tanggal_default')
                            ->label('Tanggal Mulai Default')
                            ->native(false)
                            ->minDate(now())
                            ->live()
                            ->required(fn (Get $get) => $get('tipe_kelas') === 'Offline'), // Conditional required

                        DatePicker::make('tanggal_selesai_default')
                            ->label('Tanggal Selesai Default')
                            ->native(false)
                            ->minDate(fn (Get $get) => $get('tanggal_default'))
                            ->required(fn (Get $get) => $get('tipe_kelas') === 'Offline'), // Conditional required

                        TextInput::make('lokasi_default')
                            ->label('Lokasi Default')
                            ->placeholder('cth: Pusat Komunitas Kota, Jl. Pertumbuhan 32')
                            ->maxLength(255)
                            ->required(fn (Get $get) => $get('tipe_kelas') === 'Offline'), // Conditional required

                        TextInput::make('jadwal_default')
                            ->label('Jadwal Harian')
                            ->placeholder('cth: 09:00 - 15:00 WIB')
                            ->maxLength(100)
                            ->required(fn (Get $get) => $get('tipe_kelas') === 'Offline'), // Conditional required
                    ])
                    ->columns(3)
                    ->collapsible(),

                // ==========================================
                // PENGATURAN PUBLIKASI & VISIBILITAS
                // ==========================================
                Section::make('Pengaturan Publikasi & Visibilitas')
                    ->description('Atur status rilis dan target audiens untuk pelatihan ini.')
                    ->schema([
                        Select::make('status')
                            ->label('Status Publikasi Utama')
                            ->options([
                                'draft'     => 'Draft (Belum Rilis)',
                                'published' => 'Published (Rilis ke Audiens)',
                                'archived'  => 'Archived (Diarsipkan)',
                            ])
                            ->required()
                            ->default('draft'),

                        Fieldset::make('Target Audiens (Berlaku jika status "Published")')
                            ->schema([
                                Toggle::make('is_visible_publik')
                                  ->label('Bisa dilihat Publik')
                                  ->onColor('success')
                                  ->default(true)
                                  ->live()
                                  ->afterStateUpdated(function ($state, Get $get, Set $set) {
                                      if ($state && in_array($get('tipe_kelas'), ['Offline', 'Hybrid'])) {
                                          Notification::make()
                                              ->title('Tidak diizinkan')
                                              ->body('Kelas Offline & Hybrid hanya untuk peserta ASN & Korporat, tidak bisa dibuka untuk Publik.')
                                              ->danger()
                                              ->send();
                                          $set('is_visible_publik', false); // revert otomatis
                                      }
                                  }),

                                Toggle::make('is_visible_korporat')
                                    ->label('Bisa dilihat Korporat')
                                    ->onColor('warning')
                                    ->default(false),

                                Toggle::make('is_visible_asn')
                                    ->label('Bisa dilihat ASN')
                                    ->onColor('primary')
                                    ->default(false),
                            ])->columns(3),
                    ])->collapsible(),
            ]);
    }
}
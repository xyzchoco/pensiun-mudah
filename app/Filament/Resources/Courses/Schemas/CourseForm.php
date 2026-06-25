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
                    ->directory('course-thumbnails'),

                // Harga
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

                // ==========================================
                // PENGATURAN PUBLIKASI & VISIBILITAS (BARU)
                // ==========================================
                Section::make('Pengaturan Publikasi & Visibilitas')
                    ->description('Atur status rilis dan target audiens untuk pelatihan ini.')
                    ->schema([
                        // Lapis 1: Status Utama (Sesuai Diagram)
                        Select::make('status')
                            ->label('Status Publikasi Utama')
                            ->options([
                                'draft' => 'Draft (Belum Rilis)',
                                'published' => 'Published (Rilis ke Audiens)',
                                'archived' => 'Archived (Diarsipkan)',
                            ])
                            ->required()
                            ->default('draft'),

                        // Lapis 2: Visibilitas Audiens
                        Fieldset::make('Target Audiens (Berlaku jika status "Published")')
                            ->schema([
                                Toggle::make('is_visible_publik')
                                    ->label('Bisa dilihat Publik')
                                    ->onColor('success')
                                    ->default(true), // Default publik bisa lihat

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

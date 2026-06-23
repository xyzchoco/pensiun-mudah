<?php

namespace App\Filament\Resources\Modules;

use App\Filament\Resources\Modules\Pages\CreateModule;
use App\Filament\Resources\Modules\Pages\EditModule;
use App\Filament\Resources\Modules\Pages\ListModules;
use App\Models\Module;
use Filament\Resources\Resource;
use Filament\Schemas\Schema; // Standar v5
use Filament\Tables\Table;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor; // TAMBAHIN IMPORT INI BOS!
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;
use BackedEnum;

class ModuleResource extends Resource
{
    protected static ?string $model = Module::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-academic-cap';

    protected static ?string $recordTitleAttribute = 'judul';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                // SECTION 1: INFO MODUL
                Section::make('Informasi Modul')
                    ->description('Tentukan kursus induk dan detail dari modul ini.')
                    ->schema([
                        Select::make('course_id')
                            ->label('Pilih Kursus')
                            ->relationship('course', 'title') 
                            ->required(),
                        TextInput::make('judul')
                            ->label('Judul Modul')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('urutan')
                            ->label('Urutan Tampil (Angka)')
                            ->numeric()
                            ->default(1)
                            ->required(),
                        Toggle::make('is_locked')
                            ->label('Kunci Modul (Harus urut)')
                            ->default(false),
                        Textarea::make('deskripsi')
                            ->label('Deskripsi Modul')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),

                // SECTION 2: REPEATER MATERI
                Section::make('Konten / Materi Pembelajaran')
                    ->description('Tambah, ubah, atau susun materi (Video/PDF/Artikel) di dalam modul ini.')
                    ->schema([
                        Repeater::make('materials') 
                            ->relationship('materials') 
                            ->schema([
                                TextInput::make('judul')
                                    ->label('Judul Materi')
                                    ->required(),
                                Select::make('tipe')
                                    ->label('Tipe Materi')
                                    ->options([
                                        'video' => 'Video Streaming',
                                        'pdf' => 'File PDF / E-Book',
                                        'artikel' => 'Artikel Bacaan',
                                    ])
                                    ->required()
                                    ->reactive(), 
                                TextInput::make('url_video')
                                    ->label('URL Video (YouTube/Vimeo/S3)')
                                    ->url()
                                    ->visible(fn ($get) => $get('tipe') === 'video'), 
                                TextInput::make('url_pdf')
                                    ->label('URL File PDF')
                                    ->visible(fn ($get) => $get('tipe') === 'pdf'), 
                                TextInput::make('durasi_menit')
                                    ->label('Estimasi Durasi (Menit)')
                                    ->numeric()
                                    ->required(),
                                TextInput::make('urutan')
                                    ->label('Urutan Materi')
                                    ->numeric()
                                    ->default(1)
                                    ->required(),

                                // 👇 TARUH DI SINI BOS 👇
                                RichEditor::make('konten')
                                    ->label('Isi Artikel / Bacaan Materi')
                                    ->placeholder('Ketik materi bacaan lengkap di sini bos...')
                                    ->visible(fn ($get) => in_array($get('tipe'), ['artikel', 'video'])) // Bisa muncul di tipe Artikel dan Video buat deskripsi
                                    ->columnSpanFull(),
                                // 👆 SAMPAI SINI 👆

                            ])
                            ->columns(2)
                            ->itemLabel(fn (array $state): ?string => $state['judul'] ?? null) 
                            ->collapsible() 
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('course.judul')
                    ->label('Kursus')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('judul')
                    ->label('Judul Modul')
                    ->searchable(),
                TextColumn::make('urutan')
                    ->label('Urutan')
                    ->sortable(),
                IconColumn::make('is_locked')
                    ->label('Terkunci')
                    ->boolean(),
                TextColumn::make('materials_count')
                    ->label('Total Materi')
                    ->counts('materials'), 
            ])
            ->filters([
                //
            ])
            ->actions([
                EditAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListModules::route('/'),
            'create' => Pages\CreateModule::route('/create'),
            'edit' => Pages\EditModule::route('/{record}/edit'),
        ];
    }
}
<?php

namespace App\Filament\Resources\Quizzes;

use App\Filament\Resources\Quizzes\Pages\CreateQuiz;
use App\Filament\Resources\Quizzes\Pages\EditQuiz;
use App\Filament\Resources\Quizzes\Pages\ListQuizzes;
use App\Models\Quiz;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Repeater;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;
use BackedEnum;

class QuizResource extends Resource
{
    protected static ?string $model = Quiz::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-clipboard-document-check';

    protected static ?string $recordTitleAttribute = 'judul';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                // SECTION 1: INFO KUIS
                Section::make('Informasi Kuis')
                    ->description('Tentukan modul induk dan aturan kelulusan kuis.')
                    ->schema([
                        Select::make('module_id')
                            ->label('Pilih Modul')
                            ->relationship('module', 'judul')
                            ->required(),
                        TextInput::make('judul')
                            ->label('Judul Kuis')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('durasi_menit')
                            ->label('Durasi Kuis (Menit)')
                            ->numeric()
                            ->default(30)
                            ->required(),
                        TextInput::make('nilai_lulus')
                            ->label('Nilai Minimal Kelulusan (KKM)')
                            ->numeric()
                            ->default(70)
                            ->required(),
                        Toggle::make('is_final')
                            ->label('Jadikan Kuis Final (Ujian Akhir Kursus)')
                            ->default(false),
                    ])->columns(2),

                // SECTION 2: REPEATER SOAL & OPSI (Nested Repeater)
                Section::make('Daftar Pertanyaan & Jawaban')
                    ->description('Kelola soal kuis beserta pilihan jawabannya secara dinamis.')
                    ->schema([
                        Repeater::make('questions')
                            ->relationship('questions') // Hubungan ke hasMany questions
                            ->label('Daftar Soal')
                            ->schema([
                                Textarea::make('teks_soal')
                                    ->label('Pertanyaan / Soal')
                                    ->required()
                                    ->rows(2)
                                    ->columnSpanFull(),
                                Select::make('tipe')
                                    ->label('Tipe Soal')
                                    ->options([
                                        'pilihan_ganda' => 'Pilihan Ganda',
                                        'essay' => 'Essay / Esai',
                                    ])
                                    ->default('pilihan_ganda')
                                    ->required()
                                    ->reactive(),
                                TextInput::make('bobot_nilai')
                                    ->label('Bobot Nilai Soal')
                                    ->numeric()
                                    ->default(10)
                                    ->required(),

                                // REPEATER NESTED: Pilihan Jawaban (Hanya muncul jika tipe soal Pilihan Ganda)
                                Repeater::make('options')
                                    ->relationship('options') // Hubungan ke hasMany options di model QuizQuestion
                                    ->label('Pilihan Jawaban (A, B, C, D)')
                                    ->schema([
                                        TextInput::make('teks_opsi')
                                            ->label('Teks Pilihan / Jawaban')
                                            ->required(),
                                        Toggle::make('is_correct')
                                            ->label('Jawaban Benar')
                                            ->default(false),
                                    ])
                                    ->columns(2)
                                    ->columnSpanFull()
                                    ->visible(fn ($get) => $get('tipe') === 'pilihan_ganda')
                                    ->itemLabel(fn (array $state): ?string => $state['teks_opsi'] ?? null)
                                    ->collapsible(),
                            ])
                            ->columnSpanFull()
                            ->itemLabel(fn (array $state): ?string => $state['teks_soal'] ?? null)
                            ->collapsible(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('module.judul')
                    ->label('Modul')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('judul')
                    ->label('Nama Kuis')
                    ->searchable(),
                TextColumn::make('durasi_menit')
                    ->label('Durasi (Mnt)')
                    ->sortable(),
                TextColumn::make('nilai_lulus')
                    ->label('KKM')
                    ->sortable(),
                IconColumn::make('is_final')
                    ->label('Kuis Final')
                    ->boolean(),
                TextColumn::make('questions_count')
                    ->label('Jumlah Soal')
                    ->counts('questions'),
            ])
            ->filters([
                //
            ])
            ->actions([
                EditAction::make(),
            ])
            ->bulkActions([
                DeleteBulkAction::make(),
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
            'index' => Pages\ListQuizzes::route('/'),
            'create' => Pages\CreateQuiz::route('/create'),
            'edit' => Pages\EditQuiz::route('/{record}/edit'),
        ];
    }
}
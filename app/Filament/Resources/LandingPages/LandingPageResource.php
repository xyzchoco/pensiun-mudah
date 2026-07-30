<?php

namespace App\Filament\Resources\LandingPages;

use App\Filament\Resources\LandingPages\Pages\CreateLandingPage;
use App\Filament\Resources\LandingPages\Pages\EditLandingPage;
use App\Filament\Resources\LandingPages\Pages\ListLandingPages;
use App\Models\LandingPage;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use BackedEnum;
use UnitEnum;
use Filament\Schemas\Components\Section;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteBulkAction;

class LandingPageResource extends Resource
{
    protected static ?string $model = LandingPage::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-photo';
    protected static UnitEnum|string|null $navigationGroup = 'Website';
    protected static ?string $recordTitleAttribute = 'hero_title';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Hero Section')
                    ->description('Kelola konten utama di halaman depan website (Landing Page).')
                    ->schema([
                        TextInput::make('hero_title')
                            ->label('Judul Utama (H1)')
                            ->required()
                            ->maxLength(255),
                        Textarea::make('hero_subtitle')
                            ->label('Deskripsi/Subtitle')
                            ->rows(4)
                            ->required(),
                        TextInput::make('hero_button_text')
                            ->label('Teks Tombol (Cth: Mulai Sekarang)'),
                        TextInput::make('hero_button_url')
                            ->label('URL Tombol')
                            ->url(),
                        FileUpload::make('hero_image_path')
                            ->label('Gambar/Background Hero')
                            ->image()
                            ->disk('public')
                            ->directory('landing-pages')
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('hero_image_path')
                    ->disk('public')
                    ->width(50)
                    ->height(60)
                    ->label('Gambar'),
                TextColumn::make('hero_title')
                    ->label('Judul Utama')
                    ->limit(30)
                    ->searchable(),
                TextColumn::make('updated_at')
                    ->label('Terakhir Diupdate')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                
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
            'index' => Pages\ListLandingPages::route('/'),
            'create' => Pages\CreateLandingPage::route('/create'),
            'edit' => Pages\EditLandingPage::route('/{record}/edit'),
        ];
    }
}
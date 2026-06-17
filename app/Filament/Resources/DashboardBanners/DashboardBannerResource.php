<?php

namespace App\Filament\Resources\DashboardBanners;

use App\Filament\Resources\DashboardBanners\Pages\CreateDashboardBanner;
use App\Filament\Resources\DashboardBanners\Pages\EditDashboardBanner;
use App\Filament\Resources\DashboardBanners\Pages\ListDashboardBanners;
use App\Models\DashboardBanner;
use Filament\Resources\Resource;
use Filament\Schemas\Schema; // Standar v5
use Filament\Tables\Table;
use Filament\Tables;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\IconColumn;
use Filament\Schemas\Components\Section;
use Filament\Actions\EditAction; // v5 table action
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use BackedEnum;

class DashboardBannerResource extends Resource
{
    protected static ?string $model = DashboardBanner::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-presentation-chart-bar';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Dashboard Carousel Banner')
                    ->description('Kelola banner promosi/carousel yang muncul di halaman dashboard setelah user login.')
                    ->schema([
                        TextInput::make('promo_badge')
                            ->label('Badge Promo (Cth: PROMO SPESIAL)')
                            ->maxLength(50),
                        TextInput::make('title')
                            ->label('Judul Banner')
                            ->required()
                            ->maxLength(50),
                        Textarea::make('description')
                            ->label('Deskripsi Pendek')
                            ->rows(3)
                            ->columnSpanFull()
                            ->maxLength(100),
                        TextInput::make('button_text')
                            ->label('Teks Tombol (Cth: Gunakan Kode)')
                            ->maxLength(50),
                        TextInput::make('target_url')
                            ->label('URL Target Tombol')
                            ->maxLength(50),
                        FileUpload::make('image_path')
                            ->label('Gambar Latar Banner (Rekomendasi overlay transparan)')
                            ->image()
                            ->disk('public')
                            ->directory('dashboard-banners')
                            ->columnSpanFull(),
                        Toggle::make('is_active')
                            ->label('Aktifkan Banner')
                            ->default(true),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image_path')
                    ->label('Gambar')
                    ->disk('public'),
                TextColumn::make('title')
                    ->label('Judul Banner')
                    ->searchable(),
                TextColumn::make('promo_badge')
                    ->label('Badge'),
                IconColumn::make('is_active')
                    ->label('Status Aktif')
                    ->boolean(),
                TextColumn::make('updated_at')
                    ->label('Terakhir Diupdate')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                EditAction::make()->icon('heroicon-o-pencil')
                ->label('Edit'),
                DeleteAction::make()->icon('heroicon-o-trash')
                ->label('Hapus'),
            ])
            ->bulkActions([
                DeleteBulkAction::make()->icon('heroicon-o-trash')
                ->label('Hapus'),
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
            'index' => Pages\ListDashboardBanners::route('/'),
            'create' => Pages\CreateDashboardBanner::route('/create'),
            'edit' => Pages\EditDashboardBanner::route('/{record}/edit'),
        ];
    }
}
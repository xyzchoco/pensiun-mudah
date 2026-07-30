<?php

namespace App\Filament\Resources\Webinars;

use App\Filament\Resources\Webinars\Pages\CreateWebinar;
use App\Filament\Resources\Webinars\Pages\EditWebinar;
use App\Filament\Resources\Webinars\Pages\ListWebinars;
use App\Filament\Resources\Webinars\Tables\WebinarsTable;
use App\Models\Webinar;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;

class WebinarResource extends Resource
{
    protected static ?string $model = Webinar::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static UnitEnum|string|null $navigationGroup = 'Event';
    protected static ?string $recordTitleAttribute = 'judul';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                TextInput::make('judul')
                    ->required()
                    ->maxLength(255),

                Select::make('kategori')
                    ->options(['Umum' => 'Umum', 'Kewirausahaan' => 'Kewirausahaan', 'Teknologi' => 'Teknologi'])
                    ->default('Umum')
                    ->required(),

                Select::make('jenis_event')
                    ->label('Jenis Event')
                    ->options(['Online' => 'Online', 'Offline' => 'Offline'])
                    ->required()
                    ->live(),

                DatePicker::make('tanggal')->required(),
                TimePicker::make('jam')->required(),

                TextInput::make('narasumber')->required(),

                TextInput::make('lokasi_link')
                    ->label(fn (Get $get) => $get('jenis_event') === 'Online' ? 'Link Platform (Google Meet, Zoom, dll)' : 'Alamat / Link Lokasi')
                    ->required()
                    ->columnSpanFull(),

                TextInput::make('kapasitas')
                    ->numeric()
                    ->required(),

                RichEditor::make('deskripsi')
                    ->required()
                    ->columnSpanFull(),

                FileUpload::make('image_path')
                    ->label('Thumbnail')
                    ->image()
                    ->disk('public')
                    ->directory('webinar-thumbnails')
                    ->columnSpanFull(),

                Toggle::make('is_published')
                    ->label('Publish ke User?')
                    ->default(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return WebinarsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListWebinars::route('/'),
            'create' => CreateWebinar::route('/create'),
            'edit'   => EditWebinar::route('/{record}/edit'),
        ];
    }
}
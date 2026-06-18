<?php

namespace App\Filament\Resources\Webinars;

use App\Filament\Resources\Webinars\Pages\CreateWebinar;
use App\Filament\Resources\Webinars\Pages\EditWebinar;
use App\Filament\Resources\Webinars\Pages\ListWebinars;
use App\Filament\Resources\Webinars\Schemas\WebinarForm;
use App\Filament\Resources\Webinars\Tables\WebinarsTable;
use App\Models\Webinar;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;

class WebinarResource extends Resource
{
    protected static ?string $model = Webinar::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                TextInput::make('judul')->required(),
                TextInput::make('kategori')->required()->placeholder('cth: Kewirausahaan'),
                Select::make('jenis_event')
                    ->options(['Online' => 'Online', 'Offline' => 'Offline'])
                    ->required(),
                DatePicker::make('tanggal')->required(),
                TimePicker::make('jam')->required(),
                TextInput::make('narasumber')->required(),
                TextInput::make('lokasi_link')->label('Link / Lokasi')->required(),
                TextInput::make('kapasitas')->numeric()->required(),
                TextInput::make('sisa_kuota')->numeric()->required(),
                Textarea::make('deskripsi')->required()->columnSpanFull(),
                FileUpload::make('image_path')
                    ->image()
                    ->disk('public')
                    ->directory('webinar-images')
                    ->columnSpanFull(),
                Toggle::make('is_published')->label('Publish ke User?'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return WebinarsTable::configure($table);
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
            'index' => ListWebinars::route('/'),
            'create' => CreateWebinar::route('/create'),
            'edit' => EditWebinar::route('/{record}/edit'),
        ];
    }
}

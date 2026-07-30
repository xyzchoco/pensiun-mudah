<?php

namespace App\Filament\Resources\SesiSeminars;

use App\Filament\Resources\SesiSeminars\Pages\CreateSesiSeminar;
use App\Filament\Resources\SesiSeminars\Pages\EditSesiSeminar;
use App\Filament\Resources\SesiSeminars\Pages\ListSesiSeminars;
use App\Filament\Resources\SesiSeminars\Schemas\SesiSeminarForm;
use App\Filament\Resources\SesiSeminars\Tables\SesiSeminarsTable;
use App\Models\SesiSeminar;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SesiSeminarResource extends Resource
{
    protected static ?string $model = SesiSeminar::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static UnitEnum|string|null $navigationGroup = 'Event';
    protected static ?string $recordTitleAttribute = 'judul';

    public static function form(Schema $schema): Schema
    {
        return SesiSeminarForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SesiSeminarsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\AbsensiRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSesiSeminars::route('/'),
            'create' => CreateSesiSeminar::route('/create'),
            'edit' => EditSesiSeminar::route('/{record}/edit'),
        ];
    }
}

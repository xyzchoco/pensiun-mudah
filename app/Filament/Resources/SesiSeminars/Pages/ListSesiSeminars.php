<?php

namespace App\Filament\Resources\SesiSeminars\Pages;

use App\Filament\Resources\SesiSeminars\SesiSeminarResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSesiSeminars extends ListRecords
{
    protected static string $resource = SesiSeminarResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}

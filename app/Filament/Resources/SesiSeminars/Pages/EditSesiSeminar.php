<?php

namespace App\Filament\Resources\SesiSeminars\Pages;

use App\Filament\Resources\SesiSeminars\SesiSeminarResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSesiSeminar extends EditRecord
{
    protected static string $resource = SesiSeminarResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}

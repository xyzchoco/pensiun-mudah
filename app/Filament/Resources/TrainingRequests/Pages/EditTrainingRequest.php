<?php

namespace App\Filament\Resources\TrainingRequests\Pages;

use App\Filament\Resources\TrainingRequests\TrainingRequestResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTrainingRequest extends EditRecord
{
    protected static string $resource = TrainingRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}

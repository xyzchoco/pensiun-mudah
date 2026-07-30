<?php

namespace App\Filament\Resources\WebinarRegistrations\Pages;

use App\Filament\Resources\WebinarRegistrations\WebinarRegistrationResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListWebinarRegistrations extends ListRecords
{
    protected static string $resource = WebinarRegistrationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
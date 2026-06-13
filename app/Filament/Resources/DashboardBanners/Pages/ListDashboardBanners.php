<?php

namespace App\Filament\Resources\DashboardBanners\Pages;

use App\Filament\Resources\DashboardBanners\DashboardBannerResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDashboardBanners extends ListRecords
{
    protected static string $resource = DashboardBannerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}

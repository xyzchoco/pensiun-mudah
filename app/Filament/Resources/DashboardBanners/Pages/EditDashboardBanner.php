<?php

namespace App\Filament\Resources\DashboardBanners\Pages;

use App\Filament\Resources\DashboardBanners\DashboardBannerResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditDashboardBanner extends EditRecord
{
    protected static string $resource = DashboardBannerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}

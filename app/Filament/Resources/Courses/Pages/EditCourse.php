<?php

namespace App\Filament\Resources\Courses\Pages;

use App\Filament\Resources\Courses\CourseResource;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditCourse extends EditRecord
{
    protected static string $resource = CourseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (in_array($data['tipe_kelas'], ['Offline', 'Hybrid']) && $data['is_visible_publik']) {
            $data['is_visible_publik'] = false;
            Notification::make()
                ->title('Disesuaikan')
                ->body('Kelas Offline/Hybrid otomatis disembunyikan dari Publik.')
                ->warning()
                ->send();
        }

        return $data;
    }
}

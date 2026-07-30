<?php

namespace App\Filament\Resources\Courses\Pages;

use App\Filament\Resources\Courses\CourseResource;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;

class CreateCourse extends CreateRecord
{
    protected static string $resource = CourseResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
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

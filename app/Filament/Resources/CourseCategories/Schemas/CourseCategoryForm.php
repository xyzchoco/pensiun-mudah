<?php

namespace App\Filament\Resources\CourseCategories\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;

class CourseCategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('category_name')
                    ->label('Nama Kategori')
                    ->required()
                    ->maxLength(255),
            ]);
    }
}
<?php

namespace App\Filament\Resources\CourseCategories\Tables;

use App\Models\CourseCategory;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;

class CourseCategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('category_name')
                    ->label('Nama Kategori')
                    ->searchable() // Biar bisa dicari lewat kolom search
                    ->sortable(),  // Biar bisa diurutin A-Z

                TextColumn::make('courses_count')
                    ->label('Jumlah Kursus')
                    ->counts('courses')
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Dibuat Pada')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true), // Sembunyiin default, tapi bisa dimunculin kalau butuh
            ])
            ->filters([
                // Filter belum terlalu butuh karena datanya simple
            ])
            ->recordActions([
                EditAction::make(),
                static::configureDeleteAction(DeleteAction::make()),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->requiresConfirmation()
                        ->before(function (DeleteBulkAction $action, Collection $records): void {
                            $blocked = $records->filter(fn (CourseCategory $record): bool => $record->hasCourses());

                            if ($blocked->isNotEmpty()) {
                                $names = $blocked->pluck('category_name')->join(', ');

                                Notification::make()
                                    ->title('Beberapa kategori tidak dapat dihapus')
                                    ->body("Kategori berikut masih memiliki kursus: {$names}.")
                                    ->danger()
                                    ->send();

                                $action->halt();
                            }
                        }),
                ]),
            ]);
    }

    public static function configureDeleteAction(DeleteAction $action): DeleteAction
    {
        return $action
            ->requiresConfirmation()
            ->before(function (DeleteAction $action, CourseCategory $record): void {
                if ($record->hasCourses()) {
                    Notification::make()
                        ->title('Kategori tidak dapat dihapus')
                        ->body('Kategori ini masih digunakan oleh satu atau lebih kursus. Pindahkan atau hapus kursus tersebut terlebih dahulu.')
                        ->danger()
                        ->send();

                    $action->halt();
                }
            });
    }
}
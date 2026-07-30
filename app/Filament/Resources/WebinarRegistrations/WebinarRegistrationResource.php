<?php

namespace App\Filament\Resources\WebinarRegistrations;

use App\Filament\Resources\WebinarRegistrations\Pages\ListWebinarRegistrations;
use App\Models\WebinarRegistration;
use App\Models\Webinar;
use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;              // ← GANTI: bukan Filament\Forms\Form
use Filament\Resources\Resource;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Support\Icons\Heroicon;
use UnitEnum;
use BackedEnum;

class WebinarRegistrationResource extends Resource
{
    protected static ?string $model = WebinarRegistration::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static string|UnitEnum|null $navigationGroup = 'Event';
    protected static ?string $label = 'Pendaftaran Webinar';
    protected static ?string $pluralLabel = 'Pendaftaran Webinar';

    // v4: terima Schema, kembalikan Schema, pakai ->components()
    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('webinar_id')
                    ->label('Webinar')
                    ->options(Webinar::query()->pluck('judul', 'id')) // ← judul, bukan title
                    ->required()
                    ->searchable(),

                Select::make('user_id')
                    ->label('User')
                    ->options(User::query()->pluck('name', 'user_id')) // custom PK user_id
                    ->required()
                    ->searchable(),

                // Status sebagai pilihan tetap, bukan free text
                Select::make('status')
                    ->label('Status')
                    ->options([
                        'terdaftar' => 'Terdaftar',
                        'hadir'     => 'Hadir',
                        'batal'     => 'Batal',
                    ])
                    ->default('terdaftar')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('webinar.judul') // ← judul, bukan title
                    ->label('Webinar')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('status')
                    ->label('Status Pendaftaran')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'terdaftar' => 'info',
                        'hadir'     => 'success',
                        'batal'     => 'danger',
                        default     => 'gray', // ← wajib ada biar aman
                    })
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Tanggal Daftar')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),

                TextColumn::make('updated_at')
                    ->label('Terakhir Diupdate')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([   // ← v4: ganti dari ->actions()
                //
            ])
            ->toolbarActions([  // ← v4: ganti dari ->bulkActions()
                //
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListWebinarRegistrations::route('/'),
        ];
    }
}
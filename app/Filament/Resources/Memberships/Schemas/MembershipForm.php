<?php

namespace App\Filament\Resources\Memberships\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;

class MembershipForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('membership_name')
                    ->label('Nama Paket Membership')
                    ->required()
                    ->maxLength(255),

                TextInput::make('price')
                    ->label('Harga Paket')
                    ->numeric()
                    ->prefix('Rp')
                    ->required(),

                TextInput::make('duration_days')
                    ->label('Durasi (Hari)')
                    ->numeric()
                    ->helperText('Kosongkan atau isi null jika paket ini bersifat Lifetime/Seumur Hidup'),

                Select::make('access_type')
                    ->label('Tipe Akses')
                    ->options([
                        'free' => 'Free / Gratis',
                        'premium' => 'Premium',
                        'lifetime' => 'Lifetime',
                    ])
                    ->required(),
            ]);
    }
}
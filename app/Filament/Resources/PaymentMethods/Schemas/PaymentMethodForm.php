<?php

namespace App\Filament\Resources\PaymentMethods\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;

class PaymentMethodForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('method_name')
                    ->label('Nama Metode Pembayaran')
                    ->placeholder('Contoh: QRIS, VA BCA, Mandiri, OVO')
                    ->required()
                    ->maxLength(255),
            ]);
    }
}
<?php

namespace App\Filament\Pages\Auth;

use Filament\Auth\Pages\Login as BaseLogin;

class CustomLogin extends BaseLogin
{
    /**
     * @var string
     */
    protected string $view = 'filament.pages.auth.custom-login';
}

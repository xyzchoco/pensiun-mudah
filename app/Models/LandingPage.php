<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingPage extends Model
{
    protected $fillable = [
        'hero_badge', 'hero_title', 'hero_subtitle', 'hero_image_path', 'hero_button_text', 'hero_button_url'
    ];
}
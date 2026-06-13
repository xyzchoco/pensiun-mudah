<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DashboardBanner extends Model
{
    protected $fillable = [
        'promo_badge', 
        'title', 
        'description', 
        'image_path', 
        'button_text', 
        'target_url', 
        'is_active'
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
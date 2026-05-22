<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Membership extends Model
{
    protected $fillable = [
        'membership_name',
        'price',
        'duration_days',
        'access_type',
    ];

    // Relasi: Satu paket membership dimiliki oleh banyak User
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
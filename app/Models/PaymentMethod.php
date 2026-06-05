<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $fillable = [
        'nama', 'tipe', 'logo', 'instruksi', 'is_active'
    ];
}

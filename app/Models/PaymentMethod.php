<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    // WAJIB ADA INI BIAR DATA DARI FORM BISA MASUK DATABASE
    protected $fillable = [
        'nama',
        'tipe',
        'logo',
        'instruksi',
        'is_active',
    ];
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_id', 'course_id', 'payment_method_id', 'nomor_transaksi', 
        'nominal', 'status', 'snap_token', 'batas_waktu'
    ];
}

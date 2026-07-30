<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Course;
use App\Models\User;

class Transaction extends Model
{
    protected $fillable = [
        'user_id', 'course_id', 'payment_method_id', 'nomor_transaksi', 
        'nominal', 'status', 'snap_token', 'batas_waktu', 'jumlah_peserta',
        'harga_per_peserta',
        'snap_redirect_url',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}

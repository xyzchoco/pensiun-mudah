<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VoucherRedemption extends Model
{
    use HasFactory;

    // TAMBAHKAN BARIS INI BOS BIAR LARAVEL NGGAK NYARI KOLOM UPDATED_AT
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'corporate_voucher_id',
        'redeemed_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function voucher()
    {
        return $this->belongsTo(CorporateVoucher::class, 'corporate_voucher_id');
    }
}
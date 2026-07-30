<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VoucherRedemption extends Model
{
    use HasFactory;

    protected $table = 'voucher_redemptions';

    protected $fillable = [
        'user_id',
        'corporate_voucher_id',
        'redeemed_at',
    ];

    public $timestamps = false;

    protected $casts = ['redeemed_at' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function voucher()
    {
        return $this->belongsTo(CorporateVoucher::class, 'corporate_voucher_id');
    }
}
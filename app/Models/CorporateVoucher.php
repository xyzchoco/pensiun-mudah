<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CorporateVoucher extends Model
{
    use HasFactory;

    protected $table = 'corporate_vouchers';

    protected $fillable = [
        'corporate_user_id',
        'course_id',
        'code',
        'target_kategori',
        'max_uses',
        'used_count',
    ];

    // Relasi ke Kursus
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    // ✅ TAMBAH INI — relasi ke User pembeli (korporat/ASN)
    public function corporateUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'corporate_user_id', 'user_id');
    }
}
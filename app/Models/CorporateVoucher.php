<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorporateVoucher extends Model
{
    use HasFactory;

    // Definisikan nama tabelnya jika berbeda
    protected $table = 'corporate_vouchers';

    // Daftarkan kolom yang boleh diisi (mass assignable)
    protected $fillable = [
        'corporate_user_id',
        'course_id',
        'code',
        'max_uses',
        'used_count',
    ];

    // Relasi ke Kursus (Opsional, tapi berguna nanti)
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
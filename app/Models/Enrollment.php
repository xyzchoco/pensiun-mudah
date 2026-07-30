<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enrollment extends Model
{
    protected $fillable = [
        'user_id', 'course_id', 'voucher_id', 'tanggal_daftar', 'status',
        'progress_persen', 'is_completed', 'tanggal_selesai',
        'tanggal_mulai', 'jam_mulai', 'jam_selesai', 'usulan_lokasi',
    ];

    protected $casts = [
        'tanggal_daftar'  => 'date',
        'tanggal_selesai' => 'date',
        'tanggal_mulai'   => 'date',
        'is_completed'    => 'boolean',
    ];

    // ========================================================
    // SUNTIKAN BARU: Auto-fill tanggal_daftar kalau kosong
    // ========================================================
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($enrollment) {
            if (empty($enrollment->tanggal_daftar)) {
                $enrollment->tanggal_daftar = now();
            }
        });
    }

    // Relasi ke User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Relasi ke Course
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function voucher() {
        return $this->belongsTo(CorporateVoucher::class, 'voucher_id');
    }
}
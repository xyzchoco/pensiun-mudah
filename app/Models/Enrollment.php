<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enrollment extends Model
{
    protected $fillable = [
        'user_id', 'course_id', 'tanggal_daftar', 'status', 
        'progress_persen', 'is_completed', 'tanggal_selesai'
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
}
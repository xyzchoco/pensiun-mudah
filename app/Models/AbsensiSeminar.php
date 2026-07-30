<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AbsensiSeminar extends Model
{
    use HasFactory;

    protected $table = 'absensi_seminar';

    protected $fillable = [
        'sesi_seminar_id',
        'user_id',
        'status',
        'waktu_absen',
    ];

    protected $casts = [
        'waktu_absen' => 'datetime',
    ];

    public function sesiSeminar(): BelongsTo
    {
        return $this->belongsTo(SesiSeminar::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function sesiSeminarRel()
    {
        return $this->belongsTo(SesiSeminar::class, 'sesi_seminar_id');
    }
}
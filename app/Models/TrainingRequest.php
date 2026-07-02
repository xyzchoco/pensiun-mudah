<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainingRequest extends Model
{
    // === Status constants ===
    const MENUNGGU_APPROVAL = 'menunggu_approval';
    const DISETUJUI         = 'disetujui';
    const DITOLAK           = 'ditolak';
    const PROSES_ULANG      = 'proses_ulang';
    const MENUNGGU_BAYAR    = 'menunggu_bayar';
    const LUNAS             = 'lunas';
    const SELESAI           = 'selesai';

    // === Primary key (sesuai migrasi: $table->id('request_id')) ===
    protected $primaryKey = 'request_id';

    // === Kolom yang boleh di-mass-assign (dipakai create() di controller) ===
    protected $fillable = [
        'user_id',
        'course_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'jam_mulai',
        'jam_selesai',
        'jumlah_peserta',
        'usulan_lokasi',
        'estimasi_harga',
        'is_custom',
        'status',
        'alasan_penolakan',
        'voucher_id',
    ];

    // === Casting tipe data ===
    protected $casts = [
        'tanggal_mulai'   => 'date',
        'tanggal_selesai' => 'date',
        'is_custom'       => 'boolean',
        'estimasi_harga'  => 'decimal:2',
    ];

    // === Relasi ===
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function voucher(): BelongsTo
    {
        return $this->belongsTo(CorporateVoucher::class, 'voucher_id');
    }

    // === Helper: durasi hari dari rentang tanggal ===
    public function getDurasiHariAttribute(): int
    {
        return $this->tanggal_mulai->diffInDays($this->tanggal_selesai) + 1;
    }
}
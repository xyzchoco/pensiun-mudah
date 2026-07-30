<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class Webinar extends Model
{
    protected $fillable = [
        'judul',
        'kategori',
        'jenis_event',
        'tanggal',
        'jam',
        'narasumber',
        'lokasi_link',
        'kapasitas',
        'deskripsi',
        'image_path',
        'is_published',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'is_published' => 'boolean',
    ];

    protected $appends = ['registered_count', 'sisa_kuota', 'status_label', 'image_url', 'mulai_at'];

    public function registrations(): HasMany
    {
        return $this->hasMany(WebinarRegistration::class, 'webinar_id', 'id');
    }

    public function getRegisteredCountAttribute(): int
    {
        return $this->registrations()->where('status', '!=', 'batal')->count();
    }

    public function getSisaKuotaAttribute(): int
    {
        return max(0, (int) $this->kapasitas - $this->registered_count);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::url($this->image_path) : null;
    }

    public function getMulaiAtAttribute(): ?string
    {
        if (!$this->tanggal || !$this->jam) return null;
        return Carbon::parse($this->tanggal->format('Y-m-d') . ' ' . $this->jam, 'Asia/Jakarta')->toIso8601String();
    }

    public function getStatusLabelAttribute(): string
    {
        return $this->mulai_at ? (Carbon::parse($this->mulai_at)->isPast() ? 'Selesai' : 'Akan Datang') : 'Akan Datang';
    }
}
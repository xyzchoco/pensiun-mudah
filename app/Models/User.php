<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'name',
        'email',
        'password',
        'whatsapp',
        'tanggal_lahir',
        'kategori_pensiun',
        // 'nama_perusahaan', // Sudah dihapus dari migrasi kan?
        // 'jabatan',         // Sudah dihapus dari migrasi kan?
        'google_id',
        'is_verified',
        'role_id',
        'membership_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }

    public function membership(): BelongsTo
    {
        return $this->belongsTo(Membership::class, 'membership_id', 'id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'user_id');
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->role?->role_name === 'Admin';
    }

    public function corporateProfile()
    {
        return $this->hasOne(CorporateProfile::class, 'user_id');
    }

    public function getIdAttribute()
    {
        return $this->attributes['user_id'] ?? null;
    }

    public function setIdAttribute($value)
    {
        $this->attributes['user_id'] = $value;
    }
}
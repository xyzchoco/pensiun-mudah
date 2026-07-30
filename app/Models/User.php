<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'google_id',
        'is_verified',
        'role_id',
        'membership_id',
        'profile_photo_path',
    ];

    protected $appends = ['profile_photo_url'];

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

    public function corporateProfile() : HasOne
    {
        return $this->hasOne(CorporateProfile::class, 'user_id', 'user_id');
    }

    public function getIdAttribute()
    {
        return $this->attributes['user_id'] ?? null;
    }

    public function setIdAttribute($value)
    {
        $this->attributes['user_id'] = $value;
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id', 'user_id');
    }

    public function voucherRedemptions()
    {
        return $this->hasMany(VoucherRedemption::class, 'user_id', 'user_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'user_id', 'user_id');
    }

    public function getProfilePhotoUrlAttribute(): string
    {
        return $this->profile_photo_path
            ? \Illuminate\Support\Facades\Storage::disk('public')->url($this->profile_photo_path)
            : '/images/iconprofile.png';
    }
}

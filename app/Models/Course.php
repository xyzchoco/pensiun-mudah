<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    protected $fillable = [
        'category_id',
        'created_by',
        'title',
        'slug',
        'description',
        'thumbnail',
        'course_type',
        'price',
        'status',
        'tipe_kelas',
        // Default offline/hybrid
        'tanggal_default',
        'lokasi_default',
        'jadwal_default',
        'instruktur',
        'durasi',
        // Visibilitas
        'is_visible_publik',
        'is_visible_korporat',
        'is_visible_asn',
    ];

    protected $casts = [
        'tanggal_default'     => 'date',
        'price'               => 'decimal:2',
        'is_visible_publik'   => 'boolean',
        'is_visible_korporat' => 'boolean',
        'is_visible_asn'      => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, 'category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('urutan');
    }
}
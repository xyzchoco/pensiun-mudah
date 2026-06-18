<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseCategory extends Model
{
    protected $fillable = [
    'nama', 
    'deskripsi', 
    'icon', 
    'warna_bg_icon', 
    'gambar',
    'warna_teks_icon', 
    'jumlah_kursus'
    ];

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'category_id');
    }

    public function hasCourses(): bool
    {
        return $this->courses()->exists();
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseCategory extends Model
{
    // Buka gerbang untuk kolom category_name
    protected $fillable = [
        'category_name',
    ];

    // Relasi: Satu Kategori punya banyak Kursus
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'category_id');
    }
}
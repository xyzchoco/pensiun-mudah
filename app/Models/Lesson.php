<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    protected $fillable = [
        'course_id',
        'title',
        'slug',
        'video_url',
        'content',
        'order',
        'is_free',
    ];

    // Relasi balik ke Course
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
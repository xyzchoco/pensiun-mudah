<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

    class Module extends Model
    {
        protected $fillable = ['course_id', 'judul', 'deskripsi', 'urutan', 'is_locked'];

        public function course(): \Illuminate\Database\Eloquent\Relations\BelongsTo
        {
            return $this->belongsTo(Course::class);
        }

        public function materials(): \Illuminate\Database\Eloquent\Relations\HasMany
        {
            return $this->hasMany(Material::class)->orderBy('urutan');
        }

        public function quizzes(): \Illuminate\Database\Eloquent\Relations\HasMany
        {
            return $this->hasMany(Quiz::class);
        }
    }

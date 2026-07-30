<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = ['module_id', 'judul', 'durasi_menit', 'nilai_lulus', 'is_final', 'total_soal'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }

    public function quizUsers()
    {
        return $this->hasMany(QuizUser::class);
    }
}

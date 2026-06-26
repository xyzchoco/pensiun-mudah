<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningProgress extends Model
{
    protected $primaryKey = 'progress_id'; 

    public $incrementing = true;

    protected $fillable = [
        'user_id',
        'course_id',
        'module_id',
        'material_id',
        'is_completed',
        'durasi_belajar',
        'last_accessed',
        'persentase',
    ];

    public function material() {
    return $this->belongsTo(Material::class, 'material_id');
    }
    public function module() {
        return $this->belongsTo(Module::class, 'module_id');
    }
}
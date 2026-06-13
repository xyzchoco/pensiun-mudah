<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = [
        'module_id', 
        'judul', 
        'tipe', 
        'url_video', 
        'url_pdf', 
        'durasi_menit', 
        'urutan'
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
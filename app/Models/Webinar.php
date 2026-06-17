<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Webinar extends Model
{
    protected $fillable = [
        'judul', 'kategori', 'jenis_event', 'tanggal', 'jam', 
        'narasumber', 'lokasi_link', 'kapasitas', 'sisa_kuota', 
        'deskripsi', 'image_path', 'is_published'
    ];
}
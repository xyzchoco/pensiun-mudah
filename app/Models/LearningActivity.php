<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningActivity extends Model
{
    use HasFactory;

    // Kasih tau Laravel primary key-nya bukan 'id' bawaan, tapi 'activity_id'
    protected $primaryKey = 'activity_id';

    protected $table = 'learning_activities';
    protected $fillable = ['user_id', 'tanggal', 'durasi_jam', 'kategori', 'modul', 'topik'];

    // Buka proteksi insert data
    protected $guarded = [];
}
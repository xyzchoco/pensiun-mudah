<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CorporateProfile extends Model
{
    protected $primaryKey = 'corp_profile_id';
    protected $fillable = [
        'user_id', 'nama_perusahaan', 'jabatan', 'kategori_bisnis', 
        'email_perusahaan', 'alamat_kantor', 'email_bisnis', 'no_telepon'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CorporateProfile extends Model
{
    protected $table = 'corporate_profiles';
    protected $primaryKey = 'corp_profile_id';

    protected $fillable = [
        'user_id', 'nama_perusahaan', 'jabatan', 'kategori_bisnis',
        'email_perusahaan', 'alamat_kantor', 'email_bisnis', 'no_telepon',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id'); // custom PK users
    }
}
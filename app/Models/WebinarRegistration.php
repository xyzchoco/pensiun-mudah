<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebinarRegistration extends Model
{
    protected $fillable = [
        'webinar_id',
        'user_id',
        'status',
        'registered_at',
        'reminder_sent_at',
    ];

    protected $casts = [
        'registered_at' => 'datetime',
        'reminder_sent_at' => 'datetime',
    ];

    public const STATUS_TERDAFTAR = 'terdaftar';
    public const STATUS_HADIR = 'hadir';
    public const STATUS_BATAL = 'batal';

    public function webinar() 
    {
        return $this->belongsTo(Webinar::class, 'webinar_id', 'id'); 
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}

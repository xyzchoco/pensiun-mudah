<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $primaryKey = 'notif_id';

    protected $fillable = [
        'user_id', 'judul', 'isi', 'type',
        'is_read', 'action_label', 'action_url',
    ];

    protected $casts = [
        'is_read'    => 'boolean',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // === Helper methods (dari class diagram) ===

    public static function send($userId, $judul, $isi, $type = 'info', $actionLabel = null, $actionUrl = null)
    {
        return self::create([
            'user_id'      => $userId,
            'judul'        => $judul,
            'isi'          => $isi,
            'type'         => $type,
            'action_label' => $actionLabel,
            'action_url'   => $actionUrl,
        ]);
    }

    public static function sendToRole($kategori, $judul, $isi, $type = 'info', $actionLabel = null, $actionUrl = null)
    {
        $now = now();
        $rows = User::where('kategori_pensiun', $kategori)
            ->pluck('user_id')
            ->map(fn ($uid) => [
                'user_id'      => $uid,
                'judul'        => $judul,
                'isi'          => $isi,
                'type'         => $type,
                'action_label' => $actionLabel,
                'action_url'   => $actionUrl,
                'is_read'      => false,
                'created_at'   => $now,
                'updated_at'   => $now,
            ])->toArray();

        if (! empty($rows)) {
            self::insert($rows); // 1 query buat semua
        }
    }


    public static function sendToAll($judul, $isi, $type = 'info', $actionLabel = null, $actionUrl = null)
    {
        foreach (User::pluck('user_id') as $uid) {
            self::send($uid, $judul, $isi, $type, $actionLabel, $actionUrl);
        }
    }
}
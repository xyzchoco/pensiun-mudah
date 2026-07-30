<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use App\Models\Notification;
use App\Models\Enrollment;

class SesiSeminar extends Model
{
    use HasFactory;

    protected $table = 'sesi_seminar';

    protected $fillable = [
        'course_id',
        'judul',
        'tanggal',
        'jam',
        'lokasi',
        'link_maps',
        'kapasitas_ruangan',
        'catatan',
        'status',
        'alasan_penolakan',
        'requester_id',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jam'     => 'datetime', // Cast as datetime to handle time objects
    ];

    protected static function booted()
    {
        static::updated(function ($sesi) {
            if ($sesi->wasChanged('status')) {
                $statusBaru = $sesi->status;
                $statusLama = $sesi->getOriginal('status');

                if ($statusLama === 'pending') {
                    if ($statusBaru === 'disetujui') {
                        // 1. Kirim notif ke instansi / korporat yang mengajukan
                        if ($sesi->requester_id) {
                            Notification::send(
                                $sesi->requester_id,
                                'Usulan Jadwal Sesi Seminar Disetujui 🎉',
                                "Usulan jadwal sesi offline/praktik hybrid untuk kelas '{$sesi->course->title}' pada tanggal " . Carbon::parse($sesi->tanggal)->format('d M Y') . " telah disetujui.",
                                'success'
                            );
                        }

                        // 2. Kirim notif ke semua user publik yang mengikuti kelas hybrid tersebut
                        $enrollments = Enrollment::where('course_id', $sesi->course_id)->pluck('user_id');
                        foreach ($enrollments as $uId) {
                            Notification::send(
                                $uId,
                                'Jadwal Sesi Offline Hybrid Tersedia 📅',
                                "Jadwal sesi offline/praktik hybrid untuk kelas '{$sesi->course->title}' telah dirilis pada tanggal " . Carbon::parse($sesi->tanggal)->format('d M Y') . " pukul " . Carbon::parse($sesi->jam)->format('H:i') . " WIB di {$sesi->lokasi}.",
                                'info'
                            );
                        }
                    } elseif ($statusBaru === 'ditolak') {
                        // Kirim notif ke instansi / korporat yang mengajukan
                        if ($sesi->requester_id) {
                            Notification::send(
                                $sesi->requester_id,
                                'Usulan Jadwal Sesi Seminar Ditolak ❌',
                                "Maaf, usulan jadwal untuk kelas '{$sesi->course->title}' ditolak oleh Admin. Alasan: {$sesi->alasan_penolakan}",
                                'danger'
                            );
                        }
                    }
                }
            }
        });
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function absensi(): HasMany
    {
        return $this->hasMany(AbsensiSeminar::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id', 'user_id');
    }
}
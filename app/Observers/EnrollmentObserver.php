<?php

namespace App\Observers;

use App\Models\Enrollment;
use App\Models\Notification;

class EnrollmentObserver
{
    /**
     * Handle the Enrollment "created" event.
     */
    public function created(Enrollment $enrollment): void
    {
        // Eager load course biar bisa ambil title & slug
        $course = $enrollment->course; // pastikan relasi course() ada di model Enrollment

        if (! $course) {
            return;
        }

        Notification::send(
            $enrollment->user_id,
            'Berhasil Gabung Kelas!',
            "Anda kini memiliki akses penuh ke '{$course->title}'. Selamat belajar!",
            'success',
            'Mulai Belajar',
            "/pelatihan/{$course->slug}"
        );
    }

    /**
     * Handle the Enrollment "updated" event.
     */
    public function updated(Enrollment $enrollment): void
    {
        //
    }

    /**
     * Handle the Enrollment "deleted" event.
     */
    public function deleted(Enrollment $enrollment): void
    {
        //
    }

    /**
     * Handle the Enrollment "restored" event.
     */
    public function restored(Enrollment $enrollment): void
    {
        //
    }

    /**
     * Handle the Enrollment "force deleted" event.
     */
    public function forceDeleted(Enrollment $enrollment): void
    {
        //
    }
}

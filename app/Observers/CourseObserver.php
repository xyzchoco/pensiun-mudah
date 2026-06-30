<?php

namespace App\Observers;

use App\Models\Course;
use App\Models\Notification;

class CourseObserver
{
    public function created(Course $course): void
    {
        $this->notifyKelasGratis($course);
    }

    public function updated(Course $course): void
    {
        // Hanya saat status BARU berubah jadi published
        if ($course->isDirty('status')) {
            $this->notifyKelasGratis($course);
        }
    }

    /**
     * Kirim notif "kelas gratis baru" HANYA ke kategori user
     * yang kelasnya memang visible untuk mereka.
     */
    private function notifyKelasGratis(Course $course): void
    {
        // Hanya kelas published & gratis
        if ($course->status !== 'published' || (int) $course->price !== 0) {
            return;
        }

        // Tentukan kategori mana aja yang boleh dapat notif (sesuai visibility)
        $targetKategori = [];
        if ($course->is_visible_publik)   $targetKategori[] = 'publik';
        if ($course->is_visible_asn)      $targetKategori[] = 'asn';
        if ($course->is_visible_korporat) $targetKategori[] = 'korporat';

        // Kirim ke tiap kategori yang relevan aja
        foreach ($targetKategori as $kategori) {
            Notification::sendToRole(
                $kategori,
                'Kelas Gratis Baru Tersedia!',
                "'{$course->title}' kini dapat Anda ikuti tanpa biaya.",
                'info',
                'Lihat Detail Kelas',
                "/pelatihan/{$course->slug}"
            );
        }
    }

    public function deleted(Course $course): void
    {
        //
    }

    public function restored(Course $course): void
    {
        //
    }

    public function forceDeleted(Course $course): void
    {
        //
    }
}
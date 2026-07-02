<?php

namespace App\Observers;

use App\Models\CorporateVoucher;
use App\Models\Notification;

class CorporateVoucherObserver
{
    /**
     * Handle the CorporateVoucher "created" event.
     */
    public function created(CorporateVoucher $voucher): void
    {
        $course = $voucher->course;
        if (! $course) {
            return;
        }

        // Tentukan tujuan link sesuai kategori pembeli
        $buyer = $voucher->corporateUser;
        $isAsn = $buyer && $buyer->kategori_pensiun === 'asn';
        $actionUrl = $isAsn ? '/instansi/pelatihan-dibeli' : '/korporat/pelatihan-dibeli';

        // Get user category and course title for the notification message
        $userCategory = $buyer->kategori_pensiun ?? 'unknown';
        $courseTitle = $course->title ?? 'pelatihan';

        $tipeKelas = match ($course->tipe_kelas) {
            'Online'  => 'Kelas Online',
            'Offline' => 'Kelas Offline (Tatap Muka)',
            'Hybrid'  => 'Kelas Hybrid',
            default   => 'Kelas',
        };

        Notification::send(
            $voucher->corporate_user_id,
            'Voucher Berhasil Dibuat!',
            "Kode voucher untuk {$tipeKelas} '{$courseTitle}' siap dibagikan ke anggota Anda. " .
                "Berlaku untuk {$voucher->max_uses} peserta. Kode: {$voucher->code}",
            'success',
            'Lihat Kode Voucher',
            $actionUrl
        );
    }

    /**
     * Handle the CorporateVoucher "updated" event.
     */
    public function updated(CorporateVoucher $corporateVoucher): void
    {
        //
    }

    /**
     * Handle the CorporateVoucher "deleted" event.
     */
    public function deleted(CorporateVoucher $corporateVoucher): void
    {
        //
    }

    /**
     * Handle the CorporateVoucher "restored" event.
     */
    public function restored(CorporateVoucher $corporateVoucher): void
    {
        //
    }

    /**
     * Handle the CorporateVoucher "force deleted" event.
     */
    public function forceDeleted(CorporateVoucher $corporateVoucher): void
    {
        //
    }
}

<?php

namespace App\Console\Commands;

use App\Mail\EventReminderMail;
use App\Models\Webinar;
use App\Models\WebinarRegistration;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class KirimReminderEvent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'event:kirim-reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kirim email pengingat event 1 jam sebelum dimulai.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Mencari event untuk dikirim pengingat...');

        // Hitung target waktu (1 jam dari sekarang, di timezone Asia/Jakarta)
        $targetTime = Carbon::now('Asia/Jakarta')->addHour();
        $targetDate = $targetTime->toDateString();
        $targetHour = $targetTime->format('H:i');

        // Ambil webinars yang ter-publish dan jadwalnya mendekati targetTime
        $webinars = Webinar::where('is_published', true)
            ->whereDate('tanggal', $targetDate)
            ->whereTime('jam', '>=', $targetTime->copy()->subMinutes(5)->format('H:i:s'))
            ->whereTime('jam', '<=', $targetTime->copy()->addMinutes(5)->format('H:i:s'))
            ->get();

        $emailsSentCount = 0;

        foreach ($webinars as $webinar) {
            $this->info("Memproses webinar: {$webinar->judul} (ID: {$webinar->id})");

            // Ambil registrasi yang belum dibatalkan dan belum dikirim pengingat
            $registrations = WebinarRegistration::where('webinar_id', $webinar->id)
                ->where('status', '!=', WebinarRegistration::STATUS_BATAL)
                ->whereNull('reminder_sent_at')
                ->with('user')
                ->get();

            foreach ($registrations as $registration) {
                if ($registration->user) {
                    Mail::to($registration->user->email)->queue(new EventReminderMail($webinar, $registration->user));
                    $registration->update(['reminder_sent_at' => now()]);
                    $emailsSentCount++;
                    $this->comment("  -> Pengingat dikirim ke: {$registration->user->email}");
                }
            }
        }

        $this->info("Selesai. Total {$emailsSentCount} email pengingat terkirim.");
    }
}

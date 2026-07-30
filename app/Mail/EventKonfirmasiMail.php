<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Webinar;
use App\Models\User;

class EventKonfirmasiMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $webinar;
    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct(Webinar $webinar, User $user)
    {
        $this->webinar = $webinar;
        $this->user = $user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Pendaftaran Berhasil: ' . $this->webinar->judul,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.event-konfirmasi',
            with: [
                'webinar' => $this->webinar,
                'user' => $this->user,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessageReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contactMessage)
    {
        $this->contactMessage->loadMissing('service');
    }

    public function envelope(): Envelope
    {
        $serviceTitle = $this->serviceTitle();

        $subject = $serviceTitle !== null
            ? "Nuevo contacto desde AbacoQD · {$serviceTitle}"
            : 'Nuevo contacto desde AbacoQD';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.contact-message-received',
            with: ['serviceTitle' => $this->serviceTitle()],
        );
    }

    private function serviceTitle(): ?string
    {
        $title = $this->contactMessage->service?->title;

        if (! is_array($title)) {
            return null;
        }

        return $title['es'] ?? $title['en'] ?? null;
    }
}

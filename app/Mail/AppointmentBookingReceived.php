<?php

namespace App\Mail;

use App\Models\AppointmentBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentBookingReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public AppointmentBooking $booking)
    {
        $this->booking->loadMissing(['slot.day', 'service']);
    }

    public function envelope(): Envelope
    {
        $slot = $this->booking->slot;

        $subject = $slot !== null
            ? 'Nueva reserva desde AbacoQD · '.$slot->starts_at->format('d/m/Y H:i')
            : 'Nueva reserva desde AbacoQD';

        return new Envelope(
            subject: $subject,
            replyTo: [
                new Address((string) $this->booking->email, (string) $this->booking->name),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-booking-received',
            with: ['serviceTitle' => $this->serviceTitle()],
        );
    }

    private function serviceTitle(): ?string
    {
        $title = $this->booking->service?->title;

        if (! is_array($title)) {
            return null;
        }

        return $title['es'] ?? $title['en'] ?? null;
    }
}

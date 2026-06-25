<?php

use App\Enums\AppointmentBookingStatus;
use App\Enums\AppointmentSlotStatus;
use App\Mail\AppointmentBookingReceived;
use App\Models\AppointmentBooking;
use App\Models\AppointmentDay;
use App\Models\AppointmentSlot;
use App\Models\Setting;
use App\Support\SiteSettings;
use Illuminate\Support\Facades\Mail;

test('the booking page shows an honest empty state when there are no open slots', function () {
    $response = $this->get('/reserva');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Public/Booking')
        ->has('days', 0)
        ->where('confirmedBooking', null)
    );
});

test('the booking page only lists bookable slots', function () {
    $day = AppointmentDay::factory()->create();

    $bookable = AppointmentSlot::factory()->create([
        'appointment_day_id' => $day->id,
        'starts_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addMinutes(120),
    ]);

    AppointmentSlot::factory()->create([
        'appointment_day_id' => $day->id,
        'starts_at' => now()->subDay(),
        'ends_at' => now()->subDay()->addMinutes(120),
    ]);

    AppointmentSlot::factory()->create([
        'appointment_day_id' => $day->id,
        'starts_at' => now()->addDays(3),
        'ends_at' => now()->addDays(3)->addMinutes(120),
        'admin_blocked' => true,
    ]);

    AppointmentSlot::factory()->create([
        'appointment_day_id' => $day->id,
        'starts_at' => now()->addDays(4),
        'ends_at' => now()->addDays(4)->addMinutes(120),
        'status' => AppointmentSlotStatus::Reserved->value,
        'reserved_count' => 1,
    ]);

    $response = $this->get('/reserva');

    $response->assertInertia(fn ($page) => $page
        ->has('days', 1)
        ->has('days.0.slots', 1)
        ->where('days.0.slots.0.id', $bookable->id)
    );
});

test('a guest can reserve an available slot', function () {
    $slot = AppointmentSlot::factory()->create([
        'starts_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addMinutes(120),
    ]);

    $response = $this->post('/reserva', [
        'appointment_slot_id' => $slot->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'privacy_consent' => '1',
    ]);

    $response->assertRedirect('/reserva');

    $booking = AppointmentBooking::first();

    expect($booking)->not->toBeNull()
        ->and($booking->appointment_slot_id)->toBe($slot->id)
        ->and($booking->status)->toBe(AppointmentBookingStatus::Confirmed)
        ->and($booking->cancellation_token)->not->toBeNull();

    $response->assertSessionHas('confirmedBookingId', $booking->id);

    $slot->refresh();

    expect($slot->reserved_count)->toBe(1)
        ->and($slot->status)->toBe(AppointmentSlotStatus::Reserved);
});

test('the booking confirmation summary is shown on the next page load', function () {
    $slot = AppointmentSlot::factory()->create([
        'starts_at' => now()->addDays(2)->setTime(10, 0),
        'ends_at' => now()->addDays(2)->setTime(12, 0),
    ]);

    $this->post('/reserva', [
        'appointment_slot_id' => $slot->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'privacy_consent' => '1',
    ])->assertRedirect('/reserva');

    $response = $this->get('/reserva');

    $response->assertInertia(fn ($page) => $page
        ->where('confirmedBooking.name', 'Jane Doe')
        ->where('confirmedBooking.email', 'jane@example.com')
    );
});

test('a slot that is already booked cannot be reserved again', function () {
    $slot = AppointmentSlot::factory()->create([
        'starts_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addMinutes(120),
    ]);

    $payload = [
        'appointment_slot_id' => $slot->id,
        'name' => 'First Guest',
        'email' => 'first@example.com',
        'privacy_consent' => '1',
    ];

    $this->post('/reserva', $payload)->assertRedirect('/reserva');

    $second = $this->post('/reserva', [
        ...$payload,
        'name' => 'Second Guest',
        'email' => 'second@example.com',
    ]);

    $second->assertSessionHasErrors('appointment_slot_id');

    expect(AppointmentBooking::count())->toBe(1);

    $slot->refresh();
    expect($slot->reserved_count)->toBe(1);
});

test('privacy consent is required to confirm a booking', function () {
    $slot = AppointmentSlot::factory()->create([
        'starts_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addMinutes(120),
    ]);

    $response = $this->post('/reserva', [
        'appointment_slot_id' => $slot->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ]);

    $response->assertSessionHasErrors('privacy_consent');
    expect(AppointmentBooking::count())->toBe(0);
});

test('a filled honeypot silently rejects the booking submission', function () {
    $slot = AppointmentSlot::factory()->create([
        'starts_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addMinutes(120),
    ]);

    $response = $this->post('/reserva', [
        'appointment_slot_id' => $slot->id,
        'name' => 'Bot',
        'email' => 'bot@example.com',
        'privacy_consent' => '1',
        'honeypot' => 'http://spam.example',
    ]);

    $response->assertSessionHasErrors('honeypot');
    expect(AppointmentBooking::count())->toBe(0);
});

test('a confirmed booking sends a notification to the configured recipient', function () {
    Mail::fake();

    $slot = AppointmentSlot::factory()->create([
        'starts_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addMinutes(120),
    ]);

    $this->post('/reserva', [
        'appointment_slot_id' => $slot->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'privacy_consent' => '1',
    ])->assertRedirect('/reserva');

    $booking = AppointmentBooking::first();

    expect($booking)->not->toBeNull();

    Mail::assertSent(AppointmentBookingReceived::class, function (AppointmentBookingReceived $mail) use ($booking) {
        return $mail->booking->is($booking)
            && $mail->hasTo(SiteSettings::bookingRecipient());
    });
});

test('the booking notification is sent to the recipient configured in settings', function () {
    Mail::fake();

    Setting::query()->create([
        'group' => 'site',
        'key' => 'booking_recipient_email',
        'value' => 'reservas@abacoqd.com',
        'type' => 'string',
        'is_public' => true,
    ]);

    $slot = AppointmentSlot::factory()->create([
        'starts_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addMinutes(120),
    ]);

    $this->post('/reserva', [
        'appointment_slot_id' => $slot->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'privacy_consent' => '1',
    ])->assertRedirect('/reserva');

    expect(SiteSettings::bookingRecipient())->toBe('reservas@abacoqd.com');

    Mail::assertSent(
        AppointmentBookingReceived::class,
        fn (AppointmentBookingReceived $mail) => $mail->hasTo('reservas@abacoqd.com'),
    );
});

test('the booking notification falls back to config when settings has no recipient', function () {
    Mail::fake();

    expect(Setting::query()->where('group', 'site')->where('key', 'booking_recipient_email')->exists())->toBeFalse();

    $slot = AppointmentSlot::factory()->create([
        'starts_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addMinutes(120),
    ]);

    $this->post('/reserva', [
        'appointment_slot_id' => $slot->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'privacy_consent' => '1',
    ])->assertRedirect('/reserva');

    Mail::assertSent(
        AppointmentBookingReceived::class,
        fn (AppointmentBookingReceived $mail) => $mail->hasTo(config('site.contact.booking_recipient')),
    );
});

test('no booking notification is sent when the slot is no longer available', function () {
    Mail::fake();

    $slot = AppointmentSlot::factory()->create([
        'starts_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addMinutes(120),
    ]);

    $payload = [
        'appointment_slot_id' => $slot->id,
        'name' => 'First Guest',
        'email' => 'first@example.com',
        'privacy_consent' => '1',
    ];

    $this->post('/reserva', $payload)->assertRedirect('/reserva');

    $second = $this->post('/reserva', [
        ...$payload,
        'name' => 'Second Guest',
        'email' => 'second@example.com',
    ]);

    $second->assertSessionHasErrors('appointment_slot_id');

    expect(AppointmentBooking::count())->toBe(1);

    // Solo la primera reserva, que sí se creó, dispara la notificación.
    Mail::assertSent(AppointmentBookingReceived::class, 1);
});

test('a failing mailer does not lose the booking nor break the response', function () {
    Mail::shouldReceive('to')->andThrow(new RuntimeException('SMTP down'));

    $slot = AppointmentSlot::factory()->create([
        'starts_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addMinutes(120),
    ]);

    $response = $this->post('/reserva', [
        'appointment_slot_id' => $slot->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'privacy_consent' => '1',
    ]);

    $response->assertRedirect('/reserva');

    $booking = AppointmentBooking::first();

    expect($booking)->not->toBeNull()
        ->and($booking->status)->toBe(AppointmentBookingStatus::Confirmed);

    $response->assertSessionHas('confirmedBookingId', $booking->id);

    $slot->refresh();
    expect($slot->reserved_count)->toBe(1);
});

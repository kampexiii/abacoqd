<?php

use App\Enums\AppointmentBookingStatus;
use App\Enums\AppointmentSlotStatus;
use App\Enums\UserRole;
use App\Models\AppointmentBooking;
use App\Models\AppointmentDay;
use App\Models\AppointmentSlot;
use App\Models\BookingSetting;
use App\Models\Setting;
use App\Models\User;
use App\Support\SiteSettings;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

function bookingAdmin(UserRole $role = UserRole::Admin): User
{
    return User::factory()->create(['role' => $role->value]);
}

/** Próximo lunes a futuro, base estable para generar/bloquear. */
function nextMonday(): CarbonImmutable
{
    return CarbonImmutable::now()->addWeek()->startOfWeek(CarbonImmutable::MONDAY);
}

test('guests are redirected to login from the booking calendar', function () {
    $this->get(route('admin.booking.calendar.index'))->assertRedirect(route('login'));
});

test('a viewer cannot access the booking calendar', function () {
    $this->actingAs(bookingAdmin(UserRole::Viewer));

    $this->get(route('admin.booking.calendar.index'))->assertForbidden();
});

test('an admin can view the booking calendar', function () {
    $this->actingAs(bookingAdmin());

    $this->get(route('admin.booking.calendar.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/Booking/Calendar/Index')->has('days'));
});

test('an editor cannot access the booking calendar', function () {
    $this->actingAs(bookingAdmin(UserRole::Editor));

    $this->get(route('admin.booking.calendar.index'))->assertForbidden();
});

test('an admin can update the booking notification recipient used by email notifications', function () {
    $this->actingAs(bookingAdmin());

    $this->put(route('admin.booking.settings.update'), [
        'provider' => 'cal.com',
        'url' => null,
        'is_enabled' => false,
        'fallback_to_contact' => true,
        'default_duration_minutes' => 60,
        'default_capacity' => 1,
        'min_advance_hours' => 0,
        'max_advance_days' => null,
        'notify_email' => 'info@abacoqd.com',
    ])->assertRedirect(route('admin.booking.settings.edit'));

    $setting = BookingSetting::query()->first();
    $recipient = Setting::query()
        ->where('group', 'site')
        ->where('key', 'booking_recipient_email')
        ->first();

    expect($setting?->settings['notify_email'])->toBe('info@abacoqd.com')
        ->and($recipient?->value)->toBe('info@abacoqd.com')
        ->and(SiteSettings::bookingRecipient())->toBe('info@abacoqd.com');
});

test('an admin can generate availability slots in bulk', function () {
    $this->actingAs(bookingAdmin());
    $monday = nextMonday();

    $this->post(route('admin.booking.calendar.generate'), [
        'date_from' => $monday->toDateString(),
        'date_to' => $monday->toDateString(),
        'weekdays' => [1],
        'start_time' => '10:00',
        'end_time' => '12:00',
        'duration_minutes' => 60,
        'break_minutes' => 0,
        'capacity' => 1,
    ])->assertRedirect();

    expect(AppointmentSlot::count())->toBe(2);
    expect(AppointmentDay::whereDate('date', $monday->toDateString())->exists())->toBeTrue();
});

test('bulk generation does not duplicate existing slots', function () {
    $this->actingAs(bookingAdmin());
    $monday = nextMonday();

    $payload = [
        'date_from' => $monday->toDateString(),
        'date_to' => $monday->toDateString(),
        'weekdays' => [1],
        'start_time' => '10:00',
        'end_time' => '12:00',
        'duration_minutes' => 60,
        'break_minutes' => 0,
        'capacity' => 1,
    ];

    $this->post(route('admin.booking.calendar.generate'), $payload);
    $this->post(route('admin.booking.calendar.generate'), $payload);

    expect(AppointmentSlot::count())->toBe(2);
});

test('generating over a pre-existing day does not violate the unique date constraint', function () {
    $this->actingAs(bookingAdmin());
    $monday = nextMonday();

    // Día histórico guardado con componente horario (formato legado).
    DB::table('appointment_days')->insert([
        'date' => $monday->toDateString().' 00:00:00',
        'is_available' => true,
        'admin_blocked' => false,
        'sort_order' => 0,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->post(route('admin.booking.calendar.generate'), [
        'date_from' => $monday->toDateString(),
        'date_to' => $monday->toDateString(),
        'weekdays' => [1],
        'start_time' => '10:00',
        'end_time' => '12:00',
        'duration_minutes' => 60,
        'break_minutes' => 0,
        'capacity' => 1,
    ])->assertRedirect()->assertSessionHasNoErrors();

    expect(AppointmentDay::count())->toBe(1);
    expect(AppointmentSlot::count())->toBe(2);
});

test('an admin can block a full day', function () {
    $this->actingAs(bookingAdmin());
    $date = nextMonday();
    $day = AppointmentDay::factory()->create(['date' => $date->toDateString()]);
    AppointmentSlot::factory()->count(3)->create([
        'appointment_day_id' => $day->id,
        'starts_at' => $date->setTime(10, 0),
        'ends_at' => $date->setTime(11, 0),
    ]);

    $this->post(route('admin.booking.calendar.block'), [
        'action' => 'block',
        'date_from' => $date->toDateString(),
        'date_to' => $date->toDateString(),
        'reason' => 'Festivo',
    ])->assertRedirect();

    expect(AppointmentSlot::where('admin_blocked', true)->count())->toBe(3);
});

test('an admin can block a range of days', function () {
    $this->actingAs(bookingAdmin());
    $start = nextMonday();

    foreach ([0, 1, 2] as $offset) {
        $date = $start->addDays($offset);
        $day = AppointmentDay::factory()->create(['date' => $date->toDateString()]);
        AppointmentSlot::factory()->create([
            'appointment_day_id' => $day->id,
            'starts_at' => $date->setTime(10, 0),
            'ends_at' => $date->setTime(11, 0),
        ]);
    }

    $this->post(route('admin.booking.calendar.block'), [
        'action' => 'block',
        'date_from' => $start->toDateString(),
        'date_to' => $start->addDays(2)->toDateString(),
    ])->assertRedirect();

    expect(AppointmentSlot::where('admin_blocked', true)->count())->toBe(3);
});

test('blocking a period skips slots with active bookings', function () {
    $this->actingAs(bookingAdmin());
    $date = nextMonday();
    $day = AppointmentDay::factory()->create(['date' => $date->toDateString()]);
    $slot = AppointmentSlot::factory()->create([
        'appointment_day_id' => $day->id,
        'starts_at' => $date->setTime(10, 0),
        'ends_at' => $date->setTime(11, 0),
        'status' => AppointmentSlotStatus::Reserved->value,
        'reserved_count' => 1,
    ]);
    AppointmentBooking::factory()->create([
        'appointment_slot_id' => $slot->id,
        'status' => AppointmentBookingStatus::Confirmed->value,
    ]);

    $this->post(route('admin.booking.calendar.block'), [
        'action' => 'block',
        'date_from' => $date->toDateString(),
        'date_to' => $date->toDateString(),
    ])->assertRedirect();

    expect($slot->refresh()->admin_blocked)->toBeFalse();
});

test('an admin can block a single slot via toggle', function () {
    $this->actingAs(bookingAdmin());
    $slot = AppointmentSlot::factory()->create([
        'starts_at' => nextMonday()->setTime(10, 0),
        'ends_at' => nextMonday()->setTime(11, 0),
    ]);

    $this->patch(route('admin.booking.slots.toggle-blocked', $slot))->assertRedirect();

    expect($slot->refresh()->admin_blocked)->toBeTrue();
});

test('a blocked slot does not appear on the public booking page', function () {
    $date = nextMonday();
    $day = AppointmentDay::factory()->create(['date' => $date->toDateString()]);
    AppointmentSlot::factory()->create([
        'appointment_day_id' => $day->id,
        'starts_at' => $date->setTime(10, 0),
        'ends_at' => $date->setTime(11, 0),
        'admin_blocked' => true,
    ]);

    $this->get('/reserva')->assertInertia(fn ($page) => $page->has('days', 0));
});

test('a reserved slot does not appear on the public booking page', function () {
    $date = nextMonday();
    $day = AppointmentDay::factory()->create(['date' => $date->toDateString()]);
    AppointmentSlot::factory()->create([
        'appointment_day_id' => $day->id,
        'starts_at' => $date->setTime(10, 0),
        'ends_at' => $date->setTime(11, 0),
        'status' => AppointmentSlotStatus::Reserved->value,
        'reserved_count' => 1,
    ]);

    $this->get('/reserva')->assertInertia(fn ($page) => $page->has('days', 0));
});

test('a slot with a confirmed booking cannot be deleted', function () {
    $this->actingAs(bookingAdmin());
    $slot = AppointmentSlot::factory()->create([
        'starts_at' => nextMonday()->setTime(10, 0),
        'ends_at' => nextMonday()->setTime(11, 0),
    ]);
    AppointmentBooking::factory()->create([
        'appointment_slot_id' => $slot->id,
        'status' => AppointmentBookingStatus::Confirmed->value,
    ]);

    $this->delete(route('admin.booking.slots.destroy', $slot));

    $this->assertDatabaseHas('appointment_slots', ['id' => $slot->id]);
});

test('a viewer cannot generate availability', function () {
    $this->actingAs(bookingAdmin(UserRole::Viewer));

    $this->post(route('admin.booking.calendar.generate'), [
        'date_from' => nextMonday()->toDateString(),
        'date_to' => nextMonday()->toDateString(),
        'weekdays' => [1],
        'start_time' => '10:00',
        'end_time' => '12:00',
        'duration_minutes' => 60,
        'break_minutes' => 0,
        'capacity' => 1,
    ])->assertForbidden();

    expect(AppointmentSlot::count())->toBe(0);
});

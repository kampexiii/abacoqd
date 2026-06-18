<?php

namespace Database\Factories;

use App\Enums\AppointmentBookingStatus;
use App\Models\AppointmentBooking;
use App\Models\AppointmentSlot;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<AppointmentBooking>
 */
class AppointmentBookingFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'appointment_slot_id' => AppointmentSlot::factory(),
            'service_id' => null,
            'name' => fake()->name(),
            'company' => null,
            'email' => fake()->unique()->safeEmail(),
            'phone' => null,
            'message' => null,
            'status' => AppointmentBookingStatus::Pending->value,
            'cancellation_token' => Str::random(40),
            'cancelled_at' => null,
            'privacy_consent_accepted_at' => now(),
            'marketing_consent_accepted_at' => null,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Pest',
            'admin_notes' => null,
        ];
    }
}

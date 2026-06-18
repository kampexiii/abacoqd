<?php

namespace Database\Factories;

use App\Enums\AppointmentSlotStatus;
use App\Models\AppointmentDay;
use App\Models\AppointmentSlot;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AppointmentSlot>
 */
class AppointmentSlotFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startsAt = fake()->dateTimeBetween('+1 day', '+30 days');

        return [
            'appointment_day_id' => AppointmentDay::factory(),
            'starts_at' => $startsAt,
            'ends_at' => (clone $startsAt)->modify('+120 minutes'),
            'duration_minutes' => 120,
            'status' => AppointmentSlotStatus::Available->value,
            'admin_blocked' => false,
            'block_reason' => null,
            'capacity' => 1,
            'reserved_count' => 0,
            'notes' => null,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\AppointmentDay;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AppointmentDay>
 */
class AppointmentDayFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => fake()->unique()->dateTimeBetween('+1 day', '+30 days')->format('Y-m-d'),
            'title' => null,
            'notes' => null,
            'is_available' => true,
            'max_bookings' => null,
            'admin_blocked' => false,
            'block_reason' => null,
            'sort_order' => 0,
        ];
    }
}

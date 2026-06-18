<?php

namespace Database\Factories;

use App\Models\BookingSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BookingSetting>
 */
class BookingSettingFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'provider' => 'cal.com',
            'url' => null,
            'is_enabled' => false,
            'fallback_to_contact' => true,
            'settings' => null,
        ];
    }
}

<?php

namespace Database\Seeders;

use App\Models\BookingSetting;
use Illuminate\Database\Seeder;

class BookingSettingsSeeder extends Seeder
{
    /**
     * Seed booking in documented fallback mode.
     */
    public function run(): void
    {
        BookingSetting::updateOrCreate(
            ['provider' => 'cal.com'],
            [
                'url' => null,
                'is_enabled' => false,
                'fallback_to_contact' => true,
                'settings' => [
                    'recommended_provider' => 'Cal.com',
                    'alternative_provider' => 'Calendly',
                    'status' => 'pending_provider_confirmation',
                ],
            ],
        );
    }
}

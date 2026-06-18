<?php

namespace Database\Factories;

use App\Enums\ContactMessageStatus;
use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactMessage>
 */
class ContactMessageFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'service_id' => null,
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->optional()->phoneNumber(),
            'company' => fake()->optional()->company(),
            'subject' => fake()->optional()->sentence(4),
            'message' => fake()->paragraph(),
            'preferred_contact_method' => 'email',
            'privacy_accepted_at' => now(),
            'commercial_consent' => false,
            'commercial_consent_at' => null,
            'source' => 'factory',
            'status' => ContactMessageStatus::New->value,
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'metadata' => null,
        ];
    }
}

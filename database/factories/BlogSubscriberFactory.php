<?php

namespace Database\Factories;

use App\Enums\SubscriberStatus;
use App\Models\BlogSubscriber;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BlogSubscriber>
 */
class BlogSubscriberFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'name' => fake()->optional()->name(),
            'locale' => 'es',
            'status' => SubscriberStatus::Pending->value,
            'consent_accepted_at' => now(),
            'confirmation_token' => Str::random(40),
            'confirmed_at' => null,
            'unsubscribed_at' => null,
            'source' => 'factory',
            'consent_ip' => fake()->ipv4(),
        ];
    }
}

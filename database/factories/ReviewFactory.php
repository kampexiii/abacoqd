<?php

namespace Database\Factories;

use App\Enums\PermissionStatus;
use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'partner_id' => null,
            'project_id' => null,
            'author_name' => fake()->name(),
            'author_role' => null,
            'company_name' => null,
            'content' => ['es' => fake()->paragraph(), 'en' => fake()->paragraph()],
            'rating' => fake()->numberBetween(1, 5),
            'source' => null,
            'source_url' => null,
            'permission_status' => PermissionStatus::Pending->value,
            'permission_notes' => null,
            'show_on_home' => false,
            'is_featured' => false,
            'is_active' => false,
            'sort_order' => fake()->numberBetween(1, 20),
        ];
    }
}

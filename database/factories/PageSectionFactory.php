<?php

namespace Database\Factories;

use App\Models\PageSection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PageSection>
 */
class PageSectionFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'page' => 'home',
            'key' => fake()->unique()->slug(2),
            'name' => fake()->words(2, true),
            'title' => ['es' => fake()->sentence(3), 'en' => fake()->sentence(3)],
            'subtitle' => ['es' => fake()->sentence(), 'en' => fake()->sentence()],
            'content' => null,
            'cta' => null,
            'media_path' => null,
            'icon' => null,
            'sort_order' => fake()->numberBetween(1, 20),
            'is_active' => true,
            'show_on_home' => true,
            'settings' => null,
        ];
    }
}

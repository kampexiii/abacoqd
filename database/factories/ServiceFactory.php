<?php

namespace Database\Factories;

use App\Enums\ServiceStatus;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->word().' '.fake()->word().' '.fake()->word();

        return [
            'title' => ['es' => $title, 'en' => $title],
            'slug' => ['es' => Str::slug($title), 'en' => Str::slug($title)],
            'summary' => ['es' => fake()->sentence(), 'en' => fake()->sentence()],
            'description' => ['es' => fake()->paragraph(), 'en' => fake()->paragraph()],
            'icon' => 'code',
            'image' => null,
            'cta' => null,
            'status' => ServiceStatus::Published->value,
            'sort_order' => fake()->numberBetween(1, 20),
            'is_featured' => false,
            'is_active' => true,
            'show_on_home' => true,
            'is_detail_enabled' => false,
            'settings' => null,
        ];
    }
}

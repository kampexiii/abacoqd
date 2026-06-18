<?php

namespace Database\Factories;

use App\Models\MethodologyStep;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<MethodologyStep>
 */
class MethodologyStepFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->word().' '.fake()->word();

        return [
            'number' => fake()->numberBetween(1, 6),
            'title' => ['es' => $title, 'en' => $title],
            'slug' => ['es' => Str::slug($title), 'en' => Str::slug($title)],
            'summary' => ['es' => fake()->sentence(), 'en' => fake()->sentence()],
            'description' => ['es' => fake()->paragraph(), 'en' => fake()->paragraph()],
            'deliverable' => ['es' => fake()->sentence(), 'en' => fake()->sentence()],
            'icon' => 'sparkles',
            'badge' => null,
            'is_free_initial_study' => false,
            'is_featured' => false,
            'sort_order' => fake()->numberBetween(1, 6),
            'is_active' => true,
            'settings' => null,
        ];
    }
}

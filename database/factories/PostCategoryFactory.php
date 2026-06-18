<?php

namespace Database\Factories;

use App\Models\PostCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PostCategory>
 */
class PostCategoryFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->word().' '.fake()->word();

        return [
            'name' => ['es' => $name, 'en' => $name],
            'slug' => ['es' => Str::slug($name), 'en' => Str::slug($name)],
            'description' => ['es' => fake()->sentence(), 'en' => fake()->sentence()],
            'sort_order' => fake()->numberBetween(1, 20),
            'is_active' => true,
        ];
    }
}

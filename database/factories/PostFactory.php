<?php

namespace Database\Factories;

use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(4);

        return [
            'post_category_id' => PostCategory::factory(),
            'user_id' => User::factory(),
            'title' => ['es' => $title, 'en' => $title],
            'slug' => ['es' => Str::slug($title), 'en' => Str::slug($title)],
            'excerpt' => ['es' => fake()->sentence(), 'en' => fake()->sentence()],
            'content' => ['es' => [['type' => 'paragraph', 'text' => fake()->paragraph()]], 'en' => [['type' => 'paragraph', 'text' => fake()->paragraph()]]],
            'featured_image' => null,
            'status' => PostStatus::Draft->value,
            'published_at' => null,
            'is_featured' => false,
            'featured_order' => null,
            'show_on_home' => false,
            'reading_time' => fake()->numberBetween(2, 8),
            'settings' => null,
        ];
    }
}

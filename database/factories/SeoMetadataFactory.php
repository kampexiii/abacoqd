<?php

namespace Database\Factories;

use App\Models\SeoMetadata;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SeoMetadata>
 */
class SeoMetadataFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'seoable_type' => null,
            'seoable_id' => null,
            'page_key' => fake()->unique()->slug(2),
            'locale' => 'es',
            'title' => fake()->sentence(4),
            'description' => fake()->sentence(),
            'canonical_url' => null,
            'robots' => 'index,follow',
            'og_title' => null,
            'og_description' => null,
            'og_image' => null,
            'schema_type' => null,
            'schema_data' => null,
        ];
    }
}

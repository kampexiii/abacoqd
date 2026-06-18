<?php

namespace Database\Factories;

use App\Models\PageSection;
use App\Models\SectionBlock;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SectionBlock>
 */
class SectionBlockFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'page_section_id' => PageSection::factory(),
            'type' => 'text',
            'title' => ['es' => fake()->sentence(3), 'en' => fake()->sentence(3)],
            'content' => ['es' => fake()->paragraph(), 'en' => fake()->paragraph()],
            'image' => null,
            'icon' => null,
            'cta' => null,
            'sort_order' => fake()->numberBetween(1, 20),
            'is_active' => true,
            'settings' => null,
        ];
    }
}

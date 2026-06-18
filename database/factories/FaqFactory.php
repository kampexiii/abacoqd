<?php

namespace Database\Factories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Faq>
 */
class FaqFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'question' => ['es' => fake()->sentence().'?', 'en' => fake()->sentence().'?'],
            'answer' => ['es' => fake()->paragraph(), 'en' => fake()->paragraph()],
            'category' => 'general',
            'intent' => null,
            'redirect_url' => null,
            'redirect_section' => null,
            'show_in_chatbot' => true,
            'show_on_page' => false,
            'sort_order' => fake()->numberBetween(1, 20),
            'is_active' => true,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<TeamMember>
 */
class TeamMemberFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1000, 9999),
            'role' => ['es' => 'Pendiente de validar', 'en' => 'Pending validation'],
            'bio' => null,
            'photo' => null,
            'photo_alt' => null,
            'linkedin_url' => null,
            'github_url' => null,
            'personal_url' => null,
            'cv_path' => null,
            'email' => null,
            'sort_order' => fake()->numberBetween(1, 20),
            'is_visible' => false,
            'is_active' => true,
            'settings' => null,
        ];
    }
}

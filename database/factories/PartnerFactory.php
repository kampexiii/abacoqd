<?php

namespace Database\Factories;

use App\Enums\PartnerType;
use App\Enums\PermissionStatus;
use App\Models\Partner;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Partner>
 */
class PartnerFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company();

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1000, 9999),
            'type' => PartnerType::Other->value,
            'logo' => null,
            'logo_dark' => null,
            'logo_alt' => null,
            'website' => null,
            'social_links' => null,
            'description' => ['es' => fake()->sentence(), 'en' => fake()->sentence()],
            'permission_status' => PermissionStatus::Pending->value,
            'permission_notes' => null,
            'show_on_home' => false,
            'show_in_collaborations' => false,
            'show_in_projects' => false,
            'is_featured' => false,
            'is_active' => false,
            'sort_order' => fake()->numberBetween(1, 20),
            'settings' => null,
        ];
    }
}

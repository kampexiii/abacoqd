<?php

namespace Database\Factories;

use App\Enums\PermissionStatus;
use App\Enums\ProjectStatus;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
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
            'challenge' => null,
            'solution' => null,
            'result' => null,
            'cover_image' => null,
            'thumbnail_image' => null,
            'gallery' => null,
            'technologies' => [],
            'status' => ProjectStatus::Draft->value,
            'year' => null,
            'client_name' => null,
            'client_partner_id' => null,
            'github_url' => null,
            'external_url' => null,
            'permission_status' => PermissionStatus::Pending->value,
            'permission_notes' => null,
            'show_on_home' => false,
            'show_in_projects' => false,
            'show_in_collaborations' => false,
            'is_featured' => false,
            'is_active' => false,
            'sort_order' => fake()->numberBetween(1, 20),
            'settings' => null,
        ];
    }
}

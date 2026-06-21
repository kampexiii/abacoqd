<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SettingsSeeder::class,
            MethodologyStepSeeder::class,
            ServiceSeeder::class,
            BlogTaxonomySeeder::class,
            BlogPostSeeder::class,
            BookingSettingsSeeder::class,
            FaqSeeder::class,
            SeoMetadataSeeder::class,
            AbacoHistoricalProjectsSeeder::class,
            TeamMemberSeeder::class,
            AdminUserSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}

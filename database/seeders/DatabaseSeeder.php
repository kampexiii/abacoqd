<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;

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
            BookingSettingsSeeder::class,
            FaqSeeder::class,
            SeoMetadataSeeder::class,
            ConfirmedPartnersSeeder::class,
            ConfirmedProjectsSeeder::class,
            TeamMemberSeeder::class,
            AdminUserSeeder::class,
        ]);

        if (! App::environment('production')) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }
    }
}

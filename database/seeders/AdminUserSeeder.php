<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Hash;

/**
 * Usuario administrador de apoyo para entornos no productivos.
 *
 * El seeder es idempotente y no modifica el usuario si ya existe.
 * No se ejecuta en producción.
 */
class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        if (App::environment('production')) {
            return;
        }

        User::firstOrCreate(
            ['email' => 'admin@abacoqd.local'],
            [
                'name' => 'Admin AbacoQD',
                'password' => Hash::make('password'),
                'role' => UserRole::SuperAdmin->value,
                'email_verified_at' => now(),
            ],
        );
    }
}

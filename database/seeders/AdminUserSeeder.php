<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Hash;

/**
 * Usuario super_admin de acceso al panel — SOLO entorno local/desarrollo.
 *
 * Credenciales locales (no producción): admin@abacoqd.local / password.
 * Es idempotente (firstOrCreate por email): no duplica ni resetea la contraseña
 * si el usuario ya existe. En producción no crea nada.
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

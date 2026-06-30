<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use App\Services\Media\TeamMemberPhotoService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/**
 * Perfiles de `team_members` con persistencia idempotente por `slug`.
 *
 * La imagen se resuelve con este orden de prioridad:
 * 1. archivo fuente local si está disponible;
 * 2. asset ya publicado en `public/uploads/team-members`;
 * 3. valor existente en base de datos;
 * 4. `null` si no existe ninguna fuente válida.
 */
class TeamMemberSeeder extends Seeder
{
    public function run(TeamMemberPhotoService $photos): void
    {
        $slug = 'andres-casanueva';
        $sourcePath = base_path('andres.png');
        $relativePath = "team-members/{$slug}.webp";

        if (is_file($sourcePath)) {
            $photo = $photos->storeFromPath($sourcePath, $slug);
        } elseif (Storage::disk('public_uploads')->exists($relativePath)) {
            $photo = '/uploads/'.$relativePath;
        } else {
            $photo = TeamMember::query()->where('slug', $slug)->value('photo');

            $this->command->warn(
                "TeamMemberSeeder: no se encontró {$sourcePath} ni un WebP ya versionado; se conserva la foto existente (o null) para '{$slug}'.",
            );
        }

        TeamMember::query()->updateOrCreate(
            ['slug' => $slug],
            [
                'name' => 'Andrés Casanueva',
                'role' => [
                    'es' => 'Abaco Developments',
                    'en' => 'Abaco Developments',
                ],
                'bio' => [
                    'es' => 'Acompaña la evolución de Abaco Developments hacia soluciones digitales rápidas, a medida y apoyadas por IA supervisada.',
                    'en' => 'Supports the evolution of Abaco Developments towards fast, custom digital solutions powered by supervised AI.',
                ],
                'photo' => $photo,
                'photo_alt' => 'Retrato de Andrés Casanueva',
                'linkedin_url' => 'https://es.linkedin.com/in/andres-casanueva-tomas',
                'github_url' => null,
                'personal_url' => null,
                'cv_path' => null,
                'email' => 'andrescasanueva@abacodev.com',
                'sort_order' => 1,
                'is_visible' => true,
                'is_active' => true,
                'settings' => [
                    'publication_status' => 'public',
                ],
            ],
        );
    }
}

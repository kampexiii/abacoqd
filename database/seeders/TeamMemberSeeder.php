<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use App\Services\Media\TeamMemberPhotoService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/**
 * Perfiles reales de `team_members`. Idempotente vía `updateOrCreate` por
 * `slug`: no duplica al re-ejecutar `migrate:fresh --seed`.
 *
 * La foto de Andrés se procesa desde un PNG temporal aportado en la raíz del
 * proyecto (`andres.png`, fuera de control de versiones) usando
 * `TeamMemberPhotoService`, el mismo servicio que deberá reutilizar el futuro
 * CRUD admin al subir/cambiar fotos. Prioridad para resolver `photo`:
 * 1) PNG temporal en la raíz, si está presente (se convierte de nuevo);
 * 2) WebP ya versionado en `public/uploads/team-members` (clon limpio del
 *    repo, sin el PNG temporal pero con el asset ya commiteado);
 * 3) valor ya guardado en BD para ese slug (re-seed sin wipe);
 * 4) `null` si no hay ninguna de las anteriores.
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
                    'validation_status' => 'pending_final_approval',
                ],
            ],
        );
    }
}

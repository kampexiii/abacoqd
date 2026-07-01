<?php

namespace App\Services\Media;

use App\Support\Media\ImageVariantService;

/**
 * Convierte fotos de equipo a WebP y las guarda en un disco público.
 *
 * Único punto de conversión/almacenamiento de fotos de `team_members`:
 * lo usa el seeder ahora y debe reutilizarlo el futuro CRUD admin al
 * crear/editar un miembro (con la ruta temporal de un `UploadedFile`).
 *
 * Usa el disco `public_uploads` (`public/uploads`) y no `public`
 * (`storage/app/public`) porque este último está fuera de control de
 * versiones por defecto en este proyecto; las fotos de equipo son assets
 * reales aportados con cada perfil y deben quedar versionados con el repo.
 */
class TeamMemberPhotoService
{
    use InteractsWithPublicUploads;

    private const DIRECTORY = 'team-members';

    /**
     * Convierte una imagen fuente (PNG/JPEG/WebP) a WebP, genera variantes
     * responsivas y la guarda como `{slug}.webp` en
     * `public/uploads/team-members`, sobrescribiendo si ya existe una foto
     * previa para el mismo slug.
     *
     * @return string Ruta pública a guardar en `team_members.photo`
     *                (`/uploads/team-members/{slug}.webp`).
     */
    public function storeFromPath(string $sourcePath, string $slug): string
    {
        return (new ImageVariantService)->storeFromPath(
            $sourcePath,
            self::DIRECTORY,
            $slug,
            ImageVariantService::TEAM_MEMBER_WIDTHS,
        )['path'];
    }
}

<?php

namespace App\Services\Media;

use App\Support\Media\ImageVariantService;

/**
 * Convierte imágenes/mockups de servicios a WebP y las guarda en disco público.
 *
 * Único punto de conversión/almacenamiento de imágenes de `services`. Lo usa el
 * CRUD admin al crear/editar un servicio (con la ruta temporal de un
 * `UploadedFile`). Mismo patrón y disco versionable (`public_uploads`) que
 * `TeamMemberPhotoService` y `PostCoverImageService`: se guarda solo la ruta
 * pública en BD, nunca el binario.
 */
class ServiceImageService
{
    use InteractsWithPublicUploads;

    private const DIRECTORY = 'services';

    /**
     * Convierte una imagen fuente (PNG/JPEG/WebP) a WebP, genera variantes
     * responsivas y la guarda como `{slug}.webp` en `public/uploads/services`,
     * sobrescribiendo si ya existe una imagen previa para el mismo slug.
     *
     * @return string Ruta pública a guardar en `services.image`
     *                (`/uploads/services/{slug}.webp`).
     */
    public function storeFromPath(string $sourcePath, string $slug): string
    {
        return (new ImageVariantService)->storeFromPath(
            $sourcePath,
            self::DIRECTORY,
            $slug,
            ImageVariantService::SERVICE_WIDTHS,
        )['path'];
    }
}

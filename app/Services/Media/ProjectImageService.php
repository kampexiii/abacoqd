<?php

namespace App\Services\Media;

use App\Support\Media\ImageVariantService;

/**
 * Convierte la imagen de proyecto (portada) y los logos de cliente/empresa de
 * `projects` y los guarda en disco público.
 *
 * Mismo patrón y disco versionable (`public_uploads`) que
 * `PartnerLogoService`/`ServiceImageService`: solo se guarda la ruta pública en
 * BD, nunca el binario. Las imágenes raster (PNG/JPEG/WebP) se convierten a
 * WebP; los logos pueden llegar en SVG (vectorial), que se conserva tal cual
 * (no tiene sentido rasterizarlo). El control de qué formatos admite cada campo
 * vive en `ProjectRequest` (la portada solo raster; los logos también SVG).
 */
class ProjectImageService
{
    use InteractsWithPublicUploads;

    private const DIRECTORY = 'projects';

    /**
     * @param  string|null  $extensionHint  Extensión original del archivo subido
     *                                      (`UploadedFile::getClientOriginalExtension()`).
     *                                      El `$sourcePath` real de una subida HTTP es el
     *                                      fichero temporal de PHP (p. ej. `php9A1B.tmp`), que
     *                                      no conserva la extensión original: sin esta pista,
     *                                      un logo SVG subido desde el admin nunca se detecta
     *                                      como SVG y se intenta procesar (mal) como raster.
     *                                      Si no se pasa, se infiere de `$sourcePath` (caso de
     *                                      los seeders, que sí usan rutas con extensión real).
     * @return string Ruta pública (`/uploads/projects/{slug}-{variant}.webp|svg`).
     */
    public function storeFromPath(string $sourcePath, string $slug, string $variant, ?string $extensionHint = null): string
    {
        $isLogo = $variant !== 'cover';

        return (new ImageVariantService)->storeFromPath(
            $sourcePath,
            self::DIRECTORY,
            "{$slug}-{$variant}",
            $isLogo ? ImageVariantService::LOGO_WIDTHS : ImageVariantService::PROJECT_WIDTHS,
            $extensionHint,
            allowSvg: $isLogo,
        )['path'];
    }
}

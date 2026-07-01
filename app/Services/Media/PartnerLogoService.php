<?php

namespace App\Services\Media;

use App\Support\Media\ImageVariantService;

/**
 * Convierte/guarda logos de `partners` (claro/oscuro) en disco público.
 *
 * Mismo patrón y disco versionable (`public_uploads`) que
 * `ServiceImageService`/`PostCoverImageService`/`TeamMemberPhotoService`: solo
 * se guarda la ruta pública en BD, nunca el binario. A diferencia de esos
 * servicios, los logos de marca llegan habitualmente en SVG (vectorial); en
 * ese caso se conserva el SVG tal cual (no tiene sentido rasterizarlo a WebP)
 * y solo se convierte a WebP el resto de formatos (PNG/JPEG/WebP).
 */
class PartnerLogoService
{
    use InteractsWithPublicUploads;

    private const DIRECTORY = 'partners';

    /**
     * @param  string  $variant  Sufijo del fichero (`logo` o `logo-dark`) para
     *                           no pisar el otro logo del mismo partner.
     * @param  string|null  $extensionHint  Extensión original del archivo subido
     *                                      (`UploadedFile::getClientOriginalExtension()`).
     *                                      El `$sourcePath` real de una subida HTTP es el
     *                                      fichero temporal de PHP (p. ej. `php9A1B.tmp`), que
     *                                      no conserva la extensión original: sin esta pista,
     *                                      un logo SVG subido desde el admin nunca se detecta
     *                                      como SVG y se intenta procesar (mal) como raster.
     * @return string Ruta pública a guardar en BD
     *                (`/uploads/partners/{slug}-{variant}.webp|svg`).
     */
    public function storeFromPath(string $sourcePath, string $slug, string $variant = 'logo', ?string $extensionHint = null): string
    {
        return (new ImageVariantService)->storeFromPath(
            $sourcePath,
            self::DIRECTORY,
            "{$slug}-{$variant}",
            ImageVariantService::LOGO_WIDTHS,
            $extensionHint,
            allowSvg: true,
        )['path'];
    }
}

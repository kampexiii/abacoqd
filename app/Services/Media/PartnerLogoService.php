<?php

namespace App\Services\Media;

use GdImage;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use RuntimeException;

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

    private const DISK = 'public_uploads';

    private const DIRECTORY = 'partners';

    private const QUALITY = 88;

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
        if (! is_file($sourcePath)) {
            throw new InvalidArgumentException("Source image not found: {$sourcePath}");
        }

        $extension = strtolower($extensionHint ?? pathinfo($sourcePath, PATHINFO_EXTENSION));

        if ($extension === 'svg') {
            return $this->storeSvg($sourcePath, $slug, $variant);
        }

        return $this->storeRaster($sourcePath, $slug, $variant);
    }

    private function storeSvg(string $sourcePath, string $slug, string $variant): string
    {
        $contents = file_get_contents($sourcePath);

        if ($contents === false || ! str_contains($contents, '<svg')) {
            throw new InvalidArgumentException("File is not a valid SVG: {$sourcePath}");
        }

        $this->assertSvgIsSafe($contents, $sourcePath);

        $path = self::DIRECTORY.'/'."{$slug}-{$variant}.svg";

        Storage::disk(self::DISK)->put($path, $contents);

        return '/uploads/'.$path;
    }

    private function storeRaster(string $sourcePath, string $slug, string $variant): string
    {
        if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
            throw new RuntimeException('La extensión GD con soporte WebP no está disponible en este entorno.');
        }

        $image = $this->readImage($sourcePath);

        imagepalettetotruecolor($image);
        imagealphablending($image, true);
        imagesavealpha($image, true);

        ob_start();
        $converted = imagewebp($image, null, self::QUALITY);
        $contents = ob_get_clean();

        if (! $converted || ! is_string($contents) || $contents === '') {
            throw new RuntimeException("No se pudo convertir la imagen a WebP: {$sourcePath}");
        }

        $path = self::DIRECTORY.'/'."{$slug}-{$variant}.webp";

        Storage::disk(self::DISK)->put($path, $contents);

        return '/uploads/'.$path;
    }

    private function readImage(string $sourcePath): GdImage
    {
        $info = getimagesize($sourcePath);

        if ($info === false) {
            throw new InvalidArgumentException("File is not a valid image: {$sourcePath}");
        }

        $image = match ($info[2]) {
            IMAGETYPE_PNG => imagecreatefrompng($sourcePath),
            IMAGETYPE_JPEG => imagecreatefromjpeg($sourcePath),
            IMAGETYPE_WEBP => imagecreatefromwebp($sourcePath),
            default => throw new InvalidArgumentException('Formato de imagen no soportado: usa PNG, JPEG, WebP o SVG.'),
        };

        if (! $image instanceof GdImage) {
            throw new RuntimeException("No se pudo leer la imagen: {$sourcePath}");
        }

        return $image;
    }
}

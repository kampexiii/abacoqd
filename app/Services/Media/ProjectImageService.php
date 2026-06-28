<?php

namespace App\Services\Media;

use GdImage;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use RuntimeException;

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

    private const DISK = 'public_uploads';

    private const DIRECTORY = 'projects';

    private const QUALITY = 88;

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
            default => throw new InvalidArgumentException('Formato de imagen no soportado: usa PNG, JPEG o WebP.'),
        };

        if (! $image instanceof GdImage) {
            throw new RuntimeException("No se pudo leer la imagen: {$sourcePath}");
        }

        return $image;
    }
}

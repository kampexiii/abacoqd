<?php

namespace App\Services\Media;

use GdImage;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use RuntimeException;

/**
 * Convierte cover/thumbnail/galería de `projects` a WebP y los guarda en
 * disco público.
 *
 * Mismo patrón y disco versionable (`public_uploads`) que
 * `ServiceImageService`/`PostCoverImageService`: solo se guarda la ruta
 * pública en BD, nunca el binario. La galería admite varias imágenes por
 * proyecto, cada una con sufijo numérico para no pisar las anteriores.
 */
class ProjectImageService
{
    use InteractsWithPublicUploads;

    private const DISK = 'public_uploads';

    private const DIRECTORY = 'projects';

    private const QUALITY = 88;

    /**
     * @return string Ruta pública (`/uploads/projects/{slug}-{variant}.webp`).
     */
    public function storeFromPath(string $sourcePath, string $slug, string $variant): string
    {
        if (! is_file($sourcePath)) {
            throw new InvalidArgumentException("Source image not found: {$sourcePath}");
        }

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

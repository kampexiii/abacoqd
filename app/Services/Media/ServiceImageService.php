<?php

namespace App\Services\Media;

use GdImage;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use RuntimeException;

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
    private const DISK = 'public_uploads';

    private const DIRECTORY = 'services';

    private const QUALITY = 88;

    /**
     * Convierte una imagen fuente (PNG/JPEG/WebP) a WebP y la guarda como
     * `{slug}.webp` en `public/uploads/services`, sobrescribiendo si ya existe
     * una imagen previa para el mismo slug.
     *
     * @return string Ruta pública a guardar en `services.image`
     *                (`/uploads/services/{slug}.webp`).
     */
    public function storeFromPath(string $sourcePath, string $slug): string
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

        $filename = "{$slug}.webp";
        $path = self::DIRECTORY.'/'.$filename;

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

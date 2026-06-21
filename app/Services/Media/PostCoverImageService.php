<?php

namespace App\Services\Media;

use GdImage;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use RuntimeException;

/**
 * Convierte covers de posts del blog a WebP y las guarda en un disco público.
 *
 * Sigue el mismo patrón ya probado en `TeamMemberPhotoService` (GD nativo,
 * disco `public_uploads` = `public/uploads`, calidad 88): mismo enfoque, no
 * una arquitectura nueva. Lo usa el seeder ahora y debe reutilizarlo el futuro
 * CRUD admin de Blog al crear/editar un post (con la ruta temporal de un
 * `UploadedFile`).
 *
 * Se usa `public_uploads` y no `public` (`storage/app/public`) porque este
 * último está fuera de control de versiones por defecto; los covers iniciales
 * son assets reales que deben quedar versionados con el repo.
 */
class PostCoverImageService
{
    private const DISK = 'public_uploads';

    private const DIRECTORY = 'blog/posts';

    private const QUALITY = 88;

    /**
     * Convierte una imagen fuente (PNG/JPEG/WebP) a WebP y la guarda como
     * `{slug}.webp` en `public/uploads/blog/posts`, sobrescribiendo si ya
     * existe un cover previo para el mismo slug.
     *
     * @return string Ruta pública a guardar en `posts.featured_image`
     *                (`/uploads/blog/posts/{slug}.webp`).
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

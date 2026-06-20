<?php

namespace App\Services\Media;

use GdImage;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use RuntimeException;

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
    private const DISK = 'public_uploads';

    private const DIRECTORY = 'team-members';

    private const QUALITY = 88;

    /**
     * Convierte una imagen fuente (PNG/JPEG/WebP) a WebP y la guarda como
     * `{slug}.webp` en `public/uploads/team-members`, sobrescribiendo si ya
     * existe una foto previa para el mismo slug.
     *
     * @return string Ruta pública a guardar en `team_members.photo`
     *                (`/uploads/team-members/{slug}.webp`).
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

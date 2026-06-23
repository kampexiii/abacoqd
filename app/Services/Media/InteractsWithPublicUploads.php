<?php

namespace App\Services\Media;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Borrado del archivo físico anterior cuando una imagen/asset se sustituye o
 * se quita desde el admin.
 *
 * Todos los servicios de media guardan en el disco `public_uploads`
 * (`public/uploads`) y devuelven la ruta pública `/uploads/...` que se persiste
 * en BD. Este trait hace el camino inverso: dada esa ruta pública, localiza el
 * fichero en el disco y lo elimina, evitando que quede peso heredado (WebP, SVG
 * o PDF antiguos) en el servidor.
 *
 * El borrado se hace SIEMPRE por la ruta realmente almacenada en BD (el valor
 * previo del modelo), no recalculando el nombre desde el slug: así cubre por
 * igual el reemplazo con cambio de formato (SVG→WebP), el cambio de slug y el
 * simple «quitar imagen».
 */
trait InteractsWithPublicUploads
{
    private const PUBLIC_UPLOADS_DISK = 'public_uploads';

    /**
     * Elimina el archivo anterior referenciado por una ruta pública
     * (`/uploads/...`). No hace nada si la ruta es nula, vacía, no apunta al
     * disco de uploads (p. ej. una URL externa o un asset versionado fuera de
     * `public/uploads`) o intenta escapar del disco con `..` (path traversal).
     */
    public function delete(?string $publicPath): void
    {
        if ($publicPath === null || $publicPath === '') {
            return;
        }

        if (! Str::startsWith($publicPath, '/uploads/')) {
            return;
        }

        $relative = Str::after($publicPath, '/uploads/');

        if ($relative === '' || $relative === $publicPath || Str::contains($relative, '..')) {
            return;
        }

        Storage::disk(self::PUBLIC_UPLOADS_DISK)->delete($relative);
    }
}

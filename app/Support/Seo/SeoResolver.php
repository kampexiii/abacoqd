<?php

namespace App\Support\Seo;

use App\Models\SeoMetadata;

/**
 * Resuelve el SEO base de una página/modelo combinando, por orden de prioridad:
 *
 *   1. Registro `seo_metadata` (por `page_key` para páginas estáticas o por la
 *      relación `seoable` para Service/Project/Post), siempre en locale ES.
 *   2. Fallback por título/resumen de la propia página o modelo.
 *   3. Fallback global de `config/site.php` (`site.seo`).
 *
 * Decisión cerrada del primer bloque: solo ES es indexable, no se emiten URLs
 * `/en` (los registros EN se conservan como datos traducibles, pero su canonical
 * no se sirve). Todos los canonical son absolutos sobre el dominio canónico.
 */
class SeoResolver
{
    private const LOCALE = 'es';

    /**
     * SEO de una página estática por `page_key`. Si `$pageKey` es null (rutas no
     * mapeadas, p. ej. admin/auth) o no hay registro, cae a los fallbacks.
     */
    public function forPage(?string $pageKey, string $path): SeoData
    {
        $record = $pageKey !== null
            ? SeoMetadata::query()->page($pageKey)->locale(self::LOCALE)->first()
            : null;

        return $this->build(
            $record,
            $path,
            (string) config('site.seo.title'),
            (string) config('site.seo.description'),
        );
    }

    /**
     * SEO de un modelo (Service/Project/Post) a partir de su registro `seoable`
     * en ES, con fallback al título/resumen del propio modelo.
     */
    public function forRecord(
        ?SeoMetadata $record,
        string $path,
        ?string $titleFallback,
        ?string $descriptionFallback,
    ): SeoData {
        $title = $titleFallback !== null && $titleFallback !== ''
            ? $titleFallback.' | '.(string) config('site.seo.brand')
            : (string) config('site.seo.title');

        $description = $descriptionFallback !== null && $descriptionFallback !== ''
            ? $descriptionFallback
            : (string) config('site.seo.description');

        return $this->build($record, $path, $title, $description);
    }

    /**
     * SEO de una ruta NO pública (admin, auth, dashboard, ajustes de usuario,
     * utilidades): nunca indexable. Conserva title/description del fallback
     * global por uniformidad, pero fuerza `noindex,nofollow`. No depende de
     * `seo_metadata` (estas rutas no se gestionan desde el admin SEO, que no
     * existe por decisión cerrada).
     */
    public function forNonPublic(string $path): SeoData
    {
        $title = (string) config('site.seo.title');
        $description = (string) config('site.seo.description');

        return new SeoData(
            title: $title,
            description: $description,
            canonical: $this->absolute($path),
            robots: 'noindex,nofollow',
            ogTitle: $title,
            ogDescription: $description,
            ogImage: $this->resolveOgImage(null),
        );
    }

    private function build(
        ?SeoMetadata $record,
        string $path,
        string $titleFallback,
        string $descriptionFallback,
    ): SeoData {
        $title = $this->firstFilled($record?->title, $titleFallback);
        $description = $this->firstFilled($record?->description, $descriptionFallback);

        return new SeoData(
            title: $title,
            description: $description,
            canonical: $this->resolveCanonical($record?->canonical_url, $path),
            robots: $this->firstFilled($record?->robots, (string) config('site.seo.robots', 'index,follow')),
            // OG/Twitter: `og_*` del registro si existe; si no, el title/description
            // ya resueltos. og:url = canonical (lo emite el consumidor).
            ogTitle: $this->firstFilled($record?->og_title, $title),
            ogDescription: $this->firstFilled($record?->og_description, $description),
            ogImage: $this->resolveOgImage($record?->og_image),
        );
    }

    /**
     * Imagen OG como URL absoluta o `null`. Prioridad: `og_image` del registro,
     * luego el fallback global `site.seo.og_image`. Si nada hay (decisión actual:
     * no se versiona aún un raster de marca para social; los logos son SVG, que
     * las plataformas no renderizan), devuelve `null` y el tag se omite.
     */
    private function resolveOgImage(?string $stored): ?string
    {
        $value = is_string($stored) ? trim($stored) : '';

        if ($value === '') {
            $value = trim((string) config('site.seo.og_image', ''));
        }

        if ($value === '') {
            return null;
        }

        return str_starts_with($value, 'http') ? $value : $this->absolute($value);
    }

    /**
     * Canonical absoluto sobre el dominio canónico. Usa el almacenado solo si es
     * una URL ES real; nunca emite `/en` (decisión del primer bloque).
     */
    private function resolveCanonical(?string $stored, string $path): string
    {
        $stored = is_string($stored) ? trim($stored) : '';

        if ($stored !== '' && str_starts_with($stored, 'http') && ! $this->looksEnglish($stored)) {
            return $stored;
        }

        return $this->absolute($path);
    }

    private function looksEnglish(string $url): bool
    {
        return str_contains($url, '/en/') || str_ends_with($url, '/en');
    }

    private function absolute(string $path): string
    {
        $base = rtrim((string) config('site.domain.canonical'), '/');

        return $base.'/'.ltrim($path, '/');
    }

    private function firstFilled(?string $value, string $fallback): string
    {
        $value = is_string($value) ? trim($value) : '';

        return $value !== '' ? $value : $fallback;
    }
}

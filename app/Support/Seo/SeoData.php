<?php

namespace App\Support\Seo;

/**
 * Payload SEO base que se sirve a las páginas públicas (HTML inicial vía
 * `app.blade.php` y prop Inertia `seo` para el componente cliente `SeoHead`).
 *
 * Cubre title, description, canonical (siempre absoluto), robots, los metadatos
 * sociales básicos (Open Graph / Twitter Cards) y los datos estructurados JSON-LD
 * (`structuredData`, lista de nodos schema.org). hreflang y sitemap quedan fuera
 * por decisión cerrada.
 *
 * Open Graph / Twitter:
 *   - `ogUrl` es siempre el canonical resuelto.
 *   - `ogTitle`/`ogDescription` caen a `title`/`description` si el registro no
 *     trae `og_title`/`og_description`.
 *   - `ogImage` es una URL absoluta o `null` (cuando no hay imagen segura); el
 *     consumidor omite el tag si es `null`.
 *   - `twitter:*` reflejan los valores OG; la card es siempre `summary_large_image`.
 */
final readonly class SeoData
{
    public function __construct(
        public string $title,
        public string $description,
        public string $canonical,
        public string $robots,
        public string $ogTitle,
        public string $ogDescription,
        public ?string $ogImage,
        public string $ogType = 'website',
        /**
         * Lista de nodos JSON-LD (schema.org), cada uno un array asociativo con
         * su `@context`. Vacía cuando la página no emite datos estructurados.
         *
         * @var list<array<string, mixed>>
         */
        public array $structuredData = [],
    ) {}

    /**
     * @return array{
     *     title: string,
     *     description: string,
     *     canonical: string,
     *     robots: string,
     *     ogTitle: string,
     *     ogDescription: string,
     *     ogImage: string|null,
     *     ogType: string,
     *     jsonLd: list<array<string, mixed>>
     * }
     */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'canonical' => $this->canonical,
            'robots' => $this->robots,
            'ogTitle' => $this->ogTitle,
            'ogDescription' => $this->ogDescription,
            'ogImage' => $this->ogImage,
            'ogType' => $this->ogType,
            'jsonLd' => $this->structuredData,
        ];
    }
}

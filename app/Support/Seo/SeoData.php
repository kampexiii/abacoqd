<?php

namespace App\Support\Seo;

/**
 * Payload SEO base que se sirve a las páginas públicas (HTML inicial vía
 * `app.blade.php` y prop Inertia `seo` para el componente cliente `SeoHead`).
 *
 * Solo cubre lo imprescindible de este primer bloque: title, description,
 * canonical (siempre absoluto) y robots. Open Graph, Twitter, JSON-LD y
 * sitemap quedan fuera por decisión cerrada.
 */
final readonly class SeoData
{
    public function __construct(
        public string $title,
        public string $description,
        public string $canonical,
        public string $robots,
    ) {}

    /**
     * @return array{title: string, description: string, canonical: string, robots: string}
     */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'canonical' => $this->canonical,
            'robots' => $this->robots,
        ];
    }
}

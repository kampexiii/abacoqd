<?php

namespace App\Support\Seo;

/**
 * Generador de datos estructurados JSON-LD (schema.org) para las páginas
 * públicas. Cada método devuelve un nodo JSON-LD completo (con `@context`); el
 * consumidor (`app.blade.php` en el HTML inicial y `SeoHead` en navegación
 * Inertia) emite un `<script type="application/ld+json">` por nodo.
 *
 * Reglas (decisión cerrada del bloque SEO):
 *   - Solo datos confirmados desde `config/site.php` o derivados de modelos
 *     publicados. No se inventan rating/review/price/offer/horarios/personas ni
 *     redes no confirmadas; los campos sin dato se omiten (no van vacíos).
 *   - URLs absolutas sobre el dominio canónico, solo ES (`inLanguage: es-ES`).
 *     Nunca `/en` ni `hreflang`.
 *   - Organization y WebSite comparten `@id` estables para enlazar el grafo;
 *     Article/Service/WebPage referencian la organización como editor/proveedor
 *     sin duplicar todos sus campos.
 *
 * `sameAs` solo incluye las redes confirmadas en `config/site.php`
 * (`site.social.*`). El logo se omite a propósito: los logos de marca actuales
 * son SVG y schema.org/buscadores esperan un raster; no se genera ni inventa.
 */
final class StructuredData
{
    private const CONTEXT = 'https://schema.org';

    private const LANGUAGE = 'es-ES';

    /**
     * Nodo Organization con los datos de empresa confirmados en config. Pensado
     * para la home (o cualquier punto único global).
     *
     * @return array<string, mixed>
     */
    public static function organization(): array
    {
        return self::prune([
            '@context' => self::CONTEXT,
            '@type' => 'Organization',
            '@id' => self::organizationId(),
            'name' => (string) config('site.seo.brand'),
            'legalName' => self::filled((string) config('site.seo.legal_name', '')),
            'url' => self::domain(),
            'email' => self::filled((string) config('site.contact.email', '')),
            'telephone' => self::filled((string) config('site.contact.phone', '')),
            'address' => self::postalAddress(),
            'sameAs' => self::sameAs(),
        ]);
    }

    /**
     * Nodo WebSite para la home. Sin SearchAction: no hay buscador público real.
     *
     * @return array<string, mixed>
     */
    public static function webSite(): array
    {
        return [
            '@context' => self::CONTEXT,
            '@type' => 'WebSite',
            '@id' => self::websiteId(),
            'name' => (string) config('site.seo.brand'),
            'url' => self::domain(),
            'inLanguage' => self::LANGUAGE,
            'publisher' => ['@id' => self::organizationId()],
        ];
    }

    /**
     * Nodo ContactPage para `/contacto`.
     *
     * @return array<string, mixed>
     */
    public static function contactPage(string $url, string $name, string $description): array
    {
        return self::prune([
            '@context' => self::CONTEXT,
            '@type' => 'ContactPage',
            'url' => $url,
            'name' => $name,
            'description' => self::filled($description),
            'inLanguage' => self::LANGUAGE,
            'isPartOf' => ['@id' => self::websiteId()],
        ]);
    }

    /**
     * Nodo Article para el detalle de un post publicado. No emite
     * datePublished/dateModified/author: el resolver no recibe el modelo, así
     * que se omiten en vez de inventarlos. El editor es la Organization.
     *
     * @return array<string, mixed>
     */
    public static function article(string $url, string $headline, string $description): array
    {
        return self::prune([
            '@context' => self::CONTEXT,
            '@type' => 'Article',
            'headline' => $headline,
            'description' => self::filled($description),
            'url' => $url,
            'mainEntityOfPage' => $url,
            'inLanguage' => self::LANGUAGE,
            'publisher' => self::organizationRef(),
        ]);
    }

    /**
     * Nodo Service para el detalle de un servicio publicado.
     *
     * @return array<string, mixed>
     */
    public static function service(string $url, string $name, string $description): array
    {
        return self::prune([
            '@context' => self::CONTEXT,
            '@type' => 'Service',
            'name' => $name,
            'description' => self::filled($description),
            'url' => $url,
            'inLanguage' => self::LANGUAGE,
            'provider' => self::organizationRef(),
        ]);
    }

    /**
     * Nodo WebPage para el detalle de un proyecto. Se usa WebPage (no
     * CreativeWork/Product) para no inventar cliente, resultados, oferta ni
     * precio: con los datos disponibles solo se afirma la página en sí.
     *
     * @return array<string, mixed>
     */
    public static function webPage(string $url, string $name, string $description): array
    {
        return self::prune([
            '@context' => self::CONTEXT,
            '@type' => 'WebPage',
            'name' => $name,
            'description' => self::filled($description),
            'url' => $url,
            'inLanguage' => self::LANGUAGE,
            'isPartOf' => ['@id' => self::websiteId()],
        ]);
    }

    /**
     * Nodo BreadcrumbList. `$items` es una lista ordenada de pares
     * `[nombre, urlAbsoluta]`; el último suele ser la página actual.
     *
     * @param  list<array{0: string, 1: string}>  $items
     * @return array<string, mixed>
     */
    public static function breadcrumb(array $items): array
    {
        $elements = [];
        $position = 1;

        foreach ($items as [$name, $url]) {
            $elements[] = self::prune([
                '@type' => 'ListItem',
                'position' => $position,
                'name' => $name,
                'item' => self::filled($url),
            ]);
            $position++;
        }

        return [
            '@context' => self::CONTEXT,
            '@type' => 'BreadcrumbList',
            'itemListElement' => $elements,
        ];
    }

    /**
     * Referencia compacta a la Organization para usar como editor/proveedor en
     * páginas donde el nodo completo no se emite (detalles).
     *
     * @return array<string, mixed>
     */
    private static function organizationRef(): array
    {
        return [
            '@type' => 'Organization',
            '@id' => self::organizationId(),
            'name' => (string) config('site.seo.brand'),
            'url' => self::domain(),
        ];
    }

    /**
     * PostalAddress a partir de los datos confirmados de contacto. `addressCountry`
     * se fija a `ES` (sede en España, confirmada); `addressLocality` se deriva del
     * primer segmento de `city_country` sin inventar otros campos.
     *
     * @return array<string, mixed>|null
     */
    private static function postalAddress(): ?array
    {
        $street = self::filled((string) config('site.contact.address', ''));

        if ($street === null) {
            return null;
        }

        $cityCountry = (string) config('site.contact.city_country', '');
        $locality = trim(explode(',', $cityCountry)[0]);

        return self::prune([
            '@type' => 'PostalAddress',
            'streetAddress' => $street,
            'addressLocality' => $locality !== '' ? $locality : null,
            'addressCountry' => 'ES',
        ]);
    }

    /**
     * Redes sociales confirmadas en `config/site.php` para `sameAs`. Solo URLs
     * http(s) reales; nada inventado.
     *
     * @return list<string>
     */
    private static function sameAs(): array
    {
        $candidates = [
            config('site.social.linkedin'),
            config('site.social.facebook'),
        ];

        return array_values(array_filter(
            $candidates,
            static fn ($url): bool => is_string($url) && str_starts_with(trim($url), 'http'),
        ));
    }

    private static function organizationId(): string
    {
        return self::domain().'#organization';
    }

    private static function websiteId(): string
    {
        return self::domain().'#website';
    }

    private static function domain(): string
    {
        return rtrim((string) config('site.domain.canonical'), '/').'/';
    }

    private static function filled(string $value): ?string
    {
        $value = trim($value);

        return $value !== '' ? $value : null;
    }

    /**
     * Elimina claves con valor nulo, cadena vacía o array vacío para no emitir
     * campos sin dato confirmado.
     *
     * @param  array<string, mixed>  $node
     * @return array<string, mixed>
     */
    private static function prune(array $node): array
    {
        return array_filter(
            $node,
            static fn ($value): bool => $value !== null && $value !== '' && $value !== [],
        );
    }
}

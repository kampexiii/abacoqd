<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Response;

/**
 * Genera el sitemap.xml dinámico del sitio público.
 *
 * Decisión cerrada del bloque SEO: por ahora solo el contenido ES es indexable,
 * no hay rutas `/en` reales y no se emite hreflang. Por eso el sitemap incluye
 * únicamente URLs ES absolutas sobre el dominio canónico.
 *
 * Las páginas estáticas se listan con prioridad/frecuencia fija. Los detalles
 * dinámicos (servicios/proyectos/posts) se incluyen solo si pasan exactamente la
 * misma compuerta de publicación que su ruta pública correspondiente, de modo
 * que el sitemap nunca apunte a un 404 ni a contenido no publicable. No se
 * incluyen zonas privadas (admin, dashboard, settings, auth) porque no tienen
 * rutas públicas que listar aquí.
 */
class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = [
            ...$this->staticUrls(),
            ...$this->serviceUrls(),
            ...$this->projectUrls(),
            ...$this->postUrls(),
        ];

        return response($this->render($urls), 200)
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    /**
     * Páginas públicas estáticas indexables. Sin `lastmod`: no tienen una fecha
     * de actualización fiable en modelo, y no se inventan datos.
     *
     * @return list<array<string, string|null>>
     */
    private function staticUrls(): array
    {
        return [
            $this->url('/', '1.0', 'weekly'),
            $this->url('/metodologia', '0.8', 'weekly'),
            $this->url('/servicios', '0.9', 'weekly'),
            $this->url('/proyectos', '0.9', 'weekly'),
            $this->url('/quienes-somos', '0.7', 'monthly'),
            $this->url('/blog', '0.8', 'weekly'),
            $this->url('/contacto', '0.8', 'monthly'),
            $this->url('/reserva', '0.7', 'monthly'),
            $this->url('/aviso-legal', '0.3', 'yearly'),
            $this->url('/privacidad', '0.3', 'yearly'),
            $this->url('/cookies', '0.3', 'yearly'),
        ];
    }

    /**
     * Detalles de servicios: mismas condiciones que Public\ServiceController@show
     * (publicado + activo + detalle habilitado) y con slug ES válido.
     *
     * @return array<int, array<string, string|null>>
     */
    private function serviceUrls(): array
    {
        return Service::query()
            ->published()
            ->active()
            ->detailEnabled()
            ->whereNotNull('slug_es')
            ->ordered()
            ->get(['slug', 'updated_at', 'sort_order'])
            ->map(fn (Service $service): ?array => $this->detailUrl(
                '/servicios/',
                $service,
                '0.8',
            ))
            ->filter()
            ->values()
            ->all();
    }

    /**
     * Detalles de proyectos: mismas condiciones que Public\ProjectController@show
     * (activo + publicado + visible en proyectos + publicable) y slug ES válido.
     *
     * @return array<int, array<string, string|null>>
     */
    private function projectUrls(): array
    {
        return Project::query()
            ->active()
            ->published()
            ->projects()
            ->publiclyListable()
            ->whereNotNull('slug_es')
            ->ordered()
            ->get(['slug', 'updated_at', 'permission_status', 'settings', 'sort_order', 'year'])
            ->map(fn (Project $project): ?array => $this->detailUrl(
                '/proyectos/',
                $project,
                '0.8',
            ))
            ->filter()
            ->values()
            ->all();
    }

    /**
     * Detalles de posts: mismas condiciones que Public\BlogController@show
     * (publicado: estado Published + published_at) y con slug ES válido. Los
     * borradores, programados, ocultos o sin fecha quedan fuera del scope.
     *
     * @return array<int, array<string, string|null>>
     */
    private function postUrls(): array
    {
        return Post::query()
            ->published()
            ->whereNotNull('slug_es')
            ->orderByDesc('published_at')
            ->get(['slug', 'updated_at', 'published_at'])
            ->map(fn (Post $post): ?array => $this->detailUrl(
                '/blog/',
                $post,
                '0.7',
            ))
            ->filter()
            ->values()
            ->all();
    }

    /**
     * Construye la entrada de detalle a partir del slug ES del modelo. Devuelve
     * null si el slug ES no es utilizable, para descartarla del sitemap.
     *
     * @return array<string, string|null>|null
     */
    private function detailUrl(string $prefix, Model $model, string $priority): ?array
    {
        $slug = data_get($model->getAttribute('slug'), 'es');
        $slug = is_string($slug) ? trim($slug) : '';

        if ($slug === '') {
            return null;
        }

        $updatedAt = $model->getAttribute('updated_at');

        return $this->url(
            $prefix.$slug,
            $priority,
            'monthly',
            $updatedAt instanceof DateTimeInterface ? $updatedAt->format('Y-m-d') : null,
        );
    }

    /**
     * @return array<string, string|null>
     */
    private function url(string $path, string $priority, string $changefreq, ?string $lastmod = null): array
    {
        return [
            'loc' => $this->absolute($path),
            'lastmod' => $lastmod,
            'changefreq' => $changefreq,
            'priority' => $priority,
        ];
    }

    /**
     * URL absoluta sobre el dominio canónico (`https://abacoqd.com`). La raíz `/`
     * se sirve como `https://abacoqd.com/`.
     */
    private function absolute(string $path): string
    {
        $base = rtrim((string) config('site.domain.canonical'), '/');

        return $base.'/'.ltrim($path, '/');
    }

    /**
     * Serializa las URLs a XML de sitemap válido. Orden estable: estáticas en el
     * orden declarado y luego los detalles dinámicos ya ordenados.
     *
     * @param  list<array<string, string|null>>  $urls
     */
    private function render(array $urls): string
    {
        $lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ];

        foreach ($urls as $url) {
            $lines[] = '    <url>';
            $lines[] = '        <loc>'.e($url['loc']).'</loc>';

            if (! empty($url['lastmod'])) {
                $lines[] = '        <lastmod>'.e($url['lastmod']).'</lastmod>';
            }

            $lines[] = '        <changefreq>'.e($url['changefreq']).'</changefreq>';
            $lines[] = '        <priority>'.e($url['priority']).'</priority>';
            $lines[] = '    </url>';
        }

        $lines[] = '</urlset>';

        return implode("\n", $lines)."\n";
    }
}

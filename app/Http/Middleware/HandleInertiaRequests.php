<?php

namespace App\Http\Middleware;

use App\Models\Faq;
use App\Models\Service;
use App\Support\Seo\SeoResolver;
use App\Support\SiteSettings;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Mapa nombre de ruta => `page_key` de `seo_metadata` para páginas estáticas
     * (sin modelo). Los detalles (services/projects/blog `*.detail`) resuelven su
     * SEO en el propio controlador a partir del modelo; aquí no aparecen.
     *
     * @var array<string, string>
     */
    private const PAGE_SEO_KEYS = [
        'home' => 'home',
        'methodology.show' => 'methodology',
        'services.show' => 'services',
        'projects.show' => 'projects',
        'about.show' => 'about',
        'blog.show' => 'blog',
        'legal.notice' => 'legal-notice',
        'legal.privacy' => 'privacy',
        'legal.cookies' => 'cookies',
        'contact.show' => 'contact',
        'booking.show' => 'booking',
    ];

    /**
     * Rutas públicas indexables que resuelven su SEO en el controlador a partir
     * del modelo (no tienen `page_key`). Son indexables igual que las estáticas;
     * su robots/canonical real lo sobrescribe el propio controlador.
     *
     * @var list<string>
     */
    private const PUBLIC_DETAIL_ROUTES = [
        'services.detail',
        'projects.detail',
        'blog.detail',
    ];

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'toast' => $request->session()->get('toast'),
            ],
            // Datos del sitio (contacto, redes, Google Reviews, footer). Fuente
            // editable: grupo `site` de `settings` con fallback config/site.php.
            // Los componentes solo consumen estos datos, no los definen inline.
            'siteSettings' => SiteSettings::shared(),
            // Flags del CMP propio AbacoQD (config/site.php). Solo dos booleanos:
            // si se muestra el banner de consentimiento y si se permitiría
            // tracking externo (false en esta fase; no hay proveedores ni se
            // cargan scripts externos). Sin IDs, sin GTM/GA4/Clarity.
            'consent' => [
                'enabled' => (bool) config('site.consent.enabled'),
                'externalTracking' => (bool) config('site.consent.external_tracking'),
            ],
            // SEO base servido (title/description/canonical/robots). Para páginas
            // estáticas se resuelve por `page_key`; los detalles con modelo lo
            // sobrescriben en su controlador. Se sirve también en el HTML inicial
            // desde `app.blade.php`, no solo desde el `<Head>` cliente.
            'seo' => fn (): array => $this->resolvePageSeo($request),
            'footerServices' => fn (): array => Service::query()
                ->published()
                ->active()
                ->ordered()
                ->get(['id', 'title', 'slug', 'is_detail_enabled'])
                ->map(fn (Service $service): array => [
                    'id' => $service->id,
                    'title' => $service->title,
                    'slug' => $service->slug,
                    'isDetailEnabled' => $service->is_detail_enabled,
                ])
                ->values()
                ->all(),
            'chatbotFaqs' => fn (): array => Faq::query()
                ->active()
                ->chatbot()
                ->ordered()
                ->get(['id', 'question', 'answer', 'category', 'redirect_url', 'redirect_section'])
                ->map(fn (Faq $faq): array => [
                    'id' => $faq->id,
                    'question' => $faq->question,
                    'answer' => $faq->answer,
                    'category' => $faq->category,
                    'redirectUrl' => $faq->redirect_url,
                    'redirectSection' => $faq->redirect_section,
                ])
                ->values()
                ->all(),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    /**
     * SEO base de la página actual según el nombre de ruta.
     *
     * Solo las páginas públicas indexables (estáticas con `page_key` y detalles
     * con modelo) emiten `index,follow`. El resto —admin, auth, dashboard,
     * ajustes de usuario y rutas no mapeadas— emite `noindex,nofollow` ya en el
     * HTML inicial. Los detalles con modelo sobrescriben luego su SEO en el
     * propio controlador.
     *
     * @return array{title: string, description: string, canonical: string, robots: string}
     */
    private function resolvePageSeo(Request $request): array
    {
        $name = $request->route()?->getName();
        $path = '/'.ltrim($request->getPathInfo(), '/');
        $resolver = app(SeoResolver::class);

        $isPublicIndexable = $name !== null && (
            array_key_exists($name, self::PAGE_SEO_KEYS)
            || in_array($name, self::PUBLIC_DETAIL_ROUTES, true)
        );

        if (! $isPublicIndexable) {
            return $resolver->forNonPublic($path)->toArray();
        }

        return $resolver->forPage(self::PAGE_SEO_KEYS[$name] ?? null, $path)->toArray();
    }
}

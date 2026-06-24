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
     * SEO base de la página actual según el nombre de ruta. Las rutas sin mapa
     * (detalles con modelo, admin, auth) caen al fallback global; los detalles
     * lo sobrescriben luego con datos del modelo.
     *
     * @return array{title: string, description: string, canonical: string, robots: string}
     */
    private function resolvePageSeo(Request $request): array
    {
        $name = $request->route()?->getName();
        $pageKey = $name !== null ? (self::PAGE_SEO_KEYS[$name] ?? null) : null;
        $path = '/'.ltrim($request->getPathInfo(), '/');

        return app(SeoResolver::class)->forPage($pageKey, $path)->toArray();
    }
}

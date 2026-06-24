<?php

namespace App\Http\Middleware;

use App\Models\Faq;
use App\Models\Service;
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
}

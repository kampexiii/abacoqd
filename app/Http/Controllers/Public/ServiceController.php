<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Support\Media\ImageVariantService;
use App\Support\Seo\SeoResolver;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function __construct(private readonly ImageVariantService $images) {}

    /**
     * Show the public services listing from the canonical services table.
     *
     * Solo lista servicios publicados y activos, ordenados por `sort_order`.
     * Draft y hidden no aparecen.
     */
    public function index(): Response
    {
        $services = Service::query()
            ->published()
            ->active()
            ->ordered()
            ->get([
                'id',
                'title',
                'slug',
                'summary',
                'icon',
                'image',
                'is_detail_enabled',
                'settings',
            ]);

        return Inertia::render('Public/Services', [
            'services' => $services
                ->map(fn (Service $service): array => $this->serviceSummary($service))
                ->values(),
        ]);
    }

    /**
     * Show a service detail by either Spanish or English slug.
     *
     * El detalle es la fuente de verdad del CRUD admin: solo accesible si el
     * servicio está publicado, activo y con el detalle habilitado. En cualquier
     * otro caso devuelve 404.
     */
    public function show(string $slug): Response
    {
        $service = Service::query()
            ->published()
            ->active()
            ->detailEnabled()
            ->with('seoMetadata')
            ->where(function ($query) use ($slug): void {
                $query
                    ->where('slug_es', $slug)
                    ->orWhere('slug_en', $slug);
            })
            ->firstOrFail();

        return Inertia::render('Public/ServiceDetail', [
            'service' => [
                ...$this->serviceSummary($service),
                'description' => $service->description,
            ],
            'seo' => app(SeoResolver::class)->forRecord(
                $service->seoMetadataFor('es'),
                '/servicios/'.($service->slug_es ?? $slug),
                data_get($service->title, 'es'),
                data_get($service->summary, 'es'),
            )->toArray(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function serviceSummary(Service $service): array
    {
        return [
            'id' => $service->id,
            'title' => $service->title,
            'slug' => $service->slug,
            'summary' => $service->summary,
            'icon' => $service->icon,
            'image' => $service->image,
            'imageVariants' => $this->images->existingVariants($service->image, ImageVariantService::SERVICE_WIDTHS),
            'isDetailEnabled' => $service->is_detail_enabled,
            'settings' => $service->settings,
        ];
    }
}

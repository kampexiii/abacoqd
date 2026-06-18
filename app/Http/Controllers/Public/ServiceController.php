<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * @var list<string>
     */
    private const INITIAL_PUBLIC_DETAIL_SLUGS = [
        'desarrollo-web-rapido',
        'fast-web-development',
        'aplicaciones-a-medida',
        'custom-applications',
        'automatizacion-con-ia',
        'ai-automation',
        'crm-datos-y-procesos',
        'crm-data-and-processes',
        'integraciones-digitales',
        'digital-integrations',
        'mvps-y-prototipos',
        'mvps-and-prototypes',
    ];

    /**
     * Show the public services listing from the canonical services table.
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
     * Show an enabled service detail by either Spanish or English slug.
     */
    public function show(string $slug): Response
    {
        $service = Service::query()
            ->published()
            ->active()
            ->where(function ($query) use ($slug): void {
                $query
                    ->where('slug_es', $slug)
                    ->orWhere('slug_en', $slug);
            })
            ->firstOrFail();

        abort_unless($this->hasPublicDetail($service), 404);

        return Inertia::render('Public/ServiceDetail', [
            'service' => [
                ...$this->serviceSummary($service),
                'description' => $service->description,
            ],
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
            'isDetailEnabled' => $this->hasPublicDetail($service),
            'settings' => $service->settings,
        ];
    }

    private function hasPublicDetail(Service $service): bool
    {
        if ($service->is_detail_enabled) {
            return true;
        }

        if (! is_array($service->slug)) {
            return false;
        }

        foreach ($service->slug as $slug) {
            if (is_string($slug) && in_array($slug, self::INITIAL_PUBLIC_DETAIL_SLUGS, true)) {
                return true;
            }
        }

        return false;
    }
}

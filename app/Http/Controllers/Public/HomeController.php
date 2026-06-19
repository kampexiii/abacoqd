<?php

namespace App\Http\Controllers\Public;

use App\Enums\PermissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Render the public landing.
     *
     * La sección Colaboraciones (noria) se alimenta desde BD: proyectos
     * visibles en colaboraciones + en home, con su partner principal para el
     * logo. El gating de publicación (aprobado / preview local) lo aplica
     * `Project::scopePubliclyListable`. Si no hay datos, la noria cae a su
     * fallback estático sin romperse.
     */
    public function index(): Response
    {
        $projects = Project::query()
            ->active()
            ->published()
            ->collaborations()
            ->home()
            ->publiclyListable()
            ->with(['clientPartner', 'partners'])
            ->ordered()
            ->get();

        return Inertia::render('Public/Home', [
            'collaborations' => $projects
                ->map(function (Project $project): array {
                    $partner = $project->clientPartner
                        ?? $project->partners->firstWhere('pivot.role', 'client')
                        ?? $project->partners->first(fn ($item): bool => $item->logo !== null)
                        ?? $project->partners->first();
                    $settings = is_array($project->settings) ? $project->settings : [];
                    $slug = is_array($project->slug) ? ($project->slug['es'] ?? null) : null;
                    $fallbackName = $project->title['es'] ?? 'Proyecto';
                    $name = $project->client_name ?? $fallbackName;
                    $logoLight = null;
                    $logoDark = null;
                    $logoAlt = null;

                    if ($partner instanceof Partner) {
                        $name = $partner->name;
                        $logoLight = $partner->logo;
                        $logoDark = $partner->logo_dark;
                        $logoAlt = $partner->logo_alt;
                    }

                    return [
                        'slug' => $slug,
                        'name' => $name,
                        'logoLight' => $logoLight,
                        'logoDark' => $logoDark,
                        'logoAlt' => $logoAlt,
                        'href' => $slug ? "/proyectos/{$slug}" : '/proyectos',
                        'isHistorical' => (bool) ($settings['is_historical'] ?? false),
                        'isApproved' => $project->permission_status === PermissionStatus::Approved,
                    ];
                })
                ->filter(fn (array $item): bool => $item['slug'] !== null)
                ->values(),
        ]);
    }
}

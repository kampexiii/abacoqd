<?php

namespace App\Http\Controllers\Public;

use App\Enums\PermissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\Project;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    private const PER_PAGE = 9;

    /**
     * Show the public Proyectos listing.
     * docs/07_VISTAS/PUBLIC_04_PROYECTOS.md.
     *
     * Gating de publicación (Project/Partner::scopePubliclyListable):
     * - En producción solo se listan proyectos/partners con permiso aprobado.
     * - Fuera de producción (local/preview) también los marcados con
     *   `settings.show_in_local_preview = true` (históricos aportados por Ábaco,
     *   pendientes de validación). Así se valida la maquetación con datos reales
     *   sin falsear permisos en producción.
     *
     * Si no hay contenido publicable, la vista muestra un estado vacío honesto.
     * Paginado a `self::PER_PAGE` proyectos por página.
     */
    public function index(): Response
    {
        $projects = Project::query()
            ->active()
            ->published()
            ->projects()
            ->publiclyListable()
            ->with(['clientPartner', 'partners'])
            ->ordered()
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        return Inertia::render('Public/Projects', [
            'projects' => $projects->through(
                fn (Project $project): array => $this->projectSummary($project),
            ),
        ]);
    }

    /**
     * Show a public project detail by ES or EN slug.
     */
    public function show(string $slug): Response
    {
        $project = Project::query()
            ->active()
            ->published()
            ->projects()
            ->publiclyListable()
            ->with(['clientPartner', 'partners'])
            ->where(function ($query) use ($slug): void {
                $query->where('slug_es', $slug)->orWhere('slug_en', $slug);
            })
            ->firstOrFail();

        $related = Project::query()
            ->active()
            ->published()
            ->projects()
            ->publiclyListable()
            ->whereKeyNot($project->id)
            ->with(['clientPartner', 'partners'])
            ->ordered()
            ->take(3)
            ->get();

        return Inertia::render('Public/ProjectDetail', [
            'project' => $this->projectDetail($project),
            'related' => $related
                ->map(fn (Project $item): array => $this->projectSummary($item))
                ->values(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function projectSummary(Project $project): array
    {
        $client = $project->clientPartner;
        $executor = $project->partners->firstWhere('pivot.role', 'collaborator');
        $settings = is_array($project->settings) ? $project->settings : [];
        $slug = is_array($project->slug) ? ($project->slug['es'] ?? null) : null;

        return [
            'id' => $project->id,
            'title' => $project->title,
            'slug' => $project->slug,
            'detailUrl' => $slug ? "/proyectos/{$slug}" : null,
            'summary' => $project->summary,
            'coverImage' => $project->cover_image,
            'thumbnailImage' => $project->thumbnail_image,
            'technologies' => is_array($project->technologies) ? array_values($project->technologies) : [],
            'year' => $project->year,
            'clientName' => $project->client_name,
            'partnerName' => $client?->name,
            'partnerLogo' => $client?->logo,
            'partnerLogoDark' => $client?->logo_dark,
            'partnerLogoAlt' => $client?->logo_alt,
            'executorName' => $executor?->name,
            'isHistorical' => (bool) ($settings['is_historical'] ?? false),
            'isApproved' => $project->permission_status === PermissionStatus::Approved,
            'permissionStatus' => $project->permission_status->value,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function projectDetail(Project $project): array
    {
        $roleLabels = [
            'client' => 'client',
            'collaborator' => 'collaborator',
            'technology_partner' => 'technologyPartner',
            'brand' => 'brand',
            'other' => 'other',
        ];

        $partners = $project->partners
            ->map(function (Partner $partner) use ($roleLabels): array {
                $pivot = $partner->getRelationValue('pivot');
                $pivotRole = $pivot instanceof Pivot ? $pivot->getAttribute('role') : null;
                $role = is_string($pivotRole) ? $pivotRole : 'other';

                return [
                    'id' => $partner->id,
                    'name' => $partner->name,
                    'logo' => $partner->logo,
                    'logoDark' => $partner->logo_dark,
                    'logoAlt' => $partner->logo_alt,
                    'website' => $partner->website,
                    'roleKey' => $roleLabels[$role] ?? 'other',
                ];
            })
            ->values()
            ->all();

        return [
            ...$this->projectSummary($project),
            'description' => $project->description,
            'challenge' => $project->challenge,
            'solution' => $project->solution,
            'result' => $project->result,
            'gallery' => is_array($project->gallery) ? array_values($project->gallery) : [],
            'externalUrl' => $project->external_url,
            'permissionNotes' => $project->permission_notes,
            'settings' => is_array($project->settings) ? $project->settings : [],
            'partners' => $partners,
        ];
    }
}

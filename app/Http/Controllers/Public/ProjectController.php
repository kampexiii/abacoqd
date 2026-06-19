<?php

namespace App\Http\Controllers\Public;

use App\Enums\PermissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Show the public Proyectos listing.
     * docs/07_VISTAS/PUBLIC_04_PROYECTOS.md.
     *
     * Gating de publicación:
     * - En producción solo se listan proyectos/partners con permiso aprobado.
     * - Fuera de producción (local/preview) también se listan los marcados con
     *   `settings.show_in_local_preview = true` (datos históricos aportados por
     *   Ábaco, aún pendientes de validación de permiso). Así se valida la
     *   maquetación con datos reales sin falsear permisos en producción.
     *
     * Si no hay contenido publicable, la vista muestra un estado vacío honesto.
     */
    public function index(): Response
    {
        $projects = Project::query()
            ->active()
            ->published()
            ->projects()
            ->where(fn (Builder $query) => $this->scopeListable($query))
            ->with(['clientPartner', 'partners'])
            ->ordered()
            ->get();

        $partners = Partner::query()
            ->active()
            ->projects()
            ->where(fn (Builder $query) => $this->scopeListable($query))
            ->ordered()
            ->get();

        return Inertia::render('Public/Projects', [
            'projects' => $projects
                ->map(fn (Project $project): array => $this->projectSummary($project))
                ->values(),
            'partners' => $partners
                ->map(fn (Partner $partner): array => $this->partnerSummary($partner))
                ->values(),
        ]);
    }

    /**
     * Aprobado siempre; en preview local también `show_in_local_preview`.
     *
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $query
     */
    private function scopeListable(Builder $query): void
    {
        $query->where('permission_status', PermissionStatus::Approved->value);

        if (! app()->isProduction()) {
            $query->orWhere('settings->show_in_local_preview', true);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function projectSummary(Project $project): array
    {
        $client = $project->clientPartner;
        $executor = $project->partners->firstWhere('pivot.role', 'collaborator');
        $settings = is_array($project->settings) ? $project->settings : [];

        return [
            'id' => $project->id,
            'title' => $project->title,
            'slug' => $project->slug,
            'summary' => $project->summary,
            'coverImage' => $project->cover_image,
            'thumbnailImage' => $project->thumbnail_image,
            'technologies' => is_array($project->technologies) ? array_values($project->technologies) : [],
            'year' => $project->year,
            'clientName' => $project->client_name,
            'partnerName' => $client?->name,
            'executorName' => $executor?->name,
            'isFeatured' => $project->is_featured,
            'isHistorical' => (bool) ($settings['is_historical'] ?? false),
            'isApproved' => $project->permission_status === PermissionStatus::Approved,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function partnerSummary(Partner $partner): array
    {
        $settings = is_array($partner->settings) ? $partner->settings : [];

        return [
            'id' => $partner->id,
            'name' => $partner->name,
            'logo' => $partner->logo,
            'logoDark' => $partner->logo_dark,
            'logoAlt' => $partner->logo_alt,
            'website' => $partner->website,
            'description' => $partner->description,
            'isHistorical' => (bool) ($settings['is_historical'] ?? false),
            'isApproved' => $partner->permission_status === PermissionStatus::Approved,
        ];
    }
}

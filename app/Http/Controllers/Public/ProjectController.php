<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Show the public Proyectos listing.
     * docs/07_VISTAS/PUBLIC_04_PROYECTOS.md.
     *
     * Solo se listan proyectos publicables (activos, publicados, visibles en
     * Proyectos y con permiso aprobado). Si no hay contenido publicable, la
     * vista muestra un estado vacío honesto — sin inventar casos ni logos.
     * El contenido real lo alimenta el CRUD de Proyectos del admin (Fase 4/5).
     */
    public function index(): Response
    {
        $projects = Project::query()
            ->active()
            ->published()
            ->projects()
            ->permitted()
            ->with(['clientPartner' => fn ($query) => $query->permitted()->projects()])
            ->ordered()
            ->get();

        // Bloque de partners: solo marcas con permiso aprobado y visibles en
        // Proyectos. Si no hay ninguna, el bloque se oculta en la vista.
        $partners = Partner::query()
            ->active()
            ->projects()
            ->permitted()
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
     * @return array<string, mixed>
     */
    private function projectSummary(Project $project): array
    {
        $partner = $project->clientPartner;

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
            'partnerName' => $partner?->name,
            'isFeatured' => $project->is_featured,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function partnerSummary(Partner $partner): array
    {
        return [
            'id' => $partner->id,
            'name' => $partner->name,
            'logo' => $partner->logo,
            'logoDark' => $partner->logo_dark,
            'logoAlt' => $partner->logo_alt,
            'website' => $partner->website,
            'description' => $partner->description,
        ];
    }
}

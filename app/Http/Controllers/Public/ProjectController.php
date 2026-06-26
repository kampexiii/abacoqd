<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\Project;
use App\Models\Service;
use App\Support\Seo\SeoResolver;
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
     * - En producción solo se listan registros publicables.
     * - Fuera de producción se permite revisar registros marcados para revisión local
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
            ->with(['partners', 'services'])
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
            ->with(['partners', 'services', 'seoMetadata'])
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
            'seo' => app(SeoResolver::class)->forRecord(
                $project->seoMetadataFor('es'),
                '/proyectos/'.($project->slug_es ?? $slug),
                data_get($project->title, 'es'),
                data_get($project->summary, 'es'),
            )->toArray(),
        ]);
    }

    /**
     * Resumen público de un proyecto/caso. El "cliente" es la empresa que lo
     * solicita (`client_name` + logo del proyecto color/monocromo). El
     * desarrollo es AbacoQD en solitario (`developmentMode = solo`) o con
     * partners (`cooperative`); no se exponen roles técnicos ni permisos.
     *
     * @return array<string, mixed>
     */
    private function projectSummary(Project $project): array
    {
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
            'clientLogo' => $project->logo,
            'clientLogoDark' => $project->logo_dark,
            'clientLogoAlt' => $project->logo_alt,
            'services' => $this->mapServices($project),
            'developmentMode' => $project->partners->isEmpty() ? 'solo' : 'cooperative',
            'partners' => $this->mapPartners($project),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function projectDetail(Project $project): array
    {
        return [
            ...$this->projectSummary($project),
            'description' => $project->description,
            'challenge' => $project->challenge,
            'solution' => $project->solution,
            'result' => $project->result,
            'gallery' => is_array($project->gallery) ? array_values($project->gallery) : [],
            'externalUrl' => $project->external_url,
        ];
    }

    /**
     * Servicios/capacidades reales asociados (desde `services`). Texto bilingüe
     * para localizar en el cliente; sin texto libre.
     *
     * @return list<array{name: mixed, slug: string|null}>
     */
    private function mapServices(Project $project): array
    {
        return array_values($project->services
            ->map(function (Service $service): array {
                $slugEs = data_get($service->slug, 'es');

                return [
                    'name' => $service->title,
                    'slug' => is_string($slugEs) ? $slugEs : null,
                ];
            })
            ->all());
    }

    /**
     * Partners que co-desarrollaron el proyecto junto a AbacoQD (proyecto
     * cooperativo). No se expone el rol técnico de `partner_project`.
     *
     * @return list<array{id: int, name: string, logo: string|null, logoDark: string|null, logoAlt: string|null, website: string|null}>
     */
    private function mapPartners(Project $project): array
    {
        return array_values($project->partners
            ->map(fn (Partner $partner): array => [
                'id' => $partner->id,
                'name' => $partner->name,
                'logo' => $partner->logo,
                'logoDark' => $partner->logo_dark,
                'logoAlt' => $partner->logo_alt,
                'website' => $partner->website,
            ])
            ->all());
    }
}

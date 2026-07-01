<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Support\Media\ImageVariantService;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(private readonly ImageVariantService $images) {}

    /**
     * Render the public landing.
     *
     * La sección Colaboraciones muestra PROYECTOS/casos (no logos sueltos):
     * proyectos publicables marcados con `show_in_collaborations`, cada uno con
     * su cliente, logo color/monocromo, servicios, año, modo de desarrollo
     * (AbacoQD en solitario o cooperativo con partners) y enlace al detalle. Sin
     * datos, la sección muestra un estado vacío honesto sin inventar contenido.
     *
     * La sección Blog usa el post destacado (`Post::featured()`) como card
     * grande y los 2 últimos publicados como cards pequeñas, excluyendo el
     * destacado si coincide (sin flag `show_on_home`). Sin datos, `BlogSection`
     * muestra un estado controlado (no inventa posts).
     */
    public function index(): Response
    {
        $collaborationProjects = Project::query()
            ->active()
            ->published()
            ->collaborations()
            ->publiclyListable()
            ->with(['partners', 'services'])
            ->ordered()
            ->get();

        $featuredPost = Post::query()
            ->published()
            ->featured()
            ->with('category')
            ->first();

        $latestPosts = Post::query()
            ->published()
            ->when(
                $featuredPost,
                fn (Builder $query): Builder => $query->whereKeyNot($featuredPost->id),
            )
            ->with('category')
            ->orderByDesc('published_at')
            ->take(2)
            ->get();

        $featuredServices = Service::query()
            ->active()
            ->published()
            ->detailEnabled()
            ->featured()
            ->ordered()
            ->take(3)
            ->get();

        return Inertia::render('Public/Home', [
            'featuredPost' => $featuredPost ? $this->postSummary($featuredPost) : null,
            'latestPosts' => $latestPosts
                ->map(fn (Post $post): array => $this->postSummary($post))
                ->values(),
            'collaborations' => $collaborationProjects
                ->map(fn (Project $project): array => $this->collaborationItem($project))
                ->values(),
            'featuredServices' => $featuredServices
                ->map(fn (Service $service): array => $this->featuredServiceItem($service))
                ->values(),
        ]);
    }

    /**
     * Item de la sección Colaboraciones: un proyecto/caso con su cliente, logo
     * color/monocromo, servicios, año, modo de desarrollo y enlace al detalle.
     *
     * @return array<string, mixed>
     */
    private function collaborationItem(Project $project): array
    {
        $slug = is_array($project->slug) ? ($project->slug['es'] ?? null) : null;

        return [
            'id' => $project->id,
            'title' => $project->title,
            'slug' => $slug,
            'detailUrl' => $slug ? "/proyectos/{$slug}" : '/proyectos',
            'clientName' => $project->client_name,
            'clientLogo' => $project->logo,
            'clientLogoDark' => $project->logo_dark,
            'clientLogoAlt' => $project->logo_alt,
            'clientLogoVariants' => $this->images->existingVariants($project->logo, ImageVariantService::LOGO_WIDTHS),
            'clientLogoDarkVariants' => $this->images->existingVariants($project->logo_dark, ImageVariantService::LOGO_WIDTHS),
            'year' => $project->year,
            'developmentMode' => $project->partners->isEmpty() ? 'solo' : 'cooperative',
            'services' => $project->services
                ->map(fn (Service $service): mixed => $service->title)
                ->values(),
            'partners' => $project->partners
                ->map(fn (Partner $partner): array => [
                    'name' => $partner->name,
                    'logo' => $partner->logo,
                    'logoDark' => $partner->logo_dark,
                    'logoAlt' => $partner->logo_alt,
                    'logoVariants' => $this->images->existingVariants($partner->logo, ImageVariantService::LOGO_WIDTHS),
                    'logoDarkVariants' => $this->images->existingVariants($partner->logo_dark, ImageVariantService::LOGO_WIDTHS),
                ])
                ->values(),
        ];
    }

    /**
     * Item de la sección Servicios del landing: misma forma que `PublicService`
     * (el tipo TypeScript compartido en `resources/js/lib/service-presentation.ts`).
     *
     * @return array<string, mixed>
     */
    private function featuredServiceItem(Service $service): array
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

    /**
     * @return array<string, mixed>
     */
    private function postSummary(Post $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'coverImage' => $post->featured_image,
            'coverImageVariants' => $this->images->existingVariants($post->featured_image, ImageVariantService::BLOG_WIDTHS),
            'category' => $post->category ? [
                'name' => $post->category->name,
                'slug' => $post->category->slug,
            ] : null,
            'publishedAt' => $post->published_at?->toIso8601String(),
            'readingTime' => $post->reading_time,
        ];
    }
}

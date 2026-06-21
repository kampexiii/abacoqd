<?php

namespace App\Http\Controllers\Public;

use App\Enums\PermissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\Post;
use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;
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
     *
     * La sección Blog usa el post destacado (`Post::featured()`) como card
     * grande y los 2 últimos publicados con `show_on_home` como cards
     * pequeñas, excluyendo el destacado si coincide. Sin datos, `BlogSection`
     * muestra un estado controlado (no inventa posts).
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

        $featuredPost = Post::query()
            ->published()
            ->home()
            ->featured()
            ->with('category')
            ->first();

        $latestPosts = Post::query()
            ->published()
            ->home()
            ->when(
                $featuredPost,
                fn (Builder $query): Builder => $query->whereKeyNot($featuredPost->id),
            )
            ->with('category')
            ->orderByDesc('published_at')
            ->take(2)
            ->get();

        return Inertia::render('Public/Home', [
            'featuredPost' => $featuredPost ? $this->postSummary($featuredPost) : null,
            'latestPosts' => $latestPosts
                ->map(fn (Post $post): array => $this->postSummary($post))
                ->values(),
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
            'category' => $post->category ? [
                'name' => $post->category->name,
                'slug' => $post->category->slug,
            ] : null,
            'publishedAt' => $post->published_at?->toIso8601String(),
            'readingTime' => $post->reading_time,
        ];
    }
}

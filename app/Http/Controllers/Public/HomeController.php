<?php

namespace App\Http\Controllers\Public;

use App\Enums\PermissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Render the public landing.
     *
     * La sección Colaboraciones (noria) se alimenta de `partners` marcados como
     * activos y "Mostrar en noria" (`show_in_collaborations`), con permiso
     * publicable (aprobado o preview local vía `Partner::scopePubliclyListable`)
     * y con logo disponible. La pertenencia de un partner a un proyecto se
     * modela con `partner_project`; no decide la noria ni se usan flags de
     * Project. Si no hay datos, la noria cae a su fallback estático sin romperse.
     *
     * La sección Blog usa el post destacado (`Post::featured()`) como card
     * grande y los 2 últimos publicados como cards pequeñas, excluyendo el
     * destacado si coincide (sin flag `show_on_home`). Sin datos, `BlogSection`
     * muestra un estado controlado (no inventa posts).
     */
    public function index(): Response
    {
        $collaborationPartners = Partner::query()
            ->active()
            ->collaborations()
            ->publiclyListable()
            ->whereNotNull('logo')
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

        return Inertia::render('Public/Home', [
            'featuredPost' => $featuredPost ? $this->postSummary($featuredPost) : null,
            'latestPosts' => $latestPosts
                ->map(fn (Post $post): array => $this->postSummary($post))
                ->values(),
            'collaborations' => $collaborationPartners
                ->map(function (Partner $partner): array {
                    $settings = is_array($partner->settings) ? $partner->settings : [];

                    return [
                        'slug' => $partner->slug,
                        'name' => $partner->name,
                        'logoLight' => $partner->logo,
                        'logoDark' => $partner->logo_dark,
                        'logoAlt' => $partner->logo_alt,
                        'href' => '/proyectos',
                        'isHistorical' => (bool) ($settings['is_historical'] ?? false),
                        'isApproved' => $partner->permission_status === PermissionStatus::Approved,
                    ];
                })
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

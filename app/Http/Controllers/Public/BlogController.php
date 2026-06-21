<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    private const PER_PAGE = 9;

    /**
     * Show the public Blog listing.
     * docs/07_VISTAS/PUBLIC_05_BLOG.md.
     *
     * El destacado (`Post::featured()`) se muestra fijo encima del grid y
     * nunca cuenta dentro de los 9 paginados, ni siquiera cuando hay
     * búsqueda/categoría activa (esos filtros solo afectan al grid).
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('buscar', ''));
        $categorySlug = trim((string) $request->query('categoria', ''));

        $category = $categorySlug !== ''
            ? PostCategory::query()
                ->active()
                ->where(function (Builder $query) use ($categorySlug): void {
                    $query->where('slug_es', $categorySlug)
                        ->orWhere('slug_en', $categorySlug);
                })
                ->first()
            : null;

        $featured = Post::query()
            ->published()
            ->featured()
            ->with('category')
            ->first();

        $posts = Post::query()
            ->published()
            ->with('category')
            ->when($featured, fn (Builder $query): Builder => $query->whereKeyNot($featured->id))
            ->when($search !== '', fn (Builder $query): Builder => $query->search($search))
            ->when($category, fn (Builder $query): Builder => $query->where('post_category_id', $category->id))
            ->orderByDesc('published_at')
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        $categories = PostCategory::query()->active()->ordered()->get();

        return Inertia::render('Public/Blog', [
            'featuredPost' => $featured ? $this->postSummary($featured) : null,
            'posts' => $posts->through(fn (Post $post): array => $this->postSummary($post)),
            'categories' => $categories
                ->map(fn (PostCategory $postCategory): array => [
                    'name' => $postCategory->name,
                    'slug' => $postCategory->slug,
                ])
                ->values(),
            'filters' => [
                'search' => $search,
                'category' => $categorySlug,
            ],
        ]);
    }

    /**
     * Show a public post detail by ES or EN slug.
     */
    public function show(string $slug): Response
    {
        $post = Post::query()
            ->published()
            ->with(['category', 'tags'])
            ->where(function (Builder $query) use ($slug): void {
                $query->where('slug_es', $slug)->orWhere('slug_en', $slug);
            })
            ->firstOrFail();

        $related = Post::query()
            ->published()
            ->whereKeyNot($post->id)
            ->when(
                $post->post_category_id,
                fn (Builder $query): Builder => $query->where('post_category_id', $post->post_category_id),
            )
            ->with('category')
            ->orderByDesc('published_at')
            ->take(3)
            ->get();

        return Inertia::render('Public/BlogPost', [
            'post' => $this->postDetail($post),
            'related' => $related
                ->map(fn (Post $item): array => $this->postSummary($item))
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

    /**
     * @return array<string, mixed>
     */
    private function postDetail(Post $post): array
    {
        $content = is_array($post->content) ? $post->content : [];

        return [
            ...$this->postSummary($post),
            // `Str::markdown()` (CommonMark) escapa HTML crudo del origen por
            // defecto, así que el resultado es seguro para
            // `dangerouslySetInnerHTML` sin sanitizador adicional.
            'contentHtml' => [
                'es' => Str::markdown((string) ($content['es'] ?? '')),
                'en' => Str::markdown((string) ($content['en'] ?? '')),
            ],
            'tags' => $post->tags
                ->map(fn (Tag $tag): array => [
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                ])
                ->values(),
        ];
    }
}

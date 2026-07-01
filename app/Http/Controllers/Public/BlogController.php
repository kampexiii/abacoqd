<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Tag;
use App\Support\Media\ImageVariantService;
use App\Support\Seo\SeoResolver;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    private const PER_PAGE = 9;

    public function __construct(private readonly ImageVariantService $images) {}

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
            ->with(['category', 'tags', 'seoMetadata'])
            ->where(function (Builder $query) use ($slug): void {
                $query->where('slug_es', $slug)->orWhere('slug_en', $slug);
            })
            ->firstOrFail();

        // Relacionados: primero misma categoría; si no llegan a 3, se rellena
        // con los más recientes de otras categorías (docs PUBLIC_05_BLOG.md).
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

        if ($related->count() < 3) {
            $fill = Post::query()
                ->published()
                ->whereKeyNot($post->id)
                ->whereNotIn('id', $related->modelKeys())
                ->with('category')
                ->orderByDesc('published_at')
                ->take(3 - $related->count())
                ->get();

            $related = $related->concat($fill);
        }

        return Inertia::render('Public/BlogPost', [
            'post' => $this->postDetail($post),
            'related' => $related
                ->map(fn (Post $item): array => $this->postSummary($item))
                ->values(),
            'seo' => app(SeoResolver::class)->forRecord(
                $post->seoMetadataFor('es'),
                '/blog/'.($post->slug_es ?? $slug),
                data_get($post->title, 'es'),
                data_get($post->excerpt, 'es'),
            )->toArray(),
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
            'coverImageVariants' => $this->images->existingVariants($post->featured_image, ImageVariantService::BLOG_WIDTHS),
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
        $es = $this->renderArticle($this->normalizeContent($content['es'] ?? null));
        $en = $this->renderArticle($this->normalizeContent($content['en'] ?? null));

        return [
            ...$this->postSummary($post),
            'contentHtml' => ['es' => $es['html'], 'en' => $en['html']],
            // Índice de navegación (H2) para el TOC lateral "En esta página".
            'toc' => ['es' => $es['toc'], 'en' => $en['toc']],
            'tags' => $post->tags
                ->map(fn (Tag $tag): array => [
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                ])
                ->values(),
        ];
    }

    /**
     * Normaliza el contenido de un post (por idioma) a Markdown antes de
     * renderizarlo. El formato real (seeder/admin) es una cadena Markdown, pero
     * `content[locale]` puede llegar como array de bloques (`{type, text}`) en
     * datos de prueba o un futuro editor por bloques. En ese caso se extrae el
     * texto de forma defensiva en vez de castear el array a string, que lanzaba
     * `Array to string conversion`. `null` o formato no reconocible => cadena
     * vacía controlada (no se inventa contenido).
     *
     * @param  mixed  $value
     */
    private function normalizeContent($value): string
    {
        if (is_string($value)) {
            return $value;
        }

        if (! is_array($value)) {
            return '';
        }

        // Array de bloques: se concatena el texto conocido. Un `heading` se
        // promueve a H2 Markdown (alimenta el TOC); el resto aporta su texto
        // como párrafo. Bloques sin texto reconocible se ignoran.
        $lines = [];

        foreach ($value as $block) {
            if (is_string($block)) {
                $block = trim($block);

                if ($block !== '') {
                    $lines[] = $block;
                }

                continue;
            }

            $text = is_array($block) && is_string($block['text'] ?? null)
                ? trim($block['text'])
                : '';

            if ($text === '') {
                continue;
            }

            $isHeading = is_array($block) && ($block['type'] ?? null) === 'heading';
            $lines[] = $isHeading ? '## '.$text : $text;
        }

        return implode("\n\n", $lines);
    }

    /**
     * Renderiza el Markdown del post a HTML y, de paso, añade un `id` a cada
     * H2 y construye el índice (TOC) que consume el sidebar del detalle.
     *
     * `Str::markdown()` (CommonMark) escapa el HTML crudo del origen por
     * defecto, así que el resultado es seguro para `dangerouslySetInnerHTML`
     * sin sanitizador adicional.
     *
     * @return array{html: string, toc: list<array{id: string, text: string}>}
     */
    private function renderArticle(string $markdown): array
    {
        $html = Str::markdown($markdown);

        /** @var list<array{id: string, text: string}> $toc */
        $toc = [];

        $html = preg_replace_callback(
            '/<h2>(.*?)<\/h2>/s',
            function (array $matches) use (&$toc): string {
                $text = trim(html_entity_decode(strip_tags($matches[1]), ENT_QUOTES | ENT_HTML5));
                $id = Str::slug($text);
                $toc[] = ['id' => $id, 'text' => $text];

                return '<h2 id="'.$id.'">'.$matches[1].'</h2>';
            },
            $html,
        ) ?? $html;

        return ['html' => $html, 'toc' => $toc];
    }
}

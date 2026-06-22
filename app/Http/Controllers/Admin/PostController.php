<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PostStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePostRequest;
use App\Http\Requests\Admin\UpdatePostRequest;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Tag;
use App\Services\Media\PostCoverImageService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * CRUD admin de `posts` (Fase 4). `posts` usa soft deletes: "eliminar" archiva
 * (status=hidden) y solo se borra físicamente si se confirma desde el listado
 * de papelera (no implementado en esta fase: se prioriza archivar).
 */
class PostController extends Controller
{
    public function __construct(private readonly PostCoverImageService $covers) {}

    public function index(): Response
    {
        $posts = Post::query()
            ->with(['category', 'tags'])
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Post $post): array => $this->adminSummary($post))
            ->values();

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts,
            'categories' => $this->categoryOptions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Posts/Create', [
            'statuses' => $this->statusOptions(),
            'categories' => $this->categoryOptions(),
            'tags' => $this->tagOptions(),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $post = new Post($this->contentAttributes($request));
        $post->save();

        $this->syncImage($request, $post);
        $post->tags()->sync($request->validated('tags', []));
        $this->enforceSingleFeatured($post);

        return to_route('admin.posts.index')
            ->with('toast', ['type' => 'success', 'message' => 'Post creado.']);
    }

    public function edit(Post $post): Response
    {
        $post->load('tags');

        return Inertia::render('Admin/Posts/Edit', [
            'post' => $this->adminRecord($post),
            'statuses' => $this->statusOptions(),
            'categories' => $this->categoryOptions(),
            'tags' => $this->tagOptions(),
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $post->fill($this->contentAttributes($request));
        $post->save();

        $this->syncImage($request, $post);
        $post->tags()->sync($request->validated('tags', []));
        $this->enforceSingleFeatured($post);

        return to_route('admin.posts.index')
            ->with('toast', ['type' => 'success', 'message' => 'Post actualizado.']);
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->update(['status' => PostStatus::Hidden]);
        $post->delete();

        return to_route('admin.posts.index')
            ->with('toast', ['type' => 'success', 'message' => 'Post archivado.']);
    }

    public function toggleFeatured(Post $post): RedirectResponse
    {
        $post->update(['is_featured' => ! $post->is_featured]);
        $this->enforceSingleFeatured($post);

        return back();
    }

    /**
     * Solo puede existir un post destacado. Si `$post` quedó destacado,
     * desmarca cualquier otro; si quedó sin destacar, puede no quedar
     * ninguno destacado (no se elige un sustituto automático).
     */
    private function enforceSingleFeatured(Post $post): void
    {
        if ($post->is_featured) {
            Post::query()->whereKeyNot($post->id)->where('is_featured', true)->update([
                'is_featured' => false,
                'featured_order' => null,
            ]);
            $post->update(['featured_order' => 1]);

            return;
        }

        if ($post->featured_order !== null) {
            $post->update(['featured_order' => null]);
        }
    }

    public function toggleHome(Post $post): RedirectResponse
    {
        $post->update(['show_on_home' => ! $post->show_on_home]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function contentAttributes(StorePostRequest|UpdatePostRequest $request): array
    {
        $content = $this->localized($request->validated('content'));
        $readingTime = $this->estimateReadingTime($content);

        return [
            'post_category_id' => (int) $request->validated('post_category_id'),
            'title' => $this->localized($request->validated('title')),
            'slug' => $this->localized($request->validated('slug')),
            'excerpt' => $this->localized($request->validated('excerpt')),
            'content' => $content,
            'status' => $request->validated('status'),
            'published_at' => $request->validated('published_at'),
            'is_featured' => $request->boolean('is_featured'),
            'show_on_home' => $request->boolean('show_on_home'),
            'reading_time' => $readingTime,
        ];
    }

    /**
     * @param  array<string, string|null>|null  $content
     */
    private function estimateReadingTime(?array $content): ?int
    {
        if ($content === null || ! is_string($content['es'] ?? null) || $content['es'] === '') {
            return null;
        }

        $words = str_word_count(strip_tags($content['es']));

        return max(1, (int) ceil($words / 200));
    }

    private function syncImage(StorePostRequest|UpdatePostRequest $request, Post $post): void
    {
        if ($request->hasFile('image')) {
            $slug = $post->slug['es'] ?? $post->slug['en'] ?? (string) $post->id;
            $path = $this->covers->storeFromPath($request->file('image')->getRealPath(), $slug);

            $post->update(['featured_image' => $path]);

            return;
        }

        if ($request->boolean('remove_image') && $post->featured_image !== null) {
            $post->update(['featured_image' => null]);
        }
    }

    /**
     * @return array<string, string|null>|null
     */
    private function localized(mixed $value): ?array
    {
        if (! is_array($value)) {
            return null;
        }

        $es = isset($value['es']) && is_string($value['es']) ? $value['es'] : null;
        $en = isset($value['en']) && is_string($value['en']) ? $value['en'] : null;

        if ($es === null && $en === null) {
            return null;
        }

        return ['es' => $es, 'en' => $en];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminSummary(Post $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'status' => $post->status->value,
            'categoryId' => $post->post_category_id,
            'categoryName' => $post->category?->name,
            'tagIds' => $post->tags->pluck('id')->values(),
            'isFeatured' => $post->is_featured,
            'showOnHome' => $post->show_on_home,
            'publishedAt' => $post->published_at?->toIso8601String(),
            'readingTime' => $post->reading_time,
            'updatedAt' => $post->updated_at?->toIso8601String(),
            'publicUrl' => $this->publicUrl($post),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminRecord(Post $post): array
    {
        return [
            ...$this->adminSummary($post),
            'excerpt' => $post->excerpt,
            'content' => $post->content,
            'featuredImage' => $post->featured_image,
        ];
    }

    private function publicUrl(Post $post): ?string
    {
        $slug = $post->slug['es'] ?? $post->slug['en'] ?? null;

        return $slug !== null ? url('/blog/'.$slug) : null;
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function statusOptions(): array
    {
        return [
            ['value' => PostStatus::Draft->value, 'label' => 'Borrador'],
            ['value' => PostStatus::Scheduled->value, 'label' => 'Programado'],
            ['value' => PostStatus::Published->value, 'label' => 'Publicado'],
            ['value' => PostStatus::Hidden->value, 'label' => 'Oculto'],
        ];
    }

    /**
     * @return list<array{value: int, label: string|null}>
     */
    private function categoryOptions(): array
    {
        return array_values(PostCategory::query()->ordered()->get()
            ->map(fn (PostCategory $category): array => [
                'value' => $category->id,
                'label' => (string) ($category->name['es'] ?? $category->name['en'] ?? "#{$category->id}"),
            ])->all());
    }

    /**
     * @return list<array{value: int, label: string|null}>
     */
    private function tagOptions(): array
    {
        return array_values(Tag::query()->orderBy('id')->get()
            ->map(fn (Tag $tag): array => [
                'value' => $tag->id,
                'label' => (string) ($tag->name['es'] ?? $tag->name['en'] ?? "#{$tag->id}"),
            ])->all());
    }
}

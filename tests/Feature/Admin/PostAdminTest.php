<?php

use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

function publishedPostPayload(PostCategory $category, array $overrides = []): array
{
    return array_merge([
        'post_category_id' => $category->id,
        'tags' => [],
        'title' => ['es' => 'Título destacado', 'en' => 'Featured title'],
        'slug' => ['es' => 'titulo-destacado', 'en' => 'featured-title'],
        'excerpt' => ['es' => 'Extracto en español.', 'en' => 'Excerpt in English.'],
        'content' => ['es' => str_repeat('Contenido real del artículo. ', 4), 'en' => null],
        'status' => PostStatus::Published->value,
        'is_featured' => true,
        'show_on_home' => true,
    ], $overrides);
}

test('editing a published post without resubmitting a date keeps it published and visible', function () {
    $category = PostCategory::factory()->create();

    $post = Post::factory()->create([
        'post_category_id' => $category->id,
        'slug' => ['es' => 'titulo-destacado', 'en' => 'featured-title'],
        'status' => PostStatus::Published->value,
        'published_at' => now()->subDays(3),
        'is_featured' => true,
        'featured_order' => 1,
        'show_on_home' => true,
    ]);

    $this->actingAs(User::factory()->create(['role' => 'admin']));

    // El formulario no reenvía `published_at` (campo vacío): antes esto borraba
    // la fecha y expulsaba el post del blog/landing. Debe seguir publicado.
    $this->put(route('admin.posts.update', $post), publishedPostPayload($category))
        ->assertRedirect(route('admin.posts.index'));

    expect($post->refresh()->published_at)->not->toBeNull()
        ->and($post->status)->toBe(PostStatus::Published);

    // Sigue siendo el destacado del blog público (el síntoma reportado).
    $this->get('/blog')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('featuredPost.id', $post->id));
});

test('a published post dated slightly in the future is still publicly visible', function () {
    // Reproduce el desfase de zona horaria: el editor publica "ahora" en hora
    // local (UTC+2) y se guarda como UTC, quedando por delante de now() en UTC.
    // Un post `Published` debe verse igual en blog y landing.
    $category = PostCategory::factory()->create();

    $post = Post::factory()->create([
        'post_category_id' => $category->id,
        'slug' => ['es' => 'futuro-cercano', 'en' => 'near-future'],
        'status' => PostStatus::Published->value,
        'published_at' => now()->addHours(3),
        'is_featured' => true,
        'featured_order' => 1,
        'show_on_home' => true,
    ]);

    $this->get('/blog')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('featuredPost.id', $post->id));

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('featuredPost.id', $post->id));
});

test('an existing published date is preserved when resubmitted unchanged', function () {
    $category = PostCategory::factory()->create();
    $date = now()->subDays(5)->startOfMinute();

    $post = Post::factory()->create([
        'post_category_id' => $category->id,
        'slug' => ['es' => 'titulo-destacado', 'en' => 'featured-title'],
        'status' => PostStatus::Published->value,
        'published_at' => $date,
    ]);

    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->put(
        route('admin.posts.update', $post),
        publishedPostPayload($category, ['published_at' => $date->format('Y-m-d\TH:i')]),
    )->assertRedirect(route('admin.posts.index'));

    expect($post->refresh()->published_at->format('Y-m-d H:i'))->toBe($date->format('Y-m-d H:i'));
});

test('uploading a blog cover creates responsive webp variants', function () {
    if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
        $this->markTestSkipped('GD con soporte WebP no disponible.');
    }

    Storage::fake('public_uploads');

    $category = PostCategory::factory()->create();

    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->post(route('admin.posts.store'), publishedPostPayload($category, [
        'image' => UploadedFile::fake()->image('cover.png', 1400, 900),
    ]))->assertRedirect(route('admin.posts.index'));

    $post = Post::query()->where('slug_es', 'titulo-destacado')->firstOrFail();

    expect($post->featured_image)->toBe('/uploads/blog/posts/titulo-destacado.webp');

    Storage::disk('public_uploads')->assertExists('blog/posts/titulo-destacado.webp');
    Storage::disk('public_uploads')->assertExists('blog/posts/titulo-destacado-480w.webp');
    Storage::disk('public_uploads')->assertExists('blog/posts/titulo-destacado-640w.webp');
    Storage::disk('public_uploads')->assertExists('blog/posts/titulo-destacado-960w.webp');
    Storage::disk('public_uploads')->assertExists('blog/posts/titulo-destacado-1280w.webp');
});

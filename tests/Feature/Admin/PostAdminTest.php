<?php

use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;

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

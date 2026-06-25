<?php

use App\Enums\PostStatus;
use App\Models\Post;

/**
 * Compuerta de publicación pública del blog (`Post::scopePublished()`).
 *
 * Un post `Scheduled` con `published_at <= now()` debe ser visible sin cron ni
 * cambio manual a `Published`; el `Scheduled` futuro y el `Draft` no. Misma
 * regla en el listado `/blog` y en el detalle `/blog/{slug}`.
 */

/**
 * Crea un post con estado y fecha dados y slug ES estable para aserciones.
 */
function postWithGate(PostStatus $status, ?DateTimeInterface $publishedAt, string $slug): Post
{
    return Post::factory()->create([
        'status' => $status->value,
        'published_at' => $publishedAt,
        'slug' => ['es' => $slug, 'en' => $slug.'-en'],
    ]);
}

test('un post publicado aparece en /blog', function () {
    postWithGate(PostStatus::Published, now()->subDay(), 'post-publicado');

    $this->get('/blog')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Public/Blog')
            ->where('posts.data', fn ($data): bool => collect($data)->pluck('slug.es')->contains('post-publicado'))
        );
});

test('un post programado con fecha pasada aparece en /blog', function () {
    postWithGate(PostStatus::Scheduled, now()->subMinutes(5), 'programado-vencido');

    $this->get('/blog')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('posts.data', fn ($data): bool => collect($data)->pluck('slug.es')->contains('programado-vencido'))
        );
});

test('un post programado con fecha futura NO aparece en /blog', function () {
    postWithGate(PostStatus::Scheduled, now()->addDay(), 'programado-futuro');

    $this->get('/blog')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('posts.data', fn ($data): bool => ! collect($data)->pluck('slug.es')->contains('programado-futuro'))
        );
});

test('un borrador NO aparece en /blog', function () {
    postWithGate(PostStatus::Draft, null, 'borrador');

    $this->get('/blog')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('posts.data', fn ($data): bool => ! collect($data)->pluck('slug.es')->contains('borrador'))
        );
});

test('/blog/{slug} permite entrar a un programado vencido', function () {
    postWithGate(PostStatus::Scheduled, now()->subMinutes(5), 'detalle-programado-vencido');

    $this->get('/blog/detalle-programado-vencido')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Public/BlogPost')
            ->where('post.slug.es', 'detalle-programado-vencido')
        );
});

test('/blog/{slug} devuelve 404 para un programado futuro', function () {
    postWithGate(PostStatus::Scheduled, now()->addDay(), 'detalle-programado-futuro');

    $this->get('/blog/detalle-programado-futuro')->assertNotFound();
});

test('/blog/{slug} devuelve 404 para un borrador', function () {
    postWithGate(PostStatus::Draft, null, 'detalle-borrador');

    $this->get('/blog/detalle-borrador')->assertNotFound();
});

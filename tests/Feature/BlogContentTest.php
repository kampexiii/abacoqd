<?php

use App\Enums\PostStatus;
use App\Models\Post;

/**
 * Crea un post publicado con el `content` indicado y devuelve su slug ES.
 *
 * @param  mixed  $content
 */
function publishedPostWithContent($content, string $slug): string
{
    Post::factory()->create([
        'title' => ['es' => 'Título real', 'en' => 'Real title'],
        'slug' => ['es' => $slug, 'en' => $slug.'-en'],
        'excerpt' => ['es' => 'Resumen real.', 'en' => 'Real summary.'],
        'content' => $content,
        'status' => PostStatus::Published->value,
        'published_at' => now()->subDay(),
    ]);

    return $slug;
}

test('a blog detail with string Markdown content renders without error', function () {
    $slug = publishedPostWithContent(
        ['es' => "## Título\n\nPárrafo real del post.", 'en' => '## Title'],
        'contenido-string',
    );

    $this->get("/blog/{$slug}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('post.contentHtml.es', fn (string $html): bool => str_contains($html, 'Párrafo real del post.'))
            ->where('post.contentHtml.es', fn (string $html): bool => str_contains($html, '<h2 id="titulo">'))
        );
});

test('a blog detail with array block content renders without Array to string conversion', function () {
    $slug = publishedPostWithContent(
        [
            'es' => [
                ['type' => 'heading', 'text' => 'Encabezado de bloque'],
                ['type' => 'paragraph', 'text' => 'Primer párrafo en bloques.'],
            ],
            'en' => [
                ['type' => 'paragraph', 'text' => 'First block paragraph.'],
            ],
        ],
        'contenido-bloques',
    );

    $response = $this->get("/blog/{$slug}");

    $response->assertOk();
    // El error original era un 500 con este mensaje: garantizamos su ausencia.
    $response->assertDontSee('Array to string conversion', false);

    $response->assertInertia(fn ($page) => $page
        // El heading de bloque se promueve a H2 (alimenta el TOC).
        ->where('post.contentHtml.es', fn (string $html): bool => str_contains($html, 'Encabezado de bloque'))
        ->where('post.contentHtml.es', fn (string $html): bool => str_contains($html, 'Primer párrafo en bloques.'))
        ->where('post.toc.es', fn ($toc): bool => collect($toc)->contains('text', 'Encabezado de bloque'))
    );
});

test('a blog detail with null content renders an empty body without error', function () {
    $slug = publishedPostWithContent(['es' => null, 'en' => null], 'contenido-nulo');

    $this->get("/blog/{$slug}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('post.contentHtml.es', '')
            ->where('post.toc.es', [])
        );
});

test('a blog detail with a fully null content column renders without error', function () {
    $slug = publishedPostWithContent(null, 'contenido-columna-nula');

    $this->get("/blog/{$slug}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('post.contentHtml.es', ''));
});

<?php

use App\Enums\PostStatus;
use App\Enums\ServiceStatus;
use App\Models\Post;
use App\Models\Service;

/**
 * Extrae y decodifica los nodos JSON-LD del HTML inicial. De paso valida que
 * cada bloque sea JSON válido (json_decode sin error).
 *
 * @return list<array<string, mixed>>
 */
function jsonLdNodes(string $html): array
{
    preg_match_all('#<script type="application/ld\+json"[^>]*>(.*?)</script>#s', $html, $matches);

    return array_map(static function (string $json): array {
        $decoded = json_decode($json, true);

        expect(json_last_error())->toBe(JSON_ERROR_NONE);
        expect($decoded)->toBeArray();

        return $decoded;
    }, $matches[1]);
}

/**
 * @param  list<array<string, mixed>>  $nodes
 * @return list<string>
 */
function jsonLdTypes(array $nodes): array
{
    return array_values(array_filter(array_map(
        static fn (array $node): ?string => isset($node['@type']) && is_string($node['@type']) ? $node['@type'] : null,
        $nodes,
    )));
}

test('the home page serves valid Organization and WebSite json-ld in the initial html', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertSee('application/ld+json', false);

    $nodes = jsonLdNodes($response->getContent());

    expect(jsonLdTypes($nodes))
        ->toContain('Organization')
        ->toContain('WebSite');

    $org = collect($nodes)->firstWhere('@type', 'Organization');
    // Datos confirmados desde config/site.php (nada inventado).
    expect($org['name'])->toBe('Abaco Developments')
        ->and($org['url'])->toBe('https://abacoqd.com/')
        ->and($org['email'])->toBe('info@abacodev.com')
        ->and($org['legalName'])->toBe('ABACO DIGITAL DEVELOPMENTS, S.L.');
});

test('the contact page serves a ContactPage json-ld node with breadcrumb', function () {
    $response = $this->get('/contacto');

    $response->assertOk();

    $nodes = jsonLdNodes($response->getContent());

    expect(jsonLdTypes($nodes))
        ->toContain('ContactPage')
        ->toContain('BreadcrumbList');

    $contact = collect($nodes)->firstWhere('@type', 'ContactPage');
    expect($contact['url'])->toBe('https://abacoqd.com/contacto');
});

test('a published blog post serves an Article json-ld node from the model', function () {
    Post::factory()->create([
        'title' => ['es' => 'Cómo aplicamos IA', 'en' => 'How we apply AI'],
        'slug' => ['es' => 'como-aplicamos-ia', 'en' => 'how-we-apply-ia'],
        'excerpt' => ['es' => 'Un resumen real del contenido.', 'en' => 'A real summary.'],
        // El detalle renderiza content[locale] como Markdown (string).
        'content' => ['es' => "## Intro\n\nTexto real.", 'en' => "## Intro\n\nReal text."],
        'status' => PostStatus::Published->value,
        'published_at' => now()->subDay(),
    ]);

    $response = $this->get('/blog/como-aplicamos-ia');

    $response->assertOk();

    $nodes = jsonLdNodes($response->getContent());

    expect(jsonLdTypes($nodes))
        ->toContain('Article')
        ->toContain('BreadcrumbList');

    $article = collect($nodes)->firstWhere('@type', 'Article');
    expect($article['headline'])->toBe('Cómo aplicamos IA')
        ->and($article['url'])->toBe('https://abacoqd.com/blog/como-aplicamos-ia')
        ->and($article['description'])->toBe('Un resumen real del contenido.')
        ->and($article['publisher']['@type'])->toBe('Organization');
});

test('a published service detail serves a Service json-ld node with provider', function () {
    Service::factory()->create([
        'title' => ['es' => 'Aplicaciones a medida', 'en' => 'Custom applications'],
        'slug' => ['es' => 'aplicaciones-a-medida', 'en' => 'custom-applications'],
        'summary' => [
            'es' => 'Herramientas internas adaptadas a procesos reales.',
            'en' => 'Internal tools adapted to real processes.',
        ],
        'status' => ServiceStatus::Published->value,
        'is_active' => true,
        'is_detail_enabled' => true,
    ]);

    $response = $this->get('/servicios/aplicaciones-a-medida');

    $response->assertOk();

    $nodes = jsonLdNodes($response->getContent());

    expect(jsonLdTypes($nodes))
        ->toContain('Service')
        ->toContain('BreadcrumbList');

    $service = collect($nodes)->firstWhere('@type', 'Service');
    expect($service['name'])->toBe('Aplicaciones a medida')
        ->and($service['url'])->toBe('https://abacoqd.com/servicios/aplicaciones-a-medida')
        ->and($service['provider']['@type'])->toBe('Organization');
});

test('json-ld never introduces hreflang, /en routes or unconfirmed rating, review, price or offers', function () {
    $response = $this->get('/');

    $response->assertOk();
    $content = $response->getContent();

    // Decisión cerrada: solo ES, sin /en ni hreflang.
    $response->assertDontSee('hreflang', false);

    $nodes = jsonLdNodes($content);

    foreach ($nodes as $node) {
        $encoded = (string) json_encode($node, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        expect($encoded)
            ->not->toContain('/en/')
            ->not->toContain('aggregateRating')
            ->not->toContain('ratingValue')
            ->not->toContain('reviewCount')
            ->not->toContain('"review"')
            ->not->toContain('"offers"')
            ->not->toContain('"price"')
            ->not->toContain('priceCurrency');
    }
});

test('non public routes do not emit json-ld', function () {
    // El dashboard admin requiere auth: la redirección a login (ruta no pública)
    // no debe arrastrar datos estructurados.
    $this->get('/login')
        ->assertOk()
        ->assertDontSee('application/ld+json', false);
});

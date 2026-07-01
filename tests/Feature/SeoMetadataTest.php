<?php

use App\Enums\ServiceStatus;
use App\Models\SeoMetadata;
use App\Models\Service;
use Database\Seeders\SeoMetadataSeeder;

test('public pages serve the base seo metadata in the initial html', function () {
    $response = $this->get('/');

    $response->assertOk();
    // No depende solo del <Head> de React: los básicos viajan en el HTML.
    $response->assertSee('<link rel="canonical" href="https://abacoqd.com/"', false);
    $response->assertSee('name="robots" content="index,follow"', false);
    $response->assertSee('name="description"', false);
});

test('the seo prop exposes title, description, canonical and robots', function () {
    $this->get('/servicios')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('seo.canonical', 'https://abacoqd.com/servicios')
            ->where('seo.robots', 'index,follow')
            ->has('seo.title')
            ->has('seo.description')
        );
});

test('a service detail resolves its seo from the model with an absolute es canonical', function () {
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

    $this->get('/servicios/aplicaciones-a-medida')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('seo.canonical', 'https://abacoqd.com/servicios/aplicaciones-a-medida')
            ->where('seo.robots', 'index,follow')
            ->where('seo.title', 'Aplicaciones a medida | Abaco Developments')
            ->where('seo.description', 'Herramientas internas adaptadas a procesos reales.')
        );
});

test('public pages serve open graph and twitter card metadata in the initial html', function () {
    $title = (string) config('site.seo.title');
    $description = (string) config('site.seo.description');

    $response = $this->get('/');

    $response->assertOk();
    // OG básicos viajan en el HTML inicial, no solo en el <Head> de React.
    $response->assertSee('property="og:type" content="website"', false);
    $response->assertSee('property="og:title" content="'.e($title).'"', false);
    $response->assertSee('property="og:description" content="'.e($description).'"', false);
    // og:url coincide con el canonical resuelto.
    $response->assertSee('property="og:url" content="https://abacoqd.com/"', false);
    // Twitter Cards reflejan los valores OG con card summary_large_image.
    $response->assertSee('name="twitter:card" content="summary_large_image"', false);
    $response->assertSee('name="twitter:title" content="'.e($title).'"', false);
    $response->assertSee('name="twitter:description" content="'.e($description).'"', false);

    // og:image por defecto: tarjeta social 1200×630 versionada, servida como URL
    // absoluta sobre el dominio canónico. Este bloque no introduce hreflang (los
    // datos estructurados JSON-LD se cubren en SeoStructuredDataTest).
    $response->assertSee('property="og:image" content="https://abacoqd.com/assets/branding/social/og-default.png"', false);
    $response->assertSee('name="twitter:image" content="https://abacoqd.com/assets/branding/social/og-default.png"', false);
    $response->assertDontSee('hreflang', false);
});

test('a configured og image fallback is served as an absolute canonical url', function () {
    config()->set('site.seo.og_image', '/assets/branding/og-image.png');

    $this->get('/')
        ->assertOk()
        ->assertSee('property="og:image" content="https://abacoqd.com/assets/branding/og-image.png"', false)
        ->assertSee('name="twitter:image" content="https://abacoqd.com/assets/branding/og-image.png"', false);
});

test('the seeder emits real ES canonicals and no inexistent /en canonicals', function () {
    (new SeoMetadataSeeder)->run();

    expect(SeoMetadata::query()->where('page_key', 'home')->where('locale', 'es')->value('canonical_url'))
        ->toBe('https://abacoqd.com/');

    expect(SeoMetadata::query()->where('locale', 'en')->whereNotNull('canonical_url')->count())
        ->toBe(0);

    // Los registros EN se conservan como datos traducibles (no se borran).
    expect(SeoMetadata::query()->where('locale', 'en')->count())
        ->toBeGreaterThan(0);
});

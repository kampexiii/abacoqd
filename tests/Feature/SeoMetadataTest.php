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

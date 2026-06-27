<?php

use App\Models\Service;
use Database\Seeders\ServiceSeeder;

test('seeds the eight confirmed services with stable slugs and order', function () {
    (new ServiceSeeder)->run();

    expect(Service::query()->count())->toBe(8);

    $slugs = Service::query()->orderBy('sort_order')->pluck('slug')
        ->map(fn (array $slug): ?string => $slug['es'] ?? null)
        ->all();

    expect($slugs)->toBe([
        'desarrollo-web-rapido',
        'aplicaciones-gestion-medida',
        'herramientas-internas-paneles-administracion',
        'automatizacion-procesos-ia',
        'crm-datos-reporting',
        'integraciones-digitales',
        'mvps-prototipos-funcionales',
        'mejora-evolucion-software-existente',
    ]);
});

test('exactly three services are featured and all are active, published and detail-enabled', function () {
    (new ServiceSeeder)->run();

    $services = Service::query()->get();

    expect($services->where('is_featured', true)->count())->toBe(3)
        ->and($services->every(fn (Service $service): bool => $service->is_active))->toBeTrue()
        ->and($services->every(fn (Service $service): bool => $service->is_detail_enabled))->toBeTrue()
        ->and($services->every(fn (Service $service): bool => $service->show_on_home))->toBeTrue()
        ->and($services->every(fn (Service $service): bool => $service->status->value === 'published'))->toBeTrue();

    $featuredSlugs = $services->where('is_featured', true)
        ->pluck('slug')
        ->map(fn (array $slug): ?string => $slug['es'] ?? null)
        ->sort()
        ->values()
        ->all();

    expect($featuredSlugs)->toBe([
        'aplicaciones-gestion-medida',
        'automatizacion-procesos-ia',
        'desarrollo-web-rapido',
    ]);
});

test('running the seeder twice is idempotent and keeps the same ids', function () {
    (new ServiceSeeder)->run();

    $idsBySlug = Service::query()->get()
        ->mapWithKeys(fn (Service $service): array => [$service->slug['es'] => $service->id])
        ->all();

    (new ServiceSeeder)->run();

    expect(Service::query()->count())->toBe(8);

    $idsBySlugAfter = Service::query()->get()
        ->mapWithKeys(fn (Service $service): array => [$service->slug['es'] => $service->id])
        ->all();

    expect($idsBySlugAfter)->toBe($idsBySlug);
});

test('re-running the seeder over a renamed legacy slug updates in place instead of duplicating', function () {
    $legacy = Service::factory()->create([
        'slug' => ['es' => 'aplicaciones-a-medida', 'en' => 'custom-applications'],
        'title' => ['es' => 'Aplicaciones a medida', 'en' => 'Custom applications'],
    ]);

    (new ServiceSeeder)->run();

    expect(Service::query()->count())->toBe(8);

    $legacy->refresh();

    expect($legacy->slug['es'])->toBe('aplicaciones-gestion-medida')
        ->and($legacy->title['es'])->toBe('Aplicaciones de gestión a medida');
});

test('the seeder does not overwrite an already uploaded image', function () {
    $service = Service::factory()->create([
        'slug' => ['es' => 'desarrollo-web-rapido', 'en' => 'fast-web-development'],
        'image' => '/uploads/services/desarrollo-web-rapido.webp',
    ]);

    (new ServiceSeeder)->run();

    expect($service->refresh()->image)->toBe('/uploads/services/desarrollo-web-rapido.webp');
});

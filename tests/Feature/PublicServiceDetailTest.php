<?php

use App\Enums\ServiceStatus;
use App\Models\Service;

test('a published, active service with the detail enabled exposes its public detail', function () {
    $service = Service::factory()->create([
        'title' => ['es' => 'Aplicaciones a medida', 'en' => 'Custom applications'],
        'slug' => ['es' => 'aplicaciones-a-medida', 'en' => 'custom-applications'],
        'summary' => [
            'es' => 'Herramientas internas y productos digitales adaptados a procesos reales.',
            'en' => 'Internal tools and digital products adapted to real processes.',
        ],
        'status' => ServiceStatus::Published->value,
        'sort_order' => 1,
        'is_active' => true,
        'is_detail_enabled' => true,
    ]);

    $this->get('/servicios')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Public/Services')
            ->where('services.0.id', $service->id)
            ->where('services.0.isDetailEnabled', true)
        );

    $this->get('/servicios/aplicaciones-a-medida')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Public/ServiceDetail')
            ->where('service.id', $service->id)
            ->where('service.isDetailEnabled', true)
        );
});

test('the home receives at most three featured services with individual pages', function () {
    foreach (range(1, 4) as $index) {
        Service::factory()->create([
            'title' => ['es' => "Servicio destacado {$index}", 'en' => "Featured service {$index}"],
            'slug' => ['es' => "servicio-destacado-{$index}", 'en' => "featured-service-{$index}"],
            'status' => ServiceStatus::Published->value,
            'is_active' => true,
            'is_detail_enabled' => true,
            'is_featured' => true,
            'show_on_home' => true,
            'sort_order' => $index,
        ]);
    }

    Service::factory()->create([
        'slug' => ['es' => 'destacado-sin-detalle', 'en' => 'featured-no-detail'],
        'status' => ServiceStatus::Published->value,
        'is_active' => true,
        'is_detail_enabled' => false,
        'is_featured' => true,
        'show_on_home' => true,
        'sort_order' => 0,
    ]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('featuredServices', 3)
            ->where('featuredServices.0.slug.es', 'servicio-destacado-1')
            ->where('featuredServices.2.slug.es', 'servicio-destacado-3')
        );
});

test('the public services page lists active published services even when they are not featured', function () {
    $service = Service::factory()->create([
        'slug' => ['es' => 'servicio-no-destacado', 'en' => 'not-featured-service'],
        'status' => ServiceStatus::Published->value,
        'is_active' => true,
        'is_featured' => false,
        'show_on_home' => false,
    ]);

    $this->get('/servicios')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Public/Services')
            ->where('services.0.id', $service->id)
        );
});

test('inactive services are excluded from public service lists', function () {
    Service::factory()->create([
        'slug' => ['es' => 'servicio-inactivo', 'en' => 'inactive-service'],
        'status' => ServiceStatus::Published->value,
        'is_active' => false,
    ]);

    $this->get('/servicios')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Public/Services')
            ->where('services', [])
        );
});

test('public service cards receive uploaded images when available', function () {
    Service::factory()->create([
        'slug' => ['es' => 'servicio-con-imagen', 'en' => 'service-with-image'],
        'status' => ServiceStatus::Published->value,
        'is_active' => true,
        'image' => '/uploads/services/servicio-con-imagen.webp',
        'sort_order' => 1,
    ]);

    Service::factory()->create([
        'slug' => ['es' => 'servicio-sin-imagen', 'en' => 'service-without-image'],
        'status' => ServiceStatus::Published->value,
        'is_active' => true,
        'image' => null,
        'sort_order' => 2,
    ]);

    $this->get('/servicios')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('services.0.image', '/uploads/services/servicio-con-imagen.webp')
            ->where('services.1.image', null)
        );
});

test('a service with the detail disabled never opens its public detail', function () {
    Service::factory()->create([
        'slug' => ['es' => 'aplicaciones-a-medida', 'en' => 'custom-applications'],
        'status' => ServiceStatus::Published->value,
        'is_active' => true,
        'is_detail_enabled' => false,
    ]);

    $this->get('/servicios/aplicaciones-a-medida')->assertNotFound();
});

test('the footer receives the same published active services in configured order', function () {
    $second = Service::factory()->create([
        'title' => ['es' => 'Segundo servicio', 'en' => 'Second service'],
        'slug' => ['es' => 'segundo-servicio', 'en' => 'second-service'],
        'status' => ServiceStatus::Published->value,
        'sort_order' => 20,
        'is_active' => true,
        'is_detail_enabled' => false,
    ]);

    $first = Service::factory()->create([
        'title' => ['es' => 'Primer servicio', 'en' => 'First service'],
        'slug' => ['es' => 'primer-servicio', 'en' => 'first-service'],
        'status' => ServiceStatus::Published->value,
        'sort_order' => 10,
        'is_active' => true,
        'is_detail_enabled' => true,
    ]);

    Service::factory()->create([
        'status' => ServiceStatus::Draft->value,
        'sort_order' => 1,
        'is_active' => true,
    ]);

    Service::factory()->create([
        'status' => ServiceStatus::Published->value,
        'sort_order' => 2,
        'is_active' => false,
    ]);

    $this->get('/servicios')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('footerServices', 2)
            ->where('footerServices.0.id', $first->id)
            ->where('footerServices.0.title.es', 'Primer servicio')
            ->where('footerServices.0.slug.en', 'first-service')
            ->where('footerServices.0.isDetailEnabled', true)
            ->where('footerServices.1.id', $second->id)
            ->where('footerServices.1.isDetailEnabled', false)
        );
});

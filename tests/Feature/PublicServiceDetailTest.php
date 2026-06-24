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

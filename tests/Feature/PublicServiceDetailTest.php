<?php

use App\Enums\ServiceStatus;
use App\Models\Service;

test('initial services expose their public detail even when existing records have the old disabled flag', function () {
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
        'is_detail_enabled' => false,
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

test('non initial services still need the detail flag enabled', function () {
    Service::factory()->create([
        'slug' => ['es' => 'servicio-interno', 'en' => 'internal-service'],
        'status' => ServiceStatus::Published->value,
        'is_active' => true,
        'is_detail_enabled' => false,
    ]);

    $this->get('/servicios/servicio-interno')->assertNotFound();
});

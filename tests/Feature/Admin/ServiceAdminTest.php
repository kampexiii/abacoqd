<?php

use App\Enums\ServiceStatus;
use App\Enums\UserRole;
use App\Models\Service;
use App\Models\User;

function adminUser(UserRole $role = UserRole::Admin): User
{
    return User::factory()->create(['role' => $role->value]);
}

function validServicePayload(array $overrides = []): array
{
    return array_merge([
        'title' => ['es' => 'Servicio nuevo', 'en' => 'New service'],
        'slug' => ['es' => 'servicio-nuevo', 'en' => 'new-service'],
        'summary' => ['es' => 'Resumen en español.', 'en' => 'Summary in English.'],
        'description' => ['es' => null, 'en' => null],
        'icon' => 'code',
        'status' => ServiceStatus::Draft->value,
        'sort_order' => 10,
        'is_active' => true,
        'is_featured' => false,
        'show_on_home' => true,
        'is_detail_enabled' => false,
    ], $overrides);
}

test('guests are redirected to login from the admin services listing', function () {
    $this->get(route('admin.services.index'))->assertRedirect(route('login'));
});

test('a viewer without management role cannot access the admin', function () {
    $this->actingAs(adminUser(UserRole::Viewer));

    $this->get(route('admin.services.index'))->assertForbidden();
});

test('a management user can see the admin services listing', function () {
    Service::factory()->create();
    $this->actingAs(adminUser(UserRole::Editor));

    $this->get(route('admin.services.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/Services/Index'));
});

test('an admin can create a draft service', function () {
    $this->actingAs(adminUser());

    $this->post(route('admin.services.store'), validServicePayload())
        ->assertRedirect(route('admin.services.index'));

    $service = Service::query()->where('slug_es', 'servicio-nuevo')->first();

    expect($service)->not->toBeNull()
        ->and($service->status)->toBe(ServiceStatus::Draft)
        ->and($service->title['es'])->toBe('Servicio nuevo');
});

test('an admin can update a service', function () {
    $service = Service::factory()->create([
        'slug' => ['es' => 'servicio-original', 'en' => 'original-service'],
        'status' => ServiceStatus::Draft->value,
    ]);

    $this->actingAs(adminUser());

    $this->put(
        route('admin.services.update', $service),
        validServicePayload([
            'title' => ['es' => 'Servicio actualizado', 'en' => 'Updated service'],
            'slug' => ['es' => 'servicio-actualizado', 'en' => 'updated-service'],
            'status' => ServiceStatus::Published->value,
        ]),
    )->assertRedirect(route('admin.services.index'));

    $service->refresh();

    expect($service->title['es'])->toBe('Servicio actualizado')
        ->and($service->status)->toBe(ServiceStatus::Published);
});

test('publishing requires a Spanish title', function () {
    $this->actingAs(adminUser());

    $this->post(
        route('admin.services.store'),
        validServicePayload([
            'title' => ['es' => null, 'en' => 'Only English'],
            'status' => ServiceStatus::Published->value,
        ]),
    )->assertSessionHasErrors('title.es');
});

test('toggling the detail flag flips its value', function () {
    $service = Service::factory()->create(['is_detail_enabled' => false]);
    $this->actingAs(adminUser());

    $this->patch(route('admin.services.toggle-detail', $service));

    expect($service->refresh()->is_detail_enabled)->toBeTrue();
});

test('archiving a service hides it instead of deleting it', function () {
    $service = Service::factory()->create([
        'status' => ServiceStatus::Published->value,
        'is_active' => true,
    ]);
    $this->actingAs(adminUser());

    $this->delete(route('admin.services.destroy', $service));

    $service->refresh();

    expect($service->status)->toBe(ServiceStatus::Hidden)
        ->and($service->is_active)->toBeFalse();
    $this->assertDatabaseHas('services', ['id' => $service->id]);
});

test('a published, active service appears on the public listing', function () {
    $service = Service::factory()->create([
        'slug' => ['es' => 'servicio-visible', 'en' => 'visible-service'],
        'status' => ServiceStatus::Published->value,
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $this->get('/servicios')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Public/Services')
            ->where('services.0.id', $service->id)
        );
});

test('a hidden service does not appear on the public listing', function () {
    Service::factory()->create([
        'slug' => ['es' => 'servicio-oculto', 'en' => 'hidden-service'],
        'status' => ServiceStatus::Hidden->value,
        'is_active' => true,
    ]);

    $this->get('/servicios')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Public/Services')
            ->where('services', [])
        );
});

test('a service with the detail disabled returns 404 on its detail route', function () {
    Service::factory()->create([
        'slug' => ['es' => 'sin-detalle', 'en' => 'no-detail'],
        'status' => ServiceStatus::Published->value,
        'is_active' => true,
        'is_detail_enabled' => false,
    ]);

    $this->get('/servicios/sin-detalle')->assertNotFound();
});

test('a hidden service returns 404 on its detail route', function () {
    Service::factory()->create([
        'slug' => ['es' => 'oculto-detalle', 'en' => 'hidden-detail'],
        'status' => ServiceStatus::Hidden->value,
        'is_active' => true,
        'is_detail_enabled' => true,
    ]);

    $this->get('/servicios/oculto-detalle')->assertNotFound();
});

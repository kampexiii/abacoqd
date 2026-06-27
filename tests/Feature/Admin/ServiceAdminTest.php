<?php

use App\Enums\ServiceStatus;
use App\Enums\UserRole;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public_uploads');
});

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
        'description' => [
            'es' => 'Descripción larga en español con contenido suficiente para activar la página individual.',
            'en' => 'Long English description with enough content to enable the individual page.',
        ],
        'icon' => 'code',
        'status' => ServiceStatus::Draft->value,
        'sort_order' => 10,
        'is_active' => true,
        'is_featured' => false,
        'show_on_home' => false,
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

test('creating a fourth featured service is rejected', function () {
    foreach (range(1, Service::MAX_FEATURED_ON_HOME) as $index) {
        Service::factory()->create([
            'slug' => ['es' => "destacado-{$index}", 'en' => "featured-{$index}"],
            'is_active' => true,
            'is_detail_enabled' => true,
            'is_featured' => true,
            'show_on_home' => true,
        ]);
    }

    $this->actingAs(adminUser());

    $this->post(
        route('admin.services.store'),
        validServicePayload(['is_detail_enabled' => true, 'is_featured' => true]),
    )->assertSessionHasErrors('is_featured');

    expect(Service::query()->where('is_featured', true)->count())->toBe(Service::MAX_FEATURED_ON_HOME)
        ->and(Service::query()->where('slug_es', 'servicio-nuevo')->exists())->toBeFalse();
});

test('editing one of the three featured services keeps it featured', function () {
    $service = Service::factory()->create([
        'slug' => ['es' => 'servicio-destacado', 'en' => 'featured-service'],
        'is_active' => true,
        'is_detail_enabled' => true,
        'is_featured' => true,
        'show_on_home' => true,
    ]);

    foreach (range(1, Service::MAX_FEATURED_ON_HOME - 1) as $index) {
        Service::factory()->create([
            'slug' => ['es' => "otro-destacado-{$index}", 'en' => "other-featured-{$index}"],
            'is_active' => true,
            'is_detail_enabled' => true,
            'is_featured' => true,
            'show_on_home' => true,
        ]);
    }

    $this->actingAs(adminUser());

    $this->put(
        route('admin.services.update', $service),
        validServicePayload([
            'title' => ['es' => 'Servicio destacado editado', 'en' => 'Edited featured service'],
            'slug' => ['es' => 'servicio-destacado', 'en' => 'featured-service'],
            'is_detail_enabled' => true,
            'is_featured' => true,
        ]),
    )->assertRedirect(route('admin.services.index'));

    expect($service->refresh()->is_featured)->toBeTrue()
        ->and(Service::query()->where('is_featured', true)->count())->toBe(Service::MAX_FEATURED_ON_HOME);
});

test('the quick featured toggle cannot exceed three services', function () {
    foreach (range(1, Service::MAX_FEATURED_ON_HOME) as $index) {
        Service::factory()->create([
            'slug' => ['es' => "destacado-toggle-{$index}", 'en' => "toggle-featured-{$index}"],
            'is_active' => true,
            'is_detail_enabled' => true,
            'is_featured' => true,
            'show_on_home' => true,
        ]);
    }

    $service = Service::factory()->create([
        'slug' => ['es' => 'servicio-sin-destacar', 'en' => 'not-featured-service'],
        'is_active' => true,
        'is_detail_enabled' => true,
        'is_featured' => false,
    ]);

    $this->actingAs(adminUser());

    $this->patch(route('admin.services.toggle-featured', $service))
        ->assertSessionHasErrors('is_featured');

    expect($service->refresh()->is_featured)->toBeFalse()
        ->and(Service::query()->where('is_featured', true)->count())->toBe(Service::MAX_FEATURED_ON_HOME);
});

test('an inactive service cannot be featured from the quick toggle', function () {
    $service = Service::factory()->create([
        'is_active' => false,
        'is_detail_enabled' => false,
        'is_featured' => false,
        'show_on_home' => false,
    ]);

    $this->actingAs(adminUser());

    $this->patch(route('admin.services.toggle-featured', $service))
        ->assertSessionHasErrors('is_featured');

    $service->refresh();

    expect($service->is_featured)->toBeFalse()
        ->and($service->show_on_home)->toBeFalse();
});

test('an inactive service cannot enable its individual page from the quick toggle', function () {
    $service = Service::factory()->create([
        'is_active' => false,
        'is_detail_enabled' => false,
    ]);

    $this->actingAs(adminUser());

    $this->patch(route('admin.services.toggle-detail', $service))
        ->assertSessionHasErrors('is_detail_enabled');

    expect($service->refresh()->is_detail_enabled)->toBeFalse();
});

test('deactivating a service clears dependent public visibility flags', function () {
    $service = Service::factory()->create([
        'is_active' => true,
        'is_detail_enabled' => true,
        'is_featured' => true,
        'show_on_home' => true,
    ]);

    $this->actingAs(adminUser());

    $this->patch(route('admin.services.toggle-active', $service));

    $service->refresh();

    expect($service->is_active)->toBeFalse()
        ->and($service->is_detail_enabled)->toBeFalse()
        ->and($service->is_featured)->toBeFalse()
        ->and($service->show_on_home)->toBeFalse();
});

test('disabling the individual page clears the landing featured flag', function () {
    $service = Service::factory()->create([
        'is_active' => true,
        'is_detail_enabled' => true,
        'is_featured' => true,
        'show_on_home' => true,
    ]);

    $this->actingAs(adminUser());

    $this->patch(route('admin.services.toggle-detail', $service));

    $service->refresh();

    expect($service->is_detail_enabled)->toBeFalse()
        ->and($service->is_featured)->toBeFalse()
        ->and($service->show_on_home)->toBeFalse();
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

test('uploading an image stores it as webp under the service slug', function () {
    if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
        $this->markTestSkipped('GD con soporte WebP no disponible.');
    }

    $this->actingAs(adminUser());

    $this->post(route('admin.services.store'), validServicePayload([
        'image' => UploadedFile::fake()->image('foto.png', 64, 64),
    ]))->assertRedirect(route('admin.services.index'));

    $service = Service::query()->where('slug_es', 'servicio-nuevo')->firstOrFail();

    expect($service->image)->toBe('/uploads/services/servicio-nuevo.webp');

    Storage::disk('public_uploads')->assertExists('services/servicio-nuevo.webp');
});

test('uploading a new image while renaming the slug deletes the previous file', function () {
    if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
        $this->markTestSkipped('GD con soporte WebP no disponible.');
    }

    Storage::disk('public_uploads')->put('services/servicio-original.webp', 'bytes');

    $service = Service::factory()->create([
        'slug' => ['es' => 'servicio-original', 'en' => 'original-service'],
        'image' => '/uploads/services/servicio-original.webp',
    ]);

    $this->actingAs(adminUser());

    $this->put(
        route('admin.services.update', $service),
        validServicePayload([
            'slug' => ['es' => 'servicio-renombrado', 'en' => 'renamed-service'],
            'image' => UploadedFile::fake()->image('nueva.png', 64, 64),
        ]),
    )->assertRedirect(route('admin.services.index'));

    expect($service->refresh()->image)->toBe('/uploads/services/servicio-renombrado.webp');

    Storage::disk('public_uploads')->assertExists('services/servicio-renombrado.webp');
    Storage::disk('public_uploads')->assertMissing('services/servicio-original.webp');
});

test('removing the image clears the field and deletes the file', function () {
    Storage::disk('public_uploads')->put('services/servicio-original.webp', 'bytes');

    $service = Service::factory()->create([
        'slug' => ['es' => 'servicio-original', 'en' => 'original-service'],
        'image' => '/uploads/services/servicio-original.webp',
    ]);

    $this->actingAs(adminUser());

    $this->put(
        route('admin.services.update', $service),
        validServicePayload([
            'slug' => ['es' => 'servicio-original', 'en' => 'original-service'],
            'remove_image' => true,
        ]),
    )->assertRedirect(route('admin.services.index'));

    Storage::disk('public_uploads')->assertMissing('services/servicio-original.webp');

    expect($service->refresh()->image)->toBeNull();
});

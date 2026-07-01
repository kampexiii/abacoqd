<?php

use App\Enums\PartnerType;
use App\Enums\PermissionStatus;
use App\Enums\ProjectStatus;
use App\Models\Partner;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
        $this->markTestSkipped('GD con soporte WebP no disponible.');
    }

    Storage::fake('public_uploads');
});

function uploadSecurityPartnerPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Acme Security',
        'slug' => 'acme-security',
        'type' => PartnerType::Other->value,
        'logo_alt' => null,
        'permission_status' => PermissionStatus::Approved->value,
        'sort_order' => 1,
    ], $overrides);
}

function uploadSecurityProjectPayload(array $overrides = []): array
{
    return array_merge([
        'title' => ['es' => 'Proyecto seguridad', 'en' => null],
        'slug' => ['es' => 'proyecto-seguridad', 'en' => null],
        'summary' => ['es' => null, 'en' => null],
        'status' => ProjectStatus::Draft->value,
        'sort_order' => 10,
        'is_active' => true,
        'show_on_home' => false,
        'show_in_projects' => true,
        'show_in_collaborations' => false,
    ], $overrides);
}

test('un PHP renombrado como .png no pasa la validación de imagen de un servicio', function () {
    // UploadedFile::fake() reporta el MIME a partir del nombre de archivo
    // (es un stub de test), no del contenido real. Para probar la defensa
    // real contra "extensión falsa" hay que pasar por la detección de MIME
    // por contenido (fileinfo) que usa Symfony en una subida real: se
    // construye un UploadedFile de verdad sobre un archivo temporal con
    // contenido PHP y nombre .png, en modo `test` (sin pasar por
    // is_uploaded_file(), pero con MIME real vía fileinfo).
    $tmpPath = tempnam(sys_get_temp_dir(), 'shell');
    file_put_contents($tmpPath, '<?php echo "pwned"; ?>');
    $shell = new UploadedFile($tmpPath, 'shell.png', null, null, true);

    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->post(route('admin.services.store'), [
        'title' => ['es' => 'Servicio', 'en' => null],
        'slug' => ['es' => 'servicio-shell', 'en' => null],
        'summary' => ['es' => 'Resumen', 'en' => null],
        'status' => 'draft',
        'sort_order' => 1,
        'is_active' => true,
        'is_detail_enabled' => false,
        'image' => $shell,
    ])->assertSessionHasErrors('image');

    expect(Service::query()->where('slug_es', 'servicio-shell')->exists())->toBeFalse();
    Storage::disk('public_uploads')->assertMissing('services/servicio-shell.webp');
});

test('un logo SVG con script se rechaza y no se guarda nada', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->post(route('admin.partners.store'), uploadSecurityPartnerPayload([
        'logo' => UploadedFile::fake()->createWithContent(
            'logo.svg',
            '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
        ),
    ]))->assertSessionHasErrors('logo');

    expect(Partner::query()->where('slug', 'acme-security')->first()?->logo)->toBeNull();
    Storage::disk('public_uploads')->assertDirectoryEmpty('partners');
});

test('un logo SVG con onload se rechaza', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->post(route('admin.partners.store'), uploadSecurityPartnerPayload([
        'logo' => UploadedFile::fake()->createWithContent(
            'logo.svg',
            '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect width="1" height="1"/></svg>',
        ),
    ]))->assertSessionHasErrors('logo');

    Storage::disk('public_uploads')->assertDirectoryEmpty('partners');
});

test('un logo SVG con javascript: en xlink:href se rechaza', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->post(route('admin.partners.store'), uploadSecurityPartnerPayload([
        'logo_dark' => UploadedFile::fake()->createWithContent(
            'logo-dark.svg',
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="javascript:alert(1)"><rect width="1" height="1"/></a></svg>',
        ),
    ]))->assertSessionHasErrors('logo_dark');

    Storage::disk('public_uploads')->assertDirectoryEmpty('partners');
});

test('un logo de proyecto en SVG con referencia externa se rechaza', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->post(route('admin.projects.store'), uploadSecurityProjectPayload([
        'logo' => UploadedFile::fake()->createWithContent(
            'logo.svg',
            '<svg xmlns="http://www.w3.org/2000/svg"><image href="https://evil.example/tracker.png"/></svg>',
        ),
    ]))->assertSessionHasErrors('logo');

    Storage::disk('public_uploads')->assertDirectoryEmpty('projects');
});

test('un logo SVG benigno se acepta y se guarda tal cual', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->post(route('admin.partners.store'), uploadSecurityPartnerPayload([
        'logo' => UploadedFile::fake()->createWithContent(
            'logo.svg',
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#000"/></svg>',
        ),
    ]))->assertRedirect(route('admin.partners.index'));

    $partner = Partner::query()->where('slug', 'acme-security')->firstOrFail();

    expect($partner->logo)->toBe('/uploads/partners/acme-security-logo.svg');
    Storage::disk('public_uploads')->assertExists('partners/acme-security-logo.svg');
    Storage::disk('public_uploads')->assertMissing('partners/acme-security-logo.webp');
    Storage::disk('public_uploads')->assertMissing('partners/acme-security-logo-320w.webp');
});

test('un logo por encima del límite de tamaño se rechaza', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->post(route('admin.partners.store'), uploadSecurityPartnerPayload([
        'logo' => UploadedFile::fake()->image('grande.png', 10, 10)->size(3000),
    ]))->assertSessionHasErrors('logo');

    Storage::disk('public_uploads')->assertDirectoryEmpty('partners');
});

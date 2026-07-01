<?php

use App\Enums\PartnerType;
use App\Enums\PermissionStatus;
use App\Models\Partner;
use App\Models\Service;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
        $this->markTestSkipped('GD con soporte WebP no disponible.');
    }

    Storage::fake('public_uploads');
});

function putResponsiveBackfillWebpImage(string $relativePath, int $width, int $height): void
{
    $image = imagecreatetruecolor($width, $height);

    if ($image === false) {
        throw new RuntimeException('No se pudo crear la imagen de prueba.');
    }

    $color = imagecolorallocate($image, 24, 183, 176);

    if ($color !== false) {
        imagefilledrectangle($image, 0, 0, $width, $height, $color);
    }

    ob_start();
    $converted = imagewebp($image, null, 88);
    $contents = ob_get_clean();
    imagedestroy($image);

    if (! $converted || ! is_string($contents) || $contents === '') {
        throw new RuntimeException('No se pudo generar la imagen WebP de prueba.');
    }

    Storage::disk('public_uploads')->put($relativePath, $contents);
}

test('the responsive variants backfill command exists and dry-run does not create files', function () {
    Service::factory()->create([
        'image' => '/uploads/services/legacy.webp',
    ]);
    putResponsiveBackfillWebpImage('services/legacy.webp', 1400, 900);

    $this->artisan('media:generate-responsive-variants', ['--dry-run' => true])
        ->assertSuccessful();

    Storage::disk('public_uploads')->assertExists('services/legacy.webp');
    Storage::disk('public_uploads')->assertMissing('services/legacy-480w.webp');
    Storage::disk('public_uploads')->assertMissing('services/legacy-1280w.webp');
});

test('the responsive variants backfill command creates missing variants', function () {
    Service::factory()->create([
        'image' => '/uploads/services/legacy.webp',
    ]);
    putResponsiveBackfillWebpImage('services/legacy.webp', 1400, 900);

    $this->artisan('media:generate-responsive-variants')->assertSuccessful();

    Storage::disk('public_uploads')->assertExists('services/legacy-480w.webp');
    Storage::disk('public_uploads')->assertExists('services/legacy-640w.webp');
    Storage::disk('public_uploads')->assertExists('services/legacy-960w.webp');
    Storage::disk('public_uploads')->assertExists('services/legacy-1280w.webp');
});

test('the responsive variants backfill command is idempotent and keeps existing variants', function () {
    Service::factory()->create([
        'image' => '/uploads/services/legacy.webp',
    ]);
    putResponsiveBackfillWebpImage('services/legacy.webp', 1400, 900);
    Storage::disk('public_uploads')->put('services/legacy-480w.webp', 'existing-variant');

    $this->artisan('media:generate-responsive-variants')->assertSuccessful();
    $filesAfterFirstRun = Storage::disk('public_uploads')->allFiles('services');

    $this->artisan('media:generate-responsive-variants')->assertSuccessful();

    expect(Storage::disk('public_uploads')->get('services/legacy-480w.webp'))->toBe('existing-variant')
        ->and(Storage::disk('public_uploads')->allFiles('services'))->toBe($filesAfterFirstRun);
});

test('the responsive variants backfill command skips svg logos', function () {
    Partner::factory()->create([
        'name' => 'Acme',
        'slug' => 'acme',
        'type' => PartnerType::Other->value,
        'permission_status' => PermissionStatus::Approved->value,
        'logo' => '/uploads/partners/acme-logo.svg',
    ]);
    Storage::disk('public_uploads')->put(
        'partners/acme-logo.svg',
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24"/></svg>',
    );

    $this->artisan('media:generate-responsive-variants')->assertSuccessful();

    Storage::disk('public_uploads')->assertExists('partners/acme-logo.svg');
    Storage::disk('public_uploads')->assertMissing('partners/acme-logo-320w.webp');
    Storage::disk('public_uploads')->assertMissing('partners/acme-logo.webp');
});

test('the responsive variants backfill command does not create variants at or above original width', function () {
    Service::factory()->create([
        'image' => '/uploads/services/small.webp',
    ]);
    putResponsiveBackfillWebpImage('services/small.webp', 640, 400);

    $this->artisan('media:generate-responsive-variants')->assertSuccessful();

    Storage::disk('public_uploads')->assertExists('services/small-480w.webp');
    Storage::disk('public_uploads')->assertMissing('services/small-640w.webp');
    Storage::disk('public_uploads')->assertMissing('services/small-960w.webp');
    Storage::disk('public_uploads')->assertMissing('services/small-1280w.webp');
});

test('the responsive variants backfill command ignores missing sources and does not modify database rows', function () {
    $service = Service::factory()->create([
        'image' => '/uploads/services/missing.webp',
    ]);
    $before = $service->refresh()->getAttributes();

    $this->artisan('media:generate-responsive-variants')->assertSuccessful();

    Storage::disk('public_uploads')->assertMissing('services/missing-480w.webp');
    expect($service->refresh()->getAttributes())->toBe($before);
});

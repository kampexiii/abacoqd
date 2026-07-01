<?php

use App\Support\Media\ImageVariantService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
        $this->markTestSkipped('GD con soporte WebP no disponible.');
    }

    Storage::fake('public_uploads');
});

test('raster uploads create a main webp and responsive variants', function () {
    $result = (new ImageVariantService)->storeFromPath(
        UploadedFile::fake()->image('servicio.png', 1400, 900),
        'services',
        'servicio',
        ImageVariantService::SERVICE_WIDTHS,
    );

    expect($result['path'])->toBe('/uploads/services/servicio.webp')
        ->and($result['variants'])->toBe([
            '/uploads/services/servicio-480w.webp',
            '/uploads/services/servicio-640w.webp',
            '/uploads/services/servicio-960w.webp',
            '/uploads/services/servicio-1280w.webp',
        ]);

    Storage::disk('public_uploads')->assertExists('services/servicio.webp');

    foreach ([480, 640, 960, 1280] as $width) {
        $path = "services/servicio-{$width}w.webp";

        Storage::disk('public_uploads')->assertExists($path);
        expect(getimagesize(Storage::disk('public_uploads')->path($path))[0])->toBe($width);
    }
});

test('variants are not generated at or above the original width', function () {
    (new ImageVariantService)->storeFromPath(
        UploadedFile::fake()->image('servicio.png', 640, 400),
        'services',
        'servicio',
        ImageVariantService::SERVICE_WIDTHS,
    );

    Storage::disk('public_uploads')->assertExists('services/servicio-480w.webp');
    Storage::disk('public_uploads')->assertMissing('services/servicio-640w.webp');
    Storage::disk('public_uploads')->assertMissing('services/servicio-960w.webp');
    Storage::disk('public_uploads')->assertMissing('services/servicio-1280w.webp');
});

test('small raster logos are optimized without pointless variants', function () {
    (new ImageVariantService)->storeFromPath(
        UploadedFile::fake()->image('logo.png', 240, 80),
        'partners',
        'acme-logo',
        ImageVariantService::LOGO_WIDTHS,
        allowSvg: true,
    );

    Storage::disk('public_uploads')->assertExists('partners/acme-logo.webp');
    Storage::disk('public_uploads')->assertMissing('partners/acme-logo-320w.webp');
    Storage::disk('public_uploads')->assertMissing('partners/acme-logo-640w.webp');
});

test('deleting a public image path also deletes associated variants', function () {
    Storage::disk('public_uploads')->put('services/servicio.webp', 'main');
    Storage::disk('public_uploads')->put('services/servicio-480w.webp', 'variant');
    Storage::disk('public_uploads')->put('services/servicio-1280w.webp', 'variant');
    Storage::disk('public_uploads')->put('services/otro-480w.webp', 'keep');

    (new ImageVariantService)->deletePublicPath('/uploads/services/servicio.webp');

    Storage::disk('public_uploads')->assertMissing('services/servicio.webp');
    Storage::disk('public_uploads')->assertMissing('services/servicio-480w.webp');
    Storage::disk('public_uploads')->assertMissing('services/servicio-1280w.webp');
    Storage::disk('public_uploads')->assertExists('services/otro-480w.webp');
});

test('benign svg logos are kept as svg without raster variants', function () {
    $result = (new ImageVariantService)->storeFromPath(
        UploadedFile::fake()->createWithContent(
            'logo.svg',
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24"/></svg>',
        ),
        'partners',
        'acme-logo',
        ImageVariantService::LOGO_WIDTHS,
        allowSvg: true,
    );

    expect($result)->toBe([
        'path' => '/uploads/partners/acme-logo.svg',
        'variants' => [],
    ]);

    Storage::disk('public_uploads')->assertExists('partners/acme-logo.svg');
    Storage::disk('public_uploads')->assertMissing('partners/acme-logo.webp');
    Storage::disk('public_uploads')->assertMissing('partners/acme-logo-320w.webp');
});

test('malicious svg logos are rejected by the storage service too', function () {
    expect(fn () => (new ImageVariantService)->storeFromPath(
        UploadedFile::fake()->createWithContent(
            'logo.svg',
            '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
        ),
        'partners',
        'acme-logo',
        ImageVariantService::LOGO_WIDTHS,
        allowSvg: true,
    ))->toThrow(InvalidArgumentException::class);

    Storage::disk('public_uploads')->assertDirectoryEmpty('partners');
});

test('listing existing variants ignores missing files', function () {
    Storage::disk('public_uploads')->put('services/servicio.webp', 'main');
    Storage::disk('public_uploads')->put('services/servicio-480w.webp', 'variant');

    $variants = (new ImageVariantService)->existingVariants(
        '/uploads/services/servicio.webp',
        [480, 640],
    );

    expect($variants)->toBe([
        ['width' => 480, 'src' => '/uploads/services/servicio-480w.webp'],
    ]);
});

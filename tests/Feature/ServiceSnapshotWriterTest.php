<?php

use App\Models\Service;
use App\Services\Content\ServiceSnapshotWriter;

function snapshotTestPath(): string
{
    return storage_path('framework/testing/services-snapshot-test.php');
}

afterEach(function () {
    $path = snapshotTestPath();

    if (is_file($path)) {
        unlink($path);
    }
});

test('write() dumps active services ordered by sort_order to the given path', function () {
    Service::factory()->create([
        'slug' => ['es' => 'segundo', 'en' => 'second'],
        'sort_order' => 2,
        'image' => '/uploads/services/segundo.webp',
    ]);
    Service::factory()->create([
        'slug' => ['es' => 'primero', 'en' => 'first'],
        'sort_order' => 1,
    ]);

    $path = snapshotTestPath();
    (new ServiceSnapshotWriter($path))->write();

    expect(is_file($path))->toBeTrue();

    $services = require $path;

    expect($services)->toBeArray()
        ->and($services)->toHaveCount(2)
        ->and($services[0]['slug']['es'])->toBe('primero')
        ->and($services[1]['slug']['es'])->toBe('segundo')
        ->and($services[1]['image'])->toBe('/uploads/services/segundo.webp');
});

test('write() does not touch the real snapshot file while running tests', function () {
    Service::factory()->create();

    $defaultPath = database_path('seeders/snapshots/services.generated.php');
    $existedBefore = is_file($defaultPath);
    $contentsBefore = $existedBefore ? file_get_contents($defaultPath) : null;

    (new ServiceSnapshotWriter)->write();

    expect(is_file($defaultPath))->toBe($existedBefore);

    if ($existedBefore) {
        expect(file_get_contents($defaultPath))->toBe($contentsBefore);
    }
});

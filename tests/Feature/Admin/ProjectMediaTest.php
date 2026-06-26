<?php

use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
        $this->markTestSkipped('GD con soporte WebP no disponible.');
    }

    Storage::fake('public_uploads');
});

function projectMediaPayload(array $overrides = []): array
{
    return array_merge([
        'title' => ['es' => 'Proyecto test', 'en' => null],
        'slug' => ['es' => 'proyecto-test', 'en' => null],
        'summary' => ['es' => null, 'en' => null],
        'status' => ProjectStatus::Draft->value,
        'sort_order' => 10,
        'is_active' => true,
        'show_on_home' => false,
        'show_in_projects' => true,
        'show_in_collaborations' => false,
    ], $overrides);
}

test('una sola imagen de proyecto alimenta portada y miniatura con la misma ruta', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->post(route('admin.projects.store'), projectMediaPayload([
        'cover_image' => UploadedFile::fake()->image('foto.png', 48, 48),
    ]))->assertRedirect(route('admin.projects.index'));

    $project = Project::query()->where('slug_es', 'proyecto-test')->firstOrFail();

    expect($project->cover_image)->toBe('/uploads/projects/proyecto-test-cover.webp')
        ->and($project->thumbnail_image)->toBe($project->cover_image);

    Storage::disk('public_uploads')->assertExists('projects/proyecto-test-cover.webp');
});

test('los logos de cliente se guardan como rutas WebP, no como binarios', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->post(route('admin.projects.store'), projectMediaPayload([
        'logo' => UploadedFile::fake()->image('logo.png', 48, 48),
        'logo_dark' => UploadedFile::fake()->image('logo-dark.png', 48, 48),
        'logo_alt' => 'Logo de Acme',
    ]))->assertRedirect(route('admin.projects.index'));

    $project = Project::query()->where('slug_es', 'proyecto-test')->firstOrFail();

    expect($project->logo)->toBe('/uploads/projects/proyecto-test-logo.webp')
        ->and($project->logo_dark)->toBe('/uploads/projects/proyecto-test-logo-dark.webp')
        ->and($project->logo_alt)->toBe('Logo de Acme');

    Storage::disk('public_uploads')->assertExists('projects/proyecto-test-logo.webp');
    Storage::disk('public_uploads')->assertExists('projects/proyecto-test-logo-dark.webp');
});

test('quitar la imagen del proyecto limpia portada y miniatura', function () {
    Storage::disk('public_uploads')->put('projects/acme-cover.webp', 'bytes');

    $project = Project::factory()->create([
        'slug' => ['es' => 'acme', 'en' => null],
        'cover_image' => '/uploads/projects/acme-cover.webp',
        'thumbnail_image' => '/uploads/projects/acme-cover.webp',
    ]);

    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->put(route('admin.projects.update', $project), projectMediaPayload([
        'slug' => ['es' => 'acme', 'en' => null],
        'remove_cover_image' => true,
    ]))->assertRedirect(route('admin.projects.index'));

    Storage::disk('public_uploads')->assertMissing('projects/acme-cover.webp');

    $project->refresh();
    expect($project->cover_image)->toBeNull()
        ->and($project->thumbnail_image)->toBeNull();
});

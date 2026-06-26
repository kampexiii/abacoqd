<?php

use App\Enums\PermissionStatus;
use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\Service;
use Database\Seeders\ConfirmedProjectsSeeder;
use Database\Seeders\ServiceSeeder;

function publishedProject(array $overrides = []): Project
{
    return Project::factory()->create(array_merge([
        'slug' => ['es' => 'caso-demo', 'en' => 'demo-case'],
        'status' => ProjectStatus::Published->value,
        'permission_status' => PermissionStatus::Approved->value,
        'is_active' => true,
        'show_in_projects' => true,
        'client_name' => 'Cliente Demo S.L.',
    ], $overrides));
}

test('un proyecto puede asociarse a servicios', function () {
    $project = publishedProject();
    $services = Service::factory()->count(2)->create();

    $project->services()->sync($services->pluck('id')->all());

    expect($project->services()->count())->toBe(2);
});

test('borrar un servicio limpia la relación sin romper el proyecto', function () {
    $project = publishedProject();
    $service = Service::factory()->create();

    $project->services()->sync([$service->id]);
    $service->delete();

    $project->refresh();
    expect(Project::query()->whereKey($project->id)->exists())->toBeTrue()
        ->and($project->services()->count())->toBe(0);
});

test('el seeder asocia CIETE a servicios reales existentes sin IDs hardcodeados', function () {
    $this->seed(ServiceSeeder::class);
    $this->seed(ConfirmedProjectsSeeder::class);

    $ciete = Project::query()
        ->where('slug_es', 'erp-ciete-gestion-interna-trabajos-pedidos-facturacion')
        ->firstOrFail();

    $slugs = $ciete->services->map(fn (Service $service): mixed => $service->slug_es)->all();

    expect($ciete->services()->count())->toBe(3)
        ->and($slugs)->toContain('aplicaciones-a-medida')
        ->and($slugs)->toContain('crm-datos-y-procesos')
        ->and($slugs)->toContain('integraciones-digitales');
});

test('el detalle público expone servicios y modo de desarrollo, sin campos internos ni roles', function () {
    $project = publishedProject();
    $services = Service::factory()->count(2)->create();
    $project->services()->sync($services->pluck('id')->all());

    $this->get('/proyectos/caso-demo')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Public/ProjectDetail')
            ->has('project.services', 2)
            ->where('project.developmentMode', 'solo')
            ->where('project.clientName', 'Cliente Demo S.L.')
            ->missing('project.permissionStatus')
            ->missing('project.isApproved')
            ->missing('project.permissionNotes'));
});

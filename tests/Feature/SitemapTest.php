<?php

use App\Enums\PermissionStatus;
use App\Enums\PostStatus;
use App\Enums\ProjectStatus;
use App\Enums\ServiceStatus;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;

test('GET /sitemap.xml responde 200 con content-type XML', function () {
    $response = $this->get('/sitemap.xml');

    $response->assertOk();
    expect($response->headers->get('Content-Type'))->toContain('xml');
});

test('incluye las URLs públicas estáticas como locs absolutas ES', function () {
    $body = (string) $this->get('/sitemap.xml')->getContent();

    expect($body)->toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    foreach ([
        'https://abacoqd.com/',
        'https://abacoqd.com/metodologia',
        'https://abacoqd.com/servicios',
        'https://abacoqd.com/proyectos',
        'https://abacoqd.com/quienes-somos',
        'https://abacoqd.com/blog',
        'https://abacoqd.com/contacto',
        'https://abacoqd.com/reserva',
        'https://abacoqd.com/aviso-legal',
        'https://abacoqd.com/privacidad',
        'https://abacoqd.com/cookies',
    ] as $loc) {
        expect($body)->toContain('<loc>'.$loc.'</loc>');
    }
});

test('incluye un servicio publicado/activo/con detalle y excluye los demás', function () {
    Service::factory()->create([
        'status' => ServiceStatus::Published->value,
        'is_active' => true,
        'is_detail_enabled' => true,
        'slug' => ['es' => 'servicio-visible', 'en' => 'visible-service'],
    ]);

    Service::factory()->create([
        'status' => ServiceStatus::Published->value,
        'is_active' => true,
        'is_detail_enabled' => false,
        'slug' => ['es' => 'servicio-sin-detalle', 'en' => 'service-no-detail'],
    ]);

    Service::factory()->create([
        'status' => ServiceStatus::Draft->value,
        'is_active' => true,
        'is_detail_enabled' => true,
        'slug' => ['es' => 'servicio-borrador', 'en' => 'service-draft'],
    ]);

    Service::factory()->create([
        'status' => ServiceStatus::Published->value,
        'is_active' => false,
        'is_detail_enabled' => true,
        'slug' => ['es' => 'servicio-inactivo', 'en' => 'service-inactive'],
    ]);

    $body = (string) $this->get('/sitemap.xml')->getContent();

    expect($body)
        ->toContain('<loc>https://abacoqd.com/servicios/servicio-visible</loc>')
        ->not->toContain('servicio-sin-detalle')
        ->not->toContain('servicio-borrador')
        ->not->toContain('servicio-inactivo');
});

test('incluye un proyecto publicado/publicable y excluye los demás', function () {
    Project::factory()->create([
        'status' => ProjectStatus::Published->value,
        'is_active' => true,
        'show_in_projects' => true,
        'permission_status' => PermissionStatus::Approved->value,
        'slug' => ['es' => 'proyecto-visible', 'en' => 'visible-project'],
    ]);

    Project::factory()->create([
        'status' => ProjectStatus::Published->value,
        'is_active' => true,
        'show_in_projects' => true,
        'permission_status' => PermissionStatus::Pending->value,
        'settings' => null,
        'slug' => ['es' => 'proyecto-no-publicable', 'en' => 'non-listable-project'],
    ]);

    Project::factory()->create([
        'status' => ProjectStatus::Draft->value,
        'is_active' => true,
        'show_in_projects' => true,
        'permission_status' => PermissionStatus::Approved->value,
        'slug' => ['es' => 'proyecto-borrador', 'en' => 'draft-project'],
    ]);

    $body = (string) $this->get('/sitemap.xml')->getContent();

    expect($body)
        ->toContain('<loc>https://abacoqd.com/proyectos/proyecto-visible</loc>')
        ->not->toContain('proyecto-no-publicable')
        ->not->toContain('proyecto-borrador');
});

test('incluye post publicado y programado vencido, excluye borrador y programado futuro', function () {
    Post::factory()->create([
        'status' => PostStatus::Published->value,
        'published_at' => now()->subDay(),
        'slug' => ['es' => 'post-publicado', 'en' => 'published-post'],
    ]);

    Post::factory()->create([
        'status' => PostStatus::Scheduled->value,
        'published_at' => now()->subMinutes(5),
        'slug' => ['es' => 'post-programado-vencido', 'en' => 'scheduled-due-post'],
    ]);

    Post::factory()->create([
        'status' => PostStatus::Draft->value,
        'published_at' => null,
        'slug' => ['es' => 'post-borrador', 'en' => 'draft-post'],
    ]);

    Post::factory()->create([
        'status' => PostStatus::Scheduled->value,
        'published_at' => now()->addDay(),
        'slug' => ['es' => 'post-programado-futuro', 'en' => 'scheduled-future-post'],
    ]);

    $body = (string) $this->get('/sitemap.xml')->getContent();

    expect($body)
        ->toContain('<loc>https://abacoqd.com/blog/post-publicado</loc>')
        ->toContain('<loc>https://abacoqd.com/blog/post-programado-vencido</loc>')
        ->not->toContain('post-borrador')
        ->not->toContain('post-programado-futuro');
});

test('no incluye rutas privadas, de auth ni de idioma EN', function () {
    $body = (string) $this->get('/sitemap.xml')->getContent();

    foreach ([
        '/admin',
        '/dashboard',
        '/settings',
        '/login',
        '/register',
        '/en/',
        'hreflang',
    ] as $needle) {
        expect($body)->not->toContain($needle);
    }
});

test('robots.txt referencia el sitemap', function () {
    $contents = file_get_contents(public_path('robots.txt'));

    expect($contents)->not->toBeFalse();
    expect((string) $contents)->toContain('Sitemap: https://abacoqd.com/sitemap.xml');
});

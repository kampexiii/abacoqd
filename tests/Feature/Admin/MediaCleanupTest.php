<?php

use App\Enums\PartnerType;
use App\Enums\PermissionStatus;
use App\Enums\ServiceStatus;
use App\Models\Partner;
use App\Models\Service;
use App\Models\TeamMember;
use App\Models\User;
use App\Services\Media\TeamMemberPhotoService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
        $this->markTestSkipped('GD con soporte WebP no disponible.');
    }

    Storage::fake('public_uploads');
});

function servicePayloadWithoutImage(array $overrides = []): array
{
    return array_merge([
        'title' => ['es' => 'Servicio', 'en' => 'Service'],
        'slug' => ['es' => 'servicio', 'en' => 'service'],
        'summary' => ['es' => 'Resumen.', 'en' => 'Summary.'],
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

function partnerPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Acme',
        'slug' => 'acme',
        'type' => PartnerType::Other->value,
        'logo_alt' => null,
        'permission_status' => PermissionStatus::Pending->value,
        'sort_order' => 1,
    ], $overrides);
}

function teamMemberMediaPayload(TeamMember $member, array $overrides = []): array
{
    return array_merge([
        'name' => $member->name,
        'slug' => $member->slug,
        'role' => ['es' => null, 'en' => null],
        'bio' => ['es' => null, 'en' => null],
        'sort_order' => $member->sort_order,
        'is_visible' => false,
        'is_active' => true,
    ], $overrides);
}

test('removing a service image deletes the underlying file', function () {
    Storage::disk('public_uploads')->put('services/servicio.webp', 'bytes');
    Storage::disk('public_uploads')->put('services/servicio-480w.webp', 'bytes');
    Storage::disk('public_uploads')->put('services/servicio-960w.webp', 'bytes');

    $service = Service::factory()->create([
        'slug' => ['es' => 'servicio', 'en' => 'service'],
        'image' => '/uploads/services/servicio.webp',
    ]);

    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->put(route('admin.services.update', $service), servicePayloadWithoutImage([
        'remove_image' => true,
    ]))->assertRedirect(route('admin.services.index'));

    Storage::disk('public_uploads')->assertMissing('services/servicio.webp');
    Storage::disk('public_uploads')->assertMissing('services/servicio-480w.webp');
    Storage::disk('public_uploads')->assertMissing('services/servicio-960w.webp');
    expect($service->refresh()->image)->toBeNull();
});

test('replacing an SVG partner logo with a raster image deletes the old SVG', function () {
    Storage::disk('public_uploads')->put('partners/acme-logo.svg', '<svg></svg>');

    $partner = Partner::factory()->create([
        'slug' => 'acme',
        'logo' => '/uploads/partners/acme-logo.svg',
    ]);

    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->put(route('admin.partners.update', $partner), partnerPayload([
        'logo' => UploadedFile::fake()->image('nuevo.png', 16, 16),
    ]))->assertRedirect(route('admin.partners.index'));

    Storage::disk('public_uploads')->assertMissing('partners/acme-logo.svg');
    Storage::disk('public_uploads')->assertExists('partners/acme-logo.webp');

    expect($partner->refresh()->logo)->toBe('/uploads/partners/acme-logo.webp');
});

test('replacing a team member photo removes the previously stored file', function () {
    Storage::disk('public_uploads')->put('team-members/legacy.webp', 'old-bytes');
    Storage::disk('public_uploads')->put('team-members/legacy-320w.webp', 'old-bytes');
    Storage::disk('public_uploads')->put('team-members/legacy-512w.webp', 'old-bytes');

    $member = TeamMember::factory()->create([
        'slug' => 'pablo',
        'photo' => '/uploads/team-members/legacy.webp',
    ]);

    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->put(route('admin.team-members.update', $member), teamMemberMediaPayload($member, [
        'photo' => UploadedFile::fake()->image('nueva.png', 900, 1100),
    ]))->assertRedirect(route('admin.team-members.index'));

    Storage::disk('public_uploads')->assertMissing('team-members/legacy.webp');
    Storage::disk('public_uploads')->assertMissing('team-members/legacy-320w.webp');
    Storage::disk('public_uploads')->assertMissing('team-members/legacy-512w.webp');
    Storage::disk('public_uploads')->assertExists('team-members/pablo.webp');
    Storage::disk('public_uploads')->assertExists('team-members/pablo-320w.webp');
    Storage::disk('public_uploads')->assertExists('team-members/pablo-512w.webp');
    Storage::disk('public_uploads')->assertExists('team-members/pablo-768w.webp');
    expect($member->refresh()->photo)->toBe('/uploads/team-members/pablo.webp');
});

test('removing a team member photo deletes the file and clears the column', function () {
    Storage::disk('public_uploads')->put('team-members/pablo.webp', 'bytes');
    Storage::disk('public_uploads')->put('team-members/pablo-320w.webp', 'bytes');
    Storage::disk('public_uploads')->put('team-members/pablo-512w.webp', 'bytes');

    $member = TeamMember::factory()->create([
        'slug' => 'pablo',
        'photo' => '/uploads/team-members/pablo.webp',
    ]);

    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->put(route('admin.team-members.update', $member), teamMemberMediaPayload($member, [
        'remove_photo' => true,
    ]))->assertRedirect(route('admin.team-members.index'));

    Storage::disk('public_uploads')->assertMissing('team-members/pablo.webp');
    Storage::disk('public_uploads')->assertMissing('team-members/pablo-320w.webp');
    Storage::disk('public_uploads')->assertMissing('team-members/pablo-512w.webp');
    expect($member->refresh()->photo)->toBeNull();
});

test('public uploads cleanup ignores external URLs and paths outside the uploads disk', function () {
    Storage::disk('public_uploads')->put('team-members/keep.webp', 'keep');

    $cleanup = new TeamMemberPhotoService;

    $cleanup->delete(null);
    $cleanup->delete('');
    $cleanup->delete('https://cdn.example.com/avatar.png');
    $cleanup->delete('/storage/app/private/secret.pdf');

    Storage::disk('public_uploads')->assertExists('team-members/keep.webp');
});

test('public uploads cleanup ignores path traversal attempts', function () {
    Storage::disk('public_uploads')->put('team-members/keep.webp', 'keep');

    (new TeamMemberPhotoService)->delete('/uploads/../secret.pdf');

    Storage::disk('public_uploads')->assertExists('team-members/keep.webp');
});

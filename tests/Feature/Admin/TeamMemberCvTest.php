<?php

use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public_uploads');
});

function teamMemberPayload(TeamMember $member, array $overrides = []): array
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

test('uploading a team member cv stores it as a flat file, not nested in a directory named after it', function () {
    $member = TeamMember::factory()->create(['slug' => 'pablo-test', 'cv_path' => null]);

    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->put(route('admin.team-members.update', $member), teamMemberPayload($member, [
        'cv' => UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf'),
    ]))->assertRedirect(route('admin.team-members.index'));

    Storage::disk('public_uploads')->assertExists('team-members-cv/pablo-test.pdf');
    expect(is_file(Storage::disk('public_uploads')->path('team-members-cv/pablo-test.pdf')))->toBeTrue();
    expect($member->refresh()->cv_path)->toBe('/uploads/team-members-cv/pablo-test.pdf');
});

test('replacing a team member cv deletes the previous file', function () {
    Storage::disk('public_uploads')->put('team-members-cv/pablo-test.pdf', 'old-bytes');

    $member = TeamMember::factory()->create([
        'slug' => 'pablo-test',
        'cv_path' => '/uploads/team-members-cv/pablo-test.pdf',
    ]);

    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->put(route('admin.team-members.update', $member), teamMemberPayload($member, [
        'cv' => UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf'),
    ]))->assertRedirect(route('admin.team-members.index'));

    Storage::disk('public_uploads')->assertExists('team-members-cv/pablo-test.pdf');
    expect($member->refresh()->cv_path)->toBe('/uploads/team-members-cv/pablo-test.pdf');
});

test('removing a team member cv deletes the file and clears the path', function () {
    Storage::disk('public_uploads')->put('team-members-cv/pablo-test.pdf', 'bytes');

    $member = TeamMember::factory()->create([
        'slug' => 'pablo-test',
        'cv_path' => '/uploads/team-members-cv/pablo-test.pdf',
    ]);

    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->put(route('admin.team-members.update', $member), teamMemberPayload($member, [
        'remove_cv' => true,
    ]))->assertRedirect(route('admin.team-members.index'));

    Storage::disk('public_uploads')->assertMissing('team-members-cv/pablo-test.pdf');
    expect($member->refresh()->cv_path)->toBeNull();
});

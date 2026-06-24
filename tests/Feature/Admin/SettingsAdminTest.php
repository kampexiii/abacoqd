<?php

use App\Models\Setting;
use App\Models\User;
use App\Support\SiteSettings;

test('an admin can view the site settings screen', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->get(route('admin.settings.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/Settings/Edit')->has('settings'));
});

test('an admin can update site settings and they are persisted and shared', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->put(route('admin.settings.update'), [
        'contact_email' => 'nuevo@abacoqd.com',
        'social_linkedin' => 'https://www.linkedin.com/company/abacoqd',
        'google_reviews_rating' => '4.8',
        'google_reviews_count' => '12',
    ])->assertRedirect();

    $stored = Setting::query()->where('group', 'site')->where('key', 'contact_email')->first();
    expect($stored)->not->toBeNull()
        ->and($stored->value)->toBe('nuevo@abacoqd.com');

    $shared = SiteSettings::shared();
    expect($shared['contact']['email'])->toBe('nuevo@abacoqd.com')
        ->and($shared['googleReviews']['rating'])->toBe(4.8)
        ->and($shared['googleReviews']['count'])->toBe(12);
});

test('an editor cannot update site settings', function () {
    $this->actingAs(User::factory()->create(['role' => 'editor']));

    $this->put(route('admin.settings.update'), ['contact_email' => 'x@y.com'])
        ->assertForbidden();
});

test('the public form recipient falls back to config when unset', function () {
    expect(SiteSettings::formRecipient())->toBe((string) config('site.contact.form_recipient'));
});

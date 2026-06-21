<?php

use App\Enums\UserRole;
use App\Models\User;

test('guests are redirected to login when visiting the admin dashboard', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
});

test('a super_admin who logs in is routed to the admin dashboard', function () {
    $user = User::factory()->create(['role' => UserRole::SuperAdmin->value]);

    $this->post('/login', ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('dashboard'));

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('admin.dashboard'));
});

test('an admin is routed from /dashboard to the admin dashboard', function () {
    $this->actingAs(User::factory()->create(['role' => UserRole::Admin->value]))
        ->get(route('dashboard'))
        ->assertRedirect(route('admin.dashboard'));
});

test('an editor is routed from /dashboard to the admin dashboard', function () {
    $this->actingAs(User::factory()->create(['role' => UserRole::Editor->value]))
        ->get(route('dashboard'))
        ->assertRedirect(route('admin.dashboard'));
});

test('a viewer cannot access the admin dashboard', function () {
    $this->actingAs(User::factory()->create(['role' => UserRole::Viewer->value]))
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('a viewer is sent to the public home from /dashboard, not the admin panel', function () {
    $this->actingAs(User::factory()->create(['role' => UserRole::Viewer->value]))
        ->get(route('dashboard'))
        ->assertRedirect('/');
});

<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('super_admin can update another user password from admin users edit', function () {
    $superAdmin = User::factory()->create(['role' => UserRole::SuperAdmin->value]);
    $user = User::factory()->create(['role' => UserRole::Editor->value]);

    $this->actingAs($superAdmin)
        ->put(route('admin.users.update', $user), [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role->value,
            'password' => 'NuevaClaveSegura123!',
            'password_confirmation' => 'NuevaClaveSegura123!',
        ])
        ->assertRedirect(route('admin.users.index'));

    expect(Hash::check('NuevaClaveSegura123!', $user->refresh()->password))->toBeTrue();
});

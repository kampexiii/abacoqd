<?php

use App\Enums\UserRole;
use App\Models\User;

/**
 * Cierre del bloque P0 de seguridad/RBAC/PII: cubre la matriz final de
 * permisos (super_admin/admin/editor/viewer) a nivel de ruta, sin tocar
 * Calendar/Booking/Settings más allá del acceso por rol.
 */
function roleUser(UserRole $role): User
{
    return User::factory()->create(['role' => $role->value]);
}

test('editor no accede a /admin/users', function () {
    $this->actingAs(roleUser(UserRole::Editor));

    $this->get('/admin/users')->assertForbidden();
});

test('editor no accede a /admin/contacts', function () {
    $this->actingAs(roleUser(UserRole::Editor));

    $this->get('/admin/contacts')->assertForbidden();
});

test('editor no accede a /admin/booking/calendar', function () {
    $this->actingAs(roleUser(UserRole::Editor));

    $this->get('/admin/booking/calendar')->assertForbidden();
});

test('editor no accede a /admin/booking/bookings', function () {
    $this->actingAs(roleUser(UserRole::Editor));

    $this->get('/admin/booking/bookings')->assertForbidden();
});

test('editor no accede a /admin/booking/settings', function () {
    $this->actingAs(roleUser(UserRole::Editor));

    $this->get('/admin/booking/settings')->assertForbidden();
});

test('editor no accede a /admin/settings', function () {
    $this->actingAs(roleUser(UserRole::Editor));

    $this->get('/admin/settings')->assertForbidden();
});

test('admin no puede borrar super_admin', function () {
    $superAdmin = roleUser(UserRole::SuperAdmin);
    $this->actingAs(roleUser(UserRole::Admin));

    $this->delete(route('admin.users.destroy', $superAdmin))->assertForbidden();

    $this->assertDatabaseHas('users', ['id' => $superAdmin->id]);
});

test('admin no puede resetear contraseña de super_admin', function () {
    $superAdmin = roleUser(UserRole::SuperAdmin);
    $originalPassword = $superAdmin->password;
    $this->actingAs(roleUser(UserRole::Admin));

    $this->patch(route('admin.users.reset-password', $superAdmin))->assertForbidden();

    expect($superAdmin->refresh()->password)->toBe($originalPassword);
});

test('admin no puede editar rol de super_admin', function () {
    $superAdmin = roleUser(UserRole::SuperAdmin);
    $this->actingAs(roleUser(UserRole::Admin));

    $this->put(route('admin.users.update', $superAdmin), [
        'name' => $superAdmin->name,
        'email' => $superAdmin->email,
        'role' => UserRole::Editor->value,
    ])->assertForbidden();

    expect($superAdmin->refresh()->role)->toBe(UserRole::SuperAdmin);
});

test('no se puede borrar el último super_admin', function () {
    $superAdmin = roleUser(UserRole::SuperAdmin);
    $this->actingAs($superAdmin);

    $this->delete(route('admin.users.destroy', $superAdmin));

    $this->assertDatabaseHas('users', ['id' => $superAdmin->id]);
});

test('super_admin sí puede acceder a usuarios', function () {
    $this->actingAs(roleUser(UserRole::SuperAdmin));

    $this->get(route('admin.users.index'))->assertOk();
});

test('admin sí puede acceder a contactos y reservas', function () {
    $this->actingAs(roleUser(UserRole::Admin));

    $this->get(route('admin.contacts.index'))->assertOk();
    $this->get(route('admin.booking.bookings.index'))->assertOk();
});

test('editor sí puede acceder a contenidos editoriales permitidos', function () {
    $this->actingAs(roleUser(UserRole::Editor));

    $this->get(route('admin.services.index'))->assertOk();
    $this->get(route('admin.posts.index'))->assertOk();
});

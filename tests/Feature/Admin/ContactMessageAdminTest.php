<?php

use App\Enums\ContactMessageStatus;
use App\Enums\UserRole;
use App\Models\ContactMessage;
use App\Models\User;

function contactAdminUser(UserRole $role = UserRole::Admin): User
{
    return User::factory()->create(['role' => $role->value]);
}

test('guests are redirected to login from the admin contacts listing', function () {
    $this->get(route('admin.contacts.index'))->assertRedirect(route('login'));
});

test('a viewer without management role cannot access the admin contacts listing', function () {
    $this->actingAs(contactAdminUser(UserRole::Viewer));

    $this->get(route('admin.contacts.index'))->assertForbidden();
});

test('an admin can see the admin contacts listing', function () {
    ContactMessage::factory()->create(['name' => 'Jane Doe']);
    $this->actingAs(contactAdminUser());

    $this->get(route('admin.contacts.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Contacts/Index')
            ->has('contacts.data', 1)
            ->where('contacts.data.0.name', 'Jane Doe')
            ->where('contacts.total', 1)
        );
});

test('the listing can be filtered by status', function () {
    ContactMessage::factory()->create(['status' => ContactMessageStatus::New->value]);
    ContactMessage::factory()->create(['status' => ContactMessageStatus::Converted->value]);
    $this->actingAs(contactAdminUser());

    $this->get(route('admin.contacts.index', ['status' => ContactMessageStatus::Converted->value]))
        ->assertInertia(fn ($page) => $page
            ->has('contacts.data', 1)
            ->where('contacts.total', 1)
        );
});

test('an admin can view a contact detail', function () {
    $contact = ContactMessage::factory()->create();
    $this->actingAs(contactAdminUser());

    $this->get(route('admin.contacts.show', $contact))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Contacts/Show')
            ->where('contact.id', $contact->id)
        );
});

test('an admin can update the status and internal notes of a contact', function () {
    $contact = ContactMessage::factory()->create(['status' => ContactMessageStatus::New->value]);
    $this->actingAs(contactAdminUser());

    $this->put(route('admin.contacts.update', $contact), [
        'status' => ContactMessageStatus::Contacted->value,
        'internal_notes' => 'Llamado el lunes.',
    ])->assertRedirect();

    $contact->refresh();

    expect($contact->status)->toBe(ContactMessageStatus::Contacted)
        ->and($contact->internal_notes)->toBe('Llamado el lunes.');
});

test('an editor cannot delete a contact', function () {
    $contact = ContactMessage::factory()->create();
    $this->actingAs(contactAdminUser(UserRole::Editor));

    $this->delete(route('admin.contacts.destroy', $contact));

    $this->assertDatabaseHas('contact_messages', ['id' => $contact->id]);
});

test('an admin can delete a single contact', function () {
    $contact = ContactMessage::factory()->create();
    $this->actingAs(contactAdminUser());

    $this->delete(route('admin.contacts.destroy', $contact))
        ->assertRedirect(route('admin.contacts.index'));

    $this->assertDatabaseMissing('contact_messages', ['id' => $contact->id]);
});

test('an admin can purge selected contacts', function () {
    $keep = ContactMessage::factory()->create();
    $toDelete = ContactMessage::factory()->create();
    $this->actingAs(contactAdminUser());

    $this->delete(route('admin.contacts.purge'), ['ids' => [$toDelete->id]])
        ->assertRedirect(route('admin.contacts.index'));

    $this->assertDatabaseMissing('contact_messages', ['id' => $toDelete->id]);
    $this->assertDatabaseHas('contact_messages', ['id' => $keep->id]);
});

test('purging all contacts requires the exact confirmation text', function () {
    ContactMessage::factory()->count(2)->create();
    $this->actingAs(contactAdminUser());

    $this->delete(route('admin.contacts.purge'), ['confirmation' => 'borrar'])
        ->assertRedirect();

    expect(ContactMessage::count())->toBe(2);

    $this->delete(route('admin.contacts.purge'), ['confirmation' => 'PURGAR'])
        ->assertRedirect(route('admin.contacts.index'));

    expect(ContactMessage::count())->toBe(0);
});

test('an editor cannot purge contacts', function () {
    ContactMessage::factory()->count(2)->create();
    $this->actingAs(contactAdminUser(UserRole::Editor));

    $this->delete(route('admin.contacts.purge'), ['confirmation' => 'PURGAR']);

    expect(ContactMessage::count())->toBe(2);
});

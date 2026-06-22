<?php

use App\Enums\UserRole;
use App\Models\Faq;
use App\Models\User;

function faqAdminUser(UserRole $role = UserRole::Admin): User
{
    return User::factory()->create(['role' => $role->value]);
}

function validFaqPayload(array $overrides = []): array
{
    return array_merge([
        'question' => ['es' => '¿Cuánto cuesta un proyecto?', 'en' => 'How much does a project cost?'],
        'answer' => ['es' => 'Depende del alcance.', 'en' => 'It depends on the scope.'],
        'category' => 'services',
        'intent' => 'services_pricing',
        'redirect_url' => '/servicios',
        'redirect_section' => null,
        'show_in_chatbot' => true,
        'show_on_page' => true,
        'is_active' => true,
        'sort_order' => 5,
    ], $overrides);
}

test('guests are redirected to login from the admin faqs listing', function () {
    $this->get(route('admin.faqs.index'))->assertRedirect(route('login'));
});

test('a viewer without management role cannot access the admin faqs listing', function () {
    $this->actingAs(faqAdminUser(UserRole::Viewer));

    $this->get(route('admin.faqs.index'))->assertForbidden();
});

test('a management user can see the admin faqs listing', function () {
    Faq::factory()->create();
    $this->actingAs(faqAdminUser(UserRole::Editor));

    $this->get(route('admin.faqs.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/Faqs/Index'));
});

test('an admin can create a faq', function () {
    $this->actingAs(faqAdminUser());

    $this->post(route('admin.faqs.store'), validFaqPayload())
        ->assertRedirect(route('admin.faqs.index'));

    $faq = Faq::query()->where('intent', 'services_pricing')->first();

    expect($faq)->not->toBeNull()
        ->and($faq->question['es'])->toBe('¿Cuánto cuesta un proyecto?')
        ->and($faq->show_in_chatbot)->toBeTrue();
});

test('an admin can update a faq', function () {
    $faq = Faq::factory()->create(['category' => 'general']);
    $this->actingAs(faqAdminUser());

    $this->put(
        route('admin.faqs.update', $faq),
        validFaqPayload(['category' => 'booking']),
    )->assertRedirect(route('admin.faqs.index'));

    expect($faq->refresh()->category)->toBe('booking');
});

test('the spanish question is required', function () {
    $this->actingAs(faqAdminUser());

    $this->post(
        route('admin.faqs.store'),
        validFaqPayload(['question' => ['es' => null, 'en' => 'Only English']]),
    )->assertSessionHasErrors('question.es');
});

test('toggling show in chatbot flips its value', function () {
    $faq = Faq::factory()->create(['show_in_chatbot' => false]);
    $this->actingAs(faqAdminUser());

    $this->patch(route('admin.faqs.toggle-chatbot', $faq));

    expect($faq->refresh()->show_in_chatbot)->toBeTrue();
});

test('archiving a faq hides it instead of deleting it', function () {
    $faq = Faq::factory()->create([
        'is_active' => true,
        'show_in_chatbot' => true,
        'show_on_page' => true,
    ]);
    $this->actingAs(faqAdminUser());

    $this->delete(route('admin.faqs.destroy', $faq));

    $faq->refresh();

    expect($faq->is_active)->toBeFalse()
        ->and($faq->show_in_chatbot)->toBeFalse()
        ->and($faq->show_on_page)->toBeFalse();
    $this->assertDatabaseHas('faqs', ['id' => $faq->id]);
});

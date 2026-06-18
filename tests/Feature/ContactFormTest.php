<?php

use App\Enums\ContactMessageStatus;
use App\Enums\ServiceStatus;
use App\Models\ContactMessage;
use App\Models\Service;

test('guest can view the contact page', function () {
    $service = Service::factory()->create(['status' => ServiceStatus::Published->value]);

    $response = $this->get('/contacto');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Public/Contact')
        ->has('services', 1)
        ->where('services.0.id', $service->id)
    );
});

test('the service of interest is preselected from the query string', function () {
    $service = Service::factory()->create([
        'status' => ServiceStatus::Published->value,
        'slug' => ['es' => 'desarrollo-web-rapido', 'en' => 'fast-web-development'],
    ]);

    $response = $this->get('/contacto?servicio=desarrollo-web-rapido');

    $response->assertInertia(fn ($page) => $page
        ->where('preselectedServiceId', $service->id)
    );
});

test('a valid submission creates a contact message and redirects back', function () {
    $service = Service::factory()->create(['status' => ServiceStatus::Published->value]);

    $response = $this->post('/contacto', [
        'name' => 'Jane Doe',
        'company' => 'Acme',
        'email' => 'jane@example.com',
        'phone' => '+34600000000',
        'service_id' => $service->id,
        'message' => 'Quiero un presupuesto para mi proyecto.',
        'privacy_consent' => '1',
        'marketing_consent' => '1',
    ]);

    $response->assertRedirect('/contacto');
    $response->assertSessionHas('contactSubmitted', true);

    expect(ContactMessage::count())->toBe(1);

    $message = ContactMessage::first();

    expect($message->name)->toBe('Jane Doe')
        ->and($message->email)->toBe('jane@example.com')
        ->and($message->service_id)->toBe($service->id)
        ->and($message->status)->toBe(ContactMessageStatus::New)
        ->and($message->source)->toBe('web')
        ->and($message->privacy_accepted_at)->not->toBeNull()
        ->and($message->commercial_consent)->toBeTrue()
        ->and($message->commercial_consent_at)->not->toBeNull();
});

test('privacy consent is required to submit the contact form', function () {
    $response = $this->post('/contacto', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'message' => 'Hola.',
    ]);

    $response->assertSessionHasErrors('privacy_consent');
    expect(ContactMessage::count())->toBe(0);
});

test('a filled honeypot silently rejects the contact submission', function () {
    $response = $this->post('/contacto', [
        'name' => 'Bot',
        'email' => 'bot@example.com',
        'message' => 'Spam',
        'privacy_consent' => '1',
        'honeypot' => 'http://spam.example',
    ]);

    $response->assertSessionHasErrors('honeypot');
    expect(ContactMessage::count())->toBe(0);
});

test('marketing consent is optional and defaults to false', function () {
    $this->post('/contacto', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'message' => 'Hola.',
        'privacy_consent' => '1',
    ])->assertRedirect('/contacto');

    $message = ContactMessage::first();

    expect($message->commercial_consent)->toBeFalse()
        ->and($message->commercial_consent_at)->toBeNull();
});

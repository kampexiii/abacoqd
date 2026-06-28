<?php

use App\Enums\ContactMessageStatus;
use App\Enums\ServiceStatus;
use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use App\Models\Service;
use App\Models\Setting;
use App\Support\SiteSettings;
use Illuminate\Support\Facades\Mail;

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
    Mail::fake();

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

    Mail::assertSent(ContactMessageReceived::class, function (ContactMessageReceived $mail) use ($message) {
        return $mail->contactMessage->is($message)
            && $mail->hasTo(SiteSettings::formRecipient());
    });
});

test('the contact notification is sent to the recipient configured in settings', function () {
    Mail::fake();

    Setting::query()->create([
        'group' => 'site',
        'key' => 'form_recipient_email',
        'value' => 'leads@abacoqd.com',
        'type' => 'string',
        'is_public' => true,
    ]);

    $this->post('/contacto', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'message' => 'Quiero un presupuesto.',
        'privacy_consent' => '1',
    ])->assertRedirect('/contacto');

    expect(SiteSettings::formRecipient())->toBe('leads@abacoqd.com');

    Mail::assertSent(
        ContactMessageReceived::class,
        fn (ContactMessageReceived $mail) => $mail->hasTo('leads@abacoqd.com'),
    );
});

test('the contact notification falls back to config when settings has no recipient', function () {
    Mail::fake();

    expect(Setting::query()->where('group', 'site')->where('key', 'form_recipient_email')->exists())->toBeFalse();

    $this->post('/contacto', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'message' => 'Quiero un presupuesto.',
        'privacy_consent' => '1',
    ])->assertRedirect('/contacto');

    Mail::assertSent(
        ContactMessageReceived::class,
        fn (ContactMessageReceived $mail) => $mail->hasTo(config('site.contact.form_recipient')),
    );
});

test('the contact notification carries the visitor email as Reply-To, not as From', function () {
    Mail::fake();

    $this->post('/contacto', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'message' => 'Quiero un presupuesto.',
        'privacy_consent' => '1',
    ])->assertRedirect('/contacto');

    // El mailable nunca define `from` en su envelope (usa el remitente
    // corporativo por defecto del mailer); solo añade el email del visitante
    // como Reply-To. `hasFrom()` no se usa aquí: revienta si `from` no está
    // definido en el envelope, que es justo el estado correcto y esperado.
    Mail::assertSent(
        ContactMessageReceived::class,
        fn (ContactMessageReceived $mail) => $mail->hasReplyTo('jane@example.com', 'Jane Doe'),
    );
});

test('a failing mailer does not lose the lead nor break the response', function () {
    Mail::shouldReceive('to')->andThrow(new RuntimeException('SMTP down'));

    $response = $this->post('/contacto', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'message' => 'Quiero un presupuesto.',
        'privacy_consent' => '1',
    ]);

    $response->assertRedirect('/contacto');
    $response->assertSessionHas('contactSubmitted', true);
    expect(ContactMessage::count())->toBe(1);
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

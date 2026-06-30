<?php

use App\Models\User;
use App\Notifications\Auth\ResetPasswordNotification;
use Illuminate\Support\Facades\Notification;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::resetPasswords());
});

test('reset password link screen can be rendered', function () {
    $response = $this->get(route('password.request'));

    $response->assertOk();
});

test('reset password link can be requested', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPasswordNotification::class, function (ResetPasswordNotification $notification) use ($user) {
        $mail = $notification->toMail($user);

        expect($mail->subject)->toBe('Restablece tu contraseña de AbacoQD');
        expect($mail->view)->toBe('emails.auth.reset-password');
        expect($mail->viewData['userEmail'])->toBe($user->email);
        expect($mail->viewData['resetUrl'])->toContain('/reset-password/');

        return true;
    });
});

test('reset password screen can be rendered', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPasswordNotification::class, function (ResetPasswordNotification $notification) {
        $response = $this->get(route('password.reset', $notification->token));

        $response->assertOk();

        return true;
    });
});

test('password can be reset with valid token', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPasswordNotification::class, function (ResetPasswordNotification $notification) use ($user) {
        $response = $this->post(route('password.update'), [
            'token' => $notification->token,
            'email' => $user->email,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('login'));

        return true;
    });
});

test('password cannot be reset with invalid token', function () {
    $user = User::factory()->create();

    $response = $this->post(route('password.update'), [
        'token' => 'invalid-token',
        'email' => $user->email,
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ]);

    $response->assertSessionHasErrors('email');
});

test('forgot-password requests are throttled per IP, even across different emails', function () {
    Notification::fake();

    // Emails distintos en cada intento: el riesgo que cubre este throttle es
    // pulverizar el endpoint con muchas cuentas para enumerarlas, no repetir
    // la misma (eso ya lo throttla el password broker de Laravel, aparte).
    for ($i = 0; $i < 6; $i++) {
        $this->post(route('password.email'), ['email' => "guest{$i}@example.com"]);
    }

    $this->post(route('password.email'), ['email' => 'one-more@example.com'])
        ->assertStatus(429);
});

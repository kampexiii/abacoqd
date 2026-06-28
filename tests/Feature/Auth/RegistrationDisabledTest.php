<?php

use Laravel\Fortify\Features;

test('el feature de registro de Fortify está desactivado', function () {
    expect(Features::enabled(Features::registration()))->toBeFalse();
});

test('/register no está disponible para invitados', function () {
    $this->get('/register')->assertNotFound();
});

test('/register no permite crear usuarios públicos', function () {
    $this->post('/register', [
        'name' => 'Intruso',
        'email' => 'intruso@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertNotFound();

    $this->assertDatabaseMissing('users', ['email' => 'intruso@example.com']);
});

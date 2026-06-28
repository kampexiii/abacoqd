<?php

test('security headers are present on public responses', function () {
    // No se verifica aquí `X-Powered-By`: la añade el SAPI de PHP fuera del
    // ciclo de vida de la Response de Symfony, así que en el cliente de
    // test (CLI, sin envío real de cabeceras) la aserción sería un placebo.
    // Se valida con una petición HTTP real (ver informe del bloque).
    $response = $this->get('/');

    $response->assertOk()
        ->assertHeader('X-Frame-Options', 'DENY')
        ->assertHeader('X-Content-Type-Options', 'nosniff')
        ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
        ->assertHeader('Cross-Origin-Opener-Policy', 'same-origin')
        ->assertHeader('Cross-Origin-Resource-Policy', 'same-origin');

    expect($response->headers->has('Content-Security-Policy-Report-Only'))->toBeTrue();
});

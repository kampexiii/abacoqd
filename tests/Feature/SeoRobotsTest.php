<?php

test('robots.txt keeps the public site crawlable but blocks private areas', function () {
    $contents = file_get_contents(public_path('robots.txt'));

    expect($contents)->not->toBeFalse();

    // No bloquea todo el sitio: ninguna línea es exactamente `Disallow: /`.
    $blocksEverything = collect(preg_split('/\R/', (string) $contents))
        ->contains(fn (string $line): bool => trim($line) === 'Disallow: /');
    expect($blocksEverything)->toBeFalse();

    // Bloquea zonas privadas, de autenticación y de utilidad.
    foreach ([
        '/admin',
        '/dashboard',
        '/settings',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/email/verify',
        '/two-factor-challenge',
        '/user/confirm-password',
    ] as $path) {
        expect($contents)->toContain('Disallow: '.$path);
    }

    // No bloquea assets de build (deben poder rastrearse).
    expect($contents)->not->toContain('Disallow: /build');
});

test('public pages keep robots index,follow in the initial html', function () {
    $this->get('/')
        ->assertOk()
        ->assertSee('name="robots" content="index,follow"', false);
});

test('auth pages are served noindex,nofollow in the initial html and seo prop', function () {
    $this->get('/login')
        ->assertOk()
        ->assertSee('name="robots" content="noindex,nofollow"', false)
        ->assertInertia(fn ($page) => $page->where('seo.robots', 'noindex,nofollow'));
});

test('register is also served noindex,nofollow', function () {
    $this->get('/register')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('seo.robots', 'noindex,nofollow'));
});

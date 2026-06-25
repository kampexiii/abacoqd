<?php

/*
 * CMP propio AbacoQD: el layout público recibe los flags de consentimiento como
 * prop Inertia compartida y NO se inyecta ningún script externo
 * (GTM/GA4/Clarity/Search Console). El estado externo queda inerte por defecto.
 */

test('shares the CMP enabled flag on public pages when consent is enabled', function () {
    config([
        'site.consent.enabled' => true,
        'site.consent.external_tracking' => false,
    ]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('consent.enabled', true)
            ->where('consent.externalTracking', false));
});

test('shares the CMP flag as disabled when consent is turned off', function () {
    config(['site.consent.enabled' => false]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('consent.enabled', false));
});

test('does not inject any external tracking script in the public HTML', function () {
    $html = $this->get('/')->assertOk()->getContent();

    expect($html)
        ->not->toContain('googletagmanager.com')
        ->not->toContain('gtag(')
        ->not->toContain('GTM-')
        ->not->toContain('google-analytics.com')
        ->not->toContain('clarity.ms')
        ->not->toContain('window.dataLayer')
        ->not->toContain('google-site-verification');
});

test('keeps external tracking disabled by default so no provider can load', function () {
    // Garantía de servidor: aunque alguien acepte, externalTracking=false
    // mantiene la compuerta cerrada (estado interno denied) en esta fase.
    expect(config('site.consent.external_tracking'))->toBeFalse();
});

<?php

use Illuminate\Support\Facades\File;

/*
 * Guards estáticos del aviso simple de cookies técnicas (AbacoQD). No renderizan
 * nada: leen los fuentes de `resources/js` para garantizar que el layout público
 * monta `CookieNotice`, que `/cookies` permite volver a mostrar el aviso, y que
 * NO queda nada del CMP complejo (módulos analytics/privacy, dataLayer de
 * terceros, GTM/GA4/Clarity/CookieYes ni Consent Mode).
 */

function abacoFrontendJs(): string
{
    $blob = '';

    foreach (File::allFiles(resource_path('js')) as $file) {
        if (in_array($file->getExtension(), ['ts', 'tsx', 'js', 'jsx'], true)) {
            $blob .= "\n".$file->getContents();
        }
    }

    return $blob;
}

test('el layout publico monta el aviso simple de cookies', function () {
    $layout = File::get(resource_path('js/layouts/public-layout.tsx'));

    expect($layout)
        ->toContain('@/components/cookies/CookieNotice')
        ->toContain('<CookieNotice />');
});

test('el frontend no importa modulos analytics ni privacy del CMP antiguo', function () {
    expect(abacoFrontendJs())
        ->not->toContain('components/analytics')
        ->not->toContain('components/privacy');
});

test('el frontend no usa un dataLayer de terceros', function () {
    expect(abacoFrontendJs())
        ->not->toContain('window.dataLayer')
        ->not->toContain('abacoqdDataLayer');
});

test('el frontend no referencia proveedores de tracking externos', function () {
    expect(abacoFrontendJs())
        ->not->toContain('googletagmanager')
        ->not->toContain('google-analytics')
        ->not->toContain('clarity.ms')
        ->not->toContain('cookieyes')
        ->not->toContain('gtag(')
        ->not->toContain('GTM-');
});

test('la pagina /cookies permite volver a mostrar el aviso', function () {
    $legal = File::get(resource_path('js/pages/Public/LegalPage.tsx'));

    expect($legal)
        ->toContain('cookieNotice.reopen')
        ->toContain('COOKIE_NOTICE_STORAGE_KEY');
});

test('el aviso usa una clave de localStorage propia y no la antigua del CMP', function () {
    $notice = File::get(resource_path('js/components/cookies/CookieNotice.tsx'));

    expect($notice)->toContain('abacoqd_cookie_notice_v1');
    expect(abacoFrontendJs())->not->toContain('abacoqd_consent');
});

test('los textos del aviso simple existen en ambos idiomas', function () {
    $es = json_decode(File::get(lang_path('es.json')), true);
    $en = json_decode(File::get(lang_path('en.json')), true);

    expect($es['cookieNotice']['reopen'])->toBe('Volver a mostrar aviso de cookies');
    expect($en['cookieNotice'])->toHaveKeys(['title', 'body', 'accept', 'policyLink', 'reopen']);
});

<?php

use Illuminate\Support\Facades\File;

/*
 * Guards estáticos del CMP propio AbacoQD en el frontend. No renderizan nada:
 * leen los fuentes de `resources/js` para garantizar naming neutro (sin rutas
 * `/components/analytics/` que navegadores con protección anti-tracking puedan
 * bloquear), sin dataLayer de terceros y sin proveedores externos, además de la
 * acción de preferencias en `/cookies` y la ausencia de chip flotante.
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

test('el frontend no importa la antigua ruta de modulos /components/analytics', function () {
    expect(abacoFrontendJs())->not->toContain('components/analytics');
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
        ->not->toContain('gtag(');
});

test('el layout publico no deja chip flotante de preferencias de cookies', function () {
    $manager = File::get(resource_path('js/components/consent/ConsentManager.tsx'));

    expect($manager)
        ->not->toContain('consent.reopen')
        ->not->toContain('showReopen');
});

test('la pagina /cookies expone la accion para cambiar preferencias', function () {
    $legal = File::get(resource_path('js/pages/Public/LegalPage.tsx'));

    expect($legal)
        ->toContain('abacoqd:open-consent')
        ->toContain('consent.manage.action');
});

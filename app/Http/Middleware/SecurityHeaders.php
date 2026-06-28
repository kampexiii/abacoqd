<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Cabeceras de seguridad para respuestas web (defensa en profundidad).
 *
 * La política de contenido se emite como `Content-Security-Policy-Report-Only`:
 * solo reporta violaciones (consola del navegador), no bloquea, para no romper
 * Vite/React/Inertia/Three.js ni el hero protegido durante el rodaje. No usa
 * `unsafe-eval` (el shim CSP-safe de es-toolkit elimina esa necesidad) ni
 * depende de dominios de terceros. El paso a enforce queda para una fase
 * posterior, tras tunear nonce/hash del JSON-LD inline y validar sin
 * violaciones.
 *
 * HSTS solo se emite en producción sobre HTTPS. No se pisan cabeceras que un
 * middleware aguas arriba ya haya definido.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        // `X-Powered-By` la añade PHP por configuración (`expose_php`), no
        // Laravel: no se puede asumir que el `php.ini` de producción tenga
        // `expose_php = Off`, así que se quita aquí también. `header_remove`
        // funciona porque en este punto del ciclo de vida no se ha enviado
        // ninguna cabecera todavía.
        if (function_exists('header_remove')) {
            header_remove('X-Powered-By');
        }

        $response = $next($request);

        $headers = [
            'X-Frame-Options' => 'DENY',
            'X-Content-Type-Options' => 'nosniff',
            'Referrer-Policy' => 'strict-origin-when-cross-origin',
            'Permissions-Policy' => 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
            'Cross-Origin-Opener-Policy' => 'same-origin',
            'Cross-Origin-Resource-Policy' => 'same-origin',
            'Content-Security-Policy-Report-Only' => $this->contentSecurityPolicy(),
        ];

        foreach ($headers as $name => $value) {
            if (! $response->headers->has($name)) {
                $response->headers->set($name, $value);
            }
        }

        // HSTS solo tiene sentido bajo HTTPS y en producción; en local (http)
        // se omite para no interferir con http://127.0.0.1.
        if ($request->secure() && app()->isProduction() && ! $response->headers->has('Strict-Transport-Security')) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains',
            );
        }

        return $response;
    }

    /**
     * CSP base sin `unsafe-eval` ni terceros. `style-src 'unsafe-inline'` se
     * tolera de momento por los estilos inline que genera el stack actual;
     * `script-src` se mantiene estricto (sin `unsafe-eval`).
     */
    private function contentSecurityPolicy(): string
    {
        return implode(' ', [
            "default-src 'self';",
            "base-uri 'self';",
            "frame-ancestors 'none';",
            "object-src 'none';",
            "img-src 'self' data: blob:;",
            "font-src 'self' data:;",
            "style-src 'self' 'unsafe-inline';",
            "script-src 'self';",
            "connect-src 'self';",
            "media-src 'self';",
            "worker-src 'self' blob:;",
            "manifest-src 'self';",
            "form-action 'self';",
        ]);
    }
}

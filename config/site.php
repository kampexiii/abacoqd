<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Datos del sitio (fallback)
    |--------------------------------------------------------------------------
    |
    | Valores por defecto del sitio. La fuente EDITABLE desde el admin es la
    | tabla `settings` (grupo `site`, ver App\Support\SiteSettings); estos
    | valores se usan como fallback cuando una clave no está definida en BD.
    |
    | No se hardcodean estos datos en componentes: se exponen a React como prop
    | compartida de Inertia (`siteSettings`) y los componentes solo los consumen.
    |
    */

    'contact' => [
        'email' => env('CONTACT_PUBLIC_EMAIL', 'info@abacoqd.com'),
        'phone' => '+34 91 020 00 89',
        'whatsapp' => '+34 647 51 81 00',
        'address' => 'Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid',
        'city_country' => 'Madrid, España',
        // Receptor de los formularios públicos (contacto/reserva).
        'form_recipient' => env('CONTACT_NOTIFY_EMAIL', 'info@abacoqd.com'),
        // Receptor de las notificaciones de reserva. Si no se define
        // BOOKING_NOTIFY_EMAIL, cae al receptor de contacto.
        'booking_recipient' => env('BOOKING_NOTIFY_EMAIL') ?: env('CONTACT_NOTIFY_EMAIL', 'info@abacoqd.com'),
    ],

    'social' => [
        'linkedin' => 'https://www.linkedin.com/company/abaco-developments',
        'facebook' => 'https://www.facebook.com/abacodev/',
    ],

    /*
    | Prueba social: Google Reviews. Sin URL el bloque del footer se oculta; sin
    | rating/count se muestra solo el enlace, sin inventar cifras.
    */
    'google_reviews' => [
        'url' => env('ABACO_GOOGLE_REVIEWS_URL') ?: null,
        'rating' => is_numeric(env('ABACO_GOOGLE_REVIEWS_RATING'))
            ? (float) env('ABACO_GOOGLE_REVIEWS_RATING')
            : null,
        'count' => is_numeric(env('ABACO_GOOGLE_REVIEWS_COUNT'))
            ? (int) env('ABACO_GOOGLE_REVIEWS_COUNT')
            : null,
        'location' => env('ABACO_GOOGLE_REVIEWS_LOCATION', 'Madrid, España'),
    ],

    'footer' => [
        'text' => null,
    ],

    'domain' => [
        'canonical' => 'https://abacoqd.com/',
        'previous' => 'https://abacodev.com/',
    ],

    /*
    |--------------------------------------------------------------------------
    | SEO base (fallback)
    |--------------------------------------------------------------------------
    |
    | Valores por defecto del SEO servido en páginas públicas cuando no hay un
    | registro `seo_metadata` para la página/modelo. La fuente técnica es
    | `seo_metadata` (por `page_key` o relación `seoable`); estos valores cubren
    | el fallback. La marca pública visible es "Abaco Developments" y `robots`
    | se mantiene en `index,follow`.
    |
    */
    'seo' => [
        'brand' => 'AbacoQD',
        // Razón social para textos legales y `legalName` en datos estructurados.
        'legal_name' => 'ABACO DIGITAL DEVELOPMENTS, S.L.',
        'title' => 'AbacoQD | Desarrollo a medida rápido y seguro',
        'description' => 'AbacoQD desarrolla webs, aplicaciones, automatizaciones, CRM, integraciones y herramientas internas a medida, con procesos ágiles, IA supervisada y criterio técnico de Abaco Developments.',
        'robots' => 'index,follow',

        /*
        | Imagen social (Open Graph / Twitter) por defecto cuando un registro
        | `seo_metadata` no trae `og_image`. Debe ser un raster (PNG/JPG/WebP)
        | absoluto o una ruta servible bajo el dominio canónico; los logos de
        | marca actuales son SVG y las plataformas sociales no los renderizan.
        | Por defecto se sirve la tarjeta social 1200×630 versionada (logo de
        | marca sobre fondo claro); `ABACO_SEO_OG_IMAGE` permite sobrescribirla.
        */
        'og_image' => env('ABACO_SEO_OG_IMAGE') ?: '/assets/branding/social/og-default.png',
    ],

];

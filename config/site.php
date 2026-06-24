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
        'email' => env('CONTACT_PUBLIC_EMAIL', 'info@abacodev.com'),
        'phone' => '+34 91 020 00 89',
        'whatsapp' => '+34 647 51 81 00',
        'address' => 'Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid',
        'city_country' => 'Madrid, España',
        // Receptor de los formularios públicos (contacto/reserva).
        'form_recipient' => env('CONTACT_NOTIFY_EMAIL', 'info@abacodev.com'),
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

];

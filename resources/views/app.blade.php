<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @php($seo = $page['props']['seo'] ?? null)
        {{-- SEO base servido en el HTML inicial (no depende solo del <Head> de
            React). El atributo data-inertia permite que el head-manager cliente
            reconcilie estos tags con los que emite <SeoHead> sin duplicarlos. --}}
        <x-inertia::head>
            <title data-inertia="">{{ $seo['title'] ?? config('app.name', 'AbacoQD') }}</title>
            @if($seo)
                <meta name="description" content="{{ $seo['description'] }}" data-inertia="seo-description">
                <link rel="canonical" href="{{ $seo['canonical'] }}" data-inertia="seo-canonical">
                <meta name="robots" content="{{ $seo['robots'] }}" data-inertia="seo-robots">
            @endif
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>

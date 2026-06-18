@php
    $isEnglish = app()->getLocale() === 'en';
@endphp
<!DOCTYPE html>
<html lang="{{ $isEnglish ? 'en' : 'es' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>{{ $isEnglish ? 'Page not found' : 'Página no encontrada' }} - AbacoQD</title>
    <style>
        :root {
            color-scheme: light dark;
            --ink: #04121b;
            --surface: #0f2f38;
            --teal: #18b7b0;
            --cyan: #39c6e6;
            --mist: #eff7f6;
            --white: #f7fbfc;
        }

        * { box-sizing: border-box; }

        body {
            min-height: 100vh;
            margin: 0;
            display: grid;
            place-items: center;
            padding: 2rem;
            color: var(--ink);
            font-family: Poppins, ui-sans-serif, system-ui, sans-serif;
            background:
                radial-gradient(circle at 50% 8%, rgba(24, 183, 176, 0.16), transparent 32rem),
                linear-gradient(180deg, var(--white), var(--mist));
        }

        .card {
            width: min(100%, 760px);
            padding: clamp(1.5rem, 4vw, 3rem);
            border: 1px solid rgba(8, 127, 140, 0.2);
            border-radius: 28px;
            background: rgba(255, 255, 255, 0.72);
            box-shadow: 0 30px 90px rgba(7, 17, 26, 0.12);
            backdrop-filter: blur(18px);
        }

        .brand { display: flex; align-items: center; gap: .75rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
        .brand img { width: 2.5rem; height: 2.5rem; }
        .code { margin: 1.5rem 0 0; color: var(--teal); font-size: clamp(5rem, 18vw, 10rem); font-weight: 800; letter-spacing: -.06em; line-height: .86; }
        h1 { margin: 1rem 0 0; font-size: clamp(2rem, 5vw, 3.6rem); line-height: 1.06; }
        p { max-width: 38rem; margin: 1rem 0 0; color: rgba(4, 18, 27, .7); line-height: 1.7; }
        nav { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 2rem; }
        a { min-height: 2.9rem; display: inline-flex; align-items: center; border: 1px solid rgba(8, 127, 140, .22); border-radius: 999px; padding: 0 1rem; color: #087f8c; font-weight: 700; text-decoration: none; }

        @media (prefers-color-scheme: dark) {
            body { color: var(--white); background: radial-gradient(circle at 50% 8%, rgba(24, 183, 176, 0.14), transparent 30rem), linear-gradient(180deg, var(--ink), var(--surface)); }
            .card { border-color: rgba(122, 191, 191, .18); background: rgba(4, 18, 27, .66); box-shadow: 0 34px 110px rgba(0, 0, 0, .38); }
            p { color: rgba(247, 251, 252, .7); }
            a { border-color: rgba(57, 198, 230, .24); color: var(--teal); }
        }
    </style>
</head>
<body>
    <main class="card">
        <div class="brand">
            <picture>
                <source srcset="/assets/branding/marca/logos/abacoqd-isotipo-inverse.svg" media="(prefers-color-scheme: dark)">
                <img src="/assets/branding/marca/logos/abacoqd-isotipo.svg" alt="">
            </picture>
            <span>AbacoQD</span>
        </div>
        <div class="code">404</div>
        <h1>{{ $isEnglish ? 'This page does not exist.' : 'Esta página no existe.' }}</h1>
        <p>{{ $isEnglish ? 'The link may have changed or the address may be incorrect.' : 'Puede que el enlace haya cambiado o que la dirección no esté escrita correctamente.' }}</p>
        <nav aria-label="{{ $isEnglish ? 'Recovery links' : 'Enlaces de recuperación' }}">
            <a href="/">{{ $isEnglish ? 'Home' : 'Inicio' }}</a>
            <a href="/#servicios">{{ $isEnglish ? 'Services' : 'Servicios' }}</a>
            <a href="/#colaboraciones">{{ $isEnglish ? 'Projects' : 'Proyectos' }}</a>
            <a href="/#blog">Blog</a>
            <a href="/#contacto">{{ $isEnglish ? 'Contact' : 'Contacto' }}</a>
        </nav>
    </main>
</body>
</html>

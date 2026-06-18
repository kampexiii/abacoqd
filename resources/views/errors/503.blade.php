@php
    $isEnglish = app()->getLocale() === 'en';
@endphp
<!DOCTYPE html>
<html lang="{{ $isEnglish ? 'en' : 'es' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>{{ $isEnglish ? 'Maintenance' : 'Mantenimiento' }} - AbacoQD</title>
    <style>
        :root {
            color-scheme: light dark;
            --ink: #04121b;
            --surface: #0f2f38;
            --teal: #18b7b0;
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
                radial-gradient(circle at 50% 20%, rgba(24, 183, 176, 0.1), transparent 28rem),
                linear-gradient(180deg, var(--white), var(--mist));
        }

        .card {
            width: min(100%, 600px);
            padding: clamp(1.5rem, 4vw, 3rem);
            border: 1px solid rgba(8, 127, 140, 0.18);
            border-radius: 28px;
            background: rgba(255, 255, 255, 0.74);
            box-shadow: 0 30px 90px rgba(7, 17, 26, 0.12);
            backdrop-filter: blur(18px);
        }

        .brand { display: flex; align-items: center; gap: .75rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
        .brand img { width: 2.5rem; height: 2.5rem; }
        .code { margin: 1.5rem 0 0; color: transparent; font-size: clamp(5rem, 18vw, 9rem); font-weight: 800; letter-spacing: -.06em; line-height: .86; -webkit-text-stroke: 1px rgba(8, 127, 140, .34); }
        h1 { margin: 1rem 0 0; font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.06; }
        p { max-width: 30rem; margin: 1rem 0 0; color: rgba(4, 18, 27, .7); line-height: 1.7; }
        .status { margin-top: 2rem; color: rgba(4, 18, 27, .6); font-size: .78rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }

        @media (prefers-color-scheme: dark) {
            body { color: var(--white); background: radial-gradient(circle at 50% 20%, rgba(24, 183, 176, 0.12), transparent 28rem), linear-gradient(180deg, var(--ink), var(--surface)); }
            .card { border-color: rgba(122, 191, 191, .18); background: rgba(4, 18, 27, .66); box-shadow: 0 34px 110px rgba(0, 0, 0, .38); }
            p, .status { color: rgba(247, 251, 252, .7); }
        }
    </style>
</head>
<body>
    <main class="card">
        <div class="brand">
            <picture>
                <source srcset="/assets/branding/marca/logos/abacoqd-isotipo-mono-white.svg" media="(prefers-color-scheme: dark)">
                <img src="/assets/branding/marca/logos/abacoqd-isotipo-mono-ink.svg" alt="">
            </picture>
            <span>AbacoQD</span>
        </div>
        <div class="code">503</div>
        <h1>{{ $isEnglish ? 'Improving the platform.' : 'Mejorando la plataforma.' }}</h1>
        <p>{{ $isEnglish ? 'We will be back shortly.' : 'Volvemos enseguida.' }}</p>
        <div class="status">{{ $isEnglish ? 'Service temporarily unavailable' : 'Servicio temporalmente no disponible' }}</div>
    </main>
</body>
</html>

# Roadmap de cierre técnico — AbacoQD

> Plan de cierre para llevar AbacoQD a producción con el menor riesgo posible.
> Derivado de [auditoria25Junio.md](auditoria25Junio.md). Fecha: **25/06/2026**.
> Stack real: **Laravel 13.15.0 · PHP 8.4.12 · Inertia · React 19 · TypeScript · Tailwind v4 · SQLite (local)**. Rama: `master`. Mail driver actual: `log`.
>
> **Criterio rector:** precisión antes que velocidad. Cambios quirúrgicos. Sin refactors grandes, sin "ya que estamos", sin reescrituras. No tocar BD/migraciones sin confirmación. No tocar hero, landing, topbar, footer, cookies, blog ni admin salvo lo estrictamente necesario.
>
> **Regla de proceso AbacoQD:** si durante un bloque aparece un error, warning crítico o incidencia técnica verificable, no se ignora aunque pertenezca parcialmente a otro bloque. Se lista, diagnostica, resuelve si es razonable y seguro, se documenta en `docs/auditoria25Junio.md` y en este roadmap, y no se avanza al bloque siguiente hasta dejarlo cerrado o claramente bloqueado.

Leyenda: `P0` bloquea producción/seguridad · `P1` importante antes de producción · `P2` recomendable · `DEP-ANDRÉS` dependencia de contenido externa · `DECISIÓN` decisión técnica/negocio · `WIP` archivos sin commit.

---

## 0. Estado de partida (25/06)

- Validaciones base **verdes**: `composer test` 184/184 · `tsc` limpio · `eslint` limpio · `build` OK. Tras la revisión CSP inline: `types:check`, `lint:check`, `cmd.exe /C npm run build` y `composer test` (revalidado con PHP de XAMPP) verdes.
- **Correo**: `MAIL_MAILER=log` en local (se escribe en `storage/logs/laravel.log`). Contacto y **reserva envían correo** (Bloque 3 cerrado el 25/06: Mailable `AppointmentBookingReceived` + receptor `SiteSettings::bookingRecipient()`). Entrega SMTP real **ya validada** con cuenta temporal; falta configurar el **SMTP corporativo** definitivo en producción.
- **Seguridad**: Bloque 1 **CERRADO** (cabeceras + CSP report-only añadidas; incidencia `public/hot` resuelta; advertencia CSP inline diagnosticada y resuelta; `composer test` revalidado en verde con PHP de XAMPP y revisión visual/interactiva confirmada por Pablo el 25/06; ver [auditoría §0](auditoria25Junio.md)). Sigue pendiente para fases posteriores: flip de CSP a enforce, ocultar `X-Powered-By`, `APP_DEBUG=true`/`APP_ENV=local` (Bloque 2).
- **WIP en árbol**: **Bloque 4 CERRADO (26/06)** — shim CSP/Vite (`vite.config.ts` + `resources/js/vendor/`), `.odt` ignorado, 21 `.webp` commiteadas como assets reales, seeder editorial temporal eliminado (untracked) y `BlogPostSeeder` eliminado como fuente duplicada. Tras el cierre no queda WIP en el árbol salvo la documentación de este cierre. Sin push.
- **`.env` local**: probado el 25/06 con una cuenta SMTP temporal de pruebas (entrega real validada); **datos temporales retirados** tras la validación. El `.env` queda en `MAIL_MAILER=log`, `MAIL_PASSWORD` vacío y receptores `info@abacodev.com`, preparado para SMTP corporativo final. El `.env` es gitignored y no se commitea.
- **El `.odt`** = plantilla orientativa de Pablo. Todo el contenido en BD (servicios, proyectos, partners, metodología, equipo) es **demo/placeholder/legacy** hasta validación de Andrés.

---

## 1. Matriz de bloques

| # | Bloque | Prioridad | Bloqueado por |
|---|---|---|---|
| 1 | Cabeceras de seguridad + CSP report-only | **P0** | ✅ **CERRADO** (CSP inline resuelta; `composer test` + visual validados 25/06) |
| 2 | Hardening de entorno (prod `.env`, debug off, X-Powered-By) | **P1** | — |
| 3 | Correo real contacto + **reserva** (Mailable nuevo) | **P1** | ✅ **CERRADO** (código + diseño + SMTP real validado 25/06; falta SMTP corporativo en prod) |
| 4 | Cierre de WIP local (shim CSP, blog assets, seeders, docs) | **WIP** | ✅ **CERRADO** (26/06; 4 commits por rutas explícitas, sin push) |
| 5 | Contenido DEMO/plantilla/placeholder | **DEP-ANDRÉS** | Andrés |
| 6 | Contenido pendiente de Andrés | **DEP-ANDRÉS** | Andrés |
| 7 | Proyectos/Partners/Colaboraciones (limpieza legacy + media + CIETE) | **P0 legal** | 🔄 **EN CURSO** (7.7A + 7.2 cerradas 26/06; P0 legal resuelto) |
| 8 | Producción/despliegue | **P1** | bloques 1-3 |
| 9 | QA final (cross-browser + a11y) | **P1** | bloques 1-8 |
| — | CSP estricta (flip report-only → enforce) | **DECISIÓN/P1** | tras tunear |

---

## 2. Orden de ejecución recomendado

```
0. Commit del shim CSP (prerequisito; ya está en el árbol).
1. BLOQUE 1 — Seguridad: middleware de cabeceras + CSP report-only.   ← cerrado (25/06)
2. `composer test` con PHP de XAMPP + revisión visual/interactiva rápida.   ← completado (25/06)
3. BLOQUE 3 — Correo contacto/reserva.   ← cerrado (25/06; código + prueba log. SMTP real pendiente de creds)
4. BLOQUE 4 — Cierre de WIP (shim CSP, blog assets, seeders, docs).   ← cerrado (26/06)
5. BLOQUE 2 — Hardening de entorno (preparar .env de producción).
6. BLOQUE 7 — Decisión legal/permisos (despublicar / marcar DEMO). En paralelo, no técnico.
7. CSP estricta (flip a enforce) tras tunear nonce JSON-LD y Three.js/estilos.
8. BLOQUE 9 — QA final cross-browser + accesibilidad.
```

**Primer bloque = Seguridad.** Es P0, el más independiente de Andrés y de **riesgo mínimo**: las cabeceras estáticas no afectan al render ni al hero, y la CSP entra en **Report-Only** (solo reporta, no bloquea) → no rompe Vite ni el hero, sin `unsafe-eval` ni relajar nada. El shim WIP de `vite.config.ts` es justo la base para una CSP futura sin `unsafe-eval`.

---

## 3. Bloques en detalle

### Bloque 1 — Seguridad (P0) — ✅ CERRADO (25/06)

**Estado real:** cabeceras añadidas y CSP mantenida en `Content-Security-Policy-Report-Only`, sin enforce, sin `unsafe-eval` y sin `unsafe-inline` en `script-src`. La incidencia anterior de `public/hot` quedó resuelta y separada del middleware. La nueva advertencia de navegador se confirmó como un inline script propio de tema/apariencia en `resources/views/app.blade.php` y se resolvió moviéndolo a `public/assets/appearance-init.js`. DevTools/Chrome CDP posterior ya no reporta la violación CSP (`[]`). **Sin commit aún.**

**Validación final (25/06):** `route:list` con PHP de XAMPP → 160 rutas; `curl -I` → CSP Report-Only presente, sin enforce, sin `unsafe-eval`, sin `unsafe-inline` en `script-src`; `types:check`, `lint:check` y `cmd.exe /C npm run build` → verdes. `composer test` revalidado con PHP de XAMPP (`C:\xampp\php\php.exe C:\ProgramData\ComposerSetup\bin\composer.phar test`) → **verde**: Pint OK · PHPStan 0 errores · Pest 184/184, 910 aserciones. Revisión visual/interactiva rápida completada y confirmada manualmente por Pablo en DevTools: sin errores ni warnings visuales relacionados con CSP, sin errores rojos críticos en consola. Bloque 1 cerrado; queda habilitado el avance al Bloque 3.

**Objetivo:** defensa en profundidad sin romper nada.

**Archivos:**
- `app/Http/Middleware/SecurityHeaders.php` *(nuevo)*
- `bootstrap/app.php` *(registrar en grupo `web`, append)*
- `resources/views/app.blade.php` *(sin script ejecutable inline de apariencia; usa `data-appearance` + asset externo)*
- `public/assets/appearance-init.js` *(nuevo asset externo same-origin para tema temprano)*
- Prereq: commitear shim WIP (`vite.config.ts` + `resources/js/vendor/es-toolkit-global-this.ts`).

**Cabeceras:**
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` → **solo** si `request->secure() && app()->isProduction()`
- `Content-Security-Policy-Report-Only` (NO enforce, **implementada**): `default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; media-src 'self'; worker-src 'self' blob:; manifest-src 'self'; form-action 'self'`

**Reglas duras:** no `unsafe-eval`, no relajar CSP, no tocar el hero ni componentes protegidos, no reintroducir CMP, mantener aviso simple de cookies técnicas, HSTS solo en prod/HTTPS.

**Validación:** `curl -I`, luego `composer test`, `npm run types:check`, `npm run lint:check`, `npm run build`. Confirmar que home y hero cargan sin errores en consola. Estado actual: las cuatro puertas en verde y revisión visual confirmada; Bloque 1 cerrado, avance a Bloque 3 habilitado.

### Bloque 2 — Hardening de entorno (P1)

**Objetivo:** dejar el entorno listo para prod (sin código).

**Acciones:** `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://abacoqd.com`, `SESSION_SECURE_COOKIE=true`, revisar `SESSION_SAME_SITE`/`TRUSTED_PROXIES`, ocultar `X-Powered-By` (`expose_php=Off`), SMTP real. Documentar claves en `.env.example`.

### Bloque 3 — Correo contacto + reserva (P1) — ✅ CERRADO (25/06)

**Estado real:** notificación de reserva implementada y **aprobada** el 25/06, con **diseño corporativo** en ambos emails (contacto y reserva) y **logo AbacoQD embebido por CID**. `composer test` verde (Pest 189/189, 934 aserciones, +5 tests de reserva), `types:check`/`lint:check`/`build` verdes. **Prueba SMTP real validada** con una cuenta temporal de pruebas: contacto y reserva llegaron a **bandeja principal** (no spam/promociones). Los **datos temporales personales se retiraron** de `.env`, `.env.example` y documentación; el proyecto queda preparado para SMTP corporativo final. PNG de marca reubicados en `public/assets/branding/marca/logos/abacoqd-logo-completo-transparente.png` y `…/abacoqd-isotipo-transparente.png`. Contacto sigue funcionando sin cambios. **Pendiente de producción:** SMTP corporativo del dominio de Ábaco, correos reales confirmados por Andrés, añadir `Reply-To` con el email del remitente y revisar SPF/DKIM/DMARC. Sin commit aún (pendiente de stage por rutas explícitas).

**Decisión A = SÍ:** implementar notificación de reserva (espejo de contacto). **Decisión B = SÍ:** probar entrega real con una cuenta SMTP temporal en local (ya realizada y retirada el 25/06).

**Archivos:**
- `app/Mail/AppointmentBookingReceived.php` *(nuevo, espejo de `ContactMessageReceived`)*
- `resources/views/emails/appointment-booking-received.blade.php` *(nuevo, espejo del de contacto)*
- `app/Http/Controllers/Public/BookingController.php` *(enviar tras la transacción, solo si se creó; try/catch + `Log::error`)*
- `app/Support/SiteSettings.php` *(añadir `bookingRecipient()` espejo de `formRecipient()`)*
- `config/site.php` *(clave `contact.booking_recipient` con fallback al receptor de contacto)*
- `.env` local *(SMTP + opcional `BOOKING_NOTIFY_EMAIL`)* · `.env.example` *(documentar `BOOKING_NOTIFY_EMAIL=`)*
- `tests/Feature/...` *(test de envío de reserva, espejo del de contacto)*

**Receptor:** `BOOKING_NOTIFY_EMAIL` separada y clara, con **fallback** a `CONTACT_NOTIFY_EMAIL` → durante la prueba ambos fueron al mismo buzón sin config extra; en prod se separan. Nunca hardcodear el correo en el controlador. **No** cambiar el email público del footer ni datos legales.

**Reglas de correcto funcionamiento:**
- Contacto: se guarda en `contact_messages` + genera correo + (con SMTP) llega al receptor configurado.
- Reserva: se guarda en `appointment_bookings` + genera correo + (con SMTP) llega al receptor configurado.
- El correo de reserva se envía **fuera** de la transacción y solo si la reserva se creó (si el slot no está disponible, lanza `ValidationException` y no se envía nada).
- No duplicar registros; no romper el flujo visual de confirmación; mantener CSRF, honeypot y throttle.

**Variables `.env` para producción (según `config/mail.php`, que usa `MAIL_SCHEME`, NO `MAIL_ENCRYPTION`):** configurar con el **SMTP corporativo** del dominio de Ábaco (placeholders, sin credenciales reales en docs).

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.example.com               # host SMTP corporativo de Ábaco
MAIL_PORT=587
MAIL_USERNAME=info@abacodev.com          # cuenta autenticada del dominio
MAIL_PASSWORD=                           # secreto solo en .env, nunca en docs/repo
MAIL_SCHEME=null                         # 587 = STARTTLS automático
MAIL_FROM_ADDRESS="info@abacodev.com"    # From = cuenta corporativa autenticada
MAIL_FROM_NAME="AbacoQD"
CONTACT_NOTIFY_EMAIL=info@abacodev.com   # destinatario interno real
BOOKING_NOTIFY_EMAIL=info@abacodev.com   # destinatario interno real (opcional; si no, usa el de contacto)
```

- `MAIL_FROM_ADDRESS` debe ser una **cuenta autenticada del dominio corporativo** (no el email del usuario del formulario, que va como `Reply-To`).
- Revisar **SPF, DKIM y DMARC** del dominio antes de producción.
- Puerto 465 (TLS implícito): `MAIL_PORT=465` y `MAIL_SCHEME=smtps`.
- **No** añadir `MAIL_ENCRYPTION` (el proyecto lo ignora).
- Tras editar `.env`: **`php artisan config:clear`**.
- *Validación histórica (25/06):* la entrega real se probó con una cuenta SMTP temporal de pruebas (retirada tras validar); contacto y reserva llegaron a bandeja principal.

**Qué mirar en `storage/logs/laravel.log`:** con `log`, el correo aparece con `To:`/`Subject:`; con SMTP, un fallo registra `No se pudo enviar...` (el lead/reserva igualmente queda guardado).

### Bloque 4 — Cierre de WIP local — **CERRADO** (26/06)

Cerrado por rutas explícitas, sin `git add .`/`-A`, sin push, sin tocar BD/seeders/migraciones. Detalle completo y auditoría de seeders en [auditoría §0 · Bloque 4](auditoria25Junio.md).

- **Shim CSP**: `4445568 build(csp)` — `vite.config.ts` + `resources/js/vendor/es-toolkit-global-this.ts` (base de CSP sin `unsafe-eval`).
- **`.odt`**: `2262e33 chore(docs)` — regla específica en `.gitignore`; la plantilla deja de ser untracked y **no** se versiona.
- **Imágenes blog**: `1da653a assets(blog)` — 21 `.webp` commiteadas como **assets reales** (no temporales; mismo criterio para logos/partners/proyectos/servicios/equipo). Ninguna borrada.
- **Seeders editoriales**: `BlogEditorialJulyAugust2026Seeder` eliminado por untracked; `d2760c4 chore(seeders)` elimina `BlogPostSeeder` y su llamada en `DatabaseSeeder`. Política: **no** mantener seeders editoriales/de posts como fuente duplicada de contenido ya en BD.
- **Docs**: este cierre actualiza `docs/auditoria25Junio.md` + `docs/roadmapCierre25Junio.md`.
- **Propuesta futura (no implementada)**: mecanismo de backup/snapshot versionable al guardar servicios/proyectos/partners/equipo/settings desde admin; sustituye seeders editoriales manuales; se diseña aparte y se confirma antes de tocar código. No aplica al blog editorial.

### Bloques 5 y 6 — Contenido demo / pendiente de Andrés (DEP-ANDRÉS)

No cargar nada del `.odt` como real. Si no hay contenido confirmado: estados vacíos honestos o marcado DEMO. Pendiente de Andrés: textos "Quiénes somos", catálogo real de servicios y metodología, proyectos reales, fotos/bios de equipo, reseñas reales, emails finales, usuario real del panel, teléfono legal, redes, horarios, política de `abacodev.com`.

### Bloque 7 — Proyectos / Partners / Colaboraciones — **EN CURSO** (26/06)

**Subfase 7.7A (CERRADA 26/06):** `ConfirmedProjectsSeeder` con CIETE (proyecto real, en solitario, sin partner). Commit `4769f18`.

**Subfase 7.2 (CERRADA 26/06):** resuelto el **P0 legal**. Eliminados los 11 proyectos + 17 partners legacy de la BD local; retirado `AbacoHistoricalProjectsSeeder`; borrado el fallback estático de marcas (`company-logos.ts`) con estado vacío honesto en Colaboraciones. **Queda solo CIETE.** Retirado el concepto visible de «Permiso» del admin: la publicación se controla por estado + visibilidad; `permission_status` queda como compatibilidad interna (`approved`), sin migración (la columna no se elimina todavía). Validaciones verdes (Pest 189/189). Sin push. Detalle en [auditoría §0 · Bloque 7](auditoria25Junio.md).

**Subfase 7.3 (CERRADA 26/06):** media de proyecto simplificada. Imagen única que alimenta portada **y** miniatura (sin subida manual de miniatura); logos de cliente color/monocromo + `logo_alt` añadidos a `projects` (migración aditiva aplicada con `migrate`); `ProjectImageService` convierte raster→WebP y conserva SVG. Tests `ProjectMediaTest` (Pest 192/192). Sin push.

**Subfase 7.4 (CERRADA 26/06):** presentación pública de Proyecto/Colaboraciones replanteada. Relación M:N `project_service` (servicio elegido desde `services`, no texto libre); detalle de proyecto sin `approved`/`permiso`/`Rol`/«Quién participa», con cliente+logo (color/mono por tema), chips de servicios y desarrollo solo/cooperativo; Colaboraciones muestra proyectos/casos (no logos sueltos) con estado vacío honesto. CIETE = desarrollado en solitario, asociado a 3 servicios reales. Tests `ProjectPresentationTest` (Pest 196/196). Sin push.

**Pendiente del bloque (próximas subfases):** snapshots/backup seeders (partners→projects), revisión jurídica de textos legales y PII (IP/User-Agent) en privacidad. Eliminación definitiva de la columna `permission_status` queda para una migración futura aparte.

### Bloque 8 — Producción / despliegue (P1)

Ver checklist en §6.

### Bloque 9 — QA final (P1)

Cross-browser (Chrome/Firefox/Brave) + accesibilidad (teclado, foco, contraste, `prefers-reduced-motion`, alt, headings). Requiere navegador real.

### CSP estricta — flip a enforce (DECISIÓN)

Tras tunear: nonce/hash para el JSON-LD inline y verificar Three.js/estilos. Aplicar enforce solo en producción y tras validar con report-only sin violaciones.

---

## 4. Microcommits propuestos (separados)

```
1. build(csp): shim CSP-safe para globalThis de es-toolkit
   vite.config.ts, resources/js/vendor/es-toolkit-global-this.ts

2. docs(auditoria): informe 25/06 + roadmap de cierre (+ corregir Laravel 13)
   docs/auditoria25Junio.md, docs/roadmapCierre25Junio.md
   (+ docs/informacionRequeridaSitioWeb.odt si se versiona)

3. feat(security): cabeceras de seguridad + CSP report-only
   app/Http/Middleware/SecurityHeaders.php, bootstrap/app.php

4. feat(booking): notificar nuevas reservas por correo
   app/Mail/AppointmentBookingReceived.php,
   resources/views/emails/appointment-booking-received.blade.php,
   app/Http/Controllers/Public/BookingController.php,
   app/Support/SiteSettings.php, config/site.php,
   .env.example (BOOKING_NOTIFY_EMAIL=), tests/Feature/...

5. [HECHO 26/06] Bloque 4 — cierre de WIP (4 commits por rutas explícitas):
   - 4445568 build(csp): vite.config.ts + resources/js/vendor/es-toolkit-global-this.ts
   - 2262e33 chore(docs): .gitignore (ignora docs/informacionRequeridaSitioWeb.odt)
   - 1da653a assets(blog): public/uploads/blog/posts/*.webp (21 portadas reales)
   - d2760c4 chore(seeders): elimina BlogPostSeeder + llamada en DatabaseSeeder
   (El seeder editorial julio/agosto se descartó: untracked, no se versiona.)
```

> Stagear siempre por rutas explícitas. Nunca `git add .` / `-A`. El `.env` con SMTP **no se commitea** (gitignored).

---

## 5. Prompts listos para ejecutar

### 5.1 Bloque 1 — Seguridad

```text
Implementa el bloque de seguridad de AbacoQD. Cambios quirúrgicos, sin tocar hero/landing/topbar/footer/cookies/blog/admin, sin unsafe-eval, sin relajar CSP, sin CMP.

1. Crea app/Http/Middleware/SecurityHeaders.php que añada a respuestas web:
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Referrer-Policy: strict-origin-when-cross-origin
   - Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()
   - Cross-Origin-Opener-Policy: same-origin
   - Cross-Origin-Resource-Policy: same-origin
   - Strict-Transport-Security: max-age=31536000; includeSubDomains  → SOLO si $request->secure() && app()->isProduction()
   - Content-Security-Policy-Report-Only (NO enforce): default-src 'self'; base-uri 'self';
     frame-ancestors 'none'; object-src 'none'; img-src 'self' data:; font-src 'self';
     style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'.
2. Regístralo en bootstrap/app.php en el grupo web (append), después de los middleware existentes. No quites encryptCookies ni HandleInertiaRequests.
3. NO toques vite.config.ts (su shim ya está). NO añadas unsafe-eval. NO conviertas la CSP a enforce.
4. Valida: curl -I http://127.0.0.1:8000/ , luego composer test, npm run types:check, npm run lint:check, npm run build. Todo verde.
5. Reporta el curl -I y confirma que el hero y la home cargan sin errores en consola. No commitees; primero enséñame el diff.
```

### 5.2 Bloque 3 — Correo contacto/reserva

```text
Implementa la notificación de reserva por correo en AbacoQD (Decisión A = sí), reutilizando el patrón de contacto. Sin hardcodear correos, sin tocar el email público del footer ni datos legales, sin tocar hero/landing/topbar/footer/cookies/blog/admin.

1. config/site.php: bajo 'contact', añade
   'booking_recipient' => env('BOOKING_NOTIFY_EMAIL') ?: env('CONTACT_NOTIFY_EMAIL', 'info@abacodev.com'),
2. app/Support/SiteSettings.php: añade bookingRecipient() espejo de formRecipient(), leyendo setting 'booking_recipient_email' con fallback a config('site.contact.booking_recipient').
3. app/Mail/AppointmentBookingReceived.php: Mailable espejo de ContactMessageReceived (recibe AppointmentBooking, asunto "Nueva reserva desde AbacoQD · {fecha/hora}", markdown 'emails.appointment-booking-received', carga slot.day y service).
4. resources/views/emails/appointment-booking-received.blade.php: espejo del de contacto, con datos de la reserva (nombre, email, teléfono, empresa, servicio, fecha/hora del slot, mensaje, consentimientos).
5. app/Http/Controllers/Public/BookingController.php@store: tras la DB::transaction que crea la reserva (fuera de la transacción, solo si se creó), envía Mail::to(SiteSettings::bookingRecipient())->send(new AppointmentBookingReceived($booking)) dentro de try/catch con Log::error en fallo (igual que ContactController). No cambies el flujo de confirmación ni el redirect.
6. .env.example: añade comentada BOOKING_NOTIFY_EMAIL= (sin valor).
7. tests/Feature: añade test que envíe la reserva y afirme Mail::assertSent(AppointmentBookingReceived) al receptor, que la reserva se guarda y que NO se envía si el slot no está disponible.
8. Valida con Mail::fake en tests + composer test, types:check, lint:check, build. No commitees; enséñame el diff.

Nota: el `.env` local con el SMTP de pruebas y `BOOKING_NOTIFY_EMAIL` lo configura el responsable (credenciales solo en `.env`, nunca en repo/docs); ejecutar `php artisan config:clear` para la prueba de entrega real. En producción se usa el SMTP corporativo del dominio de Ábaco.
```

---

## 6. Checklist de producción

```txt
[ ] APP_ENV=production / APP_DEBUG=false / APP_URL=https://abacoqd.com / APP_TIMEZONE=Europe/Madrid
[ ] SESSION_SECURE_COOKIE=true (HTTPS); revisar SAME_SITE / TRUSTED_PROXIES
[ ] SMTP corporativo (no log, no cuenta personal de pruebas); From corporativo autenticado + Reply-To del usuario; SPF/DKIM/DMARC revisados; probar contacto y reserva
[ ] Cabeceras de seguridad activas; CSP enforce tras tuneo; ocultar X-Powered-By
[ ] CONTACT_NOTIFY_EMAIL y BOOKING_NOTIFY_EMAIL = correos reales confirmados por Andrés
[ ] Decisión legal de proyectos/partners (despublicar/DEMO) + revisión jurídica de legales
[ ] Contenido real de Andrés cargado (sustituir demo) o estados vacíos honestos
[ ] Reproducibilidad de seeders (portadas del blog) + usuario admin real + 2FA si aplica
[ ] migraciones aplicadas; decisión de seeders de producción
[ ] storage:link + permisos storage/ y bootstrap/cache; cache de config/rutas/vistas; build prod
[ ] sitemap/robots/canonical a dominio final (no localhost); decisión sobre abacodev.com
[ ] SSL, backups, logs y monitorización básica
[ ] Bump de dependencias con CVE (guzzle/psr7) y tooling npm
[ ] QA cross-browser + accesibilidad superados
```

---

## 7. Qué revertir/cambiar antes de producción (correo)

- `MAIL_MAILER` → SMTP corporativo real (nunca `log`, nunca una cuenta personal de pruebas).
- `MAIL_FROM_ADDRESS`/`MAIL_FROM_NAME` → remitente **autenticado** del dominio corporativo final.
- `CONTACT_NOTIFY_EMAIL` y `BOOKING_NOTIFY_EMAIL` → correos internos reales confirmados por Ábaco / Andrés.
- Añadir `Reply-To` con el email del usuario del formulario en ambos Mailables (el `From` no debe ser el email del usuario); revisar **SPF, DKIM y DMARC** del dominio.
- La notificación de reserva queda **permanente** (no temporal).

---

## 8. Decisiones abiertas

- Flip de CSP report-only → enforce (nonce JSON-LD, Three.js/estilos).
- ~~`featured_image` del seeder editorial y si entra en `DatabaseSeeder`~~ → **resuelto (26/06)**: seeders editoriales de blog descartados; portadas versionadas como assets.
- ~~¿Se versiona el `.odt`?~~ → **resuelto (26/06)**: no se versiona, ignorado en `.gitignore`.
- Diseñar el mecanismo futuro de **backup/snapshot** de contenido crítico (servicios/proyectos/partners/equipo/settings) — pendiente de diseño y confirmación.
- Auditoría de seeders: ~~`AbacoHistoricalProjectsSeeder` (riesgo legal Bloque 7)~~ → **eliminado (26/06, subfase 7.2)**; revisar aún `TeamMemberSeeder` y el `Test User`/`AdminUserSeeder` (guardas de entorno).
- ~~Permisos de proyectos/partners~~ → **resuelto (26/06)**: gestión visible de «permiso» retirada del admin; columna `permission_status` queda como compatibilidad interna (`approved`); eliminación de la columna pendiente de migración futura.
- ¿`BOOKING_NOTIFY_EMAIL` separada (recomendado, con fallback a contacto) o receptor compartido?
- Permisos de proyectos/partners/logos/reseñas (negocio + Andrés).

---

## 9. Limpieza final de textos publicos y payload - 26/06

Estado: cerrado a nivel de fuentes publicas, payload y build. Queda pendiente ejecutar `composer test` fuera del sandbox.

Hecho:

- Limpieza de copy publico ES/EN en cookies, chatbot, contacto, aviso legal EN, politica de cookies EN, detalle de proyecto y estados vacios.
- Sanitizacion de payload publico: el detalle de proyecto ya no envia `permissionNotes`, `settings` completos, `permissionStatus` ni `isApproved`.
- Retirada de badges/fallbacks publicos de permisos o validacion en proyectos y colaboraciones.
- Neutralizacion de seeders/settings publicables: sin `confirmed_by_pablo`, sin `pending_final_approval`, sin etiquetas publicas de contacto directo a Andres.
- Retirada de `be now Partner` y logos/entradas no verificadas de manifiestos publicos.
- Renombrado de constante interna `PABLO_WAVE_PATH` a `WAVE_PATH`.
- Documentacion actualizada en `docs/limpieza.md` y `docs/auditoria25Junio.md`.

Validaciones:

- `npm run types:check`: verde.
- `npm run lint:check`: verde.
- `cmd.exe /C npm run build`: verde.
- Busqueda de cierre en fuentes publicas, `public/assets` y `public/build`: sin restos exactos de las frases criticas eliminadas.
- `composer test`: no ejecutado; bloqueado por el sandbox al invocar PHP/Composer de XAMPP.

Siguiente accion recomendada:

1. Ejecutar `composer test` en entorno local Windows/XAMPP sin sandbox.
2. Si se commitea, stagear por rutas explicitas; no usar `git add .` ni `git add -A`.

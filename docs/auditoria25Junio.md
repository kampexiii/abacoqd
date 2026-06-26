# Auditoría global AbacoQD — 25 de junio de 2026

> Documento **vivo** de auditoría y seguimiento. La auditoría inicial no modificó código ni BD; a partir de su cierre, este documento **registra la ejecución de los bloques** del [roadmap](roadmapCierre25Junio.md) (ver §0). Foto del estado real cruzada con `/docs` y verificada contra el código, la BD local y el sitio en ejecución.
>
> Stack: Laravel 13.15.0 (PHP 8.4.12) · Inertia · React 19 · TypeScript · Tailwind v4 · SQLite (local).
> Rama actual: `master`. Fecha de referencia: `2026-06-25`.

Leyenda de prioridad:

```txt
P0  = bloquea producción / seguridad crítica / rompe funcionalidad
P1  = importante antes de producción
P2  = mejora recomendable
P3  = mejora futura
DEP-ANDRÉS = dependencia externa de contenido (no la resuelve el equipo técnico)
DECISIÓN   = pendiente de decisión técnica/negocio
WIP        = archivos sin commit o sin decisión de cierre
```

---

## 0. Registro de ejecución de bloques (vivo)

> Bitácora que se actualiza al cerrar o bloquear cada bloque del [roadmap](roadmapCierre25Junio.md).

### Bloque 1 — Seguridad / cabeceras / CSP report-only — **CERRADO** (25/06)

**Estado real:** cabeceras de seguridad implementadas y CSP en `Content-Security-Policy-Report-Only`. La incidencia nueva de CSP Report-Only por inline script en el HTML inicial quedó **diagnosticada y resuelta** moviendo el inicializador de tema/apariencia a un asset externo same-origin. Revalidación completada el 25/06: `composer test` con PHP de XAMPP en verde (Pint OK · PHPStan 0 errores · Pest 184/184, 910 aserciones) y revisión visual/interactiva en DevTools confirmada manualmente por Pablo sin errores ni warnings visuales relacionados con CSP, ni errores rojos críticos en consola. Las cuatro puertas de validación (`composer test`, `types:check`, `lint:check`, `build`) quedan en verde. **Commiteado** el 25/06 por rutas explícitas: `f478762 feat(security)` (middleware + asset de apariencia) y `75af905 docs(auditoria)` (cierre documental). Sin push. Bloque 1 cerrado; queda habilitado el avance al Bloque 3.

**Archivos modificados:**
- `app/Http/Middleware/SecurityHeaders.php` *(nuevo)*
- `bootstrap/app.php` *(registro del middleware en el grupo `web`, append, sin tocar los existentes)*
- `resources/views/app.blade.php` *(elimina el script ejecutable inline de tema; añade `data-appearance` y carga `/assets/appearance-init.js`)*
- `public/assets/appearance-init.js` *(nuevo inicializador temprano de tema/apariencia, permitido por `script-src 'self'`)*
- `docs/auditoria25Junio.md`
- `docs/roadmapCierre25Junio.md`

**Cabeceras añadidas** (no pisan cabeceras ya presentes): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`, `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`, `Content-Security-Policy-Report-Only` (CSP base, **sin enforce, sin `unsafe-eval`, sin terceros**), `Strict-Transport-Security` **solo** en prod+HTTPS.

**`curl -I http://127.0.0.1:8000/`:** las 6 cabeceras estáticas + `Content-Security-Policy-Report-Only` presentes; **sin** `Content-Security-Policy` enforce; **sin** `unsafe-eval`; **sin `unsafe-inline` en `script-src`** (`style-src 'unsafe-inline'` sigue igual por estilos inline del stack); HSTS ausente en local http (correcto).

**Incidencia `public/hot` resuelta:** El fallo de `SeoRobotsTest` fue causado por un `public/hot` obsoleto que apuntaba a un servidor Vite caído. No estaba relacionado con el middleware de cabeceras. Se resolvió retirando el `public/hot` huérfano. Con el middleware activo y sin `public/hot`, las validaciones vuelven a verde.

**Incidencia CSP Report-Only detectada:** CSP Report-Only detecta un inline script en el HTML inicial. No bloquea todavía, pero debe resolverse o documentarse antes de pasar a CSP enforce.

**Diagnóstico CSP:** Chrome DevTools/CDP confirmó antes del cambio un `ContentSecurityPolicyIssue` con `violatedDirective: script-src-elem`, `isReportOnly: true`, `contentSecurityPolicyViolationType: kInlineViolation`, `sourceCodeLocation` en `http://127.0.0.1:8000/` línea 7. El origen real era el `<script>` ejecutable de tema/apariencia en `resources/views/app.blade.php`; no venía de `public/hot` (no existe), React Refresh/Vite dev (HTML servido desde `public/build`), JSON-LD ni Inertia JSON.

**Solución aplicada:** el script inline de tema se movió a `public/assets/appearance-init.js` y el layout expone la preferencia con `data-appearance="{{ $appearance ?? 'system' }}"`. El script se sirve como `<script src=".../assets/appearance-init.js"></script>`, same-origin y compatible con `script-src 'self'`. No se añadió `unsafe-inline`, no se añadió `unsafe-eval`, no se relajó la CSP y la cabecera sigue en Report-Only.

**Validaciones tras la revisión CSP:**
- `php artisan route:list`: en WSL falla por `php: not found`; revalidado con PHP de XAMPP (`/mnt/c/xampp/php/php.exe artisan route:list`) → **160 rutas**.
- `curl -I http://127.0.0.1:8000/` con `curl.exe` contra `artisan serve` de XAMPP → **200 OK**, `Content-Security-Policy-Report-Only` presente, **sin** `Content-Security-Policy` enforce, **sin** `unsafe-eval`, **sin** `unsafe-inline` en `script-src`.
- HTML inicial: ya no contiene el script ejecutable inline de apariencia; carga `/assets/appearance-init.js`. JSON-LD e Inertia JSON permanecen como scripts no ejecutables.
- DevTools/Chrome CDP posterior → eventos CSP relevantes `[]`; desaparece la advertencia de inline script.
- `composer test`: intento WSL bloqueado por `php: not found`; revalidado con PHP de XAMPP (`C:\xampp\php\php.exe C:\ProgramData\ComposerSetup\bin\composer.phar test`) el 25/06 → **verde**: Pint OK · PHPStan 0 errores · Pest 184/184 tests, 910 aserciones.
- `npm run types:check`: **OK**.
- `npm run lint:check`: **OK**.
- `npm run build`: WSL falla por Wayfinder (`php: not found`); `cmd.exe /C npm run build`: **OK**.
- Revisión visual rápida completa (home, hero/cubo, topbar, tema claro/oscuro/sistema, consola sin rojo crítico): **completada y validada por Pablo el 25/06** mediante revisión manual en DevTools; sin errores ni warnings visuales relacionados con CSP, sin errores rojos críticos en consola.

**Riesgos pendientes:** la CSP va en **report-only** (aún no protege de inyección hasta el flip a enforce); el flip requiere tunear nonce/hash si se decide proteger JSON-LD/Inertia JSON y verificar Three.js/estilos; `X-Powered-By: PHP/8.4.12` sigue visible (se oculta en el Bloque 2). `composer test` y revisión visual/interactiva completados el 25/06; Bloque 1 cerrado, queda habilitado el avance al Bloque 3.

### Bloque 3 — Correo contacto + reserva — **CERRADO** (25/06)

**Estado real:** notificación de **reserva** por correo implementada reutilizando el patrón del formulario de **contacto**, con **diseño corporativo aprobado** en ambos emails. Contacto sigue funcionando igual (sin cambios de flujo). La reserva, tras confirmarse y persistirse dentro de la transacción, envía un aviso **fuera** de la transacción, solo si la reserva se creó, en `try/catch` con `Log::error` si falla (no rompe la confirmación al visitante ni duplica reservas). El receptor se resuelve por `SiteSettings::bookingRecipient()` (DB override `booking_recipient_email` > `config('site.contact.booking_recipient')`, que cae a `BOOKING_NOTIFY_EMAIL` y, si no, a `CONTACT_NOTIFY_EMAIL`). **Datos personales de prueba retirados** de configuración y documentación commiteables; proyecto preparado para SMTP corporativo final. **Sin commit aún** (pendiente de stage por rutas explícitas).

**Diseño de emails (aprobado):** plantillas HTML table-based con estilos inline, Gmail-safe (sin CSS externo ni Tailwind), contenedor máx 640px sobre fondo `#F6F8F7`, tarjeta blanca, acento teal `#00BFA5` y lima `#A3E635` puntual. Cabecera con **logo AbacoQD insertado como CID embebido** (`$message->embed(...)`, no depende de `localhost`); badge `Nuevo contacto`/`Nueva reserva`, bloque de datos label/valor con email clicable, mensaje con borde izquierdo teal, bloque de estado y footer discreto. Los Mailables pasaron de `markdown:` a `view:` (cambio mínimo; lógica, asunto, receptor y datos `with()` intactos).

**Assets de marca reubicados** (desde la raíz a la carpeta de marca existente):
- `public/assets/branding/marca/logos/abacoqd-logo-completo-transparente.png` *(823×168, usado en los emails)*
- `public/assets/branding/marca/logos/abacoqd-isotipo-transparente.png` *(303×168, disponible como fallback)*

**Archivos modificados:**
- `config/site.php` *(añade `contact.booking_recipient` con fallback a `CONTACT_NOTIFY_EMAIL`)*
- `app/Support/SiteSettings.php` *(nuevo método `bookingRecipient()`, espejo de `formRecipient()`)*
- `app/Mail/AppointmentBookingReceived.php` *(nuevo Mailable, espejo de `ContactMessageReceived`; carga `slot.day` y `service`; asunto con fecha/hora del slot; `view:`)*
- `app/Mail/ContactMessageReceived.php` *(`markdown:` → `view:` para la plantilla rediseñada)*
- `resources/views/emails/appointment-booking-received.blade.php` *(rediseño corporativo + logo CID)*
- `resources/views/emails/contact-message-received.blade.php` *(rediseño corporativo + logo CID + fila Origen)*
- `app/Http/Controllers/Public/BookingController.php` *(envío del correo tras la transacción, en `try/catch`)*
- `.env.example` *(bloque SMTP corporativo genérico: `smtp.example.com`, `info@abacodev.com`, sin credenciales)*
- `tests/Feature/AppointmentBookingTest.php` *(5 tests nuevos con `Mail::fake()`)*

**Reglas respetadas:** sin hardcodear correos en el controlador; sin tocar el email público del footer ni datos legales; sin tocar hero/landing/topbar/footer/cookies/blog/admin; sin credenciales SMTP en código/docs/logs; `.env` local no se commitea.

**Validaciones (verdes):**
- `composer test` (PHP de XAMPP): Pint OK · PHPStan 0 errores · Pest **189/189** tests (antes 184; +5 de reserva), 934 aserciones (las plantillas y el `embed()` del logo se ejercitan al renderizar en los tests con transporte `array`).
- `npm run types:check`: **OK** · `npm run lint:check`: **OK** · `npm run build`: **OK** (advertencias de tamaño de chunk preexistentes, no errores).

**Cobertura de los tests nuevos:** la reserva se guarda y envía `AppointmentBookingReceived` al receptor esperado; el receptor respeta la setting `booking_recipient_email`; cae a config cuando no hay setting; **no** se envía correo cuando el slot ya no está disponible (solo 1 envío en doble reserva); un mailer que falla no pierde la reserva ni rompe la respuesta.

**Prueba SMTP real:** validada correctamente el 25/06 con una **cuenta temporal de pruebas** (driver `smtp`, STARTTLS 587). Contacto y reserva llegaron a **bandeja principal** (no spam/promociones), primero en versión base, luego con diseño corporativo y finalmente con logo embebido. Los datos temporales de esa cuenta se retiraron de `.env`, `.env.example` y documentación; el `.env` local quedó en `MAIL_MAILER=log`, `MAIL_PASSWORD` vacío y sin correos personales.

**Nota de producción:** el envío debe configurarse con un **SMTP corporativo autorizado** del dominio de Ábaco. `MAIL_FROM_ADDRESS` debe ser una cuenta autenticada del dominio corporativo (p. ej. `info@abacodev.com`, `andrescasanueva@abacodev.com` o la cuenta final que confirme Ábaco). Los destinatarios internos (`CONTACT_NOTIFY_EMAIL`, `BOOKING_NOTIFY_EMAIL`) se configuran por `.env`, sin tocar código. El email del usuario del formulario debe usarse como **`Reply-To`, no como `From`**, para evitar problemas de SPF/DKIM/DMARC; **revisar SPF, DKIM y DMARC** del dominio antes de producción. *Pendiente de código:* los Mailables actuales aún **no** fijan `Reply-To` (ver §13); es un ajuste mínimo recomendado antes de producción.

**Riesgos pendientes / siguiente paso:** configurar SMTP corporativo y correos reales confirmados por Andrés; añadir `Reply-To` con el email del remitente en ambos Mailables. Siguiente bloque recomendado: **Bloque 4 — Cierre de WIP local** (shim CSP, blog editorial tras decidir `featured_image`, docs).

### Bloque 4 — Cierre de WIP local — **CERRADO** (26/06)

**Estado real:** WIP local del árbol revisado, clasificado y cerrado por rutas explícitas, sin tocar BD, sin ejecutar seeders ni migraciones, sin push. Decisiones de Pablo aplicadas: (1) shim CSP/Vite commiteado; (2) plantilla `.odt` ignorada; (3) seeder editorial temporal eliminado por untracked; (4) las 21 imágenes `.webp` del blog **commiteadas como assets reales** (no temporales: el mismo criterio aplicará a logos, partners, proyectos, servicios y equipo); (5) `BlogPostSeeder` eliminado como **fuente duplicada** de posts ya cargados en BD. Las cuatro puertas de validación (`build`, `types:check`, `lint:check`, `composer test`) quedaron en verde en cada commit. **La BD no se tocó**: los posts y sus portadas ya viven en la base de datos; aquí solo se versionan los assets y se retira el código de siembra editorial.

**Commits (rutas explícitas, sin `git add .`/`-A`, sin push):**
- `4445568 build(csp): redirect es-toolkit globalThis to safe shim` — `vite.config.ts` (M) + `resources/js/vendor/es-toolkit-global-this.ts` (nuevo). Redirige `es-toolkit/dist/_internal/globalThis` a un shim local seguro, evitando el patrón `Function()`/eval indirecto incompatible con CSP estricta. Prerrequisito del futuro flip de CSP a enforce.
- `2262e33 chore(docs): ignore local content request template` — `.gitignore` (regla específica `docs/informacionRequeridaSitioWeb.odt`). La plantilla orientativa de Pablo para Andrés deja de aparecer como untracked y **no** se versiona; **no es fuente de verdad del proyecto**.
- `1da653a assets(blog): add post cover images` — 21 `.webp` en `public/uploads/blog/posts/` (assets reales de posts ya en BD; sin commit aparecerían portadas rotas en despliegue). Ninguna imagen borrada ni movida.
- `d2760c4 chore(seeders): remove blog post content seeder` — elimina `database/seeders/BlogPostSeeder.php` y retira su llamada de `DatabaseSeeder.php`. Ningún test dependía de él (Pest 189/189 sigue verde).

**Seeder editorial previo:** `database/seeders/BlogEditorialJulyAugust2026Seeder.php` ya se había eliminado por estar **untracked** (Git no registra ese borrado; nunca estuvo en `DatabaseSeeder`).

**Política técnica fijada:** no se mantienen **seeders editoriales de blog** ni seeders de posts como fuente duplicada de contenido ya gestionado en BD/admin. Las imágenes `.webp` asociadas a contenido sí se versionan como assets del sitio.

**Auditoría de seeders restantes (10 llamados desde `DatabaseSeeder` + orquestador):**

| Seeder | En DatabaseSeeder | Siembra | Clasificación | Acción |
|---|---|---|---|---|
| `SettingsSeeder` | Sí | Settings corporativos/contacto/SEO confirmados | Base | Mantener |
| `MethodologyStepSeeder` | Sí | Pasos de metodología (producto) | Base | Mantener |
| `ServiceSeeder` | Sí | Los 6 servicios documentados | Base | Mantener |
| `BlogTaxonomySeeder` | Sí | Categorías/tags base ("without fake posts") | Base/estructura | Mantener (no borrar) |
| `BookingSettingsSeeder` | Sí | Config de reservas | Base | Mantener |
| `FaqSeeder` | Sí | FAQs del sitio | Base | Mantener |
| `SeoMetadataSeeder` | Sí | SEO de páginas estáticas ES/EN | Base | Mantener |
| `TeamMemberSeeder` | Sí | Perfiles reales de equipo (foto Andrés) | Base (real) | Revisar (contenido real, candidato a snapshot futuro) |
| `AbacoHistoricalProjectsSeeder` | Sí | Proyectos/partners históricos (`permission_status=pending`) | Revisar (riesgo legal) | Revisar — liga al P0 legal de permisos (Bloque 7) |
| `AdminUserSeeder` | Sí | super_admin demo `admin@abacoqd.local/password`, idempotente, no-op en prod | Demo/placeholder controlado | Mantener — verificar guarda de entorno |
| `DatabaseSeeder` | — | Orquestador + crea `Test User` `test@example.com` (factory) | Mixto | Revisar — el `Test User` es dato demo creado en cada `db:seed` |

**Propuesta futura (NO implementada en este bloque):** mecanismo de **backup/snapshot** que, al guardar desde admin servicios, proyectos, partners, equipo o settings, genere/exporte snapshots versionables del contenido crítico, sustituyendo la idea de seeders editoriales manuales. Aplica a servicios/proyectos/partners/equipo/settings, **no** al blog editorial. Debe diseñarse aparte y confirmarse antes de tocar código.

**WIP restante tras el bloque:** ninguno en el árbol salvo los cambios de documentación de este cierre. Sin push.

### Bloque 7 — Proyectos / Partners / Colaboraciones — **EN CURSO** (26/06)

**Subfase 7.7A — Seeder de CIETE — CERRADA (26/06):** creado `database/seeders/ConfirmedProjectsSeeder.php` (proyectos reales confirmados, idempotente por `slug_es`, SEO por entidad como `ServiceSeeder`) y registrado en `DatabaseSeeder`. CIETE (`ERP CIETE — Gestión interna de trabajos, pedidos y facturación`, `CIETE Arquitectos S.L.`, 2026) entra **sin partner ni `partner_project`**, sin imágenes (pendientes de carga manual desde el CRUD). Commit `4769f18`.

**Subfase 7.2 — Limpieza legacy + retirada de «Permiso» — CERRADA (26/06):**

- **Resuelve el riesgo legal P0** (§10): se elimina la fuga de marcas reales de terceros.
- **Legacy retirado:** `AbacoHistoricalProjectsSeeder` eliminado y descolgado de `DatabaseSeeder`; en una migración total ya no vuelven Meliá, Iberia, Leroy Merlin, Jack & Jones, Wible, Malababa, etc.
- **BD local limpiada** (transacción): `partner_project`, `reviews`, `projects` y `partners` borrados; reseed solo de CIETE. Estado final: **1 proyecto (CIETE), 0 partners, 0 `partner_project`, 0 reviews**. Backup local no commiteable `database/database.before-bloque7-legacy-clean.sqlite` (gitignored).
- **Fallback estático eliminado:** `resources/js/data/company-logos.ts` borrado y `CollaborationsSection.tsx` deja de usar logos hardcodeados. Si la BD no devuelve partners publicables, la noria muestra **estado vacío honesto** (sin marcas de terceros, sin copy de «permiso»).
- **Concepto visible de «Permiso» retirado del admin:** columnas `Permiso` fuera de los listados de proyectos/partners; selects/notas de permiso fuera de los formularios; `permissionStatuses` ya no se envía desde los controladores. La publicación se gestiona por **estado + visibilidad** (`status`, `is_active`, `show_on_home`, `show_in_projects`, `show_in_collaborations`, `is_featured`, orden).
- **Compatibilidad interna:** la columna `permission_status` **no se elimina** (sin migración en esta subfase); el contenido creado/editado desde CRUD o seeders se persiste como `approved`. Los scopes públicos (`permitted`, `publiclyListable`) y el enum `PermissionStatus` se conservan intactos; al quedar todo `approved`, no bloquean.
- **Validaciones:** `types:check`, `lint:check`, `build` OK; `composer test` **Pint OK · PHPStan 0 · Pest 189/189**. Sin push.

**Subfase 7.3 — Media de proyecto (imagen única + logos de cliente) — CERRADA (26/06):**

- **Imagen del proyecto = una sola subida.** El campo «Miniatura» desaparece del formulario; la imagen principal (`cover_image`) alimenta también `thumbnail_image` con **la misma ruta** (sin generar una segunda imagen ni pedir doble subida). Al quitarla, ambos campos quedan a `null` (sin borrar dos veces el mismo archivo).
- **Logos de cliente/empresa en proyecto:** migración aditiva `2026_06_26_000000_add_logos_to_projects_table` añade `logo` (color, modo claro), `logo_dark` (monocromo, modo oscuro) y `logo_alt`, espejo de `partners`. **Aplicada con `php artisan migrate`** (no `migrate:fresh`); columnas existentes intactas.
- **Conversión:** `ProjectImageService` convierte raster (PNG/JPEG/WebP) a **WebP** y conserva **SVG** vectorial (mismo patrón probado que `PartnerLogoService`). En BD solo rutas (`/uploads/projects/{slug}-{variant}.webp|svg`), nunca binarios; el original temporal se descarta.
- **Naming por slug:** el nombre del archivo se resuelve desde el atributo JSON `slug` (las columnas generadas `slug_es`/`slug_en` no se cargan tras `save()`), no desde el id.
- **Tests:** `tests/Feature/Admin/ProjectMediaTest.php` (3 casos: imagen única → cover=thumbnail; logos color/mono → rutas WebP; quitar imagen → ambos `null`).
- **Validaciones:** `types:check`, `lint:check`, `build` OK; `composer test` **Pint OK · PHPStan 0 · Pest 192/192**. Sin push.

**Subfase 7.4 — Datos públicos de Proyecto y Colaboraciones — CERRADA (26/06):**

- **Proyecto ↔ Servicios:** nueva relación M:N `project_service` (migración aditiva aplicada con `migrate`). El servicio/capacidades del proyecto se elige desde `services` (no texto libre); si un servicio se desactiva la relación se conserva (se marca «Inactivo» en admin), si se borra cae por cascade sin romper el proyecto. CIETE asociado por slug a **Aplicaciones a medida · CRM, datos y procesos · Integraciones digitales** (sin IDs hardcodeados).
- **Fuera de la UI pública:** `approved`/`Aprobado`, `permiso`/`permission`, `estado de validación`, `Rol`/`Roles del proyecto` y «Quién participa». El payload público ya no envía `permissionStatus`/`isApproved`/roles; `permission_status` queda solo como compatibilidad interna.
- **Detalle de proyecto rehecho:** banner con logo del cliente (color claro / monocromo oscuro) + nombre + proyecto + chips de servicios + desarrollo; datos clave (Año · Servicios · Desarrollo · Tecnologías, sin «Rol»); sección **«Cliente y desarrollo»** (Solicitado por / Desarrollado por con logo AbacoQD y, si aplica, partners). `developmentMode = solo | cooperative` (CIETE = «Proyecto desarrollado en solitario»).
- **Colaboraciones (home):** ahora muestra **proyectos/casos** (cliente, logo, servicios, año, desarrollo, CTA «Ver proyecto»), no logos sueltos. Sin proyectos `show_in_collaborations`, estado vacío honesto. CIETE no está en colaboraciones (flag en false).
- **Seeder no destructivo:** `ConfirmedProjectsSeeder` ya no pisa la media subida por CRUD en re-seed (solo la inicializa al crear).
- **Tests:** `ProjectPresentationTest` (relación servicios, borrado de servicio no rompe el proyecto, CIETE↔servicios por seeder, payload público sin campos internos ni roles).
- **Validaciones:** `types:check`, `lint:check`, `build` OK; `composer test` **Pint OK · PHPStan 0 · Pest 196/196**. Sin push.

**Subfase 7.5 — Ajuste final del detalle de proyecto y Colaboraciones — CERRADA (26/06):**

- **Sin duplicidad:** se elimina el segundo bloque «Cliente y desarrollo» del detalle, que repetía cliente/desarrollo. El **banner superior** queda como única pieza de identidad (cliente + logo + proyecto + chips de servicios + desarrollo con logo AbacoQD y, si aplica, partners). Sin huecos ni secciones vacías.
- **Cabecera/imagen premium:** contenedor con hairline, radio y sombra sutil, overlay de gradiente con cliente+título integrados y hover muy leve bajo `motion-safe` (respeta `prefers-reduced-motion`). No se toca hero ni cubo.
- **Datos clave:** Año · Servicios · Desarrollo · Tecnologías (sin «Rol»). La card «Desarrollo» muestra el logo AbacoQD (+ partners si es cooperativo) y el texto «en solitario»/«cooperativo».
- **Limpieza de bundle:** se retiran claves de idioma muertas de `projectDetail` (`partners`/`roles`/`process`/`media`/`clientDev`) y de `projectsPage` (`badge`/`executorBy`) que ya no se renderizaban pero viajaban en el bundle con textos prohibidos («Quién participa», «Roles del proyecto», «Aprobado»). Verificado: ausentes en `public/build`.
- **Colaboraciones:** sin cambios de comportamiento (ya muestra proyectos/casos con estado vacío honesto desde 7.4).
- **Validaciones:** `types:check`, `lint:check`, `build` OK; `composer test` **Pint OK · PHPStan 0 · Pest 196/196**. Sin push.

---

## 1. Resumen ejecutivo

El proyecto está **técnicamente muy avanzado y sano**. Las cuatro puertas de validación del proyecto pasan en verde a 25/06:

- `composer test`: **Pint OK · PHPStan 0 errores · Pest 184 tests / 910 aserciones OK**.
- `npm run types:check` (tsc): **limpio**.
- `npm run lint:check` (eslint): **limpio**.
- `npm run build`: artefactos generados (2.8 MB).

Las vistas públicas y el panel admin están implementados; la reserva propia, el blog programado, el SEO base (incluido **JSON-LD que ahora sí se sirve en el HTML**), el sitemap dinámico, el aviso simple de cookies y el RBAC con protección de PII funcionan y están verificados en runtime.

**No está listo para producción todavía**, por tres frentes claros:

1. **Hardening de seguridad**: el Bloque 1 (cabeceras + CSP Report-Only) está **cerrado** el 25/06, con `composer test` y revisión visual revalidados en verde; siguen pendientes CSP enforce, ocultar `X-Powered-By` y configuración `local`/`debug` (P1 de hardening, Bloque 2).
2. **Riesgo legal/reputacional de contenido**: hay **11 proyectos y 17 partners con marcas reales de terceros** (Iberia, Meliá, Leroy Merlin, Jack & Jones, Wible…) **publicados** (`show_on_home/projects/collaborations = 1`) cuyo permiso de publicación está **pendiente** según el propio backlog. Todo el contenido cargado es **demo/legacy sin permiso confirmado**; ningún proyecto está confirmado como publicable.
3. **WIP sin cerrar**: blog editorial (seeder + 21 imágenes), shim CSP de Vite y el propio `.odt`, todo sin commit.

Corrección de contexto (25/06): **`docs/informacionRequeridaSitioWeb.odt` es una plantilla orientativa preparada por Pablo**, con ejemplos rellenados para indicar a Andrés qué debe devolver y en qué formato. **No es contenido confirmado ni entregado por Andrés.** Por tanto, sus textos (Quiénes somos, 8 servicios, 6 fases de metodología, proyecto CIETE, bio de Pablo) son **ejemplos de plantilla**, no datos reales. El contenido definitivo **sigue pendiente de Andrés**, y lo ya cargado en BD debe tratarse como **demo/placeholder** hasta que Andrés lo confirme.

**Veredicto:** listo para seguir cargando contenido; **no** listo para producción hasta cerrar hardening de seguridad, decisión de permisos de proyectos/partners y revisión legal.

---

## 2. Estado real del proyecto

### 2.1 Validaciones (ejecutadas hoy)

| Gate | Resultado |
|---|---|
| `composer test` (Pint+PHPStan+Pest) | ✅ 189/189 tests, 934 aserciones, 0 errores estáticos; con PHP de XAMPP el 25/06 (incluye +5 tests de notificación de reserva del Bloque 3) |
| `npm run types:check` | ✅ sin errores |
| `npm run lint:check` | ✅ sin errores |
| `npm run build` | ✅ 2.8 MB total; tras la corrección CSP inline, `cmd.exe /C npm run build` OK |
| `composer audit` | ⚠️ 3 advisories medium (transitivas) |
| `npm audit --omit=dev` | ⚠️ 2 critical en `shell-quote`→`concurrently` (tooling de build, no se envía al navegador) |

### 2.2 Estado de la base de datos (local, hoy)

| Entidad | Cantidad | Notas |
|---|---|---|
| Posts | 21 | **Todos `scheduled`**: 3 vencidos→visibles, 18 futuros→ocultos |
| Post destacado | 1 | `abacoqd-renovamos-identidad-...` (vencido hoy 14:20 → visible) |
| Categorías / Tags | 16 / 21 | del seeder editorial |
| Partners | 17 | marcas reales (clientes y colaboradores) |
| Projects | 11 | **todos públicos**, demo/legacy sin permiso confirmado |
| Services | 6 | demo/placeholder; la plantilla de Pablo ejemplifica 8 (no vinculante) |
| Team members | 2 | Andrés y Pablo; **ambos sin foto** |
| FAQs | 7 | chatbot/página |
| Contact messages | 0 | — |
| Appointment bookings | 0 | — |
| Usuarios | 2 | 1 `super_admin` + 1 `editor` |

### 2.3 Runtime verificado (servidor local `php artisan serve`)

- `/`, `/blog/{slug}`, `/servicios/{slug}`, `/proyectos/{slug}` → **2 nodos `application/ld+json` cada uno** (JSON-LD servido en HTML inicial; ver §9).
- `/robots.txt` correcto: `Disallow` admin/dashboard/settings/auth, `Sitemap: https://abacoqd.com/sitemap.xml`.
- `/sitemap.xml`: 31 `<loc>`; **excluye** posts programados futuros, **incluye** los vencidos. ✅
- `/admin/dashboard` sin sesión → `302` (gate de auth). ✅

---

## 3. Módulos terminados

**Público**

- Home/landing con hero protegido (cubo + partículas), Metodología, Servicios (+detalle), Proyectos (+detalle), Quiénes somos, Blog (+detalle con TOC), Contacto, Reserva, Legales (aviso/privacidad/cookies), páginas de error 404/500/503.
- Topbar final sin botón Reservar; footer con datos desde `settings`; tema claro/oscuro/sistema; widget de accesibilidad; chatbot/FAQ con fallback.
- **Aviso simple de cookies técnicas** (`CookieNotice.tsx`): sin categorías, sin panel de preferencias, sin analítica, sin Consent Mode; solo `localStorage` (`abacoqd_cookie_notice_v1`). Reapertura desde `/cookies`. ✅
- **Blog programado sin cron**: scope único `Post::published()` que hace visible `scheduled` cuando `published_at <= now()`; mismo gate para `/blog`, detalle, landing y sitemap. ✅
- **SEO base**: title/description/canonical/robots, Open Graph, Twitter Cards, **JSON-LD**, sitemap dinámico, robots. ✅
- **Reserva propia** (`appointment_days/slots/bookings`) con transacción + bloqueo de fila contra doble reserva; fallback a contacto.
- **Formularios** (contacto y reserva): honeypot server-side (`prohibited`), `throttle:public-forms` (6/min/IP), consentimiento de privacidad obligatorio separado del de marketing.

**Admin**

- Dashboard, Servicios, Posts (+categorías/tags), Partners, Projects, Team members, FAQs, Reservas (calendario/días/slots/bookings/settings), Contactos/leads, Usuarios, Settings globales.
- CRUD con paginación, filtros, toggles de visibilidad/flags, soft-deletes en posts (archivar), limpieza de media reemplazada.
- **RBAC** con `admin` (super_admin/admin/editor) + `role:` fino: usuarios solo `super_admin`; contactos/reservas/settings solo `super_admin,admin`; `viewer` fuera del panel.

---

## 4. Módulos / piezas pendientes

| Pieza | Estado | Prioridad |
|---|---|---|
| Cabeceras de seguridad (CSP, XFO, etc.) | No existen | **P0/P1** |
| Hardening de entorno producción (`.env`, SMTP real, build prod) | Solo local | **P1** |
| Despliegue de la CSP estricta (shim Vite ya iniciado) | WIP | DECISIÓN/P1 |
| Contenido real de servicios (BD tiene 6 demo; plantilla ejemplifica 8) | Pendiente | DEP-ANDRÉS |
| Proyectos reales (CIETE es solo ejemplo de plantilla) | Pendiente | DEP-ANDRÉS |
| Decisión sobre proyectos/partners legacy publicados | Pendiente permiso | **P0 legal** |
| Fotos de equipo (Andrés y Pablo) | Nulas | DEP-ANDRÉS |
| Emails finales de contacto y reserva | Ejemplos en blanco en la plantilla | DEP-ANDRÉS |
| Revisión jurídica de textos legales | Borrador | DEP-ANDRÉS/P1 |
| hreflang / indexación EN | Fuera por decisión actual | DECISIÓN/P3 |
| Analítica/CMP | Sin analítica (decisión actual) | DECISIÓN |

---

## 5. Contenido pendiente de Andrés

**Sobre `docs/informacionRequeridaSitioWeb.odt`:** es una **plantilla orientativa preparada por Pablo**, con ejemplos rellenados para que Andrés sepa qué devolver y en qué formato. **No es contenido confirmado ni entregado por Andrés** y no debe cargarse como contenido real. Lo que hoy hay en BD (servicios, proyectos, partners, metodología, equipo) es **demo/placeholder** y queda pendiente de sustituir por el contenido real de Andrés.

**Pendiente de Andrés (DEP-ANDRÉS):**

1. Textos definitivos "Quién es Abaco Developments" y "Qué es AbacoQD".
2. Servicios reales (nombre + descripción) y su número final (la BD tiene 6 demo; la plantilla ejemplifica 8, no vinculante).
3. Fases de metodología definitivas (la BD tiene pasos demo).
4. Proyectos reales (CIETE aparece solo como ejemplo en la plantilla; ningún proyecto está confirmado como publicable) y **permiso explícito** para mostrar proyectos/partners/logos/capturas/reseñas (clave para §10 legal).
5. Equipo: bios definitivas, fotos de Pablo y Andrés (ambos `visible` sin foto), LinkedIn/GitHub reales y decisión de si Andrés aparece como miembro público.
6. Reseñas/testimonios reales (hoy el footer solo enlaza Google Reviews, oculto si no hay URL).
7. Email destino de avisos de **reserva** y de mensajes de **contacto** (hoy cae a `info@abacodev.com` vía `CONTACT_NOTIFY_EMAIL`).
8. Usuario real del panel para Andrés (crear con contraseña segura).
9. Teléfono legal visible principal, política de redirección de `abacodev.com`, ubicación de logos UE/FSE+, redes sociales y horarios.

> El avance técnico **no se bloquea** por esto: es dependencia externa de contenido. El sitio puede progresar con datos demo claramente marcados.

---

## 6. WIP local pendiente de cerrar (no stageado)

Working tree: 1 modificado, resto sin trackear. **Nada en staging.**

| Grupo | Archivos | Recomendación |
|---|---|---|
| **B. WIP técnico (CSP)** | `vite.config.ts` (M) + `resources/js/vendor/es-toolkit-global-this.ts` (??) | **Commit conjunto.** El shim sustituye el `globalThis` de `es-toolkit` (patrón tipo `Function()`/eval) por uno CSP-safe; es la base para una CSP sin `unsafe-eval`. Van juntos o el build rompe. |
| **C. WIP editorial** | `database/seeders/BlogEditorialJulyAugust2026Seeder.php` (??) | Commit propio. Ojo: el seeder **no** está en `DatabaseSeeder` y pone `featured_image = null` en posts nuevos (ver bug §7.1). |
| **D. Assets** | `public/uploads/blog/posts/*.webp` (21) | Commit junto al seeder editorial. La BD ya referencia estos 21 ficheros; sin commit, un clon/redeploy pierde las portadas. |
| **E. Docs** | `docs/informacionRequeridaSitioWeb.odt` (??), `docs/auditoria25Junio.md` (este) | Decisión: ¿se versiona el `.odt`? Contiene datos de contacto. Sugerido commit doc separado. |

> Verificado: `resources/js/vendor/` **no** está gitignored.

Sobre los commits "CMP complejo": `e69e355`, `686a0b1`, `12a9949` **siguen en el historial** (no hubo `git revert`). Su lógica fue **sustituida** por `7591469 refactor(cookies): simplificar aviso de cookies técnicas`. El working tree actual **no** contiene lógica compleja de consent/tracking (confirmado leyendo `CookieNotice.tsx`).

---

## 7. Bugs detectados

### 7.1 (P1 / WIP) Seeder editorial no reproduce las portadas
`BlogEditorialJulyAugust2026Seeder` hace `if ($isNew) { $post->featured_image = null; }` y nunca asigna la ruta `.webp`. La BD actual tiene las 21 portadas porque se **subieron a mano** desde el admin. En un `migrate:fresh --seed` + seeder editorial, los posts quedarían **sin portada**. → El estado actual no es reproducible desde código. Decidir: (a) que el seeder asigne `/uploads/blog/posts/{slug}.webp`, o (b) documentar carga manual.

### 7.2 (Info/DECISIÓN) Seeder editorial fuera del pipeline
No está en `DatabaseSeeder::run()`. Un `db:seed` base **no** crea el blog editorial. Correcto si es intencional, pero hay que decidir el camino de despliegue.

### 7.3 (DEP-ANDRÉS) El contenido cargado es demo, no real
La BD tiene 6 servicios **demo/placeholder** (y proyectos/metodología/equipo también demo). La plantilla de Pablo ejemplifica 8 servicios, pero **no es contenido confirmado**: el catálogo real lo debe entregar Andrés. No cargar los ejemplos de la plantilla como reales.

### 7.4 (P2) Chunk `SiteFooter` desproporcionado
`SiteFooter-*.js` = 121 KB (mayor que muchas páginas completas). Posible arrastre de iconos/deps. Revisar tree-shaking del footer (ver §11).

**No es bug:** las claves "duplicadas" de `settings` (`cif`, `registry`, `public_brand_name`) son pares `(group, key)` distintos; la tabla tiene `unique(['group','key'])` y `SiteSettings` lee solo `group='site'`. Correcto.

> QA visual real (cross-browser, hidratación, foco, layout) **no** se puede certificar con `curl`; ver §12 y el checklist de §5-original. Requiere navegador real (Chrome/Firefox/Brave).

---

## 8. Riesgos de ciberseguridad

### 8.1 (P0) Cabeceras de seguridad ausentes
`curl -I /` confirma que **no** se emiten: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`. Recomendado: middleware Laravel para todas (HSTS solo en prod/HTTPS) + CSP apoyada en el shim WIP. **No** añadir `unsafe-eval`; **no** relajar CSP; el trabajo del `vite.config.ts` va justo en esa dirección.

### 8.2 (P1) Configuración de entorno
`.env`/`.env.example`: `APP_ENV=local`, `APP_DEBUG=true`, `APP_URL=http://localhost`, `MAIL_MAILER=log`, `DB=sqlite`. Para producción: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://abacoqd.com`, SMTP real, `SESSION_SECURE_COOKIE=true`, revisar `SESSION_SAME_SITE`/`TRUSTED_PROXIES`. Buen detalle ya presente: `AppServiceProvider` exige en producción `Password::min(12)` con `uncompromised()` y prohíbe comandos destructivos de BD.

### 8.3 (P2) Fuga de información de servidor
Respuesta incluye `X-Powered-By: PHP/8.4.12`. Ocultar en prod (`expose_php=Off` / cabecera).

### 8.4 (Bajo) Cookies de sesión
`abacoqd-session` ya sale `httponly; samesite=lax`. Falta solo `Secure` (depende de HTTPS/`SESSION_SECURE_COOKIE` en prod). `XSRF-TOKEN` `samesite=lax` sin `httponly` es correcto (lo lee JS). CSRF de Laravel activo.

### 8.5 (OK) XSS / HTML / Markdown
- Posts: `Str::markdown()` (CommonMark) **escapa el HTML crudo por defecto**; `dangerouslySetInnerHTML` en `BlogPost.tsx` es seguro con ese origen.
- JSON-LD: se escapa `<`→`<` (cliente) y `JSON_HEX_TAG|HEX_APOS|HEX_QUOT|HEX_AMP` (blade). Correcto.
- Otros `dangerouslySetInnerHTML`: `SeoHead.tsx` (JSON-LD controlado) y `two-factor-setup-modal.tsx` (SVG del QR generado por Fortify, no entrada de usuario). Riesgo bajo.
- No se encontró `DOMPurify`/`marked`/`html-react-parser`; no hace falta para el origen actual. Si en el futuro el admin permite HTML crudo en posts, **habría que sanitizar**.

### 8.6 (OK) SQL Injection
Búsqueda de `DB::raw|whereRaw|orderByRaw|selectRaw|statement|unprepared`: **sin coincidencias**. Búsquedas/filtros (`scopeSearch`, filtros admin, slugs) usan binding de Eloquent (`like` con `%term%` parametrizado). Sin vector.

### 8.7 (OK) Mass assignment / validación
Modelos con `#[Fillable([...])]` explícito; controladores usan `FormRequest` + `validated()` (no `request()->all()` sin filtrar). `authorize()` público en formularios públicos (correcto) y RBAC por ruta en admin.

### 8.8 (OK, con nota) RBAC / PII
- Gate `admin` = super_admin/admin/editor; `users` solo super_admin; `contacts`/`booking`/`settings` solo super_admin/admin; `viewer` fuera. Sólido.
- **PII**: `contact_messages` guarda `ip_address` y `user_agent` del visitante, además de email/teléfono/empresa, y `appointment_bookings` guarda datos de contacto. **Debe declararse en la política de privacidad** (base legal, finalidad, retención). Hoy editor no ve contactos; bien.

### 8.9 (P1/P2) Uploads
Servicios de media propios (`PostCoverImageService`, `TeamMemberPhotoService`, etc.) y limpieza de media reemplazada (commit `7e09165`). **Verificar** en los `FormRequest`/servicios: regla `mimes`/`mimetypes` + `max:` por tipo (webp/pdf), nombres derivados de slug (evita path traversal), y bloqueo de ejecutables. CV en `/uploads/team-members-cv/*.pdf` es de descarga directa (sin auth) — aceptable si es público por diseño; confirmar que no se filtran PDFs no publicados.

### 8.10 (Formularios / spam) — buena base
Honeypot (`prohibited`) + `throttle:public-forms` 6/min/IP + consentimiento. Opciones a futuro: (A) mantener honeypot+throttle [actual, suficiente para lanzar]; (B) throttle adicional por ruta; (C) Cloudflare/WAF en prod; (D) sin Captcha por ahora. **Recomendado: A (+C cuando haya hosting/CDN).**

### 8.11 (Dependencias — reportar, no actualizar)
- `composer audit`: 3 medium → `guzzlehttp/guzzle (<7.12.1)` (CVE-2026-55767, CVE-2026-55568) y `guzzlehttp/psr7 (<2.12.1)` (CVE-2026-55766). Transitivas; impacto real bajo en este uso. Planificar bump.
- `npm audit --omit=dev`: 2 critical en `shell-quote` vía `concurrently`. Es **tooling de scripts/build**, no se empaqueta al navegador → riesgo de producción bajo. Bump cuando toque.

---

## 9. Riesgos SEO

- **JSON-LD: RESUELTO.** La auditoría previa lo daba como "no aparece en HTML". Hoy `curl` confirma **2 nodos `application/ld+json`** en home, blog, servicio y proyecto, servidos desde `app.blade.php` (con escape `JSON_HEX_*`) y reconciliados por `SeoHead.tsx`. ✅
- robots.txt y sitemap correctos; el sitemap respeta el gate de visibilidad (excluye futuros). ✅
- `noindex`/gating en admin/auth/dashboard/settings: vía robots + redirect de auth. ✅
- **ES-only por decisión actual**: sin `/en`, sin `hreflang` (documentado en `SeoHead`). `docs/03_SEO` aspira a hreflang; hoy es decisión consciente, no bug. Si se activa EN, hay que añadir hreflang y canonical EN sin romper. (P3/DECISIÓN)
- **Canonical**: depende de `canonical_domain` en settings (sitemap ya emite `abacoqd.com`). Verificar que en prod `APP_URL`/canonical no quede en `localhost`. (P1)

---

## 10. Riesgos legales

- **(P0 — RESUELTO 26/06, Bloque 7 subfase 7.2)** ~~Proyectos/partners de terceros publicados sin permiso confirmado.~~ Los 11 proyectos y 17 partners legacy (Iberia, Meliá, Leroy Merlin, Jack & Jones, Wible, Cognodata…) se eliminaron de la BD local, su seeder (`AbacoHistoricalProjectsSeeder`) se retiró, y el fallback estático de marcas reales en Colaboraciones (`company-logos.ts`) se borró. Queda **solo CIETE** como proyecto real confirmado por Pablo. La gestión visible de «permiso» se retiró del admin: la publicación se controla por estado + visibilidad y `permission_status` queda como compatibilidad interna (`approved`).
- **(P1) Textos legales en borrador**: aviso legal/privacidad/cookies pendientes de revisión jurídica. La **privacidad debe reflejar** el almacenamiento de IP/User-Agent y la retención de leads/reservas.
- **(P1) Cookies**: el aviso actual es solo de cookies técnicas y **coincide** con la realidad (sin analítica). Verificar que el texto de `/cookies` no prometa herramientas no activas y explique el `localStorage` del propio aviso.
- **(DEP-ANDRÉS)** Teléfono legal principal, datos de la S.L., política de `abacodev.com` y ubicación obligatoria de logos UE/FSE+.

---

## 11. Riesgos de rendimiento

- Build total **2.8 MB**. Chunks mayores:
  - `Home-*.js` **708 KB** (hero Three.js / cubo de cristal) → principal coste de carga inicial de la landing (LCP/peso). **P1**: confirmar lazy-load/code-split del cubo y `prefers-reduced-motion` (la zona del hero está protegida; optimizar **carga**, no rediseñar).
  - `jsx-runtime-*.js` 315 KB, `app-*.js` 290 KB, `app-*.css` 215 KB.
  - `SiteFooter-*.js` **121 KB** → desproporcionado; revisar imports de iconos/deps (P2, ver §7.4).
- Fuentes con `preload` (woff2) ya en cabecera `Link`. ✅
- Imágenes de blog en `.webp`. Verificar `width/height`/`alt`/`loading=lazy` en las tarjetas para CLS. (P2)

Clasificación: **P1** peso del chunk Home; **P2** footer, dimensiones de imágenes; sin P0 de rendimiento.

---

## 12. Riesgos de accesibilidad (requiere navegador real)

No certificable por `curl`. Indicios positivos en código: `aria-label`/`role=dialog` en cookies, `focus-visible:outline`, widget de accesibilidad propio, `useSyncExternalStore` para evitar flash de hidratación. **Checklist manual pendiente** (Chrome/Firefox/Brave): navegación por teclado y foco visible en topbar/CTAs/formularios, contraste de la paleta (teal/lima sobre claros), `prefers-reduced-motion` en hero/cubo y carruseles, `alt` reales en imágenes de blog/equipo, jerarquía H1/H2 por página, `lang` correcto al cambiar idioma, errores de validación anunciados. (P1 antes de producción.)

---

## 13. Mejoras recomendadas

- **(P1)** Middleware de cabeceras de seguridad + CSP estricta apoyada en el shim WIP.
- **(P1)** Lazy-load/code-split del hero Three.js; revisar chunk del footer.
- **(P2)** Que el seeder editorial asigne `featured_image` para ser reproducible.
- **(DEP-ANDRÉS)** Sustituir el contenido demo (servicios, proyectos, metodología, equipo) por el real cuando Andrés lo entregue.
- **(P2)** Confirmar reglas de upload (`mimes`/`max`/nombres) y descarga de CV.
- **(P1)** Emails de contacto/reserva: añadir `Reply-To` con el email del remitente del formulario en `ContactMessageReceived` y `AppointmentBookingReceived` (hoy no lo fijan), para que el `From` quede como la cuenta corporativa autenticada y responder vaya al usuario. Acompañar de SMTP corporativo y revisión SPF/DKIM/DMARC antes de producción.
- **(P3)** Plan de hreflang/EN si se decide indexar inglés.
- **(P3)** Bump planificado de guzzle/psr7 y tooling npm.

---

## 14. Qué NO tocar todavía

- **Hero protegido** (`AbacoHero`, `AbacoCrystalCube`, `FloatingHeader`, `HeroParticleField`, estilos y assets de marca). Solo optimizar carga si se aprueba fase.
- **Landing, topbar, footer, cookies, blog, admin y seguridad** ya cerrados: no rehacer.
- **`vite.config.ts`**: el cambio WIP es legítimo (CSP). No revertir ni meterle `unsafe-eval`.
- **Lógica de consent/tracking**: no reintroducir el CMP complejo; el aviso simple es la decisión vigente.
- **Estados/fechas de los posts programados**: no publicar manualmente; el gate temporal es intencional.
- **Datos de proyectos/partners**: no inventar ni añadir; la decisión es de permisos, no de código.

---

## 15. Orden recomendado de próximos bloques

```txt
1. Cerrar WIP en commits limpios y separados (shim CSP / blog editorial+assets / docs).
2. Decisión de negocio: permisos de proyectos/partners reales → despublicar/marcar demo
   lo no autorizado (todo es demo/legacy sin permiso). (desbloquea el riesgo legal P0)
3. Seguridad: middleware de cabeceras + CSP estricta (sin unsafe-eval) usando el shim.
4. Reproducibilidad del blog: que el seeder asigne portadas; decidir pipeline de seed.
5. Sustituir el contenido demo por el real cuando Andrés lo entregue (servicios, proyectos, metodología, equipo).
6. Hardening de entorno + SMTP real + usuario admin real (preparar .env de producción).
7. Rendimiento: lazy-load hero / chunk footer.
8. QA real cross-browser + accesibilidad (Chrome/Firefox/Brave).
9. Revisión jurídica de legales y privacidad (IP/UA, retención).
10. Recoger datos finales de Andrés (fotos, emails, teléfono, redirección dominio).
```

---

## 16. Commits recomendados para cerrar WIP

```txt
1. commit: build(csp): shim CSP-safe para globalThis de es-toolkit
   archivos: vite.config.ts, resources/js/vendor/es-toolkit-global-this.ts
   motivo: eliminar patrón eval-like; base para CSP sin unsafe-eval. Van juntos.

2. commit: feat(blog): seeder editorial julio/agosto 2026 + portadas
   archivos: database/seeders/BlogEditorialJulyAugust2026Seeder.php,
             public/uploads/blog/posts/*.webp (21)
   motivo: cerrar el contenido editorial WIP que la BD ya referencia.
   nota: antes de commitear, resolver bug §7.1 (seeder debe asignar featured_image)
         y decidir si entra en DatabaseSeeder.

3. commit: docs(auditoria): informe de auditoría 25/06 (+ plantilla de requisitos)
   archivos: docs/auditoria25Junio.md (y, si se versiona, docs/informacionRequeridaSitioWeb.odt)
   motivo: dejar la foto de estado de la auditoría.
   nota: el .odt es la plantilla de requisitos de Pablo (con datos de contacto de ejemplo); confirmar si debe versionarse.
```

> No usar `git add .` ni `git add -A`: stagear por rutas explícitas para no mezclar grupos.

---

## 17. Checklist de producción

```txt
[ ] APP_ENV=production / APP_DEBUG=false / APP_URL=https://abacoqd.com / APP_TIMEZONE=Europe/Madrid
[ ] APP_KEY generada y única en el entorno
[ ] SESSION_SECURE_COOKIE=true (HTTPS) y revisar SAME_SITE / TRUSTED_PROXIES
[ ] SMTP real (MAIL_MAILER != log) + remitente verificado; probar email de contacto y reserva
[ ] Cabeceras de seguridad (CSP estricta, XFO, XCTO, Referrer, Permissions, HSTS)
[ ] Ocultar X-Powered-By
[ ] Decisión y aplicación de permisos de proyectos/partners (legal)
[ ] Revisión jurídica de aviso legal / privacidad (IP, UA, retención) / cookies
[ ] Carga de contenido real de Andrés (servicios, proyectos, metodología, equipo, fotos, emails) — sustituir demo
[ ] Usuario admin real de Andrés con contraseña segura (Password::min(12) ya forzado en prod) + 2FA si aplica
[ ] migraciones aplicadas; decisión de seeders de producción (¿blog editorial?)
[ ] storage:link + permisos storage/ y bootstrap/cache
[ ] cache de config/rutas/vistas + build de producción
[ ] sitemap/robots/canonical apuntando a dominio final (no localhost)
[ ] decisión documentada sobre abacodev.com (redirección/convivencia)
[ ] SSL, backups, logs y monitorización básica
[ ] Bump de dependencias con CVE (guzzle/psr7) y tooling npm
[ ] QA cross-browser + accesibilidad superados
```

---

## 18. Conclusión

- **¿Listo para seguir cargando contenido?** **Sí.** La base técnica es sólida y verde. El contenido sigue **pendiente de Andrés** (el `.odt` es solo una plantilla de Pablo, no contenido confirmado) y lo que hay en BD es demo/placeholder; el avance técnico no está bloqueado por ello.
- **¿Listo para producción?** **No todavía.** Bloquean: (1) cabeceras de seguridad/CSP y hardening de entorno; (2) la **decisión legal sobre proyectos/partners reales publicados sin permiso confirmado**; (3) revisión jurídica de legales; y el cierre del WIP. Ninguno es estructural; son pasos acotados.

---

### Cierre accionable

```txt
Siguiente bloque recomendado:
1. Cerrar WIP en 3 commits separados (shim CSP / blog editorial+assets / docs).
2. Resolver el riesgo legal P0: permisos de proyectos/partners (despublicar/marcar demo; todo es demo/legacy sin permiso).
3. Middleware de cabeceras de seguridad + CSP estricta apoyada en el shim (sin unsafe-eval).

Microcommits sugeridos:
1. commit: build(csp): shim CSP-safe globalThis es-toolkit
   archivos: vite.config.ts, resources/js/vendor/es-toolkit-global-this.ts
   motivo: base para CSP sin unsafe-eval.
2. commit: feat(blog): seeder editorial + 21 portadas webp
   archivos: database/seeders/BlogEditorialJulyAugust2026Seeder.php, public/uploads/blog/posts/*.webp
   motivo: cerrar contenido editorial (resolver antes featured_image del seeder).
3. commit: docs(auditoria): informe 25/06 (+ plantilla de requisitos)
   archivos: docs/auditoria25Junio.md (+ .odt si se versiona)
   motivo: foto de estado de la auditoría (el .odt es plantilla de Pablo, no contenido confirmado).

Pendiente de Andrés:
1. Fotos de Pablo y Andrés; LinkedIn/GitHub reales de Pablo.
2. Emails finales de contacto y de avisos de reserva.
3. Más proyectos reales + permiso de proyectos/partners/logos/reseñas.
4. Teléfono legal principal, política de abacodev.com, logos UE/FSE+, redes y horarios.
5. Usuario real del panel.

Pendiente de seguridad:
1. Cabeceras de seguridad + CSP estricta (sin unsafe-eval).
2. Hardening de .env producción (APP_DEBUG=false, SESSION_SECURE_COOKIE, SMTP real) + ocultar X-Powered-By.
3. Confirmar reglas de upload (mimes/max/nombres) y declarar PII (IP/UA) en privacidad.
4. Bump planificado de guzzle/psr7 y tooling npm.

Pendiente producción:
1. Decisión legal de proyectos/partners + revisión jurídica de legales.
2. Dominio/canonical/sitemap a abacoqd.com (no localhost) y redirección de abacodev.com.
3. Reproducibilidad de seeders (portadas del blog) + usuario admin real + storage:link + cache + backups.
```

---

## 19. Limpieza final de textos publicos y payload - 26/06

Estado: ejecutada en fuentes, payload publico y build.

Alcance aplicado:

- Textos publicos ES/EN de cookies, chatbot, contacto, aviso legal EN, politica de cookies EN, detalle de proyecto y estados vacios.
- Payload publico de proyectos y colaboraciones enviado por Inertia.
- Seeders/settings que pueden alimentar datos publicados.
- Manifiestos publicos de logos bajo `public/assets`.
- Comentarios no renderizados con lenguaje de preview, pendiente o validacion interna.

Cambios relevantes:

- `ProjectController` deja de enviar `permissionNotes`, `settings` completos, `permissionStatus` e `isApproved` a la vista publica de detalle de proyecto.
- `HomeController`, `Projects.tsx` y `CollaborationsSection.tsx` dejan de exponer badges publicos basados en estado interno de permiso.
- Los fallbacks de proyecto pasan a copy neutro u ocultan bloques sin dato real; partners vacios muestran que el proyecto fue realizado directamente por Abaco Developments.
- Las menciones a Pablo en seeders/settings y constantes publicas se sustituyen por identificadores neutros (`confirmed_internal`, `WAVE_PATH`) o copy institucional.
- La etiqueta publica de WhatsApp vinculada a Andres pasa a atencion comercial; el perfil publico se mantiene como contenido institucional.
- `be now Partner` y logos/entradas no verificadas se retiran de footer y manifiestos publicos.
- La politica de cookies queda alineada con la decision vigente: cookies tecnicas y preferencias de tema, idioma y accesibilidad; sin analitica, mapas de calor, publicidad ni proveedores externos.

Validaciones:

- `npm run types:check`: verde.
- `npm run lint:check`: verde.
- `cmd.exe /C npm run build`: verde; build regenerado.
- Busqueda de cierre en fuentes publicas, `public/assets` y `public/build`: sin coincidencias de los textos criticos exactos eliminados.
- `composer test`: no ejecutado en esta pasada; PHP/Composer de XAMPP quedo bloqueado por el sandbox con error WSL/vsock y la solicitud de escalado fue rechazada por limite de uso.

Hallazgos mantenidos:

- Estados internos `pending/approved` en enums, migraciones y admin: compatibilidad tecnica, no contenido publico.
- Placeholders de formularios: falso positivo de UI.
- Factories, tests, seeders de admin y documentacion historica: solo desarrollo/auditoria.
- Decision sobre `abacodev.com`: no se afirma redireccion definitiva hasta decision externa.

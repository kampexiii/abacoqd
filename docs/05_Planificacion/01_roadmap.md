# Roadmap Maestro — Abaco Developments

Ultima revision: 11 de junio de 2026 (auditoria completa de documentacion y codigo).

Este es el unico roadmap valido del proyecto. La numeracion de fases de este documento es la numeracion maestra. Cuando otro documento de `/docs` mencione una fase con numeracion antigua, prevalece la tabla de equivalencias del final de este documento.

Nota de auditoria: el roadmap anterior fue sobrescrito y no existe fuente real recuperable (el repositorio git esta vacio y no hay historial local de editor ni backups). Por decision documental, no se crea ningun archivo de recuperacion legacy.

---

## Estado actual real (verificado contra codigo el 11/06/2026)

### Stack real instalado

| Capa | Tecnologia confirmada |
|---|---|
| Backend | Laravel ^13.7 (starter kit `laravel/react-starter-kit`), Fortify, Wayfinder, Chisel, Tinker |
| Frontend | React 19, TypeScript strict, Inertia 3, Tailwind CSS 4, Vite 8 |
| UI | shadcn/ui (Radix), Lucide, Sonner, tw-animate-css |
| 3D | `three` + `@types/three` (aprobado en D9A, usado solo en el cubo del hero) |
| Calidad | Pest 4, Larastan/PHPStan, Pint, ESLint, Prettier |

### Implementado y verificado

- **Home publica implementada y protegida.** La ruta `/` (`routes/web.php`) renderiza `resources/js/pages/Public/Home.tsx`, que monta el hero premium actual. El inicio publico NO esta pendiente: es la base visual valida del proyecto y no debe rehacerse ni eliminarse.
- Hero completo (todos los componentes en uso, verificado por imports): `AbacoHero.tsx`, `FloatingHeader.tsx`, `HeroBrandRails.tsx`, `LogoCarousel.tsx`, `AbacoCrystalCube.tsx` (Three.js), `HeroParticleField.tsx`.
- La home real es `Public/Home.tsx`. Cualquier referencia a `welcome` debe tratarse como posible resto del starter, no como la landing principal.
- Dataset temporal de empresas en `resources/js/data/company-logos.ts` (todas las entradas con `logoReady: false`; se renderizan wordmarks).
- Estructura de assets de branding correcta: marca propia en `public/assets/branding/marca/`, empresas en `public/assets/branding/empresas/` con `originales/`, `optimizados/`, `README.md` y `logos-manifest.json`. Las carpetas de logos de empresas estan vacias (pendiente alta real con fuente verificada).
- CSS monolitico en `resources/css/app.css` (~1.240 lineas): estilos del hero, header, carruseles, modo claro/oscuro y dos secciones temporales.
- Scaffold del starter kit operativo pero fuera del producto: auth (Fortify, passkeys, 2FA), `dashboard`, `settings/*`, layouts internos.
- Scripts de calidad operativos: `npm run build`, `lint:check`, `types:check`, `composer test` (Pint + PHPStan + Pest).

### No existe todavia (verificado)

- Base de datos de negocio: cero migraciones propias (solo users/cache/jobs/passkeys/2FA del starter).
- Modelos de negocio: solo `User.php`.
- Controladores de negocio, panel admin, CRUDs, API interna.
- Carpeta `lang/` (ni raiz ni `resources/lang`); ningun sistema i18n (no hay `useLanguage`, ni `LanguageProvider`, ni `react-i18next`).
- Configuracion centralizada de empresa/navegacion/CTAs/SEO: todos los textos publicos estan hardcodeados en los componentes.
- Layout publico reutilizable, footer publico, paginas publicas distintas de la home.
- Hook `use-in-view.ts` ni clases `.abaco-reveal`/`.abaco-stagger` (las convenciones los describen, pero no existen aun).

### Desviaciones y deuda detectadas en la auditoria

| # | Hallazgo | Gravedad | Estado |
|---|---|---|---|
| 1 | `.git/` existia pero estaba vacio: sin repositorio funcional ni historial | Bloqueante | **Resuelto en FASE 0** (repo inicializado, commit inicial `5cb71b4`) |
| 2 | `CLAUDE.md` no existia en la raiz pese a estar referenciado por `AGENTES.md` y el indice | Alta | **Resuelto en FASE 0** (creado `CLAUDE.md` minimo que remite a `/docs` y protege el hero) |
| 3 | `resources/js/pages/welcome.tsx`: resto del starter sin ruta (la home real es `Public/Home.tsx`) | Media | **Resuelto en FASE 0** (eliminado junto a su `case 'welcome'` en `app.tsx` tras confirmar cero referencias; `/` sigue en `Public/Home.tsx`) |
| 4 | Textos publicos hardcodeados en `AbacoHero`, `FloatingHeader` (NAV_ITEMS), `Home` | Alta | Pendiente — FASE 2 y FASE 3 |
| 5 | Boton de idioma "ES" del header decorativo, sin funcionalidad | Media | Pendiente — FASE 3 |
| 6 | Dos secciones temporales de validacion visual en `Home.tsx` con copy de prueba | Media | Pendiente — FASE 1 |
| 7 | `pnpm-workspace.yaml` conviviendo con `package-lock.json` (npm) | Baja | **Resuelto en FASE 0** (eliminado: npm es el unico gestor, sin `pnpm-lock.yaml` ni referencias a pnpm; ver D14) |
| 8 | `AbacoDevPAletaColores.jpeg` ya no esta en la raiz aunque varios docs lo citaban como fuente | Baja | Resuelto documentalmente (D3 anotada) |
| 9 | `app.css` monolitico sin `tokens.css` (D2/D13 definen el formato de tokens pero no estan extraidos) | Media | Pendiente — FASE 1 |
| 10 | `tests/Pest.php` tenia `RefreshDatabase` comentado: los 30 tests Feature con DB fallaban ("no such table: users"); ademas 12 archivos de test sin newline final (Pint) | Alta | **Resuelto en FASE 0** (linea restaurada y formato corregido con Pint; suite 39/39 verde) |

---

## Bloqueantes reales

1. ~~Repositorio git vacio~~ — **Resuelto el 11/06/2026:** repositorio inicializado con commit inicial `5cb71b4` (245 archivos; `.env`, `node_modules`, `vendor` y builds excluidos por `.gitignore`).
2. ~~`CLAUDE.md` inexistente~~ — **Resuelto el 11/06/2026:** creado `CLAUDE.md` minimo en la raiz; remite a `/docs` como fuente de verdad y protege explicitamente la home y el hero.
3. **Logos oficiales de empresas sin alta real.** No bloquea desarrollo (hay wordmarks), pero bloquea publicacion: ningun logo externo puede publicarse sin fuente y derechos verificados (`logos-manifest.json`).
4. **Proveedor de correo de produccion sin decidir** (D10). No bloquea hasta FASE 6.
5. **Textos legales y claims comerciales sin validar** por cliente/legal. No bloquea hasta FASE 5.

---

## Principios de avance

- Arquitectura primero; los datos y el admin se construyen sobre una base visual y tecnica estable.
- Cero textos hardcodeados en componentes publicos: todo texto visible sale de i18n; todo dato de empresa/contacto/navegacion/CTA sale de configuracion centralizada.
- Multilenguaje desde fase temprana (`es` fallback, `en` obligatorio), antes de construir la web publica completa.
- La capa visual del hero se conserva y se reutiliza cuando cambie la fuente de datos (de `company-logos.ts` a base de datos/API).
- No se documenta como hecho lo que no existe en codigo.
- Nada de carpetas `old/backup/legacy/archive` ni archivos `*_old`, `*_backup`, `*_legacy`, `*_final`, `*_v2`. Git es el historico.
- Ninguna dependencia nueva sin pasar por el Guardian de Arquitectura (registro en `03_decisiones_dependencias_entornos.md`).
- Cada fase cierra con limpieza real y documentacion actualizada (ver regla documental permanente).
- No inventar metricas, claims, logos, textos legales ni datos comerciales no validados.

---

## Orden obligatorio de ejecucion

| Fase | Nombre | Estado |
|---|---|---|
| 0 | Limpieza, base tecnica y gobierno del proyecto | **Cerrada (11/06/2026)** |
| 1 | Arquitectura frontend y base visual | **Siguiente prioridad** |
| 2 | Arquitectura de datos de configuracion centralizada | Pendiente |
| 3 | Sistema multilenguaje global | Pendiente |
| 4 | Base de datos y modelos de negocio | Pendiente (modelo de datos ya cerrado documentalmente) |
| 5 | Web publica completa | Pendiente |
| 6 | Leads, reservas y automatizaciones | Pendiente |
| 7 | Panel admin y CRUDs | Pendiente |
| 8 | SEO, analitica, accesibilidad y rendimiento | Pendiente |
| 9 | QA, limpieza final y entrega | Pendiente |

El orden es secuencial: una fase no arranca sin cerrar los criterios de aceptacion de la anterior. Las unicas excepciones permitidas son tareas documentales y la incorporacion de logos verificados a las carpetas de assets, que pueden avanzar en paralelo.

---

## FASE 0 — Limpieza, base tecnica y gobierno del proyecto

**Estado: CERRADA el 11/06/2026.**

Resultado del cierre:

- Repositorio git inicializado; commit inicial `5cb71b4` con el estado base completo. Sin push (no hay remoto definido todavia).
- `CLAUDE.md` minimo creado en la raiz (remite a `/docs`, protege home y hero, reglas duras y validacion minima).
- `welcome.tsx` eliminado junto a su `case 'welcome'` en `app.tsx`, tras busqueda global con cero referencias. La ruta `/` sigue renderizando `Public/Home.tsx` con el hero intacto.
- `pnpm-workspace.yaml` eliminado: npm es el unico gestor (solo existe `package-lock.json`; sin `pnpm-lock.yaml` ni referencias a pnpm en scripts/CI). Registrado como D14.
- Hallazgo corregido durante validacion: `tests/Pest.php` tenia `RefreshDatabase` comentado (30 tests Feature fallaban por "no such table: users") y 12 archivos de test sin newline final. Restaurado y formateado con Pint.
- Busqueda global de `old/backup/legacy/archive/_old/_backup/_legacy/_final/_v2`: cero resultados.
- Validaciones en verde: `types:check` OK, `lint:check` OK, `build` OK (10,4s; aviso de chunk >500 kB por `three`, ya contemplado en FASE 8), `composer test` OK (Pint passed, PHPStan 0 errores, Pest 39/39 con 136 aserciones), `route:list` 44 rutas sin rutas muertas, `migrate:status` 5 migraciones del starter ejecutadas.
- El hero y la landing no se tocaron (solo se eliminaron el `case` inerte de `app.tsx` y archivos sin uso).

### Objetivo

Dejar el proyecto gobernable: historial real, gobernanza coherente, cero codigo muerto, dependencias y scripts confirmados.

### Alcance

- **Regla de proteccion previa:** la home real (`Public/Home.tsx`), el hero y todos sus componentes (`AbacoHero`, `AbacoCrystalCube`, `FloatingHeader`, `HeroBrandRails`, `HeroParticleField`, `LogoCarousel`) quedan fuera del alcance de cualquier limpieza. Ninguna tarea de FASE 0 los toca.
- Inicializar el repositorio git real (el `.git` actual esta vacio): `git init` + commit inicial completo. Sin esto no se cierra nada.
- Resolver la referencia a `CLAUDE.md`: crearlo minimo (remite a `/docs`) o corregir `AGENTES.md` e indice.
- Limpieza del resto del starter `welcome.tsx`: no participa en la ruta `/` (la home real es `Public/Home.tsx`). Eliminarlo, junto a su `case 'welcome'` en `app.tsx`, solo despues de volver a confirmar con busqueda global que no esta importado ni referenciado. No confundir nunca `welcome.tsx` con la home del proyecto.
- Decidir y dejar un solo gestor de paquetes coherente (npm con `package-lock.json` es el activo; confirmar si `pnpm-workspace.yaml` es necesario por hoisting de Inertia o se elimina).
- Confirmar dependencias instaladas contra `03_decisiones_dependencias_entornos.md` (todas las actuales estan justificadas: starter kit + `three` por D9A). Ninguna alta nueva.
- Confirmar scripts de build/lint/types/test funcionando y documentados.
- Confirmar rutas base reales (solo `/`, dashboard y settings del starter).
- Revision de limpieza: sin archivos sin uso, sin restos experimentales fuera de las dos secciones temporales de Home (que se eliminan en FASE 1, no aqui, porque sostienen la validacion visual del hero).

### Criterios de aceptacion

- `git log` muestra el commit inicial; `.gitignore` correcto (incluye `public/hot`, `public/build`, `.env`).
- Ninguna referencia rota a `CLAUDE.md` en la documentacion.
- Resto del starter `welcome.tsx` resuelto (eliminado tras confirmar cero referencias) con build verde, y la ruta `/` sigue renderizando `Public/Home.tsx` con el hero intacto.
- Busqueda global sin resultados de `old/backup/legacy/archive/_final/_v2`.

### Validaciones obligatorias

- `npm run lint:check`, `npm run types:check`, `npm run build`, `composer test`.

### Documentos a actualizar al cerrar

- Este roadmap (estado FASE 0).
- `00-indice.md` si cambia la gobernanza (`CLAUDE.md`).
- `03_decisiones_dependencias_entornos.md` si se elimina `pnpm-workspace.yaml`.

### No hacer

- No crear funcionalidades nuevas, no tocar el hero, no instalar nada.

---

## FASE 1 — Arquitectura frontend y base visual

### Objetivo

Convertir la landing actual en una arquitectura frontend de producto: layout publico, tokens, componentes base y accesibilidad, conservando el hero existente.

**Esta fase NO consiste en rehacer el hero.** La home con hero premium ya esta implementada y es la base visual valida. FASE 1 continua desde debajo del hero: layout publico si falta, footer, sistema de secciones, tokens, componentes base, accesibilidad, motion ligero y sustitucion de las secciones temporales de prueba por secciones reales.

### Alcance

- `PublicLayout` (layout publico real) con header y footer corporativos; `FloatingHeader` se integra o evoluciona dentro del layout.
- Footer publico oscuro corporativo (segun direccion visual 2026 de `01_identidad_y_estilo.md`).
- Sistema de secciones reutilizable (contenedor, alternancia de fondos, espaciado por tokens).
- Extraccion de tokens: `resources/css/tokens.css` con prefijo `--abaco-color-*` (D13) en formato RGB triplete (D2), mapeados en `@theme` de `app.css`. Troceo razonable del CSS monolitico.
- Componentes base reutilizables (botones/CTA, card base, eyebrow/heading, banda de seccion).
- Accesibilidad base: skip link, focus visible, landmarks, navegacion por teclado.
- Modo claro/oscuro consistente via tokens.
- Motion ligero: crear `resources/js/hooks/use-in-view.ts` y clases `.abaco-reveal`/`.abaco-stagger` (las convenciones ya los describen), siempre con `prefers-reduced-motion`.
- Sustituir las dos secciones temporales de `Home.tsx` por la estructura real de secciones (aunque el contenido llegue en fases posteriores como placeholders honestos).
- El hero (incluido `AbacoCrystalCube`) se conserva; solo se reubica dentro del layout.

### Criterios de aceptacion

- Toda pagina publica usa `PublicLayout`; no quedan secciones "de prueba".
- Tokens en `tokens.css`; sin valores arbitrarios hardcodeados nuevos en componentes.
- Lighthouse local sin regresiones graves de accesibilidad; teclado completo en header/footer.
- Modo oscuro y claro correctos en todas las superficies nuevas.

### Validaciones obligatorias

- `npm run lint:check`, `types:check`, `build`; revision manual responsive y teclado; `prefers-reduced-motion` probado.

### Documentos a actualizar al cerrar

- Roadmap; `02_Branding/02_design_system_tokens.md` (tokens reales extraidos); `03_Arquitectura/01_arquitectura_tecnica.md` (componentes/layout reales); `04_Funcionalidades/01_estructura_web_y_contenidos.md` (estado real de la home).

### No hacer

- No crear base de datos, no crear i18n todavia (los textos se centralizan en FASE 2 y se traducen en FASE 3), no añadir librerias de animacion.

---

## FASE 2 — Arquitectura de datos de configuracion centralizada

### Objetivo

Eliminar todo dato hardcodeado de los componentes publicos moviendolo a una capa de configuracion tipada y unica.

### Alcance

- Modulo de configuracion tipada en `resources/js/config/` (sin base de datos todavia):
  - empresa (nombre legal, comercial, direccion, telefono, email);
  - navegacion publica (items y anclas/rutas);
  - CTAs (textos y destinos);
  - servicios (lista base para secciones publicas);
  - marcas/empresas (se mantiene `company-logos.ts` como fuente temporal, consumida via esta capa);
  - SEO base (title por defecto, descripcion, OG global);
  - contacto y datos legales basicos.
- Refactor de `AbacoHero`, `FloatingHeader`, footer y secciones para consumir configuracion (los literales de texto largo siguen en el componente hasta FASE 3, pero datos de empresa, navegacion y CTAs ya no).
- Contratos TypeScript en `resources/js/types/`.

### Criterios de aceptacion

- Busqueda global: ningun telefono, email, direccion, nombre de empresa ni item de navegacion hardcodeado en componentes.
- `company-logos.ts` consumido solo a traves de la capa de configuracion (un unico punto de cambio para la futura migracion a API/DB).

### Validaciones obligatorias

- `lint:check`, `types:check`, `build`; render identico al de cierre de FASE 1 (refactor sin cambio visual).

### Documentos a actualizar al cerrar

- Roadmap; `03_Arquitectura/01_arquitectura_tecnica.md` (capa de configuracion); `05_Planificacion/02_convenciones.md` si se fijan convenciones nuevas de config.

### No hacer

- No crear tabla `settings` todavia (eso es D12, llega con el admin en FASE 7); no traducir textos todavia.

---

## FASE 3 — Sistema multilenguaje global

### Objetivo

i18n de interfaz completo antes de construir la web publica completa, para no migrar textos dos veces.

### Alcance

- Carpeta `lang/` en la raiz con `es` (fallback obligatorio) y `en` (obligatorio); `fr`, `pt`, `de` preparados como estructura solo si se confirma su necesidad (estan previstos en convenciones).
- Hook propio `useLanguage` (`t`, `locale`, `setLocale`, `supportedLocales`) sin dependencia externa (decision D9 revisada: sin `react-i18next`).
- `LanguageProvider` que actualice `<html lang="">`.
- Deteccion navegador + persistencia en `localStorage`.
- Selector de idioma real en el header (sustituye el boton "ES" decorativo).
- Migracion de todos los textos visibles publicos a claves (`home.hero.title`, `navigation.services`, ...), incluidos hero, header, footer y secciones.
- Laravel `lang/` para strings PHP (validaciones, emails) cuando existan.
- Fallback claro a `es`; sin claves huerfanas.

### Criterios de aceptacion

- Cero literales de copy publico en componentes (verificado por busqueda).
- Cambio de idioma en runtime sin recarga; `en` completo, no parcial.
- Sin claves presentes en un JSON y ausentes en otro (script o revision sistematica).

### Validaciones obligatorias

- `lint:check`, `types:check`, `build`; revision manual de ambos idiomas en claro/oscuro.

### Documentos a actualizar al cerrar

- Roadmap; `04_Funcionalidades/03_editor_media_i18n.md` (estado real i18n); `05_Planificacion/02_convenciones.md` (confirmar convenciones i18n como vigentes); `03_decisiones` si cambia algo de D9.

### No hacer

- No traducir contenido editorial (posts/servicios/casos en DB): eso sigue aplazado segun D9. No crear rutas localizadas ni hreflang (fase SEO).

---

## FASE 4 — Base de datos y modelos de negocio

### Objetivo

Implementar el modelo de datos cerrado en `03_Arquitectura/02_modelo_datos.md`.

### Alcance

- Migraciones en este orden: `collaborator_companies`, `projects`, `project_images`, `project_technologies`, con indices, foreign keys (`restrictOnDelete` para empresa en proyectos, `cascadeOnDelete` en auxiliares) y reglas de `project_type` (`individual` | `collaboration`).
- Modelos Eloquent `CollaboratorCompany`, `Project`, `ProjectImage`, `ProjectTechnology` con casts y relaciones.
- Factories y seeders minimos controlados (datos provisionales realistas, sin claims inventados).
- Preparar el contrato de datos para que el hero pueda alimentarse desde DB (la capa visual no se rehace; el cambio de fuente puede ejecutarse aqui o en FASE 5).
- Las demas tablas (leads, bookings, posts, services, settings, seo_metadata, audit_logs, media) NO se crean aqui: cada una llega con su fase (6, 7, 8).

### Criterios de aceptacion

- `php artisan migrate:fresh --seed` limpio; `migrate:status` coherente.
- Reglas 1-5 del modelo de datos respetadas (obligatoriedad segun `project_type`, visibilidad hero/portafolio segun `status`).
- Tests Pest minimos de modelos/relaciones.

### Validaciones obligatorias

- `composer test`; `php artisan migrate:status`; revision del Guardian de Arquitectura (tablas previstas en modelo de datos, ninguna extra).

### Documentos a actualizar al cerrar

- Roadmap; `03_Arquitectura/02_modelo_datos.md` (de propuesta a implementado); `03_Arquitectura/01_arquitectura_tecnica.md`.

### No hacer

- No crear CRUDs, controladores de negocio ni panel admin; no crear subida de archivos; no crear endpoints API publicos sin necesidad real.

---

## FASE 5 — Web publica completa

### Objetivo

Construir todas las secciones publicas reales alimentadas por datos y configuracion, en ambos idiomas.

### Alcance

- Home final (hero + propuesta de valor + servicios + portafolio destacado + social proof + CTA final).
- Servicios (paginas orientadas a intencion comercial segun `01_Investigacion/03` y `04`: consultoria CRM, fidelizacion, datos/BI, IA aplicada, Kit Digital...; el detalle editorial lo gobierna Contenidos).
- Portafolio publico alimentado por `projects` (naming publico de ruta se cierra aqui, segun D1).
- Sobre nosotros, FAQ, contacto (pagina; el formulario funcional llega en FASE 6), blog (estructura; editor admin llega en FASE 7), legales (con revision legal), errores 404/500.
- Separacion transparente entre proyectos propios, colaboraciones y partners (regla de Investigacion).
- `robots.txt` correcto; sitemap basico si ya hay rutas estables (la generacion automatizada llega en FASE 8).

### Criterios de aceptacion

- Todas las paginas con `PublicLayout`, i18n completo es/en, datos desde DB/config, cero hardcode.
- Logos externos solo si estan verificados en `logos-manifest.json`; si no, wordmarks.
- Sin paginas ficticias ni metricas inventadas.

### Validaciones obligatorias

- `lint:check`, `types:check`, `build`, `composer test`; revision responsive/teclado/contraste por pagina; revision de Contenidos sobre claims.

### Documentos a actualizar al cerrar

- Roadmap; `04_Funcionalidades/01_estructura_web_y_contenidos.md`; `02_Branding/05_referencias_ui_premium.md` (estado real de patrones).

---

## FASE 6 — Leads, reservas y automatizaciones

### Objetivo

Captacion funcional segun `04_Funcionalidades/02_reservas_correo_leads.md` y `05_automatizaciones.md`.

### Alcance

- Migraciones y modelos `Lead` y `Booking` (+ `lead_events` si se confirma scoring).
- Formularios de contacto y solicitud de cita (D8: solicitud simple, sin slots) con Form Request, CSRF, honeypot, rate limiting.
- Emails transaccionales Blade (acuse, notificacion admin, confirmacion, recordatorio 24h) via colas; Mailtrap en local; proveedor de produccion pendiente de D10.
- Eventos/listeners (`LeadCreated`, `BookingCreated`...), jobs y scheduler segun especificacion.
- Estados de reserva (`pending` → `confirmed`/`cancelled` → `completed`/`no_show`).
- Banner de cookies propio (sin GA4 todavia; GA4 llega en FASE 8).

### Criterios de aceptacion

- Flujo completo lead/reserva probado con tests (happy path, validaciones, honeypot, rate limit).
- Sin envios reales en local; colas funcionando con reintentos definidos.

### Validaciones obligatorias

- `composer test`; revision de Seguridad (PII, validaciones); revision de Automatizaciones (triggers, reintentos, logs).

### Documentos a actualizar al cerrar

- Roadmap; `04_Funcionalidades/02` y `05` (estado real); `03_Arquitectura/02_modelo_datos.md` (tablas nuevas).

---

## FASE 7 — Panel admin y CRUDs

### Objetivo

Gestion completa sin tocar codigo, segun `03_Arquitectura/04_seguridad_roles_permisos.md`.

### Alcance

- Roles (`super_admin`, `admin`, `editor`, `viewer`), policies y middleware `EnsureCanAccessAdmin` (se crea aqui; hoy no existe).
- CRUDs: empresas colaboradoras, proyectos (con visibilidad hero/portafolio), servicios, blog (Tiptap JSON, D4), leads, reservas, FAQs/testimonios si aplican.
- Media library (`spatie/laravel-medialibrary`, D5) con conversiones definidas.
- Ajustes globales: tabla `settings` + `SettingsService` con cache (D12); migracion de la configuracion de FASE 2 que deba ser editable.
- Auditoria: tabla propia `audit_logs` (D6) via observers/listeners.

### Criterios de aceptacion

- Todo contenido publico administrable; checks de visibilidad (hero, portafolio, publicado) operativos extremo a extremo.
- Policies cubiertas por tests; sin acceso admin sin permiso.

### Validaciones obligatorias

- `composer test` (incl. permisos); revision de Seguridad completa; QA funcional del panel.

### Documentos a actualizar al cerrar

- Roadmap; `04_seguridad` (de propuesta a implementado); `02_modelo_datos.md`; `03_decisiones` (dependencias activadas: medialibrary, Tiptap).

---

## FASE 8 — SEO, analitica, accesibilidad y rendimiento

### Objetivo

Calidad publica medible antes de la entrega.

### Alcance

- `seo_metadata` polimorfica (D11) y SEO editable desde admin; metadata, canonical, Open Graph, Schema.org (`Organization`, `Service`, `Article`, `FAQPage`, `BreadcrumbList`).
- Sitemap propio con `SitemapController` + `GenerateSitemapJob` (D7); robots definitivo.
- GA4 con carga condicional al consentimiento + eventos de conversion (`generate_lead`, `booking_request`); configuracion RGPD.
- Auditoria WCAG 2.2 AA (axe + Lighthouse + teclado manual).
- Core Web Vitals: imagenes optimizadas, lazy loading, revision de bundle (atencion especial al peso de `three`), cache y queries.
- Si se aborda SEO internacional: hreflang y, solo si se decide, rutas localizadas (hasta entonces no, segun convenciones).

### Criterios de aceptacion

- Lighthouse: Performance >80, Accesibilidad AA sin errores criticos; sitemap valido; eventos GA4 verificados bajo consentimiento.

### Validaciones obligatorias

- Lighthouse + axe documentados; revision SEO de titles/metas/schema por pagina.

### Documentos a actualizar al cerrar

- Roadmap; `04_Funcionalidades/04_analitica_seo_accesibilidad.md` (estado real).

---

## FASE 9 — QA, limpieza final y entrega

### Objetivo

Cierre verificable del producto.

### Alcance y criterios de aceptacion

- Suite completa de tests verde (`composer test`); `npm run build` limpio; `lint:check` y `types:check` sin errores.
- `php artisan route:list` revisada: sin rutas muertas. `migrate:status` coherente.
- Auditoria final del Eliminador de Deuda Tecnica: sin codigo muerto, sin imports sin uso, sin dependencias sin uso, sin documentos duplicados u obsoletos.
- Checklist go-live de `03_decisiones` (env, migraciones, build, colas, scheduler, SMTP, sitemap, robots, GA4 con consentimiento, backups, `super_admin`).
- Documentacion `/docs` 100% alineada con lo implementado.

### Validaciones obligatorias

- QA + Testing + Guardian + Documentacion + Eliminador (revision de cierre definida en `AGENTES.md`).

---

## Regla documental permanente

Cada fase o tarea tecnica debe cerrar actualizando, como minimo:

1. este roadmap (estado real de la fase);
2. el documento funcional afectado (`04_Funcionalidades/*`);
3. el documento de arquitectura si cambio estructura (`03_Arquitectura/01`);
4. el modelo de datos si hubo migraciones/modelos (`03_Arquitectura/02`);
5. el registro de decisiones/dependencias si se instalo o elimino algo (`03_Arquitectura/03`);
6. la documentacion i18n si cambian textos/traducciones (`04_Funcionalidades/03` y convenciones);
7. `00-indice.md` solo si se crea, elimina o renombra un documento.

Ninguna fase se considera cerrada sin esta actualizacion y sin la limpieza final (busqueda global de referencias, imports, dependencias y carpetas vacias).

---

## Que no se debe hacer (global)

- No crear documentacion nueva si se puede actualizar la existente; no acumular informes paralelos ni roadmaps alternativos.
- No conservar historicos locales: nada de `old/`, `backup/`, `legacy/`, `archive/`, `*_old`, `*_backup`, `*_legacy`, `*_final`, `*_v2`.
- No instalar dependencias sin Guardian de Arquitectura; no usar `ziggy-js` (el proyecto usa Wayfinder).
- No hardcodear textos, colores, rutas ni datos de empresa en componentes.
- No reabrir naming cerrado: `Project`/`projects`, `CollaboratorCompany`/`collaborator_companies` (D1).
- No simular modulos inexistentes con UI ficticia ni publicar logos/metricas/claims sin verificar.
- No modificar migraciones ya ejecutadas: solo añadir migraciones nuevas.

---

## Equivalencia con numeraciones antiguas

Documentos previos usan dos numeraciones distintas. Esta tabla evita renumerar todos los documentos funcionales: cuando un documento diga "Fase X", se interpreta asi:

| Referencia antigua | Donde aparece | Fase maestra actual |
|---|---|---|
| Fase 0 "Proyecto base" | roadmap anterior | Cerrada (absorbida por el estado actual) |
| Fase 1 "Base de datos" | roadmap anterior, `02_modelo_datos.md`, `AGENTES.md` (entidades de Fase 1) | FASE 4 |
| Fase 2 "Estructura vacia de modulos" | roadmap anterior, `01_estructura_web` | FASE 1 + FASE 2 |
| Fase 3 "Panel admin" | roadmap anterior, `01_estructura_web` | FASE 7 |
| Fase 4 "Portafolio publico" | roadmap anterior | FASE 5 |
| Fase 5 "Resto de secciones" | roadmap anterior | FASE 5 + FASE 8 |
| "Fase 3" (reservas, banner cookies) | `02_reservas_correo_leads.md`, `04_analitica` , D8 | FASE 6 |
| "Fase 5" (analitica GA4, integraciones, disponibilidad real, i18n) | `04_analitica`, `05_automatizaciones`, D8, D9 | FASE 8 (analitica/SEO), FASE 6+ (integraciones); i18n de interfaz adelantada a FASE 3 |
| "Fase 6" (auditoria privacidad, Playwright) | `04_analitica`, `03_decisiones` | FASE 8 + FASE 9 |
| "Fase 2" (medialibrary, Tiptap) | `03_decisiones` (dependencias) | FASE 7 |

El modelo de datos cerrado (`collaborator_companies`, `projects`, `project_images`, `project_technologies`) sigue integramente vigente; solo cambia el momento de ejecucion (FASE 4).

---

## Regla clave sobre el hero actual

- La home `/` esta implementada con el hero premium (`Public/Home.tsx` + `AbacoHero`) y queda **protegida**: no se rehace, no se renombra y no se elimina en ninguna fase de limpieza.
- `company-logos.ts` es una solucion temporal; desde FASE 2 se consume via la capa de configuracion y desde FASE 4/5 puede sustituirse por datos reales.
- Los carruseles y el cubo 3D actuales son capa visual reutilizable: no se rehacen al cambiar la fuente de datos.
- Cuando exista panel admin (FASE 7), añadir empresas o proyectos no debera requerir tocar codigo.

---

## Proximo paso exacto

0. **Regla previa permanente:** el hero actual y la home `/` (`Public/Home.tsx`) quedan protegidos. Ninguna tarea de limpieza los toca.
1. **FASE 0 cerrada el 11/06/2026** (git real con commit inicial, `CLAUDE.md` creado, starter limpio, validaciones en verde). Pendiente operativo menor fuera de fase: definir remoto git y hacer el primer push cuando el equipo lo decida.
2. **Arrancar FASE 1** continuando desde debajo del hero: `PublicLayout`, footer corporativo, sistema de secciones, extraccion de `tokens.css` (D2/D13), componentes base, accesibilidad base, motion ligero (`use-in-view.ts`) y sustitucion de las dos secciones temporales de `Home.tsx`.

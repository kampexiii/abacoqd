# Backlog y roadmap de implementación — AbacoQD

Última revisión: 28 de junio de 2026.

Roadmap orientado al producto completo del 30/06. Este documento conserva el histórico por fases, pero la **lectura vigente de cierre** es:

- marca pública final: **AbacoQD**;
- lanzamiento inicial **Spanish-first**;
- portfolio real actual autorizado;
- equipo con CVs dentro de alcance;
- admin ajustado a su alcance funcional actual;
- pendientes reales: foto de Mohamed, datos SMTP/correo, QA final y preparación de producción.

## Fase 0 — Documentación final y auditoría

**Objetivo.** Dejar una sola fuente de verdad por tema, vistas completas y sin duplicidades.

**Entregables.**

- Índice raíz y brief.
- Modelo de datos.
- SEO/multilenguaje/legal.
- Identidad/UI.
- Arquitectura admin.
- Vistas públicas y admin.
- Backlog alineado.

**Criterios.**

- Servicios y Proyectos tienen vista propia.
- Cookies, privacidad y aviso legal son páginas reales.
- Errores están separados.
- Solo tres documentos admin activos.
- Proyectos no queda archivado.
- No quedan referencias rotas ni documentos capa.

**Validación.** Búsquedas globales, revisión de enlaces `.md` y `git diff --check -- docs CLAUDE.md`.

## Fase 1 — Base pública y layout global

**Objetivo.** Adaptar la web pública a la navegación final manteniendo el hero protegido.

**Alcance.**

- Topbar: Metodología, Servicios, Proyectos, Quiénes somos, Blog, Contacto, selector de idioma UI y tema sistema.
- Sin botón Reservar en topbar.
- Footer con legales y datos de contacto confirmados desde settings.
- Settings con datos legales/corporativos confirmados y bloque institucional UE/FSE+ documentado.
- Dominio canónico final `https://abacoqd.com/`.
- Política de `abacodev.com`: confirmar redirección, convivencia temporal o dominio antiguo.
- CTA final de landing: mantener diseño aprobado, mockup editor/código, badges, botones, variantes claro/oscuro y titular `El 40% del tiempo de un desarrollador se pierde manteniendo código.`.
- Widget accesibilidad.
- Chatbot con fallback.
- Tema claro/oscuro/sistema.

**Validación.** Build, types, lint, responsive, teclado, reduced motion.

## Fase 2 — Modelo de datos y migraciones (cerrada 18/06/2026)

**Objetivo.** Implementar el modelo conceptual aprobado.

**Alcance.**

`settings`, `page_sections`, `section_blocks`, `methodology_steps`, `services`, `partners`, `projects`, `partner_project`, `team_members`, `posts`, `post_categories`, `tags`, `post_tag`, `faqs`, `contact_messages`, `booking_settings` (transicional), `reviews`, `blog_subscribers`, `seo_metadata`, `users.role`.

**Decisiones cerradas en esta fase** (detalle en `docs/02_MODELO_DATOS.md`):

- Contenido bilingüe en JSON embebido por fila (`{es, en}`), no fila-por-idioma con `language`/`translation_*_id`.
- Slugs públicos con columnas generadas `slug_es`/`slug_en` y unicidad por idioma a nivel de base de datos.
- SEO consolidado en `seo_metadata` (única fuente, sin columnas `seo_title`/`seo_description` embebidas en `services`/`projects`/`posts`).
- `cta` como columna JSON única (`{label, url}` por idioma) en `page_sections`/`section_blocks`/`services`.
- `projects.year` (entero) en vez de fecha completa.
- `users.role` con 4 valores: `super_admin`, `admin`, `editor`, `viewer`.
- Reserva: sistema propio de citas (ver Fase 3); `booking_settings` queda transicional.

**Criterios.**

- `services` sin entidad duplicada. ✅
- `partners` sin tabla paralela de empresas. ✅
- Proyectos (página) y sección Colaboraciones basados en `projects` + `partners`. ✅
- Base preparada para ES/EN en datos, sin hacer de EN un bloqueo actual de lanzamiento. ✅
- Estados/visibilidad y SEO listos. ✅
- `team_members` preparado para Quiénes somos sin obligar a publicar equipo. ✅

**Validación.** `composer test` (Pint + PHPStan + Pest, 42 tests / 160 aserciones) y `php artisan migrate:fresh --seed` sin errores.

## Fase 3 — Vistas públicas principales

**Objetivo.** Construir las vistas públicas documentadas.

**Avance (18/06/2026).** `/contacto` y `/reserva` implementados y validados (formulario real con `contact_messages`; sistema propio de citas con `appointment_days`/`appointment_slots`/`appointment_bookings`, transacción + bloqueo de fila contra doble reserva). CTAs de hero, CTA final, topbar y footer conectados a estas rutas. Resto de vistas de esta fase (`/metodologia`, `/servicios`, `/proyectos`, `/quienes-somos`, `/blog`, legales) siguen pendientes.

**Alcance.**

- Home completa con orden final.
- CTA final aprobado visualmente y en copy principal.
- `/metodologia`.
- `/servicios` y detalle habilitable.
- `/proyectos` y detalle de proyecto.
- `/quienes-somos`.
- `/blog` y post.
- `/contacto` y `/reserva` (sistema propio de citas: `appointment_days`/`appointment_slots`/`appointment_bookings`).
- `/aviso-legal`, `/privacidad`, `/cookies`.
- 404/500/503.

**Criterios.**

- El lanzamiento inicial responde en español; EN queda como evolución futura no bloqueante.
- Estados vacíos honestos.
- Sin datos inventados.
- SEO básico por vista.
- Accesibilidad y responsive revisados.

## Fase 4 — Admin editorial

**Objetivo.** Hacer editable el contenido crítico.

**Alcance.**

- Dashboard.
- Settings/marca/datos corporativos.
- Servicios.
- Partners.
- Proyectos.
- Equipo.
- Blog.
- Mensajes.
- Reserva/citas.
- FAQs.
- Usuarios.

**Criterios.**

- Cobertura real del admin actual.
- Estados, visibilidad, orden y mantenimiento ordinario del sitio.
- Sin reabrir módulos descartados como bloqueo documental.
- No publicar placeholders legales.

## Fase 5 — Blog, mensajes, reserva, SEO y chatbot

**Objetivo.** Cerrar flujos dinámicos y transversales.

**Alcance.**

- Blog, categorías, tags y destacados.
- Suscriptores con double opt-in.
- Mensajes de contacto.
- Reserva propia (`appointment_days`/`appointment_slots`/`appointment_bookings`) con fallback a contacto; sin doble reserva (transacción + bloqueo de fila).
- SEO metadata, sitemap, robots y canonical.
- FAQs/chatbot.
- Usuarios/roles.

**Criterios.**

- Blog no publica contenido falso.
- Mensajes protegidos con consentimiento.
- Reserva nunca queda rota; slots bloqueados/llenos/pasados nunca se muestran como disponibles.
- SEO principal en español completado.
- Chatbot redirige sin prometer datos no definidos.

## Fase 6 — QA final 30/06

**Objetivo.** Cierre de entrega.

**Validaciones.**

- `npm run lint:check`
- `npm run types:check`
- `npm run build`
- `composer test`
- revisión responsive;
- navegación por teclado;
- contraste;
- reduced motion;
- sitemap/robots/canonical;
- formularios y consentimientos;
- canonical `abacoqd.com`;
- decisión documentada sobre `abacodev.com` antes de producción;
- enlaces internos;
- búsqueda de contradicciones documentales.

## Pendientes reales de cierre y producción

- Recibir foto de Mohamed.
- Recibir datos SMTP corporativos para avisos a `info@abacoqd.com`.
- Configurar SMTP y verificar envío real de contacto y reserva.
- Ejecutar `npm run types:check`, `npm run lint:check`, `npm run build` y `composer test`.
- Revisar responsive y QA visual final en navegador real.
- Barrido final de textos/restos internos.
- Preparar commits limpios por bloques.
- Producción: dominio final, `.env` real, `APP_ENV=production`, `APP_DEBUG=false`, cookies seguras, SPF/DKIM/DMARC y revisión legal final si procede.

## No hacer

- No tocar hero protegido sin fase aprobada.
- No publicar datos demo como reales.
- No crear modelos duplicados.
- No instalar dependencias sin decisión.
- No crear más documentos admin.
- No dejar Proyectos o Servicios como piezas futuras.

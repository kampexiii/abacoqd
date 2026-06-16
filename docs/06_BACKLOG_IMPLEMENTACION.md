# Backlog y roadmap de implementación — AbacoQD

Última revisión: 14 de junio de 2026.

Roadmap orientado al producto completo del 30/06. La fase actual es exclusivamente documental: no código, no migraciones, no dependencias.

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

- Topbar: Metodología, Servicios, Proyectos, Quiénes somos, Blog, Contacto, idioma, tema sistema.
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

## Fase 2 — Modelo de datos y migraciones

**Objetivo.** Implementar el modelo conceptual aprobado.

**Alcance.**

`settings`, `page_sections`, `section_blocks`, `methodology_steps`, `services`, `partners`, `projects`, `partner_project`, `team_members`, `posts`, `post_categories`, `tags`, `post_tag`, `faqs`, `contact_messages`, `booking_settings`, `reviews`, `blog_subscribers`, `seo_metadata`, `users.role`.

**Criterios.**

- `services` sin entidad duplicada.
- `partners` sin tabla paralela de empresas.
- Proyectos (página) y sección Colaboraciones basados en `projects` + `partners`.
- ES/EN desde creación.
- Estados/visibilidad y SEO listos.
- `team_members` preparado para Quiénes somos sin obligar a publicar equipo.

## Fase 3 — Vistas públicas principales

**Objetivo.** Construir las vistas públicas documentadas.

**Alcance.**

- Home completa con orden final.
- CTA final aprobado visualmente y en copy principal.
- `/metodologia`.
- `/servicios` y detalle habilitable.
- `/proyectos` y detalle de proyecto.
- `/quienes-somos`.
- `/blog` y post.
- `/contacto` y `/reserva`.
- `/aviso-legal`, `/privacidad`, `/cookies`.
- 404/500/503.

**Criterios.**

- Cada vista responde a ES/EN.
- Estados vacíos honestos.
- Sin datos inventados.
- SEO básico por vista.
- Accesibilidad y responsive revisados.

## Fase 4 — Admin editorial

**Objetivo.** Hacer editable el contenido crítico.

**Alcance.**

- Dashboard.
- Settings/marca/datos corporativos.
- Distintivos institucionales y financiación en `settings.institutional`.
- Secciones y bloques.
- Metodología.
- Servicios.
- Partners.
- Proyectos.
- Reviews.
- Legal/cookies.

**Criterios.**

- CRUDs con ES/EN.
- Estados, visibilidad, orden, SEO.
- Validación de permisos de logos/proyectos.
- No publicar placeholders legales.

## Fase 5 — Blog, mensajes, reserva, SEO y chatbot

**Objetivo.** Cerrar flujos dinámicos y transversales.

**Alcance.**

- Blog bilingüe, categorías, tags y destacados.
- Suscriptores con double opt-in.
- Mensajes de contacto.
- Reserva agnóstica con fallback.
- SEO metadata, sitemap, robots, canonical, `hreflang`.
- FAQs/chatbot.
- Usuarios/roles.

**Criterios.**

- Blog no publica contenido falso.
- Mensajes protegidos con consentimiento.
- Reserva nunca queda rota.
- SEO por idioma completo.
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

## Pendientes que bloquean producción

- Confirmar teléfono legal visible principal.
- Proveedor de reserva.
- Stack definitivo de analítica/cookies y CMP.
- Revisión jurídica final de aviso legal, privacidad y cookies.
- Ubicación obligatoria de logos UE/FSE+/Fondos Europeos y rutas finales de assets.
- Política del estudio inicial.
- Proyectos/logos/capturas/reseñas con permiso.
- Copy final ES/EN de servicios, proyectos, blog, contacto y legales.
- Redes sociales reales.
- Horarios.

## No hacer

- No tocar hero protegido sin fase aprobada.
- No publicar datos demo como reales.
- No crear modelos duplicados.
- No instalar dependencias sin decisión.
- No crear más documentos admin.
- No dejar Proyectos o Servicios como piezas futuras.

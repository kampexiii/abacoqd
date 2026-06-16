# Arquitectura admin y contenido editable — AbacoQD

Última revisión: 14 de junio de 2026.

Fuente de verdad de arquitectura general del admin y de qué contenido debe ser editable. No implica crear migraciones ni tocar código en esta fase.

## Estado técnico real

Existe: Laravel 13, Inertia, React 19, TypeScript, Tailwind CSS 4, Vite, auth/settings del starter, home pública, hero avanzado, i18n básico ES/EN, dashboard base y modelo `User`.

No existe todavía: modelo de negocio AbacoQD, migraciones de contenido, admin editorial, CRUDs, blog real, proyectos reales, contacto persistido, reserva real, SEO dinámico ni legal final administrable.

## Principio general

El admin debe permitir evolucionar AbacoQD sin tocar código para cambios ordinarios de contenido, visibilidad, orden, CTA, SEO, idiomas, datos corporativos, servicios, proyectos, partners, blog, mensajes, reserva, legal/cookies, FAQs y accesibilidad/settings.

Solo hay tres documentos activos de admin:

- `07_VISTAS/ADMIN_01_LAYOUT_DASHBOARD_PATRONES.md`
- `07_VISTAS/ADMIN_02_CONTENIDO_MARCA_SERVICIOS_PARTNERS_PROYECTOS.md`
- `07_VISTAS/ADMIN_03_BLOG_MENSAJES_RESERVA_USUARIOS_SEO.md`

## Hero protegido

El hero actual se conserva como base visual y estructural. En fases posteriores solo se adaptan copy, logo, alt text, CTAs, enlaces y datasets de forma controlada. No se borra ni se reestructura sin fase aprobada.

## Módulos admin

### Dashboard

Resumen operativo: contenido pendiente de traducción, mensajes nuevos, estado de reserva, posts programados, proyectos pendientes de permisos, SEO incompleto, legales pendientes y FAQs activas.

### Settings / marca / corporativo

Gestiona nombre, claim, dominio, logos, favicon, datos legales, datos de contacto, distintivos institucionales, redes, tema por defecto, accesibilidad, navegación, SEO global, email y textos legales base.

Datos confirmados para carga inicial en `settings`: titular `ABACO DIGITAL DEVELOPMENTS, S.L.`, marca pública `Abaco Developments`, nombre abreviado `ABACO`, CIF `B-88229364`, Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002, dirección `Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid, España`, dominio canónico final `https://abacoqd.com/`, dominio histórico `https://abacodev.com/`, URL legal histórica `https://www.abacodev.com/`, teléfono `+34 91 020 00 89`, WhatsApp directo Andrés `+34 647 51 81 00`, email principal `info@abacodev.com`, email secundario `abacodevelopments@gmail.com` y email Andrés `andrescasanueva@abacodev.com`.

Datos institucionales en `settings.institutional`: logos be now Partner, Cofinanciado por la Unión Europea, Fondos Europeos y texto `Cofinanciado por la Unión Europea (FSE+) Subvención para la contratación de jóvenes - Comunidad de Madrid.`. No se mezclan con `partners` salvo decisión explícita.

### Home y páginas públicas

`page_sections` y `section_blocks` controlan Hero, Metodología, Servicios, Colaboraciones, Blog, CTA final, Footer, páginas legales y bloques de contacto/reserva.

### Metodología

CRUD de `methodology_steps` en ES/EN. Secuencia base: Análisis, Estudio inicial, Propuesta/enfoque, Desarrollo, Revisión, Entrega. El chip de gratuidad queda condicionado a decisión comercial.

### Servicios

CRUD de `services` con ES/EN, slug, mockup, icono, CTA, SEO y `is_detail_enabled`. Servicios iniciales: desarrollo web rápido, aplicaciones a medida, automatización con IA, CRM/datos/procesos, integraciones digitales, MVPs/prototipos.

### Proyectos, partners y sección Colaboraciones

La página pública **Proyectos** se gestiona con `partners`, `projects` y `partner_project`. El admin decide qué partners/proyectos aparecen en la sección de landing **Colaboraciones**. Debe controlar permisos de logos/capturas, roles declarados, estado, visibilidad, destacado, orden, traducciones y SEO por proyecto.

### Quiénes somos

Gestiona contenido corporativo, historia, hitos, valores y miembros publicables (`team_members`). Si no hay miembros visibles, la vista pública usa bloque corporativo y no muestra grid vacío.

### Blog

CRUD de posts, categorías y tags con ES/EN, contenido estructurado, relación de traducción, SEO, destacados de landing, programación, estado y suscriptores.

### Contacto y reserva

Mensajes de contacto, notas internas, estado, servicio relacionado, consentimiento, exportación controlada y configuración de `booking_settings` con fallback.

El formulario separa consentimiento obligatorio de privacidad y consentimiento opcional de comunicaciones comerciales. Reserva no hereda proveedor: preferencia documental `Cal.com`, salida rápida `Calendly`, `Amelia` solo si el stack final fuera WordPress.

### SEO

Edición de `seo_metadata`, sitemap, canonical, `noindex`, OG y datos estructurados permitidos. Validación de faltantes por idioma.

Dominio canónico final: `https://abacoqd.com/`. La política de `abacodev.com` queda pendiente de confirmación: redirección, convivencia temporal o dominio antiguo. Analítica recomendada: `GTM + GA4 + Search Console`; CMP recomendada: `CookieYes` salvo decisión distinta.

### Legal/cookies

Edición de textos legales, datos del titular, tabla de cookies, categorías de consentimiento y estado de banner si hay cookies no técnicas. El admin debe marcar el texto base aportado como pendiente de adaptación legal final a RGPD, LOPDGDD 3/2018, LSSI-CE y criterios actuales de cookies de AEPD.

### Chatbot / FAQs

CRUD de `faqs` por idioma, intención, respuesta, redirección, estado activo y orden. Debe cubrir servicios, metodología, proyectos, contacto, reserva, privacidad y cookies.

### Usuarios y roles

Roles previstos: `super_admin`, `admin`, `editor`, `viewer`. Se implementan de forma incremental sobre `users.role`, sin duplicar tabla de usuarios.

## Patrones CRUD

- Listado con búsqueda, filtros, estado, idioma y acciones.
- Formulario con tabs ES/EN y estado de traducción visible.
- Guardado de borrador y publicación separados cuando aplique.
- Validación server-side obligatoria.
- Preview pública autenticada cuando sea útil.
- Auditoría mínima para cambios sensibles: legal, settings, SEO, usuarios y exportaciones.

## Seguridad

CSRF, policies, rate limit en formularios públicos, honeypot, validación de servidor, consentimiento de privacidad, control de exportaciones, no envío de datos personales a analítica y logs para acciones administrativas críticas.

## Criterios de aceptación futuros

- Cambiar copy público no requiere tocar código.
- Ocultar o reordenar secciones no requiere despliegue.
- Publicar un proyecto exige permisos y datos mínimos.
- Quiénes somos aparece en topbar y puede editarse en ES/EN.
- El blog soporta relación ES/EN y SEO por idioma.
- Las legales no salen con placeholders.
- La reserva nunca rompe: si falta proveedor, fallback a contacto.
- El hero conserva su estructura protegida.

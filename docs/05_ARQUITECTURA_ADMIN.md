# Arquitectura admin y contenido editable — AbacoQD

Última revisión: 28 de junio de 2026.

Fuente de verdad de arquitectura general del admin y de qué contenido debe ser editable. No implica crear migraciones ni tocar código en esta fase.

> La publicación de proyectos y partners se gestiona con **Estado + Visibilidad**. `permission_status` se conserva únicamente como compatibilidad de datos.

## Estado técnico real

Existe: Laravel 13, Inertia, React 19, TypeScript, Tailwind CSS 4, Vite, páginas públicas principales, dashboard base, modelos de negocio, CRUDs editoriales y base SEO ya integrada.

Siguen abiertos a revisión de cierre: actualización documental, configuración SMTP real, QA final y revisión jurídica final si procede.

## Principio general

El admin debe permitir mantener AbacoQD sin tocar código para los cambios ordinarios cubiertos por el **alcance funcional actual**. Esta documentación no reabre módulos descartados ni trata como fallo lo que ya quedó fuera del cierre real.

Solo hay tres documentos activos de admin:

- `07_VISTAS/ADMIN_01_LAYOUT_DASHBOARD_PATRONES.md`
- `07_VISTAS/ADMIN_02_CONTENIDO_MARCA_SERVICIOS_PARTNERS_PROYECTOS.md`
- `07_VISTAS/ADMIN_03_BLOG_MENSAJES_RESERVA_USUARIOS_SEO.md`

## Hero protegido

El hero actual se conserva como base visual y estructural. En fases posteriores solo se adaptan copy, logo, alt text, CTAs, enlaces y datasets de forma controlada. No se borra ni se reestructura sin fase aprobada.

## Módulos admin

### Dashboard

Resumen operativo: mensajes nuevos, estado de reservas/citas, contenido visible, posts, partners/proyectos publicados, equipo visible y FAQs activas.

### Settings / marca / corporativo

Gestiona la configuración realmente disponible hoy: nombre/marca pública, claim, dominio, logos, favicon, datos legales básicos, datos de contacto, redes, footer, dominio canónico/anterior y algunos ajustes globales.

Datos confirmados para carga inicial en `settings`: titular `ABACO DIGITAL DEVELOPMENTS, S.L.`, marca pública `AbacoQD`, nombre abreviado `ABACO`, CIF `B-88229364`, Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002, dirección `Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid, España`, dominio canónico final `https://abacoqd.com/`, dominio histórico `https://abacodev.com/`, URL legal histórica `https://www.abacodev.com/`, teléfono `+34 91 020 00 89`, WhatsApp de atención comercial `+34 647 51 81 00`, email principal `info@abacoqd.com`, email secundario `abacodevelopments@gmail.com` y email comercial adicional `andrescasanueva@abacodev.com`.

Datos institucionales en `settings.institutional`: logos be now Partner, Cofinanciado por la Unión Europea, Fondos Europeos y texto `Cofinanciado por la Unión Europea (FSE+) Subvención para la contratación de jóvenes - Comunidad de Madrid.`. No se mezclan con `partners`.

### Home y páginas públicas

La web pública no se documenta ya como un CMS de bloques completo. El hero protegido, la estructura de landing y varias decisiones visuales/editoriales se mantienen cerradas en código y contenido, con edición puntual donde el producto actual la permite.

### Servicios

CRUD de `services` con slug, mockup, icono, CTA, SEO y `is_detail_enabled`. Servicios iniciales: desarrollo web rápido, aplicaciones a medida, automatización con IA, CRM/datos/procesos, integraciones digitales, MVPs/prototipos.

### Proyectos, partners y sección Colaboraciones

La página pública **Proyectos** se gestiona con `partners`, `projects` y `partner_project`. El admin decide qué partners/proyectos aparecen en la sección de landing **Colaboraciones**. El portfolio actual se considera autorizado para el lanzamiento; no se reabre como bloqueo documental salvo marca expresa en contra.

### Quiénes somos

Gestiona contenido corporativo, historia, hitos, valores y miembros publicables (`team_members`). La publicación de CVs forma parte del alcance cuando se haya solicitado. Pendiente real actual: falta la foto de Mohamed.

### Blog

CRUD de posts, categorías y tags, con contenido estructurado, SEO, destacados de landing, programación, estado y suscriptores. El lanzamiento inicial puede operar solo en español.

### Contacto y reserva

Mensajes de contacto, notas internas, estado, servicio relacionado, consentimiento, exportación controlada y gestión del sistema propio de citas (`appointment_days`, `appointment_slots`, `appointment_bookings`).

El correo receptor definitivo para avisos es `info@abacoqd.com`. Falta recibir `SMTP host`, `SMTP port`, `SMTP username`, `SMTP password` o app password, cifrado, `From`, `From name` y revisar SPF/DKIM/DMARC para dejar operativo el envío real.

### SEO

Existe base SEO en código (`seo_metadata`, sitemap, canonical, `noindex`, OG y datos estructurados permitidos). El lanzamiento actual se orienta al español; el EN queda como mejora futura, no como requisito bloqueante.

Dominio canónico final: `https://abacoqd.com/`. La política de `abacodev.com` queda por definir entre redirección, convivencia temporal o preservación histórica. Analítica recomendada: `GTM + GA4 + Search Console`; CMP recomendada: `CookieYes` salvo decisión distinta.

### Legal/cookies

Las páginas legales existen y el texto base requiere adaptación legal final a RGPD, LOPDGDD 3/2018, LSSI-CE y criterios actuales de cookies de AEPD. No se documenta como alcance obligatorio actual un CMS legal/cookies ampliado si el admin real no lo expone.

### Chatbot / FAQs

CRUD de `faqs`, intención, respuesta, redirección, estado activo y orden. Debe cubrir servicios, metodología, proyectos, contacto, reserva, privacidad y cookies.

### Usuarios y roles

Roles previstos: `super_admin`, `admin`, `editor`, `viewer`. Se implementan de forma incremental sobre `users.role`, sin duplicar tabla de usuarios.

## Patrones CRUD

- Listado con búsqueda, filtros, estado, idioma y acciones.
- Formulario con estado de traducción visible cuando aplique y estructura pensada para crecer sin hacer de EN un bloqueo actual.
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
- Quiénes somos aparece en topbar y puede mantenerse desde el admin actual.
- El blog soporta contenido en español y puede crecer a EN en una fase posterior.
- Las legales no salen con placeholders.
- La reserva nunca rompe: si falta proveedor, fallback a contacto.
- El hero conserva su estructura protegida.

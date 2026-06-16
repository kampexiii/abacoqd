# Índice de vistas — AbacoQD

Última revisión: 14 de junio de 2026.

Cada documento de vista explica cómo se ve, cómo se anima y cómo funciona una pantalla real: objetivo, rutas, estructura visual, secciones internas, desktop, mobile, modos claro/oscuro/sistema, animaciones propias, interacción, componentes, contenido editable, entidades relacionadas, SEO, multilenguaje ES/EN, estados vacíos, accesibilidad y relación con chatbot cuando aplica.

Paleta, tipografía, tokens, componentes y animaciones globales: `04_IDENTIDAD_UI_COMPONENTES.md`. Modelo de datos: `02_MODELO_DATOS.md`. SEO, idiomas y legal: `03_SEO_MULTILENGUAJE_LEGAL.md`.

Dominio canónico final del nuevo sitio: `https://abacoqd.com/`. `abacodev.com` queda como dominio histórico/investigado y posible dominio a redirigir o mantener, pendiente de confirmación.

## Vistas públicas activas

| Doc | Vista | Rutas |
|---|---|---|
| `PUBLIC_01_HOME_LANDING.md` | Home / Landing: Hero, Metodología, Servicios, Colaboraciones, Blog, CTA final, Footer | `/` · `/en` |
| `PUBLIC_02_METODOLOGIA_PROCESO.md` | Metodología / Proceso: sección landing + página ampliada | `/metodologia` · `/en/methodology` |
| `PUBLIC_03_SERVICIOS.md` | Servicios: listado, detalle preparado y sección landing | `/servicios` · `/servicios/{slug}` · `/en/services` |
| `PUBLIC_04_PROYECTOS.md` | Proyectos: listado, detalle de proyecto y sección de landing (Colaboraciones) | `/proyectos` · `/proyectos/{slug}` · `/en/projects` |
| `PUBLIC_05_BLOG.md` | Blog: índice, post y destacados de landing | `/blog` · `/blog/{slug}` · `/en/blog` |
| `PUBLIC_06_CONTACTO_RESERVA.md` | Contacto + Reserva agnóstica con fallback a contacto | `/contacto` · `/reserva` · `/en/contact` · `/en/book` |
| `PUBLIC_07_LEGAL_COOKIES_PRIVACIDAD.md` | Aviso legal, privacidad, cookies y banner/gestión de consentimiento | `/aviso-legal` · `/privacidad` · `/cookies` |
| `PUBLIC_08_ERRORES.md` | Errores 404, 500 y mantenimiento/503 | 404 · 500 · 503 |
| `PUBLIC_09_LAYOUT_GLOBAL.md` | Layout global: topbar, footer, idioma, tema, accesibilidad, chatbot y z-index | todas |
| `PUBLIC_10_QUIENES_SOMOS.md` | Quiénes somos: origen, equipo/estudio y relación con Ábaco Developments | `/quienes-somos` · `/en/about` |

## Vistas admin activas

Solo existen tres documentos activos de admin. No se recrea el admin en 9 documentos.

| Doc | Ámbito |
|---|---|
| `ADMIN_01_LAYOUT_DASHBOARD_PATRONES.md` | Layout del panel, dashboard, patrones CRUD, permisos, ES/EN, estados, tablas, formularios, auditoría y accesibilidad del admin |
| `ADMIN_02_CONTENIDO_MARCA_SERVICIOS_PARTNERS_PROYECTOS.md` | Marca, settings, home, metodología, servicios, partners, proyectos, reviews, legal/cookies editable |
| `ADMIN_03_BLOG_MENSAJES_RESERVA_USUARIOS_SEO.md` | Blog, categorías, tags, suscriptores, mensajes, reserva, usuarios/roles, SEO, sitemap, FAQs/chatbot |

## Archivo

No hay vistas archivadas activas. En esta revisión `PORTAFOLIO.md`, `PORTAFOLIO_DETALLE.md` y `QUIENES_SOMOS.md` se recuperaron, limpiaron y convirtieron en vistas activas del producto 30/06. La carpeta `90_ARCHIVO/` estaba vacía y se ha eliminado del repositorio.

## Reglas

- El nombre público de navegación/topbar y de la página es **Proyectos**; la sección de la landing con logos/empresas/trabajos se llama **Colaboraciones**. No se usa "Portafolios" como término público.
- `partners`, `projects` y `partner_project` son el soporte interno de Proyectos y de la sección Colaboraciones.
- "Tipologías" no existe como vista ni concepto activo: es **Servicios** (`services`).
- La reserva no aparece en topbar; solo en Hero, CTA final y bloques contextuales.
- El CTA final de la landing conserva diseño, estructura, editor/código, badges, botones y titular `El 40% del tiempo de un desarrollador se pierde manteniendo código.` aprobados.
- Blog se oculta en navegación hasta que existan posts publicados, pero su vista está documentada como producto base.
- Las animaciones específicas de cada vista viven en su doc; las globales en `04_IDENTIDAD_UI_COMPONENTES.md`.
- Los datos reales corporativos, legales, de contacto e institucionales se documentan en `01_BRIEF_ALCANCE.md` y se cargan desde `settings`.

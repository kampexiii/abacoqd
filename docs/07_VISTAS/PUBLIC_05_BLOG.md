# Vista pública — Blog (índice + post)

Última revisión: 14 de junio de 2026. Documento consolidado (índice + post del blog).

## Identificación

| Campo | Índice | Post |
|---|---|---|
| Ruta ES | `/blog` | `/blog/{slug}` |
| Ruta EN | `/en/blog` | `/en/blog/{slug}` |
| Prioridad | Base (producto definitivo 30/06) | Base |
| Componente previsto | `resources/js/pages/Public/BlogIndex.tsx` | `resources/js/pages/Public/BlogPost.tsx` |
| Entidades | `posts`, `post_categories`, `tags` | `posts`, `post_categories`, `tags`, `seo_metadata` |

Modelo de datos en `docs/02_MODELO_DATOS.md` (no se redefine aquí). Paleta y componentes en `04_IDENTIDAD_UI_COMPONENTES.md` (no se repiten aquí; las referencias `qd-*` remiten a sus tokens).

## Objetivo

Sostener el SEO editorial del proyecto con contenido técnico bilingüe. El blog es **bilingüe por diseño**: cada post vive en un idioma con slug y SEO propios, y se empareja con su traducción ES↔EN cuando existe (`translation_post_id`). El índice muestra **solo posts del idioma activo**; destacados, categorías y SEO son por idioma.

---

# A. Índice del blog

## Estructura visual

Orden de bandas: `mist (cabecera) → white (destacado + grid) → ink (CTA)`. Chips de categoría en teal suave con texto teal oscurecido.

1. **Cabecera de blog** — fondo `qd-mist` compacto; breadcrumb; H1 `Blog`; subcopy editorial (desarrollo rápido, IA aplicada, herramientas internas, casos técnicos).
2. **Post destacado del idioma activo** (último publicado) — card hero horizontal: imagen 16:9 a la izquierda (55%), contenido a la derecha (chip de categoría, título grande Poppins 600, extracto 2–3 líneas, fecha + tiempo de lectura calculado).
3. **Filtro por categorías** — fila de chips: `Todo` + categorías visibles del idioma con conteo. Activo: fondo ink, texto blanco. Filtro por tag queda fuera de esta entrega (vía página/tag o query param más adelante).
4. **Grid de posts** — cards con imagen 16:9, chip de categoría, título (máx. 2 líneas, ellipsis), extracto (2 líneas), fecha + lectura. Paginación numérica al pie (no scroll infinito: mejor para SEO y accesibilidad).
5. **CTA final estándar + footer** — banda CTA global reducida (el blog no es un embudo agresivo; CTA discreto).

## Desktop

- Cabecera de ancho completo; destacado horizontal 55/45.
- Grid de 3 columnas; chips de filtro en una fila.
- Paginación centrada al pie.

## Mobile

- Destacado apilado (imagen sobre contenido).
- Grid de 1 columna (2 en tablets intermedias); chips de filtro en fila con scroll horizontal accesible.
- Paginación compacta.

## Animaciones propias

- Entrada del grid con **fade-up** por scroll (`IntersectionObserver`) y stagger por card.
- Card destacada: **hover destacado** (lift + borde teal) e imagen con zoom sutil (~1.03).
- Cards del grid: hover con elevación ~2 px + borde teal sutil; título a teal.
- CTA `Leer artículo` con desplazamiento sutil de la flecha.
- Todo respeta `prefers-reduced-motion` (estado final estático). Principios en `04_IDENTIDAD_UI_COMPONENTES.md`.

## Interacción

- Filtro de categoría reflejado en URL (`/blog?categoria=` o ruta propia; se decide en implementación por SEO).
- Cambio de idioma global: lleva al índice del otro idioma (`/blog` ↔ `/en/blog`), no a una traducción post a post.
- Tiempo de lectura calculado del contenido real (sin inventar).

## Componentes usados

Cards, chips de filtro, paginación numérica, breadcrumb y banda CTA del sistema de componentes (`04_IDENTIDAD_UI_COMPONENTES.md`).

## Contenido editable

- H1 y subcopy de cabecera; copy del CTA final.
- Posts, categorías y tags (gestión en admin; modelo en `02_MODELO_DATOS.md`).
- Imagen, categoría, extracto y orden de destacado se derivan del último post publicado del idioma.

## Entidades relacionadas

`posts`, `post_categories`, `tags`. Autor único v1: marca **Abaco Developments**.

## SEO

- Title ES: `Blog de CRM, datos e IA aplicada | Abaco Developments` (equivalente EN por idioma).
- `hreflang` entre `/blog` y `/en/blog` (índices, no posts).
- JSON-LD: `Blog`/`CollectionPage` + `BreadcrumbList`.
- Paginación con enlaces normales indexables.
- Reglas de slug/idioma en `03_SEO_MULTILENGUAJE_LEGAL.md`.

## Estados vacíos

- **Sin posts en el idioma** (pre-lanzamiento editorial): cabecera + mensaje honesto `Estamos preparando los primeros artículos.` + enlace a Metodología/Servicios. La sección/índice se oculta: el ítem `Blog` no aparece en navegación y la ruta queda `noindex` (el enlace del footer puede mantenerse).
- **Categoría sin posts**: mensaje + reset de filtro.
- **Imágenes faltantes**: patrón de marca (fondo ink + isotipo), consistente con el resto del sitio.

## Accesibilidad

- Cada card con un único enlace de título extendido a toda la card (sin enlaces anidados duplicados).
- Chips de filtro como botones con `aria-pressed` y foco visible.
- Fechas en `<time datetime>`.

## Relación con chatbot

El asistente puede sugerir artículos destacados, responder preguntas frecuentes relacionadas con categorías y redirigir a un post, servicio, contacto o reserva. No genera artículos ni sustituye contenido editorial validado.

## Modo claro/oscuro

- Bandas `qd-ink` fijas (marca). Las bandas claras (cabecera, grid) definen su variante dark según el design system. Chips, bordes de hover y focus ring se ajustan al tema.

---

# B. Post (detalle)

## Objetivo

Lectura técnica cómoda y SEO por artículo, tratando bien texto largo, código y capturas. El post enlaza a su traducción si existe.

## Estructura visual

Vista predominantemente clara (blanco) para lectura; código en `qd-ink`; acentos teal. Lime solo en la barra de progreso y el enlace del CTA.

1. **Cabecera de artículo** — fondo `qd-white`; breadcrumb `Inicio / Blog / {categoría}`; chip de categoría; H1; extracto como standfirst gris; meta: fecha (`<time>`), tiempo de lectura calculado, autor (v1 `Abaco Developments`). **Selector de idioma del artículo**: si existe traducción, enlace visible `Read this post in English →` / `Leer en español →`; si no existe, no se muestra.
2. **Imagen de portada** — 16:9 hasta ~1100 px, radio suave; opcional según post.
3. **Cuerpo del artículo** (núcleo) — columna de lectura máx. ~70ch centrada; cuerpo 17–18 px, line-height 1.7. Render desde contenido estructurado (`content_json`, no HTML libre): H2/H3, párrafos, listas, citas, imágenes con pie, tablas simples y **bloques de código** con resaltado de sintaxis, fondo `qd-ink`, fuente mono y botón copiar. Enlaces en teal oscurecido con subrayado.
4. **Pie de artículo** — fila de tags (chips suaves, enlazan a listados de tag cuando existan); bloque compartir sobrio (copiar enlace + LinkedIn + X con iconos lucide, sin SDKs de terceros); caja de autor de marca Abaco Developments con una línea y enlace a quiénes somos.
5. **Posts relacionados** — 3 cards (misma categoría/idioma, más recientes). Vacío → oculto.
6. **CTA contextual** — banda `qd-mist` ligera: `¿Quieres aplicar esto en tu negocio?` + enlace al contacto/reserva (ver `PUBLIC_06_CONTACTO_RESERVA.md`). Discreto.
7. **Footer global**.

## Elemento distintivo — barra de progreso de lectura

- Línea de 2–3 px fija bajo el header flotante que se rellena `qd-teal`→`qd-lime` con el avance de lectura.
- `aria-hidden`, desactivada con `prefers-reduced-motion`.

## Desktop

- TOC sticky lateral si el post tiene 3+ H2 (auto-generado, ≥1280 px).
- Columna de lectura centrada; portada hasta ~1100 px.

## Mobile

- TOC colapsado bajo la portada.
- Columna a ancho cómodo; bloques de código con scroll horizontal accesible.

## Animaciones propias

- Mínimas: fade inicial de cabecera, barra de progreso de lectura, hover de cards relacionadas. **Nada dentro del cuerpo de lectura.** Principios en `04_IDENTIDAD_UI_COMPONENTES.md`.

## Interacción

- Botón copiar en bloques de código con feedback textual (`Copiado`).
- Selector de idioma del artículo (solo si hay traducción real).
- Compartir: copiar enlace + redes sin scripts de terceros.

## Componentes usados

Prose de lectura, bloque de código con resaltado, TOC `nav`, chips de tag, botones de compartir, cards relacionadas y banda CTA del sistema de componentes.

## Contenido editable

- Título, extracto, portada, cuerpo (`content_json`), categoría, tags y SEO por post e idioma.
- Caja de autor v1 fija (marca Abaco Developments).

## Entidades relacionadas

`posts`, `post_categories`, `tags`, `seo_metadata`. Emparejamiento ES↔EN vía `translation_post_id`.

## SEO

- Title/description por post e idioma; canonical propio; OG con portada.
- `hreflang` por par de traducción real (es/en/x-default).
- JSON-LD: `Article` (headline, datePublished, dateModified, image, author Organization) + `BreadcrumbList`.
- Slugs según `03_SEO_MULTILENGUAJE_LEGAL.md` (independientes por idioma, estables, con redirección si cambian).

## Estados vacíos

- Post `draft`/`scheduled`/`hidden` → 404 público.
- Sin traducción → sin selector de idioma del artículo; el switch global lleva al índice del otro idioma.
- Sin relacionados → sección oculta.

## Accesibilidad

- Jerarquía estricta H1→H2→H3; TOC como `nav` con label.
- Bloques de código con contraste AA y scroll horizontal accesible.
- Botón copiar con feedback no solo visual.
- Imágenes del cuerpo con `alt` obligatorio desde el editor.

## Relación con chatbot

En detalle de post, el chatbot puede ofrecer `Aplicar esto a mi negocio`, `Ver servicios relacionados` o `Contactar`, pero no resume ni reinterpreta el post como fuente legal/técnica definitiva.

## Modo claro/oscuro

- Cuerpo claro por defecto; bloques de código `qd-ink` constantes. La variante dark adapta fondo de lectura, bordes y enlaces manteniendo contraste AA.

## Decisiones abiertas (blog)

- Visibilidad del ítem `Blog` en navegación antes de tener contenido (ocultar hasta haber posts publicados).
- Categorías iniciales (propuesta editorial).
- Librería de resaltado de sintaxis (decisión de dependencia documentada).
- Editor de contenido estructurado (ver `05_ARQUITECTURA_ADMIN.md`).
- Suscripción al blog (`blog_subscribers`, double opt-in): existe en el modelo (`02_MODELO_DATOS.md`) y se gestiona en `ADMIN_03_BLOG_MENSAJES_RESERVA_USUARIOS_SEO.md`; su widget público (alta/confirmación/baja) se define al cerrar esa pieza.

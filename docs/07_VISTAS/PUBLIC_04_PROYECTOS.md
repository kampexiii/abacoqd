# PUBLIC_04 — Proyectos

Última revisión: 26 de junio de 2026.

Fuente de verdad de la página pública **Proyectos**: listado, detalle de proyecto y de la **sección Colaboraciones** dentro de la landing (bloque de logos, marcas y trabajos). Recupera y sustituye los antiguos borradores de portafolio y detalle de portafolio (ya retirados del archivo).

> **Actualización Bloque 7 (26/06):** se eliminó el contenido legacy (11 proyectos + 17 partners de terceros) de la BD y su seeder. Queda **solo CIETE** como proyecto real confirmado, visible en `/proyectos`. La **sección Colaboraciones ya no tiene fallback estático de marcas reales** (`company-logos.ts` borrado): se alimenta solo de partners publicables desde BD y, si no hay, muestra un **estado vacío honesto** (sin logos de terceros, sin copy de «permiso»). La visibilidad pública se controla por estado + visibilidad; `permission_status` queda como compatibilidad interna (`approved`).
>
> **Media de proyecto (subfase 7.3, 26/06):** la tarjeta y el detalle usan `cover_image`; `thumbnail_image` apunta a la misma ruta que la portada (una sola imagen), por lo que `coverImage ?? thumbnailImage` sigue funcionando sin cambios. El proyecto puede tener logo de cliente color/monocromo (`logo`/`logo_dark`/`logo_alt`); su uso público (claro → `logo`, oscuro → `logo_dark` con fallback a `logo`, alt desde `logo_alt`) queda para una iteración posterior, no se rediseña aquí.

> Naming final: el **topbar y la página pública** se llaman **Proyectos** (`/proyectos`). La **sección de la landing** con logos/empresas/trabajos se llama **Colaboraciones**. El **modelo interno** es `projects`, `partners`, `partner_project`. No se usa "Portafolios" como término público activo.

## Identificación

| Campo | Valor |
|---|---|
| Nombre público (topbar y página) | Proyectos |
| Sección equivalente en landing | Colaboraciones |
| Ruta listado ES | `/proyectos` |
| Ruta listado EN | `/en/projects` |
| Ruta detalle ES | `/proyectos/{slug}` |
| Ruta detalle EN | `/en/projects/{slug}` |
| En landing | Sección 4 (Colaboraciones), después de Servicios y antes de Blog |
| Prioridad | P0 como vista documentada; contenido real solo con permisos |
| Entidades | `partners`, `projects`, `partner_project`, `seo_metadata`, `reviews`, `settings`, `faqs` |

## Criterio de nombre

El nombre público de **topbar y página es Proyectos** (`/proyectos`). La **sección de la landing** que muestra logos, marcas y trabajos se llama **Colaboraciones**. Internamente, ambas se apoyan en:

- `partners` = empresas, marcas, clientes o colaboradores.
- `projects` = proyectos, trabajos o casos publicables.
- `partner_project` = relación y rol de cada partner en cada proyecto.

No se usa el nombre interno de relaciones como etiqueta de navegación, ni "Portafolios" como término público activo.

Los logos institucionales aportados (be now Partner, Cofinanciado por la Unión Europea y Fondos Europeos) no son clientes, proyectos ni partners de Proyectos por defecto. Se documentan en `settings.institutional` y solo aparecerán en esta vista si el cliente confirma expresamente que deben mostrarse como credenciales institucionales dentro del bloque de confianza.

## Objetivo

Demostrar experiencia y confianza con proyectos reales o, si todavía no hay permisos, con un estado vacío honesto. La vista no inventa clientes, logos, métricas ni casos.

## Sección Colaboraciones en landing

**Estructura visual.** Layout split: izquierda eyebrow `COLABORACIONES`, H2 `Proyectos y colaboraciones que conectan experiencia, tecnología y negocio`, subtítulo `Trabajamos sobre proyectos propios, colaborativos o desarrollados junto a partners, siempre adaptando la solución al contexto real de cada cliente.`; derecha composición orbital amplia tipo noria/reloj con botón-pivote. Las burbujas de marcas son glass/translúcidas y de tamaño suficiente para leer el logo. Cuando haya proyectos destacados, la pieza activa muestra nombre de proyecto, partner visible y CTA `Ver proyecto`. Si los permisos no están confirmados, los logos se muestran solo con tratamiento `DEMO` / pendiente de confirmación.

**Desktop.** Texto a la izquierda y órbita a la derecha. La noria gira en sentido horario: las marcas empiezan a aparecer en las 12, alcanzan máximo tamaño/opacidad/nitidez en las 3, desaparecen en las 6 y continúan ocultas de 7 a 11 hasta reaparecer en las 12. La pieza activa puede alternar entre logo de partner y card de proyecto. El botón-pivote lleva al proyecto o al listado público de Proyectos (`/proyectos`).

**Mobile.** Texto arriba; debajo, carrusel horizontal de cards/logos o estado compacto. El activo siempre tiene texto legible, no solo logo.

**Animaciones propias.** Movimiento orbital continuo con cálculo por posición angular, pausa en hover/focus; active card con escala/opacidad controlada; reduced motion congela el set.

**Estados vacíos en landing.** Si no hay proyectos ni logos publicables, se muestra un bloque honesto: `Primeros casos en preparación` + CTAs `Ver servicios` y `Cuéntanos tu proyecto`. No se publican logos falsos ni cards de demo sin marca visible de demo.

## Página `/proyectos`

### Estructura visual

1. **Hero compacto.** Fondo `qd-mist`; breadcrumb; H1 `Proyectos`; subcopy: `Proyectos construidos a medida. Publicamos solo lo que podemos enseñar.`
2. **Filtros.** Chips por servicio/sector/partner si hay volumen suficiente. Si hay menos de 6 proyectos, no se muestran filtros.
3. **Grid de proyectos.** Cards 3 columnas desktop / 2 tablet / 1 móvil. Destacados primero.
4. **Bloque de partners/marcas.** Logos permitidos, con roles claros. Se oculta si no hay permisos.
5. **Estado vacío honesto.** Sustituye grid y logos si no hay contenido publicable.
6. **CTA final.** `Tu proyecto puede ser el siguiente.` + reserva/contacto.
7. **Footer global.**

### Card de proyecto

Cover 16:10, título, resumen, partner principal si es publicable, chips de servicio/tecnología, año y CTA `Ver proyecto`. Hover: zoom de cover 1.03, overlay con flecha, borde teal. Focus replica el hover.

### Desktop

Hero compacto, filtros en fila, grid 3 columnas, destacados con posibilidad de ocupar 2 columnas si hay suficientes casos.

### Mobile

Filtros en scroll horizontal accesible; grid 1 columna; texto de partner visible debajo del título; botones a 44 px mínimo.

### Modos claro, oscuro y sistema

Claro: `qd-bg`/blanco, cards claras, logos a color cuando tengan permiso. Oscuro: `qd-ink`/`qd-surface`, logos en versión clara/monocroma si existe; si no, se usa contenedor con contraste y alt textual.

## Detalle `/proyectos/{slug}`

### Estructura

1. **Cabecera de proyecto.** Fondo `qd-ink`; breadcrumb; H1; resumen; meta grid: año, servicio, partner principal, tecnologías.
2. **Cover principal.** Imagen ancha autorizada con radio, sombra y alt editable.
3. **Cuerpo del caso.** Secciones: `El contexto`, `Lo que construimos`, `Cómo lo construimos`, `El resultado`. El resultado solo incluye hechos confirmados.
4. **Galería.** Imágenes autorizadas desde `gallery_json`; datos sensibles ocultos.
5. **Partners y roles.** Banda `qd-mist` con logos/nombres y rol exacto (`cliente`, `colaborador`, `partner tecnológico`, etc.).
6. **Reseña vinculada.** Solo si existe `review` real con permiso.
7. **Proyectos relacionados.** Hasta 3 cards por servicio/tecnología.
8. **CTA final.** `¿Necesitas algo parecido?` + reserva/contacto.
9. **Footer global.**

### Animaciones

Reveal de cover con fade + scale leve; secciones con fade-up; galería/lightbox con transición rápida. Sin parallax pesado ni efectos que entorpezcan la lectura.

## Contenido editable

Listado: hero, subtítulo, filtros, orden y CTA. Proyecto: título, slug, resumen, cuerpo, cover, galería, tecnologías, partner principal, partners relacionados, URLs públicas, estado, destacado, SEO y traducción ES/EN.

## Entidades relacionadas

- `projects`: caso/proyecto publicable.
- `partners`: empresa, marca, cliente o colaborador relacionado.
- `partner_project`: relación N:M y rol.
- `reviews`: reseñas reales opcionales.
- `seo_metadata`: SEO por proyecto e idioma.
- `faqs`: respuestas del chatbot sobre proyectos, permisos, plazos o forma de trabajo.

## SEO y multilenguaje

- Listado indexable cuando haya contenido suficiente. Si se lanza vacío, puede ir `noindex` temporal sin ocultar la ruta.
- Detalle indexable solo si `status=published`, `is_visible=true`, contenido completo y permisos cerrados.
- Slugs por idioma; `hreflang` solo entre proyectos traducidos reales.
- OG usa cover autorizado; si no existe, patrón de marca.
- JSON-LD `BreadcrumbList` y `CreativeWork` opcional. `Review` solo con reseña real.

## Estados vacíos

- Sin proyectos: bloque `Primeros casos en preparación`, explicación de validación de permisos y CTAs a Servicios/Contacto.
- Filtro sin resultados: mensaje `Aún no hay proyectos publicados de este tipo` + reset.
- Proyecto borrador/oculto: 404 público.
- Sin partner publicable: se oculta partner; nunca se sugiere autoría no confirmada.
- Sin cover: patrón de marca, no stock falso.

## Accesibilidad

Cards con enlace único, filtros como botones con `aria-pressed`, alt editable en logos/covers, galería con focus trap, escape y navegación por teclado. La animación del carrusel no contiene información exclusiva.

## Relación con chatbot

El asistente puede sugerir `Ver proyectos`, explicar por qué algunos casos no son públicos y redirigir a servicios o contacto si no hay un proyecto equivalente.

## Decisiones abiertas

- Lista de proyectos históricos que pueden publicarse y rol exacto de AbacoQD/Ábaco.
- Permisos de logos, covers, capturas y reseñas.
- Confirmar si los distintivos institucionales deben aparecer también aquí o solo en footer/Quiénes somos.
- Si el listado vacío va `noindex` temporal hasta tener 2-3 casos reales.

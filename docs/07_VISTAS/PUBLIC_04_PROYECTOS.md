# PUBLIC_04 — Proyectos

Última revisión: 28 de junio de 2026.

Fuente de verdad de la página pública **Proyectos**: listado, detalle de proyecto y de la **sección Colaboraciones** dentro de la landing (bloque de logos, marcas y trabajos). Recupera y sustituye los antiguos borradores de portafolio y detalle de portafolio (ya retirados del archivo).

> **Actualización de cierre (28/06):** el portfolio actualmente cargado se considera **contenido real autorizado** para la web inicial. La sección Colaboraciones y la página Proyectos trabajan sobre ese portfolio real; `permission_status` queda solo como compatibilidad interna y no debe reabrirse como bloqueo documental general.
>
> **Media de proyecto (subfase 7.3, 26/06):** la tarjeta y el detalle usan `cover_image`; `thumbnail_image` apunta a la misma ruta que la portada (una sola imagen), por lo que `coverImage ?? thumbnailImage` sigue funcionando sin cambios. El proyecto puede tener logo de cliente color/monocromo (`logo`/`logo_dark`/`logo_alt`); su uso público se implementa en la subfase 7.4.
>
> **Presentación pública (subfase 7.4, 26/06):** el detalle de proyecto ya no muestra `approved`/`permiso`/`estado de validación`/`Rol`/`Roles del proyecto`/«Quién participa». Banner con **logo del cliente** (color en claro, monocromo en oscuro, `alt` desde `logo_alt`), nombre del cliente, nombre del proyecto, **chips de servicios** (desde `services`) y **quién lo desarrolló** (logo AbacoQD; si hay partners, «Proyecto cooperativo» con sus logos; si no, «Proyecto desarrollado en solitario»). Datos clave: Año · Servicios · Desarrollo · Tecnologías. Sección «Cliente y desarrollo» (Solicitado por / Desarrollado por). Las cards de `/proyectos` muestran cliente+logo, servicios y modo de desarrollo. `developmentMode = solo | cooperative` (no se exponen roles técnicos).
>
> **Ajuste final (subfase 7.5, 26/06):** el detalle deja **un único** bloque de cliente/desarrollo (el banner superior); se elimina la sección «Cliente y desarrollo» que lo duplicaba. La cabecera/imagen del proyecto se maqueta con acabado premium (overlay con cliente+título, hairline, sombra y hover sutil con `motion-safe`), sin tocar hero/cubo. La card «Desarrollo» de Datos clave incorpora el logo AbacoQD (+ partners si es cooperativo). Se retiran del bundle las claves de idioma muertas del antiguo bloque de roles/participantes.

> Naming final: el **topbar y la página pública** se llaman **Proyectos** (`/proyectos`). La **sección de la landing** con logos/empresas/trabajos se llama **Colaboraciones**. El **modelo interno** es `projects`, `partners`, `partner_project`. No se usa "Portafolios" como término público activo.

## Identificación

| Campo | Valor |
|---|---|
| Nombre público (topbar y página) | Proyectos |
| Sección equivalente en landing | Colaboraciones |
| Ruta listado ES | `/proyectos` |
| Ruta listado EN | futura, no bloqueante |
| Ruta detalle ES | `/proyectos/{slug}` |
| Ruta detalle EN | futura, no bloqueante |
| En landing | Sección 4 (Colaboraciones), después de Servicios y antes de Blog |
| Prioridad | P0 como vista documentada; portfolio real autorizado |
| Entidades | `partners`, `projects`, `partner_project`, `seo_metadata`, `reviews`, `settings`, `faqs` |

## Criterio de nombre

El nombre público de **topbar y página es Proyectos** (`/proyectos`). La **sección de la landing** que muestra logos, marcas y trabajos se llama **Colaboraciones**. Internamente, ambas se apoyan en:

- `partners` = empresas, marcas, clientes o colaboradores.
- `projects` = proyectos, trabajos o casos publicables.
- `partner_project` = relación y rol de cada partner en cada proyecto.

No se usa el nombre interno de relaciones como etiqueta de navegación, ni "Portafolios" como término público activo.

Los logos institucionales aportados (be now Partner, Cofinanciado por la Unión Europea y Fondos Europeos) no son clientes, proyectos ni partners de Proyectos por defecto. Se documentan en `settings.institutional` y solo aparecerán en esta vista si el cliente confirma expresamente que deben mostrarse como credenciales institucionales dentro del bloque de confianza.

## Objetivo

Demostrar experiencia y confianza con proyectos reales. La vista no inventa clientes, logos, métricas ni casos.

## Sección Colaboraciones en landing

**Estructura visual.** Layout split: izquierda eyebrow `COLABORACIONES`, H2 `Proyectos y colaboraciones que conectan experiencia, tecnología y negocio`, subtítulo `Trabajamos sobre proyectos propios, colaborativos o desarrollados junto a partners, siempre adaptando la solución al contexto real de cada cliente.`; derecha composición orbital amplia tipo noria/reloj con botón-pivote. Las burbujas de marcas son glass/translúcidas y de tamaño suficiente para leer el logo. Cuando haya proyectos destacados, la pieza activa muestra nombre de proyecto, partner visible y CTA `Ver proyecto`.

**Desktop.** Texto a la izquierda y órbita a la derecha. La noria gira en sentido horario: las marcas empiezan a aparecer en las 12, alcanzan máximo tamaño/opacidad/nitidez en las 3, desaparecen en las 6 y continúan ocultas de 7 a 11 hasta reaparecer en las 12. La pieza activa puede alternar entre logo de partner y card de proyecto. El botón-pivote lleva al proyecto o al listado público de Proyectos (`/proyectos`).

**Mobile.** Texto arriba; debajo, carrusel horizontal de cards/logos o estado compacto. El activo siempre tiene texto legible, no solo logo.

**Animaciones propias.** Movimiento orbital continuo con cálculo por posición angular, pausa en hover/focus; active card con escala/opacidad controlada; reduced motion congela el set.

**Estados vacíos en landing.** Si no hay proyectos ni logos publicables, se muestra un bloque honesto: `Primeros casos en preparación` + CTAs `Ver servicios` y `Cuéntanos tu proyecto`. No se publican logos falsos ni cards de demo sin marca visible de demo.

## Página `/proyectos`

### Estructura visual

1. **Hero compacto.** Fondo `qd-mist`; breadcrumb; H1 `Proyectos`; subcopy: `Proyectos construidos a medida. Publicamos solo lo que podemos enseñar.`
2. **Filtros.** Chips por servicio/sector/partner si hay volumen suficiente. Si hay menos de 6 proyectos, no se muestran filtros.
3. **Grid de proyectos.** Cards 3 columnas desktop / 2 tablet / 1 móvil. Destacados primero.
4. **Bloque de partners/marcas.** Logos autorizados, con roles claros. Se oculta si no hay contenido visible.
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

Claro: `qd-bg`/blanco, cards claras, logos a color. Oscuro: `qd-ink`/`qd-surface`, logos en versión clara/monocroma si existe; si no, se usa contenedor con contraste y alt textual.

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

Listado: hero, subtítulo, filtros, orden y CTA. Proyecto: título, slug, resumen, cuerpo, cover, galería, tecnologías, partner principal, partners relacionados, URLs públicas, estado, destacado y SEO.

## Entidades relacionadas

- `projects`: caso/proyecto publicable.
- `partners`: empresa, marca, cliente o colaborador relacionado.
- `partner_project`: relación N:M y rol.
- `reviews`: reseñas reales opcionales.
- `seo_metadata`: SEO por proyecto e idioma.
- `faqs`: respuestas del chatbot sobre proyectos, plazos o forma de trabajo.

## SEO y multilenguaje

- Listado indexable cuando haya contenido suficiente. Si se lanza vacío, puede ir `noindex` temporal sin ocultar la ruta.
- Detalle indexable solo si `status=published`, `is_visible=true` y contenido completo.
- Slugs preparados para una posible fase EN futura; sin `hreflang` mientras el lanzamiento siga siendo Spanish-first.
- OG usa cover autorizado; si no existe, patrón de marca.
- JSON-LD `BreadcrumbList` y `CreativeWork` opcional. `Review` solo con reseña real.

## Estados vacíos

- Sin proyectos: bloque `Primeros casos en preparación` y CTAs a Servicios/Contacto.
- Filtro sin resultados: mensaje `Aún no hay proyectos publicados de este tipo` + reset.
- Proyecto borrador/oculto: 404 público.
- Sin partner publicable: se oculta partner; nunca se sugiere autoría no confirmada.
- Sin cover: patrón de marca, no stock falso.

## Accesibilidad

Cards con enlace único, filtros como botones con `aria-pressed`, alt editable en logos/covers, galería con focus trap, escape y navegación por teclado. La animación del carrusel no contiene información exclusiva.

## Relación con chatbot

El asistente puede sugerir `Ver proyectos` y redirigir a servicios o contacto si no hay un proyecto equivalente.

## Decisiones abiertas

- Selección editorial final del portfolio destacado para landing y listado.
- Confirmar si los distintivos institucionales deben aparecer también aquí o solo en footer/Quiénes somos.
- Si el listado vacío va `noindex` temporal hasta tener 2-3 casos reales.

# PUBLIC_03 — Servicios

Última revisión: 14 de junio de 2026.

Fuente de verdad de la página/listado de Servicios, del detalle preparado `/servicios/{slug}` y de la sección Servicios dentro de la landing. No existe el concepto activo "Tipologías" y no se reintroduce `project_types`.

## Identificación

| Campo | Valor |
|---|---|
| Ruta listado ES | `/servicios` |
| Ruta listado EN | `/en/services` |
| Ruta detalle ES | `/servicios/{slug}` |
| Ruta detalle EN | `/en/services/{slug}` |
| En landing | Sección 3, después de Metodología y antes de Colaboraciones |
| Prioridad | Listado + sección landing P0; detalle preparado y publicable por `is_detail_enabled` |
| Entidades | `services`, `seo_metadata`, `page_sections`, `settings`, `faqs` |

## Objetivo

Explicar qué puede construir AbacoQD y llevar al usuario hacia contacto/reserva con un servicio preseleccionado. La vista debe comunicar rapidez, criterio técnico y amplitud de soluciones sin sonar a catálogo genérico.

## Servicios iniciales

1. **Desarrollo web rápido**.
2. **Aplicaciones a medida**.
3. **Automatización con IA**.
4. **CRM, datos y procesos**.
5. **Integraciones digitales**.
6. **MVPs y prototipos**.

Estos seis registros viven en `services` en ES/EN desde el inicio. Cada servicio tiene slug, descripción breve, descripción ampliada, icono, mockup/imagen, CTA, orden, estado, flag de destacado y SEO propio.

## Sección Servicios en landing

Se documenta también en `PUBLIC_01_HOME_LANDING.md`, pero esta es la fuente del contenido funcional de Servicios.

**Estructura visual.** Eyebrow `SERVICIOS`, H2 `Soluciones rápidas para necesidades reales`, subtítulo corto y grid 3x2 de cards. Cada card combina número, icono lucide en cápsula teal, título, frase breve, micro-CTA `Consultar` y mockup visual.

**Desktop.** Grid 3 columnas x 2 filas, cards de altura estable, mockup a la derecha y texto a la izquierda.

**Mobile.** Una columna; mockup arriba o reducido; CTA a ancho táctil cómodo.

**Animaciones.** Stagger de entrada por card, hover con lift leve, borde teal, zoom del mockup y flecha con desplazamiento. Reduced motion deja el grid estático.

## Página `/servicios`

### Estructura visual

1. **Hero compacto.** Fondo `qd-mist`; breadcrumb; H1 `Servicios`; subcopy centrado en desarrollo a medida, IA supervisada y procesos rápidos.
2. **Grid principal de servicios.** Las mismas seis líneas, con cards más amplias que en landing: mockup 16:10, descripción de 2-3 líneas, chips de capacidades y CTA `Consultar servicio`.
3. **Cómo elegir.** Banda ligera con 3 criterios: urgencia, complejidad e integración con procesos existentes.
4. **CTA contextual.** `¿No sabes qué necesitas exactamente?` + `Cuéntanos tu proyecto` y `Reserva hora`.
5. **Footer global.**

### Desktop

Grid de 3 columnas; sección "Cómo elegir" en tres columnas; CTA centrado. El contenedor mantiene ancho máximo 1240 px.

### Mobile

Hero compacto, grid a una columna, chips con wrap, CTAs apilados. No hay carruseles obligatorios en móvil.

### Modos claro, oscuro y sistema

La estructura no cambia. Claro: fondo `qd-bg`/blanco, cards blancas y bordes `qd-mist`. Oscuro: fondo `qd-ink`, cards `qd-surface`, borde teal sutil. El modo sistema aplica la preferencia del sistema cuando no hay preferencia local.

### Interacción

- Click en `Consultar servicio` lleva a `/contacto?servicio={slug}` si el detalle no está habilitado.
- Si `is_detail_enabled=true`, el título/card enlaza a `/servicios/{slug}`.
- Chatbot: sugerencias rápidas pueden enlazar a cada servicio mediante `faqs.redirect_url` o `redirect_section`.

## Detalle `/servicios/{slug}`

El detalle queda preparado como subpágina real y se publica servicio a servicio con `is_detail_enabled`. Si un servicio no tiene detalle habilitado, su ruta pública responde 404 o redirige de forma controlada al listado, según decisión SEO de implementación.

### Estructura

1. **Cabecera de servicio.** Fondo `qd-ink`; H1, resumen, chips de tecnologías/capacidades y CTA `Consultar este servicio`.
2. **Mockup principal.** Imagen o interfaz ilustrativa autorizada, con alt editable.
3. **Qué resolvemos.** Lista de problemas típicos sin prometer resultados no verificables.
4. **Cómo lo abordamos.** Mini timeline conectada con Metodología.
5. **Proyectos relacionados.** Cards de Proyectos filtradas por servicio, solo si existen proyectos publicados.
6. **FAQ contextual.** Preguntas del chatbot relacionadas con el servicio.
7. **CTA final y footer.**

## Contenido editable

Hero del listado, textos de cada card, orden, visibilidad, detalle ampliado, CTA, mockup, chips, SEO y FAQ relacionada. Todo en ES/EN.

## Entidades relacionadas

`services` es la entidad única. `seo_metadata` guarda title, description, canonical, OG y noindex por servicio/idioma. `projects` puede relacionarse por metadatos o relación futura de servicio-proyecto si se implementa; no se crea `project_types`.

## SEO y multilenguaje

- Listado indexable: `/servicios` y `/en/services`.
- Detalles indexables solo si `is_detail_enabled=true`, estado `published`, contenido completo y SEO aprobado.
- Slugs independientes por idioma.
- `hreflang` solo cuando exista par ES/EN real.
- JSON-LD `Service` solo con contenido real; sin precios si no están definidos.

## Estados vacíos

- Sin servicios publicados: se muestran los seis servicios base aprobados como contenido editorial, no demo.
- Servicio sin mockup: patrón de marca con isotipo, no stock falso.
- Sin detalle habilitado: CTA a contacto con servicio preseleccionado.
- Sin proyectos relacionados: sección oculta.

## Accesibilidad

Cards con un único enlace principal, foco visible, iconos decorativos con `aria-hidden`, imágenes con alt editable, chips legibles y contraste AA. El grid no depende de hover para revelar información esencial.

## Relación con chatbot

El asistente puede explicar cada servicio, sugerir el servicio más cercano a una necesidad, redirigir al detalle si existe o abrir contacto con `?servicio={slug}`. No promete precio, plazo ni alcance cerrado.

## Decisiones abiertas

- Qué detalles de servicio entran publicados el 30/06 y cuáles quedan como cards con CTA a contacto.
- Copy final ES/EN de cada servicio.
- Mockups finales por servicio y permiso de uso de capturas.

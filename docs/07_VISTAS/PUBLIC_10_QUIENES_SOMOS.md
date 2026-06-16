# PUBLIC_10 — Quiénes somos

Última revisión: 14 de junio de 2026.

Fuente de verdad de la vista pública **Quiénes somos**. Es vista activa del producto 30/06 y aparece en la topbar. No es sección de la landing; es una página interna real.

## Identificación

| Campo | Valor |
|---|---|
| Ruta ES | `/quienes-somos` |
| Ruta EN | `/en/about` |
| Topbar | Sí, entre Proyectos y Blog |
| Prioridad | P0 — producto 30/06 |
| Entidades | `page_sections`, `section_blocks`, `team_members`, `partners`, `settings`, `seo_metadata`, `faqs` |

## Objetivo

Contar el origen y la solvencia de Abaco Developments sin inventar equipo, clientes, años, cifras ni logros. Debe explicar la evolución documental hacia AbacoQD solo si se aprueba como línea de producto o marca secundaria; la marca pública principal sigue siendo Abaco Developments.

## Texto aprobado (AbacoQD)

Texto exacto, cerrado y sin reescribir, usado como bloque destacado o párrafo principal de la página:

> Ábaco Quick Developments es una nueva iniciativa de Ábaco Developments destinada a la especialización en desarrollos rápidos y a medida, potenciados por las nuevas herramientas de codificación con IA. Esto genera unos proyectos más económicos y adaptados a las necesidades específicas de cada cliente.

## Estructura visual

1. **Hero compacto.** Fondo `qd-mist`; eyebrow `QUIÉNES SOMOS`; H1 `Abaco Developments`; subcopy sobre consultoría tecnológica, CRM, datos, desarrollo digital e IA aplicada; visual lateral con marca pública.
2. **La historia.** Narrativa en 3 bloques: origen, especialización y evolución del enfoque digital. Timeline vertical con hitos solo si son validados.
3. **Cómo trabajamos.** Banda `qd-ink` con 3 columnas: IA con supervisión técnica, herramientas internas, prototipo/estudio antes de construir.
4. **Valores.** Cinco conceptos en cards compactas: a medida, rapidez, criterio, accesibilidad, tecnología moderna.
5. **Equipo / estudio.** Si no hay `team_members` visibles, bloque corporativo real del estudio. Si hay miembros publicados, grid de tarjetas.
6. **Bloque institucional / confianza.** Logos institucionales aportados (be now Partner, Cofinanciado por la Unión Europea, Fondos Europeos) solo si se confirma su ubicación pública; partners o clientes solo con permiso. Si no hay obligación o permisos, se omite.
7. **CTA final.** `Hablemos de tu proyecto.` + reserva/contacto.
8. **Footer global.**

## Maquetación desktop

Hero 60/40 con copy a la izquierda y visual a la derecha. Historia en dos columnas: texto + timeline. Cómo trabajamos en 3 columnas. Valores en grid 5/3/2 según ancho. Equipo en grid de 3 columnas si existen miembros. CTA centrado.

## Maquetación mobile

Hero apilado, timeline como lista vertical, columnas convertidas a cards de una columna, valores en scroll horizontal accesible o grid 1 columna, equipo a una columna. CTAs apilados.

## Modos claro, oscuro y sistema

Claro: `qd-bg`/`qd-mist` para hero e historia, cards blancas, acentos teal. Oscuro: `qd-ink`/`qd-surface`, texto claro y líneas teal. Sistema sigue la preferencia global. La estructura no cambia por tema.

## Animaciones propias

Timeline con línea que crece en scroll, reveal suave de bloques y hover leve de cards/equipo. Reduced motion muestra timeline completa y cards estáticas.

## Interacción

- Enlaces a Metodología, Servicios, Proyectos y Contacto.
- Tarjetas de equipo con enlaces sociales y CV solo si existen datos reales.
- Logos/partners enlazan solo si están autorizados.

## Componentes usados

Hero compacto, breadcrumb, timeline, cards de valores, cards de equipo, banda `qd-ink`, CTA final, footer global, botones primario/ghost y chips.

## Contenido editable

Hero, historia, hitos, valores, bloque de estudio, miembros de equipo, CTAs, partners visibles, SEO y traducciones ES/EN.

## Entidades relacionadas

- `page_sections` y `section_blocks`: estructura textual de la página.
- `team_members`: miembros publicables si existen.
- `partners`: confianza resumida con permisos.
- `settings`: datos corporativos, legales, institucionales y relación Ábaco Developments ↔ AbacoQD.
- `seo_metadata`: SEO por idioma.
- `faqs`: respuestas de chatbot sobre origen, equipo y forma de trabajo.

## SEO y multilenguaje

- Title ES: `Quiénes somos | Abaco Developments`.
- Title EN: `About us | Abaco Developments`.
- Description por idioma sobre origen, especialización y desarrollo a medida.
- JSON-LD: `AboutPage` + `Organization`; `parentOrganization` solo si la relación jurídica se confirma.
- `hreflang` entre `/quienes-somos` y `/en/about`.

## Estados vacíos

- Sin `team_members`: mostrar bloque corporativo, nunca grid vacío.
- Sin partners con permiso: ocultar confianza resumida.
- Sin hitos validados: usar narrativa sin fechas ni lista de hitos.
- Sin traducción EN validada: no emitir `hreflang` hasta tener par real.

## Accesibilidad

Timeline como lista ordenada, línea decorativa con `aria-hidden`, enlaces sociales con labels explícitos, CV con texto claro (`Descargar CV PDF de {nombre}`), foco visible y contraste AA.

## Relación con chatbot

El chatbot puede explicar quién es Abaco Developments, cómo trabaja el equipo y redirigir a Metodología, Servicios o Contacto. No inventa miembros, experiencia, clientes ni fechas.

## Decisiones abiertas

- Texto exacto de la relación jurídica/comercial entre Ábaco Developments y AbacoQD.
- Ubicación pública obligatoria de logos UE/FSE+/Fondos Europeos y be now Partner.
- Si se publican miembros de equipo el 30/06.
- Hitos concretos y fechas, solo si el cliente los valida.

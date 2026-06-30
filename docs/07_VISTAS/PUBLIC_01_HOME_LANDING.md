# PUBLIC_01 — Home / Landing (fuente de verdad única)

Última revisión: 28 de junio de 2026.

Esta es la **única fuente de verdad de la landing**. Fusiona el handoff de orden/dark-light/frames con el detalle sección por sección. Sustituye a los antiguos documentos de handoff y detalle de la home. Fuente de verdad visual: `mockups/abacoqd-web.pen`. Paleta, tipografía, tokens, componentes y animaciones globales en `04_IDENTIDAD_UI_COMPONENTES.md`. Modelo de datos en `02_MODELO_DATOS.md`. La metodología se resume aquí y se detalla en `PUBLIC_02_METODOLOGIA_PROCESO.md`.

> Producto completo y definitivo para el 30/06. No empezar implementación hasta documentación aprobada.
>
> **Colaboraciones (subfase 7.4, 26/06):** la sección Colaboraciones muestra **proyectos/casos** con `show_in_collaborations`, no logos sueltos. Cada tarjeta: logo del cliente (color claro / monocromo oscuro), nombre del cliente, nombre del proyecto, chips de servicios, año, modo de desarrollo (AbacoQD en solitario o cooperativo con partners) y CTA «Ver proyecto». Sin proyectos publicables marcados, estado vacío honesto (sin marcas de terceros, sin lenguaje de «permiso»). Ya no se usa la noria de logos de partners.

## Identificación

| Campo | Valor |
|---|---|
| Ruta ES | `/` |
| Ruta EN | futura, no bloqueante |
| Dominio final público | `https://abacoqd.com/` |
| Prioridad | P0 — lanzamiento 30 de junio |
| Componente | `resources/js/pages/Public/Home.tsx` |
| Entidades | `settings`, `page_sections`, `methodology_steps`, `services`, `partners`, `projects`, `partner_project`, `posts`, `faqs` (ver `02_MODELO_DATOS.md`) |

## Orden final de la landing (EXACTAMENTE 7 secciones)

1. **Hero**
2. **Metodología** (incluye el bloque-puente *Estudio inicial gratuito*)
3. **Servicios**
4. **Colaboraciones**
5. **Blog**
6. **CTA final**
7. **Footer**

Reglas de orden: Metodología va **antes** de Servicios; Blog va **después** de Colaboraciones y **antes** del CTA final. **No existen** secciones independientes de Transición, Conceptos clave, Herramientas internas/Sistema, Sobre nosotros, Casos de éxito ni Tipologías. "Tipologías" está absorbido por Servicios. **Quiénes somos no es sección de la landing** (solo item de topbar y página propia). La sección de landing con logos/empresas/trabajos se llama **Colaboraciones**; la página pública dedicada se llama **Proyectos** (`/proyectos`) y se enlaza desde el topbar.

## Sistema dark / light

Cada sección tiene versión **Dark** y **Light**. **No son diseños distintos**: comparten estructura, layout, jerarquía y proporciones; solo cambia la adaptación de paleta, contraste y glow. El toggle vive en la topbar (claro / oscuro / sistema). En el canvas de Pencil: columna izquierda = Dark (`x:-1520`), columna derecha = Light (`x:0`), emparejadas por fila.

## Mapeo de frames Pencil

Capturas a exportar en `docs/assets/mockups/landing/` (export manual por bug de rutas Windows del MCP).

| Sección | Frame Dark (ID) | Frame Light (ID) |
|---|---|---|
| Hero | `Hero - Dark` (`PYRa7`) | `Hero - Light` (`jLOYq`) |
| Metodología | `Metodología - Dark` (`qXa4p`) | `Metodología - Light` (`eamax`) |
| Servicios | `Servicios - Dark` (`JFqsz`) | `Servicios - Light` (`iPdCc`) |
| Colaboraciones | `Colaboraciones - Dark` (`l5THA`) | `Colaboraciones - Light` (`nSiEs`) |
| Blog | `Blog - Dark` (`W4JHn`) | `Blog - Light` (`iUMi8`) |
| CTA final | `CTA Final - Dark` (`I8maz`) | `CTA Final - Light` (`yeeqy`) |
| Footer | `Footer - Dark` (`V0al88`) | `Footer - Light` (`WDSDJ`) |

## Sistema transversal

- **Paleta y tipografía:** ver `04_IDENTIDAD_UI_COMPONENTES.md`. Poppins en todo; teal primario, cyan apoyo, lime solo acento.
- **Eyebrow de sección:** punto teal 7 px + texto MAYÚSCULAS (Poppins 600, ~12 px, tracking ~2.5), **alineado a la izquierda**, color teal (`#0F8F95` claro / `#18B7B0` oscuro). Excepciones: Hero (centrado) y CTA final (`EMPECEMOS`). Labels: `CÓMO TRABAJAMOS`, `SERVICIOS`, `COLABORACIONES`, `BLOG`.
- **Logo:** solo en topbar, CTA final y footer. Nunca como encabezado de cada sección, ni el chip "Ábaco Quick Developments".
- **Topbar:** logo → Inicio; nav `Metodología / Servicios / Proyectos / Quiénes somos / Blog / Contacto`; derecha selector de idioma + toggle claro/oscuro/sistema. **Sin CTA de reserva** (solo en Hero y CTA final). Detalle global en `PUBLIC_09_LAYOUT_GLOBAL.md`.
- **Reserva:** el CTA de reserva vive **solo** en Hero y CTA final.
- **Fondo animado (Wave Background):** capa de fondo global, sutil y muy lenta, presente en todas las vistas públicas. Criterio, variables y referencia visual en `04_IDENTIDAD_UI_COMPONENTES.md`.

## Pendientes reales de cierre documental

- **Estudio inicial gratuito:** decisión comercial PENDIENTE. No publicar la palabra "Gratuito" ni el bloque-puente hasta confirmar la política (ver Metodología y `PUBLIC_02_METODOLOGIA_PROCESO.md`).
- **Dato 40%** del CTA final: copy aprobado por cliente para el mockup/landing.
- **Copy del CTA final EN:** solo aplica si en una fase posterior se publica inglés real.
- **Ratificar paleta + logo** (reunión 16/06) antes de tokenizar el design system.
- **Logos/proyectos de la sección Colaboraciones:** el portfolio actual se considera autorizado salvo indicación expresa en contra.
- **Redes reales** del footer (pendientes). Email, teléfono, WhatsApp y dirección ya están confirmados.
- **Responsive:** mockups en desktop 1440; reflow móvil definido por sección abajo.
- **Exportar las 14 capturas** a `docs/assets/mockups/landing/` (manual desde Pencil).

---

## 1. Hero

**Objetivo.** En el primer viewport el visitante entiende que AbacoQD desarrolla soluciones digitales a medida con criterio técnico, CRM/datos, IA aplicada y un camino inmediato a reservar una primera sesión.

**Estructura visual.** Topbar flotante + eyebrow centrado `IA · DESARROLLO RÁPIDO · A MEDIDA` + H1 (único de la página) `Desarrollos rápidos a medida, impulsados por IA` (`impulsados` en teal) + soporte breve `Creamos soluciones digitales ágiles, económicas y adaptadas a cada cliente.` + CTAs `Reservar una consulta` (primario) y `Ver servicios` (secundario ghost) + recurso visual (cubo wireframe cristalino y translúcido con aristas azul corporativo, energía/glow azul y highlights azul hielo controlados) + franja de 5 beneficios (IA & automatización, Desarrollos a medida, Entregas rápidas, Precios competitivos, Tecnología moderna).

**Maquetación desktop.** Topbar flotante centrada (~1240 px); headline + CTAs a la izquierda, recurso visual del cubo a la derecha; franja de beneficios horizontal a pie de hero como card de 5 ítems con divisores verticales.

**Maquetación mobile.** Headline arriba, CTAs apilados (primario sobre secundario), recurso visual debajo reducido; franja de beneficios en 2+2+1 o scroll horizontal compacto.

**Animaciones propias.** Aparición del H1 por líneas; glow azul sutil del cubo/energía interior; partículas y grid con drift muy lento; estela de velocidad (rayos) con drift; entrada escalonada (stagger) de la franja de beneficios. Al descomponerse, los fragmentos mantienen caras translúcidas, bordes azules y glow azul sin volverse opacos ni neón. `prefers-reduced-motion` congela decorativos dejando legible H1, subcopy y CTAs.

**Interacción / hover.** CTA primario con micro-glow y desplazamiento sutil de flecha/icono; CTA secundario ilumina borde teal.

**Componentes.** Topbar, Eyebrow (variante centrada), Botón primario (Hero), Botón secundario/ghost, Franja de beneficios, recurso visual del cubo. (Componentes existentes protegidos: `AbacoHero.tsx`, `HeroParticleField.tsx`, `AbacoCrystalCube.tsx` — en fase 1 solo cambian copy, logo, CTAs y dataset.)

**Contenido editable.** Eyebrow, H1, subcopy, textos de CTA y destino, los 5 ítems de la franja de beneficios. Vía `settings` / `page_sections`.

**Entidades relacionadas.** `settings` (marca, CTA reserva), `page_sections` (bloque hero).

**SEO.** H1 único de la página vive aquí.

**Estados vacíos.** Sin estado vacío: contenido editorial siempre presente.

**Accesibilidad.** Contenido legible sin partículas ni cubo; reduced motion congela decorativos; orden de tabulación header → CTAs del hero → resto.

**Modo claro/oscuro.** Hero comparte estructura en ambos temas; fondo `qd-ink`/superficie con adaptación de glow y contraste de paleta.

---

## 2. Metodología

> Resumen aquí; detalle completo (secuencia canónica, bloque "Estudio inicial gratuito" y página `/metodologia`) en `PUBLIC_02_METODOLOGIA_PROCESO.md`.

**Objetivo.** Demostrar que la rapidez es proceso, no improvisación, y empujar a reservar. Va justo después del Hero y antes de Servicios.

**Estructura visual.** Layout split de dos columnas: izquierda statement de marca, sin cambios (eyebrow `CÓMO TRABAJAMOS` + titular gigante apilado `CODE.` / `QUICK.` / `DELIVER.` + cita con barra teal + link `Ver cómo trabajamos →`); derecha **cube-effect carousel de 6 pasos** (`MethodologyProcessCube`), carrusel con efecto cubo de Swiper (`effect: "cube"`) con una cara activa por vez. **No hay frontal/back**: cada cara muestra de una vez número, icono, título, descripción y chip `Entregable: …`. En reposo solo se ve 1 cara; durante la transición se ven como máximo 2 (la que sale y la que entra, girando como un cubo real), sin mostrar las 6 caras simultáneamente. Al pie, el **bloque-puente "Estudio inicial gratuito"** entre el paso 01 (Análisis) y el 02 (Propuesta).

**Maquetación desktop.** Statement a la izquierda; cube-effect carousel a la derecha con altura igualada a la del bloque izquierdo (columnas `items-stretch`), controles manuales anterior/siguiente y navegación por 6 dots en una fila bajo el cubo (fuera de la tarjeta, sin tapar título/descripción/entregable); banda horizontal del estudio inicial a pie de sección.

**Maquetación mobile.** Statement arriba (titular apilado), cube-effect carousel debajo a ancho completo con controles anterior/siguiente y dots en la misma fila bajo el cubo, tamaño reducido y sin scroll lateral; bloque del estudio inicial en columna (badge → icono+texto → badge).

**Animaciones propias.** Cube-effect carousel basado en Swiper (`effect: "cube"`, módulos `EffectCube`/`Autoplay`/`Navigation`/`Pagination`/`A11y`): autoplay lento que gira de una cara activa a la siguiente, con pausa en hover/focus (incluye foco por teclado); avance/retroceso manual por botones y por dots; entrada del titular por líneas; bloque del estudio inicial con fade-up. Reduced motion: sin autoplay, transición instantánea, solo la cara activa visible y navegación manual disponible. Sin `tsParticles` ni dependencias de partículas.

**Interacción / hover.** El cube-effect carousel pausa su rotación en hover/focus (mouse y teclado); la cara activa con borde más luminoso y glow; botones anterior/siguiente y dots con estado activo, ubicados bajo el cubo sin solaparse con el contenido.

**Componentes.** Eyebrow, `MethodologyProcessCube` (cube-effect carousel de metodología sobre Swiper), controles anterior/siguiente y dots de navegación en fila bajo el cubo, Bloque "Estudio inicial gratuito" (ver `04_IDENTIDAD_UI_COMPONENTES.md`).

**Contenido editable.** Los 6 pasos (título, icono, descripción, entregable), statement y cita, copy del bloque estudio inicial. Vía `methodology_steps` y `page_sections` / `settings`.

**Entidades relacionadas.** `methodology_steps`, `page_sections`, `settings`.

**Estados vacíos.** Sin estado vacío: pasos siempre presentes (seed con la secuencia canónica).

**Accesibilidad.** Cube-effect carousel con pausa en hover/focus (mouse y teclado) y sin información exclusiva en movimiento; solo la cara activa es legible por lectores de pantalla (resto `aria-hidden`); cada paso legible de forma independiente en una sola cara; botones `aria-label="Paso anterior"` / `"Paso siguiente"` con foco visible y dots con etiqueta por paso; con `prefers-reduced-motion` no hay autoplay y la navegación manual cambia de cara sin animación compleja.

**Modo claro/oscuro.** Oscuro: fondo casi negro, caras `qd-ink`/cristal. Claro: fondo `qd-mist`, caras claras/glass. Acentos teal y degradado del titular en ambos. WaveBackground global visible detrás.

**Pendiente.** El bloque "Estudio inicial gratuito" y el chip `Gratuito` solo se publican si se confirma la política comercial (ver `PUBLIC_02_METODOLOGIA_PROCESO.md`).

---

## 3. Servicios

**Objetivo.** Presentar las 6 líneas de servicio con un mockup de UI por servicio. Se llama **Servicios** (no "Tipologías", que no existe como sección). Va después de Metodología y antes de Colaboraciones.

**Estructura visual.** Encabezado alineado a la izquierda (eyebrow `SERVICIOS` + título `Soluciones rápidas para necesidades reales` con `reales` en teal/cian + subtítulo breve) + **grid 3×2 de 6 cards visuales**.

**Maquetación desktop.** Grid 3 columnas × 2 filas. Cada card horizontal (~430×300): a la izquierda número `01`–`06`, icono en cápsula teal, título, frase breve, micro-CTA `Consultar →`; a la derecha mockup de UI del servicio.

**Maquetación mobile.** 1 columna; cards apiladas con el mockup arriba o reducido, texto debajo.

**Servicios y su mockup:**
1. **Desarrollo web rápido** — navegador/landing con métricas.
2. **Aplicaciones a medida** — dashboard con sidebar, stats y actividad.
3. **Automatización con IA** — flujo de nodos (lead → IA → email → CRM) + panel resumen + badge `Activo`.
4. **CRM, datos y procesos** — KPIs, gráfico de ventas y mini-tabla.
5. **Integraciones digitales** — nodo central `API` con herramientas conectadas.
6. **MVPs y prototipos** — móvil + wireframes + sticky lime `Listo para lanzar`.

**Animaciones propias.** Entrada de grid con stagger por card; hover lift; zoom sutil del mockup; borde teal que se ilumina; flecha de `Consultar` con micro-desplazamiento.

**Interacción / hover.** Lift de card + borde teal luminoso + zoom del mockup; micro-CTA `Consultar` (sin botón de reserva en esta sección).

**Componentes.** Eyebrow, Card de servicio (grid 3×2), Chip de categoría, Botón texto + flecha (`Consultar`).

**Contenido editable.** Por servicio: número, icono, título, frase breve, mockup asociado, destino del `Consultar`. Encabezado de sección.

**Entidades relacionadas.** `services` (NO `project_types`). Cada card mapea a un registro de `services` (ver `02_MODELO_DATOS.md`).

**SEO.** H2 de sección; cada servicio con título semántico.

**Estados vacíos.** Si no hay `services` publicados, se muestran los 6 base de seed; no se inventan servicios fuera del catálogo definido.

**Accesibilidad.** Iconos decorativos con `aria-hidden`; cada card con título y enlace accesible; contraste verificado por tema.

**Modo claro/oscuro.** Claro: card blanca + mockup claro + sombra suave. Oscuro: card `#0D1B26` + mockup oscuro + glow teal sutil. El mockup es protagonista; el icono, secundario.

---

## 4. Colaboraciones

**Objetivo.** Mostrar proyectos, marcas y empresas vinculadas a trabajos reales mediante una sección pública de landing llamada **Colaboraciones**, dando acceso al proyecto o al listado de **Proyectos** (`/proyectos`). Integra socios/clientes y confianza sin convertir el nombre público en una etiqueta interna. Detalle completo de la sección y de la página en `PUBLIC_04_PROYECTOS.md`.

**Estructura visual.** Layout split: izquierda eyebrow `COLABORACIONES` + H2 `Proyectos y colaboraciones que conectan experiencia, tecnología y negocio` + subtítulo `Trabajamos sobre proyectos propios, colaborativos o desarrollados junto a partners, siempre adaptando la solución al contexto real de cada cliente.`; derecha composición orbital amplia tipo noria/reloj con logos/cards glass y botón-pivote como centro. Si no hay permisos confirmados, los logos se tratan como `DEMO` / pendientes de confirmación.

**Maquetación desktop.** Botón-flecha = centro de la circunferencia, a la derecha a la altura del medio del bloque de texto. Los logos viajan por el **semicírculo derecho** como las horas de un reloj: aparecen en las 12 (tenues, pequeños), alcanzan su punto fuerte en las 3 (tamaño y opacidad máximos, activo, alineado en horizontal con el botón) y desaparecen al llegar a las 6. La mitad izquierda del círculo no se usa.

**Maquetación mobile.** Bloque de texto arriba; composición orbital debajo reducida (arco visible) o fallback a fila horizontal de cards/logos; conserva el activo destacado con texto legible.

**Animaciones propias.** Rotación continua de los logos por el arco 12→3→6 recalculando posición/escala/opacidad por ángulo; foco activo en las 3; pausa en hover/focus. Reduced motion: rotación congelada, set visible estático.

**Interacción / hover.** El botón-pivote lleva/abre el proyecto activo o el listado `/proyectos`; línea indicadora horizontal desde el botón hasta la burbuja/card activa (anillo teal + glow). Pausa al hover/focus.

**Componentes.** Eyebrow `COLABORACIONES`, carrusel circular/card de Colaboraciones, botón-pivote circular, burbujas de cristal esmerilado, card de proyecto compacta.

**Contenido editable.** Conjunto de proyectos destacados, logos/partners, orden, destino, subtítulo y H2.

**Entidades relacionadas.** `partners` unificado (NO `companies`), `projects` y `partner_project`. Cada burbuja/card se alimenta de partner o proyecto validado con permiso publicable (ver `02_MODELO_DATOS.md`).

**Estados vacíos.** Si no hay `projects` ni `partners` publicables, se muestra bloque honesto `Primeros casos en preparación` con CTAs a Servicios y Contacto. **Logos/proyectos reales solo con permiso**; no se inventan marcas, casos ni métricas.

**Accesibilidad.** Pausa en hover/focus; sin información exclusiva en movimiento; el botón-pivote es un control con etiqueta accesible al proyecto activo. Logos con `alt` por marca.

**Modo claro/oscuro.** Burbujas de cristal esmerilado (translúcidas con backdrop-blur), no discos opacos. Claro: tinte blanco translúcido, **logos a color**. Oscuro: cristal oscuro translúcido con rim claro y glow teal, **logos en versión clara/monocroma** (filtro CSS `brightness(0) invert(1)` o asset por tema). Botón: claro `qd-ink` con flecha lime / oscuro claro con flecha ink. Prohibido: medias circunferencias planas pegadas al borde inferior y elipses horizontales protagonistas.

---

## 5. Blog

**Objetivo.** Puente contenido → conversión con 3 posts destacados. Va después de Colaboraciones y antes del CTA final.

**Estructura visual.** Encabezado (eyebrow `BLOG` + título `Ideas sobre desarrollo, IA y soluciones digitales a medida` + subtítulo + a la derecha CTA `Ver todos los artículos →` outline teal) + composición editorial dinámica.

**Maquetación desktop.** 1 post principal grande a la izquierda + 2 secundarios apilados a la derecha, con jerarquía clara (no grid plana de 3 iguales).

**Maquetación mobile.** Principal arriba a ancho completo; secundarios apilados debajo; CTA `Ver todos los artículos` al final.

**Posts (contenido mockup):**
- Principal — `IA`: `Cómo la IA está acelerando el desarrollo a medida` — editor de código (`procesarLead`) + flujo IA (Nuevo lead → IA clasifica → Actualizar CRM / Enviar email) + icono cerebro. Estado destacado/hover (borde teal luminoso, glow), dots de carrusel y línea de progreso de lectura.
- Secundario 1 — `Automatización`: `Procesos internos que puedes automatizar desde el primer mes` — workflow (Pedido recibido → Extraer datos → Enviar confirmación → Actualizar hoja).
- Secundario 2 — `Proyecto digital`: `Cómo plantear un proyecto digital a medida` — paneles abstractos de brief, alcance y primera versión útil.

**Animaciones propias.** Fade-up por scroll; principal con lift + borde teal y zoom sutil del visual en hover; flecha de `Leer artículo` con movimiento; dots de carrusel con estado activo; línea de progreso de lectura. El editor de código y la caja IA se mantienen oscuros en ambos temas; el resto invierte claro/oscuro.

**Interacción / hover.** Cada card con `Leer artículo →`; principal con estado destacado; CTA general `Ver todos los artículos →`. Sin CTA de reserva.

**Componentes.** Eyebrow, Card de blog principal, Card de blog secundaria, Chip de categoría, Editor de código embebido (oscuro fijo), Botón secundario/ghost.

**Contenido editable.** 3 posts destacados seleccionados desde admin (chip, título, extracto, tiempo de lectura, visual, destino).

**Entidades relacionadas.** `posts` (3 destacados seleccionables desde admin). Categorías como chips.

**SEO.** H2 de sección; cada card con título y enlace al artículo.

**Estados vacíos.** La sección se oculta hasta que existan `posts` publicados. Contenido mockup: no publicar artículos inventados como reales.

**Accesibilidad.** Carrusel con pausa en hover/focus; tiempo de lectura textual; enlaces con título descriptivo; el editor de código es visual decorativo (`aria-hidden`).

**Modo claro/oscuro.** Card principal destacada en ambos; editor de código siempre oscuro; resto invierte por tema.

---

## 6. CTA final

**Objetivo.** Cierre de conversión hacia la reserva, en formato card premium (no banner plano). Aquí sí va el CTA de reserva.

**Estado de decisión.** Diseño visual aprobado. Estructura aprobada. Mockup tipo editor/código aprobado. Variantes claro y oscuro aprobadas. Titular con `40%` aprobado por cliente.

**Estructura visual aprobada.** Card central redondeada con borde sutil, glow teal/limón tenue y textura de circuito de fondo. Abre con eyebrow `EMPECEMOS` + logo AbacoQD + H2 gancho + subtítulo + badges + mockup de editor de código + CTAs.

**Maquetación desktop.** Card centrada con contenido en columna; editor de código embebido a un lado o bajo el copy según frame; chips bajo el H2; CTA primario lime + secundario texto.

**Maquetación mobile.** Card a ancho casi completo; logo + eyebrow arriba, H2, chips, editor reducido, CTAs apilados.

**Contenido clave.**
- **H2 aprobado:** `El 40% del tiempo de un desarrollador se pierde manteniendo código.`
- **Copy de apoyo aprobado:** `AbacoQD construye software y herramientas a medida pensados para durar: menos mantenimiento, más tiempo para crecer.`
- Chips: `Desarrollo a medida` (zap) y `Respuesta estratégica < 24h` (timer).
- Mockup de editor aprobado: barra de título (3 dots), barra de actividad, sidebar de proyecto, explorador (`PROYECTO`/`src`/`components`/`services`/`app.js`) y panel lateral `VISTA PREVIA` con check teal, `Sistema optimizado`, `Listo para crecer contigo.`. Código ilustrativo con import/uso de AbacoQD si la marca final lo permite (`import { AbacoQD } from ...`, métodos `lanzarProyecto`, `AbacoQD.construir`, `app.listoParaCrecer`). No es producto real.
- CTAs: primario **lime** `Empieza a ahorrar tiempo` (texto `qd-ink`, icono send) → flujo de reserva; secundario texto `Ver cómo trabajamos →` (subrayado teal) → metodología.

**Animaciones propias.** Entrada suave del bloque; trazos de circuito con pulso/drift lento; count-up opcional del `40%` al entrar en viewport; botón con micro-scale ~1.02 + glow lime/teal en hover. Reduced motion congela todo.

**Interacción / hover.** CTA primario con micro-scale + glow; secundario subrayado teal.

**Componentes.** Eyebrow `EMPECEMOS`, logo, Botón primario lime, Botón texto + flecha, Chips, Editor de código embebido (sigue el tema aquí).

**Contenido editable.** Eyebrow, H2 (con el dato), subtítulo, chips, copy/destino de CTAs. Vía `settings`.

**Entidades relacionadas.** `settings` (CTA reserva, datos corporativos, copy).

**Estados vacíos.** Sin estado vacío: sección de cierre siempre presente.

**Accesibilidad.** El editor es decorativo (`aria-hidden`); CTAs con etiqueta clara; contraste del degradado verificado.

**Modo claro/oscuro.** Oscuro: card `qd-ink` sobre fondo casi negro. Claro: card blanca sobre `qd-mist`. El editor embebido **sigue el tema** (oscuro en dark, claro en light), a diferencia de los editores del Blog.

**Pendientes.** Copy final EN del botón si se decide localizarlo de forma distinta a `Start saving time`.

---

## 7. Footer

**Objetivo.** Cierre de marca y navegación secundaria. Aquí sí va el logo.

**Estructura visual.** Logo de AbacoQD + 4 columnas (Marca, Explorar, Servicios, Contacto) + barra legal inferior. Sin tarjetas, mucho aire.

**Maquetación desktop.** Hairline superior + glow radial teal tenue + nodos; 4 columnas en fila; barra legal a pie con `©` a la izquierda y enlaces legales a la derecha.

**Maquetación mobile.** Columnas apiladas (2×2 o 1 columna); barra legal al final en bloque.

**Columnas.**
- **Marca:** logo + `Desarrollos a medida potenciados por IA.` + `Construimos con estrategia, diseño y tecnología.`
- **Explorar:** Inicio, Metodología, Servicios, Proyectos, Quiénes somos, Blog, Contacto.
- **Servicios:** Desarrollo web, Aplicaciones a medida, Automatización, Diseño UX/UI, Consultoría digital.
- **Contacto:** Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid; info@abacoqd.com; +34 91 020 00 89; WhatsApp +34 647 51 81 00 si se muestra como contacto rápido. LinkedIn/GitHub solo si se confirman perfiles reales.
- **Barra legal:** `© 2026 AbacoQD. Todos los derechos reservados.` + `Privacidad` / `Cookies` / `Aviso legal`.

**Animaciones propias.** Sin animaciones pesadas; glow tenue estático; como mucho fade-in al entrar.

**Interacción / hover.** Enlaces gris medio con hover teal.

**Componentes.** Footer (4 columnas), logo.

**Contenido editable.** Datos corporativos (dirección, email, redes), enlaces de columnas, copy de marca. Vía `settings`.

**Entidades relacionadas.** `settings` (datos corporativos editables).

**SEO.** Enlaces internos de navegación; sin H1/H2 propios relevantes.

**Estados vacíos.** Sin estado vacío. Redes sociales pendientes hasta confirmar perfiles reales; contacto, teléfono, WhatsApp y dirección ya están confirmados.

**Accesibilidad.** Navegación por landmarks (`contentinfo`); enlaces con foco visible; iconos con etiqueta o `aria-hidden` según contexto.

**Modo claro/oscuro.** Oscuro `qd-ink` con texto claro; claro `qd-mist`/blanco con texto `qd-ink`. Acentos teal en ambos.

---

## Funcionalidad transversal (base, no futuro)

- Cambio de idioma UI sin tratar EN como SEO activo hasta que exista una versión inglesa real.
- Tema claro/oscuro/sistema (toggle topbar).
- Accesibilidad universal: botón flotante izquierdo.
- Chatbot: botón flotante derecho (apoyado en `faqs`).
- Contacto + WhatsApp; datos corporativos editables (`settings`).
- Smooth scroll a anclas mientras las páginas dedicadas no existan; después nav mixta ancla/ruta.
- Sin estados de carga visibles: la home llega renderizada por Inertia; imágenes con lazy loading + aspect-ratio reservado (sin saltos de layout).

## Relación con chatbot

El asistente puede orientar a Servicios, Proyectos, Quiénes somos, Blog, Contacto o Reserva según intención. Sus respuestas se alimentan de `faqs`; no inventa clientes, proyectos, precios, plazos ni disponibilidad.

## SEO global

- Title ES: `AbacoQD — Consultoría tecnológica, CRM e IA aplicada`.
- Description por idioma con CRM, fidelización, analítica, desarrollo digital e IA aplicada, sin promesas no verificadas.
- Canonical sobre `https://abacoqd.com/`.
- Sin `hreflang` EN mientras el lanzamiento siga siendo Spanish-first.
- JSON-LD: `Organization` + `WebSite`.
- OG global con imagen de marca (pendiente generar asset OG).
- H1 único en Hero; secciones con H2.

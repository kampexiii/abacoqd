# Identidad, UI, componentes y animaciones — AbacoQD

Última revisión: 15 de junio de 2026. Fuente de verdad única de **identidad de marca + paleta + tipografía + tema + componentes reutilizables + UI de accesibilidad y chatbot + animaciones globales**.

Regla de alcance: las animaciones **específicas de una vista** (hero, metodología, servicios, colaboraciones, blog, CTA final, footer) viven en su doc de vista. Aquí solo lo **global**: identidad, tokens, tema, componentes y principios de animación.

---

## 1. Dirección de marca (resumen)

AbacoQD nace de **Ábaco Developments** sin romper con el pasado: conserva señales de precisión, cálculo y confianza, pero evoluciona hacia una marca más rápida, técnica, moderna, dinámica y personalizada.

Decisión de cierre: la **marca pública visible del sitio es Abaco Developments**. La razón social completa se reserva para textos legales. `AbacoQD` queda como nombre interno/documental o propuesta de evolución visual hasta que se ratifique expresamente como marca pública.

**Atributos visuales:** rapidez, código, sistemas, flujo de trabajo, IA aplicada, vibe coding supervisado, herramientas internas, precisión, modernidad, accesibilidad, confianza.

**La marca NO debe parecer:**

- agencia creativa genérica;
- plantilla SaaS sin personalidad;
- web de IA genérica;
- proveedor barato sin rigor;
- consultoría CRM/fidelización como eje principal.

**Tono visual y verbal:** técnico, directo y actual. Puede hablar de rapidez, prototipado, IA y vibe coding, siempre unido a seguridad, criterio técnico y validación. Evitar promesas de "hacer cualquier cosa en minutos"; el mensaje correcto es **acelerar desarrollo real sin perder control**.

**Recursos visuales preferidos:** interfaces/mockups de sistemas reales, diagramas de flujo sobrios, patrones de código discretos, paneles y automatizaciones, iconografía lineal clara, microinteracciones controladas.
**Evitar:** cerebros de IA genéricos, robots/stock de tecnología, fondos saturados de neón, brillos excesivos, blobs decorativos sin función, claims tipo cripto/gaming.

### Logo

Parte del logo anterior de Ábaco Developments, lo simplifica y acelera, refuerza la lectura técnica y añade la idea de rapidez. Variantes previstas en la propuesta: completa `AbacoQD`, extendida `Ábaco Quick Developments` e isotipo (favicon/avatar). No sustituye la marca pública `Abaco Developments` sin validación final.

**Prediseño del 12 de junio (casi definitivo, pendiente de ratificar el 16/06).** Fuente: `branding/marca/originales/logos/PREDISEÑO.png`.

- **Isotipo:** `A` itálica con líneas de velocidad hacia la izquierda; mitad en tinta oscura, mitad en teal.
- **Wordmark:** `abacoqd` en minúsculas — `abaco` en tinta, `qd` en teal — con subtítulo `QUICK DEVELOPMENTS` en uppercase y tracking amplio.
- **Tagline:** `Desarrollos a medida, rápidos y económicos` (`rápidos` acentuado en teal).

**Variantes obligatorias (claro/oscuro/mono):**

- **Claro:** isotipo bicolor (ink + teal) sobre fondo `qd-bg`/blanco; wordmark con `abaco` en `qd-ink` y `qd` en `qd-teal-2`.
- **Oscuro:** versión sobre `qd-ink`/`qd-surface`; teal en `qd-teal #18B7B0`; tinta sustituida por `qd-white` o secundario claro.
- **Monocromo:** blanca para fondos oscuros; en ink plano para usos de una sola tinta.
- **Icono app:** isotipo sobre fondo tinta, sobre blanco y sobre teal (esquinas redondeadas).

Antes de cambiar assets públicos debe cerrarse y validarse la propuesta visual; no se aplica rediseño improvisado en código.

---

## 2. Paleta final como tokens

Fuente única de color. Tokens `qd-*` (mismos nombres en CSS/Tailwind). Pendiente de ratificar junto al branding el 16/06.

| Token | Hex | Rol |
|---|---|---|
| `qd-ink` | `#07111A` | Base oscura principal: fondos dark, texto sobre claro |
| `qd-surface` (`qd-ink-2`) | `#0D1B26` | Superficies elevadas en dark: cards, topbar, footer, editor |
| `qd-teal` | `#18B7B0` | **Primario de marca**: acentos, bordes, glow, CTA secundario |
| `qd-teal-2` | `#0F8F95` | Teal oscurecido: labels/texto teal sobre fondo claro (AA) |
| `qd-cyan` | `#39C6E6` | **Apoyo**: gradiente de titular, acentos puntuales, detalles |
| `qd-lime` | `#B7F34A` | **Acento puntual**: estado activo, chips, micro-detalle |
| `qd-mist` | `#E8EFF0` | Gris azulado claro: superficies/bordes suaves en light |
| `qd-bg` | `#F5F8F8` | Fondo claro general de secciones |
| `qd-white` | `#FFFFFF` | Superficies y texto sobre oscuro |

**Texto secundario:** en dark `#D6E2E5` (alto) / `#9DB0B8` (medio); en light `#4A5A63` (alto) / `#5B6770` (medio).

### Reglas de contraste y uso (duras)

- **Teal `#18B7B0` es el primario; cyan `#39C6E6` es apoyo; lime `#B7F34A` solo acento puntual.** No saturar de verde/lime: **un solo lime visible por bloque**.
- Sobre **fondo claro**, labels/eyebrows y texto teal usan **`qd-teal-2 #0F8F95`** para contraste.
- **Nunca texto blanco sobre teal plano:** sobre teal se escribe en `qd-ink`.
- **Lime nunca como texto sobre claro:** solo relleno/acento o sobre oscuro. En chips claros, lime oscurecido `#4F7A14`.
- **Focus visible:** lime sobre oscuro, teal oscurecido (`qd-teal-2`) sobre claro. Nunca `outline:none` sin sustituto.
- Glow teal **controlado**, sin neón. Contraste mínimo **WCAG AA**; no depender solo del color; estados hover/focus diferenciados.

### Ritmo de fondos

Claro `qd-bg`/`qd-mist` en secciones light; `qd-ink`/`qd-surface` en secciones dark. El CTA de reserva (lime) solo vive en hero y CTA final. Los **mockups oscuros embebidos** (editor de código del CTA y del post de blog, caja IA) se mantienen oscuros en ambos temas.

---

## 3. Tipografía — Poppins

- **Familia única: Poppins** (Google Fonts; self-host con subset latin y `font-display: swap`). En código actual está Instrument Sans; la migración a Poppins es tarea de fase 1.
- **Titulares:** 600/700.
- **Eyebrows/labels:** uppercase, Poppins 600, ~12 px, tracking amplio (~2.5).
- **Cuerpo:** 400/500.
- **Números tabulares** para pasos y contadores.
- Decisión abierta: Poppins también para párrafos largos de blog o fuente neutra de apoyo.

Escala orientativa (ajustar en implementación): H1 hero 56–72 / H2 sección 36–44 / H3 card 20–24 / cuerpo 16–18 / micro/label 12–14.

---

## 4. Tema claro / oscuro / sistema

- **Tres modos:** claro, oscuro y **sistema** (sigue `prefers-color-scheme`).
- **Preferencia persistente** en `localStorage` (hook `use-appearance` ya en el proyecto; el theme-toggler vendorizado lo usa en vez de `next-themes`). Por defecto, **sistema**.
- **Default editable en settings/ajustes:** la preferencia elegida por el usuario manda sobre el sistema mientras exista en `localStorage`.
- **Coherencia entre temas:** dark y light **comparten ADN** (misma estructura, layout y jerarquía); solo cambia la adaptación de paleta, contraste y glow.
- Adaptaciones por tema: superficies claras → `qd-bg`/blanco/`qd-mist`; superficies oscuras → `qd-ink`/`qd-surface`. Logos de partners a color en claro, versión clara/monocroma en oscuro. Mockups embebidos oscuros siempre (salvo el editor del CTA final, que sigue el tema).
- El toggle vive en la topbar (círculo con sol en claro / luna en oscuro), con transición direccional íntegra de animate-ui.

---

## 5. Componentes reutilizables

Inventario observado en los mockups finales (`mockups/abacoqd-web.pen`). Poppins en todo; radios y sombras consistentes; glow teal controlado.

### Topbar (header flotante)

- Pastilla flotante centrada (~1240 px), `cornerRadius ~20`, borde fino, sombra suave. Fondo blanco (light) / `qd-surface` (dark).
- La estructura de `FloatingHeader` se conserva protegida: arriba del todo (`scrollY <= 8`) la pastilla visual es transparente para integrarse con el Hero; al hacer scroll (`scrollY > 8`) recupera fondo translúcido, borde, blur y sombra suave.
- **Izquierda:** logo real de marca pública (`Abaco Developments`); si se ratifica la evolución `AbacoQD`, usar isotipo `A` + wordmark validado. Click → Inicio.
- **Centro:** nav `Metodología / Servicios / Proyectos / Quiénes somos / Blog / Contacto` (~15 px, gris medio; activo en teal).
- **Derecha:** `ES` + chevron (idioma) y toggle de tema (sol/luna).
- **Sin CTA de reserva** en la topbar. Comportamiento completo en `07_VISTAS/PUBLIC_09_LAYOUT_GLOBAL.md`.

### Footer

- 4 columnas (Marca con logo / Explorar / Servicios / Contacto), **sin tarjetas**, mucho aire. Títulos de columna semibold; enlaces gris medio con hover teal; contacto con iconos teal.
- La columna Contacto usa datos confirmados: `info@abacodev.com`, `+34 91 020 00 89`, `Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid` y WhatsApp rápido `+34 647 51 81 00` si se decide mostrarlo.
- Puede incluir una franja institucional discreta para `be now Partner`, `Cofinanciado por la Unión Europea`, `Fondos Europeos` y el texto FSE+ si la obligación de visibilidad lo exige. No se tratan como clientes, proyectos ni decoración de landing; su ubicación final queda pendiente de confirmación.
- Barra legal inferior con hairline. Decoración: glow teal tenue + nodos.

### Eyebrow / label de sección

- Punto teal de 7 px + texto en MAYÚSCULAS, Poppins 600, ~12 px, tracking ~2.5.
- Color del texto: `qd-teal-2` (light) / `qd-teal` (dark). Dot siempre `qd-teal`.
- Alineado a la izquierda del bloque (excepto Hero y CTA final, centrados).
- Variantes: `CÓMO TRABAJAMOS`, `SERVICIOS`, `COLABORACIONES`, `BLOG`, `EMPECEMOS`.

### Botones

- **Primario (lime)** — `Reservar una consulta` (hero) / `Empieza a ahorrar tiempo` (CTA final): relleno `qd-lime`, texto `qd-ink`, `cornerRadius ~12`, icono opcional, glow lime suave. **Solo en hero y CTA final.**
- **Primario teal** (variante de reserva): relleno `qd-teal`, texto **`qd-ink`** (nunca blanco sobre teal plano), glow teal.
- **Secundario / ghost** — `Ver servicios`, `Ver todos los artículos`: fondo claro/transparente, borde fino teal, texto teal/ink, icono flecha.
- **Texto + flecha** — `Leer artículo`, `Ver cómo trabajamos`, `Consultar`: texto teal + `arrow-right`, sin caja (o caja mínima).
- **Botón-pivote circular** (carrusel de Colaboraciones): círculo `qd-ink` con flecha (lime en claro / luna-ink en oscuro), anillo concéntrico sutil.

### Chips / badges

- **Chip de categoría** (blog, servicios): pill, borde teal fino, relleno teal ~8–14%, texto teal. Ej.: `IA`, `Desarrollo`, `Automatización`.
- **Chip lime** (estado/acento): relleno lime ~12–20%, texto lime (oscurecido `#4F7A14` en claro). Ej.: `Gratuito`, `Activo`.
- **Eyebrow del hero:** chip-texto centrado con separadores `·`.

### Cards

- **Card de servicio** (grid 3×2): horizontal, ~430×300, `cornerRadius 18`. Izquierda: número `01`–`06`, icono en cápsula teal (`42×42`, `r12`, teal 8% + borde), título, frase breve, micro-CTA `Consultar →`. Derecha: mockup de UI del servicio (pantalla con borde fino, clip). Dark: card `qd-surface` + glow teal sutil; light: card blanca + sombra suave.
- **Cube-effect carousel de metodología** (`MethodologyProcessCube`, sobre **Swiper** `effect: "cube"` con módulos `EffectCube`/`Autoplay`/`Navigation`/`Pagination`/`A11y`, 6 pasos): una cara activa por vez; en reposo solo se ve 1 cara y durante la transición como máximo 2 (la que sale y la que entra), girando como un cubo 3D real. Cada cara muestra de una sola vez número de paso en gradiente, icono en cápsula con glow, título, descripción y chip `Entregable: …`, sobre un visual tecnológico propio (nodos, wireframe, checklist, editor de código, validación o despliegue). Sin frontal/back y sin las 6 caras simultáneas. Borde teal/cian; altura igualada a la del bloque izquierdo; controles anterior/siguiente y navegación por 6 dots en una fila bajo el cubo, fuera de la tarjeta. Autoplay lento con pausa en hover/focus (mouse y teclado); reduced motion sin autoplay y con transición instantánea. Sin `tsParticles`. **Swiper es dependencia de proyecto** instalada exclusivamente para este componente (`effect: "cube"`); no se generaliza a otros carruseles ni secciones sin decisión explícita.
- **Card de blog principal**: ~800×360, estado destacado (borde teal luminoso, sombra honda + glow). Izquierda texto (chip, título, extracto, `X min de lectura`, botón `Leer artículo`); derecha visual (editor de código + flujo IA + caja cerebro). Dots de carrusel + línea de progreso de lectura.
- **Card de blog secundaria**: ~510×170, chip + título (2 líneas) + `X min de lectura` + `Leer artículo →` + mini visual.
- **Bloque "Estudio inicial gratuito"** (metodología): banda horizontal `01 · Análisis → [icono pen-tool + ESTUDIO INICIAL + chip Gratuito + mensaje + apoyo] → 02 · Propuesta`. Card elevada con borde teal/cian y glow.
- **CTA final aprobado**: bloque centrado con logo AbacoQD/Abaco Developments según marca validada, eyebrow `EMPECEMOS`, titular `El 40% del tiempo de un desarrollador se pierde manteniendo código.`, apoyo, badges `Desarrollo a medida` y `Respuesta estratégica < 24h`, mockup tipo editor/código con sidebar, archivo `app.js`, panel `Vista previa`, estado `Sistema optimizado`, CTA principal lime `Empieza a ahorrar tiempo` y secundario `Ver cómo trabajamos`. El diseño claro/oscuro, el mockup, el titular y la intención de menos mantenimiento y más tiempo para crecer están aprobados.

### Noria orbital / cards de Colaboraciones

- Circunferencia amplia tipo reloj/noria; centro = botón-pivote con flecha. Logos/proyectos en burbujas o cards de **cristal esmerilado** (translúcido + desenfoque del fondo) sobre el semicírculo derecho: giro horario continuo, aparecen a las 12, punto fuerte a las 3 (activo, mayor, nítido y opaco), desaparecen hacia las 6 y siguen ocultos de 7 a 11 hasta reaparecer en 12. Escala y opacidad interpoladas por ángulo.
- Logos por tema: a color en claro; en oscuro versión clara/monocroma si existe. Anillo de órbita sutil, indicador del activo, partículas. Datos = `partners`, `projects` y `partner_project`.

### Franja de beneficios (hero)

- Card horizontal blanca/`qd-surface`, 5 ítems con icono lineal teal + título (mayúsculas) + microcopy, separados por divisores verticales finos. Compacta, no compite con el H1.

### Cubo visual del hero

- Material de vidrio/cristal: caras translúcidas con `transmission`, baja rugosidad y tinte azul/cyan muy sutil; nunca azul opaco ni plástico.
- Jerarquía cromática: aristas/wireframe en `qd-teal`/`qd-teal-2`, glow y energía interior en `qd-cyan`/azul corporativo, highlights puntuales en azul hielo casi blanco.
- Los fragmentos de descomposición repiten la misma lógica: caras translúcidas, bordes azules y glow azul controlado.
- Evitar que texturas, flashes o materiales internos devuelvan el conjunto a blanco dominante. El resultado debe leerse azul, premium y tecnológico, sin neón excesivo.

### Editor de código embebido (mockup)

- Panel tipo VS Code: barra de título (3 dots), barra de actividad, explorador, código con resaltado (keywords violeta, funciones cian, string lime/verde, comentario tenue).
- **Se mantiene oscuro en ambos temas** salvo el del CTA final, que sigue el tema.
- En el CTA final, el editor/código es referencia visual aprobada: sidebar de proyecto, `app.js`, import/uso de AbacoQD como guiño visual si la marca final lo permite, panel `Vista previa` y estado `Sistema optimizado`.

### Formularios

- Inputs sobre superficie clara/oscura del tema, borde fino (teal en focus), label en mayúsculas/Poppins.
- **Checkbox de consentimiento** animado (pieza Radix) en contacto/reserva.
- Botón de envío = primario (lime en CTA de reserva, teal en formularios internos). Estados de error/éxito sin depender solo del color (icono + texto).

### Estados e interacción (genérico)

- **Hover de card:** lift suave + borde teal más luminoso + (si tiene imagen) zoom sutil; flecha del CTA se desplaza unos px.
- **Focus visible:** lime sobre oscuro, `qd-teal-2` sobre claro.
- **Una pieza por propósito:** no apilar shine + tilt + magnetic en el mismo elemento.

---

## 6. Widget de accesibilidad (botón flotante izquierdo) — producto BASE

Botón flotante **fijo en la esquina inferior izquierda** (icono de accesibilidad universal: persona con brazos abiertos dentro de un círculo; nunca el icono de silla de ruedas ni iconos médicos/genéricos), presente en todo el sitio. Al pulsar abre un panel con opciones reales, **persistentes en `localStorage`** y aplicadas vía clases/atributos en `<html>`.

**Opciones del panel:**

- **Contraste alto** (refuerza bordes y texto; respeta tokens).
- **Tamaño de texto** (escala de cuerpo: normal / grande / muy grande).
- **Espaciado** (interlineado y tracking ampliados para legibilidad).
- **Subrayar enlaces** (subrayado forzado, no solo color).
- **Pausar animaciones** (fuerza el equivalente a `prefers-reduced-motion`).
- **Fuente legible** (opcional, alterna a fuente de alta legibilidad).
- **Cursor / foco reforzado** (anillo de foco más visible).
- **Restablecer** (vuelve a valores por defecto).

**UI:** panel con cabecera (título + cerrar), lista de toggles/segmented controls con icono lineal + label en mayúsculas + estado, agrupados. Mismos tokens y temas que el resto. Accesible por teclado (foco atrapado en el panel, `Esc` cierra, `aria-expanded` en el botón). El botón no tapa contenido crítico y respeta safe-areas en móvil. Posición/z-index en `07_VISTAS/PUBLIC_09_LAYOUT_GLOBAL.md`.

---

## 7. Chatbot / asistente (botón flotante derecho) — producto BASE

Botón flotante **fijo en la esquina inferior derecha** (burbuja con icono de chat), presente en todo el sitio. Datos de respuestas = entidad **`faqs`** (ver `02_MODELO_DATOS.md`).

**Estructura:**

- **Burbuja/launcher:** círculo `qd-surface`/`qd-teal` con icono; badge opcional. Glow teal sutil.
- **Panel de conversación:** se despliega desde la burbuja; cabecera (avatar/logo + título + cerrar), área de mensajes (burbujas del asistente a la izquierda, del usuario a la derecha en teal sobre el que el texto va en `qd-ink`), input inferior con botón enviar.
- **Sugerencias rápidas (chips):** preguntas frecuentes alimentadas por `faqs` (`¿Qué servicios ofrecéis?`, `¿Cuánto tarda un proyecto?`, etc.).
- **Enlaces de acción:** accesos directos a **Contacto**, email principal `info@abacodev.com` y WhatsApp directo `+34 647 51 81 00` dentro del panel. No exponer emails secundarios salvo decisión explícita.

**UI/comportamiento:** mismos tokens/tema; accesible por teclado y lector de pantalla (`aria-live` en mensajes nuevos, `Esc` cierra). Respeta reduced-motion (sin animación de burbujas más allá del fade). No solapa el widget de accesibilidad (lados opuestos). En móvil, el panel puede ocupar casi pantalla completa.

---

## 8. Animaciones globales

Catálogo de utilidades: animate-ui (sección 9). Regla transversal: **todo respeta `prefers-reduced-motion`** congelando el estado final legible.

### Principios

- **Reveal on scroll:** entradas con `IntersectionObserver` — fade + rise ~12–16 px, **300–450 ms ease-out**, con stagger.
- **Hover (microinteracciones):** **150–250 ms** — lift, zoom de imagen, desplazamiento de flecha, encendido de borde teal.
- **Glow y drift:** muy lentos y sutiles. Nada de neón excesivo ni efecto gaming.
- **"Velocidad con control":** la marca comunica rapidez, pero las animaciones son contenidas y deterministas; una pieza por propósito, sin apilar efectos.

### Fondo animado — SVG Wave Background

Capa de fondo global, presente en **todas las vistas públicas** (incluidas 404/500/503), detrás del contenido (`pointer-events: none`, `z-index` inferior a todo). Representada en los mockups como ondas/gradientes desenfocados muy sutiles. Criterio de marca: "fondo vivo, no protagonista" — nunca debe parecer gaming ni competir con el contenido.

- **Stack previsto:** componente React + CSS variables + Tailwind (no depende de GSAP). Implementación de la animación (CSS o Framer Motion) se decide en fase de código; en mockups se representa de forma estática.
- **Velocidad:** muy lenta (drift ~x0.25).
- **Variables CSS:** `--wave-bg`, `--wave-primary`, `--wave-secondary`, `--wave-accent`, `--wave-opacity`, `--wave-duration`, `--wave-speed-factor`.
- **Claro:** fondo `#F6F8F7`; ola primaria `#18B7B0`; ola secundaria `#39C6E6`; acento lime `#A3E635`; opacidad 0.16–0.28 (debe verse como tinte teal/cyan/lime vivo sobre el fondo claro, no quedar plano).
- **Oscuro:** fondo `#07111A`/`#0D1117`; ola primaria `#18B7B0`; ola secundaria `#0F8F95`; acento `#39C6E6`, lime `#A3E635` solo puntual; opacidad 0.22–0.36 (recorrido de ondas perceptible, glow controlado, sin efecto neón).
- El wave se sitúa entre el fondo base del frame y el contenido/superficies glass; estas últimas no deben ocultarlo por completo.
- **Accesibilidad/rendimiento:** respeta `prefers-reduced-motion` (y la opción "Pausar animaciones" del widget de accesibilidad); sin impacto de rendimiento; no bloquea interacción.

### Superficies de cristal translúcido (legibilidad sobre el wave)

Cuando un bloque con texto importante queda sobre el Wave Background (heroes internos, cabeceras de página, bloques de detalle de proyecto/blog, formularios, bloques legales/contacto), se aplica una superficie de cristal translúcida que mantiene la ola visible detrás sin sacrificar contraste.

- **Variables:** `--surface-glass-bg`, `--surface-glass-border`, `--surface-glass-blur`, `--surface-glass-shadow`, `--surface-glass-opacity`.
- **Claro:** fondo blanco translúcido (opacidad ~0.68–0.82); borde `rgba(13,17,23,0.08)`; blur suave; sombra muy ligera.
- **Oscuro:** fondo azul/negro translúcido (opacidad ~0.54–0.72); borde `rgba(255,255,255,0.10)`; blur suave; glow teal opcional muy sutil.
- **Criterio:** no todos los elementos lo necesitan; se reserva para bloques de texto/formularios sobre el wave. El resultado debe seguir pareciendo "cristal", nunca una caja gris plana.

### `prefers-reduced-motion`

- En fase 1 se envuelve la app con `MotionConfig reducedMotion="user"` (Motion desactiva animaciones para quien lo pida) + fallbacks estáticos por vista.
- El **widget de accesibilidad** ofrece además "Pausar animaciones", que fuerza el mismo comportamiento aunque el SO no lo indique.

### Sistema de velocidad/easing (orientativo)

| Uso | Duración | Easing |
|---|---|---|
| Microinteracción hover | 150–250 ms | ease-out |
| Reveal on scroll | 300–450 ms | ease-out |
| Transición de tema | ~300–400 ms | ease-in-out (direccional) |
| Glow / drift ambiente | varios s, loop | linear/ease-in-out muy lento |

> Las animaciones **específicas** de hero, metodología, servicios, colaboraciones, blog, CTA final y footer se documentan en sus docs de vista, no aquí.

---

## 9. Catálogo animate-ui (utilidades globales)

**Qué es:** distribución de componentes React animados (no librería npm) que se copian al repo vía el CLI de shadcn y quedan como código propio editable. Familias: **Components** (estilizados), **Primitives** (mecánica sin estilo, para vestir con nuestra marca) e **Icons** (Lucide animados, beta). Stack: React + Tailwind + **Motion** + Lucide — encaja con el proyecto (React 19, Tailwind 4, lucide-react, Radix).

**Regla de fidelidad:** las piezas se usan **íntegras, tal cual en animate-ui.com**; la única adaptación permitida es de integración (fuente del estado de tema, textos, tokens), nunca del comportamiento visual.

### Dependencia y comando de instalación

`motion` es la **única dependencia transversal** (se instala en fase 1; no en fase documental).

| Paquete | Motivo |
|---|---|
| `motion` | Motor de animación de todas las piezas |
| `shiki` | Solo si se usan `components-animate-code`/`code-tabs` (resaltado, blog) |
| `embla-carousel-react` | Solo si se usa `motion-carousel` |
| `next-themes` | **NO se instala** — se adapta al hook `use-appearance` |

Prerequisito: `components.json` (ya existe; estilo new-york, alias `@/components`, iconos lucide). Instalación recomendada vía namespace `@animate-ui` (resuelve `registryDependencies` solas):

```jsonc
// components.json
{ "registries": { "@animate-ui": "https://animate-ui.com/r/{name}.json" } }
```

```bash
npx shadcn@latest add @animate-ui/components-buttons-theme-toggler
npx shadcn@latest add @animate-ui/icons-arrow-right
```

El código cae en `resources/js/components/animate-ui/{components|primitives|icons}/...`. Import tipo:

```tsx
import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';
```

### Piezas globales (reutilizables en cualquier vista)

| Propósito global | Pieza | Item registry |
|---|---|---|
| Toggle de tema (claro/oscuro/sistema) | Theme Toggler Button | `components-buttons-theme-toggler` (+ `primitives-effects-theme-toggler`) |
| Menú móvil | Sheet (Radix) | `components-radix-sheet` |
| CTA primario lime (efecto al pulsar) | Ripple Button | `components-buttons-ripple` |
| Flecha que avanza en hover | icono `arrow-right` (`pointing`) | `icons-arrow-right` |
| Reveal genérico de secciones (fade + rise) | Effect / Fade / Slide | `primitives-effects-effect`, `-fade`, `-slide` |
| Brillo sutil de card en hover | Shine | `primitives-effects-shine` |
| Zoom suave de cover/imagen | Zoom / Image Zoom | `primitives-effects-zoom`, `-image-zoom` |
| Progreso ligado al scroll | Scroll Progress | `primitives-animate-scroll-progress` |
| Contadores que cuentan al aparecer | Counting / Sliding Number | `primitives-texts-counting-number`, `-sliding-number` |
| Texto en gradiente / subrayado | Gradient / Highlight Text | `primitives-texts-gradient`, `-highlight` |
| Tooltips puntuales | Tooltip (Radix) | `components-radix-tooltip` |
| Checkbox de consentimiento | Checkbox (Radix) | `components-radix-checkbox` |

> Las asignaciones **a vistas concretas** (hero, blog, admin, etc.) viven en el doc de cada vista. Aquí solo el inventario global.

### Iconos animados (Lucide + Motion)

Instalación por icono (`@animate-ui/icons-<nombre-lucide>`); cada uno trae variantes (`default`, `pointing`, `loop`…). Props comunes: `animate`, `animateOnHover`, `animateOnTap`, `animateOnView`, `animation`, `loop`, `size`. Estado **beta**: congelar versión vendorizada y revisar antes de re-sincronizar.

```tsx
<ArrowRight animateOnHover />
<AnimateIcon animateOnHover><ArrowRight /></AnimateIcon>
```

### Piezas descartadas (criterio de identidad)

`fireworks`, `bubble`, `hole`, `gravity-stars`, `stars` (backgrounds festivos/espaciales), `playful-todolist`, `radial-*`, `github-stars-*`, `cursor` personalizado: contradicen la dirección sobria (sin neón gratuito, sin gaming, sin blobs). No se instalan salvo decisión nueva.

### Reglas de uso

- El **hero protegido conserva sus animaciones actuales** (partículas, cubo): animate-ui solo viste CTAs y textos dentro de él; no sustituye su mecánica.
- Colores: las piezas usan los tokens CSS de shadcn; al mapear `qd-*` a esos tokens en fase 1, salen con la marca sin tocar su código.
- En los mockups (Pencil) las piezas se representan en su estado visual estático; en código se instalan íntegras.

---

## 10. Responsive global

- **Breakpoints (Tailwind):** `sm 640` / `md 768` / `lg 1024` / `xl 1280` / `2xl 1536`.
- **Contenedor:** ancho máximo de contenido ~1240 px (alineado con la pastilla de la topbar), centrado, con padding lateral fluido (≥16 px móvil, ≥24–32 px desktop) y respeto de safe-areas (botones flotantes).
- **Grid:** los grids multi-columna (servicios 3×2, footer 4 col) colapsan progresivamente: 4→2→1 en footer, 3→2→1 en servicios. Cards de blog principal/secundaria pasan a apilado vertical en móvil.
- **Topbar:** la nav central colapsa a menú móvil (Sheet) en `< md`; logo + toggles se mantienen.
- **Botones flotantes** (accesibilidad izq. / chatbot der.) se mantienen fijos en todos los breakpoints sin solaparse; en móvil sus paneles pueden ocupar casi pantalla completa.
- **Tipografía fluida:** titulares escalan hacia abajo en móvil; cuerpo nunca por debajo de 16 px.

---

> Pendientes de validación (16/06): ratificación de logo + paleta; assets derivados (favicon, icono app, OG, SVG claro/oscuro); decisión de Poppins en cuerpo largo; sistema de iconos (dirección: lucide lineal 1.5–2 px); mapeo de tokens `qd-*` → variables shadcn en `app.css` (fase 1); ejecución de instalaciones animate-ui al abrir fase 1.

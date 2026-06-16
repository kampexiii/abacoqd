# Layout global — header, footer y transversales

Última revisión: 14 de junio de 2026. Layout global de todas las vistas públicas. Alineado con el mockup final (`mockups/abacoqd-web.pen`).

## Identificación

| Campo | Valor |
|---|---|
| Alcance | Todas las vistas públicas |
| Componentes actuales | `FloatingHeader.tsx` (protegido), `SiteFooter.tsx` |
| Entidades | `settings`, `partners`, `projects`, `faqs` |

Paleta y componentes en `04_IDENTIDAD_UI_COMPONENTES.md`; modelo de datos en `02_MODELO_DATOS.md`; multilenguaje/SEO en `03_SEO_MULTILENGUAJE_LEGAL.md`.

## Objetivo

Marco común a todas las vistas públicas: header flotante, footer, idioma ES/EN, tema claro/oscuro/sistema, y los dos botones flotantes transversales (accesibilidad a la izquierda, chatbot a la derecha). Es **base** del producto definitivo, no futuro.

---

## Header flotante (componente protegido)

Se conserva la estructura de `FloatingHeader` (pastilla flotante con marca, nav, idioma y tema — **sin CTA de reserva**). Cambia contenido y destino, no la estructura.

**Reutilización obligatoria:** todas las vistas públicas (incluidas las de error 404/500/503) usan esta misma topbar canónica, con la misma composición, espaciado y proporciones que en la landing. Prohibido cualquier topbar genérica o alternativa.

### Marca
- Marca pública visible: **Abaco Developments**. La razón social completa queda reservada para textos legales. Si se conserva un tratamiento visual `AbacoQD`, debe validarse como evolución gráfica antes de publicarlo.
- Logo/wordmark horizontal de marca pública, con variantes claro/oscuro según tema.
- Click → Inicio (`/` o `/en`). **No hay ítem `Inicio`**: lo cubre el logo.

### Navegación (final)
Orden definitivo (6 ítems; el logo cubre Inicio):
1. `Metodología`
2. `Servicios`
3. `Proyectos`
4. `Quiénes somos`
5. `Blog`
6. `Contacto`

- **Descartados de la topbar**: `Tipologías` (muerto), `Portafolios` y `Colaboraciones` (no son etiquetas de topbar: el ítem público es `Proyectos`; `Colaboraciones` solo nombra la sección de landing), nombres internos de relación/partners, `Casos de éxito`, `Reserva`.
- Mientras las páginas dedicadas no existan, los ítems apuntan a anclas de home y migran a rutas al publicarse.
- Ítem activo: acento teal (subrayado fino o texto teal); en home el "activo" es el logo. Hover: texto a teal 150 ms.
- `Blog` se oculta hasta haber posts publicados (coherente con `PUBLIC_05_BLOG.md`).

### Acciones (derecha)
- **Sin CTA de reserva en la topbar.** Los botones de reserva viven en hero, CTA final y bloques contextuales (ver `PUBLIC_06_CONTACTO_RESERVA.md`).
- Selector de idioma `ES` (toggle ES/EN): navega a la ruta equivalente del otro idioma; si no hay traducción, al índice de su tipo.
- Toggle de tema claro/oscuro/sistema (sol/luna; componente animate-ui existente).

### Mobile (<1024)
- Pastilla compacta: logo + idioma/tema + hamburguesa (**sin** botón de reserva).
- Menú: panel deslizante (Radix Dialog) a pantalla completa, fondo ink: nav apilada grande (Poppins 600), idioma y tema al pie. Transición 250 ms; cierre por esc/overlay; focus trap.

### Comportamiento scroll
- Se mantiene el comportamiento flotante actual (sin cambios estructurales).

---

## Footer (`SiteFooter`)

Alineado con el footer del mockup (`Footer - Dark` / `Footer - Light`). Fondo `qd-ink` (dark) / `qd-bg` (light); **4 columnas con aire** (sin meter cada columna en una tarjeta).

**Reutilización obligatoria:** todas las vistas públicas (incluidas las de error 404/500/503) usan este mismo footer canónico completo (logo, columnas, franja institucional UE/FSE+ y barra legal). Prohibido cualquier footer genérico (p. ej. columnas "Producto / Empresa / Legal") o logo cuadrado genérico.

1. **Marca**: logo de Abaco Developments + descripción `Desarrollos a medida potenciados por IA.` / `Iniciativa de Abaco Developments.` + `Construimos con estrategia, diseño y tecnología.` (columna más ancha).
2. **Explorar**: Inicio, Metodología, Servicios, Proyectos, Quiénes somos, Blog, Contacto.
3. **Servicios**: Desarrollo web, Aplicaciones a medida, Automatización, Diseño UX/UI, Consultoría digital.
4. **Contacto**: Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid; info@abacodev.com; +34 91 020 00 89; WhatsApp +34 647 51 81 00 si se muestra como contacto rápido. Redes sociales solo si se confirman perfiles reales.

- Barra legal inferior con hairline: `© 2026 Abaco Developments. Todos los derechos reservados.` a la izquierda; `Privacidad / Cookies / Aviso legal` a la derecha (ver `PUBLIC_07_LEGAL_COOKIES_PRIVACIDAD.md`).
- Bloque institucional opcional/discreto: be now Partner, Cofinanciado por la Unión Europea, Fondos Europeos y texto FSE+ si la obligación de visibilidad lo requiere. Debe ser una franja o grupo sobrio, no una sección comercial ni un sustituto de Colaboraciones.
- Decoración sutil: hairline superior, glow radial teal tenue, algunos nodos. Títulos de columna `qd-ink`/blanco según tema; enlaces en gris medio con hover teal.
- Datos de marca/contacto desde `settings`. Contacto confirmado: dirección, teléfono fijo, WhatsApp directo de Andrés, email principal y emails secundarios. Teléfono principal único pendiente de confirmación.

---

## Botones flotantes transversales

Dos botones flotantes persistentes en todas las vistas públicas, simétricos y diferenciados por lado. UI detallada de ambos paneles en `04_IDENTIDAD_UI_COMPONENTES.md`.

### Accesibilidad — botón flotante **izquierdo**
- Posición fija inferior izquierda; icono universal de accesibilidad; `aria-label` `Opciones de accesibilidad`.
- Abre un panel con ajustes: tamaño de texto, mayor contraste, subrayado de enlaces, reducir movimiento (sincroniza con `prefers-reduced-motion`), y pausa de animaciones.
- Panel como diálogo accesible (Radix Dialog) con focus trap; cierre por esc/overlay; estado persistido (tema/preferencias en almacenamiento local, coherente con `use-appearance`).
- Funciona en claro/oscuro/sistema; no depende de JS de terceros.

### Chatbot / asistente — botón flotante **derecho**
- Posición fija inferior derecha; icono de chat; `aria-label` `Abrir asistente`.
- Abre un panel de conversación (lanzador → panel) sin tapar el contenido crítico; cierre por esc/overlay; focus trap.
- Datos de respuestas = entidad `faqs` (`02_MODELO_DATOS.md`).
- Si el proveedor/back del asistente no está disponible, el panel ofrece **fallback** a contacto/WhatsApp (coherente con `PUBLIC_06_CONTACTO_RESERVA.md`).

### Capas / z-index
- Orden de apilado (de abajo a arriba): contenido → header flotante → botones flotantes (accesibilidad y chatbot, misma capa) → paneles abiertos de esos botones → toasts (sonner) → modales/diálogos a pantalla completa (menú mobile, banner de cookies si aplica).
- Los botones flotantes no solapan el header ni los CTA principales; respetan *safe areas* en mobile y se reposicionan si el banner de cookies está visible.

---

## Transversales

### Esqueleto de página
- **Skip-link** `Saltar al contenido` (visible al foco) antes del header.
- `main` con `id="contenido"` en cada vista; un `h1` por vista.
- Contenedor máx. ~1200–1280 px; secciones como bandas de ancho completo con contenido contenido.

### Focus y estados interactivos
- Focus ring: lime 2 px sobre bandas oscuras, teal oscurecido sobre claras; nunca `outline: none` sin sustituto.
- Botones: primario lime (texto ink, hover scale 1.02 + sombra), secundario ghost (borde, hover relleno suave), terciario texto con flecha.
- Radios y sombras consistentes según el design system (`04_IDENTIDAD_UI_COMPONENTES.md`).

### Idioma y rutas
- ES sin prefijo, EN bajo `/en` (según `03_SEO_MULTILENGUAJE_LEGAL.md`).
- Dominio canónico final: `https://abacoqd.com/`. `https://abacodev.com/` queda como dominio histórico/investigado y `https://www.abacodev.com/` como URL legal histórica; la redirección o convivencia está pendiente de confirmar.
- `lang` correcto en `<html>`; `hreflang` por vista según su documento.
- El estado de idioma persiste entre navegaciones (mecanismo actual evoluciona a rutas en su fase).

### Tema claro/oscuro/sistema
- Toggle existente con modos claro, oscuro y **sistema**. Las bandas `qd-ink` son fijas (marca); las bandas claras definen su variante dark según el design system.

### Notificaciones y overlays
- Toasts: sonner (existente), esquina inferior; éxito en teal, error en rojo accesible.
- Modales/paneles: Radix Dialog con focus trap.
- Banner de cookies: solo si se confirma analítica/embeds con cookies no técnicas (maquetación en `PUBLIC_07_LEGAL_COOKIES_PRIVACIDAD.md`).

### CTA final de landing
- El layout global no sustituye el CTA final aprobado de la home. La composición con editor/código, badges, CTAs, modo claro, modo oscuro y titular `El 40% del tiempo de un desarrollador se pierde manteniendo código.` se conserva en `PUBLIC_01_HOME_LANDING.md`.

### Rendimiento
- Three.js y partículas viven solo en la home (hero). El resto de vistas no cargan esos bundles.
- Imágenes lazy con `aspect-ratio` reservado; fuentes Poppins con `font-display: swap` y subset latin.

## Contenido editable

Logo, navegación pública, footer, datos corporativos y legales, bloque institucional, redes, enlaces legales, idioma por defecto, tema por defecto, defaults de accesibilidad y FAQs del chatbot se alimentan de `settings`/`faqs` cuando exista el modelo. La topbar no incluye reserva. LinkedIn es la única red segura para publicar inicialmente; Facebook y otras redes siguen pendientes. Contacto, domicilio y datos legales ya están confirmados.

## Responsive global

- Breakpoint principal de header/menú en <1024.
- Footer pasa de 4 columnas a apilado en mobile.
- Botones flotantes mantienen tamaño táctil mínimo (~44 px) y separación de bordes; el panel del chatbot/accesibilidad ocupa ancho cómodo o pantalla completa en mobile.

## Modo claro/oscuro

- Header (banda clara/oscura), footer (`Footer - Dark`/`Footer - Light`) y paneles flotantes adaptan su variante manteniendo contraste AA. Los acentos lime/teal se conservan como marca.

## Animaciones propias

- Header: comportamiento flotante existente; hover de nav 150 ms.
- Footer: sin animaciones pesadas; glow tenue estático, a lo sumo fade-in.
- Botones flotantes: microinteracción de hover (scale ~1.02); apertura de panel suave. Todo respeta `prefers-reduced-motion`. Principios en `04_IDENTIDAD_UI_COMPONENTES.md`.

## Accesibilidad (resumen)

- Skip-link y `main#contenido` en todas las vistas.
- Botones flotantes con `aria-label`, foco visible y focus trap en sus paneles.
- El widget de accesibilidad expone explícitamente "reducir movimiento" y se sincroniza con `prefers-reduced-motion`.

## Decisiones abiertas

- Visibilidad de `Blog` en topbar pre-contenido (ocultar hasta haber posts publicados).
- Ubicación obligatoria de logos UE/FSE+/Fondos Europeos y versiones finales de assets.
- Redes sociales públicas reales: LinkedIn sí; Facebook y resto pendientes de validación.
- Proveedor/back del chatbot (con fallback a contacto/WhatsApp mientras tanto).

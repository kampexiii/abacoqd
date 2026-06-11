# Guía de Estilo Corporativa — Ábaco Developments

**Versión:** 1.0  
**Fecha:** Junio 2026  
**Estado:** Paleta corporativa validada con archivo raíz `AbacoDevPAletaColores.jpeg`

> La paleta cromática ya no es una propuesta visual. Los colores corporativos reales proceden del archivo de paleta disponible en la raíz del proyecto.

---

## 1. Personalidad visual de la marca

### Atributos de personalidad

| Atributo          | Descripción                        | Aplicación visual                      |
| ----------------- | ---------------------------------- | -------------------------------------- |
| **Profesional**   | Serios, solventes, de confianza    | Tipografía limpia, espacios amplios    |
| **Tecnológico**   | Innovadores, actuales, expertos    | Líneas limpias, paleta fría-neutra     |
| **Premium**       | Alta calidad, no masivo            | Sin elementos recargados, mucho blanco |
| **Consultivo**    | Orientadores, no vendedores        | Tone of voice directo sin presión      |
| **Internacional** | Madrid + proyección global         | Diseño atemporal, no localista         |
| **Humano**        | Personas reales, resultados reales | Fotos auténticas, no stock             |

### Lo que la marca NO debe parecer

- ❌ Una agencia creativa (no es su negocio)
- ❌ Una startup tecnológica juvenil (es consultora seria)
- ❌ Un proveedor de precios bajos
- ❌ Una empresa masiva sin personalización
- ❌ Una consultora genérica sin especialización

---

## 2. Principios de diseño

1. **Claridad sobre creatividad** — Cada elemento tiene una función; nada es decorativo sin propósito
2. **Espaciado generoso** — El espacio en blanco es un activo de marca premium
3. **Jerarquía clara** — El usuario siempre sabe qué leer primero y qué hacer después
4. **Consistencia total** — Mismos tokens en todos los componentes, sin excepciones
5. **Mobile first** — Diseñado desde el móvil, optimizado para desktop
6. **Accesibilidad no negociable** — WCAG 2.2 AA desde el primer componente

---

## 3. Paleta de colores

### 3.1 Paleta corporativa real

Fuente: `AbacoDevPAletaColores.jpeg` en la raíz del proyecto.

| Rol                | Token                                  | Nombre               | HEX       | RGB           | Uso                                                                           |
| ------------------ | -------------------------------------- | -------------------- | --------- | ------------- | ----------------------------------------------------------------------------- |
| Primario           | `brand-primary`                        | Verde petróleo Ábaco | `#087F8C` | 8, 127, 140   | CTA principales, enlaces, foco, elementos de marca con contraste sobre claro. |
| Secundario         | `brand-secondary`                      | Teal Ábaco           | `#088C8C` | 8, 140, 140   | Accents, iconografía, badges, elementos secundarios.                          |
| Apoyo claro        | `brand-accent` / `brand-primary-light` | Aguamarina           | `#7ABFBF` | 122, 191, 191 | Fondos suaves, separadores, chips, iconos no críticos.                        |
| Fondo tonal        | `brand-primary-subtle`                 | Aqua suave           | `#B0D9D9` | 176, 217, 217 | Bandas de sección, fondos de cards suaves, bordes de marca.                   |
| Neutro corporativo | `neutral-brand`                        | Gris claro Ábaco     | `#F2F2F2` | 242, 242, 242 | Fondo claro alternativo, cards neutras, divisores suaves.                     |

### 3.2 Colores derivados de interacción

Los siguientes colores no aparecen como swatches en la paleta, pero se derivan del primario/secundario para resolver hover, modo oscuro y contraste WCAG.

| Token                   | HEX       | RGB         | Uso                                                 |
| ----------------------- | --------- | ----------- | --------------------------------------------------- |
| `brand-primary-hover`   | `#066A75` | 6, 106, 117 | Hover de CTA principal y enlaces sobre fondo claro. |
| `brand-secondary-hover` | `#077878` | 7, 120, 120 | Hover de elementos secundarios.                     |
| `surface-dark`          | `#061B20` | 6, 27, 32   | Fondo principal en modo oscuro y footer.            |
| `surface-dark-elevated` | `#082D33` | 8, 45, 51   | Cards y paneles en modo oscuro.                     |

**Contraste operativo:**

- `#087F8C` sobre blanco: apto para texto normal AA.
- `#088C8C` sobre blanco: usar preferentemente en elementos grandes, iconos o fondos; no como texto pequeño crítico.
- `#7ABFBF`, `#B0D9D9` y `#F2F2F2`: no usar como texto sobre blanco; son colores de superficie, apoyo o borde.

### 3.3 Neutros

La paleta corporativa solo aporta un neutro explícito: `#F2F2F2`. Para texto y accesibilidad se mantienen neutros funcionales no marcarios.

| Token           | Nombre           | HEX       | RGB           | Uso                                        |
| --------------- | ---------------- | --------- | ------------- | ------------------------------------------ |
| `neutral-950`   | Texto principal  | `#0F172A` | 15, 23, 42    | Headings y cuerpo principal en modo claro. |
| `neutral-700`   | Texto secundario | `#334155` | 51, 65, 85    | Párrafos secundarios, descripciones.       |
| `neutral-500`   | Texto muted      | `#64748B` | 100, 116, 139 | Metadatos, placeholders, ayudas.           |
| `neutral-brand` | Gris claro Ábaco | `#F2F2F2` | 242, 242, 242 | Fondo neutro corporativo.                  |
| `white`         | Blanco           | `#FFFFFF` | 255, 255, 255 | Fondo base claro y texto invertido.        |

### 3.4 Superficies (modo claro)

| Token                 | HEX       | RGB           | Uso                                            |
| --------------------- | --------- | ------------- | ---------------------------------------------- |
| `surface-base`        | `#FFFFFF` | 255, 255, 255 | Fondo principal.                               |
| `surface-elevated`    | `#F2F2F2` | 242, 242, 242 | Cards neutras, zonas alternas.                 |
| `surface-brand-soft`  | `#B0D9D9` | 176, 217, 217 | Bandas suaves de marca.                        |
| `surface-brand-muted` | `#7ABFBF` | 122, 191, 191 | Bloques tonales de apoyo, nunca texto pequeño. |
| `surface-invert`      | `#061B20` | 6, 27, 32     | Footer, CTA final o secciones oscuras.         |

### 3.5 Superficies (modo oscuro)

| Token              | HEX       | RGB           | Uso                                       |
| ------------------ | --------- | ------------- | ----------------------------------------- |
| `surface-base`     | `#061B20` | 6, 27, 32     | Fondo principal oscuro.                   |
| `surface-elevated` | `#082D33` | 8, 45, 51     | Cards y paneles oscuros.                  |
| `surface-overlay`  | `#083F46` | 8, 63, 70     | Dropdowns, overlays, tooltips.            |
| `surface-invert`   | `#F2F2F2` | 242, 242, 242 | Superficies claras dentro de modo oscuro. |

### 3.6 Estados

| Estado          | Nombre         | Claro HEX | Oscuro HEX | Uso                                       |
| --------------- | -------------- | --------- | ---------- | ----------------------------------------- |
| `state-success` | Verde éxito    | `#16A34A` | `#22C55E`  | Confirmaciones, formularios OK            |
| `state-warning` | Amarillo aviso | `#CA8A04` | `#EAB308`  | Avisos no bloqueantes                     |
| `state-error`   | Rojo error     | `#DC2626` | `#EF4444`  | Errores de validación                     |
| `state-info`    | Info Ábaco     | `#087F8C` | `#7ABFBF`  | Mensajes informativos alineados con marca |

---

## 4. Tipografía

### 4.1 Tipografías seleccionadas

| Rol          | Familia          | Variantes                                   | Fuente       |
| ------------ | ---------------- | ------------------------------------------- | ------------ |
| **Headings** | `Inter`          | 600 (SemiBold), 700 (Bold), 800 (ExtraBold) | Google Fonts |
| **Body**     | `Inter`          | 400 (Regular), 500 (Medium)                 | Google Fonts |
| **Mono**     | `JetBrains Mono` | 400, 500                                    | Google Fonts |

**Justificación de Inter:**

- Legibilidad excepcional en pantalla
- Neutral y profesional (sin personalidad excesiva)
- Usado por grandes consultoras y SaaS enterprise
- Excelente soporte de caracteres (acentos españoles)
- Gratis y sin licencia

**Alternativas si el cliente prefiere diferenciarse:**

- **Headings:** `Outfit` (más moderno), `DM Sans` (más geométrico), `Sora` (más tech)
- **Body:** `Nunito Sans`, `Plus Jakarta Sans`

---

### 4.2 Escala tipográfica

| Token       | Tamaño | Interlineado | Peso     | Uso                            |
| ----------- | ------ | ------------ | -------- | ------------------------------ |
| `text-xs`   | 12px   | 1.5          | 400      | Labels, captions, meta         |
| `text-sm`   | 14px   | 1.5          | 400, 500 | Texto secundario, badges       |
| `text-base` | 16px   | 1.6          | 400      | Cuerpo de texto (base)         |
| `text-lg`   | 18px   | 1.5          | 400, 500 | Intro párrafos                 |
| `text-xl`   | 20px   | 1.4          | 500, 600 | Card titles, subtítulos        |
| `text-2xl`  | 24px   | 1.3          | 600      | Section titles (H3)            |
| `text-3xl`  | 30px   | 1.25         | 600, 700 | Page sub-headings (H2)         |
| `text-4xl`  | 36px   | 1.2          | 700      | Page headings (H1 secundario)  |
| `text-5xl`  | 48px   | 1.15         | 700, 800 | Hero headings                  |
| `text-6xl`  | 60px   | 1.1          | 800      | Hero display (uso excepcional) |

---

### 4.3 Jerarquía de headings

```
H1 — text-5xl/text-4xl — 700/800 — Solo en hero de cada página
H2 — text-3xl/text-4xl — 700 — Títulos de sección principal
H3 — text-2xl — 600 — Subtítulos dentro de sección
H4 — text-xl — 600 — Títulos de cards y subsecciones
H5 — text-lg — 500 — Títulos de listas y detalles
H6 — text-base — 500 — Poco usado
```

---

## 5. Sistema de espaciado

Base de 4px. Escala en incrementos de 4:

| Token      | Valor | Uso                                 |
| ---------- | ----- | ----------------------------------- |
| `space-1`  | 4px   | Micro-spacing (entre icono y label) |
| `space-2`  | 8px   | Spacing interno compacto            |
| `space-3`  | 12px  | Padding de badges y chips           |
| `space-4`  | 16px  | Base de padding en componentes      |
| `space-5`  | 20px  | Spacing entre elementos en lista    |
| `space-6`  | 24px  | Padding de cards                    |
| `space-8`  | 32px  | Gaps en grids                       |
| `space-10` | 40px  | Spacing entre secciones internas    |
| `space-12` | 48px  | Spacing entre secciones             |
| `space-16` | 64px  | Spacing grande entre bloques        |
| `space-20` | 80px  | Padding de secciones principales    |
| `space-24` | 96px  | Padding de hero                     |
| `space-32` | 128px | Separación de secciones en desktop  |

---

## 6. Bordes y radios

| Token         | Valor  | Uso                            |
| ------------- | ------ | ------------------------------ |
| `radius-none` | 0      | Sin borde redondeado           |
| `radius-sm`   | 4px    | Badges, chips pequeños         |
| `radius-md`   | 8px    | Inputs, botones pequeños       |
| `radius-lg`   | 12px   | Cards estándar                 |
| `radius-xl`   | 16px   | Cards destacadas, modales      |
| `radius-2xl`  | 24px   | Elementos hero, panels grandes |
| `radius-full` | 9999px | Pills, avatares, chips         |

---

## 7. Sombras

| Token          | CSS                                  | Uso                     |
| -------------- | ------------------------------------ | ----------------------- |
| `shadow-sm`    | `0 1px 2px 0 rgb(0 0 0 / 0.05)`      | Cards en reposo         |
| `shadow-md`    | `0 4px 6px -1px rgb(0 0 0 / 0.07)`   | Cards en hover          |
| `shadow-lg`    | `0 10px 15px -3px rgb(0 0 0 / 0.08)` | Dropdowns, popovers     |
| `shadow-xl`    | `0 20px 25px -5px rgb(0 0 0 / 0.1)`  | Modales                 |
| `shadow-brand` | `0 4px 14px 0 rgb(8 127 140 / 0.25)` | Botones CTA principales |

---

## 8. Iconografía

**Librería:** [Lucide React](https://lucide.dev/) (ya incluida en el starter kit)

**Justificación:**

- Open source, sin licencia
- 1.000+ iconos consistentes
- Totalmente tree-shakeable
- Stroke-based (escalan perfectamente)
- Permiten personalizar color y grosor

**Tamaños de icono:**
| Contexto | Tamaño |
|---------|--------|
| Inline en texto | 16px |
| Labels y listas | 20px |
| Cards y features | 24px |
| Secciones hero | 32-48px |
| Ilustraciones de servicio | 64px |

**Reglas de uso:**

- Siempre acompañados de texto (nunca solos en interactivos)
- Color heredado del texto o del token semántico correspondiente
- Grosor de línea: `strokeWidth={1.5}` por defecto, `2` en elementos interactivos destacados

---

## 9. Estilo de imágenes

| Tipo                           | Directrices                                                           |
| ------------------------------ | --------------------------------------------------------------------- |
| **Fotos de equipo**            | Fondo neutro o en oficina, luz profesional, actitud cercana no rígida |
| **Fotos de producto/servicio** | Screenshots reales con overlay de marca, no stock genérico            |
| **Casos de éxito**             | Logos del cliente, si se autoriza foto de instalaciones o capturas    |
| **Blog**                       | Imágenes propias o Unsplash premium, nada de clipart                  |
| **Hero**                       | Composición con gradiente de marca + ilustración o imagen editorial   |
| **Formatos**                   | WebP principal, AVIF si el soporte lo permite, fallback JPEG          |
| **Relaciones de aspecto**      | 16:9 artículos, 4:3 cards, 1:1 avatares, 3:2 hero lateral             |

---

## 10. Uso del logo

Los SVGs reconstruidos estan disponibles en `branding/logo/`. Las reglas completas estan en `docs/02_Branding/04_logo_guidelines.md`.

| Versión           | Uso                                                  |
| ----------------- | ---------------------------------------------------- |
| `logo.svg`        | Logo principal compacto sobre fondo teal corporativo |
| `logo-white.svg`  | Footer dark y secciones oscuras                      |
| `logo-black.svg`  | Usos monocromos sobre fondo claro                    |
| `icon.svg`        | Simbolo sin texto                                    |
| `icon-square.svg` | Avatar, app icon, contextos cuadrados                |
| `favicon.svg`     | Favicon                                              |

**Reglas:**

- Zona de exclusión: mínimo 1/4 de la altura del logo en todos los lados
- Tamaño mínimo: 120px de ancho para versión completa
- No distorsionar ni rotar
- No aplicar sombras ni efectos
- No cambiar los colores del logo sin aprobacion
- No cerrar el hexagono ni alterar las lineas laterales

---

## 11. Tono visual global

| Modo                | Descripción                                                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Claro (default)** | Fondo blanco con secciones en gris corporativo suave. Verde petróleo para CTA. Espacios amplios. Profesional y limpio.            |
| **Oscuro**          | Fondo verde petróleo muy oscuro, superficies teal oscuras. Aqua claro para acentos. Mayor contraste. Aspecto premium tecnológico. |

### 11.1 Dirección visual pública 2026

Actualización corregida el 10 de junio de 2026 sobre la web pública:

- El hero mantiene composición a dos columnas, pero abandona el marco técnico experimental y explica con claridad la oferta: CRM, fidelización, analítica de clientes, automatización, BI e IA aplicada.
- La profundidad visual se resuelve con gradientes sobrios, grid técnico suave y un panel operativo comprensible; no se usan imágenes externas, vídeo, canvas ni WebGL.
- El header vuelve a una superficie clara en modo claro, con logo corporativo `logo.svg`, línea/acento teal, navegación legible, CTA principal y selector de idioma integrado. En modo oscuro conserva contraste y coherencia con tokens.
- El footer se mantiene oscuro por jerarquía corporativa, con logo `logo-white.svg`, columnas claras, contacto, legal, financiación y enlaces con underline animado.
- Las cards de pilares, servicios, casos y posts conservan microinteracciones ligeras en `transform/opacity`, sin ocultar información esencial en hover.
- La sección Socios & Clientes separa visualmente casos directos y colaboraciones con partners. Los logos oficiales siguen pendientes; hasta autorización se mantienen wordmarks tipográficos.
- El CTA final usa una banda corporativa de alto contraste con patrón suave y shimmer sutil en el botón.

Reglas de marca para esta dirección:

- No inventar logos, métricas ni claims.
- No depender de hover para mostrar información esencial.
- Mantener el color primario `#087F8C` como señal protagonista, acompañado por superficies claras/neutras accesibles y footer oscuro corporativo.
- Mantener light mode y dark mode con el mismo nivel de cuidado visual.

**Alternancia de secciones en Home (modo claro):**

```
Hero → blanco/verde petróleo
Propuesta de valor → blanco
Servicios → gris-50
Casos de éxito → aqua suave (brand-primary-subtle)
Social proof → blanco
About → gris-50
Blog → blanco
CTA final → verde petróleo primario (fondo oscuro de marca)
Footer → zinc-950 (siempre oscuro)
```

---

## 12. Ejemplos de aplicación

### Botón CTA principal

```
Fondo: brand-primary (#087F8C)
Texto: blanco
Hover: brand-primary-hover (#066A75) + sombra brand
Border radius: radius-lg (12px)
Padding: 12px 24px
Font: text-base, font-semibold
```

### Card de servicio

```
Fondo: surface-base (blanco)
Border: 1px solid neutral-200
Border radius: radius-xl (16px)
Shadow: shadow-sm → shadow-md en hover
Padding: space-6 (24px)
Transition: 200ms ease
```

### Hero heading

```
Color: neutral-950 (modo claro) / white (modo oscuro)
Size: text-5xl (desktop), text-3xl (mobile)
Weight: font-bold (700)
Line height: 1.15
```

---

## 13. Reglas para no degradar la marca

1. **Nunca** usar más de 3 colores de marca en una misma pantalla
2. **Nunca** reducir el contraste por debajo de 4.5:1 por motivos estéticos
3. **Nunca** usar tipografía decorativa o no aprobada
4. **Nunca** usar imágenes de stock evidentemente genéricas
5. **Nunca** abusar de elementos flotantes o gradientes complejos
6. **Nunca** mezclar estilos de botón (flat + neumorphism + glassmorphism juntos)
7. **Nunca** ignorar el dark mode — debe verse igual de bien
8. **Siempre** probar en móvil antes de dar un diseño por terminado

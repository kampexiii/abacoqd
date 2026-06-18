# Mockups — AbacoQD

Archivo de trabajo: `abacoqd-web.pen` (se edita con la extension Pencil de VSCode; no abrir con editores de texto).

Especificacion fuente: `docs/07_VISTAS/` (cada frame sigue su documento de vista). Identidad: `docs/04_IDENTIDAD_VISUAL_ABACOQD.md`.

## Estado de frames (plan para la reunion del martes 16, 12:00)

| # | Frame | Estado |
|---|---|---|
| 1 | Home — Desktop 1440 | Hecho (11 secciones, segun `01_HOME.md`) |
| 1b | Home — Mobile 390 | Hecho (version compacta) |
| 2 | Metodologia — desktop | Pendiente |
| 3 | Tipologias indice — desktop | Pendiente |
| 4 | Portafolio indice + proyecto detalle — desktop | Pendiente |
| 5 | Blog indice + post — desktop | Pendiente |
| 6 | Contacto + Reserva hora — desktop | Pendiente |
| 7 | Quienes somos — desktop | Pendiente |

## Convenciones del archivo

- **Variables**: paleta `qd-ink/qd-teal/qd-lime/qd-mist/qd-white` + derivados (`qd-teal-dark`, `text-dark-muted`, `text-light-muted`, `border-light`, `teal-tint`) y tipografias (`font-head`/`font-body` = Poppins, `font-mono` = JetBrains Mono). Cambiar una variable repinta todos los frames.
- **Componentes reutilizables** (frame "Componentes" arriba a la izquierda): logo abacoqd, boton primario lime, boton ghost, chip DEMO.
- **Regla de datos**: todo contenido no confirmado (partners, proyectos, reseñas, posts) lleva chip `DEMO` o placeholders neutros (`Partner 01`). No se maquetan clientes reales sin permiso.
- El hero replica la estructura del hero real protegido (header flotante + headline izquierda + cubo derecha + rails inferiores) revestido con la marca nueva; en codigo no se rediseña.
- Las piezas interactivas (toggler de tema, botones, barras de progreso, iconos animados) representan el estado visual de los componentes de animate-ui que se instalaran integros en fase 1 — ver `docs/07_VISTAS/25_CATALOGO_ANIMATE_UI.md`.

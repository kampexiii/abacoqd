# Capturas de la landing — mapeo de frames (Pencil)

Fuente de verdad visual: `mockups/abacoqd-web.pen`.

Exportar cada frame final a esta carpeta (`docs/assets/mockups/landing/`) con el nombre indicado. El export automatico de la MCP de Pencil falla por un bug de rutas en Windows (antepone el drive `c:` de forma invalida y produce `c:\c:` o `wrong .pen file`), asi que la exportacion se hace **manual desde Pencil** (seleccionar el frame → exportar PNG @2x) usando este mapeo.

## Frames modulares (por seccion, claro/oscuro)

| Archivo destino | Frame en Pencil | Node ID | Tamaño aprox |
|---|---|---|---|
| `hero-dark.png` | Hero - Dark | `PYRa7` | 1440×1040 |
| `hero-light.png` | Hero - Light | `jLOYq` | 1440×1040 |
| `metodologia-dark.png` | Metodología - Dark | `qXa4p` | 1440×920 |
| `metodologia-light.png` | Metodología - Light | `eamax` | 1440×920 |
| `servicios-dark.png` | Servicios - Dark | `JFqsz` | 1440×980 |
| `servicios-light.png` | Servicios - Light | `iPdCc` | 1440×980 |
| `colaboraciones-dark.png` | Colaboraciones - Dark | `l5THA` | 1440×680 |
| `colaboraciones-light.png` | Colaboraciones - Light | `nSiEs` | 1440×680 |
| `blog-dark.png` | Blog - Dark | `W4JHn` | 1440×760 |
| `blog-light.png` | Blog - Light | `iUMi8` | 1440×760 |
| `cta-final-dark.png` | CTA Final - Dark | `I8maz` | 1440×890 |
| `cta-final-light.png` | CTA Final - Light | `yeeqy` | 1440×890 |
| `footer-dark.png` | Footer - Dark | `V0al88` | 1440×480 |
| `footer-light.png` | Footer - Light | `WDSDJ` | 1440×480 |

> La seccion publica de logos/empresas se llama **Colaboraciones** en la UI. En la topbar el item de navegacion es **Proyectos** (no "Portafolios" ni "Colaboraciones"). El modelo interno usa `projects`/`partners`/`partner_project`.

Orden vertical en el canvas (columna izquierda = Dark `x:-2834`, columna derecha = Light `x:-1314`):
Hero → Metodología → Servicios → Colaboraciones → Blog → CTA Final → Footer.

## Frames unificados (landing completa, una sola pieza)

| Archivo destino | Frame en Pencil | Node ID | Tamaño |
|---|---|---|---|
| `landing-unificada-light-1440.png` | Landing_Unificada_Light_Desktop_1440 | `jMaTe` | 1440×5750 |
| `landing-unificada-dark-1440.png` | Landing_Unificada_Dark_Desktop_1440 | `t8dwG` | 1440×5750 |

Cada frame unificado monta la landing real completa en este orden: **Hero → Metodología → Servicios → Colaboraciones → Blog → CTA final → Footer**. Incluye la topbar final corregida (Metodología · Servicios · Proyectos · Quiénes somos · Blog · Contacto, sin botón Reservar), los widgets flotantes (accesibilidad izquierda / chatbot derecha) y el footer con el bloque institucional UE/FSE+ en la columna de marca. No incluye sección "Quiénes somos" (solo vive como item de topbar y como página independiente).

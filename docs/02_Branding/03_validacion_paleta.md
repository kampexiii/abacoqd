# Validacion de Paleta Corporativa - Abaco Developments

Fecha de validacion: 9 de junio de 2026.

Fuente revisada: `AbacoDevPAletaColores.jpeg`, disponible en la raiz del proyecto.

## Resultado ejecutivo

La paleta corporativa es suficientemente clara para eliminar el bloqueo `D3 - Colores corporativos reales`.

Motivo: el archivo de paleta contiene cinco swatches con valores HEX y RGB explicitamente rotulados. Por tanto, los colores anteriores documentados como propuesta visual quedan sustituidos por la paleta real.

## HEX y RGB definitivos

| Rol | Nombre recomendado | HEX | RGB | Uso principal |
|---|---|---|---|---|
| Primario | Verde petróleo Ábaco | `#087F8C` | 8, 127, 140 | CTA principales, enlaces, foco, elementos de marca. |
| Secundario | Teal Ábaco | `#088C8C` | 8, 140, 140 | Accents secundarios, iconos, badges, elementos de apoyo. |
| Apoyo claro | Aguamarina | `#7ABFBF` | 122, 191, 191 | Fondos suaves, chips, bordes fuertes, modo oscuro como acento. |
| Fondo tonal | Aqua suave | `#B0D9D9` | 176, 217, 217 | Fondos de sección, cards suaves, bordes de marca. |
| Neutro | Gris claro Ábaco | `#F2F2F2` | 242, 242, 242 | Fondo neutro, superficies elevadas, divisores suaves. |

## Comparacion con documentacion anterior

| Color anterior | Estado | Color real asociado | Diagnostico |
|---|---|---|---|
| `#1E40AF` / RGB 30, 64, 175 | Incorrecto | `#087F8C` | Era azul propuesto; no aparece en la paleta real. |
| `#1E3A8A` / RGB 30, 58, 138 | Incorrecto | `#066A75` derivado | Era hover azul; se sustituye por hover derivado del primario real. |
| `#3B82F6` / RGB 59, 130, 246 | Incorrecto | `#7ABFBF` | Era azul claro; no aparece en la paleta real. |
| `#EFF6FF` / RGB 239, 246, 255 | Incorrecto | `#B0D9D9` | Era fondo azul muy pálido; se sustituye por aqua suave real. |
| `#0D9488` / RGB 13, 148, 136 | Aproximado | `#088C8C` | Mismo territorio teal, pero no coincide con el valor real. |
| `#0F766E` / RGB 15, 118, 110 | Aproximado derivado | `#077878` derivado | Puede conservarse solo como idea de hover, ajustada al secundario real. |
| `#F0FDFA` / RGB 240, 253, 250 | Incorrecto | `#B0D9D9` / `#F2F2F2` | Fondo demasiado pálido y no corporativo. |
| `#D97706` / RGB 217, 119, 6 | Incorrecto | No aplica | El acento ámbar no existe en la paleta real. |
| `#B45309` / RGB 180, 83, 9 | Incorrecto | No aplica | Hover ámbar eliminado. |
| `#FFFBEB` / RGB 255, 251, 235 | Incorrecto | `#F2F2F2` | Fondo cálido eliminado. |
| `#F5F5F4` | Aproximado | `#F2F2F2` | Neutro cercano, sustituido por gris real. |

## Colores coincidentes

No habia coincidencias exactas entre los colores de marca propuestos previamente y la paleta real del archivo.

## Colores aproximados

- `#0D9488` era aproximado a `#088C8C`.
- `#F5F5F4` era aproximado a `#F2F2F2`.
- `#F0FDFA` estaba en el territorio aqua/teal, pero demasiado claro y no coincidente.

## Colores incorrectos

- Toda la familia azul anterior: `#1E40AF`, `#1E3A8A`, `#3B82F6`, `#EFF6FF`.
- Toda la familia ámbar anterior: `#D97706`, `#B45309`, `#FFFBEB`.

## Colores faltantes detectados

Antes de esta validacion faltaban:

- `#087F8C`
- `#088C8C`
- `#7ABFBF`
- `#B0D9D9`
- `#F2F2F2`

## Uso recomendado por modo

### Modo claro

| Rol | Color |
|---|---|
| Fondo base | `#FFFFFF` |
| Fondo alternativo | `#F2F2F2` |
| Fondo de marca suave | `#B0D9D9` |
| CTA primario | `#087F8C` |
| CTA hover | `#066A75` derivado |
| Texto principal | `#0F172A` funcional accesible |
| Enlace | `#087F8C` |
| Borde suave de marca | `#B0D9D9` |

### Modo oscuro

| Rol | Color |
|---|---|
| Fondo base | `#061B20` derivado del primario |
| Fondo elevado | `#082D33` derivado del primario |
| Overlay | `#083F46` derivado del primario |
| Texto principal | `#F2F2F2` |
| Texto secundario | `#B0D9D9` |
| Acento / enlace | `#B0D9D9` |
| Hover de enlace | `#F2F2F2` |

## Estados recomendados

Los estados funcionales no deben confundirse con la paleta corporativa. Se recomiendan estos colores por reconocimiento universal y accesibilidad:

| Estado | Modo claro | Modo oscuro | Nota |
|---|---|---|---|
| Success | `#16A34A` | `#22C55E` | Confirmaciones y acciones completadas. |
| Warning | `#CA8A04` | `#EAB308` | Avisos no bloqueantes. |
| Error | `#DC2626` | `#EF4444` | Errores de validacion y acciones destructivas. |
| Info | `#087F8C` | `#7ABFBF` | Alineado con la marca. |

## Decisiones documentales tomadas

- `docs/02_Branding/01_identidad_y_estilo.md` actualizado con la paleta real.
- `docs/02_Branding/02_design_system_tokens.md` actualizado con RGB tripletes definitivos.
- `docs/03_Arquitectura/03_decisiones_dependencias_entornos.md` actualizado: D3 pasa a cerrada.
- `docs/00-indice.md` actualizado para eliminar el bloqueo de colores y añadir este informe.

## Decision final sobre D3

`D3 - Colores corporativos reales` queda cerrado.

El bloqueo se elimina porque la fuente `AbacoDevPAletaColores.jpeg` aporta una paleta explicita con HEX y RGB definitivos. No es necesario mantener colores provisionales ni esperar validacion adicional para iniciar los tokens visuales de Fase 0.

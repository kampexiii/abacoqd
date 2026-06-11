# Assets de empresas

Esta carpeta separa claramente la marca propia del proyecto de los logos de empresas externas.

## Estructura

- `colaboraciones/originales/`: archivo oficial descargado sin alterar, preferiblemente desde media kit, press kit o web corporativa.
- `colaboraciones/optimizados/`: versión final para web del mismo logo, preferiblemente SVG y con nombre en `kebab-case`.
- `clientes-directos/originales/`: originales de empresas para las que Treecore Studio ejecutó el trabajo directamente.
- `clientes-directos/optimizados/`: versiones optimizadas para hero, landings y carruseles.

## Criterio de clasificación

- `colaboraciones`: proyectos ejecutados junto a otra empresa, consultora, partner o equipo externo.
- `clientes-directos`: trabajo contratado y ejecutado directamente por Treecore Studio.

## Normas de nombres

- Usar `kebab-case`.
- No usar espacios, tildes, mayúsculas ni sufijos sucios.
- Ejemplos válidos: `repsol.svg`, `moeve-dark.svg`, `control-cube.png`.
- Ejemplos inválidos: `Logo final.png`, `empresa-final-final.svg`, `captura 3.png`.

## Formatos y tamaños recomendados

- Priorizar `SVG` siempre que exista versión oficial.
- Si solo existe `PNG`, exportar una versión web ligera y recortada sin fondo innecesario.
- Mantener una altura visual homogénea en los logos del hero.
- No deformar proporciones; usar siempre integración con `object-contain`.

## Publicación y marca

- No usar hotlinks externos.
- Documentar la fuente en `logos-manifest.json`.
- Revisar derechos de uso, licencia y política de marca antes de publicar logos externos.
- No recolorear logos corporativos salvo que exista una variante monocroma permitida.

# Guia de logos y estructura de branding

Ultima revision: 11 de junio de 2026.

## Objetivo

Separar de forma profesional:

- marca propia de Abaco;
- originales internos;
- logos de empresas externas;
- versiones optimizadas para web.

## Estructura actual

### Marca propia publica

- `public/assets/branding/marca/logos/`
- `public/assets/branding/marca/simbolos/`

### Originales internos de marca

- `branding/marca/originales/logos/`
- `branding/marca/originales/iconos/`

### Empresas externas

- `public/assets/branding/empresas/colaboraciones/originales/`
- `public/assets/branding/empresas/colaboraciones/optimizados/`
- `public/assets/branding/empresas/clientes-directos/originales/`
- `public/assets/branding/empresas/clientes-directos/optimizados/`

## Regla principal

No mezclar nunca:

- logos corporativos de Abaco;
- logos de empresas colaboradoras;
- logos de clientes directos;
- originales descargados;
- versiones optimizadas para web.

## Convenciones de nombres

- usar `kebab-case`;
- evitar espacios, tildes, mayusculas y sufijos sucios;
- preferir nombres cortos y semanticos.

Ejemplos validos:

- `abaco.svg`
- `abaco-white.svg`
- `iberia.svg`
- `leroy-merlin.svg`
- `cognodata.svg`

Ejemplos invalidos:

- `logo final.png`
- `empresa-final-final.svg`
- `captura.png`

## Formatos recomendados

- preferir `SVG` siempre que exista;
- usar `PNG` o `WebP` solo si no hay SVG oficial viable;
- guardar el archivo original en `originales/`;
- guardar la version final para web en `optimizados/`.

## Fuentes y derechos

- no usar hotlinks externos;
- priorizar media kit, brand kit, press kit o web corporativa oficial;
- si se usa una fuente no oficial, dejarlo indicado y revisar derechos antes de publicar;
- documentar siempre la procedencia en `public/assets/branding/empresas/logos-manifest.json`.

## Estado actual del hero

Los carruseles del hero ya estan preparados visualmente, pero la fuente de datos sigue siendo temporal:

- `resources/js/data/company-logos.ts`

Los logos reales se iran incorporando a las carpetas de empresas y, mas adelante, se cargaran desde base de datos o API.

## Relacion futura con base de datos

- los logos seguiran almacenados fisicamente en `public/assets/branding/empresas/...`;
- la base de datos guardara rutas relativas a archivos optimizados;
- `logos-manifest.json` es hoy un registro auxiliar;
- cuando exista panel admin, ese manifiesto podra mantenerse como referencia o quedar sustituido por registros persistidos.

## Accesibilidad y variantes

Cada empresa deberia poder disponer de:

- logo claro;
- logo oscuro si aplica;
- texto alternativo accesible;
- estado activo/inactivo;
- orden de aparicion.

## Regla editorial

No publicar logos externos sin comprobar:

- fuente;
- permiso o uso razonable;
- calidad del archivo;
- contraste en claro/oscuro;
- consistencia con la clasificacion `colaboraciones` o `clientes-directos`.

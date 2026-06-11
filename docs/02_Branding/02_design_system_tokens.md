# Design System — Estado real de tokens y estilos

Ultima revision: 11 de junio de 2026.

## Estado actual real

El proyecto no tiene todavia un design system separado en varios archivos tecnicos. La implementacion visual actual vive principalmente en:

- `resources/css/app.css`

Ese archivo concentra hoy:

- estilos base de la landing;
- hero;
- header flotante;
- carruseles visuales de logos;
- comportamiento de claro/oscuro;
- ajustes responsive especificos de la portada actual.

## Paleta base activa

Los colores corporativos vigentes son:

- `#087F8C`
- `#088C8C`
- `#7ABFBF`
- `#B0D9D9`
- `#F2F2F2`

Los neutros funcionales de texto y contraste pueden ampliarse segun necesidad tecnica, pero la paleta de marca parte de esos valores.

## Activos visuales relacionados

### Marca propia

- `public/assets/branding/marca/logos/`
- `public/assets/branding/marca/simbolos/`

### Empresas externas

- `public/assets/branding/empresas/colaboraciones/`
- `public/assets/branding/empresas/clientes-directos/`

## Tokens y capas actuales

### Lo que si existe

- clases de Tailwind y CSS propio conviviendo en el mismo proyecto;
- soporte visual para modo claro y oscuro;
- naming consistente en componentes del hero;
- estructura de assets preparada para crecer.

### Lo que no existe todavia

- `resources/css/tokens.css`;
- `resources/css/theme.css`;
- espejo formal de tokens en `resources/js/lib/tokens.ts`;
- libreria completa de componentes de producto;
- sistema de tokens conectado a datos de negocio.

## Decision documental

Hasta que el proyecto entre en una fase mas amplia de producto, `resources/css/app.css` se considera la fuente de verdad tecnica del estilo implementado.

## Evolucion prevista

La extraccion de tokens forma parte de la FASE 1 del roadmap maestro (arquitectura frontend y base visual):

1. `tokens.css` para variables de color, espaciado y radios (prefijo `--abaco-color-*` segun D13, formato RGB triplete segun D2);
2. `theme.css` para estilos base globales si el volumen lo justifica;
3. `tokens.ts` si algun comportamiento dinamico necesita espejo en TypeScript.

Hasta que la FASE 1 se ejecute, `resources/css/app.css` sigue siendo la fuente de verdad tecnica del estilo implementado.

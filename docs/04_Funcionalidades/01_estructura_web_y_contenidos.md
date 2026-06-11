# Estructura web y contenidos — estado real y siguiente evolucion

Ultima revision: 11 de junio de 2026.

## Estado actual real

La web publica todavia no esta completa. Solo existe una primera base de landing con hero.

### Hecho hoy

- pagina publica inicial;
- hero principal;
- header flotante;
- branding reorganizado;
- carruseles visuales de logos preparados;
- dataset temporal estatico para empresas.

### No hecho todavia

- seccion publica de portafolio;
- servicios reales;
- sobre nosotros;
- contacto funcional;
- panel admin;
- contenido administrable;
- blog;
- FAQ;
- reservas;
- SEO tecnico completo;
- analitica;
- automatizaciones.

## Ruta publica actual

### Implementada

- `/` — landing inicial con hero y bloques temporales de continuidad visual. La pagina real es `resources/js/pages/Public/Home.tsx` (definida en `routes/web.php`), que monta el hero premium. Esta home esta implementada y protegida: no debe rehacerse ni eliminarse.
- `resources/js/pages/welcome.tsx` NO es la home: es un resto del starter sin ruta que lo use. Cualquier referencia a `welcome` debe tratarse como posible resto del starter, nunca como la landing principal.

### Disponible por scaffold tecnico, pero fuera del alcance funcional actual

- rutas de autenticacion del starter kit;
- layouts internos del starter kit.

No deben interpretarse como modulos del producto ya construidos.

## Hero actual

### Componentes principales

- `AbacoHero.tsx`
- `FloatingHeader.tsx`
- `HeroBrandRails.tsx`
- `LogoCarousel.tsx`
- `company-logos.ts`

### Estado

- el hero ya tiene una capa visual reutilizable;
- los carruseles ya distinguen visualmente entre colaboraciones y clientes directos;
- la fuente de datos sigue siendo temporal y estatica;
- mas adelante estos carruseles deberan alimentarse desde base de datos o API, sin rehacer la capa visual.

## Mapa futuro del sitio

Lo siguiente no esta implementado todavia. Es la estructura objetivo por fases:

### FASE 5 del roadmap maestro — estructura publica prevista

- `/` — landing/portada
- seccion publica de portafolio alimentada por `projects`; el naming final de ruta se cerrara en esa misma fase (D1)
- `/servicios/`
- `/sobre-nosotros/`
- `/contacto/`
- paginas legales

### FASE 7 del roadmap maestro — administracion prevista

- admin de empresas colaboradoras;
- admin de proyectos;
- gestion de visibilidad del hero;
- gestion de visibilidad del portafolio;
- gestion de logos e imagenes.

## Relacion futura entre contenidos y datos

### Empresas colaboradoras

Se gestionaran desde un CRUD propio y podran:

- aparecer en el carrusel correspondiente del hero;
- vincularse a proyectos en colaboracion.

### Proyectos

Se gestionaran desde un CRUD propio y podran:

- alimentar la seccion de portafolio;
- aparecer en el hero si se validan como destacados;
- relacionarse con una empresa colaboradora cuando el proyecto sea de colaboracion.

## Regla documental

Este documento no debe volver a describir como implementadas secciones que aun no existen en codigo. Mientras no haya base de datos y panel admin, cualquier modulo adicional debe marcarse como:

- pendiente;
- previsto;
- fase futura;
- propuesta.

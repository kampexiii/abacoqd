# Arquitectura Tecnica — Abaco Developments

Ultima revision: 11 de junio de 2026.

## Estado real de la arquitectura

El proyecto sigue en una fase base y visual:

- proyecto Laravel + React + Vite creado;
- landing publica inicial;
- hero inicial;
- branding y assets reorganizados;
- carruseles visuales del hero con dataset temporal estatico.

No existe todavia arquitectura de negocio completa. En particular, aun no existen:

- base de datos de negocio;
- migraciones de entidades de negocio;
- panel admin;
- CRUDs;
- portafolio publico real alimentado por datos;
- API interna para el frontend publico.

## Stack real actual

| Capa | Tecnologia |
|---|---|
| Backend base | Laravel |
| Frontend | React |
| Tipado | TypeScript |
| Transporte | Inertia |
| Estilos | Tailwind CSS + CSS propio |
| Bundler | Vite |
| Auth scaffold | Starter kit de Laravel, fuera del alcance funcional actual |

## Implementado hoy

### Frontend publico

- [resources/js/pages/Public/Home.tsx](../../resources/js/pages/Public/Home.tsx)
- [resources/js/components/AbacoHero.tsx](../../resources/js/components/AbacoHero.tsx)
- [resources/js/components/FloatingHeader.tsx](../../resources/js/components/FloatingHeader.tsx)
- [resources/js/components/HeroBrandRails.tsx](../../resources/js/components/HeroBrandRails.tsx)
- [resources/js/components/LogoCarousel.tsx](../../resources/js/components/LogoCarousel.tsx)
- [resources/js/components/AbacoCrystalCube.tsx](../../resources/js/components/AbacoCrystalCube.tsx) (cubo 3D del hero con Three.js, decision D9A)
- [resources/js/components/HeroParticleField.tsx](../../resources/js/components/HeroParticleField.tsx)
- [resources/js/data/company-logos.ts](../../resources/js/data/company-logos.ts)

### Assets y branding

- `public/assets/branding/marca/...` para assets publicos de la marca propia;
- `branding/marca/originales/...` para originales internos de la marca;
- `public/assets/branding/empresas/...` para logos de empresas externas.

## Cierre de naming para Fase 1

La arquitectura de datos queda cerrada con estas entidades base:

- `CollaboratorCompany` -> `collaborator_companies`
- `Project` -> `projects`

El futuro portafolio publico se alimentara desde `projects`.
Si mas adelante se quiere presentar cada proyecto como caso de exito, eso sera una decision de capa publica, no un cambio de entidad base.

## Principios de arquitectura vigentes

### 1. Arquitectura frontend y configuracion antes que datos; datos antes que panel admin

El orden maestro lo fija `docs/05_Planificacion/01_roadmap.md`: limpieza y gobierno (FASE 0), arquitectura frontend y tokens (FASE 1), configuracion centralizada (FASE 2), multilenguaje (FASE 3) y solo despues base de datos (FASE 4).

Se mantiene la regla original: la base de datos llega antes que el panel admin (FASE 7) y antes que cualquier CRUD. Cuando arranque la FASE 4, empieza por:

- tablas;
- relaciones;
- reglas de visibilidad;
- orden de migraciones.

No por pantallas, CRUDs ni secciones publicas nuevas.

### 2. Mantener separada la capa visual de la fuente de datos

Los componentes visuales del hero deben sobrevivir al cambio de origen de datos:

- hoy: `company-logos.ts`
- despues: base de datos/API

### 3. Diferenciar colaboraciones y trabajos directos

La arquitectura de datos queda pensada asi:

- colaboraciones -> `collaborator_companies`
- trabajos directos/publicables -> `projects`

Los proyectos individuales podran almacenar sus propios campos `client_*` para mostrar identidad publica sin crear todavia una tercera tabla de clientes directos.

### 4. Crear estructura vacia despues de datos

Tras cerrar migraciones y modelos base, la siguiente evolucion sera dejar preparado el esqueleto de:

- modulos publicos;
- modulos admin;
- rutas;
- carpetas;
- componentes reutilizables.

## Arquitectura objetivo por fases (numeracion del roadmap maestro)

### FASE 1-2 — Arquitectura frontend y configuracion centralizada

- layout publico, footer, sistema de secciones y tokens;
- capa de configuracion tipada (empresa, navegacion, CTAs, SEO base);
- cero datos hardcodeados en componentes publicos.

### FASE 3 — Multilenguaje

- `lang/` con `es` (fallback) y `en`;
- hook propio `useLanguage` sin dependencia externa.

### FASE 4 — Datos

- `collaborator_companies`
- `projects`
- `project_images`
- `project_technologies`

### FASE 5 — Consumo publico real

- portafolio alimentado por proyectos publicados;
- hero alimentado por datos reales.

### FASE 7 — Administracion

- CRUD de empresas colaboradoras;
- CRUD de proyectos;
- control de visibilidad en hero y portafolio.

## Modulos futuros previstos

No estan implementados todavia:

- `CollaboratorCompany`
- `Project`
- `ProjectImage`
- `ProjectTechnology`
- panel admin
- portafolio publico
- leads
- reservas
- SEO editable
- analitica
- automatizaciones

## Nota sobre el starter kit

El starter kit incluye autenticacion y layouts internos, pero no debe confundirse con modulos del producto. Solo es base tecnica disponible para fases posteriores.

Aclaracion importante: la home real del proyecto es `resources/js/pages/Public/Home.tsx`, renderizada por la ruta `/` en `routes/web.php`, y esta implementada con el hero premium. `resources/js/pages/welcome.tsx` es un resto del starter sin ruta asociada (su unica mencion es un `case` inerte en el resolver de layouts de `app.tsx`); su eliminacion se gestiona en la FASE 0 del roadmap, previa confirmacion de cero referencias, sin tocar la home ni el hero.

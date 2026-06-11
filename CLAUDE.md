# CLAUDE.md — Abaco Developments Web

Reglas minimas de proyecto. La fuente de verdad es `/docs`; si algo contradice este archivo, prevalece la documentacion activa.

## Lectura obligatoria antes de tocar nada

1. `docs/05_Planificacion/01_roadmap.md` — roadmap maestro, fase activa y numeracion vigente.
2. `docs/00-indice.md` — estructura documental.
3. `docs/AGENTES.md` — responsabilidades y limites por agente.
4. `docs/POLITICA_LIMPIEZA.md` — que se elimina y como.

## Zona protegida (no tocar sin tarea aprobada en el roadmap)

La home real es `resources/js/pages/Public/Home.tsx`, renderizada por la ruta `/` (`routes/web.php`), con el hero premium implementado. Quedan protegidos: `Public/Home.tsx`, `AbacoHero.tsx`, `AbacoCrystalCube.tsx`, `FloatingHeader.tsx`, `HeroBrandRails.tsx`, `HeroParticleField.tsx`, `LogoCarousel.tsx`, los estilos del hero en `resources/css/app.css` y los assets de `public/assets/branding/`. No se rehacen, no se renombran y no se eliminan en tareas de limpieza. Cualquier referencia a `welcome` es resto del starter, no la landing.

## Reglas duras

- Ninguna dependencia nueva sin Guardian de Arquitectura (`docs/03_Arquitectura/03_decisiones_dependencias_entornos.md`).
- Nada de carpetas `old/backup/legacy/archive` ni archivos `*_old`, `*_backup`, `*_legacy`, `*_final`, `*_v2`. Git es el historico.
- No hardcodear textos, colores ni datos de empresa en componentes publicos (config centralizada + i18n segun roadmap).
- Naming cerrado: `Project`/`projects`, `CollaboratorCompany`/`collaborator_companies` (D1). Wayfinder, no `ziggy-js`.
- No modificar migraciones ya ejecutadas; solo añadir nuevas.
- No documentar como hecho lo que no existe en codigo.

## Validacion minima antes de cerrar cualquier tarea

`npm run lint:check`, `npm run types:check`, `npm run build`, `composer test`. Cierre documental segun la regla permanente del roadmap.

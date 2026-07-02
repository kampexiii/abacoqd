# Guía interna del proyecto — AbacoQD

Referencia interna breve. La fuente de verdad activa está en `/docs` y comienza en `docs/01_BRIEF_ALCANCE.md`.

## Fuente de verdad

AbacoQD / Ábaco Quick Developments es el nombre documental del proyecto.

Marca por capas (regla vigente, no sustituir en bloque):

- **AbacoQD** = marca visible del producto: pestaña del navegador, `title`/`description` de SEO principal, logo, menú móvil, CTA y experiencia pública. El `title` del home empieza por `AbacoQD`.
- **Abaco Developments** = contexto corporativo, origen e histórico; se mantiene en textos donde ya está bien (footer, prosa corporativa) y puede aparecer de forma secundaria en la meta description.
- **ABACO DIGITAL DEVELOPMENTS, S.L.** = razón social; solo en legales, privacidad, cookies, facturación o datos jurídicos.

No hacer sustitución global `Abaco Developments`→`AbacoQD`. Dominio canónico final: `https://abacoqd.com/`. `https://abacodev.com/` se conserva como dominio histórico y `https://www.abacodev.com/` como URL legal histórica.

Nota SEO: el `title`/`description` reales del home los sirve la BD (`seo_metadata`, `page_key=home`), no solo `config/site.php`; en producción hay que actualizar ese registro (updateOrCreate idempotente), no basta con el fallback de config.

AbacoQD es una iniciativa documental de Ábaco Developments especializada en desarrollos rápidos y a medida, con procesos y herramientas internas propios.

Si un documento anterior contradice `docs/01_BRIEF_ALCANCE.md`, prevalece el brief.

## Lectura recomendada antes de cambios estructurales

1. `docs/00_INDICE.md`
2. `docs/01_BRIEF_ALCANCE.md`
3. `docs/02_MODELO_DATOS.md`
4. `docs/05_ARQUITECTURA_ADMIN.md`
5. `docs/06_BACKLOG_IMPLEMENTACION.md`

## Zona protegida

La home real es `resources/js/pages/Public/Home.tsx`, renderizada por `/`.

El hero actual queda protegido:

- `AbacoHero.tsx`
- `AbacoCrystalCube.tsx`
- `FloatingHeader.tsx`
- `HeroParticleField.tsx`
- estilos asociados del hero;
- assets de marca existentes.

No se elimina ni se reestructura sin validación previa de alcance.

## Reglas duras

- No tocar código durante fases documentales.
- No inventar clientes, proyectos, reseñas, métricas ni precios.
- No documentar como hecho lo que no existe en código.
- No dejar documentación antigua como fuente activa si contradice el brief vigente.
- No crear modelos duplicados si `Partner` resuelve el caso.
- `services` es Servicios; no crear entidad paralela para clasificar servicios.
- Naming público final: el topbar y la página pública se llaman `Proyectos`; la sección de landing con logos/empresas/trabajos se llama `Colaboraciones`; el modelo interno es `projects`, `partners`, `partner_project`. No usar `Portafolios` como término público activo.
- Proyectos es vista publica activa (seccion de landing: Colaboraciones) y se alimenta de `projects`, `partners` y `partner_project`.
- Quiénes somos es vista pública activa y aparece en topbar; no es sección de la landing.
- No crear migraciones antes de cerrar fase de modelo.
- No instalar dependencias sin decisión documentada.
- CRM/fidelización puede ser servicio o antecedente, no eje principal.
- `swiper` es dependencia de proyecto exclusiva de `MethodologyProcessCube` (`effect: "cube"`); no se generaliza a otros carruseles ni secciones.

## Modelo activo

El modelo conceptual activo esta en `docs/02_MODELO_DATOS.md`.

Decisiones principales: `Partner` sustituye `CollaboratorCompany` como entidad unificada para colaboradores, socios, clientes, marcas y empresas; `services` sustituye cualquier concepto paralelo de servicios; la pagina publica `Proyectos` y la seccion de landing `Colaboraciones` usan `projects` + `partners` (sin tabla `portfolios` ni `companies`).

## Validación mínima antes de cerrar fase con código

- `npm run lint:check`
- `npm run types:check`
- `npm run build`
- `composer test`

En fases documentales, validar con búsquedas de contradicciones y revisión del índice.

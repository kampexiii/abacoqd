# CLAUDE.md — AbacoQD

Reglas minimas del proyecto. La fuente de verdad activa esta en `/docs` y empieza por `docs/01_BRIEF_ALCANCE.md`.

## Fuente de verdad

AbacoQD / Ábaco Quick Developments es el nombre documental del proyecto.

La marca pública visible del sitio es Abaco Developments. La razón social ABACO DIGITAL DEVELOPMENTS, S.L. se reserva para textos legales. Dominio canónico final: `https://abacoqd.com/`. `https://abacodev.com/` queda como dominio histórico/investigado y `https://www.abacodev.com/` como URL legal histórica; la redirección/convivencia está pendiente de confirmar.

AbacoQD es una iniciativa documental de Ábaco Developments especializada en desarrollos rapidos y a medida, potenciados por IA, herramientas internas propias y procesos optimizados.

Si un documento anterior contradice `docs/01_BRIEF_ALCANCE.md`, prevalece el brief.

## Lectura obligatoria antes de tocar archivos

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

No se borra, no se rehace y no se reestructura sin fase aprobada.

## Reglas duras

- No tocar codigo durante fases documentales.
- No inventar clientes, proyectos, reseñas, metricas ni precios.
- El pago esta pendiente de definir.
- No documentar como hecho lo que no existe en codigo.
- No dejar documentacion antigua como fuente activa si contradice el brief vigente.
- No crear modelos duplicados si `Partner` resuelve el caso.
- `services` es Servicios; no crear entidad paralela para clasificar servicios.
- Naming publico final: el topbar y la pagina publica se llaman `Proyectos`; la seccion de landing con logos/empresas/trabajos se llama `Colaboraciones`; el modelo interno es `projects`, `partners`, `partner_project`. No usar `Portafolios` como termino publico activo.
- Proyectos es vista publica activa (seccion de landing: Colaboraciones) y se alimenta de `projects`, `partners` y `partner_project`.
- Quienes somos es vista publica activa y aparece en topbar; no es seccion de la landing.
- No crear migraciones antes de cerrar fase de modelo.
- No instalar dependencias sin decision documentada.
- CRM/fidelizacion puede ser servicio o antecedente, no eje principal.
- `swiper` es dependencia de proyecto exclusiva de `MethodologyProcessCube` (`effect: "cube"`); no se generaliza a otros carruseles ni secciones.

## Modelo activo

El modelo conceptual activo esta en `docs/02_MODELO_DATOS.md`.

Decisiones principales: `Partner` sustituye `CollaboratorCompany` como entidad unificada para colaboradores, socios, clientes, marcas y empresas; `services` sustituye cualquier concepto paralelo de servicios; la pagina publica `Proyectos` y la seccion de landing `Colaboraciones` usan `projects` + `partners` (sin tabla `portfolios` ni `companies`).

## Validacion minima antes de cerrar fase con codigo

- `npm run lint:check`
- `npm run types:check`
- `npm run build`
- `composer test`

En fases solo documentales, validar con busqueda de contradicciones y revision del indice.

# Documentacion - Abaco Developments Web

Ultima revision: 11 de junio de 2026.

## Estado real del proyecto

El proyecto esta en fase inicial. A dia de hoy solo se considera realizado:

- creacion base del proyecto;
- landing inicial;
- hero inicial;
- reorganizacion de branding y assets;
- estructura visual del hero preparada para carruseles de logos;
- fuente de datos temporal en `resources/js/data/company-logos.ts`;
- carpetas de logos de empresas con `originales/`, `optimizados/`, `README.md` y `logos-manifest.json`.

Todo lo demas debe leerse como propuesta, fase futura o especificacion previa, no como funcionalidad implementada.

## Lectura recomendada

1. [05_Planificacion/01_roadmap.md](05_Planificacion/01_roadmap.md)
2. [03_Arquitectura/01_arquitectura_tecnica.md](03_Arquitectura/01_arquitectura_tecnica.md)
3. [03_Arquitectura/02_modelo_datos.md](03_Arquitectura/02_modelo_datos.md)
4. [04_Funcionalidades/01_estructura_web_y_contenidos.md](04_Funcionalidades/01_estructura_web_y_contenidos.md)
5. [02_Branding/04_logo_guidelines.md](02_Branding/04_logo_guidelines.md)
6. [AGENTES.md](AGENTES.md)

## Gobernanza

| Documento | Proposito | Estado |
|---|---|---|
| [../CLAUDE.md](../CLAUDE.md) | Reglas minimas de proyecto en la raiz: remite a `/docs`, protege la home/hero y fija validacion minima. | Activo (creado en FASE 0, 11/06/2026) |
| [AGENTES.md](AGENTES.md) | Reglas de colaboracion, validacion y disciplina documental. | Activo |
| [POLITICA_LIMPIEZA.md](POLITICA_LIMPIEZA.md) | Evitar duplicados, historicos activos y basura documental. | Activo |

## 01_Investigacion

Documentos de contexto de negocio, marca y posicionamiento. Siguen siendo utiles como base estrategica, pero no describen el estado tecnico implementado.

| Documento | Proposito |
|---|---|
| [01_empresa_servicios_mercado.md](01_Investigacion/01_empresa_servicios_mercado.md) | Historia, servicios, mercado, clientes y senales publicas de la empresa. |
| [02_marca_contenidos_reputacion.md](01_Investigacion/02_marca_contenidos_reputacion.md) | Tono, reputacion, narrativa y posicionamiento de marca. |
| [03_web_seo_captacion.md](01_Investigacion/03_web_seo_captacion.md) | Auditoria de la web anterior y oportunidades SEO/comerciales. |
| [04_recomendaciones_estrategicas.md](01_Investigacion/04_recomendaciones_estrategicas.md) | Recomendaciones priorizadas de negocio y comunicacion. |

## 02_Branding

| Documento | Proposito | Estado |
|---|---|---|
| [01_identidad_y_estilo.md](02_Branding/01_identidad_y_estilo.md) | Direccion visual y verbal de marca. | Base activa |
| [02_design_system_tokens.md](02_Branding/02_design_system_tokens.md) | Estado real de tokens, estilos y evolucion prevista del sistema visual. | Actualizado |
| [03_validacion_paleta.md](02_Branding/03_validacion_paleta.md) | Validacion de la paleta corporativa. | Base activa |
| [04_logo_guidelines.md](02_Branding/04_logo_guidelines.md) | Estructura actual de logos y reglas de uso de marca propia y logos de empresas. | Actualizado |
| [05_referencias_ui_premium.md](02_Branding/05_referencias_ui_premium.md) | Referencias visuales y su estado real de aplicacion. | Actualizado |

## 03_Arquitectura

| Documento | Proposito | Estado |
|---|---|---|
| [01_arquitectura_tecnica.md](03_Arquitectura/01_arquitectura_tecnica.md) | Stack real actual, arquitectura vigente y siguiente direccion tecnica. | Actualizado |
| [02_modelo_datos.md](03_Arquitectura/02_modelo_datos.md) | Propuesta de base de datos para la siguiente fase. | Actualizado |
| [03_decisiones_dependencias_entornos.md](03_Arquitectura/03_decisiones_dependencias_entornos.md) | Registro de decisiones tecnicas y dependencias. | Activo |
| [04_seguridad_roles_permisos.md](03_Arquitectura/04_seguridad_roles_permisos.md) | Marco de seguridad y permisos para fases futuras. | Propuesta futura |

## 04_Funcionalidades

Los documentos de esta carpeta deben leerse como especificaciones funcionales futuras salvo indicacion explicita de estado actual.

| Documento | Proposito | Estado |
|---|---|---|
| [01_estructura_web_y_contenidos.md](04_Funcionalidades/01_estructura_web_y_contenidos.md) | Estado real de la landing actual y mapa futuro de secciones. | Actualizado |
| [02_reservas_correo_leads.md](04_Funcionalidades/02_reservas_correo_leads.md) | Especificacion futura de reservas y leads. | Fase futura |
| [03_editor_media_i18n.md](04_Funcionalidades/03_editor_media_i18n.md) | Propuesta futura de editor, media e i18n. | Actualizado |
| [04_analitica_seo_accesibilidad.md](04_Funcionalidades/04_analitica_seo_accesibilidad.md) | Especificacion futura de analitica, SEO y accesibilidad. | Fase futura |
| [05_automatizaciones.md](04_Funcionalidades/05_automatizaciones.md) | Propuesta futura de automatizaciones operativas. | Fase futura |

## 05_Planificacion

| Documento | Proposito | Estado |
|---|---|---|
| [01_roadmap.md](05_Planificacion/01_roadmap.md) | Hoja de ruta real por fases desde el estado actual del proyecto. | Actualizado |
| [02_convenciones.md](05_Planificacion/02_convenciones.md) | Convenciones de codigo, nombres y commits. | Activo |

## Criterio documental actual

- No se documenta como hecho nada que no exista ya en codigo o assets.
- Lo previsto para base de datos, panel admin, CRUDs, portfolio, SEO, analitica o automatizaciones debe aparecer como fase futura.
- La siguiente prioridad tecnica del proyecto es la FASE 0 del roadmap vigente (limpieza, git real y gobierno tecnico), seguida de la arquitectura frontend. La base de datos se aborda en la FASE 4 del roadmap.

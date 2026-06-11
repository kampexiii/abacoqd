# Modelo de Datos — Fase 1 cerrada

Ultima revision: 11 de junio de 2026.

## Estado actual

Todavia no existe base de datos de negocio del proyecto.

La implementacion actual del hero usa una fuente temporal estatica:

- `resources/js/data/company-logos.ts`

Esa fuente de datos es solo una solucion inicial visual. La capa visual de carruseles debe mantenerse, pero la fuente de datos cambiara a base de datos o API.

## Decisiones cerradas para arrancar migraciones

### Entidad 1

- modelo: `CollaboratorCompany`
- tabla: `collaborator_companies`

### Entidad 2

- modelo: `Project`
- tabla: `projects`

### Tablas auxiliares iniciales

- `project_images`
- `project_technologies`

## Criterio de naming

- `projects` es la entidad base de negocio.
- El futuro portafolio publico se alimentara desde `projects`.
- `CaseStudy` deja de ser el nombre troncal del modelo de datos.
- Si mas adelante se quiere una narrativa publica tipo caso de exito, sera una capa de presentacion sobre `projects`, no otra entidad principal distinta.

## Tabla final — `collaborator_companies`

Tabla para empresas colaboradoras externas con las que Abaco trabaja en proyectos conjuntos y que pueden aparecer en el carrusel de colaboraciones del hero.

```sql
id                      BIGINT UNSIGNED PRIMARY KEY
name                    VARCHAR(255) NOT NULL
slug                    VARCHAR(255) UNIQUE NOT NULL
description             TEXT NULL
website_url             VARCHAR(500) NULL
logo_light_path         VARCHAR(500) NULL
logo_dark_path          VARCHAR(500) NULL
logo_original_path      VARCHAR(500) NULL
logo_alt                VARCHAR(255) NULL
brand_color             VARCHAR(20) NULL
is_active               BOOLEAN NOT NULL DEFAULT TRUE
show_in_hero_carousel   BOOLEAN NOT NULL DEFAULT FALSE
sort_order              INT UNSIGNED NOT NULL DEFAULT 0
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

### Notas

- No se incluye un campo `type` porque la propia tabla ya representa exclusivamente empresas colaboradoras.
- No se incluye `show_in_portfolio` porque el portafolio lo gobiernan los proyectos, no las empresas.
- La eliminacion futura debe ser restringida si la empresa ya esta asociada a proyectos.

## Tabla final — `projects`

Tabla base para trabajos realizados por Abaco, tanto en solitario como en colaboracion.

```sql
id                       BIGINT UNSIGNED PRIMARY KEY
title                    VARCHAR(255) NOT NULL
slug                     VARCHAR(255) UNIQUE NOT NULL
summary                  TEXT NULL
description              LONGTEXT NULL
project_type             VARCHAR(30) NOT NULL
collaborator_company_id  BIGINT UNSIGNED NULL
client_name              VARCHAR(255) NULL
client_website_url       VARCHAR(500) NULL
client_logo_light_path   VARCHAR(500) NULL
client_logo_dark_path    VARCHAR(500) NULL
client_logo_alt          VARCHAR(255) NULL
cover_image_path         VARCHAR(500) NULL
thumbnail_image_path     VARCHAR(500) NULL
project_url              VARCHAR(500) NULL
repository_url           VARCHAR(500) NULL
started_at               DATE NULL
finished_at              DATE NULL
status                   VARCHAR(30) NOT NULL DEFAULT 'draft'
show_in_portfolio        BOOLEAN NOT NULL DEFAULT FALSE
show_in_hero_carousel    BOOLEAN NOT NULL DEFAULT FALSE
sort_order               INT UNSIGNED NOT NULL DEFAULT 0
seo_title                VARCHAR(255) NULL
seo_description          VARCHAR(500) NULL
created_at               TIMESTAMP
updated_at               TIMESTAMP
```

### Notas

- `client_*` existe para cubrir trabajos realizados por Abaco en solitario sin necesitar una tercera entidad de empresas cliente.
- Si en el futuro se detecta necesidad real de gestionar clientes directos como entidad independiente, se podra introducir una tabla nueva, pero no es necesaria para arrancar Fase 1.
- `status` cubre el ciclo editorial minimo: `draft`, `published`, `archived`.

## Tabla auxiliar — `project_images`

```sql
id              BIGINT UNSIGNED PRIMARY KEY
project_id      BIGINT UNSIGNED NOT NULL
image_path      VARCHAR(500) NOT NULL
alt_text        VARCHAR(255) NULL
sort_order      INT UNSIGNED NOT NULL DEFAULT 0
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## Tabla auxiliar — `project_technologies`

```sql
id              BIGINT UNSIGNED PRIMARY KEY
project_id      BIGINT UNSIGNED NOT NULL
name            VARCHAR(100) NOT NULL
sort_order      INT UNSIGNED NOT NULL DEFAULT 0
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## Reglas finales de `project_type`

Valores cerrados:

- `individual`
- `collaboration`

### Regla 1

Si `project_type = collaboration`, `collaborator_company_id` es obligatorio.

### Regla 2

Si `project_type = individual`, `collaborator_company_id` debe ser `NULL`.

### Regla 3

Si un proyecto `individual` va a mostrarse en el hero, debe tener preparada identidad visual publica suficiente:

- `client_name`
- `client_logo_light_path`
- `client_logo_alt`

### Regla 4

Si un proyecto va a mostrarse en el portafolio, debe cumplir:

- `status = published`
- `show_in_portfolio = true`

### Regla 5

Si un proyecto va a mostrarse en el hero, debe cumplir:

- `status = published`
- `show_in_hero_carousel = true`

## Relaciones finales

- una `collaborator_company` puede tener muchos `projects`;
- un `project` puede pertenecer a cero o una `collaborator_company`;
- un `project` puede tener muchas `project_images`;
- un `project` puede tener muchas `project_technologies`.

## Relacion entre empresas, proyectos, hero y portafolio

### Carrusel 1 del hero — colaboraciones

Se alimentara desde `collaborator_companies` cuando:

- `is_active = true`
- `show_in_hero_carousel = true`

### Carrusel 2 o bloque equivalente del hero — trabajos directos de Abaco

Se alimentara desde `projects` cuando:

- `project_type = individual`
- `status = published`
- `show_in_hero_carousel = true`
- exista identidad visual publica suficiente en `client_*`

### Portafolio publico

Se alimentara desde `projects` cuando:

- `status = published`
- `show_in_portfolio = true`

### Relacion visual en proyectos de colaboracion

Cuando un proyecto sea `collaboration`, la ficha publica o interna podra mostrar la empresa colaboradora relacionada a traves de `collaborator_company_id`.

## Assets y persistencia

### Marca propia

- `public/assets/branding/marca/...`

### Logos de colaboraciones

- `public/assets/branding/empresas/colaboraciones/...`

### Logos de trabajos directos

- si se usan como identidad publica de un proyecto individual, sus rutas se guardaran en los campos `client_logo_*` del proyecto;
- los archivos seguiran viviendo en `public/assets/branding/empresas/clientes-directos/...`

### Regla de persistencia

La base de datos guardara rutas relativas a archivos optimizados. No guardara hotlinks externos como fuente principal.

Ejemplos:

- `assets/branding/empresas/colaboraciones/optimizados/iberia.svg`
- `assets/branding/empresas/clientes-directos/optimizados/cognodata.svg`

## Indices recomendados

### `collaborator_companies`

- `UNIQUE(slug)`
- indice compuesto: `(is_active, show_in_hero_carousel, sort_order)`

### `projects`

- `UNIQUE(slug)`
- indice: `(collaborator_company_id)`
- indice compuesto: `(project_type, status)`
- indice compuesto: `(show_in_portfolio, status, sort_order)`
- indice compuesto: `(show_in_hero_carousel, status, sort_order)`

### `project_images`

- indice compuesto: `(project_id, sort_order)`

### `project_technologies`

- indice compuesto: `(project_id, sort_order)`
- restriccion unica recomendada: `(project_id, name)`

## Orden correcto de migraciones

Sobre las migraciones base ya existentes del starter kit, el orden correcto de Fase 1 es:

1. `create_collaborator_companies_table`
2. `create_projects_table`
3. `create_project_images_table`
4. `create_project_technologies_table`

## Criterios de foreign keys

- `projects.collaborator_company_id` -> `collaborator_companies.id`
- `project_images.project_id` -> `projects.id`
- `project_technologies.project_id` -> `projects.id`

Recomendacion:

- `project_images` y `project_technologies` con `cascadeOnDelete`
- `projects.collaborator_company_id` con `restrictOnDelete`

## Fuera de alcance ahora

Este cierre documental no implica crear todavia:

- migraciones;
- modelos;
- factories;
- seeders;
- controladores;
- policies;
- CRUDs;
- panel admin;
- frontend publico nuevo.

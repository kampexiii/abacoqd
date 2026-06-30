# Modelo de datos — AbacoQD

Última revisión: 28 de junio de 2026.

> **Actualización de cierre (28/06):** el portfolio actualmente cargado se considera **contenido real autorizado** para la web inicial, salvo indicación expresa en contra. `permission_status` se conserva solo como compatibilidad interna de datos/admin y no debe reabrirse como falso bloqueante documental.
>
> **Media de proyecto (subfase 7.3, 26/06):** `projects` añade `logo`, `logo_dark` y `logo_alt` (migración aditiva `2026_06_26_000000_add_logos_to_projects_table`), espejo de `partners`: `logo` color (modo claro), `logo_dark` monocromo (modo oscuro), `logo_alt` texto alternativo. La **imagen del proyecto es una sola subida**: `cover_image` y `thumbnail_image` guardan la misma ruta (no hay miniatura separada). Solo se guardan rutas (`/uploads/projects/...`), nunca binarios; raster→WebP, SVG conservado.
>
> **Proyecto ↔ Servicios (subfase 7.4, 26/06):** relación M:N `project_service` (migración aditiva `2026_06_26_000100_create_project_service_table`): el servicio/capacidades del proyecto se elige desde `services` (no texto libre). `cascadeOnDelete` en ambas claves: borrar el proyecto limpia sus filas; borrar un servicio limpia la relación sin romper el proyecto (en la práctica los servicios se desactivan, no se borran). `Project::services()` / `Service::projects()`. El payload público del proyecto deja de exponer `permission_status`/`isApproved` y los roles de `partner_project`; el desarrollo se expresa como `developmentMode = solo | cooperative`.

Fuente de verdad única del modelo de datos de AbacoQD. **Fase 2 (modelo de datos y migraciones) cerrada**: las migraciones, modelos, factories y seeders descritos aquí ya existen en `database/migrations`, `app/Models`, `database/factories` y `database/seeders`, y están validados con `composer test` (Pint + PHPStan + Pest) y `php artisan migrate:fresh --seed`.

## Reglas duras

- Producto final del 30/06: landing, metodología, servicios, proyectos, quiénes somos, blog, contacto, reserva, legal/cookies, chatbot, accesibilidad y admin.
- El lanzamiento inicial es **Spanish-first**: el modelo conserva capacidad para contenido EN, pero el SEO/routing EN no es requisito bloqueante actual.
- `services` es la única entidad de servicios. No existe entidad activa `project_types`.
- `partners` es la entidad unificada para empresas, marcas, clientes, colaboradores y socios. No existe entidad activa `companies`.
- La página pública **Proyectos** y la sección de landing **Colaboraciones** se alimentan de `projects`, `partners` y `partner_project`. No existe tabla `portfolios`.
- Todo contenido publicable tiene estado, visibilidad, idioma y SEO cuando aplica.
- No se inventan clientes, proyectos, reseñas, métricas, logos ni precios.
- Datos corporativos, contacto, legal, tema, accesibilidad, navegación y CTAs viven en `settings`.

## Decisión cerrada: arquitectura de contenido bilingüe

El contenido publicable usa **JSON embebido por fila**, no una fila por idioma enlazada con `language` + `translation_*_id`. Decisión cerrada el 18/06/2026, sustituyendo el patrón propuesto en la versión documental previa de este archivo; se adopta porque ya estaba implementada, probada (`tests/Feature/AbacoDataModelTest.php`) y es suficiente para el volumen real de AbacoQD.

Reglas de esta arquitectura:

- Cada campo traducible se guarda como objeto `{"es": "...", "en": "..."}` en una columna JSON. Nunca un valor único sin idioma para texto público (título, slug, resumen/descripción, SEO, CTA).
- Los slugs viven dentro del JSON (`slug->es`, `slug->en`). Toda entidad con ruta pública por slug tiene además columnas generadas `slug_es`/`slug_en` (`virtualAs` sobre el JSON) con **índice único de base de datos**: no pueden existir dos filas con el mismo slug en el mismo idioma. Aplica a `methodology_steps`, `services`, `projects`, `posts`, `post_categories`, `tags`.
- Si un idioma no tiene contenido completo, su slug/título puede quedar `null`; no se inventa traducción. Publicar o no un idioma incompleto se resuelve con `status`/`is_active`, nunca fabricando texto ni emitiendo `hreflang` falso.
- Aplica JSON por campo a: `methodology_steps`, `services`, `projects`, `posts`, `post_categories`, `tags`, `faqs`, `reviews`, `page_sections`, `section_blocks`, y a `role`/`bio` de `team_members`.
- `partners` (nombre/slug) y `team_members` (nombre/slug/contacto) quedan en texto plano sin JSON: un nombre propio de persona o empresa no cambia entre idiomas. `team_members` puede incluir CV público cuando esa descarga forme parte del alcance confirmado.

## Decisión cerrada: SEO único en `seo_metadata`

No se duplica SEO entre columnas embebidas y una tabla aparte. `seo_metadata` es la **única fuente** de título, descripción, canonical, OG, robots y datos estructurados, tanto para páginas estáticas (`page_key`) como para entidades (`seoable_type`/`seoable_id`), con una fila por idioma (`locale`). `services`, `projects` y `posts` no tienen columnas `seo_title`/`seo_description` propias.

Únicos de base de datos: (`seoable_type`, `seoable_id`, `locale`) y (`page_key`, `locale`).

## Decisión cerrada: `cta` como JSON único

Donde se necesita un CTA local a una entidad (`page_sections`, `section_blocks`, `services`), se usa una columna `cta` JSON con forma `{"label": {"es": "...", "en": "..."}, "url": {"es": "...", "en": "..."}}`. No se crean columnas `cta_label`/`cta_url` separadas.

## Decisión cerrada: `projects.year`

`projects` guarda solo el año (`year`, entero nullable), no una fecha completa. Es suficiente para mostrar antigüedad en las cards de Proyectos/Colaboraciones.

## Decisiones vigentes

| Tema | Decisión |
|---|---|
| Idiomas | Contenido traducible preparado en JSON `{es, en}` por campo; lanzamiento inicial Spanish-first; `slug_en` y SEO EN quedan disponibles para una fase posterior |
| Servicios | `services` para las seis líneas de servicio; estado `draft`/`published`/`hidden` vía enum `ServiceStatus` |
| Proyectos / Colaboraciones | Página pública `Proyectos` y sección de landing `Colaboraciones`; datos internos en `projects`, `partners`, `partner_project` |
| Blog | Bilingüe, slug por idioma con unicidad de BD, `featured_order` para fijar el orden de los 3 destacados de landing |
| SEO | `seo_metadata` único por entidad/página e idioma; sin duplicar con columnas embebidas |
| Legal/cookies | Textos en `settings.legal`/`page_sections`; consentimiento en frontend salvo necesidad de auditoría server-side |
| Reservas | **Sistema propio de citas** (`appointment_days`/`appointment_slots`/`appointment_bookings`), cerrado el 18/06/2026 — sustituye el enfoque agnóstico de `booking_settings`, que queda transicional sin uso real |
| Chatbot | `faqs`; conversación persistida queda fuera salvo decisión posterior |
| Tema/accesibilidad | Preferencias públicas en frontend/localStorage; defaults en `settings` |
| Navegación | `settings.navigation`, no CRUD de menús en el producto base |
| Roles | `users.role` vía enum `UserRole`: `super_admin`, `admin`, `editor`, `viewer` |

## Entidades

### `settings`

`group`, `key`, `value` (json), `type`, `is_public`, `description`, timestamps. Único (`group`, `key`). Debe cachearse.

Grupos mínimos: `company`, `contact`, `social`, `branding`, `navigation`, `seo`, `legal`, `cookies`, `analytics`, `institutional`, `legacy`, `accessibility`, `theme`, `booking`, `email`.

Valores iniciales confirmados (sembrados por `SettingsSeeder`): datos de `ABACO DIGITAL DEVELOPMENTS, S.L.`, CIF `B-88229364`, Registro Mercantil de Madrid, dirección, dominio canónico `https://abacoqd.com/`, teléfono `+34 91 020 00 89`, WhatsApp `+34 647 51 81 00`, emails confirmados, dominio histórico `abacodev.com`, texto institucional FSE+ y recomendaciones documentales de analítica/CMP.

### `page_sections` 🌐

`page`, `key`, `name`, `title` (json), `subtitle` (json), `content` (json), `cta` (json, ver convención de CTA), `media_path`, `icon`, `sort_order`, `is_active`, `show_on_home`, `settings` (json libre), timestamps. Único (`page`, `key`).

Uso: hero, metodología, servicios, proyectos, contacto, reserva, legales y CTAs. No todos los grupos de `settings` tienen por qué estar expuestos en el admin actual.

### `section_blocks`

`page_section_id`, `type`, `title` (json), `content` (json), `image`, `icon`, `cta` (json), `sort_order`, `is_active`, `settings` (json), timestamps.

### `methodology_steps` 🌐

`number`, `title` (json), `slug` (json + `slug_es`/`slug_en` únicos), `summary` (json), `description` (json), `deliverable` (json), `icon`, `badge`, `is_free_initial_study`, `is_featured`, `sort_order`, `is_active`, `settings` (json), timestamps.

Secuencia base: Análisis, Estudio inicial gratuito, Propuesta/enfoque, Desarrollo, Revisión, Entrega.

### `services` 🌐

`title` (json), `slug` (json + `slug_es`/`slug_en` únicos), `summary` (json), `description` (json), `icon`, `image`, `cta` (json), `status` (enum `ServiceStatus`: `draft`/`published`/`hidden`), `sort_order`, `is_featured`, `is_active`, `show_on_home`, `is_detail_enabled`, `settings` (json), timestamps.

SEO de cada servicio vive en `seo_metadata` (`seoable_type = Service`), no en columnas embebidas.

Servicios iniciales: Desarrollo web rápido, Aplicaciones a medida, Automatización con IA, CRM datos y procesos, Integraciones digitales, MVPs y prototipos.

### `partners` 🌐 (texto plano en nombre/slug; JSON solo en `description`)

`name`, `slug` (único), `type` (enum `PartnerType`: `client`/`collaborator`/`provider`/`institutional`/`other`), `logo`, `logo_dark`, `logo_alt`, `website`, `social_links` (json), `description` (json), `permission_status` (enum `PermissionStatus`: `pending`/`approved`/`rejected`/`unknown`), `permission_notes`, `show_on_home`, `show_in_collaborations`, `show_in_projects`, `is_featured`, `is_active`, `sort_order`, `settings` (json), timestamps.

Un partner solo se muestra si `permission_status = approved` y el flag de visibilidad correspondiente está activo.

### `projects` 🌐

`title` (json), `slug` (json + `slug_es`/`slug_en` únicos), `summary` (json), `description` (json), `challenge`/`solution`/`result` (json, narrativa de caso), `cover_image`, `thumbnail_image`, `gallery` (json), `technologies` (json), `status` (enum `ProjectStatus`: `draft`/`published`/`hidden`), `year` (entero nullable, ver decisión cerrada), `client_name`, `client_partner_id` (FK nullable a `partners`), `github_url`, `external_url`, `permission_status` (enum `PermissionStatus`), `permission_notes`, `show_on_home`, `show_in_projects`, `show_in_collaborations`, `is_featured`, `is_active`, `sort_order`, `settings` (json), timestamps.

SEO de cada proyecto vive en `seo_metadata`. Un proyecto propio puede no tener partner principal; si lo tiene, además puede tener N partners vía `partner_project` con rol declarado.

### `partner_project`

`partner_id`, `project_id`, `role` (`client`/`collaborator`/`brand`/`technology_partner`/`other`), `sort_order`, timestamps. Clave primaria compuesta (`partner_id`, `project_id`).

### `posts` 🌐

`post_category_id`, `user_id` (autor), `title` (json), `slug` (json + `slug_es`/`slug_en` únicos), `excerpt` (json), `content` (json estructurado), `featured_image`, `status` (enum `PostStatus`: `draft`/`scheduled`/`published`/`hidden`), `published_at`, `is_featured`, `featured_order` (orden manual entre destacados de landing), `show_on_home`, `reading_time`, `settings` (json), timestamps, soft deletes.

SEO de cada post vive en `seo_metadata`. Selección de los 3 destacados de landing: `is_featured = true` + `featured_order` (1, 2, 3).

### `post_categories` 🌐, `tags` 🌐, `post_tag`

`post_categories`: `name` (json), `slug` (json + `slug_es`/`slug_en` únicos), `description` (json), `sort_order`, `is_active`, timestamps.

`tags`: `name` (json), `slug` (json + `slug_es`/`slug_en` únicos), timestamps.

`post_tag`: `post_id`, `tag_id`, timestamps.

### `faqs` 🌐

`question` (json), `answer` (json), `category`, `intent`, `redirect_url`, `redirect_section`, `show_in_chatbot`, `show_on_page`, `sort_order`, `is_active`, timestamps.

Uso: preguntas sobre servicios, metodología, proyectos, contacto, reserva, legal y privacidad, con redirección opcional a una URL o sección concreta.

### `contact_messages`

`service_id` (FK nullable), `name`, `email`, `phone`, `company`, `subject`, `message`, `preferred_contact_method`, `privacy_accepted_at`, `commercial_consent`, `commercial_consent_at`, `source`, `status`, `ip_address`, `user_agent`, `metadata` (json), timestamps.

El consentimiento de privacidad es obligatorio (`privacy_accepted_at`); el comercial es opcional y separado (`commercial_consent`/`commercial_consent_at`).

### `booking_settings` (transicional)

`provider`, `url`, `is_enabled`, `fallback_to_contact`, `settings` (json), timestamps.

Superado por el sistema propio de citas (`appointment_days`/`appointment_slots`/`appointment_bookings`, cerrado el 18/06/2026). Se conserva la tabla sin sembrar contenido nuevo por si se necesita un fallback de configuración puntual; no se usa para la reserva real.

### `appointment_days`

`date` (único), `title` nullable, `notes` nullable, `is_available`, `max_bookings` nullable, `admin_blocked`, `block_reason` nullable, `sort_order`, timestamps.

Representa un día con franjas potencialmente reservables. El admin activa/desactiva el día completo (`is_available`) o lo bloquea puntualmente (`admin_blocked` + `block_reason`) sin borrar sus franjas. Sin campo `language`: el día no es contenido público traducible, es un dato operativo.

### `appointment_slots`

`appointment_day_id`, `starts_at`, `ends_at`, `duration_minutes` (default 120), `status` (enum `AppointmentSlotStatus`: `available`/`reserved`/`blocked`/`cancelled`/`expired`), `admin_blocked`, `block_reason` nullable, `capacity` (default 1), `reserved_count` (default 0), `notes` nullable, timestamps.

Una franja solo es reservable (`AppointmentSlot::isBookable()`) si `status = available`, no está bloqueada, `reserved_count < capacity` y `starts_at` es futuro. `scopeAvailable()` aplica exactamente esos cuatro filtros para la vista pública.

### `appointment_bookings`

`appointment_slot_id`, `service_id` nullable, `name`, `company` nullable, `email`, `phone` nullable, `message` nullable, `status` (enum `AppointmentBookingStatus`: `pending`/`confirmed`/`cancelled`/`completed`/`no_show`), `cancellation_token` (único, autogenerado), `cancelled_at` nullable, `privacy_consent_accepted_at`, `marketing_consent_accepted_at` nullable, `ip_address` nullable, `user_agent` nullable, `admin_notes` nullable, timestamps.

La reserva se crea dentro de una transacción con `lockForUpdate()` sobre la franja para evitar doble reserva concurrente; al confirmar, incrementa `reserved_count` y marca la franja `reserved` si alcanza `capacity`. Cancelación por token seguro preparada en el modelo; la página pública de cancelación queda pendiente de una fase posterior.

### `reviews` 🌐

`partner_id` (nullable), `project_id` (nullable), `author_name`, `author_role`, `company_name`, `content` (json), `rating`, `source`, `source_url`, `permission_status` (enum `PermissionStatus`), `permission_notes`, `show_on_home`, `is_featured`, `is_active`, `sort_order`, timestamps.

No se simulan reseñas externas.

### `blog_subscribers`

`email` (único), `name`, `locale`, `status` (enum `SubscriberStatus`: `pending`/`confirmed`/`unsubscribed`), `consent_accepted_at`, `confirmation_token` (único), `confirmed_at`, `unsubscribed_at`, `source`, `consent_ip`, timestamps.

Requiere double opt-in y baja en un clic.

### `team_members` 🌐 (texto plano en datos personales; JSON solo en `role`/`bio`)

`name`, `slug` (único), `role` (json), `bio` (json), `photo`, `photo_alt`, `linkedin_url`, `github_url`, `personal_url`, `cv_path`, `email`, `sort_order`, `is_visible`, `is_active`, `settings` (json), timestamps.

Si no hay miembros visibles, la vista pública usa bloque corporativo y no un grid vacío.

### `seo_metadata` 🌐 (polimórfica, fuente única de SEO)

`seoable_type`, `seoable_id` (nullable, para entidades), `page_key` (nullable, para páginas estáticas sin entidad), `locale`, `title`, `description`, `canonical_url`, `robots` (string: `index,follow`/`noindex,nofollow`/...), `og_title`, `og_description`, `og_image`, `schema_type`, `schema_data` (json), timestamps.

Únicos: (`seoable_type`, `seoable_id`, `locale`) y (`page_key`, `locale`). Aplica a páginas, servicios, proyectos, posts, categorías y legales cuando proceda.

### `users`

`role` vía enum `UserRole`: `super_admin`, `admin`, `editor`, `viewer`. No se crea tabla paralela de admin.

## Cookies y consentimiento

Decisión P0: no se crea tabla obligatoria para consentimiento anónimo. La preferencia del banner se guarda en cliente (`localStorage`/cookie técnica) y los textos/categorías se administran con `settings.cookies` y `settings.legal`.

Si se exige auditoría server-side de consentimientos, se documentará antes de implementar una entidad `cookie_consents` con `consent_id`, `categories_json`, `accepted_at`, `revoked_at`, `ip_hash`, `user_agent_hash` y `language`. No se añade por defecto para no sobrediseñar.

## Relaciones clave

- `page_sections` tiene muchos `section_blocks`.
- `services` alimenta landing, listado, detalle y select de contacto; su SEO vive en `seo_metadata` (`MorphMany`, una fila por idioma vía `seoMetadataFor($locale)`).
- `projects` alimenta la página Proyectos y la sección de landing Colaboraciones; `partners` aporta logos/relaciones; `partner_project` define roles; su SEO vive en `seo_metadata`.
- `posts` pertenece a `post_categories`, se relaciona con `tags` y su SEO vive en `seo_metadata`.
- `contact_messages.service_id` enlaza con `services`.
- `reviews` puede enlazar con `partners` y/o `projects`.
- `faqs` puede redirigir a servicios, proyectos, posts, contacto, reserva o legales vía `redirect_url`/`redirect_section`.
- `team_members` alimenta Quiénes somos solo cuando haya perfiles publicables.

## Mapa funcional

| Vista | Ruta | Doc | Entidades |
|---|---|---|---|
| Home / Landing | `/` | `07_VISTAS/PUBLIC_01_HOME_LANDING.md` | `page_sections`, `section_blocks`, `methodology_steps`, `services`, `partners`, `projects`, `posts`, `settings` |
| Metodología | `/metodologia` | `07_VISTAS/PUBLIC_02_METODOLOGIA_PROCESO.md` | `methodology_steps`, `page_sections`, `settings`, `seo_metadata` |
| Servicios | `/servicios` · `/servicios/{slug}` | `07_VISTAS/PUBLIC_03_SERVICIOS.md` | `services`, `seo_metadata`, `faqs` |
| Proyectos | `/proyectos` · `/proyectos/{slug}` | `07_VISTAS/PUBLIC_04_PROYECTOS.md` | `projects`, `partners`, `partner_project`, `reviews`, `seo_metadata` |
| Quiénes somos | `/quienes-somos` | `07_VISTAS/PUBLIC_10_QUIENES_SOMOS.md` | `page_sections`, `section_blocks`, `team_members`, `partners`, `settings`, `seo_metadata` |
| Blog | `/blog` · `/blog/{slug}` | `07_VISTAS/PUBLIC_05_BLOG.md` | `posts`, `post_categories`, `tags`, `post_tag`, `seo_metadata`, `blog_subscribers` |
| Contacto / Reserva | `/contacto` · `/reserva` | `07_VISTAS/PUBLIC_06_CONTACTO_RESERVA.md` | `contact_messages`, `appointment_days`, `appointment_slots`, `appointment_bookings`, `settings`, `services` |
| Legal / Cookies / Privacidad | `/aviso-legal`, `/privacidad`, `/cookies` | `07_VISTAS/PUBLIC_07_LEGAL_COOKIES_PRIVACIDAD.md` | `settings.legal`, `settings.cookies`, `page_sections`, `seo_metadata` |
| Errores | 404 · 500 · 503 | `07_VISTAS/PUBLIC_08_ERRORES.md` | ninguna |
| Layout global | todas | `07_VISTAS/PUBLIC_09_LAYOUT_GLOBAL.md` | `settings`, `faqs` |
| Admin | `/admin/*` | `07_VISTAS/ADMIN_01..03` | todas según módulo |

## Orden conceptual de implementación

Completado en Fase 2 (18/06/2026), en este orden:

1. `settings` + navegación final + datos corporativos.
2. `page_sections` + `section_blocks`.
3. `methodology_steps`.
4. `services`.
5. `partners`, `projects`, `partner_project`.
6. `posts`, `post_categories`, `tags`, `post_tag`, `blog_subscribers`.
7. `faqs`.
8. `contact_messages`, `booking_settings` (transicional, ver Fase 3).
9. `seo_metadata`.
10. `reviews`.
11. `team_members`.
12. `users.role` y permisos admin (modelo cerrado; CRUDs admin pendientes de Fase 5 del backlog).
13. `appointment_days`, `appointment_slots`, `appointment_bookings` (cerrado el 18/06/2026 junto con `/contacto` y `/reserva`).

## Checklist de cierre de Fase 2

- [x] Aprobar nombres finales de entidades/campos (arquitectura JSON cerrada el 18/06/2026).
- [x] Aprobar este modelo y crear migraciones (`database/migrations/2026_06_15_*`, validadas con `composer test` y `migrate:fresh --seed`).
- [x] Confirmar proveedor de reserva: sistema propio (no Cal.com/Calendly); `appointment_days`/`appointment_slots`/`appointment_bookings` migrados y validados el 18/06/2026.
- [ ] Confirmar teléfono legal visible principal.
- [ ] Confirmar revisión jurídica final de aviso legal, privacidad y cookies.
- [ ] Confirmar stack definitivo de analítica/cookies y CMP.
- [ ] Confirmar ubicación obligatoria de logos UE/FSE+/Fondos Europeos y rutas finales de assets.
- [ ] Confirmar la selección editorial final de portfolio destacado si se quiere recortar o reordenar el contenido visible.
- [ ] Confirmar política del estudio inicial y textos de CTA.
- [ ] Confirmar copy final en español de servicios, proyectos, blog, contacto y legales. EN solo aplica si se abre fase posterior.

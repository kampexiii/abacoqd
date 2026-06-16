# Modelo de datos — AbacoQD

Última revisión: 14 de junio de 2026.

Fuente de verdad única del modelo conceptual de AbacoQD. Esta fase es solo documental: no crea migraciones, modelos, seeders ni CRUDs.

## Reglas duras

- Producto completo y definitivo del 30/06: ES/EN, landing, metodología, servicios, proyectos, quiénes somos, blog, contacto, reserva, legal/cookies, chatbot, accesibilidad y admin.
- `services` es la única entidad de servicios. No existe entidad activa `project_types`.
- `partners` es la entidad unificada para empresas, marcas, clientes, colaboradores y socios. No existe entidad activa `companies`.
- La página pública **Proyectos** y la sección de landing **Colaboraciones** se alimentan de `projects`, `partners` y `partner_project`. No existe tabla `portfolios`.
- Todo contenido publicable tiene estado, visibilidad, idioma y SEO cuando aplica.
- No se inventan clientes, proyectos, reseñas, métricas, logos ni precios. Los datos demo se marcan como demo y no se publican como reales.
- Datos corporativos, contacto, legal, tema, accesibilidad, navegación y CTAs viven en `settings`.

## Decisiones vigentes

| Tema | Decisión |
|---|---|
| Idiomas | ES/EN desde el inicio; entidades traducibles con `language` + `translation_*_id`; slugs por idioma |
| Servicios | `services` para las seis líneas de servicio y sus detalles publicables |
| Proyectos / Colaboraciones | Página pública `Proyectos` y sección de landing `Colaboraciones`; datos internos en `projects`, `partners`, `partner_project` |
| Blog | Bilingüe, slug/SEO por idioma y relación explícita ES↔EN |
| Legal/cookies | Textos en `settings.legal`/`page_sections`; consentimiento en frontend salvo necesidad de auditoría server-side |
| Reservas | `booking_settings` agnóstico; fallback a contacto |
| Chatbot | `faqs`; conversación persistida queda fuera salvo decisión posterior |
| Tema/accesibilidad | Preferencias públicas en frontend/localStorage; defaults en `settings` |
| Navegación | `settings.navigation`, no CRUD de menús en el producto base |

## Entidades

### `settings`

Configuración global. Campos: `group`, `key`, `value`, `type`, `is_public`, timestamps. Debe cachearse.

Grupos mínimos: `company`, `contact`, `social`, `branding`, `navigation`, `seo`, `legal`, `cookies`, `analytics`, `institutional`, `legacy`, `accessibility`, `theme`, `booking`, `email`.

Uso: datos corporativos, titular legal, dominio, emails, teléfono/WhatsApp, redes, logo, favicon, distintivos institucionales, tema por defecto, navegación final, textos legales base, política de cookies, defaults de accesibilidad, CTA global y datos SEO globales.

Valores iniciales confirmados en `settings`:

**Grupo `company`:**

- `company.legal_name` = `ABACO DIGITAL DEVELOPMENTS, S.L.`
- `company.trade_name` = `ABACO`
- `company.cif` = `B-88229364`
- `company.registry` = `Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002`
- `company.address_line_1` = `Calle Núñez de Balboa 35 A`
- `company.address_line_2` = `Piso 5, Oficina A1`
- `company.postal_code` = `28001`
- `company.city` = `Madrid`
- `company.country` = `España`
- `company.website` = `https://abacoqd.com/`

**Grupo `contact`:**

- `contact.phone` = `+34 91 020 00 89`
- `contact.whatsapp` = `+34 647 51 81 00`
- `contact.email_primary` = `info@abacodev.com`
- `contact.email_secondary` = `abacodevelopments@gmail.com`
- `contact.email_andres` = `andrescasanueva@abacodev.com`

**Grupo `social`:**

- `social.linkedin_url` = pendiente de cargar URL validada; única red publicable inicialmente.
- `social.facebook_url` = pendiente de validación interna antes de publicar.

**Grupo `legal`:**

- `legal.owner` = `ABACO DIGITAL DEVELOPMENTS, S.L.`
- `legal.cif` = `B-88229364`
- `legal.registry` = `Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002`
- `legal.privacy_contact_email` = `info@abacodev.com`

**Grupo `seo`:**

- `seo.canonical_domain` = `https://abacoqd.com/`
- `seo.public_brand_name` = `Abaco Developments`

**Grupo `legacy`:**

- `legacy.previous_domain` = `https://abacodev.com/`
- `legacy.previous_legal_url` = `https://www.abacodev.com/`
- `legacy.redirect_policy` = `pendiente de confirmar`

**Grupo `analytics`:**

- `analytics.recommended_stack` = `GTM + GA4 + Search Console`
- `analytics.recommended_cmp` = `CookieYes`
- `analytics.optional_session_insights` = `Clarity`, solo si se aprueba y queda bloqueado por consentimiento.

**Grupo `booking`:**

- `booking.recommended_provider` = `Cal.com`
- `booking.fast_option` = `Calendly`
- `booking.wordpress_option` = `Amelia`, solo si el stack final fuera WordPress.

**Grupo `institutional`:**

- `institutional.benow_partner_logo` = pendiente de ruta definitiva.
- `institutional.eu_cofunded_logo` = pendiente de ruta definitiva.
- `institutional.european_funds_logo` = pendiente de ruta definitiva.
- `institutional.eu_fse_text` = `Cofinanciado por la Unión Europea (FSE+) Subvención para la contratación de jóvenes - Comunidad de Madrid.`

Los logos institucionales no son `partners` ni `projects` por defecto. Solo se moverían a una zona de Proyectos/Colaboraciones/Partners si el cliente confirma expresamente que deben mostrarse como credenciales públicas de ese bloque.

### `page_sections` 🌐

Secciones editables de páginas públicas. Campos: `page`, `key`, `language`, `translation_page_section_id`, `title`, `subtitle`, `body`, `cta_label`, `cta_url`, `media_path`, `icon`, `sort_order`, `is_visible`, `metadata_json`, timestamps.

Uso: home, metodología, servicios, proyectos, contacto, reserva, legales y CTAs.

### `section_blocks` 🌐

Bloques hijos de una sección. Campos: `page_section_id`, `title`, `body`, `icon`, `media_path`, `cta_label`, `cta_url`, `sort_order`, `is_visible`, `metadata_json`, timestamps.

Uso: beneficios del hero, bloques de metodología, pasos visuales, columnas de contacto, módulos legales o CTA.

### `methodology_steps` 🌐

Pasos de la metodología. Campos: `title`, `slug`, `description`, `short_description`, `deliverable`, `icon`, `language`, `translation_methodology_step_id`, `sort_order`, `is_visible`, `is_featured`, timestamps.

Secuencia base: Análisis, Estudio inicial, Propuesta/enfoque, Desarrollo, Revisión, Entrega.

### `services` 🌐

Servicios públicos. Campos: `title`, `slug`, `short_description`, `long_description`, `icon`, `image_path`, `technologies_json`, `cta_label`, `cta_url`, `language`, `translation_service_id`, `sort_order`, `is_visible`, `is_featured`, `is_detail_enabled`, `status` (`draft`, `published`, `hidden`), timestamps.

Servicios iniciales: Desarrollo web rápido, Aplicaciones a medida, Automatización con IA, CRM datos y procesos, Integraciones digitales, MVPs y prototipos.

### `partners` 🌐

Entidad unificada para empresas, marcas, clientes, colaboradores y socios. Campos: `name`, `slug`, `type` (`collaborator`, `partner`, `client`, `brand`, `company` como valor descriptivo), `logo_path`, `logo_dark_path`, `logo_alt`, `website_url`, `description`, `social_links_json`, `is_visible`, `is_featured`, `show_in_projects`, `sort_order`, `language`, `translation_partner_id`, timestamps.

Un partner solo se muestra si hay permiso de uso de nombre/logo.

### `projects` 🌐

Proyectos/casos para la página Proyectos y la sección de landing Colaboraciones. Campos: `title`, `slug`, `summary`, `description`, `primary_partner_id` nullable, `cover_image_path`, `gallery_json`, `technologies_json`, `public_url`, `repository_url`, `status` (`draft`, `published`, `hidden`), `is_visible`, `is_featured`, `sort_order`, `project_date`, `language`, `translation_project_id`, `metadata_json`, timestamps.

Un proyecto propio puede no tener partner principal. Si hay partner, el rol se declara.

### `partner_project`

Relación N:M entre partners y proyectos. Campos: `partner_id`, `project_id`, `role` (`client`, `collaborator`, `brand`, `technology_partner`, `other`), `sort_order`, timestamps.

### `posts` 🌐

Blog bilingüe. Campos: `title`, `slug`, `excerpt`, `content_json`, `image_path`, `post_category_id`, `author_id` nullable, `reading_time`, `language`, `translation_post_id`, `status` (`draft`, `scheduled`, `published`, `hidden`), `published_at`, `is_featured`, `featured_order`, timestamps.

### `post_categories` 🌐, `tags` 🌐, `post_tag`

`post_categories`: `name`, `slug`, `description`, `language`, `translation_post_category_id`, `sort_order`, `is_visible`, timestamps.

`tags`: `name`, `slug`, `language`, `translation_tag_id`, timestamps.

`post_tag`: `post_id`, `tag_id`.

### `faqs` 🌐

Base del chatbot/asistente. Campos: `question`, `answer`, `intent`, `language`, `translation_faq_id`, `redirect_url`, `redirect_section`, `is_active`, `sort_order`, timestamps.

Uso: preguntas sobre servicios, metodología, proyectos, contacto, reserva, legal y privacidad.

### `contact_messages`

Mensajes del formulario. Campos: `name`, `company`, `email`, `phone`, `message`, `service_id` nullable, `source`, `status`, `notes`, `privacy_consent_accepted_at`, `marketing_consent_accepted_at` nullable, `ip_address`, `user_agent`, timestamps.

El consentimiento de privacidad es obligatorio. El consentimiento comercial es opcional y separado.

### `booking_settings`

Reserva agnóstica. Campos: `provider`, `booking_url`, `is_enabled`, `title`, `body`, `cta_label`, `metadata_json`, timestamps. Sin proveedor válido, la vista usa fallback a contacto.

### `reviews` 🌐

Reseñas reales con permiso. Campos: `author_name`, `company`, `role`, `rating`, `body`, `source`, `source_url`, `partner_id` nullable, `project_id` nullable, `language`, `translation_review_id`, `is_visible`, `is_featured`, `sort_order`, timestamps.

No se simulan reseñas externas.

### `blog_subscribers`

Suscripción al blog. Campos: `email`, `name`, `language`, `status` (`pending`, `confirmed`, `unsubscribed`), `confirmation_token`, `confirmed_at`, `unsubscribed_at`, `source`, `consent_ip`, timestamps.

Requiere double opt-in y baja en un clic.

### `team_members` 🌐

Miembros publicables para Quiénes somos. Campos: `name`, `slug`, `role`, `bio`, `photo_path`, `photo_alt`, `email`, `linkedin_url`, `github_url`, `personal_url`, `cv_path`, `language`, `translation_team_member_id`, `is_visible`, `sort_order`, timestamps.

Si no hay miembros visibles, la vista muestra bloque corporativo y no un grid vacío.

### `seo_metadata` 🌐

SEO polimórfico. Campos: `seoable_type`, `seoable_id`, `language`, `title`, `description`, `canonical_url`, `og_title`, `og_description`, `og_image_path`, `no_index`, `structured_data_json`, timestamps.

Aplica a páginas, servicios, proyectos, posts, categorías y legales cuando proceda.

### `users`

Usuarios del admin sobre el `users` del starter. Añadido conceptual: `role` (`super_admin`, `admin`, `editor`, `viewer`) cuando se implemente. No se crea tabla paralela de admin.

## Cookies y consentimiento

Decisión P0: no se crea tabla obligatoria para consentimiento anónimo. La preferencia del banner se guarda en cliente (`localStorage`/cookie técnica) y los textos/categorías se administran con `settings.cookies` y `settings.legal`.

Si se exige auditoría server-side de consentimientos, se documentará antes de implementar una entidad `cookie_consents` con `consent_id`, `categories_json`, `accepted_at`, `revoked_at`, `ip_hash`, `user_agent_hash` y `language`. No se añade por defecto para no sobrediseñar.

## Relaciones clave

- `page_sections` tiene muchos `section_blocks`.
- `services` alimenta landing, listado, detalle y select de contacto.
- `projects` alimenta la página Proyectos y la sección de landing Colaboraciones; `partners` aporta logos/relaciones; `partner_project` define roles.
- `posts` pertenece a `post_categories` y se relaciona con `tags`.
- `seo_metadata` es polimórfica y por idioma.
- `contact_messages.service_id` enlaza con `services`.
- `reviews` puede enlazar con `partners` y/o `projects`.
- `faqs` puede redirigir a servicios, proyectos, posts, contacto, reserva o legales.
- `team_members` alimenta Quiénes somos solo cuando haya perfiles publicables.

## Mapa funcional

| Vista | Ruta | Doc | Entidades |
|---|---|---|---|
| Home / Landing | `/` · `/en` | `07_VISTAS/PUBLIC_01_HOME_LANDING.md` | `page_sections`, `section_blocks`, `methodology_steps`, `services`, `partners`, `projects`, `posts`, `settings` |
| Metodología | `/metodologia` · `/en/methodology` | `07_VISTAS/PUBLIC_02_METODOLOGIA_PROCESO.md` | `methodology_steps`, `page_sections`, `settings`, `seo_metadata` |
| Servicios | `/servicios` · `/servicios/{slug}` · `/en/services` | `07_VISTAS/PUBLIC_03_SERVICIOS.md` | `services`, `seo_metadata`, `faqs` |
| Proyectos | `/proyectos` · `/proyectos/{slug}` · `/en/projects` | `07_VISTAS/PUBLIC_04_PROYECTOS.md` | `projects`, `partners`, `partner_project`, `reviews`, `seo_metadata` |
| Quiénes somos | `/quienes-somos` · `/en/about` | `07_VISTAS/PUBLIC_10_QUIENES_SOMOS.md` | `page_sections`, `section_blocks`, `team_members`, `partners`, `settings`, `seo_metadata` |
| Blog | `/blog` · `/blog/{slug}` · `/en/blog` | `07_VISTAS/PUBLIC_05_BLOG.md` | `posts`, `post_categories`, `tags`, `post_tag`, `seo_metadata`, `blog_subscribers` |
| Contacto / Reserva | `/contacto` · `/reserva` · `/en/contact` · `/en/book` | `07_VISTAS/PUBLIC_06_CONTACTO_RESERVA.md` | `contact_messages`, `booking_settings`, `settings`, `services` |
| Legal / Cookies / Privacidad | `/aviso-legal`, `/privacidad`, `/cookies` | `07_VISTAS/PUBLIC_07_LEGAL_COOKIES_PRIVACIDAD.md` | `settings.legal`, `settings.cookies`, `page_sections`, `seo_metadata` |
| Errores | 404 · 500 · 503 | `07_VISTAS/PUBLIC_08_ERRORES.md` | ninguna |
| Layout global | todas | `07_VISTAS/PUBLIC_09_LAYOUT_GLOBAL.md` | `settings`, `faqs` |
| Admin | `/admin/*` | `07_VISTAS/ADMIN_01..03` | todas según módulo |

## Orden conceptual de implementación

1. `settings` + navegación final + datos corporativos.
2. `page_sections` + `section_blocks`.
3. `methodology_steps`.
4. `services`.
5. `partners`, `projects`, `partner_project`.
6. `posts`, `post_categories`, `tags`, `post_tag`, `blog_subscribers`.
7. `faqs`.
8. `contact_messages`, `booking_settings`.
9. `seo_metadata`.
10. `reviews`.
11. `team_members`.
12. `users.role` y permisos admin.

## Checklist antes de migraciones

- [ ] Aprobar nombres finales de entidades/campos.
- [ ] Confirmar teléfono legal visible principal.
- [ ] Confirmar revisión jurídica final de aviso legal, privacidad y cookies.
- [ ] Confirmar stack definitivo de analítica/cookies y CMP.
- [ ] Confirmar ubicación obligatoria de logos UE/FSE+/Fondos Europeos y rutas finales de assets.
- [ ] Confirmar permisos de partners, logos, proyectos, capturas y reseñas.
- [ ] Confirmar proveedor de reserva y si implica cookies no técnicas.
- [ ] Confirmar política del estudio inicial y textos de CTA.
- [ ] Confirmar copy ES/EN mínimo de servicios, proyectos, blog, contacto y legales.
- [ ] Aprobar este modelo antes de crear migraciones.

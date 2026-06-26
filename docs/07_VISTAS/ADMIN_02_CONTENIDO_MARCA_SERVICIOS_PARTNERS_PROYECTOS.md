# ADMIN_02 — Contenido, marca, servicios, partners y proyectos

Última revisión: 26 de junio de 2026.

Gestión del contenido público, marca, settings, metodología, servicios, proyectos, partners, reviews y legal/cookies editable (página pública **Proyectos** y sección de landing **Colaboraciones**). Patrones comunes en `ADMIN_01_LAYOUT_DASHBOARD_PATRONES.md`.

> **Actualización Bloque 7 (26/06):** los CRUD de **proyectos** y **partners** ya no exponen el campo/columna **«Permiso»**. El listado y el formulario se gestionan por **Estado + Visibilidad** (estado del proyecto, activo, home/proyectos/colaboraciones, destacado, orden) y, en partners, por activo + noria de Colaboraciones. `permission_status` se persiste internamente como `approved`. El partner sigue soportando **logo color (`logo`) + logo monocromo (`logo_dark`)** + `logo_alt`; el proyecto, de momento, cover/thumbnail/gallery (logo color/mono de proyecto queda para la subfase de media pipeline).

## 1. Settings / marca / datos corporativos

Gestiona `settings`:

- `company`: nombre, razón social, NIF/CIF, domicilio, dominio, copyright.
- `contact`: email, teléfono, WhatsApp, horario.
- `social`: perfiles públicos confirmados.
- `branding`: logo, logo claro/oscuro, favicon, OG global.
- `seo`: dominio canónico final, marca pública y reglas globales.
- `legacy`: dominio anterior, URL legal histórica y política de redirección pendiente.
- `analytics`: stack recomendado y CMP.
- `institutional`: logos be now/UE/Fondos Europeos y texto FSE+.
- `navigation`: topbar final y footer por idioma.
- `theme` y `accessibility`: defaults.
- `legal` y `cookies`: datos del titular, textos base, categorías de cookies.

No se publican datos corporativos no confirmados.

Valores confirmados para carga inicial:

- `company.legal_name`: ABACO DIGITAL DEVELOPMENTS, S.L.
- `company.trade_name`: ABACO.
- `company.cif`: B-88229364.
- `company.registry`: Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002.
- `company.address_line_1`: Calle Núñez de Balboa 35 A.
- `company.address_line_2`: Piso 5, Oficina A1.
- `company.postal_code`: 28001.
- `company.city`: Madrid.
- `company.country`: España.
- `company.website`: https://abacoqd.com/.
- `contact.phone`: +34 91 020 00 89.
- `contact.whatsapp`: +34 647 51 81 00.
- `contact.email_primary`: info@abacodev.com.
- `contact.email_secondary`: abacodevelopments@gmail.com.
- `contact.email_andres`: andrescasanueva@abacodev.com.
- `legal.owner`: ABACO DIGITAL DEVELOPMENTS, S.L.
- `legal.cif`: B-88229364.
- `legal.registry`: Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002.
- `legal.privacy_contact_email`: info@abacodev.com.
- `seo.canonical_domain`: https://abacoqd.com/.
- `seo.public_brand_name`: Abaco Developments.
- `legacy.previous_domain`: https://abacodev.com/.
- `legacy.previous_legal_url`: https://www.abacodev.com/.
- `legacy.redirect_policy`: pendiente de confirmar.
- `analytics.recommended_stack`: GTM + GA4 + Search Console.
- `analytics.recommended_cmp`: CookieYes.
- `booking.recommended_provider`: Cal.com.
- `institutional.eu_fse_text`: Cofinanciado por la Unión Europea (FSE+) Subvención para la contratación de jóvenes - Comunidad de Madrid.

El número `647 518 100` del aviso legal aportado queda normalizado como `+34 647 51 81 00`. Pendientes: adaptar aviso legal al dominio `abacoqd.com`, confirmar política de `abacodev.com`, teléfono legal visible principal, redes sociales reales salvo LinkedIn, horario, ubicación obligatoria de logos institucionales y rutas definitivas de assets.

## 2. Home y secciones públicas

CRUD de `page_sections` y `section_blocks` para:

- Hero.
- Metodología.
- Servicios.
- Colaboraciones.
- Quiénes somos.
- Blog destacados.
- CTA final.
- Footer.
- Contacto/reserva.
- Legales.

Campos comunes: idioma, título, subtítulo, cuerpo, CTA, media, icono, orden, visibilidad, metadata y SEO si aplica.

## 3. Metodología

CRUD de `methodology_steps` en ES/EN. Permite ordenar pasos, editar descripción, entregable, icono, visibilidad y destacado.

El bloque "Estudio inicial" tiene control editorial específico. La palabra `Gratuito` solo se publica si la política comercial está confirmada.

## 4. Servicios

CRUD de `services`:

- título, slug, descripción corta/larga;
- icono y mockup;
- tecnologías/capacidades;
- CTA y destino;
- visible/destacado;
- detalle habilitado;
- estado;
- SEO por idioma.

Servicios iniciales cerrados: Desarrollo web rápido, Aplicaciones a medida, Automatización con IA, CRM datos y procesos, Integraciones digitales, MVPs y prototipos.

No existe gestión de "Tipologías" como concepto separado.

## 5. Proyectos y sección Colaboraciones

El nombre público de página/topbar es **Proyectos**; la sección de landing equivalente (logos/empresas/trabajos) se llama **Colaboraciones**. El admin las gestiona con `projects`, `partners` y `partner_project`, y decide qué partners/proyectos aparecen en Colaboraciones.

### Proyectos (`projects`)

Campos: título, slug, resumen, descripción/cuerpo, partner principal opcional, cover, galería, tecnologías, URL pública, repositorio, estado, visibilidad, destacado, orden, fecha, idioma, traducción y SEO.

Validaciones:

- Proyecto publicado requiere título, slug, resumen, estado, idioma, SEO mínimo y permisos de publicación.
- Cover/capturas deben tener alt y no exponer datos sensibles.
- Si hay partner principal, debe existir y tener rol claro.

### Partners (`partners`)

Campos: nombre, slug, tipo, logo claro/oscuro, alt, web, descripción, redes, visible, destacado, mostrar en Proyectos/Colaboraciones (`show_in_projects`), orden, idioma y traducción.

Solo se muestran logos/nombres con permiso. `partners` cubre empresas, marcas, clientes y colaboradores; no hay tabla separada para empresas.

### Relación `partner_project`

Administra rol y orden de cada partner dentro del proyecto: cliente, colaborador, partner tecnológico, marca u otro. Esta relación evita atribuciones falsas.

## 6. Reviews

CRUD de `reviews` con autor, empresa, rol, rating, texto, fuente, URL, partner/proyecto opcional, idioma, visible, destacado y orden.

Solo reseñas reales con permiso. Sin reseñas, la sección se oculta.

## 7. Quiénes somos

Gestión de la vista `PUBLIC_10_QUIENES_SOMOS.md`:

- hero, historia, hitos y valores vía `page_sections`/`section_blocks`;
- relación Ábaco Developments ↔ AbacoQD desde `settings`;
- miembros publicables vía `team_members`;
- links sociales y CV solo con datos reales;
- SEO por idioma;
- bloque de partners/confianza solo con permisos.
- bloque institucional desde `settings.institutional` si se confirma ubicación pública u obligación de visibilidad.

Sin miembros visibles, el admin debe mostrar aviso y la vista pública usa bloque corporativo.

## 8. Legal y cookies editable

Módulo para textos legales y cookies:

- Aviso legal.
- Política de privacidad.
- Política de cookies.
- Tabla de cookies.
- Categorías de consentimiento.
- Estado de banner si hay cookies no técnicas.

No reemplaza validación jurídica. El admin muestra aviso de bloqueo si faltan datos legales reales o si los textos no tienen revisión final. El texto base aportado por cliente queda marcado como pendiente de adaptación legal final a RGPD, LOPDGDD 3/2018, LSSI-CE y criterios actuales de cookies de AEPD. No se publica como definitivo si mantiene referencias antiguas como Ley Orgánica 15/1999 o ficheros inscritos en AEPD.

Los formularios públicos deben separar aceptación obligatoria de privacidad y consentimiento comercial opcional. No se permite una única casilla que mezcle ambas finalidades.

## 9. Estados vacíos

- Sin proyectos: Proyectos y la sección Colaboraciones muestran estado honesto, no demo.
- Sin partners permitidos: se ocultan logos.
- Sin miembros de equipo: Quiénes somos muestra bloque corporativo.
- Sin servicios: se usan los seis servicios base aprobados.
- Sin legales validadas: bloqueo antes de producción.

## 10. Relación con vistas públicas

- Servicios alimenta `PUBLIC_03_SERVICIOS.md` y sección de landing.
- Proyectos alimenta `PUBLIC_04_PROYECTOS.md` y la sección de landing Colaboraciones.
- Quiénes somos alimenta `PUBLIC_10_QUIENES_SOMOS.md`.
- Legal/cookies alimenta `PUBLIC_07_LEGAL_COOKIES_PRIVACIDAD.md`.
- Settings alimenta `PUBLIC_09_LAYOUT_GLOBAL.md`.

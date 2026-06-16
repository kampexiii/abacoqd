# SEO, multilenguaje y legal — AbacoQD

Última revisión: 14 de junio de 2026.

Fuente de verdad de SEO, rutas ES/EN, slugs, `hreflang`, sitemap, robots, canonical, blog bilingüe y reglas legales/RGPD/cookies. La UX de las páginas legales vive en `07_VISTAS/PUBLIC_07_LEGAL_COOKIES_PRIVACIDAD.md`.

## 1. Multilenguaje ES/EN

### Idiomas

Solo español (`es`) e inglés (`en`). No se preparan otros idiomas.

### URLs públicas

| Vista | ES | EN |
|---|---|---|
| Home | `/` | `/en` |
| Metodología | `/metodologia` | `/en/methodology` |
| Servicios | `/servicios` | `/en/services` |
| Detalle servicio | `/servicios/{slug}` | `/en/services/{slug}` |
| Proyectos | `/proyectos` | `/en/projects` |
| Detalle proyecto | `/proyectos/{slug}` | `/en/projects/{slug}` |
| Quiénes somos | `/quienes-somos` | `/en/about` |
| Blog índice | `/blog` | `/en/blog` |
| Post | `/blog/{slug}` | `/en/blog/{slug}` |
| Contacto | `/contacto` | `/en/contact` |
| Reserva | `/reserva` | `/en/book` |
| Aviso legal | `/aviso-legal` | `/en/legal-notice` |
| Privacidad | `/privacidad` | `/en/privacy` |
| Cookies | `/cookies` | `/en/cookies` |

ES no lleva prefijo. EN usa `/en`. No se crean rutas alternativas públicas sin redirección documentada.

### Slugs

- Slug único dentro del tipo y del idioma.
- Sin tildes, corto, estable y descriptivo.
- Slug distinto permitido por idioma.
- Si cambia un slug publicado, requiere redirección 301.
- No se fuerza traducción si el contenido no existe.

### `hreflang`

Cada par traducido real emite:

- `hreflang="es"`;
- `hreflang="en"`;
- `hreflang="x-default"`.

No se emite `hreflang` a páginas inexistentes, borradores o traducciones incompletas.

### Selector de idioma

El selector conserva contexto si existe traducción equivalente. Si no existe, lleva al índice del tipo en el idioma destino (por ejemplo, de un proyecto sin EN a `/en/projects`).

## 2. SEO por tipo

### Reglas generales

- Cada página indexable tiene `title`, `description`, canonical, OG y `no_index` por idioma.
- El canonical apunta a la URL final del idioma actual.
- No se publican OG de proyectos, reseñas o logos sin permiso.
- Datos estructurados solo con información real.

### Home

H1 único en Hero. JSON-LD: `Organization` y `WebSite`. OG global de marca cuando esté aprobado.

### Servicios

Listado indexable. Detalles indexables solo si `is_detail_enabled=true`, estado publicado, contenido completo y SEO aprobado. JSON-LD `Service` sin precios si pago/condiciones no están cerrados.

### Proyectos

Listado indexable si hay contenido publicable suficiente. Si se lanza sin proyectos, puede usarse `noindex` temporal aunque la ruta exista. Detalles indexables solo con proyecto publicado, permisos cerrados y SEO completo. JSON-LD `CreativeWork` opcional; `Review` solo con reseña real.

### Blog bilingüe

Flujo previsto:

1. Crear post original.
2. Crear traducción ES/EN.
3. Relacionar con `translation_post_id`.
4. Definir slug, excerpt, contenido y SEO por idioma.
5. Publicar solo cuando el idioma activo esté completo.

El índice muestra posts del idioma activo. Los destacados de landing son por idioma. Sin posts publicados, blog puede ocultarse de topbar y quedar `noindex` temporal.

### Quiénes somos

Indexable en ES/EN. JSON-LD `AboutPage` + `Organization`; `parentOrganization` solo si la relación jurídica con Ábaco Developments se confirma. No se publican miembros, fechas, clientes ni cifras no validadas.

### Contacto y reserva

Indexables. `ContactPage` para contacto. Reserva sin `Offer`, precios ni disponibilidad si no están definidos.

Datos reales para `ContactPage`/`Organization` cuando se generen datos estructurados:

- Organización/titular: ABACO DIGITAL DEVELOPMENTS, S.L. (`ABACO` como nombre abreviado).
- CIF: B-88229364.
- Registro Mercantil: Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002.
- Dirección: Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid, España.
- Web canónica final: https://abacoqd.com/.
- Dominio histórico/investigado: https://abacodev.com/.
- URL legal histórica aportada: https://www.abacodev.com/.
- Teléfono: +34 91 020 00 89.
- Email principal: info@abacodev.com.
- WhatsApp/contacto directo Andrés: +34 647 51 81 00, como canal comercial/directo.

El teléfono `647 518 100` del aviso legal aportado se normaliza como `+34 647 51 81 00`. Está pendiente decidir si el teléfono legal visible principal será el fijo `+34 91 020 00 89` o `+34 647 51 81 00`.

### Legales

Aviso legal, privacidad y cookies son indexables de baja prioridad. Sin JSON-LD específico. `hreflang` cuando el par ES/EN esté validado.

### Errores

404, 500 y 503 siempre `noindex`, fuera de sitemap.

## 3. Sitemap, robots y canonical

### Sitemap

Estructura recomendada:

- `sitemap.xml` como índice.
- `sitemap-pages.xml`: home, metodología, servicios, proyectos, quiénes somos, contacto, reserva, legales.
- `sitemap-services.xml`: detalles de servicio publicados.
- `sitemap-projects.xml`: proyectos publicados.
- `sitemap-posts.xml`: posts publicados.

Excluye borradores, ocultos, demo no publicable, `noindex`, errores, admin, auth, dashboard y settings.

### Robots

Bloquear:

- `/admin`;
- `/dashboard`;
- `/settings`;
- rutas internas de auth sin valor SEO;
- endpoints privados.

Permitir rutas públicas indexables. Revisar antes de producción.

### Canonical

Cada página indexable declara canonical absoluto del idioma actual sobre `https://abacoqd.com/`. La política para `abacodev.com` queda pendiente: confirmar si redirige a `abacoqd.com`, si convive temporalmente o si queda como dominio anterior. No se documenta una redirección 301 definitiva hasta confirmación.

## 4. Legal, privacidad y cookies

Cumplimiento básico LSSI/RGPD. Hay texto base aportado por cliente para aviso legal, privacidad y cookies, pero queda marcado como **texto base aportado, pendiente de adaptación legal final a normativa vigente**. No se publica como definitivo sin revisión jurídica.

Advertencia documental: el texto base menciona `Ley Orgánica 15/1999` y `ficheros inscritos en la Agencia Española de Protección de Datos`. Esa redacción no debe quedar como base vigente final; debe adaptarse a RGPD, LOPDGDD 3/2018, LSSI-CE y criterios actuales de cookies de AEPD.

### Aviso legal

Datos confirmados para el aviso legal:

- Titular: ABACO DIGITAL DEVELOPMENTS, S.L.
- CIF: B-88229364.
- Domicilio: Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid, España.
- Registro Mercantil: Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002.
- Email: info@abacodev.com.
- Web canónica final del nuevo sitio: https://abacoqd.com/.
- URL legal histórica aportada: https://www.abacodev.com/.
- Dominio histórico/investigado: https://abacodev.com/.
- Teléfono: pendiente decidir si se muestra como principal `+34 91 020 00 89` o `+34 647 51 81 00`.

Debe completar objeto del sitio, propiedad intelectual, responsabilidad, condiciones de uso y legislación aplicable con revisión jurídica. No se publican placeholders.

El aviso legal final debe adaptarse al dominio definitivo `abacoqd.com`. El texto histórico aportado con `www.abacodev.com` solo queda como trazabilidad.

### Política de privacidad

Debe cubrir:

- responsable del tratamiento: ABACO DIGITAL DEVELOPMENTS, S.L.;
- contacto de privacidad: info@abacodev.com;
- dirección postal: Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid;
- datos de contacto recogidos en `contact_messages`;
- datos de reserva según proveedor;
- suscripción al blog (`blog_subscribers`) con double opt-in;
- finalidad y base jurídica;
- plazos de conservación;
- encargados/proveedores;
- derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad;
- reclamación ante AEPD;
- no envío de datos personales a analítica sin consentimiento.

Formularios: separar checkbox obligatorio de aceptación de política de privacidad y checkbox opcional de comunicaciones comerciales. No unir ambos consentimientos en una única casilla.

### Política de cookies

Texto base aportado: ABACO usa cookies para facilitar la navegación, distinguiendo cookies propias y cookies analíticas. Documentalmente no se afirma el uso final de analítica hasta confirmar herramienta real.

Estado base técnico previsto: cookies técnicas/necesarias de sesión, idioma, tema y preferencias de accesibilidad. La página `/cookies` existe siempre.

Si se añade analítica, tracking o embed de terceros:

- banner/gestión obligatorio;
- acciones `Aceptar`, `Rechazar` y `Configurar` con facilidad equivalente;
- guardar preferencias y permitir revocación posterior;
- scripts no técnicos bloqueados antes del consentimiento;
- separación clara entre cookies técnicas/necesarias y analíticas;
- categorías editables en `settings.cookies`;
- enlace permanente para gestionar cookies.

Recomendación documental de cierre: `GTM + GA4 + Search Console + CookieYes`. `Clarity` solo si se aprueba internamente y queda bloqueado hasta consentimiento.

### Consentimiento

Preferencia del usuario en cliente. Solo se propone tabla server-side si se requiere auditoría formal de consentimientos; ver decisión en `02_MODELO_DATOS.md`.

### Redes y `sameAs`

Publicar inicialmente solo LinkedIn cuando se cargue la URL validada. Facebook y otras redes no entran en `sameAs` ni en footer hasta validación interna. No inventar perfiles por coherencia visual.

## 5. Accesibilidad como SEO técnico

HTML semántico, un H1 por vista, jerarquía de headings, alt editable, contraste AA, foco visible, navegación por teclado, labels visibles, errores accesibles, `prefers-reduced-motion` y widget de accesibilidad. Detalle visual en `04_IDENTIDAD_UI_COMPONENTES.md` y `07_VISTAS/PUBLIC_09_LAYOUT_GLOBAL.md`.

## 6. Decisiones abiertas

- Confirmar teléfono legal visible principal.
- Proveedor de reserva y si requiere cookies/embeds.
- Stack definitivo de analítica/cookies y CMP.
- Revisión jurídica final de aviso legal, privacidad y cookies.
- Proyectos/logos publicables y permisos.
- Qué detalles de servicios quedan indexables el 30/06.

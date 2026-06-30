# SEO, multilenguaje y legal — AbacoQD

Última revisión: 28 de junio de 2026.

Fuente de verdad de SEO, rutas públicas, slugs, sitemap, robots, canonical y reglas legales/RGPD/cookies. La UX de las páginas legales vive en `07_VISTAS/PUBLIC_07_LEGAL_COOKIES_PRIVACIDAD.md`.

## 1. Idioma, lanzamiento y evolución EN

### Idiomas

El lanzamiento inicial queda orientado a SEO en español para clientes en España. No se considera bloqueo actual no tener `/en` real. El soporte EN queda como evolución futura no bloqueante, salvo decisión comercial posterior. No se publicarán versiones EN parciales como SEO real.

### URLs públicas

| Vista | Ruta actual |
|---|---|
| Home | `/` |
| Metodología | `/metodologia` |
| Servicios | `/servicios` |
| Detalle servicio | `/servicios/{slug}` |
| Proyectos | `/proyectos` |
| Detalle proyecto | `/proyectos/{slug}` |
| Quiénes somos | `/quienes-somos` |
| Blog índice | `/blog` |
| Post | `/blog/{slug}` |
| Contacto | `/contacto` |
| Reserva | `/reserva` |
| Aviso legal | `/aviso-legal` |
| Privacidad | `/privacidad` |
| Cookies | `/cookies` |

Si se activa EN en una fase posterior, deberá publicarse con URLs propias, traducciones completas, canonical y `hreflang` coherentes. Hasta entonces, no se documenta `/en` como alcance actual de lanzamiento.

### Slugs

- Slug único dentro del tipo y del idioma.
- Sin tildes, corto, estable y descriptivo.
- Slug distinto permitido por idioma.
- Si cambia un slug publicado, requiere redirección 301.
- No se fuerza traducción si el contenido no existe.

### `hreflang`

En el lanzamiento Spanish-first no se considera obligatorio emitir `hreflang` EN. Si se publica una versión inglesa real, cada par traducido completo deberá emitir `hreflang="es"`, `hreflang="en"` y `x-default`. Nunca se emite `hreflang` a páginas inexistentes, parciales o incompletas.

### Selector de idioma

Mientras no exista routing EN real, el cambio de idioma no se trata como requisito SEO. Si en el futuro se publica EN con URLs propias, el selector deberá conservar contexto cuando exista traducción equivalente y degradar de forma honesta cuando no exista.

## 2. SEO por tipo

### Reglas generales

- Cada página indexable tiene `title`, `description`, canonical, OG y `no_index` por idioma.
- El canonical apunta a la URL final del idioma actual.
- No se publican datos estructurados ni OG con información falsa o incompleta.
- Datos estructurados solo con información real.

### Home

H1 único en Hero. JSON-LD: `Organization` y `WebSite`. OG global de marca cuando esté aprobado.

### Servicios

Listado indexable. Detalles indexables solo si `is_detail_enabled=true`, estado publicado, contenido completo y SEO aprobado. JSON-LD `Service` sin precios si pago/condiciones no están cerrados.

### Proyectos

Listado indexable con el portfolio actual autorizado. Detalles indexables con proyecto publicado, contenido completo y SEO suficiente. JSON-LD `CreativeWork` opcional; `Review` solo con reseña real.

### Blog

El lanzamiento inicial puede operar solo en español. Si en el futuro se crea EN, deberá publicarse con traducción completa y SEO propio por URL. Sin posts publicados, blog puede ocultarse de topbar y quedar `noindex` temporal.

### Quiénes somos

Indexable en español. JSON-LD `AboutPage` + `Organization`. El equipo puede incluir CV público cuando forme parte del alcance confirmado. No se inventan miembros, fechas, clientes ni cifras.

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
- Email principal: info@abacoqd.com.
- WhatsApp/contacto directo Andrés: +34 647 51 81 00, como canal comercial/directo.

El teléfono `647 518 100` del aviso legal aportado se normaliza como `+34 647 51 81 00`. Está pendiente decidir si el teléfono legal visible principal será el fijo `+34 91 020 00 89` o `+34 647 51 81 00`.

### Legales

Aviso legal, privacidad y cookies son indexables de baja prioridad en español. Sin JSON-LD específico. Una versión EN solo se publica si existe traducción jurídica completa y validada.

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

Excluye borradores, ocultos, `noindex`, errores, admin, auth, dashboard y settings.

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

## 4.5 Correo operativo de contacto y reserva

El correo receptor definitivo para avisos es `info@abacoqd.com`. El envío real queda pendiente de configuración técnica en producción con estos datos:

- `SMTP host`
- `SMTP port`
- `SMTP username`
- `SMTP password` o app password
- `SMTP encryption`
- `MAIL_FROM_ADDRESS`
- `MAIL_FROM_NAME`
- `Reply-To` si aplica
- revisión SPF/DKIM/DMARC del dominio

## 4. Legal, privacidad y cookies

Cumplimiento básico LSSI/RGPD. Hay texto base aportado por cliente para aviso legal, privacidad y cookies, pero queda marcado como **texto base aportado, pendiente de adaptación legal final a normativa vigente**. No se publica como definitivo sin revisión jurídica.

Advertencia documental: el texto base menciona `Ley Orgánica 15/1999` y `ficheros inscritos en la Agencia Española de Protección de Datos`. Esa redacción no debe quedar como base vigente final; debe adaptarse a RGPD, LOPDGDD 3/2018, LSSI-CE y criterios actuales de cookies de AEPD.

### Aviso legal

Datos confirmados para el aviso legal:

- Titular: ABACO DIGITAL DEVELOPMENTS, S.L.
- CIF: B-88229364.
- Domicilio: Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid, España.
- Registro Mercantil: Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002.
- Email: info@abacoqd.com.
- Web canónica final del nuevo sitio: https://abacoqd.com/.
- URL legal histórica aportada: https://www.abacodev.com/.
- Dominio histórico/investigado: https://abacodev.com/.
- Teléfono: pendiente decidir si se muestra como principal `+34 91 020 00 89` o `+34 647 51 81 00`.

Debe completar objeto del sitio, propiedad intelectual, responsabilidad, condiciones de uso y legislación aplicable con revisión jurídica. No se publican placeholders.

El aviso legal final debe adaptarse al dominio definitivo `abacoqd.com`. El texto histórico aportado con `www.abacodev.com` solo queda como trazabilidad.

### Política de privacidad

Debe cubrir:

- responsable del tratamiento: ABACO DIGITAL DEVELOPMENTS, S.L.;
- contacto de privacidad: info@abacoqd.com;
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
- Recibir los datos SMTP corporativos para contacto y reserva.
- Decidir si en una fase posterior se publica EN real con URLs propias.

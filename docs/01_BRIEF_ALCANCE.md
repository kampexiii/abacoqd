# Brief y alcance — AbacoQD

Última revisión: 28 de junio de 2026.

Fuente de verdad de producto, marca, alcance y decisiones comerciales. Si un documento anterior contradice este brief, prevalece este brief.

## 1. Qué es AbacoQD

| Campo | Valor |
|---|---|
| Nombre | AbacoQD |
| Nombre extendido | Ábaco Quick Developments |
| Marca pública del sitio | AbacoQD |
| Razón social | ABACO DIGITAL DEVELOPMENTS, S.L. solo en legales |
| Dominio canónico final | `https://abacoqd.com/` |
| Dominio histórico / investigado | `https://abacodev.com/` |
| URL legal histórica aportada | `https://www.abacodev.com/` |
| Política de redirección | por confirmar |
| Origen | Iniciativa empresarial bajo ABACO DIGITAL DEVELOPMENTS, S.L. |
| Claim base | Desarrollo a medida rápido y seguro |

AbacoQD desarrolla soluciones digitales rápidas y a medida: webs, aplicaciones, automatizaciones, integraciones, CRM/procesos, MVPs y herramientas internas. La propuesta se apoya en herramientas modernas, procesos propios y criterio técnico senior.

La web debe comunicar rapidez sin improvisación: procesos claros, control técnico, seguridad, accesibilidad, SEO y entrega cuidada.

Decisión de cierre: la **marca pública final del sitio es AbacoQD**. `ABACO DIGITAL DEVELOPMENTS, S.L.` queda reservada para textos legales y contexto societario. `Abaco Developments` puede aparecer como contexto empresarial o histórico cuando proceda, pero no sustituye la marca visible principal.

### Datos corporativos y de contacto confirmados

| Tipo | Valor |
|---|---|
| Titular del sitio | ABACO DIGITAL DEVELOPMENTS, S.L. |
| Nombre abreviado | ABACO |
| CIF | B-88229364 |
| Domicilio | Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid, España |
| Registro Mercantil | Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002 |
| Web canónica final | https://abacoqd.com/ |
| Dominio histórico / investigado | https://abacodev.com/ |
| URL legal histórica aportada | https://www.abacodev.com/ |
| Teléfono fijo público | +34 91 020 00 89 |
| WhatsApp de atención comercial | +34 647 51 81 00 |
| Email principal | info@abacoqd.com |
| Email secundario/general | abacodevelopments@gmail.com |
| Email de contacto comercial adicional | andrescasanueva@abacodev.com |

El teléfono antiguo `647 518 100` del aviso legal aportado se normaliza como `+34 647 51 81 00`. Queda por definir si el teléfono legal visible principal será el fijo `+34 91 020 00 89` o el canal de atención comercial `+34 647 51 81 00`.

### Datos institucionales aportados

No se tratan como clientes ni proyectos. Se documentan como distintivos institucionales/financiación en `settings.institutional` o `settings.branding`, con ubicación final por definir:

- be now Partner.
- Cofinanciado por la Unión Europea.
- Fondos Europeos.
- Texto: `Cofinanciado por la Unión Europea (FSE+) Subvención para la contratación de jóvenes - Comunidad de Madrid.`

## 2. Producto completo del 30/06

El entregable del 30/06 no es una versión mínima. El producto base incluye:

- Landing completa.
- Metodología / proceso.
- Servicios.
- Proyectos.
- Quiénes somos.
- Blog.
- Contacto.
- Reserva agnóstica con fallback a contacto.
- Aviso legal.
- Política de privacidad.
- Política de cookies.
- Errores 404/500/503.
- Panel admin ajustado al alcance funcional actual.
- SEO principal en español orientado a España.
- Chatbot/asistente.
- Widget de accesibilidad.
- Tema claro/oscuro/sistema.
- Datos corporativos editables.

Decisión de lanzamiento:

- El lanzamiento inicial es **Spanish-first**.
- No se considera bloqueo actual no tener `/en` real.
- El inglés queda como evolución futura no bloqueante.
- Solo se considerará una versión EN como SEO real si tiene rutas propias, traducción completa, canonical, `hreflang` y sitemap coherentes.

## 3. Landing y navegación pública

Orden obligatorio de landing:

1. Hero.
2. Metodología / Cómo trabajamos.
3. Servicios.
4. Colaboraciones.
5. Blog.
6. CTA final.
7. Footer.

Topbar pública final:

Logo → Inicio, Metodología, Servicios, Proyectos, Quiénes somos, Blog, Contacto, selector de idioma, toggle claro/oscuro/sistema.

No hay botón `Reservar` en topbar. La reserva aparece en Hero, CTA final y bloques contextuales.

## 4. Piezas públicas

### Metodología

Sección en landing y página `/metodologia`. Debe explicar el proceso, pasos, animación, bloque de estudio inicial y relación con `methodology_steps`. Una ruta EN solo entra si se publica una versión inglesa completa en una fase posterior.

### Servicios

Vista propia `/servicios` y detalle preparado `/servicios/{slug}`. Servicios iniciales:

- Desarrollo web rápido.
- Aplicaciones a medida.
- Automatización con IA.
- CRM, datos y procesos.
- Integraciones digitales.
- MVPs y prototipos.

Servicios vive en `services`. No se usa el concepto activo "Tipologías".

### Proyectos (sección de landing: Colaboraciones)

Vista propia `/proyectos` y detalle `/proyectos/{slug}`. Nombre público de topbar y página: **Proyectos**. En la landing, la sección equivalente con logos/empresas/trabajos se llama **Colaboraciones**. No se usa "Portafolios" como término público.

Internamente se alimenta de:

- `partners`: empresas, marcas, clientes y colaboradores;
- `projects`: proyectos/trabajos;
- `partner_project`: relación y rol.

El portfolio cargado se considera **contenido real autorizado** para la web inicial. Los proyectos, marcas, logos y referencias visibles forman parte del portfolio que se va a mostrar. Solo se marcarán como pendientes aquellos elementos que se indiquen expresamente.

### Blog

Blog con índice, detalle de post, categorías, tags y destacados en landing. El lanzamiento inicial se orienta al contenido en español; el soporte EN queda como evolución futura no bloqueante. No se publican artículos inventados como reales.

### Quiénes somos

Vista propia `/quienes-somos` y elemento de topbar. Cuenta el origen de AbacoQD, su modo de trabajo y el equipo real. La sección de equipo puede incluir foto, cargo, biografía breve, LinkedIn, GitHub/repositorio y CV cuando se haya solicitado dentro del alcance. Pendiente real actual: falta la foto de Mohamed.

### Contacto y reserva

Contacto recoge mensajes en `contact_messages`. Reserva usa el sistema propio de citas del proyecto y fallback a contacto/WhatsApp cuando proceda. El correo receptor definitivo de avisos es `info@abacoqd.com`.

Pendiente técnico real para avisos:

- `SMTP host`
- `SMTP port`
- `SMTP username`
- `SMTP password` o app password
- `SMTP encryption`
- `From address`
- `From name`
- `Reply-To` si aplica
- revisión SPF/DKIM/DMARC en producción

### Legal y cookies

Aviso legal, privacidad y cookies son páginas reales. El texto base legal aportado por cliente queda como fuente histórica y borrador técnico, no como texto definitivo: menciona normativa antigua (`Ley Orgánica 15/1999` y ficheros inscritos en AEPD) y debe adaptarse a RGPD, LOPDGDD 3/2018, LSSI-CE y criterios actuales de cookies de AEPD antes de publicación final.

El aviso legal antiguo menciona `https://www.abacodev.com/`. El nuevo sitio AbacoQD usa como dominio final `https://abacoqd.com/`. Falta adaptar el aviso legal final al dominio definitivo y confirmar la política de `abacodev.com`.

Analítica/cookies: no asumir stack heredado. Recomendación documental: `GTM + GA4 + Search Console + CookieYes`; añadir `Clarity` solo si se aprueba internamente y queda bloqueado hasta consentimiento. El banner debe permitir aceptar, rechazar, configurar, guardar preferencias y revocar consentimiento.

Los formularios separan dos consentimientos: checkbox obligatorio de política de privacidad y checkbox opcional para comunicaciones comerciales.

### Copy base recomendado

Pendiente de aprobación final del copy base en español. La columna EN queda como referencia de una posible fase futura, no como requisito de lanzamiento actual:

| Bloque | ES | EN |
|---|---|---|
| Hero | Consultoría tecnológica, CRM e IA aplicada para proyectos que convierten datos en negocio. | Technology consulting, CRM and applied AI for projects that turn data into growth. |
| Subhero | Diseñamos y ejecutamos soluciones de fidelización, CRM, analítica y desarrollo digital para empresas que necesitan estructura, medición y escalabilidad. | We design and deliver loyalty, CRM, analytics and digital development solutions for companies that need structure, measurement and scalability. |
| CTA principal | Reserva una primera sesión. | Book an initial session. |
| CTA secundario | Ver casos y capacidades. | See capabilities and case references. |
| Contacto | Cuéntanos tu proyecto y te responderemos con una propuesta de enfoque, alcance y próximos pasos. | Tell us about your project and we will reply with an initial approach, scope and suggested next steps. |

### Admin

El panel admin final se considera válido en su **alcance funcional actual**. No se toma como fallo que no existan módulos antiguos descartados. La documentación de detalle del admin debe reflejar lo que hoy permite gestionar realmente y mover el resto a mejora futura.

## 5. Reglas duras

- No tocar código ni migraciones en fases documentales.
- No inventar clientes, proyectos, reseñas, métricas, logos, precios ni disponibilidad.
- No documentar como implementado lo que aún no existe.
- `services` es la única entidad de servicios.
- `partners` es la entidad unificada para empresas/marcas/clientes/colaboradores.
- Proyectos (página) y la sección Colaboraciones no quedan archivados ni como futuro: son producto activo.
- Quiénes somos forma parte del producto 30/06 y de la topbar.
- Pago/condiciones: por definir.
- Estudio inicial: publicar solo si se delimita como sesión inicial gratuita de 45-60 minutos para diagnóstico y encaje, sin auditoría profunda ni presupuesto cerrado salvo fase posterior.
- CTA final de landing: diseño, estructura, mockup de editor/código, botones, badges, composición claro/oscuro y titular `El 40% del tiempo de un desarrollador se pierde manteniendo código.` aprobados por cliente.

## 6. Estado real del proyecto

Existe en código: Laravel 13, Inertia, React 19, TypeScript, Tailwind 4, Vite, páginas públicas principales, formularios de contacto y reserva, base SEO, panel admin y CRUDs de contenido ya integrados en la aplicación.

Quedan sujetos a cierre funcional o documental: la actualización de la propia documentación activa, la revisión jurídica final de los textos legales si procede, la configuración SMTP real y la QA final técnico/visual/responsive.

## 7. Pendientes reales de cierre

| Tema | Estado |
|---|---|
| Foto de Mohamed | pendiente de Andrés |
| Datos SMTP para avisos a `info@abacoqd.com` | pendiente de Andrés |
| Configuración SMTP / `.env` real | pendiente técnico cuando lleguen los datos |
| QA final técnico, visual y responsive | pendiente técnico |
| `npm run types:check`, `npm run lint:check`, `npm run build`, `composer test` | pendiente de ejecución final |
| Dominio/env de producción (`APP_ENV=production`, `APP_DEBUG=false`, cookies seguras) | pendiente de producción |
| SPF/DKIM/DMARC y revisión legal final si procede | pendiente de producción/legal |

## 8. Gobernanza documental

Lectura obligatoria antes de cambios grandes:

1. `docs/00_INDICE.md`
2. `docs/01_BRIEF_ALCANCE.md`
3. `docs/02_MODELO_DATOS.md`
4. `docs/05_ARQUITECTURA_ADMIN.md`
5. `docs/06_BACKLOG_IMPLEMENTACION.md`

No se crean documentos capa. Las decisiones se integran en su fuente de verdad.

# Brief y alcance — AbacoQD

Última revisión: 14 de junio de 2026.

Fuente de verdad de producto, marca, alcance y decisiones comerciales. Si un documento anterior contradice este brief, prevalece este brief.

## 1. Qué es AbacoQD

| Campo | Valor |
|---|---|
| Nombre | AbacoQD |
| Nombre extendido | Ábaco Quick Developments |
| Marca pública del sitio | Abaco Developments |
| Razón social | ABACO DIGITAL DEVELOPMENTS, S.L. solo en legales |
| Dominio canónico final | `https://abacoqd.com/` |
| Dominio histórico / investigado | `https://abacodev.com/` |
| URL legal histórica aportada | `https://www.abacodev.com/` |
| Política de redirección | pendiente de confirmar |
| Origen | Iniciativa de Ábaco Developments |
| Claim base | Desarrollo a medida rápido y seguro |

AbacoQD desarrolla soluciones digitales rápidas y a medida: webs, aplicaciones, automatizaciones, integraciones, CRM/procesos, MVPs y herramientas internas. La propuesta se apoya en IA, vibe coding supervisado, herramientas internas propias y criterio técnico senior.

La web debe comunicar rapidez sin improvisación: procesos claros, control técnico, seguridad, accesibilidad, SEO y entrega cuidada.

Decisión de cierre: aunque la documentación interna conserva el nombre AbacoQD para el proyecto, la **marca visible del sitio público debe ser Abaco Developments** salvo decisión posterior explícita. No usar `ABACO DIGITAL DEVELOPMENTS, S.L.` como marca comercial fuera de textos legales.

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
| WhatsApp / contacto directo Andrés | +34 647 51 81 00 |
| Email principal | info@abacodev.com |
| Email secundario/general | abacodevelopments@gmail.com |
| Email contacto Andrés | andrescasanueva@abacodev.com |

El teléfono antiguo `647 518 100` del aviso legal aportado se normaliza como `+34 647 51 81 00`. Queda pendiente decidir si el teléfono legal visible principal será el fijo `+34 91 020 00 89` o el WhatsApp/contacto directo `+34 647 51 81 00`.

### Datos institucionales aportados

No se tratan como clientes ni proyectos. Se documentan como distintivos institucionales/financiación en `settings.institutional` o `settings.branding`, con ubicación final pendiente:

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
- Panel admin completo.
- ES/EN.
- SEO por idioma.
- Chatbot/asistente.
- Widget de accesibilidad.
- Tema claro/oscuro/sistema.
- Datos corporativos editables.

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

Sección en landing y página `/metodologia` (`/en/methodology`). Debe explicar el proceso, pasos, animación, bloque de estudio inicial y relación con `methodology_steps`.

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

Solo se publican proyectos, logos y reseñas con permiso. Si no hay contenido real, se muestra estado vacío honesto.

### Blog

Blog bilingüe con índice, detalle de post, categorías, tags, destacados en landing, slug y SEO por idioma. No se publican artículos inventados como reales.

### Quiénes somos

Vista propia `/quienes-somos` (`/en/about`) y elemento de topbar. Cuenta el origen de AbacoQD, su relación con Ábaco Developments, el modo de trabajo y el equipo si hay miembros publicables. No inventa equipo, fechas, clientes ni cifras.

### Contacto y reserva

Contacto recoge mensajes en `contact_messages`. Reserva usa `booking_settings` y fallback a contacto/WhatsApp. El contacto público usa email principal y dirección confirmada. El teléfono público principal queda pendiente entre el fijo y el WhatsApp/contacto directo.

Proveedor de reserva: no asumir integración heredada. Recomendación documental: `Cal.com` si el sitio no depende de WordPress; `Calendly` si prima salida rápida; `Amelia` solo si el stack final fuera WordPress.

### Legal y cookies

Aviso legal, privacidad y cookies son páginas reales. El texto base legal aportado por cliente queda como fuente histórica y borrador técnico, no como texto definitivo: menciona normativa antigua (`Ley Orgánica 15/1999` y ficheros inscritos en AEPD) y debe adaptarse a RGPD, LOPDGDD 3/2018, LSSI-CE y criterios actuales de cookies de AEPD antes de publicación final.

El aviso legal antiguo menciona `https://www.abacodev.com/`. El nuevo sitio AbacoQD usa como dominio final `https://abacoqd.com/`. Pendiente: adaptar el aviso legal final al dominio definitivo y confirmar si `abacodev.com` redirigirá, convivirá temporalmente o quedará como dominio anterior.

Analítica/cookies: no asumir stack heredado. Recomendación documental: `GTM + GA4 + Search Console + CookieYes`; añadir `Clarity` solo si se aprueba internamente y queda bloqueado hasta consentimiento. El banner debe permitir aceptar, rechazar, configurar, guardar preferencias y revocar consentimiento.

Los formularios separan dos consentimientos: checkbox obligatorio de política de privacidad y checkbox opcional para comunicaciones comerciales.

### Copy base recomendado

Pendiente de aprobación final ES/EN, pero el cierre documental permite usar esta base sin prometer datos no verificados:

| Bloque | ES | EN |
|---|---|---|
| Hero | Consultoría tecnológica, CRM e IA aplicada para proyectos que convierten datos en negocio. | Technology consulting, CRM and applied AI for projects that turn data into growth. |
| Subhero | Diseñamos y ejecutamos soluciones de fidelización, CRM, analítica y desarrollo digital para empresas que necesitan estructura, medición y escalabilidad. | We design and deliver loyalty, CRM, analytics and digital development solutions for companies that need structure, measurement and scalability. |
| CTA principal | Reserva una primera sesión. | Book an initial session. |
| CTA secundario | Ver casos y capacidades. | See capabilities and case references. |
| Contacto | Cuéntanos tu proyecto y te responderemos con una propuesta de enfoque, alcance y próximos pasos. | Tell us about your project and we will reply with an initial approach, scope and suggested next steps. |

### Admin

El panel admin cubre dashboard, CRUDs, ES/EN, marca/settings, servicios, proyectos, partners, blog, suscriptores, mensajes, reserva, SEO, legal/cookies, chatbot/FAQ, usuarios/roles y accesibilidad/settings si procede.

## 5. Reglas duras

- No tocar código ni migraciones en fases documentales.
- No inventar clientes, proyectos, reseñas, métricas, logos, precios ni disponibilidad.
- No documentar como implementado lo que aún no existe.
- `services` es la única entidad de servicios.
- `partners` es la entidad unificada para empresas/marcas/clientes/colaboradores.
- Proyectos (página) y la sección Colaboraciones no quedan archivados ni como futuro: son producto activo.
- Quiénes somos forma parte del producto 30/06 y de la topbar.
- Pago/condiciones: pendiente de definir.
- Estudio inicial: publicar solo si se delimita como sesión inicial gratuita de 45-60 minutos para diagnóstico y encaje, sin auditoría profunda ni presupuesto cerrado salvo fase posterior.
- CTA final de landing: diseño, estructura, mockup de editor/código, botones, badges, composición claro/oscuro y titular `El 40% del tiempo de un desarrollador se pierde manteniendo código.` aprobados por cliente.

## 6. Estado real del proyecto

Existe en código: Laravel 13, Inertia, React 19, TypeScript, Tailwind 4, Vite, auth/settings del starter, ruta `/`, hero avanzado, i18n básico de interfaz y dashboard base.

No existe todavía en código: modelo de negocio AbacoQD, migraciones de contenido, admin editorial, CRUDs de negocio, blog real, proyectos reales, contacto persistido, reserva real, SEO dinámico ni páginas legales finales.

## 7. Pendientes comerciales

| Tema | Estado |
|---|---|
| Teléfono legal visible principal | pendiente |
| Redirección/convivencia de `abacodev.com` | pendiente |
| Proveedor de reserva | pendiente |
| Herramienta de analítica/cookies y CMP definitiva | pendiente |
| Revisión jurídica final de aviso legal, privacidad y cookies | pendiente |
| Ubicación obligatoria de logos UE/FSE+/Fondos Europeos | pendiente |
| Política final del estudio inicial gratuito | pendiente |
| Proyectos/logos publicables | pendiente |
| Copy final ES/EN restante | pendiente |
| Redes sociales reales | LinkedIn publicable cuando se cargue URL validada; Facebook/resto pendientes |
| Horarios | pendiente |

## 8. Gobernanza documental

Lectura obligatoria antes de cambios grandes:

1. `docs/00_INDICE.md`
2. `docs/01_BRIEF_ALCANCE.md`
3. `docs/02_MODELO_DATOS.md`
4. `docs/05_ARQUITECTURA_ADMIN.md`
5. `docs/06_BACKLOG_IMPLEMENTACION.md`

No se crean documentos capa. Las decisiones se integran en su fuente de verdad.

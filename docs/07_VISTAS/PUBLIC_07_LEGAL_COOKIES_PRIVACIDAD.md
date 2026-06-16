# PUBLIC_07 — Legal, cookies y privacidad

Última revisión: 14 de junio de 2026.

Fuente de verdad de la maquetación y funcionamiento de las páginas legales públicas: Aviso legal, Política de privacidad, Política de cookies y banner/gestión de consentimiento si aplica. El contenido jurídico y las reglas RGPD/LSSI viven en `03_SEO_MULTILENGUAJE_LEGAL.md`.

## Identificación

| Página | Ruta ES | Ruta EN | Prioridad |
|---|---|---|---|
| Aviso legal | `/aviso-legal` | `/en/legal-notice` | P0 |
| Política de privacidad | `/privacidad` | `/en/privacy` | P0 |
| Política de cookies | `/cookies` | `/en/cookies` | P0 |
| Banner/gestión cookies | global, condicional | global, condicional | P0 si hay cookies no técnicas |

| Campo | Valor |
|---|---|
| Componente previsto | plantilla común `LegalPage` + `CookieConsent` condicional |
| Entidades | `page_sections`, `settings.legal`, `settings.cookies`, `seo_metadata` |
| Fuente visual | `04_IDENTIDAD_UI_COMPONENTES.md` |

## Objetivo

Ofrecer páginas legales claras, localizadas ES/EN y accesibles, sin convertirlas en una pieza comercial. El usuario debe poder consultar titularidad, privacidad, cookies y consentimiento desde footer y desde cualquier flujo que recoja datos.

## Estructura común de las tres páginas

1. **Cabecera compacta.** Fondo `qd-mist`; breadcrumb; H1 específico; fecha de última actualización; selector de idioma si existe traducción.
2. **Cuerpo legal.** Columna de lectura de 70ch, prose con H2/H3, listas, enlaces y tablas.
3. **Índice lateral.** Sticky en desktop si hay 4+ apartados; colapsado en mobile.
4. **Bloque de contacto.** Muestra datos confirmados desde `settings`: ABACO DIGITAL DEVELOPMENTS, S.L., CIF B-88229364, domicilio, email principal, dominio canónico final `https://abacoqd.com/` y teléfono legal visible cuando se confirme el principal.
5. **Enlaces cruzados.** Aviso legal, privacidad, cookies y contacto.
6. **Footer global.**

## Estado jurídico del contenido

El cliente ha aportado texto base para aviso legal, privacidad y cookies. Ese texto se conserva como fuente histórica y **borrador técnico pendiente de adaptación legal final a normativa vigente**. No se publica como definitivo si mantiene referencias antiguas a `Ley Orgánica 15/1999` o a `ficheros inscritos en la Agencia Española de Protección de Datos`.

La versión final debe revisarse contra RGPD, LOPDGDD 3/2018, LSSI-CE y criterios actuales de cookies de AEPD. Esta documentación no sustituye asesoramiento jurídico.

## Aviso legal

**Objetivo.** Identificar titular, objeto del sitio, propiedad intelectual, responsabilidades y legislación aplicable.

**Datos confirmados.**

- Titular: ABACO DIGITAL DEVELOPMENTS, S.L.
- CIF: B-88229364.
- Domicilio: Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid, España.
- Registro Mercantil: Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002.
- Email: info@abacodev.com.
- Web canónica final: https://abacoqd.com/.
- URL legal histórica aportada: https://www.abacodev.com/.
- Dominio histórico/investigado: https://abacodev.com/.
- Teléfono normalizado disponible: +34 647 51 81 00; pendiente decidir si el teléfono legal visible principal será este o el fijo +34 91 020 00 89.

**Contenido editable.** Datos del titular, objeto del sitio, propiedad intelectual, responsabilidad, condiciones de uso, legislación aplicable, textos aprobados y fecha de actualización. No se publican placeholders.

El aviso legal antiguo menciona `https://www.abacodev.com/`; el aviso legal final debe adaptarse al dominio `https://abacoqd.com/`. Queda pendiente confirmar si `abacodev.com` redirigirá, convivirá temporalmente o quedará como dominio anterior.

**SEO.** Indexable, baja prioridad en sitemap, title simple por idioma, `hreflang` ES/EN.

## Política de privacidad

**Objetivo.** Explicar qué datos se recogen y con qué base legal: contacto, reserva, suscripción al blog y posibles comunicaciones.

**Datos confirmados.** Responsable: ABACO DIGITAL DEVELOPMENTS, S.L.; email de privacidad: info@abacodev.com; dirección postal: Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid.

**Contenido editable.** Responsable, finalidades, base jurídica, plazos de conservación, encargados/proveedores, derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad, canal de ejercicio y reclamación ante AEPD.

**Interacción relacionada.** Formulario de contacto y suscripción enlazan aquí en sus checkboxes de consentimiento. Los formularios separan privacidad obligatoria y comunicaciones comerciales opcionales; nunca se publica una única casilla que mezcle ambas cosas.

**SEO.** Indexable, baja prioridad; sin datos estructurados especiales.

## Política de cookies

**Objetivo.** Explicar cookies técnicas/necesarias y, si se activan, analítica/embeds de terceros.

**Texto base aportado.** ABACO usa cookies para facilitar la navegación, con referencia a cookies propias y analíticas. No se afirma el uso final de cookies analíticas hasta confirmar la herramienta real.

**Contenido editable.** Tabla de cookies con nombre, proveedor, finalidad, duración y tipo. Mientras solo existan cookies técnicas de sesión/tema/idioma/accesibilidad, la página lo declara de forma simple. Si se activa analítica, la tabla debe separar cookies técnicas/necesarias y cookies analíticas, y las analíticas quedan bloqueadas hasta consentimiento.

**SEO.** Indexable, baja prioridad; `hreflang` ES/EN.

## Banner y gestión de cookies

Condicional: aparece si se añade analítica, tracking o embed de reserva de terceros con cookies no técnicas.

**Estructura visual.**

- Banda inferior no intrusiva o modal compacto de configuración.
- Acciones equivalentes: `Aceptar`, `Rechazar`, `Configurar`.
- Panel de preferencias por categorías: necesarias, analítica, terceros/embeds.
- Enlace permanente en footer: `Gestionar cookies` cuando haya consentimiento configurable.
- Recomendación documental si se usa ecosistema Google: CookieYes como CMP base; OneTrust solo si el marco legal/marketing crece; Complianz si el stack final fuera WordPress.

**Interacción.**

- Rechazar debe ser tan fácil como aceptar.
- No se cargan scripts no técnicos antes del consentimiento.
- La elección se guarda de forma persistente y revocable.
- Si solo hay cookies técnicas, no se muestra banner, pero la política de cookies sigue accesible.

## Desktop

Cabecera de ancho completo, cuerpo con índice lateral y enlaces cruzados al pie. Tablas legales con scroll horizontal controlado solo si no caben.

## Mobile

Índice colapsado antes del cuerpo; tablas adaptadas o con scroll visible; banner de cookies en bloque inferior con botones apilados.

## Modos claro, oscuro y sistema

Claro: cabecera `qd-mist`, cuerpo blanco, enlaces teal oscurecido. Oscuro: fondos `qd-ink`/`qd-surface`, prose clara, tablas con borde visible. Modo sistema hereda la preferencia global.

## Animaciones propias

Sin animaciones decorativas. Solo fade inicial opcional y transición de apertura del panel de cookies. Reduced motion elimina transiciones.

## Componentes usados

`LegalPage`, prose, breadcrumb, índice `nav`, tabla legal, enlaces cruzados, `CookieConsent`, botones primario/secundario y footer global.

## Contenido editable

H1, fecha de actualización, cuerpo legal de cada página, datos del titular, tabla de cookies, categorías de consentimiento y textos del banner/panel. Todo en ES/EN y sin placeholders públicos. Los datos legales confirmados se cargan desde `settings.legal` y `settings.company`.

## Entidades relacionadas

`page_sections`, `settings.legal`, `settings.cookies` y `seo_metadata`.

## SEO y multilenguaje

Aviso legal, privacidad y cookies tienen title/description simples por idioma, canonical propio, `hreflang` cuando exista par ES/EN y prioridad baja en sitemap. Sin datos estructurados especiales.

## Estados vacíos

- Texto legal sin revisión jurídica final: la página no se publica como definitiva; puede quedar como borrador interno.
- Teléfono legal visible principal sin decidir: mostrar solo contacto general si se aprueba o bloquear el aviso legal final hasta decidir.
- Sin cookies no técnicas: sin banner, pero `/cookies` existe y explica las técnicas.
- Sin traducción aprobada: no se emite `hreflang` para esa página hasta tener par real.

## Accesibilidad

Jerarquía H1/H2/H3 estricta, tablas con `th`/`scope`, índice como `nav` con label, botones de cookies con foco visible, panel con focus trap, escape para cerrar configuración y textos comprensibles.

## Relación con chatbot

El chatbot puede responder preguntas frecuentes sobre privacidad/cookies y enlazar a estas páginas, pero no sustituye el texto legal ni recopila datos personales sin consentimiento.

## Decisiones abiertas

- Confirmar teléfono legal visible principal.
- Quién valida jurídicamente los textos legales.
- Stack definitivo de analítica/cookies y proveedor de gestión de consentimiento.
- Proveedor de reserva y necesidad real de banner de cookies.
- Cookies reales antes de publicación.

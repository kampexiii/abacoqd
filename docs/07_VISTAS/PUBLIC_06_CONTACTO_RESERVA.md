# Vista pública — Contacto y Reserva

Última revisión: 14 de junio de 2026. Documento consolidado (contacto + reserva).

## Identificación

| Campo | Contacto | Reserva |
|---|---|---|
| Ruta ES | `/contacto` | `/reserva` |
| Ruta EN | `/en/contact` | `/en/book` |
| Prioridad | Base (producto definitivo 30/06) | Base |
| Componente previsto | `resources/js/pages/Public/Contact.tsx` | `resources/js/pages/Public/Booking.tsx` |
| Entidades | `contact_messages`, `booking_settings`, `settings` | `booking_settings`, `settings` |

Modelo de datos en `docs/02_MODELO_DATOS.md` (no se redefine). Paleta y componentes en `04_IDENTIDAD_UI_COMPONENTES.md`.

> La reserva es **agnóstica al proveedor** vía `booking_settings`, con **fallback al formulario de contacto**. No hay sistema de reservas propio. **No hay ítem `Reserva`/`Reservar` en la topbar** (ver `PUBLIC_09_LAYOUT_GLOBAL.md`): los CTA de reserva viven en hero, CTA final y bloques contextuales.

## Datos de contacto confirmados

- Teléfono fijo disponible: +34 91 020 00 89.
- WhatsApp / contacto directo Andrés: +34 647 51 81 00.
- Email principal: info@abacodev.com.
- Email secundario/general: abacodevelopments@gmail.com.
- Email contacto Andrés: andrescasanueva@abacodev.com.
- Dirección: Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid, España.

El WhatsApp de Andrés es canal comercial/directo y no dato legal. El email principal es el contacto público preferente. El teléfono principal único queda pendiente de confirmación: no se debe presentar el fijo y el móvil como equivalentes si la empresa decide priorizar solo uno.

---

# A. Contacto

## Objetivo

Canal para quien quiere explicar su proyecto en texto, sin agendar todavía. Convive con la reserva y cierra el bucle contacto↔reserva. Vista corta, clara y sin fricción.

## Estructura visual

Bandas: `mist (cabecera) → white (formulario) → ink (footer)`. Inputs con borde `qd-mist`, focus ring teal; el único lime es el CTA.

1. **Cabecera compacta** — fondo `qd-mist`; H1 `Cuéntanos tu proyecto`; subcopy de una línea (`Escríbenos y te respondemos lo antes posible.`).
2. **Layout principal** — 2 columnas (desktop) / apilado (mobile):
   - **Izquierda (40%) — contexto:** qué pasa al escribir (lo leemos, lo valoramos, te contestamos con un primer enfoque); bloque alternativo de reserva (`¿Prefieres hablar directamente?` + botón lime `Reserva hora →`); datos confirmados: email principal, teléfono fijo, WhatsApp directo de Andrés y dirección completa; microconfianza (respuesta humana, sin spam, datos tratados según privacidad con enlace).
   - **Derecha (60%) — formulario** → escribe en `contact_messages`.
   - **Mapa/dirección si aplica:** solo si hay dirección pública confirmada en `settings.company`. Por defecto se muestra dirección textual; mapa embebido solo con consentimiento si implica terceros/cookies.
3. **Footer global**.

### Campos del formulario (`contact_messages`)

| Campo | Tipo | Requerido |
|---|---|---|
| Nombre | text | sí |
| Empresa | text | no |
| Email | email | sí |
| Teléfono | tel | no |
| Servicio de interés | select de servicios + opción `Otro / no lo sé` | no |
| Mensaje | textarea (placeholder con guía: qué necesitas, para qué proceso, plazos) | sí |
| Consentimiento privacidad | checkbox con enlace a `/privacidad` | sí |
| Comunicaciones comerciales | checkbox opcional separado | no |
| Honeypot | campo oculto anti-bots | — |

- Select de **servicio de interés** preseleccionable vía `?servicio={slug}` (llegada desde Servicios). "Tipologías" está muerto; se usa "Servicios".
- El consentimiento de privacidad y el consentimiento comercial no se mezclan: privacidad es obligatorio para enviar; comunicaciones comerciales es opcional, revocable y sin preselección.
- Botón enviar: lime, ancho completo en mobile, `Enviar mensaje →`.

### WhatsApp

- Acceso directo a WhatsApp con el número confirmado `+34 647 51 81 00`, etiquetado como **WhatsApp / contacto directo Andrés** o **WhatsApp de atención comercial**. Aparece como enlace/botón secundario en la columna de contexto y, si procede, como botón flotante coordinado con el layout global. No se trata como dato legal.

## Desktop

- 2 columnas 40/60; formulario a la derecha.

## Mobile

- Apilado: contexto arriba, formulario debajo; botón enviar a ancho completo.

## Animaciones propias

- Microinteracciones de foco (borde 150 ms), check de éxito (teal→lime ~400 ms), toasts. Sin animación decorativa: es una vista funcional.

## Interacción / comportamiento del formulario

- Validación en cliente al enviar + validación de servidor (Form Request) siempre; errores inline bajo cada campo en rojo accesible con `aria-describedby`; foco al primer error.
- Envío: botón en loading (spinner + `Enviando…`), deshabilitado.
- Éxito: la columna del formulario se sustituye por panel de confirmación (`Mensaje recibido.` + siguiente paso + CTA reserva) + toast (sonner). El formulario no se reexpone (evita dobles envíos).
- Error de servidor: toast + mensaje persistente sobre el botón, conservando lo escrito.
- Protección: CSRF, honeypot, rate limit por IP, sin envío de datos a analítica.

## Componentes usados

Inputs/select/textarea, checkbox, botón primario lime, panel de confirmación, toast (sonner) del sistema de componentes.

## Contenido editable

- H1, subcopy y textos de contexto.
- Lista de servicios del select (desde Servicios).
- Datos de contacto directos desde `settings`: `info@abacodev.com`, `+34 91 020 00 89`, `+34 647 51 81 00`, dirección completa y emails secundarios si se decide mostrarlos.

## Entidades relacionadas

`contact_messages` (escritura), `settings` (datos de contacto), `booking_settings` (CTA de reserva).

## SEO

- Title ES: `Contacto | Abaco Developments`. Indexable.
- Canonical sobre `https://abacoqd.com/contacto`.
- JSON-LD: `ContactPage`. `hreflang` con `/en/contact`.

## Estados vacíos

- Sin servicios cargados aún: el select se oculta y queda el resto del formulario.
- Si algún dato de contacto se desactiva desde admin, el bloque se reordena sin dejar huecos. Con los datos actuales, email principal, teléfono, WhatsApp y dirección se muestran.

## Accesibilidad

- Labels siempre visibles (no placeholder como label).
- Errores anunciados (`role="alert"` o foco gestionado).
- Checkbox de consentimiento con texto enlazado legible (no microletra).
- Honeypot invisible también para lectores de pantalla (`aria-hidden`, `tabindex="-1"`).

## Relación con chatbot

El chatbot puede abrir esta vista como fallback, pasar al usuario a WhatsApp `+34 647 51 81 00`, mostrar `info@abacodev.com` o sugerir servicios relacionados. No expone emails secundarios salvo decisión explícita, no envía formularios por el usuario ni recoge consentimiento en nombre del formulario.

## Modo claro/oscuro

- Cabecera `mist` y formulario `white` definen variante dark; inputs, focus ring y panel de éxito se adaptan manteniendo contraste AA.

---

# B. Reserva (agnóstica al proveedor)

## Objetivo

Destino de todos los botones `Reserva hora` del sitio (hero, CTA final, bloques contextuales — **nunca topbar**). Convierte con fricción mínima. El proveedor está pendiente; la vista se diseña agnóstica y siempre con fallback a contacto. Recomendación documental de cierre: `Cal.com` si el sitio no depende de WordPress; `Calendly` como opción rápida; `Amelia` solo si el stack final fuera WordPress.

## Estructura visual

Bandas: `ink (cabecera) → white (pasos + reserva) → mist (alternativa) → ink (footer)`. El botón de reserva es el lime más prominente del sitio.

1. **Cabecera compacta** — fondo `qd-ink`; eyebrow lime `RESERVA HORA`; H1 `Reserva una hora con nosotros`; subcopy `Una primera sesión para entender tu caso y proponerte un enfoque.` Sin prometer duración, disponibilidad ni gratuidad no confirmadas.
2. **Qué vamos a ver** — fondo `qd-white`; 3 pasos numerados con icono: `Tu proceso`, `Lo que necesitas`, `Primer enfoque`.
3. **Bloque de reserva** (núcleo, agnóstico) — controlado por `booking_settings` (`provider`, `booking_url`, `is_enabled`):
   - **Variante A — embed**: contenedor centrado máx. ~900 px con el widget; skeleton con shimmer mientras carga; fallback a botón externo si el script falla. El embed de terceros implica cookies/script externo → coordinar con consentimiento (ver `PUBLIC_07_LEGAL_COOKIES_PRIVACIDAD.md`).
   - **Variante B — enlace externo** (por defecto si no hay decisión firme): card centrada con icono calendario, texto corto y botón lime grande `Abrir calendario de reserva →` (nueva pestaña). Sin scripts de terceros.
4. **Alternativa sin agenda** — banda `qd-mist`: `¿Prefieres escribirnos primero?` + enlace a `/contacto`.
5. **Qué pasa después** — 2–3 líneas: tras la sesión enviamos un resumen con el enfoque propuesto.
6. **Footer global**.

## Desktop

- Pasos en 3 columnas horizontales; bloque de reserva centrado.

## Mobile

- Pasos apilados; card/embed a ancho cómodo; botón a ancho completo.

## Animaciones propias

- Mínimas y funcionales: stagger de entrada de los pasos, skeleton del embed, hover del botón (scale ~1.02 + flecha). Respetan `prefers-reduced-motion`.

## Interacción

- La variante (A/B) se decide por `booking_settings`; sin configuración válida, se aplica el fallback de contacto.
- Botón externo abre nueva pestaña y lo anuncia.

## Componentes usados

Pasos numerados (estilo metodología), card de reserva, skeleton/shimmer, banda alternativa y botón primario lime.

## Contenido editable

- Eyebrow, H1, subcopy, textos de los 3 pasos y de "qué pasa después".
- `provider`, `booking_url`, `is_enabled` desde `booking_settings`.

## Entidades relacionadas

`booking_settings` (configuración del proveedor), `settings`. **Fallback** al formulario de `contact_messages`.

## SEO

- Title ES: `Reserva hora | Abaco Developments`. Indexable.
- Canonical sobre `https://abacoqd.com/reserva`.
- JSON-LD: `BreadcrumbList`; **sin** `Offer`/precios (pago pendiente de definir).
- `hreflang` con `/en/book`.

## Estados vacíos

- `booking_settings.is_enabled = false` o sin `booking_url`: el bloque muestra el fallback de contacto/WhatsApp (`Estamos cerrando agenda; escríbenos o contacta por WhatsApp y te proponemos hora.`). Nunca un calendario roto.
- Error de carga del embed → botón externo automático.

## Accesibilidad

- Si hay iframe: `title` descriptivo y alternativa equivalente por enlace (variante B siempre disponible como fallback).
- Pasos como lista ordenada.
- Botón externo avisa de nueva pestaña (`aria-label` + icono).

## Relación con chatbot

El asistente puede explicar cómo reservar, redirigir al calendario configurado o sugerir contacto si la reserva está inactiva. Si el proveedor falla, el chatbot no oculta el fallback visible de la página.

## Modo claro/oscuro

- Cabecera `ink` fija; banda de pasos/reserva (`white`) y alternativa (`mist`) definen variante dark; el lime del botón se mantiene como acento.

## Decisiones abiertas (contacto + reserva)

- Proveedor de reserva definitivo y consentimiento de cookies si hay embed de terceros.
- Duración/formato de la sesión y si se comunica como gratuita.
- Pago: pendiente de definir (sin precios en esta vista).
- Notificación interna de mensajes (email al equipo / panel).
- Texto legal definitivo del consentimiento (con la página de privacidad), pendiente de revisión jurídica final.

# Vista pública — Contacto y Reserva

Última revisión: 28 de junio de 2026. Documento consolidado (contacto + reserva). **Fase 3 (contacto + reserva) cerrada e implementada.**

## Identificación

| Campo | Contacto | Reserva |
|---|---|---|
| Ruta ES | `/contacto` | `/reserva` |
| Ruta EN | futura, no bloqueante | futura, no bloqueante |
| Prioridad | Base (producto definitivo 30/06) | Base |
| Componente | `resources/js/pages/Public/Contact.tsx` | `resources/js/pages/Public/Booking.tsx` |
| Controlador | `App\Http\Controllers\Public\ContactController` | `App\Http\Controllers\Public\BookingController` |
| Entidades | `contact_messages`, `services`, `settings` | `appointment_days`, `appointment_slots`, `appointment_bookings`, `services` |

Modelo de datos en `docs/02_MODELO_DATOS.md` (no se redefine). Paleta y componentes en `04_IDENTIDAD_UI_COMPONENTES.md`.

> **Decisión cerrada 18/06/2026**: la reserva usa un **sistema propio de citas** (`appointment_days`/`appointment_slots`/`appointment_bookings`), no un proveedor externo (Cal.com/Calendly/Amelia) ni un embed de terceros. `booking_settings` queda transicional sin uso real. **No hay ítem `Reserva`/`Reservar` en la topbar** (ver `PUBLIC_09_LAYOUT_GLOBAL.md`): los CTA de reserva viven en hero, CTA final y bloques contextuales.
>
> **Nota de enrutado**: el sitio se lanza en modo **Spanish-first**. El idioma actual puede resolverse a nivel de UI, pero `/en/contact` y `/en/book` no forman parte del alcance vigente. Si en una fase posterior se publica EN real, deberá hacerse con rutas propias y SEO completo.

## Datos de contacto confirmados

- Teléfono fijo disponible: +34 91 020 00 89.
- WhatsApp de atención comercial: +34 647 51 81 00.
- Email principal: info@abacoqd.com.
- Email secundario/general: abacodevelopments@gmail.com.
- Email de contacto comercial adicional: andrescasanueva@abacodev.com.
- Dirección: Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid, España.

El WhatsApp de atención comercial no se trata como dato legal. El email principal es el contacto público preferente. El teléfono principal único queda por definir: no se debe presentar el fijo y el móvil como equivalentes si la empresa decide priorizar solo uno.

## Avisos por correo

El correo receptor definitivo para avisos de contacto y reserva es `info@abacoqd.com`.

Pendientes técnicos reales para dejar operativo el envío:

- `SMTP host`
- `SMTP port`
- `SMTP username`
- `SMTP password` o app password
- `SMTP encryption`
- `From address`
- `From name`
- `Reply-To` si aplica
- revisión SPF/DKIM/DMARC en producción

---

# A. Contacto

## Objetivo

Canal para quien quiere explicar su proyecto en texto, sin agendar todavía. Convive con la reserva y cierra el bucle contacto↔reserva. Vista corta, clara y sin fricción.

## Estructura visual

Bandas: `mist (cabecera) → white (formulario) → ink (footer)`. Inputs con borde `qd-mist`, focus ring teal; el único lime es el CTA.

1. **Cabecera compacta** — fondo `qd-mist`; H1 `Cuéntanos tu proyecto`; subcopy de una línea (`Escríbenos y te respondemos lo antes posible.`).
2. **Layout principal** — 2 columnas (desktop) / apilado (mobile):
   - **Izquierda (40%) — contexto:** qué pasa al escribir (lo leemos, lo valoramos, te contestamos con un primer enfoque); bloque alternativo de reserva (`¿Prefieres hablar directamente?` + botón lime `Reserva hora →`); datos confirmados: email principal, teléfono fijo, WhatsApp de atención comercial y dirección completa; microconfianza (respuesta humana, sin spam, datos tratados según privacidad con enlace).
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

- Acceso directo a WhatsApp con el número confirmado `+34 647 51 81 00`, etiquetado como **WhatsApp de atención comercial**. Aparece como enlace/botón secundario en la columna de contexto y, si procede, como botón flotante coordinado con el layout global. No se trata como dato legal.

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
- Datos de contacto directos desde `settings`: `info@abacoqd.com`, `+34 91 020 00 89`, `+34 647 51 81 00`, dirección completa y emails secundarios si se decide mostrarlos.

## Entidades relacionadas

`contact_messages` (escritura), `settings` (datos de contacto), `booking_settings` (CTA de reserva).

## SEO

- Title ES: `Contacto | AbacoQD`. Indexable.
- Canonical sobre `https://abacoqd.com/contacto`.
- JSON-LD: `ContactPage`. Sin `hreflang` EN mientras no exista una versión inglesa real.

## Estados vacíos

- Sin servicios cargados aún: el select se oculta y queda el resto del formulario.
- Si algún dato de contacto se desactiva desde admin, el bloque se reordena sin dejar huecos. Con los datos actuales, email principal, teléfono, WhatsApp y dirección se muestran.

## Accesibilidad

- Labels siempre visibles (no placeholder como label).
- Errores anunciados (`role="alert"` o foco gestionado).
- Checkbox de consentimiento con texto enlazado legible (no microletra).
- Honeypot invisible también para lectores de pantalla (`aria-hidden`, `tabindex="-1"`).

## Relación con chatbot

El chatbot puede abrir esta vista como fallback, pasar al usuario a WhatsApp `+34 647 51 81 00`, mostrar `info@abacoqd.com` o sugerir servicios relacionados. No expone emails secundarios salvo decisión explícita, no envía formularios por el usuario ni recoge consentimiento en nombre del formulario.

## Modo claro/oscuro

- Cabecera `mist` y formulario `white` definen variante dark; inputs, focus ring y panel de éxito se adaptan manteniendo contraste AA.

---

# B. Reserva (sistema propio de citas)

## Objetivo

Destino de todos los botones `Reserva hora` del sitio (hero, CTA final, bloques contextuales — **nunca topbar**). El admin crea días y franjas disponibles (`appointment_days`/`appointment_slots`); el usuario elige día → hora → completa sus datos → confirma. Sin proveedor externo, sin embed de terceros, sin cookies no técnicas en esta vista.

## Estructura visual

Bandas: `ink (cabecera) → white (pasos) → mist (selector + formulario / confirmación / vacío) → white (alternativa)`. El botón de reserva es el lime más prominente del sitio.

1. **Cabecera compacta** — fondo `qd-ink`; eyebrow lime `RESERVA HORA`; H1 `Reserva una hora con nosotros`; subcopy `Una primera sesión para entender tu caso y proponerte un enfoque.` Sin prometer duración, disponibilidad ni gratuidad no confirmadas.
2. **Qué vamos a ver** — fondo `qd-white`; 3 pasos numerados: `Tu proceso`, `Lo que necesitas`, `Primer enfoque`. Se oculta si ya hay una reserva confirmada en esta visita.
3. **Selector y formulario** (núcleo) — fondo `qd-mist`, 3 columnas en desktop (apiladas en mobile):
   - **Columna día**: lista de `appointment_days` disponibles (`is_available`, sin `admin_blocked`, fecha futura) con al menos una franja reservable.
   - **Columna hora**: franjas (`appointment_slots`) del día elegido que cumplen `isBookable()` (disponible, no bloqueada, con cupo y en el futuro).
   - **Columna formulario**: aparece al elegir franja. Campos: nombre, empresa, email, teléfono, servicio de interés (opcional), mensaje (opcional), consentimiento de privacidad (obligatorio), comunicaciones comerciales (opcional), honeypot. Botón `Confirmar reserva`.
4. **Confirmación** — al volver tras reservar, sustituye el selector por un resumen: día, hora, duración aproximada, nombre, email y siguiente paso. No se reexpone el selector en esa misma carga (evita doble reserva visual).
5. **Alternativa sin agenda** — banda final: `¿Prefieres escribirnos primero?` + enlace a `/contacto`, y texto de "qué pasa después".
6. **Footer global**.

## Desktop

- 3 columnas (día / hora / formulario); pasos en 3 columnas horizontales.

## Mobile

- Columnas apiladas: día → hora → formulario; botón a ancho completo.

## Interacción / comportamiento

- Selección progresiva: día → hora → formulario. Cambiar de día limpia la hora elegida (`Cambiar hora` permite deshacer la franja sin perder el día).
- Envío: validación cliente + servidor (`StoreAppointmentBookingRequest`); reserva creada dentro de una transacción con bloqueo de fila (`AppointmentSlot::lockForUpdate()`) para que dos personas no puedan reservar la misma franja a la vez. Si la franja deja de estar disponible entre la carga y el envío, el servidor la rechaza con un error inline (`Esta franja ya no está disponible. Elige otra hora.`) y no crea la reserva.
- Tras confirmar, el slot incrementa `reserved_count` y pasa a `reserved` si llega a `capacity`.
- Protección: CSRF, honeypot (`prohibited`), rate limit por IP (`throttle:public-forms`, 6/min compartido con `/contacto`), sin envío de datos a analítica.

## Componentes usados

Pasos numerados (estilo metodología), listas de selección de día/hora, formulario (mismos inputs/checkbox que Contacto), panel de confirmación, estado vacío, banda alternativa y botón primario lime.

## Contenido editable

- Eyebrow, H1, subcopy, textos de los 3 pasos y de "qué pasa después" (hoy en `lang/es.json`/`lang/en.json`; migran a `page_sections`/`settings` cuando se conecte esta vista al admin).
- Días y franjas: CRUD de citas en el admin (Fase 5 del backlog); por ahora se gestionan vía base de datos/seeders de desarrollo, nunca con datos ficticios publicados como reales.

## Entidades relacionadas

`appointment_days`, `appointment_slots`, `appointment_bookings` (lectura y escritura), `services` (select opcional). `booking_settings` queda transicional sin uso real en esta vista.

## SEO

- Title ES: `Reserva hora | AbacoQD`. Indexable.
- Canonical sobre `https://abacoqd.com/reserva`.
- JSON-LD: `BreadcrumbList`; **sin** `Offer`/precios mientras la política comercial no esté definida.
- Sin `hreflang` EN mientras no exista una versión inglesa real.

## Estados vacíos

- Sin `appointment_days` disponibles (o ninguno con franjas reservables): bloque honesto `Ahora mismo no hay citas abiertas. Puedes escribirnos y te responderemos lo antes posible.` con CTA a `/contacto`. Nunca un selector vacío o roto.
- Franja reservada entre carga y envío: error inline, sin perder los datos ya escritos en el formulario.

## Accesibilidad

- Labels siempre visibles; errores con `role="alert"` junto al campo.
- Día/hora seleccionados marcados con `aria-pressed` en los botones de selección.
- Honeypot invisible también para lectores de pantalla (`aria-hidden`, `tabIndex={-1}`).

## Relación con chatbot

El asistente puede explicar cómo reservar, enlazar a `/reserva` o sugerir `/contacto` si no hay citas abiertas. No reserva en nombre del usuario ni inventa disponibilidad.

## Modo claro/oscuro

- Cabecera `ink` fija; banda de pasos (`white`) y selector/confirmación (`mist`) definen variante dark; el lime del botón se mantiene como acento.

## Ajustes no bloqueantes para el flujo actual

- Página de cancelación pública vía `cancellation_token` (el modelo ya genera el token; resta exponer la ruta y la vista).
- Email de confirmación al reservar (requiere stack de mail configurado).
- Generador de franjas automático y bloqueo manual desde el admin (Fase 5).
- Notificación interna de mensajes (email al equipo / panel).
- Texto legal definitivo del consentimiento (con la página de privacidad), sujeto a revisión jurídica final.
- Enrutado EN por URL solo si en una fase posterior se decide publicar inglés real.

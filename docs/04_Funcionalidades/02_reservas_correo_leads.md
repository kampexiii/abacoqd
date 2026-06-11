# Especificación: Sistema de Reservas de Cita

Documento consolidado durante la limpieza documental de junio de 2026.

Fuente de verdad activa para reservas, leads, emails transaccionales, notificaciones y estados operativos de captacion.

**Versión:** 1.0  
**Fecha:** Junio 2026  
**Fase de implementación:** Fase 3  
**Decisión de base:** Ver D8 en `03_Arquitectura/03_decisiones_dependencias_entornos.md`

---

## 1. Resumen funcional

El sistema de reservas de Ábaco Developments en Fase 3 es un **formulario de solicitud de cita**, no un sistema de slots con disponibilidad real. El usuario expresa su preferencia de fecha y horario; el equipo confirma o contraoferta. El sistema gestiona el ciclo de vida de la cita desde la solicitud hasta la finalización.

**Por qué esta decisión:**
- No se conoce cómo gestiona Ábaco su agenda interna (¿1 comercial? ¿varios consultores? ¿Google Calendar? ¿Outlook?)
- Implementar disponibilidad real sin esa información generaría un sistema inútil o incorrecto
- Un formulario de solicitud bien diseñado reduce igualmente la fricción y es más fácil de corregir en Fase 5

---

## 2. Flujo completo — estados de una reserva

```
[Usuario rellena formulario]
         │
         ▼
    pending ──── Notificación email al admin
         │       Email de acuse al usuario
         │
    ┌────┴────┐
    │         │
confirmed  cancelled (admin rechaza / usuario cancela)
    │
    │──── Email de confirmación al usuario con datos definitivos
    │──── Recordatorio automático 24h antes
    │
completed (tras la reunión)
    │
    │──── Email de seguimiento post-reunión (2h después, Fase 5)
```

**Estados posibles:**

| Estado | Descripción | Quién lo asigna |
|--------|-------------|-----------------|
| `pending` | Solicitud recibida, pendiente de revisión | Sistema (automático al crear) |
| `confirmed` | Cita confirmada con fecha/hora definitivas | Admin manual |
| `cancelled` | Cita cancelada (por cualquiera de las partes) | Admin o usuario (vía email) |
| `completed` | La reunión se ha celebrado | Admin manual |
| `no_show` | El usuario no se presentó | Admin manual |

---

## 3. Formulario público (`/reserva/`)

### Campos del formulario

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|-----------|
| `name` | text | ✅ | min:2, max:100 |
| `company` | text | ✅ | min:2, max:200 |
| `email` | email | ✅ | email:rfc,dns |
| `phone` | tel | ✅ | min:9, max:20 |
| `service_type` | select | ✅ | enum: crm, loyalty, digital, ai, general |
| `preferred_date` | date | ✅ | after:today, before:+90days |
| `preferred_slot` | select | ✅ | enum: morning (9-13h), afternoon (14-18h) |
| `notes` | textarea | ❌ | max:1000 |
| `privacy_accepted` | checkbox | ✅ | accepted |
| `website` | text (honeypot) | ❌ | max:0 (oculto, bots lo rellenan) |

### Opciones del select `service_type`

| Valor | Label visible |
|-------|--------------|
| `crm` | CRM y Gestión de Clientes |
| `loyalty` | Programas de Fidelización |
| `digital` | Transformación Digital |
| `ai` | IA y Análisis de Datos |
| `general` | Consulta general |

### Mensaje de disponibilidad

Texto visible bajo el selector de fecha:
```
"Selecciona tu fecha preferida. Uno de nuestros especialistas confirmará
la cita en las próximas horas laborables."
```

### Mensajes de estado del formulario

| Situación | Mensaje mostrado |
|-----------|-----------------|
| Enviando | "Enviando tu solicitud..." |
| Éxito | "¡Solicitud recibida! Te confirmaremos la cita por email en breve." |
| Error de validación | Inline debajo de cada campo incorrecto |
| Error de servidor | "No hemos podido procesar tu solicitud. Inténtalo de nuevo o llámanos al +34 91 020 00 89" |
| Rate limit (3 intentos/min) | "Demasiados intentos. Espera unos minutos o llámanos directamente." |
| Honeypot activado | Simular éxito silenciosamente (no crear el registro, no informar al bot) |

---

## 4. Email: acuse de recibo al usuario (inmediato)

**Asunto:** `Tu solicitud de consulta ha llegado — Ábaco Developments`

**Contenido:**
```
Hola [name],

Hemos recibido tu solicitud de consulta.

📋 Resumen de tu solicitud:
- Empresa: [company]
- Tipo de consulta: [service_type_label]
- Fecha preferida: [preferred_date] ([preferred_slot_label])

Uno de nuestros especialistas revisará tu solicitud y te contactará
pronto para confirmar los detalles.

Si tienes alguna urgencia:
📞 +34 91 020 00 89
✉️ info@abacodev.com

Un saludo,
El equipo de Ábaco Developments
```

---

## 5. Email: notificación al admin (inmediato)

**Destinatario:** `ADMIN_NOTIFICATION_EMAIL` (variable de entorno)  
**Asunto:** `🗓️ Nueva solicitud de cita — [name] de [company]`

**Contenido:**
```
Nueva solicitud de cita recibida.

Datos:
- Nombre: [name]
- Empresa: [company]
- Email: [email]
- Teléfono: [phone]
- Tipo: [service_type]
- Fecha preferida: [preferred_date] ([preferred_slot])
- Notas: [notes o "Sin notas"]
- Recibida: [timestamp]

[→ Ver en el panel admin]
```

---

## 6. Email: confirmación al usuario (cuando admin cambia status a `confirmed`)

**Asunto:** `Consulta confirmada — [confirmed_date] a las [confirmed_time] | Ábaco Developments`

**Contenido:**
```
Hola [name],

Tu consulta ha quedado confirmada. ¡Te esperamos!

📅 Fecha: [confirmed_date]
🕐 Hora: [confirmed_time]
📍 Formato: [online/presencial + enlace o dirección]
👤 Con: [assigned_consultant_name o "el equipo de Ábaco"]

Si necesitas cancelar o modificar:
📞 +34 91 020 00 89
✉️ info@abacodev.com

Hasta pronto,
El equipo de Ábaco Developments
```

---

## 7. Email: recordatorio 24h antes

**Trigger:** Job `SendBookingReminderJob` — se ejecuta vía scheduler cada minuto  
**Lógica:** Busca reservas con `status = confirmed`, `scheduled_at` entre `now+23h` y `now+25h`, y `reminder_sent_at IS NULL`

**Asunto:** `Recordatorio: Tu consulta mañana a las [confirmed_time] | Ábaco Developments`

**Contenido:**
```
Hola [name],

Te recordamos que mañana tienes una consulta programada.

📅 Fecha: [confirmed_date]
🕐 Hora: [confirmed_time]
👤 Con: [assigned_consultant_name o "el equipo de Ábaco"]

Si no puedes asistir, avísanos lo antes posible:
📞 +34 91 020 00 89
✉️ info@abacodev.com

¡Hasta mañana!
El equipo de Ábaco Developments
```

---

## 8. Panel admin — módulo de reservas

### Vista de lista (`/admin/reservas/`)

**Columnas visibles:**
| Columna | Ordenable | Filtrable |
|---------|-----------|-----------|
| Fecha/hora preferida | ✅ | ✅ (por fecha) |
| Nombre + empresa | ❌ | ✅ (búsqueda texto) |
| Tipo de consulta | ❌ | ✅ (select) |
| Estado | ❌ | ✅ (select) |
| Consultor asignado | ❌ | ✅ (select) |
| Acciones | — | — |

**Acciones disponibles:**
- Ver detalle
- Confirmar (abre modal para indicar fecha/hora definitiva + consultor)
- Cancelar
- Marcar como completada
- Marcar como no-show

**Filtros de estado:** Todos / Pendientes / Confirmadas / Canceladas / Completadas

### Vista de detalle (`/admin/reservas/{id}`)

Muestra todos los campos del formulario + historial de estados + notas internas + botones de acción + campo para añadir nota interna.

---

## 9. Modelo de datos — tabla `bookings`

```sql
id                    BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT
-- Datos del solicitante
name                  VARCHAR(100) NOT NULL
company               VARCHAR(200) NOT NULL
email                 VARCHAR(255) NOT NULL
phone                 VARCHAR(20) NOT NULL
-- Preferencia del usuario
service_type          VARCHAR(20) NOT NULL        -- crm, loyalty, digital, ai, general
preferred_date        DATE NOT NULL
preferred_slot        VARCHAR(10) NOT NULL        -- morning, afternoon
notes                 TEXT NULL
-- Confirmación del admin
scheduled_at          DATETIME NULL               -- fecha/hora definitiva (NULL hasta confirmar)
duration_minutes      TINYINT UNSIGNED DEFAULT 30
assigned_to           BIGINT UNSIGNED FK(users.id) NULL
-- Estado y lifecycle
status                VARCHAR(20) NOT NULL DEFAULT 'pending'
reminder_sent_at      TIMESTAMP NULL
confirmed_at          TIMESTAMP NULL
cancelled_at          TIMESTAMP NULL
completed_at          TIMESTAMP NULL
cancellation_reason   TEXT NULL
internal_notes        TEXT NULL
-- Trazabilidad
source                VARCHAR(50) DEFAULT 'website'
ip_address            VARCHAR(45) NULL
created_at            TIMESTAMP
updated_at            TIMESTAMP
```

---

## 10. Validaciones de negocio (Form Request)

```php
// CreateBookingRequest rules():
'name'             => ['required', 'string', 'min:2', 'max:100'],
'company'          => ['required', 'string', 'min:2', 'max:200'],
'email'            => ['required', 'email:rfc,dns'],
'phone'            => ['required', 'string', 'min:9', 'max:20'],
'service_type'     => ['required', 'string', 'in:crm,loyalty,digital,ai,general'],
'preferred_date'   => ['required', 'date', 'after:today', 'before:' . now()->addDays(90)->format('Y-m-d')],
'preferred_slot'   => ['required', 'string', 'in:morning,afternoon'],
'notes'            => ['nullable', 'string', 'max:1000'],
'privacy_accepted' => ['required', 'accepted'],
'website'          => ['nullable', 'max:0'],  // honeypot
```

---

## 11. Evolución en Fase 5 — Disponibilidad real (evaluación)

Si en Fase 5 el cliente quiere disponibilidad real, se evaluarán estas opciones:

**Opción A — Calendly Integration:**
- Embed del widget de Calendly en `/reserva/`
- Webhook de Calendly crea automáticamente el registro en `bookings`
- Ventaja: gestión de agenda en Calendly, cero desarrollo
- Desventaja: dependencia externa, apariencia de tercero

**Opción B — Slots propios en DB:**
Nueva tabla `booking_slots`:
```sql
id, consultant_id, date, start_time, end_time, is_available, booking_id (nullable)
```
El admin define los slots disponibles. El formulario solo muestra slots libres.

**Opción C — Google Calendar API:**
- Leer disponibilidad real del calendario de Google del consultor
- Mayor complejidad de integración (OAuth, API rate limits)
- Apropiado si el equipo ya usa Google Workspace

La decisión de Fase 5 se toma en base a feedback del cliente sobre cómo gestiona actualmente su agenda.

## Correo y leads consolidados

Este bloque sustituye la especificacion independiente de correo.

| Email | Trigger | Destinatario |
|---|---|---|
| Confirmacion de lead | Formulario de contacto enviado | Usuario |
| Notificacion de lead | `LeadCreated` | `ADMIN_NOTIFICATION_EMAIL` |
| Acuse de reserva | Solicitud de cita enviada | Usuario |
| Notificacion de reserva | `BookingCreated` | Equipo interno |
| Confirmacion de reserva | Admin cambia reserva a `confirmed` | Usuario |
| Recordatorio 24h | Scheduler sobre reservas confirmadas | Usuario |
| Alerta semanal | Leads sin atender | Equipo interno |

Decisiones activas: plantillas Blade HTML, envio por colas cuando no bloquee UX, logs de error, proveedor produccion pendiente entre Resend/Brevo u otro SMTP validado.

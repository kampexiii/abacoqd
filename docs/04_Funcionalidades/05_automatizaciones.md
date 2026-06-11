# Automatizaciones — Ábaco Developments Web
**Versión:** 1.0  
**Fecha:** Junio 2026

---

## 1. Gestión de Leads

### 1.1 Captura y registro

**Trigger:** Usuario envía formulario de contacto o formulario de reserva  
**Acción:**
1. Validar datos (Form Request — honeypot + rate limit)
2. Crear registro en tabla `leads`
3. Disparar evento `LeadCreated`
4. Retornar feedback inmediato al usuario (toast/mensaje)

**Job:** Síncrono (no en cola — respuesta inmediata al usuario)

---

### 1.2 Notificación al equipo interno

**Trigger:** Evento `LeadCreated`  
**Listener:** `SendLeadNotificationToAdmin`  
**Canal:** Email (via Laravel Mail + SMTP configurado en `.env`)  
**Plantilla:** `resources/views/emails/lead-created.blade.php`

**Contenido del email:**
```
Asunto: 🔔 Nuevo lead — [Nombre] de [Empresa] — [Servicio]

Nombre: [nombre]
Empresa: [empresa]
Email: [email]
Teléfono: [teléfono]
Servicio: [servicio_interés]
Mensaje: [mensaje]
Fuente: [source / UTM]
Fecha: [timestamp]

[Ver lead en el panel →]
```

**Destinatario:** `ADMIN_NOTIFICATION_EMAIL` desde `.env`

---

### 1.3 Email de confirmación al usuario (lead)

**Trigger:** Evento `LeadCreated`  
**Listener:** `SendLeadConfirmationToUser`  
**Delay:** Inmediato (o hasta 5 min via Job en cola `low` priority)

**Contenido:**
```
Asunto: Hemos recibido tu mensaje — Ábaco Developments

Hola [Nombre],

Gracias por ponerte en contacto con nosotros. Hemos recibido tu mensaje y te responderemos en menos de 24 horas laborables.

Mientras tanto, puedes explorar nuestros casos de éxito:
[Ver casos de éxito →]

Un saludo,
El equipo de Ábaco Developments
+34 91 020 00 89 | info@abacodev.com
```

---

### 1.4 Lead Scoring automático

**Trigger:** `LeadCreated` + `LeadStatusChanged`  
**Acción:** `ScoreLeadAction`

**Reglas de puntuación:**
| Criterio | Puntos |
|---------|--------|
| Tiene empresa | +20 |
| Tiene teléfono | +10 |
| Servicio de interés definido | +15 |
| Mensaje con más de 100 caracteres | +10 |
| Fuente: landing page cualificada | +20 |
| Fuente: búsqueda orgánica | +15 |
| Dominio de email corporativo (no Gmail/Hotmail) | +15 |
| Email abierto (Fase 5) | +5 |
| Clic en enlace del email (Fase 5) | +5 |

**Score resultado:** 0-100 — visible en panel admin en columna "Score"

---

### 1.5 Registro de eventos del lead

**Trigger:** Cualquier cambio en un lead  
**Acción:** `RecordLeadEvent` (Listener de `LeadStatusChanged`)

Se registra en `lead_events`:
- Cambio de estado
- Email enviado
- Llamada registrada (manual desde admin)
- Nota añadida (manual desde admin)
- Exportado a CSV

---

## 2. Gestión de Reservas

### 2.1 Confirmación inmediata

**Trigger:** Usuario envía formulario de reserva  
**Acción:**
1. Validar datos (Form Request)
2. Crear registro en `bookings` con `status = pending`
3. Disparar `BookingCreated`

**Job en cola:** `SendBookingConfirmation` — email al usuario + notificación interna

**Email al usuario:**
```
Asunto: Solicitud de consulta recibida — [Fecha] | Ábaco Developments

Hola [Nombre],

Hemos recibido tu solicitud de consulta para el [Fecha] ([Franja horaria]).
Uno de nuestros especialistas te contactará pronto para confirmar los detalles.

Detalles de tu solicitud:
- Nombre: [nombre]
- Empresa: [empresa]
- Tipo de consulta: [tipo]
- Fecha preferida: [fecha]

[Cancelar o modificar → info@abacodev.com]
```

---

### 2.2 Confirmación manual desde admin

**Acción admin:** Cambiar status a `confirmed`  
**Trigger:** `BookingConfirmed`  
**Job:** `SendBookingConfirmation` (email de confirmación formal con datos definitivos)

---

### 2.3 Recordatorio 24h antes

**Job:** `SendBookingReminderJob`  
**Scheduler:** `php artisan schedule:run` cada minuto (configurado en Kernel.php)  
**Lógica:** Buscar reservas `confirmed` con `scheduled_at` entre ahora+23h y ahora+25h, y `reminder_sent_at IS NULL`

**Email de recordatorio:**
```
Asunto: Recordatorio: Tu consulta mañana a las [Hora] | Ábaco Developments

Hola [Nombre],

Te recordamos que mañana tienes una consulta programada con el equipo de Ábaco Developments.

📅 Fecha: [Fecha]
🕐 Hora: [Hora]
👤 Con: [Nombre del consultor si está asignado]

Si no puedes asistir, avísanos lo antes posible:
📞 +34 91 020 00 89 | ✉️ info@abacodev.com
```

---

### 2.4 Seguimiento post-reunión (Fase 5)

**Trigger manual o scheduler:** 2 horas después de `scheduled_at` si status = `completed`  
**Email:**
```
Asunto: ¿Cómo fue nuestra consulta? | Ábaco Developments

Hola [Nombre],

Gracias por reunirte con nosotros. Esperamos que la consulta haya sido útil.

¿Quedaste satisfecho con la reunión?
[⭐⭐⭐⭐⭐ Dejar una valoración en ProvenExpert]

Próximos pasos: recibirás una propuesta personalizada en los próximos [X] días.

¿Tienes alguna pregunta? Escríbenos.
```

---

## 3. Blog

### 3.1 Publicación programada

**Scheduler:** Cada minuto verificar `posts` donde `status = published` y `scheduled_at <= NOW()` y `published_at IS NULL`  
**Acción:** `PublishPostAction` — actualizar `published_at = NOW()`, disparar `PostPublished`

### 3.2 Actualización de sitemap tras publicación

**Trigger:** `PostPublished`  
**Listener:** `UpdateSitemap`  
**Job:** `GenerateSitemapJob` (en cola `low`)  
**Resultado:** Regenera `public/sitemap.xml` + `public/sitemap-posts.xml`

---

## 4. SEO y Técnico

### 4.1 Sitemap automático

**Scheduler:** Diariamente a las 03:00  
**Job:** `GenerateSitemapJob`  
**Salida:** `public/sitemap.xml` (index) + `public/sitemap-pages.xml` + `public/sitemap-posts.xml` + `public/sitemap-services.xml` + `public/sitemap-cases.xml`

**Incluye:**
- Todas las páginas públicas activas
- Posts publicados (con `lastmod` = `updated_at`)
- Servicios activos
- Casos de éxito activos
- **Excluye:** páginas `/admin/*`, `/login`, `/register`, páginas con `no_index = true`

### 4.2 Gestión de redirecciones

**Middleware:** `HandleRedirects` — se ejecuta antes de todas las rutas  
**Lógica:** Consultar tabla `redirects` por `from_path`, si existe hacer redirect con status_code correspondiente  
**Cache:** Resultados de `redirects` cacheados 1h para evitar consultas en cada request

### 4.3 Open Graph automático

Al crear/editar post, servicio o caso de éxito sin imagen OG definida:
- Usar `hero_image` del contenido si existe
- Fallback a imagen OG global del sitio (`settings.seo.default_og_image`)

---

## 5. Media y Assets

### 5.1 Optimización de imágenes subidas

**Trigger:** Upload de imagen en el admin  
**Job:** `OptimizeUploadedImageJob` (cola `media`)  
**Proceso:**
1. Generar variantes: thumbnail (150×150), medium (800×600), large (1200×900)
2. Convertir a WebP + conservar original
3. Actualizar registro en `media` con dimensiones

**Herramienta:** `intervention/image` (PHP) o `spatie/laravel-medialibrary`

---

## 6. Exportaciones

### 6.1 Export CSV de leads

**Acción manual desde admin:** Botón "Exportar leads"  
**Job:** `ExportLeadsToCsvJob` (en cola `exports`)  
**Filtros:** Por fecha, estado, servicio, puntuación  
**Resultado:** Descarga CSV o envío a email del admin

**Campos incluidos:**
```
ID, Nombre, Empresa, Email, Teléfono, Servicio, Estado, Score, Fuente, UTM Source, UTM Campaign, Fecha de creación
```

### 6.2 Export de reservas

**Misma lógica** que leads. Campos: ID, Nombre, Empresa, Email, Teléfono, Tipo, Fecha cita, Estado, Consultor asignado.

---

## 7. Monitorización y Alertas

### 7.1 Error Reporting

**Herramienta recomendada:** Sentry (`.env`: `SENTRY_LARAVEL_DSN`)  
**Eventos capturados:** Exceptions en producción → notificación a email técnico

### 7.2 Uptime Monitoring

**Herramienta:** UptimeRobot (free tier) — ping cada 5 minutos  
**Alertas:** Email + SMS al admin si el sitio cae

### 7.3 Alerta de leads sin responder

**Scheduler:** Lunes 09:00 — revisar leads con `status = new` creados hace más de 48h  
**Acción:** Email al admin con lista de leads sin atender

---

## 8. Backups

**Herramienta:** `spatie/laravel-backup`  
**Scheduler:** Diariamente a las 02:00  
**Backup incluye:** Base de datos (MariaDB) + archivos subidos (`storage/app/public`)  
**Destino:** Disco remoto S3-compatible (configurar en `.env`)  
**Retención:** 7 backups diarios + 4 semanales + 3 mensuales  
**Alerta:** Email si el backup falla

---

## 9. Scheduler — resumen de tareas programadas

```php
// app/Console/Kernel.php (o bootstrap/app.php en Laravel 13)

Schedule::job(new GenerateSitemapJob)->daily()->at('03:00');
Schedule::job(new SendBookingReminderJob)->everyMinute();
Schedule::command('posts:publish-scheduled')->everyMinute();
Schedule::command('backup:run')->daily()->at('02:00');
Schedule::command('leads:alert-unattended')->weekly()->mondays()->at('09:00');
Schedule::command('redirects:clear-cache')->hourly();
```

---

## 10. Colas — configuración

```
# .env
QUEUE_CONNECTION=database

# Queues usadas
default     ← Jobs generales (emails, etc.)
low         ← Jobs no urgentes (sitemap, OG images)
media       ← Optimización de imágenes
exports     ← Exportaciones CSV/Excel
```

**Worker en producción:**
```bash
php artisan queue:work --queue=default,media,low,exports --tries=3 --backoff=5
```

**Supervisor** (o proceso en background del hosting) para mantener el worker activo.

---

## 11. Integraciones externas previstas (Fase 5)

| Servicio | Propósito | Configuración |
|---------|-----------|--------------|
| Mailchimp / Brevo | Newsletter blog | `MAILCHIMP_API_KEY` en `.env` |
| Google Analytics 4 | Analítica web | `GA4_MEASUREMENT_ID` en `.env` |
| Google Tag Manager | Gestión de tags | `GTM_ID` en `.env` |
| HubSpot / Salesforce | CRM externo (sincronizar leads) | `HUBSPOT_API_KEY` en `.env` |
| Calendly / BeNow | Reservas avanzadas | API key en `.env` |
| Sentry | Error tracking | `SENTRY_LARAVEL_DSN` en `.env` |
| S3 / Backblaze B2 | Backups + media | `AWS_*` vars en `.env` |

Todas las integraciones opcionales: si la variable de entorno no está configurada, el sistema funciona sin ellas.

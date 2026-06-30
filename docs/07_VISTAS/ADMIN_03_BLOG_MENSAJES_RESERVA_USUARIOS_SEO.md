# ADMIN_03 — Blog, mensajes, reserva, usuarios y SEO

Última revisión: 28 de junio de 2026.

Gestión de blog, categorías, tags, suscriptores, mensajes, reserva, usuarios/roles, SEO técnico y FAQs del chatbot. Patrones comunes en `ADMIN_01_LAYOUT_DASHBOARD_PATRONES.md`.

## 1. Blog

CRUD de `posts`:

- título, slug, extracto, portada;
- contenido estructurado (`content_json`);
- categoría, tags;
- idioma y traducción relacionada si en una fase posterior se publica EN real;
- estado (`draft`, `scheduled`, `published`, `hidden`);
- fecha de publicación;
- lectura estimada calculada;
- destacado de landing y orden;
- SEO por idioma.

Reglas:

- No publicar artículos inventados como reales.
- El lanzamiento inicial puede operar solo en español.
- Si en el futuro existe EN real, el slug y el SEO serán independientes por idioma.

## 2. Categorías y tags

CRUD de `post_categories` y `tags`, con slug, descripción y visibilidad. Las relaciones de traducción solo aplican si en una fase posterior se publica EN real.

Estados vacíos:

- Categoría sin posts: no aparece como filtro público.
- Tag sin posts: no se enlaza públicamente.

## 3. Suscriptores del blog

Gestión de `blog_subscribers`:

- email, nombre opcional, idioma, estado, origen;
- double opt-in;
- baja en un clic;
- reenvío de confirmación;
- exportación controlada con auditoría;
- eliminación por derecho de supresión.

No se importan listas sin consentimiento verificable.

## 4. Mensajes de contacto

Gestión de `contact_messages`:

- listado con estado, servicio relacionado, fecha e idioma/origen;
- detalle con mensaje, consentimiento, IP/user agent si procede;
- notas internas;
- cambio de estado;
- exportación controlada;
- eliminación según política de conservación.

Estados: nuevo, en revisión, respondido, descartado/spam.

Datos de respuesta/contacto disponibles desde `settings`: teléfono `+34 91 020 00 89`, WhatsApp de atención comercial `+34 647 51 81 00`, email principal `info@abacoqd.com`, email secundario `abacodevelopments@gmail.com` y email comercial adicional `andrescasanueva@abacodev.com`. El admin puede usarlos en plantillas internas, sin exponer emails secundarios en chatbot salvo decisión explícita.

El detalle del mensaje registra consentimiento obligatorio de privacidad y consentimiento comercial opcional por separado. Exportaciones y plantillas no pueden tratar el consentimiento de privacidad como autorización comercial.

## 5. Reserva

Gestión del sistema propio de citas:

- `appointment_days`;
- `appointment_slots`;
- `appointment_bookings`;
- ajustes operativos de disponibilidad;
- fallback a contacto cuando no haya citas abiertas.

Sin disponibilidad, la vista pública muestra fallback a contacto/WhatsApp con los datos confirmados. No se promete disponibilidad ni precio.

El correo receptor definitivo de avisos es `info@abacoqd.com`. El envío real queda pendiente de recibir y configurar `SMTP host`, `SMTP port`, `SMTP username`, `SMTP password` o app password, cifrado, `From`, `From name` y, si aplica, `Reply-To`.

Proveedor recomendado: `Cal.com` si no hay WordPress; alternativa rápida `Calendly`; `Amelia` solo si el stack final fuera WordPress.

## 6. Usuarios y roles

Gestión de usuarios del admin sobre `users.role`:

- `super_admin`;
- `admin`;
- `editor`;
- `viewer`.

Acciones críticas: crear usuario, cambiar rol, desactivar acceso, reset de credenciales. Deben auditarse.

## 7. SEO

Gestión de `seo_metadata` y SEO global:

- title, description, canonical, OG;
- `no_index`;
- datos estructurados permitidos;
- sitemap;
- robots;
- alertas de `hreflang`;
- contenidos sin SEO;
- páginas vacías con `noindex` temporal.

Cobertura: home, metodología, servicios, proyectos, quiénes somos, blog, posts, contacto, reserva y legales.

Los datos estructurados de `Organization`/`ContactPage` usan los datos confirmados de ABACO DIGITAL DEVELOPMENTS, S.L. y el dominio canónico final `https://abacoqd.com/`. `https://abacodev.com/` se conserva como dominio histórico y `https://www.abacodev.com/` como URL legal histórica. La política de redirección o convivencia queda por definir. El teléfono legal visible principal queda por definir.

Analítica recomendada: `GTM + GA4 + Search Console`; CMP recomendada: `CookieYes`. `Clarity` solo si se aprueba y queda bloqueado hasta consentimiento.

## 8. Chatbot / FAQs

CRUD de `faqs`:

- pregunta;
- respuesta;
- intención;
- idioma y traducción;
- redirección a servicio, proyecto, post, contacto, reserva o legal;
- activo/inactivo;
- orden.

El chatbot debe tener fallback a contacto y WhatsApp `+34 647 51 81 00`, y puede mostrar el email principal `info@abacoqd.com`. No debe exponer emails secundarios salvo decisión explícita, dar asesoramiento legal, prometer precios/plazos no definidos ni inventar miembros del equipo.

En privacidad/cookies, el chatbot solo enlaza a las páginas legales y puede resumir la ubicación de contacto; no interpreta el texto base como asesoramiento jurídico ni sustituye el consentimiento del formulario.

## 9. Accesibilidad y settings transversales

Este módulo puede exponer defaults de accesibilidad si se decide desde settings: contraste alto por defecto, tamaño base, reduced motion y enlaces subrayados. Las preferencias del visitante siguen siendo locales.

## 10. Criterios de cierre

- Blog usable en español para el lanzamiento inicial.
- Mensajes protegidos y exportables con control.
- Reserva con fallback.
- SEO por idioma editable.
- Usuarios con roles mínimos.
- FAQs activas y redirecciones revisadas.
- Sin datos de muestra publicados como reales.

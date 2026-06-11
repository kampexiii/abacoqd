# Especificación: Analítica y Consentimiento de Cookies

Documento consolidado durante la limpieza documental de junio de 2026.

Fuente de verdad activa para analitica, consentimiento, eventos, SEO tecnico, sitemap, Schema.org, accesibilidad WCAG y testing de calidad.
**Versión:** 1.0  
**Fecha:** Junio 2026  
**Fase de implementación:** Fase 5 (analítica), Fase 3 (banner de cookies)

---

## 1. Principios

1. **Privacy by default:** Sin cookies de tracking hasta que el usuario acepte explícitamente.
2. **Consentimiento granular:** El usuario puede aceptar solo cookies técnicas, o técnicas + analíticas.
3. **RGPD cumplido:** Sin datos identificables en GA4 sin consentimiento. Sin Google Consent Mode opaco.
4. **Funciona sin analytics:** Si el usuario rechaza, la web funciona igual. No hay degradación de UX.

---

## 2. Categorías de cookies

### Categoría 1: Técnicas (siempre activas, sin consentimiento)

| Cookie             | Origen     | Propósito                               | Duración |
| ------------------ | ---------- | --------------------------------------- | -------- |
| `XSRF-TOKEN`       | Laravel    | Protección CSRF                         | Sesión   |
| `abacodev_session` | Laravel    | Sesión del usuario admin                | 2 horas  |
| `appearance`       | App propia | Preferencia dark/light mode             | 1 año    |
| `a11y_preferences` | App propia | Preferencias del panel de accesibilidad | 1 año    |
| `cookie_consent`   | App propia | Registro del consentimiento del usuario | 1 año    |

### Categoría 2: Analíticas (requieren consentimiento)

| Cookie  | Origen             | Propósito               | Duración |
| ------- | ------------------ | ----------------------- | -------- |
| `_ga`   | Google Analytics 4 | Identificador de sesión | 2 años   |
| `_ga_*` | Google Analytics 4 | Estado de sesión GA4    | 2 años   |

### Categoría 3: Marketing (NO instaladas en Fase inicial)

No se instalan cookies de retargeting, Facebook Pixel, LinkedIn Insight Tag ni similares sin decisión explícita del cliente. Si en Fase 5 se deciden añadir, se documenta aquí y se actualiza la política de cookies.

---

## 3. Banner de consentimiento de cookies

### Implementación: propia (sin CMP externo)

**Por qué no usar OneTrust/Cookiebot:**

- Son herramientas de pago con licencias costosas para tráfico pequeño
- El caso de uso de Ábaco es simple (solo 2 categorías)
- Control total sobre el diseño y la UX

**Componente:** `resources/js/components/shared/CookieBanner.tsx`

### Comportamiento

1. Al primera visita: banner visible (posición: bottom, no full-screen overlay)
2. El banner no bloquea el contenido de la página
3. Si el usuario no interactúa, las cookies analíticas no se cargan
4. El usuario puede cambiar su consentimiento desde el footer: "Configurar cookies"

### Opciones del banner

**Versión simplificada (2 botones):**

```
[Aceptar todas]  [Solo técnicas]
```

**Versión expandida (toggle individual):**
Desplegable "Más opciones" que muestra:

- [✅] Cookies técnicas (siempre activadas, no editable)
- [❌] Cookies analíticas (toggle, off por defecto)

### Persistencia del consentimiento

```typescript
// localStorage + cookie 'cookie_consent'
interface ConsentPreferences {
    technical: true; // siempre true
    analytics: boolean;
    timestamp: string; // ISO date
    version: string; // versión de la política de cookies
}
```

La versión de la política se guarda para invalidar el consentimiento si la política cambia significativamente.

---

## 4. Carga condicional de Google Analytics 4

**Implementación:** GA4 solo se carga cuando `analytics: true` en las preferencias.

```tsx
// resources/js/components/shared/Analytics.tsx
// Se monta en app.tsx
// Lee las preferencias de consentimiento
// Si analytics = true: inyecta el script de GA4
// Si analytics = false: no inyecta nada

const GA4_ID = import.meta.env.VITE_GA4_ID; // desde .env
```

**Variable de entorno:**

```env
VITE_GA4_ID=G-XXXXXXXXXX
```

**No se usa Google Tag Manager** en Fase inicial (simplifica la implementación y reduce el riesgo de tags mal configurados). GTM se evalúa en Fase 5+ si el equipo de marketing necesita gestionar tags sin desarrollador.

---

## 5. Eventos GA4 a rastrear

### Conversiones (más importantes)

| Evento            | Trigger                                  | Parámetros                       |
| ----------------- | ---------------------------------------- | -------------------------------- |
| `generate_lead`   | Formulario de contacto enviado con éxito | `service_interest`, `source`     |
| `booking_request` | Formulario de reserva enviado con éxito  | `service_type`, `preferred_slot` |

### Engagement

| Evento            | Trigger                                      | Parámetros                    |
| ----------------- | -------------------------------------------- | ----------------------------- |
| `page_view`       | Cada cambio de ruta (Inertia)                | `page_title`, `page_location` |
| `scroll`          | Usuario llega al 90% de la página            | Automático GA4                |
| `click`           | CTA principal del hero                       | `button_text`, `destination`  |
| `blog_read`       | Usuario llega al final de un artículo        | `post_title`, `category`      |
| `service_view`    | Usuario visita página de servicio individual | `service_name`                |
| `project_view` | Usuario visita una ficha pública de proyecto | `title`, `project_type` |

### Implementación de eventos en Inertia SPA

Inertia no hace page_view automático en cada navegación. Es necesario escuchar los eventos del router:

```typescript
// resources/js/lib/analytics.ts
import { router } from '@inertiajs/react';

router.on('navigate', (event) => {
    if (window.gtag && event.detail.page) {
        window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
        });
    }
});

export function trackEvent(
    name: string,
    params: Record<string, string | number> = {},
) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', name, params);
    }
}
```

---

## 6. Configuración de GA4 para RGPD

### En la interfaz de Google Analytics:

1. **Retención de datos:** 14 meses (mínimo que permite GA4)
2. **Señales de Google:** Desactivado (evita cruce de datos con cuentas Google)
3. **Datos de anuncio:** Desactivado
4. **Anonimizar IP:** Activado (GA4 lo hace por defecto desde 2023)
5. **Usuarios sin consentimiento:** No se crean (gracias a la carga condicional)

### DPA (Data Processing Agreement)

Firmar el DPA con Google antes del lanzamiento desde la consola de Google Analytics > Administrar > Configuración de la cuenta.

---

## 7. Política de cookies — página pública (`/politica-cookies/`)

La política de cookies debe incluir (requisito legal en España):

1. Qué es una cookie
2. Tipos de cookies que usamos (tabla de categoría 1, 2 y 3)
3. Para qué usamos cada cookie
4. Duración de cada cookie
5. Cómo gestionar o eliminar cookies
6. Cómo contactar para ejercer derechos RGPD
7. Fecha de última actualización

⚠️ **Esta página requiere revisión legal.** El contenido base de paginas legales esta integrado en `04_Funcionalidades/01_estructura_web_y_contenidos.md` y debe ser revisado por un abogado especializado en protección de datos antes de publicarse.

---

## 8. Implementación por fases

| Fase     | Analítica                                              |
| -------- | ------------------------------------------------------ |
| Fase 1-2 | Ninguna — sin cookies de tracking, sin GA4             |
| Fase 3   | Banner de cookies implementado (sin GA4 todavía)       |
| Fase 4   | Banner reffinado y probado en todos los flujos         |
| Fase 5   | GA4 activado, eventos de conversión implementados      |
| Fase 6   | Auditoría completa de privacidad antes del lanzamiento |

---

## 9. Privacidad y leads

Los datos de leads y reservas son datos personales bajo el RGPD:

- No se envían a GA4 ni a ningún tercero
- Se almacenan en MariaDB en el servidor de la aplicación
- Solo accesibles para usuarios autenticados con rol admin o superior
- El usuario puede solicitar su borrado via `info@abacodev.com` (Derecho al Olvido)
- Retención de datos de leads: a definir con Ábaco (propuesta: 3 años desde último contacto)

⚠️ **Acción requerida:** Ábaco debe nominar un Responsable de Protección de Datos o confirmar que el volumen no lo requiere legalmente (empresas < 250 empleados tienen exenciones).

## SEO y accesibilidad consolidados

Este bloque sustituye los documentos independientes de SEO y accesibilidad.

| Area            | Decision activa                                                                   |
| --------------- | --------------------------------------------------------------------------------- |
| SEO metadata    | Tabla polimorfica `seo_metadata` para paginas, servicios, casos y posts.          |
| Sitemap         | Generacion propia con `SitemapController` + job, sin dependencia externa.         |
| Schema.org      | `Organization`, `Service`, `Article`, `FAQPage`, `BreadcrumbList` cuando aplique. |
| Core Web Vitals | Objetivo Lighthouse: Performance >80 en fase inicial, >90 en fase de excelencia.  |
| WCAG            | Objetivo WCAG 2.2 AA.                                                             |
| Teclado         | Navegacion completa sin raton, focus visible y skip link.                         |
| Formularios     | Labels, errores, ayuda contextual y estados accesibles.                           |
| Media           | Alt text obligatorio y decorativas marcadas correctamente.                        |
| Testing         | Lighthouse, axe, revision manual por teclado y pruebas responsive.                |

## Decisiones de accesibilidad y rendimiento del rediseño visual público

Actualización aplicada el 10 de junio de 2026.

| Área                 | Decisión aplicada                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Movimiento           | Reveal y stagger con `IntersectionObserver`, una sola activación por sección. Sin scroll listeners continuos.                                                       |
| Reduced motion       | `prefers-reduced-motion` desactiva transiciones largas y animaciones infinitas; los contenidos quedan visibles sin desplazamiento.                                  |
| Información esencial | Ninguna información crítica depende exclusivamente de hover. Servicios, casos, categorías, partners y CTA son visibles en reposo.                                   |
| Teclado              | Enlaces expandidos de cards conservan `focus-visible`; header, footer, filtros y formularios mantienen foco visible.                                                |
| Contraste            | Header claro en light mode con acento teal; footer y CTA oscuros corporativos con texto blanco/aqua claro; badges suaves con texto primario.                        |
| Recursos visuales    | Patrones, grids y paneles abstractos se crean con CSS/SVG propios; no hay imágenes externas, canvas, vídeo ni WebGL.                                                |
| Rendimiento          | Animaciones limitadas a `opacity` y `transform`; no se añaden dependencias ni assets pesados.                                                                       |
| SEO                  | No se cambian rutas, canonicals ni Schema.org existentes. `LanguageProvider` actualiza `<html lang="">`; rutas localizadas y hreflang quedan para la fase SEO/i18n. |

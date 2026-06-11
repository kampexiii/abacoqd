# Decisiones Técnicas — Registro Formal
**Versión:** 1.0  
**Fecha:** Junio 2026  
**Propósito:** Registrar cada decisión técnica relevante: qué se eligió, qué se descartó y por qué. Este documento elimina ambigüedades entre documentos y es fuente de verdad cuando hay conflicto.

Documento consolidado durante la limpieza documental de junio de 2026.

Fuente de verdad activa para decisiones tecnicas, dependencias permitidas/rechazadas, entornos, despliegue y go-live.

> Las decisiones marcadas con ⏳ PENDIENTE requieren validación del cliente antes de poder implementarse. Las marcadas con ✅ CERRADA pueden usarse directamente en el código.

---

## D1 — Nombre de la entidad base de trabajos

**Estado:** ✅ CERRADA

**Decisión:**
- Nombre de modelo base: `Project`
- Nombre de tabla base: `projects`
- Nombre de modelo de colaboradoras: `CollaboratorCompany`
- Nombre de tabla de colaboradoras: `collaborator_companies`
- El portafolio publico se alimentara desde `projects`
- El naming publico definitivo de ruta o etiqueta visual se cerrara en la fase de portafolio, no bloquea Fase 1

**Descartado:** usar `CaseStudy` como entidad troncal de base de datos.  
**Razón:** el proyecto necesita una entidad mas flexible que cubra trabajos propios y trabajos en colaboracion sin duplicar modelos. Si en la capa publica se quiere presentar un proyecto como caso de exito, eso se resolvera como narrativa de presentacion, no como entidad principal distinta.

**Accion activa:** usar `Project` y `CollaboratorCompany` en arquitectura, modelo de datos y futuras migraciones de Fase 1.

---

## D2 — Formato de colores en tokens CSS

**Estado:** ✅ CERRADA

**Decisión:** RGB tripletes sin función `rgb()`:
```css
--color-brand-primary: 8 127 140;
```
Tailwind v4 espera este formato para poder generar variantes con opacidad:
```html
<div class="bg-brand-primary/50">  <!-- ✅ funciona con triplete -->
```

**Descartado:** `oklch()` para variables de custom properties, `#HEX` directo  
**Razón:** `oklch()` no permite el modificador de opacidad `/` de Tailwind v4. `#HEX` tampoco. El triplete RGB es el formato que Tailwind v4 espera explícitamente para variables que se usan con modificadores de opacidad.

**Fuente:** Tailwind CSS v4 docs — "Using CSS variables" section.

**Accion activa:** Mantener los tokens en formato RGB triplete en el design system vigente.

---

## D3 — Colores corporativos reales

**Estado:** ✅ CERRADA

**Fuente de validación:** archivo `AbacoDevPAletaColores.jpeg` (validado en junio de 2026; el archivo ya no se conserva en la raíz del proyecto — los valores HEX/RGB registrados en esta decisión y en `docs/02_Branding/` son la fuente de verdad vigente).

**Colores corporativos reales:**
- Primario: `#087F8C` — RGB: `8 127 140`
- Secundario: `#088C8C` — RGB: `8 140 140`
- Apoyo claro: `#7ABFBF` — RGB: `122 191 191`
- Fondo tonal: `#B0D9D9` — RGB: `176 217 217`
- Neutro corporativo: `#F2F2F2` — RGB: `242 242 242`

**Decisión:** El bloqueo de Fase 0 queda eliminado. La paleta es suficientemente clara porque el archivo contiene swatches con HEX y RGB explícitos.

**Accion activa:** Usar estos valores en `docs/02_Branding/01_identidad_y_estilo.md`, `docs/02_Branding/02_design_system_tokens.md` y `docs/02_Branding/03_validacion_paleta.md`.

---

## D4 — Editor WYSIWYG para blog

**Estado:** ✅ CERRADA

**Decisión:** [Tiptap](https://tiptap.dev/) con serialización en **JSON** (formato ProseMirror nativo de Tiptap).

**Formato de almacenamiento:** Columna `content` en tabla `posts` como `JSON` (no `LONGTEXT` HTML).

**Extensiones mínimas a habilitar:**
- Documento, párrafo, texto, negrita, cursiva, código inline
- Encabezados H2, H3, H4
- Listas ordenadas y desordenadas
- Cita (blockquote)
- Imagen (con alt text obligatorio)
- Enlace
- Separador horizontal
- Tabla básica

**Renderizado en frontend:** Componente `<TiptapRenderer>` propio que convierte el JSON de Tiptap a React components. No usar `dangerouslySetInnerHTML`.

**Descartado:**
- **Quill:** Sin mantenimiento activo desde 2022, problemas con React 19.
- **Editor.js:** Formato JSON propio (no estándar), ecosistema pequeño.
- **Campo Markdown:** Requiere preview en tiempo real y tiene curva de aprendizaje para usuarios no técnicos.
- **CKEditor 5:** Licencia comercial para funciones avanzadas.

**Consecuencia para la DB:**
```sql
-- posts.content es JSON, no TEXT
content JSON NOT NULL
```

**Sanitización:** Tiptap serializa solo los nodos que se le permiten explícitamente (allowlist). No necesita DOMPurify al renderizar JSON → React.

---

## D5 — Gestión de archivos multimedia

**Estado:** ✅ CERRADA

**Decisión:** `spatie/laravel-medialibrary` (v11)

**Razón:**
- Gestión de colecciones: un modelo puede tener múltiples colecciones de media (hero_image, logo, gallery)
- Conversiones automáticas configurables (thumbnail, medium, large, webp)
- URL signing para archivos privados si se necesita en el futuro
- Integración con discos S3 sin cambiar código
- Eliminación automática al borrar el modelo

**Descartado:** `intervention/image` directamente  
**Razón:** `intervention/image` solo manipula imágenes — no gestiona colecciones, URLs, conversiones ni limpieza. Habría que construir toda esa infraestructura encima.

**Consecuencia para la DB:**
La tabla `media` del `08_modelo_datos.md` (diseño manual) queda **reemplazada** por el schema que genera `spatie/laravel-medialibrary` automáticamente mediante su migración. El campo `alt_text` se almacena como custom property.

**Conversiones a configurar:**
| Conversión | Dimensiones | Formato | Uso |
|-----------|-------------|---------|-----|
| thumb | 150×150 | WebP | Admin gallery, avatars |
| medium | 800×? | WebP | Cards, previews |
| large | 1200×? | WebP | Hero images, casos |
| og | 1200×630 | WebP | Open Graph images |

---

## D6 — Audit log: tabla propia vs. paquete externo

**Estado:** ✅ CERRADA

**Decisión:** Tabla `audit_logs` propia (sin `spatie/laravel-activitylog`)

**Razón:**
- El paquete Spatie es poderoso pero genera muchas queries de polimorfismo que raramente se necesitan en este proyecto.
- La tabla propia tiene exactamente los campos que necesitamos, nada más.
- Sin dependencia adicional.
- Más simple de consultar desde el panel admin.

**Schema definitivo de `audit_logs`:**
```sql
id            BIGINT UNSIGNED PRIMARY KEY
user_id       BIGINT UNSIGNED FK(users.id) NULL    -- NULL si es acción de sistema
event         VARCHAR(50) NOT NULL                  -- created, updated, deleted, login, logout, exported
model_type    VARCHAR(100) NULL                     -- App\\Models\\Post
model_id      BIGINT UNSIGNED NULL
old_values    JSON NULL
new_values    JSON NULL
ip_address    VARCHAR(45) NULL
user_agent    TEXT NULL
created_at    TIMESTAMP
-- sin updated_at: los logs son inmutables
```

**Qué se registra:** Solo acciones administrativas (CRUD en admin, login/logout de usuarios admin, cambios de settings, exportaciones). No se registran visitas o acciones de usuarios públicos anónimos.

**Accion activa:** Mantener la tabla propia `audit_logs` en `03_Arquitectura/04_seguridad_roles_permisos.md`.

---

## D7 — Generación de Sitemap

**Estado:** ✅ CERRADA

**Decisión:** Generación manual con `SitemapController` + Job de Laravel. Sin `spatie/laravel-sitemap`.

**Razón:**
- El sitemap de este proyecto es simple y predecible: páginas estáticas + posts publicados + servicios activos + casos activos.
- Sin dependencia adicional.
- Control total del formato y frecuencia de actualización.
- El sitemap se regenera vía Job cuando se publica contenido o en scheduler diario.

**Estructura de sitemap a generar:**
```
public/sitemap.xml            → Index que apunta a los sub-sitemaps
public/sitemap-pages.xml      → Home, About, Contact, Booking, FAQ, Legal
public/sitemap-services.xml   → /servicios/ + /servicios/{slug}
public/sitemap-cases.xml      → /casos/ + /casos/{slug}
public/sitemap-posts.xml      → /blog/ + /blog/{slug}
```

**Accion activa:** Mantener la generacion propia del sitemap en el documento de analitica, SEO y accesibilidad.

---

## D8 — Sistema de reservas: disponibilidad real o solicitud simple

**Estado:** ✅ CERRADA (con plan de evolución)

**Decisión por fases:**

**Fase 3 (implementación inicial):** Formulario de **solicitud de cita** — el usuario elige fecha y franja horaria preferidas, pero no hay validación de disponibilidad real. El equipo de Ábaco confirma o propone otra fecha manualmente.

**Por qué:** No hay información sobre cómo Ábaco gestiona su agenda. Implementar disponibilidad real requiere: definir slots, calendarios por consultor, gestión de zonas horarias. Este nivel de complejidad en Fase 3 es desproporcionado.

**Fase 5 (evolución):** Evaluación de integración con Calendly o con la agenda de BeNow (si aplica). Si se decide implementar disponibilidad propia, se añade una tabla `booking_slots` en esa fase.

**Consecuencia:** El campo `scheduled_at` en `bookings` es la preferencia del usuario, no un slot confirmado. El `status` empieza en `pending` (no `confirmed`) hasta que el equipo valide y cambie el estado manualmente desde el admin.

**Ver:** `04_Funcionalidades/02_reservas_correo_leads.md` para el flujo completo.

---

## D9 — Internacionalización (i18n)

**Estado:** ✅ CERRADA — revisada el 11/06/2026 (con decisión de diseño DB aplazada estratégicamente)

**Decisión (revisión 11/06/2026):**

**Cuándo:** la i18n de interfaz se adelanta a la **FASE 3 del roadmap maestro** (antes de construir la web pública completa), para no migrar textos dos veces. La numeración "Fase 5" de la versión anterior de esta decisión queda sustituida.

**Qué se traduce:**
- Strings de interfaz (labels, mensajes, navegación): archivos JSON por idioma en `lang/` (raíz), `es` fallback obligatorio y `en` obligatorio
- Contenido editorial (posts, servicios, casos): **sigue aplazado** — solo si el cliente lo necesita

**Arquitectura de URLs:** sin rutas localizadas ni hreflang hasta la fase SEO (FASE 8). Cuando se aborde: prefijo de idioma solo para inglés:
- Español: `/servicios/crm/` (sin prefijo — idioma por defecto)
- Inglés: `/en/services/crm/`

**Librería:** Combinación de:
- Laravel `lang/` files para strings PHP (emails, validaciones)
- Hook propio `useLanguage` + `LanguageProvider` para strings de React/UI, **sin dependencia externa**

**Descartado (revisión 11/06/2026):** `react-i18next`. El alcance real (claves anidadas, reemplazos simples, fallback a `es`) no justifica la dependencia; un hook propio mantiene el control y respeta la regla de dependencias mínimas. Si en el futuro se necesitan plurales/ICU complejos, se reevalúa con el Guardian de Arquitectura.

**Modelo de datos para i18n de contenido (si se necesita en Fase 5+):**
Añadir columnas `_en` a las tablas afectadas via migración nueva. No cambiar el schema base ahora.
```sql
-- Fase 5 migration: add_english_translations_to_services
ALTER TABLE services ADD COLUMN title_en VARCHAR(255) NULL;
ALTER TABLE services ADD COLUMN description_en TEXT NULL;
ALTER TABLE services ADD COLUMN slug_en VARCHAR(255) UNIQUE NULL;
```

---

## D9A — Escena 3D del hero público

**Estado:** ✅ CERRADA

**Decisión:**
- Dependencia frontend aprobada: `three`
- Tipado de desarrollo aprobado: `@types/three`
- Implementación del cubo del hero con Three.js imperativo dentro de `AbacoCrystalCube` (`resources/js/components/AbacoCrystalCube.tsx`; el nombre `AbacoModularCube` de la redacción original quedó sustituido por el componente real)
- Sin React Three Fiber, Drei, GSAP, Motion, librerías de partículas ni assets remotos

**Razón:**
- El hero requiere un cubo 3D real con 27 módulos, 6 caras exteriores, dispersión a slots fijos del escenario completo y flash de recomposición.
- La versión CSS 3D no permite el mismo control de cámara, profundidad, slots independientes de la rotación y cleanup del render loop.
- La solución final mantiene el resto de la home en React/Inertia y acota WebGL al componente del hero.

**Accion activa:**
- Mantener `three` como única dependencia 3D del proyecto.
- Limitar el render loop a `requestAnimationFrame` imperativo, DPR máximo `1.75`, geometrías/materiales reutilizados y pausa ligera fuera de viewport.

**Descartado:** Tabla de traducciones polimórfica (patrón Translatable de Spatie). Añade complejidad significativa para la ganancia que se necesita en Fase 5.

**Acción requerida ahora:** Ninguna en DB. Solo asegurarse de que los seeders usan `lang()` helpers y no textos hardcodeados.

---

## D10 — Proveedor de correo electrónico

**Estado:** ✅ CERRADA (estructura) + ⏳ PENDIENTE (proveedor producción)

**Decisión de estructura:**
- **Desarrollo:** Mailtrap (`.env MAIL_MAILER=smtp` con credenciales Mailtrap)
- **Producción:** Por decidir con el cliente; la especificacion activa esta en `04_Funcionalidades/02_reservas_correo_leads.md`.
- **Formato de plantillas:** Blade components (no Markdown mail de Laravel, que tiene formato plano)

**Proveedores recomendados para producción (en orden de preferencia):**

| Proveedor | Plan gratuito | Precio básico | Ventaja |
|-----------|--------------|--------------|---------|
| Resend | 100 emails/día | $20/mes (50k) | API moderna, DX excelente |
| Brevo (ex Sendinblue) | 300 emails/día | Gratis hasta 300/día | Incluye marketing |
| Mailgun | 100 emails/día (trial) | $35/mes | Muy fiable, buena API |
| SMTP Gmail | 500 emails/día | Gratis | Solo para volúmenes bajos |

**Recomendación:** Resend para transaccional. Brevo si también quieren newsletter integrado.

**Configuración en `.env`:**
```
# Desarrollo
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525

# Producción (a completar)
MAIL_MAILER=smtp
MAIL_HOST=[resend/brevo SMTP host]
MAIL_USERNAME=[API key]
MAIL_PASSWORD=[password]
MAIL_FROM_ADDRESS=info@abacodev.com
MAIL_FROM_NAME="Ábaco Developments"
```

---

## D11 — Decisión adicional: SEO en modelos

**Estado:** ✅ CERRADA

**Decisión:** Tabla polimórfica `seo_metadata` (diseño de `08_modelo_datos.md`)

**Descartado:** Columnas directas en cada modelo (`seo_title`, `seo_description` en `posts`, `services`, `projects`)  
**Razón:** 
- La tabla polimórfica evita duplicar las mismas columnas en cada tabla de contenido
- Permite añadir SEO a cualquier modelo futuro sin migración
- El admin de SEO es un único módulo que funciona igual para todos los contenidos

**Accion activa:** Mantener `seo_metadata` como unica fuente para SEO de modelos en el modelo de datos y en la especificacion de SEO.

---

## D12 — Caché para tabla settings

**Estado:** ✅ CERRADA

**Problema:** La tabla `settings` con patrón EAV (Entity-Attribute-Value) necesita caché obligatoria. Sin caché, cada request hace múltiples queries a `settings`.

**Decisión:**

```php
// app/Services/SettingsService.php
class SettingsService
{
    const CACHE_KEY = 'site_settings';
    const CACHE_TTL = 3600; // 1 hora

    public function get(string $group, string $key, mixed $default = null): mixed
    {
        $all = Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return Setting::all()->groupBy('group')
                ->map(fn($group) => $group->pluck('value', 'key'));
        });

        return data_get($all, "$group.$key", $default);
    }

    public function set(string $group, string $key, mixed $value): void
    {
        Setting::updateOrCreate(
            ['group' => $group, 'key' => $key],
            ['value' => $value]
        );
        Cache::forget(self::CACHE_KEY);
    }
}
```

**Acción:** Añadir `SettingsService` al documento `07_arquitectura_tecnica.md`.  
**La caché se invalida** siempre que se actualice cualquier setting desde el admin.

---

## D13 — Prefijo de variables CSS de marca

**Estado:** ✅ CERRADA

**Decisión:** Las variables CSS propias de Ábaco usan el prefijo `--abaco-color-*` en `resources/css/tokens.css`.

```css
/* tokens.css — variables raw */
:root {
  --abaco-color-brand-primary: 8 127 140;
}

/* app.css — @theme mapea al espacio de Tailwind */
@theme {
  --color-brand-primary: rgb(var(--abaco-color-brand-primary));
}
```

**Razón:** Evitar colisiones con las variables `--color-*` que shadcn/ui y el starter kit de Laravel usan internamente. Las variables `--abaco-color-*` son privadas y de uso interno; las clases Tailwind (`bg-brand-primary`, `text-brand-primary`) se generan desde el `@theme`.

**Acción activa:** Mantener el prefijo `--abaco-color-*` en tokens.css y el mapeo en `@theme` de app.css.

---

## Resumen de decisiones

| ID | Decisión | Estado |
|----|---------|--------|
| D1 | Entidad base: `Project` + `CollaboratorCompany` | ✅ Cerrada |
| D2 | Formato CSS: RGB tripletes | ✅ Cerrada |
| D3 | Colores corporativos reales | ✅ Cerrada |
| D4 | WYSIWYG: Tiptap + JSON storage | ✅ Cerrada |
| D5 | Media: `spatie/laravel-medialibrary` | ✅ Cerrada |
| D6 | Audit log: tabla propia | ✅ Cerrada |
| D7 | Sitemap: generación propia | ✅ Cerrada |
| D8 | Reservas: solicitud simple Fase 3, disponibilidad real Fase 5 | ✅ Cerrada |
| D9 | i18n: hook propio `useLanguage` + Laravel lang, FASE 3 del roadmap maestro, sin cambios DB ahora (revisada 11/06/2026) | ✅ Cerrada |
| D10 | Email: Blade templates + Resend/Brevo en producción | ✅ (estructura) ⏳ (proveedor) |
| D11 | SEO: tabla polimórfica `seo_metadata` | ✅ Cerrada |
| D12 | Settings: caché obligatoria via `SettingsService` | ✅ Cerrada |
| D13 | Prefijo variables CSS: `--abaco-color-*` para tokens internos | ✅ Cerrada |

## Dependencias consolidadas

Este bloque sustituye el documento independiente de dependencias.

| Ecosistema | Permitido / requerido | Descartado |
|---|---|---|
| PHP / Composer | Laravel starter kit (`laravel/react-starter-kit`), Fortify, Pest, Wayfinder, `laravel/chisel` (generación de código), passkeys (via Fortify), Spatie Media Library (Fase 2) | Spatie Sitemap, Spatie Activitylog. |
| JavaScript / npm | React 19, TypeScript strict, Inertia 3, Tailwind 4, shadcn/ui (Radix UI), Wayfinder (`@laravel/vite-plugin-wayfinder`), `tw-animate-css`, Sonner, Lucide, Tiptap (Fase 2) | `ziggy-js`, editores no elegidos, paquetes sin uso directo. |
| Testing | Pest, Playwright en fase 6, Lighthouse/axe para calidad | Tests o herramientas instaladas sin fase asignada. |
| Produccion | SMTP validado, colas database/worker, backups, GA4 condicionado a consentimiento | CMP externo salvo necesidad legal o de escala. |

Regla: cualquier dependencia nueva requiere justificar problema, alternativa nativa descartada, fase de uso y coste de mantenimiento.

## Entornos y despliegue consolidados

| Entorno | Uso |
|---|---|
| Local | XAMPP en Windows/WSL, desarrollo y pruebas internas. |
| Staging | Validacion del cliente, contenido, QA, accesibilidad y SEO antes de produccion. |
| Produccion | Servidor con PHP, MariaDB, Nginx/Apache, worker de colas, scheduler y backups. |

Checklist go-live minimo: variables `.env` completas, migraciones aplicadas, build frontend, colas activas, scheduler activo, SMTP validado, sitemap generado, robots correcto, GA4 bajo consentimiento, backups probados y usuario `super_admin` creado.

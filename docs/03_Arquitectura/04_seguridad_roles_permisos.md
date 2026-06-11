# Seguridad — Ábaco Developments Web

Documento consolidado durante la limpieza documental de junio de 2026.

Fuente de verdad activa para seguridad, autenticacion, autorizacion, roles, policies, auditoria y permisos del panel admin.

## Roles consolidados

Este bloque sustituye la especificacion independiente de permisos.

| Rol | Uso |
|---|---|
| `super_admin` | Gestion total: usuarios, roles, settings, permisos, auditoria y operaciones criticas. |
| `admin` | Gestion operativa completa del panel sin control total sobre usuarios/sistema. |
| `editor` | Gestion de contenido: servicios, casos, blog, FAQs, testimonios y media segun policy. |
| `viewer` | Lectura limitada de panel, KPIs y contenido; acceso a datos sensibles pendiente de validacion. |

Regla: el backend decide permisos con policies/middleware. El frontend solo oculta acciones para UX, nunca como control de seguridad.

## Principios

- Defensa en profundidad: validación en cliente Y servidor
- Mínimo privilegio: cada rol solo accede a lo que necesita
- Sin secretos en código: todo en variables de entorno
- Auditoría: cada acción sensible queda registrada

## Protección de formularios

### CSRF
Inertia.js incluye el token CSRF automáticamente en cada petición. Laravel lo verifica en todos los métodos POST/PUT/PATCH/DELETE.

```php
// Verificación automática mediante middleware 'web'
Route::middleware(['web', 'csrf'])->group(function () { ... });
```

### Honeypot
Campo invisible que los bots rellenan pero los humanos no ven.

```tsx
// En componente de formulario
<input
  type="text"
  name="website"        // nombre que atrae a bots
  className="sr-only"   // visualmente oculto
  tabIndex={-1}
  aria-hidden="true"
  autoComplete="off"
/>
```

```php
// En Form Request
'website' => ['nullable', 'max:0'],  // debe estar vacío
```

### Rate Limiting
```php
// routes/web.php
Route::middleware(['throttle:contact'])->group(function () {
    Route::post('/contact', [ContactController::class, 'store']);
});

// AppServiceProvider.php
RateLimiter::for('contact', function (Request $request) {
    return Limit::perMinute(3)->by($request->ip())
               ->response(fn() => response()->json(['message' => 'Demasiados intentos'], 429));
});
```

## Autenticación y autorización

### Roles del sistema
```
super_admin  → Acceso total al sistema
admin        → Gestión de contenido y leads
editor       → Solo blog y casos de éxito
viewer       → Solo lectura del panel
```

### Políticas (Policies)
```php
class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->hasRole(['admin', 'editor']) 
            || $post->author_id === $user->id;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->hasRole('admin');
    }
}
```

### Middleware de admin

El middleware previsto es `EnsureCanAccessAdmin` (alias `admin` en `bootstrap/app.php`). Evaluará el gate `access-admin` definido via Policy o `Gate::define`.

> Estado real (11/06/2026): este middleware **no existe todavía en el código**. Se creará en la fase de panel admin (FASE 7 del roadmap maestro). Hoy `bootstrap/app.php` solo registra los middleware del starter kit.

```php
// app/Http/Middleware/EnsureCanAccessAdmin.php
class EnsureCanAccessAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless($request->user()?->can('access-admin'), 403);
        return $next($request);
    }
}
```

`EnsureIsSuperAdmin` está previsto para la fase de panel admin (FASE 7 del roadmap maestro), junto a la gestión de usuarios y configuración global.

## Variables de entorno

Nunca en código. Siempre en `.env`:
```
APP_NAME="Ábaco Developments"
APP_URL=https://abacodev.com
DB_CONNECTION=mariadb
MAIL_MAILER=smtp
# etc.
```

`.env.example` siempre actualizado con todas las variables (sin valores reales).

## Headers de seguridad HTTP

Configurar en Laravel o servidor web:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: [definir por entorno]
```

## Validación de uploads

Si se permiten subidas de archivos:
- Validar MIME type en servidor (no confiar en extensión)
- Almacenar fuera de public/ o usar Storage facade
- Escanear con ClamAV si hay archivos de usuario

## SQL Injection

Eloquent y Query Builder de Laravel utilizan prepared statements automáticamente. Nunca:
```php
// ❌ NUNCA
DB::statement("SELECT * FROM users WHERE email = '$email'");

// ✅ Siempre
User::where('email', $email)->first();
```

## XSS

React escapa el HTML por defecto. Evitar `dangerouslySetInnerHTML` excepto con contenido HTML sanitizado:
```typescript
// Solo cuando sea absolutamente necesario, con DOMPurify
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

En Laravel, Blade escapa por defecto (`{{ }}`). Usar `{!! !!}` solo con HTML confiable.

## Auditoría

> ⚠️ **CORRECCIÓN (Jun 2026):** No usar `spatie/laravel-activitylog`. Usar la tabla **`audit_logs`** propia. Ver D6 en `03_Arquitectura/03_decisiones_dependencias_entornos.md`.

Registrar en la tabla `audit_logs` (propia, sin dependencia externa):
- Login/logout de administradores
- Cambios en configuración global (Settings)
- Creación, edición y eliminación de contenido (Servicios, Casos, Posts)
- Cambios de estado en leads y reservas
- Exportaciones de datos (CSV)

**Implementación:** Via Observers de Eloquent (ej. `PostObserver`, `LeadObserver`) y Listeners de eventos (ej. `RecordLeadEvent`).

```php
// Ejemplo en un Observer
AuditLog::create([
    'user_id'    => auth()->id(),
    'event'      => 'updated',
    'model_type' => Post::class,
    'model_id'   => $post->id,
    'old_values' => $post->getOriginal(['title', 'status']),
    'new_values' => $post->only(['title', 'status']),
    'ip_address' => request()->ip(),
]);
```

Ver `02_modelo_datos.md` para el schema completo de `audit_logs`.

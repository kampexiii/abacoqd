# Convenciones de Código — Ábaco Developments Web

## TypeScript

- `strict: true` en `tsconfig.json` — sin excepciones
- Interfaces para props de todos los componentes
- No usar `any` — usar `unknown` con narrowing si es necesario
- Exportar tipos compartidos desde `types/models.ts`

```typescript
// ✅ Correcto
interface ServiceCardProps {
    service: Service;
    className?: string;
}

// ❌ Incorrecto
const ServiceCard = ({ service, className }: any) => { ... }
```

## React

- Componentes funcionales únicamente
- Un componente = un propósito
- Máximo ~150 líneas por componente
- No lógica de negocio en componentes — usar hooks
- Default export en páginas (`pages/`), named export en componentes
- Textos visibles públicos mediante `useLanguage().t()` y claves en `lang/*.json`; no hardcodear copy en componentes si forma parte de la web pública.

```typescript
// pages/Public/Home.tsx — default export (requiere Inertia)
export default function Home({ services }: HomeProps) { ... }

// components/blocks/ServiceCard.tsx — named export
export function ServiceCard({ service }: ServiceCardProps) { ... }
```

## i18n frontend

> Estado: estas convenciones describen el sistema objetivo de la FASE 3 del roadmap maestro. A 11/06/2026 ni `lang/` ni `useLanguage` existen todavía en el código.

- Carpeta fuente: `lang/` en la raíz (`es` y `en` obligatorios; `fr`, `pt`, `de` solo si se confirma su necesidad).
- `es` es fallback obligatorio.
- Usar `const { t, locale, setLocale, supportedLocales } = useLanguage();`.
- Claves anidadas con dominio claro: `home.hero.title`, `navigation.services`, `pages.contact.submit`.
- Para variables visibles, usar reemplazos: `t('pages.services.showCtaTitle', { serviceTitle: service.title })`.
- Si se añade texto público nuevo, crear la clave en todos los JSON o justificar fallback temporal en documentación.
- No crear rutas localizadas ni slugs traducidos hasta la fase SEO/i18n correspondiente.

## shadcn/ui

- No modificar los archivos en `components/ui/` directamente si hay una opción de variant
- Usar `cn()` de `lib/utils.ts` para combinar clases condicionalmente
- Extender componentes shadcn con variantes propias vía `class-variance-authority`

```typescript
// ✅ Extender con variantes — no duplicar el componente
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg" className="w-full">
    Solicitar presupuesto
</Button>
```

## Tailwind CSS v4

- Todos los valores de diseño en `@theme {}` del CSS — sin valores arbitrarios en componentes
- Usar clases semánticas generadas por los tokens (`bg-brand-primary`, `text-text-muted`)
- Clases `dark:` en cada elemento que cambia en modo oscuro
- Focus visible en todos los interactivos

```tsx
// ✅ Correcto — usa tokens semánticos
<div className="bg-surface-elevated border border-border-default rounded-lg p-6">

// ❌ Incorrecto — valor arbitrario hardcodeado
<div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-6">
```

## Motion UI

- No instalar librerías de animación sin Guardian de Arquitectura.
- Preferir CSS/Tailwind nativo: `transition`, `transform`, `opacity`, `scale`, `shadow` y keyframes ligeros.
- Para reveal de secciones públicas usar `resources/js/hooks/use-in-view.ts` + `.abaco-reveal` / `.abaco-stagger` (se crean en la FASE 1 del roadmap maestro; a 11/06/2026 no existen todavía).
- Toda animación debe respetar `prefers-reduced-motion` y no puede ocultar información esencial.
- Evitar parallax complejo, scroll listeners continuos, cursor effects, canvas, WebGL, vídeo y animaciones de layout.
- Los recursos abstractos de marca deben ser CSS/SVG propios y usar tokens corporativos.

## Laravel (PHP)

### Controllers — thin, solo coordinan

```php
public function store(CreateLeadRequest $request): RedirectResponse
{
    $this->createLead->execute($request->validated());
    return redirect()->back()->with('success', __('messages.lead_sent'));
}
```

### Form Requests — toda la validación aquí

```php
class CreateLeadRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:100'],
            'email'    => ['required', 'email:rfc,dns'],
            'message'  => ['required', 'string', 'min:10', 'max:2000'],
            'honeypot' => ['nullable', 'max:0'],
        ];
    }
}
```

### Actions — una acción = una clase

```php
class CreateLeadAction
{
    public function execute(array $data): Lead
    {
        return DB::transaction(function () use ($data) {
            $lead = Lead::create($data);
            event(new LeadCreated($lead));
            return $lead;
        });
    }
}
```

## Wayfinder — routing type-safe

El starter kit integra **Wayfinder** (no Ziggy) para generar tipos de rutas de Laravel automáticamente en TypeScript.
Wayfinder genera archivos `.ts` de rutas en build time. Nunca hardcodear rutas en componentes React.

> ⚠️ Wayfinder y Ziggy son librerías distintas e incompatibles. Este proyecto usa Wayfinder. No instalar ni importar `ziggy-js`.

```typescript
// ✅ Con Wayfinder — genera tipos estáticos desde las rutas de Laravel
import { route } from '@laravel/wayfinder';
// O usando el helper generado automáticamente:
import { services } from 'routes';  // tipos auto-generados por Wayfinder

<Link href={services.show({ slug: service.slug })}>

// ❌ Hardcodear rutas — nunca
<Link href={`/servicios/${service.slug}`}>

// ❌ No usar ziggy-js — no está instalado en este proyecto
import { route } from 'ziggy-js';  // ERROR: módulo no encontrado
```

**Wayfinder genera los tipos automáticamente al hacer `npm run dev` o `npm run build`.**
Los tipos quedan en `resources/js/routes/` (o similar, según la configuración del starter kit).
Consultar la documentación de Wayfinder para la API exacta de cada versión instalada.

## Naming general

| Elemento              | Convención                               |
| --------------------- | ---------------------------------------- |
| Variables PHP         | `$camelCase`                             |
| Métodos PHP           | `camelCase()`                            |
| Clases PHP            | `PascalCase`                             |
| Rutas Inertia/web     | `kebab-case` (`/blog/mi-articulo`)       |
| Variables JS/TS       | `camelCase`                              |
| Componentes propios   | `PascalCase`                             |
| Componentes shadcn/ui | `kebab-case` (convención de la librería) |
| Hooks                 | `use-nombre.ts` (kebab-case)             |
| Columnas DB           | `snake_case`                             |
| Tablas DB             | `plural_snake_case`                      |

## Comentarios

Solo cuando el PORQUÉ es no obvio:

```php
// ✅ Útil
// MariaDB < 10.5 no soporta CHECK constraints; validar en aplicación
$this->validate($data);

// ❌ Inútil
// Crear el lead
$lead = Lead::create($data);
```

## Commits (conventional commits)

```
feat(blog): agregar paginación infinita
fix(leads): corregir validación de honeypot en móvil
docs(architecture): actualizar estructura de carpetas fase 0
chore(deps): actualizar Laravel a 13.x
```

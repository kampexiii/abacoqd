# PUBLIC_08 — Errores

Última revisión: 28 de junio de 2026.

Fuente de verdad de las vistas de error públicas: 404, 500 y mantenimiento/503. Son páginas ligeras, autocontenidas y con marca, sin depender de contenido dinámico.

## Identificación

| Vista | Estado HTTP | Ruta/uso | Prioridad |
|---|---|---|---|
| 404 no encontrado | 404 | rutas públicas inexistentes | P0 |
| 500 error de servidor | 500 | fallo interno | P0 |
| Mantenimiento | 503 | modo mantenimiento/despliegue | P0 si aplica |

| Campo | Valor |
|---|---|
| Entidades | ninguna |
| SEO | `noindex`, fuera de sitemap |
| Idiomas | ES actual; EN solo si en una fase posterior existe versión real del sitio |

## Objetivo

Que un error no rompa la percepción de marca ni deje al usuario sin salida. Deben ser rápidas, legibles, sin Three.js ni dependencias pesadas.

## 404 — No encontrado

**Estructura visual.**

- Fondo `qd-ink` o variante clara según tema.
- Header global presente si la app puede renderizarlo.
- Centro: isotipo/marca AbacoQD (nunca un icono genérico) sobre el código `404` grande, H1 `Esta página no existe.`, subcopy breve.
- Salidas: `Ir al inicio`, `Ver servicios`, `Proyectos`, `Blog`, `Contacto`.

**Animación.** Líneas de velocidad interrumpidas con drift muy sutil. `prefers-reduced-motion` las congela.

**Interacción.** Los enlaces de recuperación son botones/enlaces normales con foco visible.

## 500 — Error de servidor

**Estructura visual.**

- Fondo sobrio, logo o wordmark reducido.
- H1 `Algo ha fallado de nuestro lado.`
- Subcopy: `Vuelve a intentarlo en unos minutos.`
- Salidas: `Recargar` e `Ir al inicio`.

**Regla técnica documental.** Debe existir versión estática de respaldo para renderizar aunque falle la app JS.

**Animación.** Sin animación decorativa.

## 503 — Mantenimiento

**Estructura visual.**

- Página estática mínima.
- Logo monocromo.
- H1 `Mejorando la plataforma.`
- Subcopy `Volvemos enseguida.`
- Sin navegación si el sitio completo está en mantenimiento.

**SEO/HTTP.** HTTP 503 real y `Retry-After` si aplica.

## Desktop

Layout centrado en viewport con ancho máximo de lectura. Botones de salida en fila. Tipografía grande pero sin ocultar salidas.

## Mobile

Botones apilados, código de error reducido, safe areas respetadas y sin elementos flotantes que tapen acciones.

## Modos claro, oscuro y sistema

404 y 500 pueden usar fondo `qd-ink` fijo por marca o adaptarse al tema. En cualquier caso el contraste debe ser AA. 503 usa versión estática muy ligera, preferiblemente `qd-ink`.

## Componentes usados

Layout de error, botón primario lime, botón ghost, isotipo AbacoQD (elemento de marca, no icono genérico) y enlaces de recuperación. No se carga chatbot en 500/503; en 404 puede aparecer si la app funciona, pero no es obligatorio.

## Interacción

404 ofrece navegación de recuperación; 500 ofrece recargar e inicio; 503 no ofrece interacción dependiente de la app. Todos los botones tienen foco visible y estados hover/focus equivalentes.

## Contenido editable

Copy de lanzamiento en español cerrado con el resto de textos. No depende de `settings` para no fallar en cascada.

## SEO y multilenguaje

Todas las páginas de error son `noindex` y quedan fuera del sitemap. El lanzamiento inicial trabaja en español; si en el futuro existe EN real, el copy podrá desdoblarse por ruta.

## Estados vacíos

No aplica: la vista de error es el estado. No debe depender de BD, imágenes remotas ni contenido administrable.

## Accesibilidad

H1 descriptivo, foco inicial en el contenido principal, enlaces con nombres claros, animaciones decorativas con `aria-hidden`, contraste AA, idioma correcto en `<html>`.

## Relación con chatbot

En 404, si el runtime público funciona, el chatbot puede ofrecer ayuda y enlaces. En 500/503 no se carga para evitar dependencias adicionales.

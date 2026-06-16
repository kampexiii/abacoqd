# PUBLIC_02 — Metodología / Proceso

Última revisión: 14 de junio de 2026.

Fuente de verdad de la metodología: la **sección de landing** (resumida en `PUBLIC_01_HOME_LANDING.md` §2) y la página interna `/metodologia`. `/como-trabajamos` puede conservarse como redirección si se usa en copy o campañas. Paleta, tipografía, componentes y animaciones en `04_IDENTIDAD_UI_COMPONENTES.md`; modelo de datos en `02_MODELO_DATOS.md`.

## Identificación

| Campo | Valor |
|---|---|
| En landing | Sección 2 de `/` (después de Hero, antes de Servicios) |
| Ruta página ES | `/metodologia` |
| Ruta página EN | `/en/methodology` |
| Prioridad | Sección landing P0; página interna P0 documentada para 30/06 |
| Componente previsto | `resources/js/pages/Public/Methodology.tsx` (futuro) |
| Entidades | `methodology_steps`, `page_sections`, `settings` |

## Objetivo

Demostrar que la rapidez de Abaco Developments es **proceso, no improvisación**: análisis, estudio inicial, desarrollo con IA supervisada, revisión y entrega segura. Responde a la objeción "rápido = descontrolado" y empuja a reservar.

## Secuencia canónica de pasos

| # | Paso | Qué es | Entregable |
|---|---|---|---|
| 01 | **Análisis** | Entendemos la idea y el proceso real a acelerar. | Alcance claro. |
| 02 | **Estudio inicial gratuito** | Primera sesión de diagnóstico y encaje antes de decidir (ver bloque dedicado). Gancho comercial diferencial; "gratuito" sujeto a confirmación final. | Síntesis inicial de enfoque, posible alcance y siguiente fase. |
| 03 | **Propuesta / enfoque** | Propuesta de desarrollo con alcance, enfoque y dirección definidos a partir del estudio. | Propuesta clara. |
| 04 | **Desarrollo** | Construcción con IA supervisada y herramientas internas. | Iteraciones visibles. |
| 05 | **Revisión** | Pruebas, revisión técnica y ajustes. | Versión validada. |
| 06 | **Entrega** | Despliegue seguro. | Solución en producción. |

> Secuencia actualizada respecto a la anterior (`Análisis / Mockup previo / Desarrollo / Validación / Entrega / Soporte`): `Mockup previo` se reformula como **Estudio inicial gratuito**, se explicita **Propuesta / enfoque**, `Validación` pasa a **Revisión** y el soporte posterior se trata fuera de la secuencia de captación. El cube-effect carousel de la landing (§A), implementado sobre Swiper (`effect: "cube"`), recorre las 6 caras de esta secuencia, una cara activa por vez, alineadas a estas etiquetas.

## Bloque "Estudio inicial gratuito" (pieza-puente del proceso)

Banda horizontal destacada al pie de la sección Metodología de la landing, **entre el paso 01 (Análisis) y el 02 (Propuesta)**. No es un banner suelto ni una sección nueva: es un puente del flujo.

**Estructura:** badge `01 · Análisis` → flecha → icono boceto/wireframe (`pen-tool`) + label `ESTUDIO INICIAL` + chip lime `Gratuito` + **mensaje principal** + **apoyo** → flecha → badge `02 · Propuesta`.

- **Mensaje principal:** "Antes de pedirte que avances, preferimos enseñarte cómo podría verse."
- **Apoyo:** "Incluimos un primer estudio gratuito para analizar tu idea y plantear una dirección visual o funcional inicial antes de tomar una decisión."

**Qué incluye (descripción).** Reunión de 45-60 minutos para entender objetivo, contexto, urgencia, stack y alcance deseado; revisión básica del caso; detección de necesidades; recomendación de enfoque y siguientes pasos. **No** incluye auditoría jurídica completa, mapa analítico definitivo, redacción integral de contenidos, propuesta técnica detallada ni presupuesto cerrado multipágina salvo acuerdo posterior.

**Objetivo comercial.** Reducir la fricción inicial; demostrar calidad antes de pedir compromiso; transmitir confianza y transparencia; diferenciar AbacoQD de propuestas basadas solo en promesas; permitir que el cliente valore el enfoque antes de avanzar.

**Tono.** Premium y estratégico, no "mockups gratis". Acotado a un *primer* estudio inicial.

> ⚠️ **Decisión comercial PENDIENTE DE APROBACIÓN FINAL.** La política recomendada es una sesión inicial gratuita de 45-60 minutos con entregable breve de diagnóstico inicial, posible alcance y propuesta de siguiente fase. El chip `Gratuito` solo se publica cuando esa política quede aprobada; comunicar siempre acotado y sin prometer trabajo ilimitado.

---

## A) Sección de landing (resumen operativo)

> Detalle de maquetación/estados en `PUBLIC_01_HOME_LANDING.md` §2. Aquí lo específico del statement y del cube-effect carousel.

**Objetivo.** Comunicar el método con un statement de marca y un cube-effect carousel de los 6 pasos; servir de puente Hero → Servicios.

**Estructura.** Split de dos columnas:
- **Izquierda — statement.** Sin cambios: eyebrow `CÓMO TRABAJAMOS` + titular gigante apilado `CODE.` / `QUICK.` / `DELIVER.` (Poppins 800): `CODE` y `DELIVER` en degradado teal→cian con glow, `QUICK` en blanco (oscuro) / `qd-ink` (claro). Cita con barra teal: `Tres ideas. Una misma dirección: desarrollar más rápido, con más criterio y mejor resultado.` Link `Ver cómo trabajamos →`.
- **Derecha — cube-effect carousel de 6 pasos (`MethodologyProcessCube`).** Carrusel con efecto cubo de **Swiper** (`effect: "cube"`, módulos `EffectCube`, `Autoplay`, `Navigation`, `Pagination`, `A11y`): 6 pasos, una cara activa por vez; en reposo solo se ve 1 cara y durante la transición como máximo 2 (la que sale y la que entra), girando como un cubo 3D real. **No hay frontal/back ni se muestran las 6 caras simultáneamente**: cada cara muestra de una sola vez número de paso, icono, título, descripción y chip "Entregable: …", sobre un visual tecnológico propio (nodos, wireframe, checklist, editor de código, validación o despliegue — sin fotografías ni imágenes de stock). Rotación automática lenta con pausa en hover/focus (mouse y teclado), controles manuales anterior/siguiente y navegación por 6 dots situados en una fila bajo el cubo, fuera de la tarjeta, sin tapar el contenido. Sin `tsParticles` ni otras dependencias de partículas.

**Altura.** El carousel es el elemento visual principal de la columna derecha; el grid de la sección usa columnas `items-stretch` para que su altura quede igualada a la del bloque izquierdo del statement (no queda como una mini card suelta ni desborda la sección).

**Desktop.** Statement izquierda + cube-effect carousel derecha (misma altura) + banda del estudio inicial a pie de sección.

**Mobile.** Statement arriba (titular apilado); cube-effect carousel debajo a ancho completo con controles anterior/siguiente y dots en la misma fila bajo el cubo, tamaño reducido y sin scroll lateral.

**Animaciones.** Cube-effect carousel sobre Swiper (`effect: "cube"`): autoplay lento que gira de la cara activa a la siguiente, con pausa en hover/focus (mouse y teclado); avance/retroceso manual por botones anterior/siguiente y por dots; entrada del titular por líneas; bloque estudio inicial con fade-up. Reduced motion: sin autoplay, transición instantánea (velocidad 0), se muestra solo la cara activa y la navegación manual sigue disponible sin animación compleja.

**Componentes.** Eyebrow, `MethodologyProcessCube` (cube-effect carousel de metodología sobre Swiper, con controles anterior/siguiente y dots de navegación en fila bajo el cubo), Bloque "Estudio inicial gratuito" (`04_IDENTIDAD_UI_COMPONENTES.md`).

**Dark/light.** Oscuro: fondo casi negro, caras `qd-ink`/cristal. Claro: fondo `qd-mist`, caras claras/glass. Acentos teal y degradado del titular en ambos. El WaveBackground global se mantiene visible detrás (sin fondos opacos nuevos).

---

## B) Página interna `/metodologia` (P0)

Ampliación del concepto: qué incluye el estudio inicial, qué límites tiene y cómo se transforma en una propuesta real. Ruta pública principal: `/metodologia`; `/como-trabajamos` queda como alias/redirección opcional.

### Estructura de página

**1. Hero compacto.** Fondo `qd-mist`, ~40vh. Eyebrow teal `METODOLOGÍA`; H1 `Rápido porque hay método.`; subcopy de una línea sobre proceso optimizado con IA y supervisión técnica. Decoración: líneas de velocidad sutiles a la derecha (`qd-teal` al 20%). Breadcrumb `Inicio / Metodología`.

**2. Timeline de 6 pasos (núcleo).** Secuencia canónica (tabla arriba), editable desde admin.
- **Desktop:** timeline vertical alternada (paso izquierda / derecha) con línea de progreso central que se rellena de `qd-teal` a `qd-lime` según scroll.
- **Mobile:** línea a la izquierda, cards a la derecha.
- **Card de paso:** número grande Poppins 700 (`01`–`06`, contorneado en teal), icono lucide, título, descripción 2–3 líneas, línea `Entregable:` en chip suave.
- **Paso 02 (Estudio inicial gratuito)** destacado con borde teal/cian y glow: gancho comercial diferencial. Chip `Gratuito` / `sin compromiso` solo si se confirma la política comercial; por defecto no aparece.

**3. Banda — herramientas internas aplicadas a tu proyecto.** Fondo `qd-ink`. H2 + 3 columnas con icono: `Análisis acelerado`, `Desarrollo asistido por IA con control senior`, `Entrega y documentación automatizadas`. Refuerza el diferencial sin revelar herramientas concretas ni inventar métricas.

**4. En qué se traduce para ti.** Fondo `qd-white`. 3 bullets grandes orientados a cliente: tiempos más cortos, precio competitivo, solución adaptada de verdad. Como beneficio, sin cifras ni promesas absolutas (regla dura: no inventar métricas ni plazos).

**5. CTA final.** Banda `qd-ink` con patrón de CTA: H2 corto (`Empezamos por tu análisis.`), botón lime `Reserva hora →`, secundario `Cuéntanos tu proyecto`.

**6. Footer global.**

### Animaciones (página)

- Relleno de la línea ligado al scroll (CSS scroll-driven con fallback IntersectionObserver por tramos; reduced motion: línea completa estática).
- Cada card entra con fade + slide lateral 16 px (400 ms ease-out) al 25% de visibilidad.
- El número del paso activo cambia de contorno a relleno teal.
- Estela de velocidad decorativa al fondo de la banda de herramientas.

### Paleta aplicada (página)

`mist (hero) → white (timeline) → ink (herramientas) → white (beneficios) → ink (CTA)`. Lime solo en relleno final de progreso, chips puntuales y CTA. (Valores en `04_IDENTIDAD_UI_COMPONENTES.md`.)

---

## Entidades relacionadas

- `methodology_steps` — los 6 pasos (número, título, icono, una línea, descripción, entregable, flag de destacado para el paso 02).
- `page_sections` — bloque de la sección en landing y de la página interna.
- `settings` — copy del statement, cita, copy del bloque estudio inicial, CTAs.

## Funcionalidad

- Anclas por paso (`/metodologia#estudio-inicial`) para enlazar desde otras vistas.
- CTA contextual al final de la timeline además del bloque final.

## Estados

- Los pasos son contenido editorial: siempre presentes (seed con la secuencia canónica). Sin estados vacíos.

## Accesibilidad

- La timeline es una lista ordenada semántica (`ol`); la línea animada es decorativa (`aria-hidden`).
- El progreso por scroll no porta información: cada paso es legible de forma independiente.
- Cube-effect carousel de la landing (Swiper `effect: "cube"`) con pausa en hover/focus (mouse y teclado); en reposo solo la cara activa es visible y legible por lectores de pantalla (resto `aria-hidden`), durante la transición se ven como máximo 2 caras; cada cara muestra toda la información del paso (sin frontal/back); botones `aria-label="Paso anterior"` / `"Paso siguiente"` con foco visible, fuera de la tarjeta, y navegación manual por dots con etiqueta por paso; con `prefers-reduced-motion` no hay autoplay, la transición es instantánea y la navegación manual cambia de cara sin animación compleja.
- Contraste de números contorneados verificado sobre fondo claro.

## Relación con chatbot

El asistente puede responder preguntas sobre el proceso, límites del estudio inicial, tiempos orientativos sin prometer plazos cerrados y redirigir a Servicios, Contacto o Reserva. Las respuestas se alimentan de `faqs` por idioma.

## Dark / light

- Sección landing: oscuro fondo casi negro + cards `qd-ink`/cristal; claro fondo `qd-mist` + cards blancas; acentos teal en ambos.
- Página interna: ritmo de bandas mist/white/ink según la paleta aplicada; el paso 02 destacado en ambos temas.

## SEO

- Title ES: `Metodología de trabajo | Abaco Developments`.
- Description: proceso en 6 pasos con estudio inicial, IA supervisada y entrega segura.
- JSON-LD: `BreadcrumbList`; `HowTo` solo si en implementación se valida que aplica sin forzar.
- `hreflang` con `/en/methodology`.

## Decisiones abiertas

- **Estudio inicial gratuito:** aprobar la política recomendada de 45-60 minutos, límites, entregable breve y condición de paso a discovery presupuestable. Bloquea la publicación de la palabra "gratuito" hasta confirmar.
- **Duraciones orientativas por paso:** no se publican salvo que el cliente quiera comprometerlas.

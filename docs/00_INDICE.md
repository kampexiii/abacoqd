# Documentación — AbacoQD / Ábaco Quick Developments

Última revisión: 14 de junio de 2026.

Índice raíz y contrato documental activo. AbacoQD es la fuente de verdad del producto definitivo del 30/06. La documentación histórica de Ábaco Developments se conserva solo como contexto en `90_LEGACY_ABACO_DEVELOPMENTS.md`.

## Alcance vigente

Producto base del 30/06:

- Landing: **Hero → Metodología → Servicios → Colaboraciones → Blog → CTA final → Footer**.
- Vistas reales: Metodología, Servicios, Proyectos, Quiénes somos, Blog, Contacto, Reserva, Aviso legal, Privacidad, Cookies y Errores.
- Panel admin completo en tres documentos activos.
- ES/EN desde el inicio.
- SEO por idioma, slugs, canonical, sitemap, robots y `hreflang`.
- Tema claro/oscuro/sistema.
- Widget de accesibilidad izquierdo.
- Chatbot/asistente derecho.
- Datos corporativos, legales y de contacto editables desde `settings`.
- Reserva agnóstica y fallback a contacto.

Topbar pública final: Logo → Inicio, Metodología, Servicios, Proyectos, Quiénes somos, Blog, Contacto, selector idioma, toggle claro/oscuro/sistema. No hay botón Reservar en topbar. La sección de landing con logos/empresas/trabajos se llama **Colaboraciones**; el modelo interno es `projects`/`partners`/`partner_project`.

## Cierre crítico incorporado

- Dominio canónico final del nuevo sitio: `https://abacoqd.com/`.
- Dominio histórico/investigado: `https://abacodev.com/`.
- URL legal histórica aportada: `https://www.abacodev.com/`.
- Política de redirección: pendiente de confirmar; no se documenta 301 definitiva entre dominios.
- Marca pública visible: **Abaco Developments**. La razón social completa se reserva para aviso legal, privacidad, cookies, facturación o contextos jurídicos.
- Teléfono público/legal principal: pendiente de confirmación entre `+34 91 020 00 89` y `+34 647 51 81 00`.
- Booking: decisión nueva, no heredada; recomendación documental base `Cal.com` si no hay WordPress, `Calendly` como salida rápida, `Amelia` solo si el stack final fuera WordPress.
- Analítica/CMP: decisión nueva; recomendación documental base `GTM + GA4 + Search Console + CookieYes`, añadiendo `Clarity` solo si se aprueba y queda bloqueado por consentimiento.
- Formularios: separar consentimiento obligatorio de privacidad y consentimiento opcional de comunicaciones comerciales.
- UE/FSE+/Fondos Europeos: mantener como bloque institucional, validar ubicación y obligaciones de visibilidad con la ayuda concreta.

## Datos corporativos, legales e institucionales confirmados

Datos reales para publicar y cargar como valores iniciales de `settings`:

- Titular del sitio: ABACO DIGITAL DEVELOPMENTS, S.L.
- Nombre abreviado: ABACO.
- CIF: B-88229364.
- Domicilio: Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid, España.
- Registro Mercantil: Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002.
- Web canónica final: https://abacoqd.com/.
- Dominio histórico/investigado: https://abacodev.com/.
- URL legal histórica aportada: https://www.abacodev.com/.
- Teléfono fijo: +34 91 020 00 89.
- WhatsApp / contacto directo Andrés: +34 647 51 81 00.
- Email principal: info@abacodev.com.
- Email secundario/general: abacodevelopments@gmail.com.
- Email contacto Andrés: andrescasanueva@abacodev.com.
- Bloque institucional: be now Partner, Cofinanciado por la Unión Europea, Fondos Europeos y texto FSE+.

El teléfono `647 518 100` del aviso legal aportado se normaliza como `+34 647 51 81 00`. El titular del CTA final `El 40% del tiempo de un desarrollador se pierde manteniendo código.` queda confirmado como copy aprobado por cliente para el mockup/landing. Siguen pendientes: adaptar aviso legal final al dominio `abacoqd.com`, confirmar si `abacodev.com` redirigirá, convivirá o quedará como dominio antiguo, teléfono legal visible principal, proveedor de reserva definitivo, herramienta de analítica/CMP definitiva, revisión jurídica final de textos legales, ubicación obligatoria de logos UE/FSE+/Fondos Europeos, permisos de proyectos/logos/reseñas/capturas, política final del estudio inicial, copy final ES/EN restante, redes sociales reales y horarios.

## Estructura final

```text
docs/
├── 00_INDICE.md
├── 01_BRIEF_ALCANCE.md
├── 02_MODELO_DATOS.md
├── 03_SEO_MULTILENGUAJE_LEGAL.md
├── 04_IDENTIDAD_UI_COMPONENTES.md
├── 05_ARQUITECTURA_ADMIN.md
├── 06_BACKLOG_IMPLEMENTACION.md
├── 07_VISTAS/
│   ├── 00_INDICE_VISTAS.md
│   ├── PUBLIC_01_HOME_LANDING.md
│   ├── PUBLIC_02_METODOLOGIA_PROCESO.md
│   ├── PUBLIC_03_SERVICIOS.md
│   ├── PUBLIC_04_PROYECTOS.md
│   ├── PUBLIC_05_BLOG.md
│   ├── PUBLIC_06_CONTACTO_RESERVA.md
│   ├── PUBLIC_07_LEGAL_COOKIES_PRIVACIDAD.md
│   ├── PUBLIC_08_ERRORES.md
│   ├── PUBLIC_09_LAYOUT_GLOBAL.md
│   ├── PUBLIC_10_QUIENES_SOMOS.md
│   ├── ADMIN_01_LAYOUT_DASHBOARD_PATRONES.md
│   ├── ADMIN_02_CONTENIDO_MARCA_SERVICIOS_PARTNERS_PROYECTOS.md
│   └── ADMIN_03_BLOG_MENSAJES_RESERVA_USUARIOS_SEO.md
├── assets/
└── 90_LEGACY_ABACO_DEVELOPMENTS.md
```

## Fuente de verdad por tema

| Tema | Fuente |
|---|---|
| Producto, marca, alcance y decisiones comerciales | `01_BRIEF_ALCANCE.md` |
| Modelo conceptual y mapa entidad-vista | `02_MODELO_DATOS.md` |
| SEO, ES/EN, legal, cookies y consentimiento | `03_SEO_MULTILENGUAJE_LEGAL.md` |
| Identidad, tokens, componentes, tema, accesibilidad y chatbot visual | `04_IDENTIDAD_UI_COMPONENTES.md` |
| Arquitectura general admin y contenido administrable | `05_ARQUITECTURA_ADMIN.md` |
| Roadmap de implementación y validaciones | `06_BACKLOG_IMPLEMENTACION.md` |
| Contrato de vistas públicas/admin | `07_VISTAS/00_INDICE_VISTAS.md` |
| Home / landing | `07_VISTAS/PUBLIC_01_HOME_LANDING.md` |
| Metodología / proceso | `07_VISTAS/PUBLIC_02_METODOLOGIA_PROCESO.md` |
| Servicios | `07_VISTAS/PUBLIC_03_SERVICIOS.md` |
| Proyectos (página) y Colaboraciones (sección landing) | `07_VISTAS/PUBLIC_04_PROYECTOS.md` |
| Quiénes somos | `07_VISTAS/PUBLIC_10_QUIENES_SOMOS.md` |
| Blog | `07_VISTAS/PUBLIC_05_BLOG.md` |
| Contacto / Reserva | `07_VISTAS/PUBLIC_06_CONTACTO_RESERVA.md` |
| Legal / Cookies / Privacidad | `07_VISTAS/PUBLIC_07_LEGAL_COOKIES_PRIVACIDAD.md` |
| Errores | `07_VISTAS/PUBLIC_08_ERRORES.md` |
| Layout global | `07_VISTAS/PUBLIC_09_LAYOUT_GLOBAL.md` |

## Documentos fusionados, renombrados o eliminados

- `90_ARCHIVO/futuras/PORTAFOLIO.md` + `90_ARCHIVO/futuras/PORTAFOLIO_DETALLE.md` se recuperaron y fusionaron en `07_VISTAS/PUBLIC_04_PROYECTOS.md` (antes `PUBLIC_04_PORTAFOLIOS.md`).
- `PUBLIC_03_BLOG.md` pasa a `PUBLIC_05_BLOG.md`.
- `PUBLIC_04_CONTACTO_RESERVA.md` pasa a `PUBLIC_06_CONTACTO_RESERVA.md`.
- `PUBLIC_05_LEGAL_ERRORES.md` se separa en `PUBLIC_07_LEGAL_COOKIES_PRIVACIDAD.md` y `PUBLIC_08_ERRORES.md`.
- `PUBLIC_06_LAYOUT_GLOBAL.md` pasa a `PUBLIC_09_LAYOUT_GLOBAL.md`.
- `90_ARCHIVO/futuras/QUIENES_SOMOS.md` se recupera, limpia y convierte en `07_VISTAS/PUBLIC_10_QUIENES_SOMOS.md`.
- No existen activos `12_DECISIONES_MODELO_DATOS.md` ni documentos `16_ADMIN` a `24_ADMIN`; sus decisiones están fusionadas en `02_MODELO_DATOS.md` y en los tres docs admin.

## Archivo

Archivado activo: ninguno tras recuperar Proyectos y Quiénes somos como vistas del producto 30/06. La carpeta `90_ARCHIVO/` estaba vacía y se ha eliminado del repositorio; no queda archivo activo.

No se usa el archivo como papelera. Lo que forma parte del producto se documenta como activo; lo que no aporta se elimina.

## Reglas de documentación

- Una sola fuente de verdad por tema.
- No crear documentos capa para corregir otros documentos.
- No conservar duplicidades activas.
- No documentar como implementado lo que aún no existe en código.
- No inventar clientes, proyectos, reseñas, métricas, logos ni precios.
- `services` es Servicios; `partners`/`projects` alimentan la página **Proyectos** y la sección de landing **Colaboraciones**.
- El nombre público de página/topbar es **Proyectos** y la sección de landing es **Colaboraciones**; no se usa la etiqueta interna de relación ni "Portafolios" como término público activo.
- Validación documental mínima: búsqueda de contradicciones, enlaces `.md` y `git diff --check -- docs CLAUDE.md`.

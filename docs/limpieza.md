# Limpieza de textos publicos, nombres internos y pendientes

Fecha de auditoria: 2026-06-26

Este documento consolida tres auditorias:

1. Textos visibles que suenan a borrador, demo, pendiente, validacion interna o contenido provisional.
2. Referencias a Pablo y combinaciones de Pablo con pendiente/validacion/confirmacion.
3. Referencias a Andres/Andres y combinaciones con pendiente/validacion/confirmacion.

Durante estas tres auditorias iniciales no se modificaron archivos de codigo ni base de datos. La limpieza aplicada despues queda documentada en la seccion siguiente.

## Limpieza aplicada - 2026-06-26

Estado: aplicada en fuentes publicas, payload publico y build regenerado.

Cambios realizados:

- Textos publicos ES/EN: cookies, chatbot, contacto, aviso legal EN, politica de cookies EN, detalle de proyecto y estados vacios pasan a copy neutro sin lenguaje de borrador.
- Payload publico: `ProjectController` deja de enviar `permissionNotes`, `settings` completos, `permissionStatus` e `isApproved` a las vistas publicas de proyectos.
- Proyectos/colaboraciones: las vistas publicas dejan de mostrar badge de estado interno para registros no aprobados; los bloques sin contenido evitan fallbacks de "pendiente".
- Seeders/settings: se retiran menciones a Pablo, `confirmed_by_pablo`, `pending_final_approval`, `images_pending_manual_upload` y descripciones internas con "pendiente" en settings operativos.
- Andres: la etiqueta publica pasa de `WhatsApp / contacto directo Andres` a `WhatsApp / atencion comercial`; el perfil publico se mantiene como dato visible intencional.
- Footer/institucional: se oculta `be now Partner` del footer y se retiran entradas no verificadas de manifiestos bajo `public/assets`.
- Codigo publico: `PABLO_WAVE_PATH` pasa a `WAVE_PATH`; comentarios publicos obsoletos de preview/pendiente se neutralizan.

Archivos modificados en la limpieza:

- `lang/es.json`, `lang/en.json`: copy publico ES/EN, legales, cookies, contacto, detalle de proyecto y estados vacios.
- `resources/js/pages/Public/ProjectDetail.tsx`, `resources/js/pages/Public/Projects.tsx`, `resources/js/components/sections/CollaborationsSection.tsx`: retirada de fallbacks y badges publicos de estado interno.
- `app/Http/Controllers/Public/ProjectController.php`, `app/Http/Controllers/Public/HomeController.php`: sanitizacion de payload publico de proyectos/colaboraciones.
- `database/seeders/ConfirmedProjectsSeeder.php`, `database/seeders/SettingsSeeder.php`, `database/seeders/TeamMemberSeeder.php`, `database/seeders/BookingSettingsSeeder.php`: neutralizacion de nombres internos, estados provisionales y settings publicables.
- `resources/js/components/SiteFooter.tsx`: retirada de marca institucional no verificada y cambio de etiqueta de resenas.
- `resources/js/components/public/WaveBackground.tsx`: renombrado de constante interna a nombre neutro.
- `public/assets/branding/empresas/logos-manifest.json`, `public/assets/branding/institucional/logos-manifest.json`, `public/assets/branding/institucional/README.md`: retirada de logos/entradas no verificadas para publicacion.
- `resources/js/app.tsx`, `app/Http/Controllers/Public/AboutController.php`, `database/seeders/AdminUserSeeder.php`, `resources/js/pages/Public/LegalPage.tsx`, `resources/js/pages/Public/Methodology.tsx`, `resources/js/components/sections/MethodologySection.tsx`, `app/Models/Project.php`, `app/Models/Partner.php`, `app/Support/Seo/StructuredData.php`: limpieza de comentarios no renderizados.
- `docs/limpieza.md`, `docs/auditoria25Junio.md`, `docs/roadmapCierre25Junio.md`: documentacion del cierre.

Validaciones ejecutadas:

- `npm run types:check`: verde.
- `npm run lint:check`: verde.
- `cmd.exe /C npm run build`: verde; build regenerado.
- Busqueda de cierre en `public/build`, `public/assets`, `resources`, `database`, `app`, `routes`, `config` y `lang`: sin coincidencias de los textos criticos exactos.
- `composer test`: no ejecutado; el sandbox bloqueo la ejecucion de PHP/Composer de XAMPP con error WSL/vsock y la solicitud de escalado fue rechazada por limite de uso.

Hallazgos mantenidos y motivo:

- `pending/approved` en enums, migraciones y modelo: compatibilidad interna de datos/admin; no se elimina sin migracion especifica.
- Placeholders de formularios y props `placeholder`: falso positivo tecnico/UX, no transmite contenido provisional.
- Textos `admin.pending` y avisos equivalentes: solo panel interno.
- `AdminUserSeeder` y factories/tests con datos demo: internos de desarrollo, no payload publico.
- Referencias historicas dentro de `docs/`: documentacion/auditoria, no web publica.
- Perfil publico de Andres en equipo: se mantiene como contenido institucional aprobado; no se expone `email_andres` en payload publico.

Pendiente real no maquillado:

- La decision sobre `abacodev.com` sigue sin afirmarse como redireccion definitiva.
- Los avisos admin, factories, tests y docs conservan estados internos cuando son utiles para gestion o historico.
- La columna `permission_status` y enums `pending/approved` siguen existiendo como compatibilidad de modelo/admin; no se ha tocado migracion.

## Cierre adicional - Subfase 7.5 (2026-06-26)

- Se retiran del bundle las claves de idioma muertas del antiguo detalle de proyecto: `projectDetail.partners` (incluia "Quien participa", "Roles del proyecto", "Los roles salen..."), `projectDetail.roles`, `projectDetail.process`, `projectDetail.media` (incluia "Aprobado") y `projectDetail.clientDev`; tambien `projectsPage.badge` y `projectsPage.card.executorBy`. Ya no se renderizaban, pero `lang/*.json` viaja en el bundle. Verificado: `Quien participa` / `Roles del proyecto` / `Los roles salen` ausentes en `public/build` tras `npm run build`.
- El detalle de proyecto elimina el bloque duplicado "Cliente y desarrollo"; el banner superior queda como unica pieza de cliente/desarrollo.

## Criterio de clasificacion

- **Alto**: texto visible en web publica, o dato interno incluido en payload publico, que transmite falta de cierre, validacion pendiente, staging, demo o dato sin confirmar.
- **Medio**: texto que puede aparecer en publico bajo estados concretos, preview, build generado o inspeccion de payload, pero no necesariamente como contenido visible principal.
- **Bajo / revisable**: estado vacio honesto o texto aceptable si la situacion real lo justifica.
- **Admin / interno**: panel, seeders, factories, docs, tests, comentarios o settings no publicos.

## Auditoria 1 - Textos pendientes / demo / validacion interna

### Resumen

- Total relevante tras filtrar ruido y duplicados del build: 49 hallazgos agrupados.
- Publicos de alto riesgo: 8.
- Publicos de riesgo medio: 8.
- Publicos aceptables/revisables: 7.
- Solo admin/interno: 13.
- Comentarios o codigo no renderizado: 13.

### Alto riesgo

1. `lang/en.json:1105`
   - Texto: dominio historico `https://abacodev.com/` con redireccion/coexistencia "pending confirmation".
   - Contexto: aviso legal EN.
   - Publico: si.
   - Recomendacion: dejar solo el dominio oficial confirmado: `The official website of ABACO is https://abacoqd.com/.`

2. `lang/es.json:853`, `lang/en.json:853`, renderizado en `resources/js/pages/Public/ProjectDetail.tsx:237`
   - Texto: `Contenido visible en preview local hasta cerrar permisos` / `Visible in local preview until permissions are closed`.
   - Contexto: tagline del detalle publico de proyecto.
   - Publico: si.
   - Recomendacion: `Proyecto documentado con contexto real.` / `Project documented with real context.`

3. `lang/es.json:877`, `lang/en.json:877`, renderizado en `resources/js/pages/Public/ProjectDetail.tsx:345`
   - Texto: `Trabajo documentado pendiente de validacion final`.
   - Contexto: titulo de proceso en detalle de proyecto.
   - Publico: si.
   - Recomendacion: `Como abordamos el proyecto.` / `How we approached the project.`

4. `lang/es.json:878`, `lang/en.json:878`, renderizado en `resources/js/pages/Public/ProjectDetail.tsx:159`
   - Texto: informacion historica que "debe validarse antes de publicarse como caso aprobado".
   - Contexto: item del proceso en detalle de proyecto.
   - Publico: si.
   - Recomendacion: `Documentamos alcance, decisiones tecnicas y capacidades aplicadas en el proyecto.`

5. `lang/es.json:918-921`, `lang/en.json:918-921`, usados en `resources/js/pages/Public/ProjectDetail.tsx`
   - Texto: `pendiente de validacion final`, `Pendiente de completar`, `no confirmadas`, `Pendiente`.
   - Contexto: fallbacks de hero, bloques, metadatos, tecnologias y partners.
   - Publico: si, si falta cualquier dato del proyecto.
   - Recomendacion: ocultar bloques sin datos; para partners vacios: `Proyecto realizado directamente por Abaco Developments.`

6. `lang/es.json:885`, usado en `resources/js/pages/Public/ProjectDetail.tsx:397`
   - Texto: `Imagen del proyecto pendiente de validacion`.
   - Contexto: fallback de imagen de proyecto.
   - Publico: si.
   - Recomendacion: `Imagen representativa de Abaco Developments` o no mostrar bloque si no hay imagen aprobada.

7. `resources/js/components/SiteFooter.tsx:177`
   - Texto: `be now Partner`.
   - Contexto: footer publico en todas las paginas.
   - Publico: si.
   - Motivo: `public/assets/branding/institucional/logos-manifest.json:33` lo marca como pendiente de fuente verificable.
   - Recomendacion: ocultarlo hasta confirmacion.

8. `lang/es.json:28`, `lang/en.json:28`
   - Texto: `en esta fase` / `at this stage`.
   - Contexto: aviso de cookies.
   - Publico: si.
   - Recomendacion: `No usamos analitica, mapas de calor, publicidad ni proveedores externos.`

### Riesgo medio

1. `lang/en.json:1434`, `lang/en.json:1437`, `lang/en.json:1463-1464`, `lang/en.json:1545`
   - Cookie policy EN menciona `possible measurement tools`, analytics y terceros.
   - Recomendacion: alinear con la politica final: solo cookies tecnicas, tema, idioma y accesibilidad.

2. `lang/es.json:1860`
   - Politica cookies ES contiene condicional futuro sobre incorporar herramientas con consentimiento.
   - Recomendacion: cerrar en presente si no se quiere lenguaje provisional.

3. `resources/js/pages/Public/Projects.tsx:283`, `resources/js/components/sections/CollaborationsSection.tsx:450`
   - Badge: `Pendiente de validacion`.
   - Publico: dudoso; en produccion los modelos filtran aprobados, en preview/staging puede mostrarse.
   - Recomendacion: no renderizar no aprobados en vistas publicas.

4. `lang/es.json:829`, `lang/en.json:829`
   - Texto preparado: marcas historicas pendientes de permiso de publicacion.
   - Publico: dudoso; no se vio renderizado ahora.
   - Recomendacion: eliminar clave o cambiar a `Mostramos solo colaboraciones con permiso de publicacion.`

5. `lang/es.json:1964`, `resources/js/components/SiteFooter.tsx:125`
   - Texto: `Resenas en Google (proximamente)`.
   - Publico: solo si `DEV` y no hay URL.
   - Recomendacion: ocultar el bloque si no hay URL confirmada.

6. `lang/es.json:64`
   - Texto: `Pronto anadiremos preguntas frecuentes aqui`.
   - Publico: si no hay FAQs activas.
   - Recomendacion: `Puedes contactar con el equipo por cualquiera de estos canales.`

7. `lang/es.json:972-974`
   - Texto: `cuando esten validados`, `Equipo en preparacion`.
   - Publico: si no hay miembros visibles.
   - Recomendacion: ocultar bloque o usar copy cerrado.

8. `public/assets/branding/empresas/logos-manifest.json`
   - Estados `pendiente_*` en manifiesto bajo `public`.
   - Publico: por URL directa, no UI normal.
   - Recomendacion: mover manifiestos de auditoria fuera de `public` o publicar solo assets finales.

### Aceptables / revisables

- `lang/es.json:326-327`: `Primeros casos en preparacion` en home colaboraciones sin logos.
- `lang/es.json:338`: blog home sin destacados.
- `lang/es.json:832-833`: proyectos vacios.
- `lang/es.json:1012-1014`: blog sin posts o categoria sin posts.
- `lang/es.json:455-456`: reserva sin citas abiertas.
- `database/seeders/FaqSeeder.php:48`: FAQ con reserva online no disponible.
- `lang/es.json:1931`: 503 `Servicio temporalmente no disponible`.

Mantener solo si esos estados reflejan la situacion real. Si se quiere un tono mas cerrado, sustituir por textos neutros sin "preparando", "proximamente" ni "pendiente".

### Admin / interno / comentarios

- `database/seeders/SettingsSeeder.php:41`: `pendiente de confirmar` en `redirect_policy`, `is_public=false`.
- `database/seeders/SettingsSeeder.php:43`: `be now Partner` pendiente de verificar, interno pero conectado con footer visible.
- `database/seeders/SettingsSeeder.php:52-54`: GTM/GA4/CookieYes/Clarity como recomendaciones pendientes, `is_public=false`.
- `database/seeders/BookingSettingsSeeder.php:24`: `pending_provider_confirmation`.
- `database/seeders/AdminUserSeeder.php:14`: credenciales demo locales.
- `database/factories/TeamMemberFactory.php:24`: `Pendiente de validar`, factory con `is_visible=false`.
- `resources/js/pages/Public/LegalPage.tsx:51`: comentario pendiente de settings publicos.
- `resources/css/app.css:15`, `resources/css/tokens.css:23`, `resources/js/app.tsx:59`: comentarios tecnicos pendientes.
- `resources/js/components/sections/MethodologySection.tsx:15`, `:19`, `:79`: comentarios no renderizados.
- `app/Http/Controllers/Public/ProjectController.php:22`, `app/Models/Project.php:168`, `app/Models/Partner.php:111`: comentarios de gating publico/preview.

## Auditoria 2 - Pablo

### Resumen

- Coincidencias visuales publicas: 0.
- Coincidencias publicas no visuales pero expuestas en payload: 2.
- Alto riesgo: 1.
- Riesgo medio: 1.
- Resto: docs, tests o comentarios internos.

### Alto riesgo

1. `database/seeders/ConfirmedProjectsSeeder.php:78`
   - Texto: `Proyecto real confirmado por Pablo. Realizado en solitario, sin partner ni colaborador. Imagenes/logos pendientes de carga manual desde el CRUD.`
   - Contexto: `permission_notes` del proyecto CIETE.
   - Exposicion: `app/Http/Controllers/Public/ProjectController.php:164` lo envia como `permissionNotes` a la vista publica, aunque `ProjectDetail.tsx` no lo renderiza.
   - Publico: si, por payload Inertia/devtools.
   - Recomendacion: `Proyecto confirmado. Realizado sin partner ni colaborador externo.`
   - Recomendacion tecnica: no enviar `permissionNotes` a la vista publica si no se renderiza.

### Riesgo medio

1. `database/seeders/ConfirmedProjectsSeeder.php:81`
   - Texto: `confirmed_by_pablo`.
   - Contexto: `settings.source`.
   - Exposicion: `app/Http/Controllers/Public/ProjectController.php:165` envia `settings` completo.
   - Publico: si, por payload, no en pantalla.
   - Recomendacion: `confirmed_internal` o eliminar `settings` del payload publico.

### Admin / interno / comentarios

- `database/seeders/ConfirmedProjectsSeeder.php:12`: comentario `Proyectos REALES confirmados por Pablo`.
- `docs/roadmapCierre25Junio.md` y `docs/auditoria25Junio.md`: multiples menciones a Pablo, plantilla, validaciones y decisiones. Documentacion interna.
- `tests/Feature/Admin/TeamMemberCvTest.php` y `tests/Feature/Admin/MediaCleanupTest.php`: slugs/rutas `pablo-test`, `pablo.webp`, solo tests.
- `resources/js/components/public/WaveBackground.tsx:15`: constante `PABLO_WAVE_PATH`, no renderizada como texto. Recomendacion de higiene: renombrar a `WAVE_PATH`.

### Falsos positivos

- `lang/en.json:1149` y `database/seeders/ConfirmedProjectsSeeder.php:54` salieron con busqueda amplia por `pabl`, pero eran palabras inglesas como `capable`.

## Auditoria 3 - Andres / Andres

### Resumen

- Coincidencias en ambito publico sin build: 11 lineas.
- Coincidencias visuales publicas: 2 etiquetas de contacto + perfil de equipo intencional.
- Coincidencias publicas no visuales: build generado contiene duplicados de las traducciones.
- Alto riesgo: 0.
- Riesgo medio: 2.
- Bajo / aceptable: 1.
- Admin / interno / comentarios / docs: resto.

### Riesgo medio

1. `lang/es.json:375`, `lang/en.json:375`, renderizado en `resources/js/pages/Public/Contact.tsx:130`
   - Texto: `WhatsApp / contacto directo Andres` / `WhatsApp / direct contact with Andres`.
   - Contexto: pagina publica de contacto.
   - Publico: si.
   - Motivo: no es un pendiente, pero expone un canal personal por nombre. Puede ser correcto si esta aprobado, pero en produccion corporativa suena menos institucional.
   - Reemplazo recomendado: `WhatsApp / atencion comercial` / `WhatsApp / commercial support`.

2. `database/seeders/TeamMemberSeeder.php:67`
   - Texto: `validation_status => pending_final_approval`.
   - Contexto: `settings` del miembro visible Andres.
   - Publico: no en la pagina; `AboutController` no selecciona `settings`.
   - Riesgo: medio por higiene de datos, no por render actual.
   - Recomendacion: cambiar a estado interno neutro o eliminarlo cuando el perfil este aprobado.

### Bajo / aceptable

1. `database/seeders/TeamMemberSeeder.php:47`, `:57`, `:58`
   - Texto: `Andres Casanueva`, `Retrato de Andres Casanueva`, LinkedIn.
   - Contexto: perfil publico de equipo en `Quienes somos`; `AboutController` solo envia nombre, rol, bio, foto, alt, enlaces y CV.
   - Publico: si.
   - Motivo: parece contenido intencional de equipo, no pendiente ni demo.
   - Recomendacion: mantener si el perfil y LinkedIn estan confirmados.

### Admin / interno / comentarios

- `database/seeders/TeamMemberSeeder.php:14-15`: comentario sobre PNG temporal `andres.png`.
- `database/seeders/TeamMemberSeeder.php:62`: email de Andres en DB; no se envia en `AboutController`.
- `database/seeders/SettingsSeeder.php:29`: descripcion interna del WhatsApp como contacto directo Andres; el valor numerico si es publico.
- `database/seeders/SettingsSeeder.php:32`: `email_andres`, `is_public=false`.
- `.env.example:53`: comentario de correos confirmados por Abaco / Andres.
- `docs/roadmapCierre25Junio.md`, `docs/auditoria25Junio.md` y otros docs: multiples menciones a contenido pendiente de Andres, dependencia externa, correos, fotos, permisos, etc. No son web publica si `docs` no se sirve.
- `.gitignore:34`: comentario sobre plantilla local enviada a Andres.

### Build generado

- `public/build/assets/app-CvZCIAJw.js` contiene duplicados de textos publicos, incluida la etiqueta de WhatsApp con Andres.
- No se cuentan como fuente primaria porque proceden de `lang/*.json` y componentes, pero el build desplegado heredara cualquier cambio pendiente de un nuevo `npm run build`.

## Sustituciones recomendadas por modulo

### Cookies

- Aviso corto:
  - ES: `Usamos cookies tecnicas necesarias y preferencias de tema, idioma y accesibilidad. No usamos analitica, mapas de calor, publicidad ni proveedores externos.`
  - EN: `We use necessary technical cookies and theme, language and accessibility preferences. We do not use analytics, heatmaps, advertising or third-party providers.`
- Politica EN: eliminar `possible measurement tools`, analytics con consentimiento y third-party cookies con consentimiento.

### Aviso legal

- Quitar la frase EN sobre redireccion/coexistencia pendiente de `abacodev.com`.
- Mantener solo dominio oficial confirmado.

### Proyectos / colaboraciones

- Quitar de publico: `preview local`, `pendiente de validacion`, `pendiente de completar`, `no confirmadas`, `permiso pendiente`.
- No enviar a Inertia publico: `permissionNotes`, `settings` completos de proyecto.
- Ocultar `be now Partner` hasta verificar fuente.

### Contacto / reserva

- Cambiar `WhatsApp / contacto directo Andres` por `WhatsApp / atencion comercial` si se busca tono corporativo.
- Mantener estado de reserva sin citas si refleja disponibilidad real.

### Quienes somos

- El perfil publico de Andres es aceptable si esta aprobado.
- Eliminar o neutralizar `pending_final_approval` cuando el perfil deje de estar en revision interna.

### Blog / home / estados vacios

- Mantener estados vacios solo si no hay contenido publicado.
- Preferir textos neutros frente a `proximamente`, `preparando` o `pendiente`.

### Admin / docs

- Las menciones a Pablo/Andres en docs, tests y comentarios no afectan a publico normal.
- Mantener `docs` fuera del despliegue publico.

## Comandos usados

### Auditoria general de pendientes/demo/validacion

```bash
rg -n -i "pendiente|pendientes|validar|validación|validacion|revisión jurídica|revision juridica|revisión final|revision final|pendiente de revisión|pendiente de revision|pendiente de validación|pendiente de validacion|pendiente de confirmación|pendiente de confirmacion|pendiente de aprobación|pendiente de aprobacion|por validar|por confirmar|sin confirmar|por aprobar|aprobación final|aprobacion final|texto base|borrador|no constituye asesoramiento|asesoramiento jurídico|asesoramiento juridico|demo|placeholder|lorem|mockup|ficticio|ficticia|ejemplo|provisional|temporal|staging|WIP|TODO|FIXME|copy pendiente|datos pendientes|ubicación pendiente|ubicacion pendiente|primeros casos en preparación|primeros casos en preparacion|en preparación|en preparacion|no disponible|próximamente|proximamente|se confirmará|se confirmara|falta confirmar|falta validar|revisar con cliente|validar con cliente|pendiente cliente|pendiente Andrés|pendiente Andres" resources database app routes config public lang
```

```bash
rg -n -i --glob '!public/build/**' --glob '!node_modules/**' "pending|draft|temporary|coming soon|to be confirmed|unconfirmed|not available|placeholder|mockup|demo|sample|lorem|staging|wip|todo|fixme|legal review|under construction|in preparation|preparing|preview" resources database app routes config public lang
```

```bash
rg -n -i "analytics|anal[ií]tica|heat|mapa|calor|publicidad|tracking|gtm|ga4|clarity|cookieyes|proveedor|extern" lang resources database app config public
```

### Auditoria Pablo

```bash
rg -n -i "pablo|pendiente.{0,80}pablo|pablo.{0,80}pendiente|validar.{0,80}pablo|pablo.{0,80}validar|validaci[oó]n.{0,80}pablo|pablo.{0,80}validaci[oó]n|revisar.{0,80}pablo|pablo.{0,80}revisar|confirmar.{0,80}pablo|pablo.{0,80}confirmar" resources database app routes config public lang
```

```bash
rg -n -i --hidden --glob '!vendor/**' --glob '!node_modules/**' --glob '!public/build/**' --glob '!.git/**' "pablo|pendiente.{0,100}pablo|pablo.{0,100}pendiente|validar.{0,100}pablo|pablo.{0,100}validar|confirmar.{0,100}pablo|pablo.{0,100}confirmar" .
```

### Auditoria Andres

```bash
rg -n -i "andr[eé]s|andres|pendiente.{0,100}andr[eé]s|andr[eé]s.{0,100}pendiente|validar.{0,100}andr[eé]s|andr[eé]s.{0,100}validar|validaci[oó]n.{0,100}andr[eé]s|andr[eé]s.{0,100}validaci[oó]n|revisar.{0,100}andr[eé]s|andr[eé]s.{0,100}revisar|confirmar.{0,100}andr[eé]s|andr[eé]s.{0,100}confirmar" resources database app routes config public lang
```

```bash
rg -n -i --glob '!public/build/**' --glob '!node_modules/**' "andr[eé]s|andres|pendiente.{0,100}andr[eé]s|andr[eé]s.{0,100}pendiente|validar.{0,100}andr[eé]s|andr[eé]s.{0,100}validar|validaci[oó]n.{0,100}andr[eé]s|andr[eé]s.{0,100}validaci[oó]n|revisar.{0,100}andr[eé]s|andr[eé]s.{0,100}revisar|confirmar.{0,100}andr[eé]s|andr[eé]s.{0,100}confirmar" resources database app routes config public lang
```

```bash
rg -n -i --hidden --glob '!vendor/**' --glob '!node_modules/**' --glob '!public/build/**' --glob '!.git/**' "andr[eé]s|andres|pendiente.{0,100}andr[eé]s|andr[eé]s.{0,100}pendiente|validar.{0,100}andr[eé]s|andr[eé]s.{0,100}validar|confirmar.{0,100}andr[eé]s|andr[eé]s.{0,100}confirmar" .
```

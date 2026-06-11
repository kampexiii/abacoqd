# Sistema Definitivo de Agentes - Abaco Developments Web

Fecha: 9 de junio de 2026.

Estado: definicion documental. No crea agentes reales, no instala herramientas y no habilita automatismos. Este documento define responsabilidades para futuras ejecuciones del proyecto.

Fuente de verdad: `/docs`. Si hay conflicto entre un agente y la documentacion activa, prevalece la documentacion activa y debe intervenir el Guardian de Arquitectura.

## Reglas globales

- Cada agente tiene una unica responsabilidad principal.
- Ningun agente puede reabrir por su cuenta un naming ya cerrado por la documentacion activa.
- Para Fase 1, las entidades base correctas son `Project` y `CollaboratorCompany`.
- Ningun agente puede crear archivos `old`, `backup`, `legacy`, `archive`, `*_old`, `*_backup`, `*_legacy`, `*_final` o `*_v2`.
- Todo cambio debe cerrar con limpieza de archivos no usados.
- Git es el historico.
- El Agente Eliminador de Deuda Tecnica tiene autoridad de limpieza sobre archivos, dependencias, componentes y documentacion obsoleta.
- El Guardian de Arquitectura tiene autoridad para bloquear tareas que contradigan la documentacion.

## 1. Arquitecto Principal

**Mision:** mantener la vision tecnica y funcional global del proyecto.

**Responsabilidades:**
- coordinar decisiones entre arquitectura, producto, UX, SEO, seguridad y planificacion;
- validar que cada fase respeta el roadmap;
- resolver conflictos entre agentes;
- decidir si una tarea requiere intervencion del Guardian de Arquitectura.

**Documentos que consulta:**
- `CLAUDE.md`
- `docs/00-indice.md`
- `docs/03_Arquitectura/*`
- `docs/04_Funcionalidades/*`
- `docs/05_Planificacion/*`
- `docs/POLITICA_LIMPIEZA.md`

**Archivos que puede modificar:**
- documentacion de arquitectura y planificacion;
- documentos de decision;
- `CLAUDE.md` cuando cambie la gobernanza;
- codigo solo cuando la fase tecnica este aprobada.

**Archivos que no puede modificar:**
- archivos de marca sin consultar Branding;
- textos comerciales sin consultar Contenidos;
- dependencias sin validacion del Guardian de Arquitectura.

**Cuando debe intervenir:**
- al iniciar una fase;
- al aparecer una decision no documentada;
- cuando dos agentes entren en conflicto;
- antes de cerrar un sprint.

**Cuando debe bloquear una tarea:**
- si no esta en el roadmap;
- si falta documentacion base;
- si contradice decisiones cerradas;
- si introduce deuda estructural.

**Checklist de validacion:**
- fase localizada en roadmap;
- documentos base consultados;
- riesgos identificados;
- responsables asignados;
- no hay conflicto con `/docs`;
- limpieza final prevista.

## 2. Guardian de Arquitectura

**Mision:** impedir desviaciones de arquitectura y proteger la coherencia tecnica.

**Responsabilidades:**
- validar nuevas dependencias;
- revisar nuevas tablas;
- revisar nuevas rutas;
- revisar nuevos modulos;
- detectar duplicidades;
- bloquear implementaciones fuera de documentacion.

**Documentos que consulta:**
- `docs/03_Arquitectura/*`
- `docs/05_Planificacion/*`
- `docs/POLITICA_LIMPIEZA.md`
- `CLAUDE.md`

**Archivos que puede modificar:**
- documentos de arquitectura;
- documentos de decisiones;
- roadmap si se aprueba cambio de alcance;
- informes de auditoria arquitectonica.

**Archivos que no puede modificar:**
- contenidos finales de marca sin Branding;
- copy comercial sin Contenidos;
- codigo funcional salvo correcciones arquitectonicas aprobadas.

**Cuando debe intervenir:**
- antes de instalar dependencias;
- antes de crear tablas;
- antes de crear rutas;
- antes de crear modulos;
- durante revision de sprint.

**Cuando debe bloquear una tarea:**
- existe una solucion ya definida;
- se introduce una dependencia no aprobada;
- se rompe una convencion;
- se crea codigo duplicado;
- se crean modulos fuera del roadmap;
- se contradice el naming activo de la fase.

**Checklist de validacion:**
- dependencia documentada o descartada;
- tabla prevista en modelo de datos;
- ruta prevista en arquitectura;
- modulo previsto en roadmap;
- naming correcto;
- sin duplicidad;
- sin contradiccion documental.

## 3. Backend Laravel

**Mision:** implementar backend Laravel segun arquitectura aprobada.

**Responsabilidades:**
- modelos, migraciones y relaciones;
- controllers delgados;
- Form Requests;
- Services/Actions;
- Jobs, Events y Listeners;
- Resources;
- integracion con colas, correo y almacenamiento.

**Documentos que consulta:**
- `docs/03_Arquitectura/01_arquitectura_tecnica.md`
- `docs/03_Arquitectura/02_modelo_datos.md`
- `docs/03_Arquitectura/03_decisiones_dependencias_entornos.md`
- `docs/03_Arquitectura/04_seguridad_roles_permisos.md`
- `docs/04_Funcionalidades/*`
- `docs/05_Planificacion/02_convenciones.md`

**Archivos que puede modificar:**
- `app/`
- `database/migrations/`
- `database/seeders/`
- `routes/`
- `config/`
- `resources/views/emails/`

**Archivos que no puede modificar:**
- tokens de branding;
- componentes React salvo contratos de datos acordados;
- dependencias Composer sin Guardian de Arquitectura;
- documentacion de negocio sin Arquitecto Principal.

**Cuando debe intervenir:**
- al implementar una fase backend;
- al crear o modificar datos persistentes;
- al conectar formularios, reservas, leads, correo o media.

**Cuando debe bloquear una tarea:**
- requiere tabla no documentada;
- requiere dependencia no aprobada;
- mezcla logica de negocio en controllers;
- omite Form Request o Policy donde aplica.

**Checklist de validacion:**
- migraciones coherentes;
- modelos con casts/relaciones;
- validacion en Form Requests;
- controllers sin logica pesada;
- Services/Actions usados;
- permisos aplicados;
- tests backend previstos.

## 4. Frontend React

**Mision:** implementar la interfaz React/Inertia respetando arquitectura, tokens y accesibilidad.

**Responsabilidades:**
- paginas Inertia;
- layouts;
- componentes reutilizables;
- integracion con shadcn/ui;
- estados de carga y error;
- contratos TypeScript.

**Documentos que consulta:**
- `docs/02_Branding/02_design_system_tokens.md`
- `docs/03_Arquitectura/01_arquitectura_tecnica.md`
- `docs/04_Funcionalidades/01_estructura_web_y_contenidos.md`
- `docs/05_Planificacion/02_convenciones.md`

**Archivos que puede modificar:**
- `resources/js/pages/`
- `resources/js/components/`
- `resources/js/layouts/`
- `resources/js/hooks/`
- `resources/js/types/`
- `resources/js/lib/`

**Archivos que no puede modificar:**
- `components/ui/` directamente salvo instalacion/configuracion aprobada;
- migraciones o modelos backend;
- textos estrategicos sin Contenidos;
- tokens sin Branding.

**Cuando debe intervenir:**
- al implementar vistas publicas o admin;
- al crear componentes;
- al integrar datos Inertia;
- al ajustar responsive.

**Cuando debe bloquear una tarea:**
- se pide hardcodear colores o textos;
- se introduce `any`;
- se duplica un componente existente;
- se rompe una convencion de carpetas.

**Checklist de validacion:**
- TypeScript estricto;
- componentes con responsabilidad unica;
- tokens usados;
- responsive validado;
- estados vacio/carga/error;
- sin componentes muertos.

## 5. UX/UI

**Mision:** asegurar que la experiencia sea clara, eficiente y coherente con usuarios B2B.

**Responsabilidades:**
- flujos de navegacion;
- jerarquia visual;
- estados interactivos;
- ergonomia de formularios;
- conversion sin friccion;
- consistencia visual de pantallas.

**Documentos que consulta:**
- `docs/01_Investigacion/03_web_seo_captacion.md`
- `docs/01_Investigacion/04_recomendaciones_estrategicas.md`
- `docs/02_Branding/*`
- `docs/04_Funcionalidades/01_estructura_web_y_contenidos.md`
- `docs/04_Funcionalidades/04_analitica_seo_accesibilidad.md`

**Archivos que puede modificar:**
- estructura de paginas;
- componentes de layout y bloques;
- documentacion UX;
- recomendaciones de copy y CTA con Contenidos.

**Archivos que no puede modificar:**
- modelo de datos;
- policies;
- dependencias;
- tokens corporativos sin Branding.

**Cuando debe intervenir:**
- antes de implementar pantallas;
- cuando se disene un flujo de captacion;
- al revisar formularios y conversion.

**Cuando debe bloquear una tarea:**
- el usuario no puede completar el flujo;
- se usan patrones confusos;
- hay textos o controles solapados;
- el diseño contradice la audiencia B2B.

**Checklist de validacion:**
- flujo entendible;
- CTA claro;
- formularios simples;
- estados visibles;
- jerarquia consistente;
- no hay friccion innecesaria.

## 6. Branding

**Mision:** proteger identidad, tono visual y paleta corporativa real.

**Responsabilidades:**
- aplicar paleta validada;
- mantener tokens de marca;
- revisar iconografia, imagenes y estilo visual;
- evitar desviaciones de marca.

**Documentos que consulta:**
- `docs/02_Branding/01_identidad_y_estilo.md`
- `docs/02_Branding/02_design_system_tokens.md`
- `docs/02_Branding/03_validacion_paleta.md`
- `docs/01_Investigacion/02_marca_contenidos_reputacion.md`

**Archivos que puede modificar:**
- documentos de branding;
- tokens CSS/TS cuando la fase tecnica este activa;
- assets de marca aprobados;
- reglas visuales.

**Archivos que no puede modificar:**
- modelo de datos;
- rutas;
- dependencias;
- copy comercial profundo sin Contenidos.

**Cuando debe intervenir:**
- al tocar colores, logo, iconos, imagenes o tono visual;
- antes de crear layouts principales;
- al validar modo claro/oscuro.

**Cuando debe bloquear una tarea:**
- usa colores fuera de paleta sin justificacion;
- reintroduce azul/ambar antiguos;
- baja contraste por estetica;
- rompe coherencia visual.

**Checklist de validacion:**
- usa `#087F8C`, `#088C8C`, `#7ABFBF`, `#B0D9D9`, `#F2F2F2` segun rol;
- tokens respetados;
- modo oscuro coherente;
- imagenes alineadas con marca;
- sin colores arbitrarios.

## 7. SEO, Search & Social Discovery

**Mision:** garantizar que Abaco Developments sea visible, encontrable y relevante para su audiencia objetivo — tanto en motores de busqueda como en redes sociales orientadas a captacion B2B.

**Responsabilidades:**
- SEO tecnico: metadatos, sitemap, Schema.org, canonical, OG tags, hreflang, redirecciones;
- busqueda e intencion: auditar presencia en Google, keywords, clusters, featured snippets;
- arquitectura de contenidos: jerarquia de URLs, pillar pages, evitar canibalización;
- presencia digital: Google Business Profile, ProvenExpert, directorios, backlinks;
- redes sociales orientadas a captacion: LinkedIn (principal), Facebook, Instagram, YouTube Shorts;
- coherencia entre web, redes y presencia publica.

**Documentos que consulta:**
- `docs/01_Investigacion/03_web_seo_captacion.md`
- `docs/01_Investigacion/04_recomendaciones_estrategicas.md`
- `docs/04_Funcionalidades/04_analitica_seo_accesibilidad.md`
- `docs/04_Funcionalidades/01_estructura_web_y_contenidos.md`

**Archivos que puede modificar:**
- metadatos y SEO de paginas (cuando la fase tecnica este activa);
- componentes SchemaMarkup (JSON-LD);
- sitemap y robots.txt;
- configuracion de redirects;
- documentacion SEO en `/docs`.

**Archivos que no puede modificar:**
- contenido comercial sin Contenidos;
- modelo de datos sin Backend/Arquitectura;
- dependencias sin Guardian;
- codigo de aplicacion sin Frontend.

**Cuando debe intervenir:**
- al crear pagina publica;
- al auditar presencia digital de Abaco en buscadores;
- al detectar oportunidades de captacion organica;
- al modificar rutas;
- antes de go-live.

**Cuando debe bloquear una tarea:**
- crea URL sin estrategia SEO documentada;
- omite meta/schema en paginas criticas;
- rompe sitemap;
- genera contenido duplicado indexable;
- publica claims o metricas sin verificar.

**Activa a otros agentes si:**
- Contenidos: propone copy, posts, landings o cambios de tono;
- Guardian: propone dependencia, nueva ruta o integracion externa;
- Rendimiento: propone scripts externos o detecta impacto en Core Web Vitals.

**Checklist de validacion:**
- title/meta definidos (50-60 / 150-160 caracteres);
- canonical correcto;
- schema si aplica;
- OG tags completos;
- sitemap actualizado;
- robots correcto;
- URL coherente con arquitectura de contenidos;
- no hay duplicidad SEO;
- presencia digital auditada antes de go-live.

## 8. Contenidos

**Mision:** mantener mensajes, copy y arquitectura editorial alineados con la estrategia.

**Responsabilidades:**
- copy publico;
- textos de servicios;
- casos de exito;
- CTAs;
- FAQs;
- mensajes de sistema;
- consistencia de tono.

**Documentos que consulta:**
- `docs/01_Investigacion/01_empresa_servicios_mercado.md`
- `docs/01_Investigacion/02_marca_contenidos_reputacion.md`
- `docs/01_Investigacion/04_recomendaciones_estrategicas.md`
- `docs/04_Funcionalidades/01_estructura_web_y_contenidos.md`

**Archivos que puede modificar:**
- copy en documentacion;
- seeds/contenido inicial cuando fase tecnica este aprobada;
- contenidos publicos;
- estructura editorial.

**Archivos que no puede modificar:**
- backend estructural;
- tokens;
- dependencias;
- permisos.

**Cuando debe intervenir:**
- al redactar paginas;
- al crear servicios o casos;
- al definir CTAs;
- al revisar mensajes de formularios.

**Cuando debe bloquear una tarea:**
- usa claims no verificados;
- mezcla clientes directos y partners sin claridad;
- introduce metricas sin fuente;
- contradice posicionamiento.

**Checklist de validacion:**
- tono consultivo;
- claims verificables;
- CTA claro;
- no hay humo;
- coherencia con marca;
- sectores y servicios correctos.

## 9. Accesibilidad

**Mision:** garantizar WCAG 2.2 AA desde el primer componente.

**Responsabilidades:**
- navegacion por teclado;
- contraste;
- labels y errores;
- ARIA cuando haga falta;
- skip links;
- focus visible;
- auditorias manuales y automatizadas.

**Documentos que consulta:**
- `docs/04_Funcionalidades/04_analitica_seo_accesibilidad.md`
- `docs/02_Branding/01_identidad_y_estilo.md`
- `docs/02_Branding/02_design_system_tokens.md`
- `docs/05_Planificacion/01_roadmap.md`

**Archivos que puede modificar:**
- componentes interactivos;
- formularios;
- layouts;
- documentacion de accesibilidad;
- atributos y textos accesibles.

**Archivos que no puede modificar:**
- decisiones de negocio;
- dependencias sin Guardian;
- modelo de datos salvo campos necesarios acordados.

**Cuando debe intervenir:**
- al crear cualquier UI;
- al crear formularios;
- antes de cerrar fase publica/admin;
- durante revision de sprint.

**Cuando debe bloquear una tarea:**
- contraste inferior a AA;
- flujo no operable con teclado;
- formulario sin labels/errores;
- modal o menu inaccesible.

**Checklist de validacion:**
- teclado completo;
- focus visible;
- contraste AA;
- labels presentes;
- errores anunciables;
- landmarks correctos;
- no hay texto solapado.

## 10. Automatizaciones & Workflows

**Mision:** disenar, validar y documentar automatizaciones operativas del proyecto sin sobreingenieria, distinguiendo siempre entre inmediata, futura, descartada y requiere confirmacion.

**Responsabilidades:**
- automatizacion de leads: captura, scoring, notificaciones, eventos, alertas sin atender;
- automatizacion de reservas: confirmacion, recordatorio 24h, seguimiento post-reunion;
- emails transaccionales: plantillas, triggers, sin envios reales en local;
- scheduler: GenerateSitemapJob, SendBookingReminderJob, backup:run, leads:alert-unattended;
- jobs y colas: queues default, low, media, exports; worker con tries y backoff;
- backups automatizados (requiere aprobacion Guardian);
- exportaciones CSV/Excel de leads y reservas;
- alertas de errores y monitorizacion de uptime;
- integraciones futuras con calendarios y CRM externo (Fase 5+).

**Clasificacion obligatoria de cada propuesta:**
1. Inmediata y viable.
2. Futura.
3. Descartada por sobreingenieria.
4. Requiere confirmacion del cliente o de Seguridad.

**Documentos que consulta:**
- `docs/04_Funcionalidades/05_automatizaciones.md`
- `docs/04_Funcionalidades/02_reservas_correo_leads.md`
- `docs/03_Arquitectura/03_decisiones_dependencias_entornos.md`
- `docs/05_Planificacion/01_roadmap.md`

**Archivos que puede modificar:**
- jobs, events, listeners;
- scheduler en `bootstrap/app.php`;
- services/actions de automatizaciones;
- plantillas de email (`resources/views/emails/`);
- documentacion de automatizaciones en `/docs`.

**Archivos que no puede modificar:**
- UI/formularios sin Frontend/UX;
- dependencias sin Guardian;
- politicas de seguridad sin Seguridad.

**Cuando debe intervenir:**
- al automatizar leads, reservas, emails o backups;
- al definir jobs, colas o tareas del scheduler;
- al revisar flujos de seguimiento comercial.

**Cuando debe bloquear una tarea:**
- automatiza un proceso no validado en el roadmap;
- introduce dependencia sin Guardian;
- no contempla fallos/reintentos;
- duplica logica definida en `05_automatizaciones.md`;
- envia datos personales a terceros sin validacion de Seguridad.

**Activa a otros agentes si:**
- Seguridad: toca datos personales, leads, reservas o permisos;
- Leads y Reservas: afecta flujo comercial o estados;
- Backend Laravel: requiere jobs, events, listeners o nuevas tablas.

**Checklist de validacion:**
- clasificacion: inmediata / futura / descartada / requiere confirmacion;
- trigger claro y documentado;
- job/listener con responsabilidad unica;
- reintentos definidos (tries, backoff);
- errores registrados en logs;
- no bloquea UX (cola si es asincrono);
- sin envios reales en local;
- datos personales revisados con Seguridad.

## 11. Leads y Reservas

**Mision:** proteger el flujo de captacion, contacto y solicitud de cita.

**Responsabilidades:**
- formularios de contacto;
- reservas;
- estados de lead/reserva;
- emails asociados;
- validaciones;
- panel operativo de leads/reservas.

**Documentos que consulta:**
- `docs/04_Funcionalidades/02_reservas_correo_leads.md`
- `docs/04_Funcionalidades/05_automatizaciones.md`
- `docs/03_Arquitectura/02_modelo_datos.md`
- `docs/03_Arquitectura/04_seguridad_roles_permisos.md`

**Archivos que puede modificar:**
- requests de contacto/reserva;
- controllers y actions asociados;
- modelos `Lead` y `Booking`;
- emails transaccionales;
- vistas/paginas de contacto y reserva.

**Archivos que no puede modificar:**
- servicios no relacionados;
- dependencias sin Guardian;
- permisos globales sin Seguridad.

**Cuando debe intervenir:**
- al tocar contacto;
- al tocar reservas;
- al crear emails de captacion;
- al cambiar estados o scoring.

**Cuando debe bloquear una tarea:**
- omite honeypot/rate limit;
- expone datos personales sin permiso;
- cambia estados sin documentarlo;
- confunde reserva pendiente con confirmada.

**Checklist de validacion:**
- Form Request;
- CSRF;
- honeypot;
- rate limit;
- estado inicial correcto;
- email usuario/admin;
- auditabilidad de cambios.

## 12. Seguridad

**Mision:** proteger autenticacion, autorizacion, datos personales y operaciones admin.

**Responsabilidades:**
- roles y policies;
- middleware;
- CSRF;
- rate limiting;
- sanitizacion;
- audit logs;
- privacidad de leads/reservas;
- hardening basico.

**Documentos que consulta:**
- `docs/03_Arquitectura/04_seguridad_roles_permisos.md`
- `docs/03_Arquitectura/02_modelo_datos.md`
- `docs/04_Funcionalidades/04_analitica_seo_accesibilidad.md`
- `docs/05_Planificacion/02_convenciones.md`

**Archivos que puede modificar:**
- policies;
- middleware;
- Form Requests;
- configuracion de seguridad;
- audit logs;
- documentacion de seguridad.

**Archivos que no puede modificar:**
- copy comercial;
- branding;
- dependencias sin Guardian;
- rutas publicas sin Arquitecto/Backend.

**Cuando debe intervenir:**
- al crear panel admin;
- al exponer datos personales;
- al crear roles/permisos;
- al procesar formularios.

**Cuando debe bloquear una tarea:**
- falta policy;
- expone PII sin necesidad;
- omite CSRF/rate limit;
- usa HTML sin sanitizacion;
- registra datos sensibles indebidamente.

**Checklist de validacion:**
- permisos por rol;
- policies aplicadas;
- inputs validados;
- logs adecuados;
- datos sensibles protegidos;
- errores no filtran informacion.

## 13. QA

**Mision:** validar que cada fase cumple su checklist funcional y documental.

**Responsabilidades:**
- revision de checklist de fase;
- validacion funcional manual;
- deteccion de regresiones;
- revision de documentacion actualizada;
- cierre de sprint.

**Documentos que consulta:**
- `docs/05_Planificacion/01_roadmap.md`
- `docs/05_Planificacion/02_convenciones.md`
- `docs/POLITICA_LIMPIEZA.md`
- documentos especificos de la fase.

**Archivos que puede modificar:**
- informes QA;
- documentacion de hallazgos;
- pequenos ajustes documentales.

**Archivos que no puede modificar:**
- codigo productivo sin agente responsable;
- dependencias;
- arquitectura.

**Cuando debe intervenir:**
- antes de cerrar cualquier fase;
- antes de entregar al cliente;
- despues de cambios criticos.

**Cuando debe bloquear una tarea:**
- checklist incompleto;
- errores funcionales criticos;
- documentacion desactualizada;
- no se ejecuto limpieza final.

**Checklist de validacion:**
- fase cumple prerequisitos;
- pruebas manuales hechas;
- errores clasificados;
- documentacion alineada;
- limpieza ejecutada;
- no hay tareas abiertas bloqueantes.

## 14. Testing

**Mision:** definir y ejecutar pruebas automatizadas y criterios verificables.

**Responsabilidades:**
- tests Pest;
- tests de integracion;
- tests E2E cuando aplique;
- cobertura de flujos criticos;
- fixtures y factories;
- verificacion de regresiones.

**Documentos que consulta:**
- `docs/05_Planificacion/01_roadmap.md`
- `docs/05_Planificacion/02_convenciones.md`
- `docs/03_Arquitectura/*`
- `docs/04_Funcionalidades/*`

**Archivos que puede modificar:**
- `tests/`
- factories;
- seeders de prueba;
- configuracion de testing;
- documentacion de pruebas.

**Archivos que no puede modificar:**
- codigo productivo salvo arreglo aprobado;
- dependencias sin Guardian;
- contenido/branding.

**Cuando debe intervenir:**
- al crear funcionalidad;
- al corregir bug;
- antes de cerrar fase;
- al detectar regresion.

**Cuando debe bloquear una tarea:**
- no hay prueba para flujo critico;
- no se pueden ejecutar tests base;
- se rompe un test existente sin justificacion;
- se entrega sin verificacion.

**Checklist de validacion:**
- tests relevantes creados;
- happy path cubierto;
- validaciones/error path cubiertos;
- permisos cubiertos;
- comandos de test definidos;
- resultado documentado.

## 15. Rendimiento

**Mision:** mantener velocidad, Core Web Vitals y eficiencia backend/frontend.

**Responsabilidades:**
- Core Web Vitals;
- carga de imagenes;
- queries;
- cache;
- bundles;
- lazy loading;
- colas para tareas pesadas.

**Documentos que consulta:**
- `docs/04_Funcionalidades/04_analitica_seo_accesibilidad.md`
- `docs/03_Arquitectura/03_decisiones_dependencias_entornos.md`
- `docs/03_Arquitectura/01_arquitectura_tecnica.md`
- `docs/05_Planificacion/01_roadmap.md`

**Archivos que puede modificar:**
- configuracion de build;
- carga de assets;
- queries/services;
- cache;
- optimizacion de imagenes;
- documentacion de rendimiento.

**Archivos que no puede modificar:**
- dependencias sin Guardian;
- diseño visual sin UX/Branding;
- contenido sin Contenidos.

**Cuando debe intervenir:**
- antes de go-live;
- al detectar lentitud;
- al introducir imagenes o bundles grandes;
- al crear queries complejas.

**Cuando debe bloquear una tarea:**
- degrada Core Web Vitals;
- carga imagenes sin optimizar;
- introduce N+1;
- bloquea UX con procesos pesados.

**Checklist de validacion:**
- Lighthouse objetivo revisado;
- imagenes optimizadas;
- queries revisadas;
- cache donde aplica;
- bundle razonable;
- tareas pesadas en cola.

## 16. Documentacion

**Mision:** mantener `/docs` como unica fuente de verdad clara, compacta y actualizada.

**Responsabilidades:**
- actualizar indice;
- evitar documentos huerfanos;
- consolidar cambios;
- eliminar duplicados documentales;
- registrar decisiones;
- mantener coherencia con `CLAUDE.md`.

**Documentos que consulta:**
- `docs/00-indice.md`
- `docs/POLITICA_LIMPIEZA.md`
- todos los documentos afectados por la tarea.

**Archivos que puede modificar:**
- `docs/`
- `CLAUDE.md`
- documentos de decision y gobernanza.

**Archivos que no puede modificar:**
- codigo productivo salvo correcciones de enlaces/documentacion embebida;
- dependencias;
- assets.

**Cuando debe intervenir:**
- al crear documento;
- al cambiar una decision;
- al cerrar sprint;
- cuando aparezcan duplicidades.

**Cuando debe bloquear una tarea:**
- crea documento fuera del indice;
- duplica documentacion existente;
- conserva archivos historicos;
- contradice `/docs`.

**Checklist de validacion:**
- indice actualizado;
- documento en carpeta correcta;
- no hay duplicados;
- no hay referencias rotas;
- no hay nombres antiguos;
- Git queda como historico.

## 17. Eliminador de Deuda Tecnica

**Mision:** eliminar todo lo que no forma parte del producto activo o de la documentacion vigente.

**Responsabilidades:**
- eliminar archivos sin uso;
- eliminar dependencias sin uso;
- eliminar componentes muertos;
- eliminar rutas muertas;
- eliminar controladores sin ruta;
- eliminar documentacion obsoleta;
- detectar deuda tecnica acumulada;
- cerrar cada sprint con limpieza real.

**Documentos que consulta:**
- `docs/POLITICA_LIMPIEZA.md`
- `docs/00-indice.md`
- `docs/05_Planificacion/01_roadmap.md`
- `docs/05_Planificacion/02_convenciones.md`
- documentos de arquitectura y funcionalidad afectados.

**Archivos que puede modificar:**
- cualquier archivo confirmado como no usado;
- dependencias en `composer.json` o `package.json` si se confirma que no se usan;
- componentes muertos;
- rutas muertas;
- documentacion obsoleta;
- referencias a archivos eliminados.

**Archivos que no puede modificar:**
- archivos activos sin confirmar impacto;
- migraciones ya ejecutadas sin plan de rollback/migracion;
- datos de produccion;
- archivos necesarios para una fase aprobada.

**Cuando debe intervenir:**
- al final de cada sprint;
- despues de refactors;
- despues de instalar o retirar dependencias;
- cuando QA detecte deuda;
- cuando Documentacion detecte duplicados.

**Cuando debe bloquear una tarea:**
- se intenta conservar algo "por si acaso";
- se crea carpeta `old`, `backup`, `legacy` o `archive`;
- queda codigo muerto;
- quedan dependencias sin uso;
- quedan documentos obsoletos;
- no se puede demostrar que un archivo nuevo se usa.

**Autoridad especial:**
- puede eliminar archivos sin uso;
- puede eliminar dependencias sin uso;
- puede eliminar componentes muertos;
- puede eliminar documentacion obsoleta;
- puede exigir busqueda global antes de cerrar sprint.

**Checklist de validacion:**
- busqueda global de referencias ejecutada;
- imports revisados;
- rutas revisadas;
- dependencias revisadas;
- documentos activos comparados con indice;
- carpetas vacias eliminadas;
- no hay backups ni historicos locales;
- informe de limpieza registrado.

## 18. UI Motion Research

**Mision:** investigar referencias externas de diseno, animaciones y recursos UI modernos, y traducir los hallazgos en recomendaciones aplicables al proyecto sin comprometer rendimiento, accesibilidad ni arquitectura. No implementa ni instala.

**Responsabilidades:**
- investigar patrones visuales, animaciones y scroll interactions en fuentes externas;
- analizar librerias (Motion, GSAP, ScrollX UI) sin instalarlas;
- clasificar cada recomendacion en 5 categorias;
- detectar que puede hacerse solo con CSS/Tailwind sin dependencia;
- evaluar riesgos de rendimiento y accesibilidad antes de recomendar;
- verificar licencias de codigo antes de proponer su uso.

**Categorias de clasificacion obligatorias:**
1. Aplicable ahora sin dependencia (solo CSS/Tailwind).
2. Aplicable mas adelante.
3. Requiere aprobacion de dependencia (escalar a Guardian).
4. No recomendado.
5. Inspiracion visual — no implementacion directa.

**Fuentes iniciales:**
- https://scrollxui.dev/ (prioridad especial)
- https://www.seesaw.website/
- https://motion.dev/
- https://gsap.com/
- https://www.remotion.dev/

**Documentos que consulta:**
- `docs/02_Branding/01_identidad_y_estilo.md`
- `docs/02_Branding/02_design_system_tokens.md`
- `docs/05_Planificacion/02_convenciones.md`
- `docs/POLITICA_LIMPIEZA.md`

**Archivos que puede modificar:**
- ningun archivo de codigo de la aplicacion;
- puede proponer cambios documentales para otros agentes.

**Archivos que no puede modificar:**
- `package.json`, `composer.json`;
- ningun archivo de codigo sin coordinacion con agente responsable;
- tokens de marca sin Branding.

**Cuando debe intervenir:**
- antes de proponer nuevas animaciones o efectos visuales;
- cuando se quiera explorar recursos UI externos;
- al revisar si una libreria de animacion es viable.

**Cuando debe bloquear una tarea:**
- se recomienda instalar dependencia sin pasar por Guardian;
- una animacion no respeta `prefers-reduced-motion`;
- un patron visual contradice la identidad B2B de Abaco;
- se copia codigo externo sin revisar licencia.

**Activa a otros agentes si:**
- Guardian: cualquier dependencia nueva o cambio de arquitectura;
- Rendimiento: scroll animation, canvas, video o assets pesados;
- Accesibilidad: hover-only, teclado, reduced-motion, mareo;
- UX/UI y Branding: cambios visuales importantes o nueva direccion estetica.

**Checklist de entrega:**
- fuente verificada con URL;
- licencia revisada si aplica;
- clasificada en una de las 5 categorias;
- impacto de rendimiento estimado;
- compatibilidad con `prefers-reduced-motion` evaluada;
- alternativa CSS-only indicada si existe;
- escalacion a Guardian si requiere dependencia;
- coherencia con identidad B2B consultora verificada.

---

## Revision obligatoria de sprint

Al finalizar cada sprint deben intervenir, como minimo:

1. QA.
2. Testing.
3. Guardian de Arquitectura.
4. Documentacion.
5. Eliminador de Deuda Tecnica.

La revision debe cubrir:

- auditoria de archivos;
- auditoria de dependencias;
- auditoria de componentes;
- auditoria de documentacion;
- auditoria de arquitectura.

Ningun sprint puede cerrarse si queda una deuda sin responsable, un documento huerfano, una dependencia sin justificar o un archivo sin uso confirmado.

---

## Uso practico de agentes con Claude

Esta seccion explica como invocar los agentes de este sistema cuando se trabaja directamente con Claude en una sesion de desarrollo.

### Que agente invocar segun la tarea

| Tarea | Agente principal | Agente de soporte |
|---|---|---|
| Ajustar tokens, paleta, logo, modo oscuro | Branding | Accesibilidad |
| Crear o modificar componentes React | Frontend React | UX/UI |
| Crear migraciones, modelos, controllers | Backend Laravel | Guardian de Arquitectura |
| Instalar o justificar una dependencia | Guardian de Arquitectura | Backend / Frontend |
| Redactar copy, CTAs, paginas publicas | Contenidos | SEO, Search & Social Discovery |
| Configurar meta, sitemap, schema.org | SEO, Search & Social Discovery | Backend |
| Auditar presencia en Google, keywords, redes | SEO, Search & Social Discovery | Contenidos |
| Investigar animaciones, referencias visuales externas | UI Motion Research | UX/UI, Branding |
| Crear formularios de contacto o reserva | Leads y Reservas | Seguridad, Automatizaciones & Workflows |
| Automatizar emails, jobs, scheduler, backups | Automatizaciones & Workflows | Backend |
| Revisar permisos, policies, middleware | Seguridad | Backend |
| Cerrar una fase | QA + Testing + Guardian + Documentacion + Eliminador |
| Resolver conflicto entre agentes | Arquitecto Principal |

### Que documentos debe leer antes de actuar

Antes de tocar cualquier archivo, el agente debe leer:

1. `CLAUDE.md` — reglas de proyecto.
2. `docs/00-indice.md` — estructura documental.
3. `docs/05_Planificacion/01_roadmap.md` — fase activa, prerequisitos, estado real.
4. El documento especifico de su responsabilidad (ver seccion del agente).

Si la tarea afecta arquitectura, leer tambien:
- `docs/03_Arquitectura/03_decisiones_dependencias_entornos.md`
- `docs/03_Arquitectura/01_arquitectura_tecnica.md`

### Que puede tocar cada agente

Cada agente tiene una lista de "Archivos que puede modificar" definida en su seccion. No tocar lo que no pertenece a la responsabilidad del agente sin coordinacion explicita.

Regla general:
- Solo modificar archivos de la fase activa del roadmap.
- No crear archivos que no esten previstos en la documentacion.
- No instalar dependencias sin pasar por el Guardian de Arquitectura.

### Que no puede tocar

- Ninguna migracion ya ejecutada puede modificarse — solo se añaden migraciones nuevas.
- Los tokens de marca no pueden cambiarse sin el agente Branding.
- El copy comercial no puede modificarse sin el agente Contenidos.
- Ningun agente puede saltarse el naming definido en la documentacion activa.
- Ningun agente puede crear carpetas `old`, `backup`, `legacy`, `archive`.

### Cuando detenerse y preguntar

Un agente debe parar y solicitar confirmacion cuando:

- La tarea requiere una dependencia no documentada en `03_decisiones_dependencias_entornos.md`.
- La tarea requiere crear una tabla no documentada en `02_modelo_datos.md`.
- Hay conflicto entre lo que pide el usuario y lo que dice `/docs`.
- No esta claro en que fase del roadmap encaja la tarea.
- La tarea afecta a datos de produccion o a credenciales.

### Cuando activar al Guardian de Arquitectura

Activar el Guardian antes de:

- instalar cualquier paquete npm o Composer;
- crear una ruta nueva;
- crear una tabla nueva;
- crear un modulo nuevo no previsto en el roadmap;
- duplicar logica que posiblemente ya existe.

### Cuando activar al Eliminador de Deuda Tecnica

Activar el Eliminador:

- al cerrar cada fase o sprint;
- despues de refactors o cambios de nombre;
- cuando QA detecte archivos no usados;
- antes de entregar al cliente.

### Como cerrar una tarea actualizando documentacion

Al finalizar cualquier tarea tecnica:

1. Actualizar `docs/05_Planificacion/01_roadmap.md` — estado real de la fase.
2. Actualizar el documento funcional si cambio algo funcional.
3. Actualizar `docs/03_Arquitectura/` si cambio la estructura, modelos o dependencias.
4. Actualizar `docs/00-indice.md` si se creo o elimino algun documento.
5. Ejecutar el Eliminador de Deuda Tecnica para limpiar lo que ya no se usa.
6. Confirmar que `npm run build` y `npx tsc --noEmit` no tienen errores.

---

### Para SEO, busqueda, Google y redes sociales

Usar el agente **SEO, Search & Social Discovery**.

Debe leer primero:
- `docs/01_Investigacion/03_web_seo_captacion.md`
- `docs/01_Investigacion/04_recomendaciones_estrategicas.md`
- `docs/04_Funcionalidades/04_analitica_seo_accesibilidad.md`

Casos de uso tipicos:
- Auditar como aparece Abaco Developments en Google.
- Detectar oportunidades de keywords por servicio.
- Revisar intension de busqueda de una landing propuesta.
- Recomendar Schema.org para una pagina publica.
- Recomendar estrategia de contenido para LinkedIn.
- Revisar coherencia entre mensajes del sitio y presencia en redes.

### Para automatizaciones, jobs, emails y workflows

Usar el agente **Automatizaciones & Workflows**.

Debe leer primero:
- `docs/04_Funcionalidades/05_automatizaciones.md`
- `docs/04_Funcionalidades/02_reservas_correo_leads.md`
- `docs/03_Arquitectura/03_decisiones_dependencias_entornos.md`

Casos de uso tipicos:
- Disenar el flujo de notificacion interna cuando llega un lead.
- Revisar si el recordatorio de reserva 24h esta bien configurado.
- Proponer automatizacion de exportacion CSV de leads.
- Clasificar si una integracion con CRM externo es viable en la fase actual.
- Revisar configuracion de colas y worker en produccion.

### Para investigacion visual, animaciones y recursos UI externos

Usar el agente **UI Motion Research**.

Debe leer primero:
- `docs/02_Branding/01_identidad_y_estilo.md`
- `docs/02_Branding/02_design_system_tokens.md`
- `docs/05_Planificacion/02_convenciones.md`
- `docs/POLITICA_LIMPIEZA.md`

Casos de uso tipicos:
- Investigar que animaciones usa scrollxui.dev y si alguna es aplicable.
- Evaluar si Motion.dev vale la pena para las transiciones de la home.
- Explorar patrones de cards animadas sin instalar dependencias.
- Revisar si un efecto de parallax es viable sin afectar Core Web Vitals.
- Buscar referencias de hero sections para contexto B2B consultora.

Este agente NO implementa. Sus recomendaciones clasificadas son el input para UX/UI, Frontend y Branding.

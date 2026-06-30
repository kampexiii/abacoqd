# ADMIN_01 — Layout, dashboard y patrones

Última revisión: 28 de junio de 2026.

Fuente de verdad del layout admin, dashboard y patrones comunes. Entidades en `../02_MODELO_DATOS.md`; arquitectura general en `../05_ARQUITECTURA_ADMIN.md`.

## Objetivo

Definir un panel sobrio, rápido y consistente para editar AbacoQD sin tocar código, con control de estados, visibilidad, mantenimiento editorial, accesibilidad y auditoría.

## Layout admin

- Sidebar fija en desktop y drawer en mobile.
- Topbar con buscador, selector de idioma de edición, usuario y enlace a vista pública.
- Contenido en ancho completo, sin cards anidadas.
- Breadcrumbs internos y título de módulo con acciones primarias a la derecha.
- Modo claro/oscuro/sistema coherente con el sitio público.

## Navegación admin

1. Dashboard.
2. Servicios.
3. Proyectos.
4. Partners.
5. Equipo.
6. Blog.
7. Mensajes.
8. Reserva.
9. Chatbot / FAQs.
10. Settings.
11. Usuarios.

Los módulos se agrupan visualmente, pero no se fragmenta la documentación en más archivos.

## Dashboard

Widgets:

- Mensajes nuevos y pendientes.
- Reserva/citas abiertas y próximas.
- Posts programados y borradores.
- Servicios sin traducción o SEO.
- Proyectos/partners sin visibilidad correcta o sin media suficiente.
- Equipo visible y pendientes editoriales.
- FAQs activas por idioma.
- Cambios recientes / auditoría.

Estados vacíos con acción clara: `Crear primer servicio`, `Revisar SEO`, `Configurar reserva`, etc.

## Patrones CRUD

### Listados

Tabla densa pero legible, filtros persistentes, búsqueda, estado, idioma, fecha, orden, destacado y acciones. Selección múltiple solo para acciones seguras: publicar/ocultar, cambiar orden, exportar cuando proceda.

### Formularios

Bloques por estado (`draft`, `published`, `hidden`), visibilidad, destacado, orden, preview y guardado. Si en una fase posterior se publica EN real, se añadirá su tratamiento editorial correspondiente.

### Estados

- `draft`: editable, no público.
- `published`: público si cumple validaciones.
- `hidden`: no público, conserva datos.
- `scheduled`: solo blog.

### Multilenguaje

El lanzamiento actual es Spanish-first. La preparación de contenido EN no se considera requisito de cierre del admin actual.

### SEO

Bloque común para title, description, canonical, OG, noindex, datos estructurados permitidos y vista previa del snippet. Alertas si falta SEO en contenido indexable.

### Media

Campos de imagen por entidad, alt obligatorio si la imagen es informativa, variante claro/oscuro cuando sea logo. No se define media library global en esta fase.

### Accesibilidad admin

Foco visible, navegación teclado, labels reales, errores asociados a campos, contraste AA, botones de tamaño táctil mínimo y respeto de reduced motion.

## Permisos

Roles conceptuales:

- `super_admin`: settings, usuarios, legal, auditoría y todo contenido.
- `admin`: gestión completa salvo operaciones críticas.
- `editor`: contenido, blog, servicios, proyectos y SEO limitado.
- `viewer`: lectura.

Las policies bloquean edición de usuarios/settings/legal a roles no autorizados.

## Auditoría

Registrar cambios sensibles: settings, legal/cookies, SEO global, usuarios/roles, publicación de proyectos, exportación de mensajes/suscriptores y cambios de proveedor de reserva.

## Mobile

El admin es usable en tablet/móvil para revisión y cambios menores, pero edición pesada de blog/proyectos se optimiza para desktop.

## No hacer

- No publicar demo como real.
- No duplicar entidades.
- No crear navegación pública administrable compleja si `settings.navigation` basta.
- No esconder errores de traducción/SEO en pestañas invisibles.

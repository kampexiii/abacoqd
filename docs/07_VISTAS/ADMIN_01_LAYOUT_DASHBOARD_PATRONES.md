# ADMIN_01 — Layout, dashboard y patrones

Última revisión: 14 de junio de 2026.

Fuente de verdad del layout admin, dashboard y patrones comunes. Entidades en `../02_MODELO_DATOS.md`; arquitectura general en `../05_ARQUITECTURA_ADMIN.md`.

## Objetivo

Definir un panel sobrio, rápido y consistente para editar AbacoQD en ES/EN sin tocar código, con control de estados, permisos, SEO, accesibilidad y auditoría.

## Layout admin

- Sidebar fija en desktop y drawer en mobile.
- Topbar con buscador, selector de idioma de edición, usuario y enlace a vista pública.
- Contenido en ancho completo, sin cards anidadas.
- Breadcrumbs internos y título de módulo con acciones primarias a la derecha.
- Modo claro/oscuro/sistema coherente con el sitio público.

## Navegación admin

1. Dashboard.
2. Contenido / Home.
3. Metodología.
4. Servicios.
5. Proyectos.
6. Quiénes somos.
7. Partners.
8. Blog.
9. Mensajes.
10. Reserva.
11. SEO.
12. Legal y cookies.
13. Chatbot / FAQs.
14. Settings.
15. Usuarios.

Los módulos se agrupan visualmente, pero no se fragmenta la documentación en más archivos.

## Dashboard

Widgets:

- Mensajes nuevos y pendientes.
- Reserva activa/inactiva y proveedor.
- Posts programados y borradores.
- Servicios sin traducción o SEO.
- Proyectos pendientes de permisos.
- Partners sin logo/alt o sin permiso marcado.
- Legales pendientes de validación.
- Cookies no técnicas detectadas sin banner configurado.
- FAQs activas por idioma.
- Cambios recientes / auditoría.

Estados vacíos con acción clara: `Crear primer servicio`, `Revisar SEO`, `Configurar reserva`, etc.

## Patrones CRUD

### Listados

Tabla densa pero legible, filtros persistentes, búsqueda, estado, idioma, fecha, orden, destacado y acciones. Selección múltiple solo para acciones seguras: publicar/ocultar, cambiar orden, exportar cuando proceda.

### Formularios

Tabs ES/EN, indicador de traducción faltante, bloque SEO por idioma, estado (`draft`, `published`, `hidden`), visibilidad, destacado, orden, preview y guardado.

### Estados

- `draft`: editable, no público.
- `published`: público si cumple validaciones.
- `hidden`: no público, conserva datos.
- `scheduled`: solo blog.

### Multilenguaje

Cada contenido traducible muestra ES y EN. No se publica contenido clave sin avisar si falta traducción. El admin permite guardar borrador por idioma, pero la publicación pública exige criterio por módulo.

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

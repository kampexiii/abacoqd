/**
 * Marca pública visible del sitio. El resto de datos del sitio (contacto,
 * redes, Google Reviews, footer) NO se define aquí: vive en la tabla `settings`
 * (grupo `site`) con fallback a config/site.php, se expone como prop compartida
 * de Inertia `siteSettings` y se consume con el hook `useSiteSettings()`
 * (`@/lib/site`). Editable desde /admin/settings.
 */
export const SITE_CONFIG = {
    name: 'Abaco Developments',
} as const;

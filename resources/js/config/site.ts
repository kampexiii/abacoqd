/**
 * Configuración centralizada de datos de la empresa.
 * Datos de contacto confirmados en docs/07_VISTAS/PUBLIC_09_LAYOUT_GLOBAL.md.
 * FASE 1: hardcode provisional aquí; en FASE 2+ pasan a `settings` (editable).
 * Marca pública visible = "Abaco Developments"; razón social solo para legales.
 */
export const SITE_CONFIG = {
    name: 'Abaco Developments',
    contact: {
        address: 'Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid',
        email: 'info@abacodev.com',
        phone: '+34 91 020 00 89',
        phoneHref: 'tel:+34910200089',
        whatsapp: '+34 647 51 81 00',
        whatsappHref: 'https://wa.me/34647518100',
    },
    social: {
        linkedin: 'https://www.linkedin.com/company/abaco-developments',
    },
    /**
     * Google Reviews. Integración futura más completa (prueba social en
     * landing/contacto, sin CRUD manual). De momento solo enlace en el footer.
     * `url` queda en null hasta confirmar el perfil/enlace real de Google: no
     * se inventa. Sin URL el enlace se oculta en producción (en local se
     * muestra como pendiente). `rating`/`count` solo si se confirman datos
     * reales; null = no se muestran cifras inventadas.
     */
    googleReviews: {
        url: null as string | null,
        rating: null as number | null,
        count: null as number | null,
    },
} as const;

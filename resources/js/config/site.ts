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
} as const;

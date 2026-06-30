import { usePage } from '@inertiajs/react';

/**
 * Datos del sitio compartidos por el backend (grupo `site` de `settings` con
 * fallback a config/site.php), expuestos como prop de Inertia `siteSettings`.
 * Fuente única para footer, contacto y chatbot: los componentes solo consumen.
 */
export type SiteSettings = {
    readonly contact: {
        readonly email: string | null;
        readonly phone: string | null;
        readonly whatsapp: string | null;
        readonly address: string | null;
        readonly cityCountry: string | null;
    };
    readonly social: {
        readonly linkedin: string | null;
        readonly facebook: string | null;
    };
    readonly googleReviews: {
        readonly url: string | null;
        readonly rating: number | null;
        readonly count: number | null;
        readonly location: string | null;
    };
    readonly footer: {
        readonly text: string | null;
    };
};

const EMPTY_SITE_SETTINGS: SiteSettings = {
    contact: {
        email: null,
        phone: null,
        whatsapp: null,
        address: null,
        cityCountry: null,
    },
    social: { linkedin: null, facebook: null },
    googleReviews: { url: null, rating: null, count: null, location: null },
    footer: { text: null },
};

export function useSiteSettings(): SiteSettings {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;

    return siteSettings ?? EMPTY_SITE_SETTINGS;
}

/** Enlace `tel:` a partir de un teléfono visible (sin espacios). */
export function telHref(phone: string | null): string | null {
    if (!phone) {
        return null;
    }

    return `tel:${phone.replace(/\s+/g, '')}`;
}

/** Enlace de WhatsApp `https://wa.me/<dígitos>` a partir de un número visible. */
export function whatsappHref(whatsapp: string | null): string | null {
    if (!whatsapp) {
        return null;
    }

    const digits = whatsapp.replace(/\D+/g, '');

    return digits ? `https://wa.me/${digits}` : null;
}

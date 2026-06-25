/**
 * Eventos internos AbacoQD — capa de medición 100% local.
 *
 * NO envía nada a red externa, NO usa servidor, NO usa base de datos y NO
 * captura datos personales (nombre, email, teléfono, mensaje, empresa). Solo
 * emite un CustomEvent del navegador (`abacoqd:event`) y lo acumula en un
 * dataLayer propio en memoria (`window.abacoqdDataLayer`) — NUNCA el
 * `window.dataLayer` de Google. Es la base para una futura medición anónima y
 * para, más adelante, conectar proveedores externos solo tras consentimiento.
 */

export type AbacoEventName =
    | 'consent_accept_all'
    | 'consent_reject_all'
    | 'consent_save_preferences'
    | 'consent_open_preferences'
    | 'cta_click'
    | 'contact_submit_intent'
    | 'booking_start_intent'
    | 'booking_submit_intent'
    | 'service_view'
    | 'project_view'
    | 'blog_post_view';

/** Contexto NO identificativo permitido. Jamás PII. */
export type AbacoEventDetail = {
    readonly event: AbacoEventName;
    readonly page?: string;
    readonly slug?: string;
    readonly type?: string;
    readonly location?: string;
    readonly label?: string;
    readonly timestamp: string;
};

type AbacoEventInput = Omit<AbacoEventDetail, 'event' | 'timestamp'>;

declare global {
    interface Window {
        /** dataLayer propio en memoria; no es el de Google ni se persiste. */
        abacoqdDataLayer?: AbacoEventDetail[];
    }
}

// dataLayer interno acotado: ni crece sin límite ni persiste entre sesiones.
const MAX_EVENTS = 200;

/**
 * Registra un evento interno. Solo dispara una señal local del navegador y lo
 * apila en el dataLayer propio. No sale de la pestaña de la persona usuaria.
 */
export function trackEvent(
    event: AbacoEventName,
    input: AbacoEventInput = {},
): void {
    if (typeof window === 'undefined') {
        return;
    }

    const detail: AbacoEventDetail = {
        ...input,
        event,
        page: input.page ?? window.location?.pathname,
        timestamp: new Date().toISOString(),
    };

    const layer = (window.abacoqdDataLayer ??= []);
    layer.push(detail);

    if (layer.length > MAX_EVENTS) {
        layer.splice(0, layer.length - MAX_EVENTS);
    }

    window.dispatchEvent(new CustomEvent('abacoqd:event', { detail }));

    if (import.meta.env.DEV) {
        // Solo en desarrollo; en producción no hay ninguna salida.
        console.debug('[abacoqd:event]', detail);
    }
}

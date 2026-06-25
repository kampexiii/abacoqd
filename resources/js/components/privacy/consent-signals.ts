/**
 * Señales de consentimiento internas AbacoQD — SIN cargar ningún script externo.
 *
 * Traduce las categorías del CMP propio (analytics / marketing) a un vocabulario
 * de señales estable y mantiene/emite ese estado para una futura integración. En
 * esta fase NO se llama a ninguna librería externa ni se carga script alguno:
 * solo se guarda el estado en memoria y se emite un CustomEvent interno
 * (`abacoqd:consent-signals`). Es el único punto donde, si en el futuro se
 * integrara un proveedor, se traduciría la decisión de la persona usuaria.
 *
 * El módulo vive bajo `components/privacy/` (sin «analytics» en la ruta) para no
 * ser bloqueado por navegadores con protección anti-tracking.
 */

import type { ConsentCategories } from '@/hooks/use-consent';

export type ConsentSignal = 'granted' | 'denied';

export type ConsentSignalsState = {
    readonly analytics_storage: ConsentSignal;
    readonly ad_storage: ConsentSignal;
    readonly ad_user_data: ConsentSignal;
    readonly ad_personalization: ConsentSignal;
    readonly functionality_storage: ConsentSignal;
    readonly security_storage: ConsentSignal;
};

/** Estado inicial: todo denegado salvo lo estrictamente funcional/seguridad. */
export const DEFAULT_CONSENT_SIGNALS: ConsentSignalsState = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
};

const signal = (granted: boolean): ConsentSignal =>
    granted ? 'granted' : 'denied';

/** Mapea las categorías del CMP al estado de señales. */
export function toConsentSignals(
    categories: ConsentCategories,
): ConsentSignalsState {
    return {
        analytics_storage: signal(categories.analytics),
        ad_storage: signal(categories.marketing),
        ad_user_data: signal(categories.marketing),
        ad_personalization: signal(categories.marketing),
        functionality_storage: 'granted',
        security_storage: 'granted',
    };
}

let currentState: ConsentSignalsState = DEFAULT_CONSENT_SIGNALS;

export function getConsentSignals(): ConsentSignalsState {
    return currentState;
}

/**
 * Aplica la decisión de consentimiento a las señales internas. En esta fase no
 * existe ningún proveedor, así que solo guarda el estado y emite una señal
 * interna por CustomEvent.
 */
export function applyConsentSignals(
    categories: ConsentCategories,
): ConsentSignalsState {
    currentState = toConsentSignals(categories);

    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent('abacoqd:consent-signals', { detail: currentState }),
        );
    }

    return currentState;
}

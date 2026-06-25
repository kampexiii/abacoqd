/**
 * Preparación interna de Google Consent Mode — SIN cargar gtag, GTM ni GA4.
 *
 * Traduce las categorías del CMP propio (analytics / marketing) al vocabulario
 * de Consent Mode v2 y mantiene/emite ese estado para una futura integración.
 * En esta fase NO se llama a `gtag('consent', ...)` ni se carga ningún script:
 * solo se guarda el estado en memoria y se emite un CustomEvent interno
 * (`abacoqd:consent-mode`). Cuando (si) se integre Google, `applyConsentMode`
 * es el único punto que llamaría a `gtag('consent', 'update', state)`.
 */

import type { ConsentCategories } from '@/hooks/use-consent';

export type ConsentSignal = 'granted' | 'denied';

export type ConsentModeState = {
    readonly analytics_storage: ConsentSignal;
    readonly ad_storage: ConsentSignal;
    readonly ad_user_data: ConsentSignal;
    readonly ad_personalization: ConsentSignal;
    readonly functionality_storage: ConsentSignal;
    readonly security_storage: ConsentSignal;
};

/** Estado inicial: todo denegado salvo lo estrictamente funcional/seguridad. */
export const DEFAULT_CONSENT_MODE_STATE: ConsentModeState = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
};

const signal = (granted: boolean): ConsentSignal =>
    granted ? 'granted' : 'denied';

/** Mapea las categorías del CMP al estado de Consent Mode. */
export function toConsentModeState(
    categories: ConsentCategories,
): ConsentModeState {
    return {
        analytics_storage: signal(categories.analytics),
        ad_storage: signal(categories.marketing),
        ad_user_data: signal(categories.marketing),
        ad_personalization: signal(categories.marketing),
        functionality_storage: 'granted',
        security_storage: 'granted',
    };
}

let currentState: ConsentModeState = DEFAULT_CONSENT_MODE_STATE;

export function getConsentModeState(): ConsentModeState {
    return currentState;
}

/**
 * Aplica el estado de consentimiento al "Consent Mode" interno. En esta fase NO
 * existe `gtag`, así que solo guarda el estado y emite una señal interna.
 */
export function applyConsentMode(
    categories: ConsentCategories,
): ConsentModeState {
    currentState = toConsentModeState(categories);

    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent('abacoqd:consent-mode', { detail: currentState }),
        );
    }

    return currentState;
}

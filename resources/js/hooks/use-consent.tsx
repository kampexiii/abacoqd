import { useSyncExternalStore } from 'react';

/**
 * Consentimiento del CMP propio AbacoQD. Mismo patrón de store singleton +
 * localStorage que use-accessibility / use-appearance / use-language.
 *
 * Persiste SOLO la decisión por categorías (sin datos personales) en
 * localStorage bajo `abacoqd_consent`, con `version` para invalidar decisiones
 * antiguas si cambian las categorías. `necessary` es siempre true. Este store NO
 * carga ningún script externo: solo guarda/expone el estado. La traducción a
 * "Consent Mode" y la (futura) carga condicional de scripts las hace
 * ConsentManager a partir de este estado.
 */

export const CONSENT_STORAGE_KEY = 'abacoqd_consent';
export const CONSENT_VERSION = 1;

/** Categorías del CMP. `necessary` siempre activa; el resto opt-in. */
export type ConsentCategories = {
    readonly necessary: true;
    readonly analytics: boolean;
    readonly marketing: boolean;
};

/** Lo que se persiste en localStorage (sin PII). */
export type ConsentRecord = ConsentCategories & {
    readonly version: number;
    readonly updatedAt: string;
};

export type ConsentState = {
    /** Decisión persistida válida, o null si aún no se ha decidido. */
    readonly record: ConsentRecord | null;
    /** Categorías efectivas (por defecto solo `necessary`). */
    readonly categories: ConsentCategories;
    /** true si hay una decisión guardada de la versión actual. */
    readonly hasDecision: boolean;
};

/** Estado por defecto: solo lo necesario; analítica y marketing denegados. */
const DENIED: ConsentCategories = {
    necessary: true,
    analytics: false,
    marketing: false,
};

const EMPTY_STATE: ConsentState = {
    record: null,
    categories: DENIED,
    hasDecision: false,
};

const listeners = new Set<() => void>();
let current: ConsentState = EMPTY_STATE;
let snapshot: ConsentState = EMPTY_STATE;
let initialized = false;

/** Normaliza el JSON guardado; descarta versiones distintas (re-pedir). */
const sanitize = (raw: unknown): ConsentRecord | null => {
    if (typeof raw !== 'object' || raw === null) {
        return null;
    }

    const data = raw as Record<string, unknown>;

    if (data.version !== CONSENT_VERSION) {
        return null;
    }

    return {
        version: CONSENT_VERSION,
        necessary: true,
        analytics: data.analytics === true,
        marketing: data.marketing === true,
        updatedAt:
            typeof data.updatedAt === 'string'
                ? data.updatedAt
                : new Date().toISOString(),
    };
};

const stateFromRecord = (record: ConsentRecord | null): ConsentState => ({
    record,
    categories: record
        ? {
              necessary: true,
              analytics: record.analytics,
              marketing: record.marketing,
          }
        : DENIED,
    hasDecision: record !== null,
});

const read = (): ConsentState => {
    if (typeof window === 'undefined') {
        return EMPTY_STATE;
    }

    try {
        const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);

        if (!raw) {
            return EMPTY_STATE;
        }

        return stateFromRecord(sanitize(JSON.parse(raw)));
    } catch {
        return EMPTY_STATE;
    }
};

const persist = (record: ConsentRecord): void => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.setItem(
            CONSENT_STORAGE_KEY,
            JSON.stringify(record),
        );
    } catch {
        // Almacenamiento no disponible: el consentimiento solo vive en memoria.
    }
};

const subscribe = (callback: () => void): (() => void) => {
    listeners.add(callback);

    return () => {
        listeners.delete(callback);
    };
};

const notify = (): void => {
    snapshot = current;
    listeners.forEach((listener) => listener());
};

/** Inicialización perezosa idempotente: lee localStorage una sola vez. */
const ensureInitialized = (): void => {
    if (initialized || typeof window === 'undefined') {
        return;
    }

    initialized = true;
    current = read();
    snapshot = current;
};

const commit = (analytics: boolean, marketing: boolean): void => {
    const record: ConsentRecord = {
        version: CONSENT_VERSION,
        necessary: true,
        analytics,
        marketing,
        updatedAt: new Date().toISOString(),
    };

    persist(record);
    initialized = true;
    current = stateFromRecord(record);
    notify();
};

/** Inicializa el store (opcional; `useConsent` también inicializa de forma perezosa). */
export function initializeConsent(): void {
    ensureInitialized();
}

/** Aceptar todo: analytics y marketing a true. */
export function acceptAllConsent(): void {
    commit(true, true);
}

/** Rechazar: analytics y marketing a false (solo `necessary`). */
export function rejectAllConsent(): void {
    commit(false, false);
}

/** Guardar preferencias elegidas en el panel de configuración. */
export function saveConsentPreferences(preferences: {
    readonly analytics: boolean;
    readonly marketing: boolean;
}): void {
    commit(preferences.analytics, preferences.marketing);
}

/** Revocar/cambiar: borra la decisión y vuelve a "sin decidir" (reabre el CMP). */
export function revokeConsent(): void {
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.removeItem(CONSENT_STORAGE_KEY);
        } catch {
            // noop: si no se puede borrar, igualmente reseteamos en memoria.
        }
    }

    current = EMPTY_STATE;
    notify();
}

export function useConsent(): ConsentState {
    ensureInitialized();

    return useSyncExternalStore(
        subscribe,
        () => snapshot,
        () => EMPTY_STATE,
    );
}

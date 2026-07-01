import { useSyncExternalStore } from 'react';

import es from '../../../lang/es.json';

export type Locale = 'es' | 'en';

export const SUPPORTED_LOCALES: readonly Locale[] = ['es', 'en'] as const;

const FALLBACK_LOCALE: Locale = 'es';

type Translations = Record<string, unknown>;
type LanguageSnapshot = {
    readonly locale: Locale;
    readonly version: number;
    // El diccionario activo viaja dentro del snapshot para que sea un valor
    // reactivo observable por React Compiler. Es `undefined` mientras el idioma
    // se está cargando (EN async); en cuanto llega, su referencia cambia y todo
    // texto memoizado que dependa de él se recalcula sin click adicional.
    readonly dictionary: Translations | undefined;
};

// ES viaja en el bundle como idioma por defecto y como fallback siempre
// disponible: evita el parpadeo del primer render y garantiza que ninguna clave
// quede sin resolver. EN se carga bajo demanda (dynamic import) la primera vez
// que se usa, para no arrastrar ambos diccionarios (~230 KB) en cada página.
const translations: Partial<Record<Locale, Translations>> = { es };

const loaders: Partial<Record<Locale, () => Promise<Translations>>> = {
    en: () =>
        import('../../../lang/en.json').then(
            (module) => module.default as Translations,
        ),
};

// Marca los idiomas cuya carga ya está resuelta o en curso (evita disparar el
// import más de una vez). ES está presente desde el arranque.
const requested = new Set<Locale>(['es']);

const listeners = new Set<() => void>();
let currentLocale: Locale = FALLBACK_LOCALE;

// El snapshot de useSyncExternalStore. Cambia (referencia nueva) al cambiar de
// idioma y al terminar de cargar un diccionario asíncrono. `version` garantiza
// identidad nueva siempre; `dictionary` es el valor reactivo que React Compiler
// usa para recalcular las traducciones cuando EN llega tras el primer paint.
let version = 0;

const buildSnapshot = (): LanguageSnapshot => ({
    locale: currentLocale,
    version,
    dictionary: translations[currentLocale],
});

let snapshot: LanguageSnapshot = buildSnapshot();

// ES está siempre presente en el bundle, así que el snapshot de servidor lleva
// su diccionario ya resuelto y es una referencia estable (requisito de SSR).
const serverSnapshot: LanguageSnapshot = {
    locale: FALLBACK_LOCALE,
    version: 0,
    dictionary: es,
};

const notify = (): void => {
    version += 1;
    snapshot = buildSnapshot();
    listeners.forEach((listener) => listener());
};

// Dispara la carga del diccionario del idioma si aún no está en memoria. Al
// resolver, notifica para re-renderizar con las traducciones ya disponibles;
// hasta entonces se sirve el fallback ES sin romper la vista.
const ensureLocaleLoaded = (locale: Locale): void => {
    if (requested.has(locale)) {
        return;
    }

    const loader = loaders[locale];

    if (!loader) {
        return;
    }

    requested.add(locale);
    loader()
        .then((dictionary) => {
            translations[locale] = dictionary;
            notify();
        })
        .catch(() => {
            // Si falla la carga se permite reintentar y se mantiene el fallback.
            requested.delete(locale);
        });
};

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;

    try {
        document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
    } catch {
        // Preferencia no persistible en cookie: localStorage/memoria cubren UI.
    }
};

const isSupportedLocale = (value: string | null): value is Locale => {
    return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
};

const getStoredLocale = (): Locale => {
    if (typeof window === 'undefined') {
        return FALLBACK_LOCALE;
    }

    try {
        const stored = localStorage.getItem('locale');

        return isSupportedLocale(stored) ? stored : FALLBACK_LOCALE;
    } catch {
        return FALLBACK_LOCALE;
    }
};

const applyLocale = (locale: Locale): void => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.lang = locale;
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const getSnapshot = (): LanguageSnapshot => snapshot;
const getServerSnapshot = (): LanguageSnapshot => serverSnapshot;

const resolveKey = (
    dictionary: Translations | undefined,
    key: string,
): string | undefined => {
    if (!dictionary) {
        return undefined;
    }

    const segments = key.split('.');
    let node: unknown = dictionary;

    for (const segment of segments) {
        if (typeof node !== 'object' || node === null) {
            return undefined;
        }

        node = (node as Translations)[segment];
    }

    return typeof node === 'string' ? node : undefined;
};

// Resuelve contra el diccionario activo y cae al fallback ES (siempre cargado).
// Recibe el diccionario por parámetro —no lo lee del global— para que la lógica
// dependa de un valor reactivo del snapshot y React Compiler pueda recalcular.
const translate = (
    dictionary: Translations | undefined,
    key: string,
): string => {
    return resolveKey(dictionary, key) ?? resolveKey(es, key) ?? key;
};

export function initializeLanguage(): void {
    if (typeof window === 'undefined') {
        return;
    }

    currentLocale = getStoredLocale();
    snapshot = buildSnapshot();
    applyLocale(currentLocale);
    // Si la preferencia guardada es EN, se precarga su diccionario ya en el
    // arranque para minimizar el parpadeo tras la hidratación.
    ensureLocaleLoaded(currentLocale);
}

export function useLanguage(): UseLanguageReturn {
    const currentSnapshot = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
    );

    const locale = currentSnapshot.locale;
    // `dictionary` es reactivo: cuando EN termina de cargar, su referencia
    // cambia (undefined → objeto) aunque `locale` siga siendo 'en'. React
    // Compiler observa ese cambio y recalcula `t`, así que el texto pasa a
    // inglés sin click extra ni recarga.
    const dictionary = currentSnapshot.dictionary;

    const setLocale = (next: Locale): void => {
        if (!isSupportedLocale(next)) {
            return;
        }

        currentLocale = next;

        try {
            localStorage.setItem('locale', next);
        } catch {
            // Preferencia no persistible: el cambio en memoria sigue activo.
        }

        setCookie('locale', next);

        applyLocale(next);
        notify();
        ensureLocaleLoaded(next);
    };

    const t = (key: string): string => translate(dictionary, key);

    return { locale, setLocale, t } as const;
}

export type UseLanguageReturn = {
    readonly locale: Locale;
    readonly setLocale: (locale: Locale) => void;
    readonly t: (key: string) => string;
};

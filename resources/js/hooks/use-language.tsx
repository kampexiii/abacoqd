import { useSyncExternalStore } from 'react';

import es from '../../../lang/es.json';

export type Locale = 'es' | 'en';

export const SUPPORTED_LOCALES: readonly Locale[] = ['es', 'en'] as const;

const FALLBACK_LOCALE: Locale = 'es';

type Translations = Record<string, unknown>;

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

// El snapshot de useSyncExternalStore: se incrementa al cambiar de idioma y al
// terminar de cargar un diccionario asíncrono, de modo que los componentes
// re-renderizan cuando EN llega después del primer paint.
let version = 0;

const notify = (): void => {
    version += 1;
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
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const isSupportedLocale = (value: string | null): value is Locale => {
    return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
};

const getStoredLocale = (): Locale => {
    if (typeof window === 'undefined') {
        return FALLBACK_LOCALE;
    }

    const stored = localStorage.getItem('locale');

    return isSupportedLocale(stored) ? stored : FALLBACK_LOCALE;
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

const resolveKey = (locale: Locale, key: string): string | undefined => {
    const segments = key.split('.');
    let node: unknown = translations[locale];

    for (const segment of segments) {
        if (typeof node !== 'object' || node === null) {
            return undefined;
        }

        node = (node as Translations)[segment];
    }

    return typeof node === 'string' ? node : undefined;
};

const translate = (locale: Locale, key: string): string => {
    return resolveKey(locale, key) ?? resolveKey(FALLBACK_LOCALE, key) ?? key;
};

export function initializeLanguage(): void {
    if (typeof window === 'undefined') {
        return;
    }

    currentLocale = getStoredLocale();
    applyLocale(currentLocale);
    // Si la preferencia guardada es EN, se precarga su diccionario ya en el
    // arranque para minimizar el parpadeo tras la hidratación.
    ensureLocaleLoaded(currentLocale);
}

export function useLanguage(): UseLanguageReturn {
    useSyncExternalStore(
        subscribe,
        () => version,
        () => version,
    );

    const locale = currentLocale;

    const setLocale = (next: Locale): void => {
        currentLocale = next;

        localStorage.setItem('locale', next);
        setCookie('locale', next);

        applyLocale(next);
        ensureLocaleLoaded(next);
        notify();
    };

    const t = (key: string): string => translate(locale, key);

    return { locale, setLocale, t } as const;
}

export type UseLanguageReturn = {
    readonly locale: Locale;
    readonly setLocale: (locale: Locale) => void;
    readonly t: (key: string) => string;
};

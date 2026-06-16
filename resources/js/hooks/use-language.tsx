import { useSyncExternalStore } from 'react';

import en from '../../../lang/en.json';
import es from '../../../lang/es.json';

export type Locale = 'es' | 'en';

export const SUPPORTED_LOCALES: readonly Locale[] = ['es', 'en'] as const;

const FALLBACK_LOCALE: Locale = 'es';

type Translations = Record<string, unknown>;

const translations: Record<Locale, Translations> = { es, en };

export type UseLanguageReturn = {
    readonly locale: Locale;
    readonly setLocale: (locale: Locale) => void;
    readonly t: (key: string) => string;
};

const listeners = new Set<() => void>();
let currentLocale: Locale = FALLBACK_LOCALE;

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

const notify = (): void => listeners.forEach((listener) => listener());

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
}

export function useLanguage(): UseLanguageReturn {
    const locale = useSyncExternalStore(
        subscribe,
        () => currentLocale,
        () => FALLBACK_LOCALE,
    );

    const setLocale = (next: Locale): void => {
        currentLocale = next;

        localStorage.setItem('locale', next);
        setCookie('locale', next);

        applyLocale(next);
        notify();
    };

    const t = (key: string): string => translate(locale, key);

    return { locale, setLocale, t } as const;
}

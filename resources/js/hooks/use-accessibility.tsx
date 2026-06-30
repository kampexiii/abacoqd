import { useSyncExternalStore } from 'react';

/**
 * Preferencias de accesibilidad del widget flotante izquierdo.
 * docs/04_IDENTIDAD_UI_COMPONENTES.md §6 · PUBLIC_09_LAYOUT_GLOBAL.md.
 *
 * Estado persistente en localStorage y aplicado como clases en <html> (las
 * reglas viven en resources/css/app.css). Mismo patrón de store singleton que
 * use-appearance / use-language para coherencia del proyecto.
 */

export type TextSize = 'normal' | 'large' | 'xlarge';

export type AccessibilitySettings = {
    readonly textSize: TextSize;
    readonly highContrast: boolean;
    readonly spacing: boolean;
    readonly underlineLinks: boolean;
    readonly reduceMotion: boolean;
    readonly readableFont: boolean;
    readonly focusStrong: boolean;
};

export type UseAccessibilityReturn = {
    readonly settings: AccessibilitySettings;
    readonly setSetting: <K extends keyof AccessibilitySettings>(
        key: K,
        value: AccessibilitySettings[K],
    ) => void;
    readonly reset: () => void;
};

const STORAGE_KEY = 'a11y';

const DEFAULTS: AccessibilitySettings = {
    textSize: 'normal',
    highContrast: false,
    spacing: false,
    underlineLinks: false,
    reduceMotion: false,
    readableFont: false,
    focusStrong: false,
};

const listeners = new Set<() => void>();
let current: AccessibilitySettings = DEFAULTS;
let snapshot: AccessibilitySettings = DEFAULTS;

const read = (): AccessibilitySettings => {
    if (typeof window === 'undefined') {
        return DEFAULTS;
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return DEFAULTS;
        }

        return {
            ...DEFAULTS,
            ...(JSON.parse(raw) as Partial<AccessibilitySettings>),
        };
    } catch {
        return DEFAULTS;
    }
};

const apply = (settings: AccessibilitySettings): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const root = document.documentElement.classList;

    root.toggle('a11y-text-large', settings.textSize === 'large');
    root.toggle('a11y-text-xlarge', settings.textSize === 'xlarge');
    root.toggle('a11y-high-contrast', settings.highContrast);
    root.toggle('a11y-spacing', settings.spacing);
    root.toggle('a11y-underline-links', settings.underlineLinks);
    root.toggle('a11y-reduce-motion', settings.reduceMotion);
    root.toggle('a11y-readable-font', settings.readableFont);
    root.toggle('a11y-focus-strong', settings.focusStrong);
};

const persist = (settings: AccessibilitySettings): void => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => {
    snapshot = { ...current };
    listeners.forEach((listener) => listener());
};

const commit = (next: AccessibilitySettings): void => {
    current = next;
    apply(next);
    persist(next);
    notify();
};

export function initializeAccessibility(): void {
    if (typeof window === 'undefined') {
        return;
    }

    current = read();
    snapshot = { ...current };
    apply(current);
}

export function useAccessibility(): UseAccessibilityReturn {
    const settings = useSyncExternalStore(
        subscribe,
        () => snapshot,
        () => DEFAULTS,
    );

    const setSetting = <K extends keyof AccessibilitySettings>(
        key: K,
        value: AccessibilitySettings[K],
    ): void => {
        commit({ ...current, [key]: value });
    };

    const reset = (): void => {
        commit({ ...DEFAULTS });
    };

    return { settings, setSetting, reset } as const;
}

import { Cookie } from 'lucide-react';
import { useSyncExternalStore } from 'react';

import { useLanguage } from '@/hooks/use-language';
import { cookies as cookiesRoute } from '@/routes/legal';

/**
 * Aviso simple de cookies técnicas — AbacoQD.
 *
 * Solo informa de cookies técnicas necesarias. No hay categorías, ni panel de
 * preferencias, ni analítica, ni eventos internos, ni Consent Mode, ni
 * proveedores externos. localStorage se usa únicamente para recordar que el
 * aviso ya se aceptó (clave `abacoqd_cookie_notice_v1`).
 *
 * Patrón de store singleton + `useSyncExternalStore` (igual que
 * use-accessibility / use-appearance): el snapshot de servidor es "aceptado"
 * para no pintar nada en SSR ni en la primera pasada de hidratación (sin flash
 * ni desajuste de hidratación), y tras montar se lee localStorage en cliente. No
 * usa setState en efecto (regla react-compiler). Se monta en el layout público;
 * no deja botón flotante permanente y se puede reabrir desde `/cookies`.
 */

export const COOKIE_NOTICE_STORAGE_KEY = 'abacoqd_cookie_notice_v1';
export const COOKIE_NOTICE_VERSION = 1;

/** Lo que se persiste; sin PII, sin categorías. */
type CookieNoticeRecord = {
    readonly accepted: boolean;
    readonly version: number;
    readonly updatedAt: string;
};

const listeners = new Set<() => void>();
let accepted = false;
let initialized = false;

/** Lee localStorage: true si hay una aceptación válida de la versión actual. */
const read = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    try {
        const raw = window.localStorage.getItem(COOKIE_NOTICE_STORAGE_KEY);

        if (!raw) {
            return false;
        }

        const data = JSON.parse(raw) as Partial<CookieNoticeRecord>;

        return data.accepted === true && data.version === COOKIE_NOTICE_VERSION;
    } catch {
        return false;
    }
};

/** Inicialización perezosa idempotente: lee localStorage una sola vez. */
const ensureInitialized = (): void => {
    if (initialized || typeof window === 'undefined') {
        return;
    }

    initialized = true;
    accepted = read();
};

const subscribe = (callback: () => void): (() => void) => {
    listeners.add(callback);

    return () => {
        listeners.delete(callback);
    };
};

/** Marca el aviso como aceptado, persiste y notifica. */
const acceptCookieNotice = (): void => {
    if (typeof window !== 'undefined') {
        try {
            const record: CookieNoticeRecord = {
                accepted: true,
                version: COOKIE_NOTICE_VERSION,
                updatedAt: new Date().toISOString(),
            };

            window.localStorage.setItem(
                COOKIE_NOTICE_STORAGE_KEY,
                JSON.stringify(record),
            );
        } catch {
            // Almacenamiento no disponible: solo se oculta en memoria.
        }
    }

    initialized = true;
    accepted = true;
    listeners.forEach((listener) => listener());
};

export default function CookieNotice() {
    ensureInitialized();

    const { t } = useLanguage();
    // Servidor y primera pasada de hidratación: true (aceptado) → no se pinta
    // nada; tras montar se usa el valor real de localStorage.
    const hasAccepted = useSyncExternalStore(
        subscribe,
        () => accepted,
        () => true,
    );

    if (hasAccepted) {
        return null;
    }

    return (
        <div
            role="dialog"
            aria-modal="false"
            aria-label={t('cookieNotice.ariaLabel')}
            className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6"
        >
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-qd-ink/10 bg-qd-white/95 p-5 shadow-[0_24px_60px_-24px_rgba(7,17,26,0.5)] backdrop-blur-sm sm:p-6 dark:border-white/10 dark:bg-qd-surface/95">
                <div className="flex items-start gap-3">
                    <span
                        aria-hidden="true"
                        className="mt-0.5 hidden text-qd-teal-2 sm:block dark:text-qd-teal"
                    >
                        <Cookie size={22} />
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-qd-ink dark:text-qd-white">
                            {t('cookieNotice.title')}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-qd-text-medium">
                            {t('cookieNotice.body')}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                    <a
                        href={cookiesRoute.url()}
                        className="rounded-xl border border-qd-ink/15 px-4 py-2.5 text-center text-sm font-semibold text-qd-ink transition-colors hover:border-qd-teal-2 hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:border-white/15 dark:text-qd-white dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                    >
                        {t('cookieNotice.policyLink')}
                    </a>
                    <button
                        type="button"
                        onClick={acceptCookieNotice}
                        className="rounded-xl bg-qd-teal px-4 py-2.5 text-sm font-bold text-qd-ink transition-colors hover:bg-qd-teal-2 hover:text-qd-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:focus-visible:outline-qd-lime"
                    >
                        {t('cookieNotice.accept')}
                    </button>
                </div>
            </div>
        </div>
    );
}

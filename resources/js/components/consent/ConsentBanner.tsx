import { Cookie } from 'lucide-react';

import { useLanguage } from '@/hooks/use-language';
import { cookies as cookiesRoute } from '@/routes/legal';

/**
 * Banner del CMP propio AbacoQD — tarjeta inferior, modo claro primero y
 * compatible con oscuro. No menciona marcas externas (no hay proveedores
 * activos). No bloquea la navegación ni el hero/topbar/footer (z por debajo de
 * los FAB). Acciones: aceptar todo, rechazar, configurar y enlace a /cookies.
 */

type ConsentBannerProps = {
    readonly onAcceptAll: () => void;
    readonly onReject: () => void;
    readonly onConfigure: () => void;
};

export default function ConsentBanner({
    onAcceptAll,
    onReject,
    onConfigure,
}: ConsentBannerProps) {
    const { t } = useLanguage();

    return (
        <div
            role="dialog"
            aria-modal="false"
            aria-label={t('consent.banner.title')}
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
                            {t('consent.banner.title')}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-qd-text-medium">
                            {t('consent.banner.body')}{' '}
                            <a
                                href={cookiesRoute.url()}
                                className="font-semibold text-qd-teal-2 underline underline-offset-2 transition-colors hover:text-qd-ink dark:text-qd-teal dark:hover:text-qd-white"
                            >
                                {t('consent.banner.policyLink')}
                            </a>
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                    <button
                        type="button"
                        onClick={onReject}
                        className="rounded-xl border border-qd-ink/15 px-4 py-2.5 text-sm font-semibold text-qd-ink transition-colors hover:border-qd-teal-2 hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:border-white/15 dark:text-qd-white dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                    >
                        {t('consent.banner.reject')}
                    </button>
                    <button
                        type="button"
                        onClick={onConfigure}
                        className="rounded-xl border border-qd-ink/15 px-4 py-2.5 text-sm font-semibold text-qd-ink transition-colors hover:border-qd-teal-2 hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:border-white/15 dark:text-qd-white dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                    >
                        {t('consent.banner.configure')}
                    </button>
                    <button
                        type="button"
                        onClick={onAcceptAll}
                        className="rounded-xl bg-qd-teal px-4 py-2.5 text-sm font-bold text-qd-ink transition-colors hover:bg-qd-teal-2 hover:text-qd-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:focus-visible:outline-qd-lime"
                    >
                        {t('consent.banner.acceptAll')}
                    </button>
                </div>
            </div>
        </div>
    );
}

import { BarChart3, Cookie, Lock, MousePointerClick } from 'lucide-react';
import type { ReactNode } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/use-language';

/**
 * Panel de configuración del CMP propio AbacoQD (Radix Dialog controlado).
 *
 * Presentacional puro: el borrador de la elección lo gestiona ConsentManager y
 * se pasa por props (sin estado ni efectos internos). `necessary` se muestra
 * siempre activo y bloqueado; analytics y marketing son opt-in. No carga nada
 * externo; solo recoge la elección y la eleva por callbacks. Las categorías
 * marketing/analytics están preparadas para medición anónima y mapas de calor
 * PROPIOS futuros, sin proveedores externos hoy.
 */

type ConsentPreferencesProps = {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly analytics: boolean;
    readonly marketing: boolean;
    readonly onAnalyticsChange: (value: boolean) => void;
    readonly onMarketingChange: (value: boolean) => void;
    readonly onSave: () => void;
    readonly onAcceptAll: () => void;
    readonly onRejectAll: () => void;
};

function SwitchRow({
    icon,
    title,
    description,
    checked,
    locked = false,
    lockedLabel,
    onToggle,
}: {
    icon: ReactNode;
    title: string;
    description: string;
    checked: boolean;
    locked?: boolean;
    lockedLabel?: string;
    onToggle?: () => void;
}) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-qd-ink/10 bg-qd-white p-4 dark:border-white/10 dark:bg-qd-surface">
            <div className="flex items-start gap-3">
                <span
                    aria-hidden="true"
                    className="mt-0.5 text-qd-teal-2 dark:text-qd-teal"
                >
                    {icon}
                </span>
                <div>
                    <p className="text-sm font-semibold text-qd-ink dark:text-qd-white">
                        {title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-qd-text-medium">
                        {description}
                    </p>
                </div>
            </div>

            {locked ? (
                <span className="shrink-0 rounded-full bg-qd-teal/15 px-2.5 py-1 text-[11px] font-semibold text-qd-teal-2 dark:text-qd-teal">
                    {lockedLabel}
                </span>
            ) : (
                <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-label={title}
                    onClick={onToggle}
                    className="relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:focus-visible:outline-qd-lime"
                >
                    <span
                        aria-hidden="true"
                        className={`absolute inset-0 rounded-full transition-colors ${
                            checked
                                ? 'bg-qd-teal'
                                : 'bg-qd-ink/20 dark:bg-white/20'
                        }`}
                    />
                    <span
                        aria-hidden="true"
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-qd-white shadow transition-all ${
                            checked ? 'left-5.5' : 'left-0.5'
                        }`}
                    />
                </button>
            )}
        </div>
    );
}

export default function ConsentPreferences({
    open,
    onOpenChange,
    analytics,
    marketing,
    onAnalyticsChange,
    onMarketingChange,
    onSave,
    onAcceptAll,
    onRejectAll,
}: ConsentPreferencesProps) {
    const { t } = useLanguage();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90svh] overflow-y-auto border-qd-ink/10 bg-qd-bg text-qd-ink sm:max-w-lg dark:border-white/10 dark:bg-qd-ink dark:text-qd-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-qd-ink dark:text-qd-white">
                        <Cookie
                            aria-hidden="true"
                            size={20}
                            className="text-qd-teal-2 dark:text-qd-teal"
                        />
                        {t('consent.preferences.title')}
                    </DialogTitle>
                    <DialogDescription className="text-qd-text-medium">
                        {t('consent.preferences.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <SwitchRow
                        icon={<Lock size={18} />}
                        title={t('consent.preferences.necessary.title')}
                        description={t(
                            'consent.preferences.necessary.description',
                        )}
                        checked
                        locked
                        lockedLabel={t('consent.preferences.necessary.always')}
                    />
                    <SwitchRow
                        icon={<BarChart3 size={18} />}
                        title={t('consent.preferences.analytics.title')}
                        description={t(
                            'consent.preferences.analytics.description',
                        )}
                        checked={analytics}
                        onToggle={() => onAnalyticsChange(!analytics)}
                    />
                    <SwitchRow
                        icon={<MousePointerClick size={18} />}
                        title={t('consent.preferences.marketing.title')}
                        description={t(
                            'consent.preferences.marketing.description',
                        )}
                        checked={marketing}
                        onToggle={() => onMarketingChange(!marketing)}
                    />
                </div>

                <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onRejectAll}
                            className="rounded-xl border border-qd-ink/15 px-3.5 py-2.5 text-sm font-semibold text-qd-ink transition-colors hover:border-qd-teal-2 hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:border-white/15 dark:text-qd-white dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                        >
                            {t('consent.preferences.reject')}
                        </button>
                        <button
                            type="button"
                            onClick={onAcceptAll}
                            className="rounded-xl border border-qd-ink/15 px-3.5 py-2.5 text-sm font-semibold text-qd-ink transition-colors hover:border-qd-teal-2 hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:border-white/15 dark:text-qd-white dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                        >
                            {t('consent.preferences.acceptAll')}
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={onSave}
                        className="rounded-xl bg-qd-teal px-4 py-2.5 text-sm font-bold text-qd-ink transition-colors hover:bg-qd-teal-2 hover:text-qd-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:focus-visible:outline-qd-lime"
                    >
                        {t('consent.preferences.save')}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

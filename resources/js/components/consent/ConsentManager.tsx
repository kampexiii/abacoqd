import { usePage } from '@inertiajs/react';
import { Cookie } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { applyConsentMode } from '@/components/analytics/consent-mode';
import { trackEvent } from '@/components/analytics/events';
import { runPermittedLoaders } from '@/components/analytics/script-gate';
import ConsentBanner from '@/components/consent/ConsentBanner';
import ConsentPreferences from '@/components/consent/ConsentPreferences';
import {
    acceptAllConsent,
    rejectAllConsent,
    saveConsentPreferences,
    useConsent,
} from '@/hooks/use-consent';
import { useLanguage } from '@/hooks/use-language';

/**
 * Orquestador del CMP propio AbacoQD (montado en el layout público).
 *
 * Une el estado de consentimiento (use-consent) con la UI (banner + panel) y
 * con las capas internas: traduce la decisión a "Consent Mode" propio
 * (sin gtag) y ejecuta la compuerta de loaders (inerte en esta fase). Solo se
 * renderiza si la prop Inertia `consent.enabled` es true. Reabrir preferencias:
 * botón flotante discreto o evento `window` `abacoqd:open-consent`.
 */

type ConsentConfig = {
    readonly enabled: boolean;
    readonly externalTracking: boolean;
};

const DISABLED_CONFIG: ConsentConfig = { enabled: false, externalTracking: false };

export default function ConsentManager() {
    const { t } = useLanguage();
    const { consent } = usePage<{ consent?: ConsentConfig }>().props;
    const config = consent ?? DISABLED_CONFIG;

    const { categories, hasDecision } = useConsent();
    const [panelOpen, setPanelOpen] = useState(false);
    // Borrador del panel (no se persiste hasta "Guardar"). Se siembra con la
    // decisión vigente al abrir, en el handler (sin efecto, sin setState en
    // efecto que dispare renders en cascada).
    const [draftAnalytics, setDraftAnalytics] = useState(false);
    const [draftMarketing, setDraftMarketing] = useState(false);

    // Traduce la decisión al Consent Mode interno y abre la compuerta de loaders.
    // En esta fase no carga nada externo: solo fija el estado (inicial: denied).
    useEffect(() => {
        applyConsentMode(categories);
        runPermittedLoaders({
            categories,
            externalTrackingEnabled: config.externalTracking,
        });
    }, [categories, config.externalTracking]);

    const openPreferences = useCallback(() => {
        setDraftAnalytics(categories.analytics);
        setDraftMarketing(categories.marketing);
        trackEvent('consent_open_preferences');
        setPanelOpen(true);
    }, [categories.analytics, categories.marketing]);

    // Punto de entrada programático para reabrir preferencias desde cualquier
    // sitio (p. ej. un enlace futuro): `dispatchEvent('abacoqd:open-consent')`.
    useEffect(() => {
        const handler = (): void => openPreferences();
        window.addEventListener('abacoqd:open-consent', handler);

        return () => window.removeEventListener('abacoqd:open-consent', handler);
    }, [openPreferences]);

    const handleAcceptAll = useCallback(() => {
        acceptAllConsent();
        trackEvent('consent_accept_all');
        setPanelOpen(false);
    }, []);

    const handleReject = useCallback(() => {
        rejectAllConsent();
        trackEvent('consent_reject_all');
        setPanelOpen(false);
    }, []);

    const handleSave = useCallback(() => {
        saveConsentPreferences({
            analytics: draftAnalytics,
            marketing: draftMarketing,
        });
        trackEvent('consent_save_preferences');
        setPanelOpen(false);
    }, [draftAnalytics, draftMarketing]);

    if (!config.enabled) {
        return null;
    }

    const showBanner = !hasDecision && !panelOpen;
    const showReopen = hasDecision && !panelOpen;

    return (
        <>
            {showBanner && (
                <ConsentBanner
                    onAcceptAll={handleAcceptAll}
                    onReject={handleReject}
                    onConfigure={openPreferences}
                />
            )}

            {showReopen && (
                <button
                    type="button"
                    onClick={openPreferences}
                    aria-label={t('consent.reopen.label')}
                    title={t('consent.reopen.label')}
                    className="fixed left-[max(1.25rem,env(safe-area-inset-left))] z-40 inline-flex items-center gap-2 rounded-full border border-qd-ink/10 bg-qd-white/90 px-3 py-2 text-xs font-semibold text-qd-text-medium shadow-[0_10px_28px_-14px_rgba(7,17,26,0.6)] backdrop-blur-sm transition-colors hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:border-white/10 dark:bg-qd-surface/90 dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                    style={{
                        bottom: 'calc(max(1.25rem, env(safe-area-inset-bottom)) + 4rem)',
                    }}
                >
                    <Cookie aria-hidden="true" size={16} />
                    <span className="hidden sm:inline">
                        {t('consent.reopen.label')}
                    </span>
                </button>
            )}

            <ConsentPreferences
                open={panelOpen}
                onOpenChange={setPanelOpen}
                analytics={draftAnalytics}
                marketing={draftMarketing}
                onAnalyticsChange={setDraftAnalytics}
                onMarketingChange={setDraftMarketing}
                onSave={handleSave}
                onAcceptAll={handleAcceptAll}
                onRejectAll={handleReject}
            />
        </>
    );
}

import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import ConsentBanner from '@/components/consent/ConsentBanner';
import ConsentPreferences from '@/components/consent/ConsentPreferences';
import { applyConsentSignals } from '@/components/privacy/consent-signals';
import { runPermittedLoaders } from '@/components/privacy/external-load-gate';
import { emitInternalEvent } from '@/components/privacy/internal-events';
import {
    acceptAllConsent,
    rejectAllConsent,
    saveConsentPreferences,
    useConsent,
} from '@/hooks/use-consent';

/**
 * Orquestador del CMP propio AbacoQD (montado en el layout público).
 *
 * Une el estado de consentimiento (use-consent) con la UI (banner + panel) y
 * con las capas internas: traduce la decisión a señales internas y ejecuta la
 * compuerta de loaders (inerte en esta fase, no carga nada externo). Solo se
 * renderiza si la prop Inertia `consent.enabled` es true. Reabrir preferencias:
 * únicamente desde `/cookies`, vía evento `window` `abacoqd:open-consent` (no
 * hay botón flotante permanente).
 *
 * El banner no se pinta hasta que el cliente ha montado y leído localStorage
 * (`isReady`), para evitar el flash del banner en quien ya decidió.
 */

type ConsentConfig = {
    readonly enabled: boolean;
    readonly externalTracking: boolean;
};

const DISABLED_CONFIG: ConsentConfig = { enabled: false, externalTracking: false };

// Suscripción inerte: solo se usa para detectar que estamos en cliente ya
// hidratado/montado (snapshot servidor = false, cliente = true), sin setState.
const emptySubscribe = (): (() => void) => () => {};

export default function ConsentManager() {
    const { consent } = usePage<{ consent?: ConsentConfig }>().props;
    const config = consent ?? DISABLED_CONFIG;

    const { categories, hasDecision } = useConsent();
    // Gate de cliente: false en servidor y en la primera pasada de hidratación;
    // true tras montar en cliente (cuando `useConsent` ya leyó localStorage). Así
    // el banner no se pinta hasta entonces y se evita el flash en Firefox/Brave
    // para quien ya aceptó/rechazó. Sin setState en efecto (regla react-compiler).
    const isReady = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );
    const [panelOpen, setPanelOpen] = useState(false);
    // Borrador del panel (no se persiste hasta "Guardar"). Se siembra con la
    // decisión vigente al abrir, en el handler (sin setState en efecto).
    const [draftAnalytics, setDraftAnalytics] = useState(false);
    const [draftMarketing, setDraftMarketing] = useState(false);

    // Traduce la decisión a señales internas y abre la compuerta de loaders. En
    // esta fase no carga nada externo: solo fija el estado (inicial: denied).
    useEffect(() => {
        applyConsentSignals(categories);
        runPermittedLoaders({
            categories,
            externalTrackingEnabled: config.externalTracking,
        });
    }, [categories, config.externalTracking]);

    const openPreferences = useCallback(() => {
        setDraftAnalytics(categories.analytics);
        setDraftMarketing(categories.marketing);
        emitInternalEvent('consent_open_preferences');
        setPanelOpen(true);
    }, [categories.analytics, categories.marketing]);

    // Único punto de entrada para reabrir preferencias: el enlace de `/cookies`
    // dispara `window.dispatchEvent(new Event('abacoqd:open-consent'))`.
    useEffect(() => {
        const handler = (): void => openPreferences();
        window.addEventListener('abacoqd:open-consent', handler);

        return () => window.removeEventListener('abacoqd:open-consent', handler);
    }, [openPreferences]);

    const handleAcceptAll = useCallback(() => {
        acceptAllConsent();
        emitInternalEvent('consent_accept_all');
        setPanelOpen(false);
    }, []);

    const handleReject = useCallback(() => {
        rejectAllConsent();
        emitInternalEvent('consent_reject_all');
        setPanelOpen(false);
    }, []);

    const handleSave = useCallback(() => {
        saveConsentPreferences({
            analytics: draftAnalytics,
            marketing: draftMarketing,
        });
        emitInternalEvent('consent_save_preferences');
        setPanelOpen(false);
    }, [draftAnalytics, draftMarketing]);

    if (!config.enabled) {
        return null;
    }

    // Solo se pinta el banner tras montar (isReady) y si no hay decisión previa.
    // No hay chip flotante: las preferencias se gestionan desde `/cookies`.
    const showBanner = isReady && !hasDecision && !panelOpen;

    return (
        <>
            {showBanner && (
                <ConsentBanner
                    onAcceptAll={handleAcceptAll}
                    onReject={handleReject}
                    onConfigure={openPreferences}
                />
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

import type { ReactNode } from 'react';

import AccessibilityFab from '@/components/a11y/AccessibilityFab';
import ChatbotFab from '@/components/chat/ChatbotFab';
import FloatingHeader from '@/components/FloatingHeader';
import WaveBackground from '@/components/public/WaveBackground';
import SiteFooter from '@/components/SiteFooter';
import { useLanguage } from '@/hooks/use-language';

/**
 * Layout público canónico — marco común de todas las vistas públicas.
 * docs/07_VISTAS/PUBLIC_09_LAYOUT_GLOBAL.md.
 *
 * Orden de apilado: WaveBackground (fondo) → contenido → header flotante →
 * FABs (accesibilidad izq. / chatbot der.) → paneles de los FABs (Sheet).
 * Estructura: skip-link · header · main#contenido (un único <main>/h1 por vista)
 * · footer · botones flotantes transversales.
 */
type PublicLayoutProps = {
    readonly children: ReactNode;
    readonly waveHiddenUntilElementId?: string;
};

export default function PublicLayout({
    children,
    waveHiddenUntilElementId,
}: PublicLayoutProps) {
    const { t } = useLanguage();

    return (
        <div className="qd-public-shell relative isolate min-h-svh overflow-x-clip bg-qd-bg font-sans text-qd-ink dark:bg-qd-ink dark:text-qd-white">
            <a href="#contenido" className="qd-skip-link">
                {t('layout.skipToContent')}
            </a>

            <WaveBackground hiddenUntilElementId={waveHiddenUntilElementId} />

            <FloatingHeader />

            <main id="contenido">{children}</main>

            <SiteFooter />

            <AccessibilityFab />
            <ChatbotFab />
        </div>
    );
}

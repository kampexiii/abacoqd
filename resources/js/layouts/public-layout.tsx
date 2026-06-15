import type { ReactNode } from 'react';

import AccessibilityFab from '@/components/a11y/AccessibilityFab';
import ChatbotFab from '@/components/chat/ChatbotFab';
import FloatingHeader from '@/components/FloatingHeader';
import SiteFooter from '@/components/SiteFooter';
import WaveBackground from '@/components/WaveBackground';
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
export default function PublicLayout({ children }: { children: ReactNode }) {
    const { t } = useLanguage();

    return (
        <div className="relative min-h-svh font-sans text-qd-ink dark:text-qd-white">
            <a href="#contenido" className="qd-skip-link">
                {t('layout.skipToContent')}
            </a>

            <WaveBackground />

            <FloatingHeader />

            <main id="contenido">{children}</main>

            <SiteFooter />

            <AccessibilityFab />
            <ChatbotFab />
        </div>
    );
}

import type { ReactNode } from 'react';

import AccessibilityFab from '@/components/a11y/AccessibilityFab';
import ChatbotFab from '@/components/chat/ChatbotFab';
import FloatingHeader from '@/components/FloatingHeader';
import WaveBackground from '@/components/public/WaveBackground';
import SiteFooter from '@/components/SiteFooter';
import { useLanguage } from '@/hooks/use-language';

type ErrorLayoutProps = {
    readonly children: ReactNode;
    readonly showAccessibility?: boolean;
    readonly showChatbot?: boolean;
    readonly showFooter?: boolean;
    readonly showHeader?: boolean;
    readonly showWave?: boolean;
};

export default function ErrorLayout({
    children,
    showAccessibility = true,
    showChatbot = false,
    showFooter = true,
    showHeader = true,
    showWave = true,
}: ErrorLayoutProps) {
    const { t } = useLanguage();

    return (
        <div className="qd-error-shell relative isolate min-h-svh overflow-x-clip bg-qd-bg font-sans text-qd-ink dark:bg-qd-ink dark:text-qd-white">
            <a href="#contenido" className="qd-skip-link">
                {t('layout.skipToContent')}
            </a>

            {showWave ? <WaveBackground /> : null}
            {showHeader ? <FloatingHeader /> : null}

            <main id="contenido">{children}</main>

            {showFooter ? <SiteFooter /> : null}
            {showAccessibility ? <AccessibilityFab /> : null}
            {showChatbot ? <ChatbotFab /> : null}
        </div>
    );
}

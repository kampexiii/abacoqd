import { MessageSquare } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';

import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/hooks/use-language';

/**
 * Chatbot / asistente — botón flotante DERECHO (producto base).
 * docs/04_IDENTIDAD_UI_COMPONENTES.md §7 · PUBLIC_09_LAYOUT_GLOBAL.md.
 *
 * El botón y el trigger de Radix quedan EAGER (accesibilidad: aria-expanded,
 * foco de retorno al cerrar). El cuerpo del panel (`ChatbotPanel`: Sheet +
 * lógica de FAQs + iconos) se carga en DIFERIDO en la primera apertura para no
 * pesar en el bundle inicial (no se renderiza mientras el panel está cerrado).
 */

const ChatbotPanel = lazy(() => import('@/components/chat/ChatbotPanel'));

export default function ChatbotFab() {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    // Una vez abierto, el panel permanece montado para que reabrir sea inmediato.
    const [mounted, setMounted] = useState(false);

    return (
        <Sheet
            open={open}
            onOpenChange={(next) => {
                if (next) {
                    setMounted(true);
                }

                setOpen(next);
            }}
        >
            <SheetTrigger asChild>
                <button
                    type="button"
                    aria-label={t('chatbot.openLabel')}
                    className="qd-fab qd-fab--right bg-qd-teal text-qd-ink shadow-[0_14px_34px_-14px_rgba(24,183,176,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:focus-visible:outline-qd-lime"
                >
                    <MessageSquare aria-hidden="true" size={22} />
                </button>
            </SheetTrigger>
            {mounted ? (
                <Suspense fallback={null}>
                    <ChatbotPanel />
                </Suspense>
            ) : null}
        </Sheet>
    );
}

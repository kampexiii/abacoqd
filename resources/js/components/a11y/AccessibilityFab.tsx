import { Accessibility } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';

import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/hooks/use-language';

/**
 * Widget de accesibilidad — botón flotante IZQUIERDO (producto base).
 * docs/04_IDENTIDAD_UI_COMPONENTES.md §6 · PUBLIC_09_LAYOUT_GLOBAL.md.
 *
 * Icono universal de accesibilidad (persona con brazos abiertos en círculo;
 * nunca silla de ruedas). El botón y el trigger de Radix quedan EAGER (foco de
 * retorno, aria-expanded). El panel con las opciones (`AccessibilityPanel`:
 * toggles + hook `useAccessibility`) se carga en DIFERIDO en la primera apertura
 * para aligerar el bundle inicial. Las preferencias persistidas se aplican en el
 * arranque vía `initializeAccessibility()` (app.tsx), independientemente del panel.
 */

const AccessibilityPanel = lazy(
    () => import('@/components/a11y/AccessibilityPanel'),
);

export default function AccessibilityFab() {
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
                    aria-label={t('a11y.openLabel')}
                    className="qd-fab qd-fab--left bg-qd-ink text-qd-white shadow-[0_14px_34px_-16px_rgba(7,17,26,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime dark:bg-qd-surface"
                >
                    <Accessibility aria-hidden="true" size={24} />
                </button>
            </SheetTrigger>
            {mounted ? (
                <Suspense fallback={null}>
                    <AccessibilityPanel />
                </Suspense>
            ) : null}
        </Sheet>
    );
}

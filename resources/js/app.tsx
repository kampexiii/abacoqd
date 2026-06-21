import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeAccessibility } from '@/hooks/use-accessibility';
import { initializeTheme } from '@/hooks/use-appearance';
import { initializeLanguage } from '@/hooks/use-language';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name.startsWith('Public/'):
                return null;
            case name.startsWith('Admin/'):
                return null;
            case name.startsWith('Errors/'):
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// This will set the active language on load...
initializeLanguage();

// This will apply persisted accessibility preferences on load...
// PENDIENTE TÉCNICO: envolver la app con MotionConfig reducedMotion="user"
// cuando se instale `motion` en este bloque/fase (docs §8). Mientras tanto,
// reduced-motion se cubre con CSS (@media + clase html.a11y-reduce-motion).
initializeAccessibility();

import {
    Accessibility,
    Contrast,
    MousePointer2,
    Pause,
    RotateCcw,
    Type,
    Underline,
    UnfoldVertical,
} from 'lucide-react';
import type { ReactNode } from 'react';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import type {
    AccessibilitySettings,
    TextSize,
} from '@/hooks/use-accessibility';
import { useAccessibility } from '@/hooks/use-accessibility';
import { useLanguage } from '@/hooks/use-language';

/**
 * Widget de accesibilidad — botón flotante IZQUIERDO (producto base).
 * docs/04_IDENTIDAD_UI_COMPONENTES.md §6 · PUBLIC_09_LAYOUT_GLOBAL.md.
 *
 * Icono universal de accesibilidad (persona con brazos abiertos en círculo;
 * nunca silla de ruedas). Opciones reales persistidas en localStorage y
 * aplicadas como clases en <html>. Panel accesible (Sheet/Radix Dialog) con
 * focus trap y cierre por Esc/overlay.
 */

const TEXT_SIZES: readonly TextSize[] = ['normal', 'large', 'xlarge'] as const;

function ToggleRow({
    icon,
    label,
    pressed,
    onToggle,
}: {
    icon: ReactNode;
    label: string;
    pressed: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={pressed}
            onClick={onToggle}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-qd-ink/10 bg-qd-white px-3.5 py-3 text-left text-sm font-medium text-qd-ink transition-colors hover:border-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:border-white/10 dark:bg-qd-surface dark:text-qd-white dark:focus-visible:outline-qd-lime"
        >
            <span className="flex items-center gap-2.5">
                <span className="text-qd-teal-2 dark:text-qd-teal" aria-hidden="true">
                    {icon}
                </span>
                {label}
            </span>
            <span
                aria-hidden="true"
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                    pressed ? 'bg-qd-teal' : 'bg-qd-ink/20 dark:bg-white/20'
                }`}
            >
                <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-qd-white transition-all ${
                        pressed ? 'left-[1.125rem]' : 'left-0.5'
                    }`}
                />
            </span>
        </button>
    );
}

export default function AccessibilityFab() {
    const { settings, setSetting, reset } = useAccessibility();
    const { t } = useLanguage();

    const toggle = (key: keyof AccessibilitySettings) => () =>
        setSetting(key, !settings[key] as never);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    type="button"
                    aria-label={t('a11y.openLabel')}
                    className="qd-fab qd-fab--left bg-qd-ink text-qd-white shadow-[0_14px_34px_-16px_rgba(7,17,26,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime dark:bg-qd-surface"
                >
                    <Accessibility aria-hidden="true" size={24} />
                </button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="w-full overflow-y-auto bg-qd-bg p-0 text-qd-ink sm:max-w-sm dark:bg-qd-ink dark:text-qd-white"
            >
                <SheetHeader className="px-5 pt-6 pb-2">
                    <SheetTitle className="flex items-center gap-2 text-qd-ink dark:text-qd-white">
                        <Accessibility aria-hidden="true" size={20} className="text-qd-teal-2 dark:text-qd-teal" />
                        {t('a11y.title')}
                    </SheetTitle>
                    <SheetDescription className="text-qd-text-high">
                        {t('a11y.description')}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-3 px-5 py-4">
                    {/* Tamaño de texto */}
                    <div className="rounded-xl border border-qd-ink/10 bg-qd-white p-3.5 dark:border-white/10 dark:bg-qd-surface">
                        <p className="mb-2.5 flex items-center gap-2.5 text-sm font-medium text-qd-ink dark:text-qd-white">
                            <Type aria-hidden="true" size={18} className="text-qd-teal-2 dark:text-qd-teal" />
                            {t('a11y.textSize.label')}
                        </p>
                        <div className="grid grid-cols-3 gap-2" role="group" aria-label={t('a11y.textSize.label')}>
                            {TEXT_SIZES.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    aria-pressed={settings.textSize === size}
                                    onClick={() => setSetting('textSize', size)}
                                    className={`rounded-lg px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:focus-visible:outline-qd-lime ${
                                        settings.textSize === size
                                            ? 'bg-qd-teal text-qd-ink'
                                            : 'bg-qd-ink/5 text-qd-text-high dark:bg-white/5'
                                    }`}
                                >
                                    {t(`a11y.textSize.${size}`)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ToggleRow
                        icon={<Contrast size={18} />}
                        label={t('a11y.highContrast')}
                        pressed={settings.highContrast}
                        onToggle={toggle('highContrast')}
                    />
                    <ToggleRow
                        icon={<UnfoldVertical size={18} />}
                        label={t('a11y.spacing')}
                        pressed={settings.spacing}
                        onToggle={toggle('spacing')}
                    />
                    <ToggleRow
                        icon={<Underline size={18} />}
                        label={t('a11y.underlineLinks')}
                        pressed={settings.underlineLinks}
                        onToggle={toggle('underlineLinks')}
                    />
                    <ToggleRow
                        icon={<Pause size={18} />}
                        label={t('a11y.reduceMotion')}
                        pressed={settings.reduceMotion}
                        onToggle={toggle('reduceMotion')}
                    />
                    <ToggleRow
                        icon={<Type size={18} />}
                        label={t('a11y.readableFont')}
                        pressed={settings.readableFont}
                        onToggle={toggle('readableFont')}
                    />
                    <ToggleRow
                        icon={<MousePointer2 size={18} />}
                        label={t('a11y.focusStrong')}
                        pressed={settings.focusStrong}
                        onToggle={toggle('focusStrong')}
                    />

                    <button
                        type="button"
                        onClick={reset}
                        className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl border border-qd-ink/15 px-3.5 py-3 text-sm font-semibold text-qd-ink transition-colors hover:border-qd-teal-2 hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:border-white/15 dark:text-qd-white dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                    >
                        <RotateCcw aria-hidden="true" size={16} />
                        {t('a11y.reset')}
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

import type { VariantProps } from 'class-variance-authority';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { ComponentProps, CSSProperties } from 'react';
import { useSyncExternalStore } from 'react';

import { buttonVariants } from '@/components/ui/button';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

const subscribeNoop = () => () => {};

const themeModeMeta = {
    light: {
        icon: Sun,
        label: 'Light',
    },
    dark: {
        icon: Moon,
        label: 'Dark',
    },
    system: {
        icon: Monitor,
        label: 'System',
    },
} as const satisfies Record<
    Appearance,
    {
        icon: typeof Sun;
        label: string;
    }
>;

const sizeStyles = {
    sm: {
        button: 'size-8 min-w-8 p-0',
        icon: 'size-3.5',
    },
    default: {
        button: 'size-9 min-w-9 p-0',
        icon: 'size-4',
    },
    lg: {
        button: 'size-10 min-w-10 p-0',
        icon: 'size-[1.125rem]',
    },
} as const;

type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
type ThemeTogglerButtonSize = keyof typeof sizeStyles;
type ThemeTogglerButtonDirection = 'ltr' | 'rtl';

export type ThemeTogglerButtonProps = Omit<ComponentProps<'button'>, 'size'> & {
    variant?: ButtonVariant;
    size?: ThemeTogglerButtonSize;
    direction?: ThemeTogglerButtonDirection;
    modes?: Appearance[];
    labels?: Partial<Record<Appearance, string>>;
};

const isAppearance = (value: string): value is Appearance => {
    return value === 'light' || value === 'dark' || value === 'system';
};

const normalizeModes = (modes: readonly Appearance[]): Appearance[] => {
    const seen = new Set<Appearance>();
    const normalized = modes.filter((mode) => {
        if (seen.has(mode)) {
            return false;
        }

        seen.add(mode);

        return true;
    });

    return normalized.length > 0 ? normalized : ['light', 'dark', 'system'];
};

export const getNextThemeMode = (
    modes: readonly Appearance[],
    currentMode: Appearance,
): Appearance => {
    const normalizedModes = normalizeModes(modes);
    const currentIndex = normalizedModes.indexOf(currentMode);

    if (currentIndex === -1) {
        return normalizedModes[0];
    }

    return normalizedModes[(currentIndex + 1) % normalizedModes.length];
};

export { themeModeMeta };

export default function ThemeTogglerButton({
    variant = 'ghost',
    size = 'default',
    direction = 'ltr',
    modes = ['light', 'dark'],
    labels,
    className,
    onClick,
    ...props
}: ThemeTogglerButtonProps) {
    const { appearance, updateAppearance } = useAppearance();
    const hydrated = useSyncExternalStore(
        subscribeNoop,
        () => true,
        () => false,
    );
    const resolvedModes = normalizeModes(modes.filter(isAppearance));
    const activeMode =
        hydrated && resolvedModes.includes(appearance)
            ? appearance
            : resolvedModes.includes('system')
              ? 'system'
              : resolvedModes[0];
    const activeIndex = resolvedModes.indexOf(activeMode);
    const nextMode = getNextThemeMode(resolvedModes, activeMode);
    const { button, icon } = sizeStyles[size];
    const translateDirection = direction === 'rtl' ? -1 : 1;

    const handleClick: ComponentProps<'button'>['onClick'] = (event) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        updateAppearance(nextMode);
    };

    return (
        <button
            type="button"
            data-theme-direction={direction}
            data-theme-mode={activeMode}
            className={cn(
                buttonVariants({ variant, size: 'icon' }),
                button,
                'group relative isolate shrink-0 overflow-hidden rounded-full',
                'text-inherit focus-visible:ring-white/70 focus-visible:ring-offset-0 motion-reduce:transition-none',
                className,
            )}
            onClick={handleClick}
            {...props}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.28),transparent_56%)] opacity-80"
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[3px] rounded-full opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 motion-reduce:transition-none"
                style={
                    {
                        background:
                            'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))',
                    } as CSSProperties
                }
            />
            <span
                aria-hidden="true"
                className="relative flex h-full w-full items-center justify-center"
            >
                {resolvedModes.map((mode, index) => {
                    const Icon = themeModeMeta[mode].icon;
                    const cycleDistance =
                        ((index - activeIndex + resolvedModes.length) %
                            resolvedModes.length) || 0;
                    const offset =
                        cycleDistance === 0
                            ? 0
                            : cycleDistance === 1
                              ? translateDirection * 0.52
                              : translateDirection * -0.52;
                    const style = {
                        '--theme-icon-shift': `${offset}rem`,
                    } as CSSProperties;
                    const isActive = index === activeIndex;

                    return (
                        <span
                            key={mode}
                            aria-hidden="true"
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <span
                                style={style}
                                className={cn(
                                    'flex items-center justify-center transition-all duration-300 ease-out motion-reduce:transition-none',
                                    isActive
                                        ? 'translate-x-[var(--theme-icon-shift)] scale-100 opacity-100 rotate-0'
                                        : cn(
                                              'translate-x-[var(--theme-icon-shift)] scale-75 opacity-0',
                                              direction === 'rtl'
                                                  ? 'rotate-45'
                                                  : '-rotate-45',
                                          ),
                                )}
                            >
                                <Icon
                                    className={cn(
                                        icon,
                                        'drop-shadow-[0_1px_6px_rgba(255,255,255,0.18)]',
                                    )}
                                />
                            </span>
                        </span>
                    );
                })}
            </span>
            <span className="sr-only">
                {labels?.[activeMode] ?? themeModeMeta[activeMode].label}
            </span>
        </button>
    );
}

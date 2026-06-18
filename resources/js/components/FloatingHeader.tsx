import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

import ThemeTogglerButton, {
    getNextThemeMode,
} from '@/components/animate-ui/components/buttons/theme-toggler';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useAppearance } from '@/hooks/use-appearance';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

/**
 * Topbar canónica AbacoQD (pastilla flotante) — reutilizada por todas las vistas
 * públicas. docs/07_VISTAS/PUBLIC_09_LAYOUT_GLOBAL.md.
 *
 * Nav final (6 ítems; el logo cubre Inicio). SIN CTA de reserva en topbar.
 * Destinos provisionales a anclas de home mientras no existan las páginas
 * dedicadas; migran a rutas al publicarse (comportamiento documentado).
 */

type NavItem = { key: string; href: string };

const NAV_ITEMS: readonly NavItem[] = [
    { key: 'metodologia', href: '/metodologia' },
    { key: 'servicios', href: '#servicios' },
    { key: 'proyectos', href: '#colaboraciones' },
    { key: 'quienesSomos', href: '/quienes-somos' },
    { key: 'blog', href: '#blog' },
    { key: 'contacto', href: '/contacto' },
] as const;

const HEADER_THEME_MODES = ['light', 'dark', 'system'] as const;

export default function FloatingHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { appearance } = useAppearance();
    const { locale, setLocale, t } = useLanguage();

    const nextLocale = locale === 'es' ? 'en' : 'es';
    const nextThemeMode = getNextThemeMode([...HEADER_THEME_MODES], appearance);
    const themeAriaLabels = {
        light: t('navigation.themeLight'),
        dark: t('navigation.themeDark'),
        system: t('navigation.themeSystem'),
    } as const;

    useEffect(() => {
        const handleScroll = () => {
            const nextIsScrolled = window.scrollY > 8;

            setIsScrolled((currentIsScrolled) =>
                currentIsScrolled === nextIsScrolled
                    ? currentIsScrolled
                    : nextIsScrolled,
            );
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header
            className="fixed inset-x-0 top-4 z-40 px-4"
            aria-label={t('navigation.primaryAriaLabel')}
        >
            <div
                data-scrolled={isScrolled}
                className={cn(
                    'mx-auto flex h-14 w-full max-w-[1240px] items-center justify-between gap-4 rounded-[20px] border px-4 text-qd-ink sm:px-6 dark:text-qd-white',
                    'transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out motion-reduce:transition-none',
                    isScrolled
                        ? 'border-white/70 bg-qd-white/80 shadow-[0_18px_60px_rgba(7,17,26,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-qd-surface/80 dark:shadow-[0_18px_70px_rgba(0,0,0,0.28)]'
                        : 'backdrop-blur-0 border-transparent bg-transparent shadow-none',
                )}
            >
                <a
                    href="/"
                    className="flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:focus-visible:outline-qd-lime"
                    aria-label={t('navigation.brandHome')}
                >
                    <img
                        src="/assets/branding/marca/logos/abacoqd-lockup.svg"
                        alt="AbacoQD"
                        width={115}
                        height={32}
                        className="h-8 w-auto dark:hidden"
                    />
                    <img
                        src="/assets/branding/marca/logos/abacoqd-lockup-inverse.svg"
                        alt="AbacoQD"
                        width={115}
                        height={32}
                        className="hidden h-8 w-auto dark:block"
                    />
                </a>

                <nav
                    className="hidden items-center gap-7 lg:flex"
                    aria-label={t('navigation.sectionsAriaLabel')}
                >
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.key}
                            href={item.href}
                            className={cn(
                                'text-[15px] font-medium transition-colors duration-150 hover:text-qd-teal-2 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime',
                                isScrolled
                                    ? 'text-qd-text-medium'
                                    : 'text-qd-ink/85 dark:text-qd-white/90',
                            )}
                        >
                            {t(`navigation.items.${item.key}`)}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => setLocale(nextLocale)}
                        aria-label={t('navigation.languageSwitch')}
                        className={cn(
                            'rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors duration-150 hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime',
                            isScrolled
                                ? 'text-qd-text-medium'
                                : 'text-qd-ink/85 dark:text-qd-white/90',
                        )}
                    >
                        {locale.toUpperCase()}
                    </button>

                    <ThemeTogglerButton
                        variant="ghost"
                        size="default"
                        direction="rtl"
                        modes={[...HEADER_THEME_MODES]}
                        aria-label={themeAriaLabels[nextThemeMode]}
                    />

                    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                        <SheetTrigger asChild>
                            <button
                                type="button"
                                aria-label={t('navigation.openMenu')}
                                className={cn(
                                    'inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 lg:hidden dark:focus-visible:outline-qd-lime',
                                    isScrolled
                                        ? 'text-qd-text-high'
                                        : 'text-qd-ink/90 dark:text-qd-white',
                                )}
                            >
                                <Menu aria-hidden="true" size={22} />
                            </button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-full border-none bg-qd-ink p-0 text-qd-white sm:max-w-sm"
                        >
                            <SheetHeader className="p-6">
                                <SheetTitle className="text-qd-white">
                                    {t('navigation.menuTitle')}
                                </SheetTitle>
                            </SheetHeader>
                            <nav
                                className="flex flex-col gap-1 px-4"
                                aria-label={t('navigation.sectionsAriaLabel')}
                            >
                                {NAV_ITEMS.map((item) => (
                                    <SheetClose asChild key={item.key}>
                                        <a
                                            href={item.href}
                                            className="rounded-xl px-3 py-3 text-2xl font-semibold text-qd-white/90 transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                                        >
                                            {t(`navigation.items.${item.key}`)}
                                        </a>
                                    </SheetClose>
                                ))}
                            </nav>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 p-6">
                                <button
                                    type="button"
                                    onClick={() => setLocale(nextLocale)}
                                    aria-label={t('navigation.languageSwitch')}
                                    className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-qd-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                                >
                                    {locale.toUpperCase()}
                                </button>
                                <ThemeTogglerButton
                                    variant="ghost"
                                    size="default"
                                    direction="rtl"
                                    modes={[...HEADER_THEME_MODES]}
                                    aria-label={themeAriaLabels[nextThemeMode]}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

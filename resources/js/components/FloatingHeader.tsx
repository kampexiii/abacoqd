import {
    ArrowRight,
    ChevronRight,
    FolderKanban,
    Globe,
    Home,
    LayoutGrid,
    Mail,
    Menu,
    Newspaper,
    Route,
    Users,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import ThemeTogglerButton, {
    getNextThemeMode,
} from '@/components/animate-ui/components/buttons/theme-toggler';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useAppearance } from '@/hooks/use-appearance';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

/**
 * Topbar canónica AbacoQD (pastilla flotante) — reutilizada por todas las vistas
 * públicas. docs/07_VISTAS/PUBLIC_09_LAYOUT_GLOBAL.md.
 *
 * Nav final desktop (6 ítems; el logo cubre Inicio). SIN CTA de reserva en
 * topbar. El drawer móvil añade Inicio y una card de contacto contextual.
 */

type NavItem = { key: string; href: string };

const NAV_ITEMS: readonly NavItem[] = [
    { key: 'metodologia', href: '/metodologia' },
    { key: 'servicios', href: '/servicios' },
    { key: 'proyectos', href: '/proyectos' },
    { key: 'quienesSomos', href: '/quienes-somos' },
    { key: 'blog', href: '/blog' },
    { key: 'contacto', href: '/contacto' },
] as const;

/**
 * Nav del drawer móvil: incluye Inicio (el logo no basta como diana táctil en
 * móvil) y un icono ligero de lucide por ítem. Reusa las mismas rutas y claves
 * i18n que la nav desktop.
 */
type MobileNavItem = NavItem & { icon: LucideIcon };

const MOBILE_NAV_ITEMS: readonly MobileNavItem[] = [
    { key: 'inicio', href: '/', icon: Home },
    { key: 'metodologia', href: '/metodologia', icon: Route },
    { key: 'servicios', href: '/servicios', icon: LayoutGrid },
    { key: 'proyectos', href: '/proyectos', icon: FolderKanban },
    { key: 'quienesSomos', href: '/quienes-somos', icon: Users },
    { key: 'blog', href: '/blog', icon: Newspaper },
    { key: 'contacto', href: '/contacto', icon: Mail },
] as const;

const HEADER_THEME_MODES = ['light', 'dark', 'system'] as const;

export default function FloatingHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { appearance } = useAppearance();
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();
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
                    {NAV_ITEMS.map((item) => {
                        const isActive = isCurrentOrParentUrl(item.href);

                        return (
                            <a
                                key={item.key}
                                href={item.href}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    'relative py-1 text-[15px] font-medium transition-colors duration-150 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-qd-teal-2 after:transition-transform after:duration-200 after:ease-out hover:text-qd-teal-2 hover:after:scale-x-100 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 motion-reduce:after:transition-none dark:after:bg-qd-teal dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime',
                                    isScrolled
                                        ? 'text-qd-text-medium'
                                        : 'text-qd-ink/85 dark:text-qd-white/90',
                                    isActive &&
                                        'text-qd-teal-2 after:scale-x-100 dark:text-qd-teal',
                                )}
                            >
                                {t(`navigation.items.${item.key}`)}
                            </a>
                        );
                    })}
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
                            className="flex w-full flex-col gap-0 overflow-hidden border-transparent bg-qd-bg p-0 text-qd-ink sm:max-w-sm dark:bg-qd-ink dark:text-qd-white [&>button]:hidden"
                        >
                            {/* [&>button]:hidden (arriba) oculta el botón de
                                cierre por defecto del Sheet; lo sustituimos por
                                uno circular con acento teal en la cabecera.
                                Fondo tecnológico: degradados radiales CSS muy
                                suaves (sin blur global, imagen ni canvas). */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_75%_at_100%_0%,rgba(24,183,176,0.10),transparent_60%)] dark:bg-[radial-gradient(130%_75%_at_100%_0%,rgba(24,183,176,0.16),transparent_55%)]"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(90%_55%_at_0%_100%,rgba(57,198,230,0.10),transparent_60%)] dark:block"
                            />

                            <SheetHeader className="relative flex shrink-0 flex-row items-start justify-between gap-4 border-b border-qd-mist/80 px-6 pb-5 pt-[calc(1.25rem+env(safe-area-inset-top))] dark:border-white/10">
                                <a
                                    href="/"
                                    aria-label={t('navigation.brandHome')}
                                    className="flex flex-col items-start gap-1.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:focus-visible:outline-qd-lime"
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
                                    <span className="pl-0.5 text-[11px] font-medium tracking-[0.16em] text-qd-teal-2 uppercase dark:text-qd-teal">
                                        {t('navigation.brandSubtitle')}
                                    </span>
                                </a>
                                <SheetTitle className="sr-only">
                                    {t('navigation.menuTitle')}
                                </SheetTitle>
                                <SheetDescription className="sr-only">
                                    {t('navigation.menuDescription')}
                                </SheetDescription>
                                <SheetClose asChild>
                                    <button
                                        type="button"
                                        aria-label={t('navigation.closeMenu')}
                                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-qd-mist bg-qd-white text-qd-ink transition-colors hover:border-qd-teal-2 hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:border-white/15 dark:bg-white/5 dark:text-qd-white dark:hover:border-qd-teal dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                                    >
                                        <X aria-hidden="true" size={18} />
                                    </button>
                                </SheetClose>
                            </SheetHeader>

                            <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5">
                                <nav
                                    className="flex flex-col gap-1"
                                    aria-label={t('navigation.sectionsAriaLabel')}
                                >
                                    {MOBILE_NAV_ITEMS.map((item) => {
                                        const Icon = item.icon;
                                        const isActive =
                                            item.href === '/'
                                                ? isCurrentUrl(item.href)
                                                : isCurrentOrParentUrl(
                                                      item.href,
                                                  );

                                        return (
                                            <SheetClose asChild key={item.key}>
                                                <a
                                                    href={item.href}
                                                    aria-current={
                                                        isActive
                                                            ? 'page'
                                                            : undefined
                                                    }
                                                    className={cn(
                                                        'group flex items-center gap-4 rounded-2xl px-3 py-3 text-lg font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 motion-reduce:transition-none dark:focus-visible:outline-qd-lime',
                                                        isActive
                                                            ? 'bg-qd-mist text-qd-teal-2 dark:bg-white/[0.07] dark:text-qd-teal'
                                                            : 'text-qd-ink/85 hover:bg-qd-mist hover:text-qd-teal-2 dark:text-qd-white/90 dark:hover:bg-white/5 dark:hover:text-qd-teal',
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors motion-reduce:transition-none',
                                                            isActive
                                                                ? 'border-transparent bg-qd-teal-2 text-qd-white dark:bg-qd-teal dark:text-qd-ink'
                                                                : 'border-qd-mist bg-qd-white/70 text-qd-teal-2 group-hover:border-qd-teal-2/40 dark:border-white/10 dark:bg-white/5 dark:text-qd-teal',
                                                        )}
                                                    >
                                                        <Icon
                                                            aria-hidden="true"
                                                            size={19}
                                                        />
                                                    </span>
                                                    <span className="flex-1">
                                                        {t(
                                                            `navigation.items.${item.key}`,
                                                        )}
                                                    </span>
                                                    <ChevronRight
                                                        aria-hidden="true"
                                                        size={18}
                                                        className="shrink-0 text-qd-ink/25 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-qd-teal-2 motion-reduce:transform-none motion-reduce:transition-none dark:text-qd-white/25 dark:group-hover:text-qd-teal"
                                                    />
                                                </a>
                                            </SheetClose>
                                        );
                                    })}
                                </nav>

                                {/* CTA contextual: no es el CTA de reserva del
                                    topbar; solo vive dentro del drawer móvil. */}
                                <SheetClose asChild>
                                    <a
                                        href="/contacto"
                                        className="group mt-6 flex items-center gap-4 rounded-2xl border border-qd-teal-2/20 bg-gradient-to-br from-qd-teal-2/10 to-qd-cyan/5 p-4 transition-colors duration-150 hover:border-qd-teal-2/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 motion-reduce:transition-none dark:border-qd-teal/20 dark:from-qd-teal/10 dark:to-qd-cyan/5 dark:hover:border-qd-teal/40 dark:focus-visible:outline-qd-lime"
                                    >
                                        <span className="flex-1">
                                            <span className="block text-base font-semibold text-qd-ink dark:text-qd-white">
                                                {t('navigation.menuCtaTitle')}
                                            </span>
                                            <span className="mt-0.5 block text-sm text-qd-text-medium dark:text-qd-white/60">
                                                {t('navigation.menuCtaBody')}
                                            </span>
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-qd-teal-2 text-qd-white transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none dark:bg-qd-teal dark:text-qd-ink"
                                        >
                                            <ArrowRight size={20} />
                                        </span>
                                    </a>
                                </SheetClose>
                            </div>

                            <div className="relative shrink-0 border-t border-qd-mist/80 dark:border-white/10">
                                {/* Onda decorativa inferior, estática y muy sutil. */}
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 400 40"
                                    preserveAspectRatio="none"
                                    className="pointer-events-none absolute -top-px left-0 h-5 w-full text-qd-teal-2/10 dark:text-qd-teal/10"
                                >
                                    <path
                                        d="M0 22 C 70 4, 150 40, 230 22 S 360 2, 400 20 L400 40 L0 40 Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <div className="relative flex items-center justify-between gap-3 px-6 pt-5 pb-3">
                                    <button
                                        type="button"
                                        onClick={() => setLocale(nextLocale)}
                                        aria-label={t(
                                            'navigation.languageSwitch',
                                        )}
                                        className="inline-flex items-center gap-2 rounded-full border border-qd-mist bg-qd-white px-3.5 py-2 text-sm font-semibold text-qd-ink transition-colors hover:border-qd-teal-2 hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:border-white/15 dark:bg-white/5 dark:text-qd-white dark:hover:border-qd-teal dark:hover:text-qd-teal dark:focus-visible:outline-qd-lime"
                                    >
                                        <Globe aria-hidden="true" size={16} />
                                        {locale.toUpperCase()}
                                    </button>
                                    <ThemeTogglerButton
                                        variant="ghost"
                                        size="default"
                                        direction="rtl"
                                        modes={[...HEADER_THEME_MODES]}
                                        aria-label={
                                            themeAriaLabels[nextThemeMode]
                                        }
                                        className="text-qd-ink dark:text-qd-white"
                                    />
                                </div>
                                <div className="relative flex flex-col items-center gap-0.5 px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] text-center">
                                    <span className="text-xs font-medium text-qd-text-medium dark:text-qd-white/50">
                                        {t('navigation.menuCopyright')}
                                    </span>
                                    <span className="text-[11px] text-qd-text-medium/80 dark:text-qd-white/35">
                                        {t('navigation.menuTagline')}
                                    </span>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

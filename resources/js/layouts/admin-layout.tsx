import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, ChevronDown, ExternalLink, LogOut, Menu } from 'lucide-react';
import { useEffect  } from 'react';
import type {ReactNode} from 'react';
import { toast as sonnerToast } from 'sonner';

import { adminNavForRole  } from '@/components/admin/admin-nav';
import type {AdminNavItem} from '@/components/admin/admin-nav';
import ThemeTogglerButton from '@/components/animate-ui/components/buttons/theme-toggler';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import type { FlashToast } from '@/types/ui';

export type AdminBreadcrumb = {
    readonly title: string;
    readonly href?: string;
};

type AdminLayoutProps = {
    readonly title: string;
    readonly breadcrumbs?: readonly AdminBreadcrumb[];
    readonly actions?: ReactNode;
    readonly children: ReactNode;
};

type AdminPageProps = {
    readonly auth: { readonly user: { readonly name: string; readonly role?: string } };
    readonly flash?: { readonly toast?: FlashToast | null };
};

function Brand() {
    return (
        <Link
            href="/admin/dashboard"
            className="flex items-baseline gap-1 text-2xl font-extrabold tracking-tight text-qd-ink dark:text-qd-white"
        >
            <span>Abaco</span>
            <span className="text-qd-teal-2 dark:text-qd-teal">QD</span>
            <span className="ml-1 self-center text-[11px] font-bold tracking-[0.2em] text-qd-teal-2 dark:text-qd-teal">
                ADMIN
            </span>
        </Link>
    );
}

function NavList({
    currentUrl,
    role,
    onNavigate,
}: {
    currentUrl: string;
    role: string | undefined;
    onNavigate?: () => void;
}) {
    const { t } = useLanguage();

    const renderItem = (item: AdminNavItem) => {
        const Icon = item.icon;
        const label = t(`admin.nav.${item.key}`);
        const isActive =
            item.href !== null &&
            (currentUrl === item.href || currentUrl.startsWith(`${item.href}/`));

        if (!item.enabled || item.href === null) {
            return (
                <span
                    key={item.key}
                    aria-disabled="true"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-qd-text-medium/60 dark:text-qd-white/30"
                >
                    <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
                    <span className="flex-1">{label}</span>
                    <span className="rounded-full bg-qd-mist px-2 py-0.5 text-[10px] font-semibold tracking-wide text-qd-text-medium/70 dark:bg-qd-white/5 dark:text-qd-white/40">
                        {t('admin.nav.pending')}
                    </span>
                </span>
            );
        }

        return (
            <Link
                key={item.key}
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                    isActive
                        ? 'bg-qd-teal-2/10 text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal'
                        : 'text-qd-text-high hover:bg-qd-mist/70 dark:text-qd-white/70 dark:hover:bg-qd-white/5',
                )}
            >
                <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
                <span>{label}</span>
            </Link>
        );
    };

    return <nav className="flex flex-col gap-1">{adminNavForRole(role).map(renderItem)}</nav>;
}

export default function AdminLayout({
    title,
    breadcrumbs = [],
    actions,
    children,
}: AdminLayoutProps) {
    const { t, locale, setLocale } = useLanguage();
    const page = usePage<AdminPageProps>();
    const user = page.props.auth.user;
    const flashToast = page.props.flash?.toast;

    useEffect(() => {
        if (flashToast) {
            sonnerToast[flashToast.type](flashToast.message);
        }
    }, [flashToast]);

    const roleKey = user.role ?? 'editor';
    const nextLocale = locale === 'es' ? 'en' : 'es';

    return (
        <div className="min-h-svh bg-qd-bg font-sans text-qd-ink dark:bg-qd-ink dark:text-qd-white">
            {/* Sidebar desktop */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-qd-mist bg-qd-white px-4 py-5 lg:flex dark:border-qd-white/10 dark:bg-qd-surface">
                <div className="px-2">
                    <Brand />
                </div>
                <div className="mt-8 flex-1 overflow-y-auto">
                    <NavList currentUrl={page.url} role={roleKey} />
                </div>
                <a
                    href="/"
                    className="mt-4 flex items-center gap-2 rounded-lg border border-qd-mist px-3 py-2.5 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:border-qd-white/10 dark:text-qd-white/70 dark:hover:text-qd-teal"
                >
                    <ExternalLink aria-hidden="true" size={16} />
                    {t('admin.layout.viewSite')}
                </a>
            </aside>

            <div className="lg:pl-64">
                {/* Topbar */}
                <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-qd-mist bg-qd-white/90 px-4 backdrop-blur sm:px-6 dark:border-qd-white/10 dark:bg-qd-surface/90">
                    <Sheet>
                        <SheetTrigger
                            className="flex size-9 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high lg:hidden dark:border-qd-white/10 dark:text-qd-white/70"
                            aria-label={t('admin.layout.openMenu')}
                        >
                            <Menu aria-hidden="true" size={18} />
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 bg-qd-white p-4 dark:bg-qd-surface">
                            <SheetHeader className="px-2">
                                <SheetTitle asChild>
                                    <span>
                                        <Brand />
                                    </span>
                                </SheetTitle>
                            </SheetHeader>
                            <div className="mt-6">
                                <NavList currentUrl={page.url} role={roleKey} />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="ml-auto flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => setLocale(nextLocale)}
                            className="flex h-9 items-center gap-1.5 rounded-lg border border-qd-mist px-3 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70"
                            aria-label={t('admin.layout.switchLanguage')}
                        >
                            {locale.toUpperCase()}
                        </button>

                        <ThemeTogglerButton modes={['light', 'dark', 'system']} />

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 border-l border-qd-mist pl-3 sm:gap-3 dark:border-qd-white/10">
                                <div className="hidden text-right leading-tight sm:block">
                                    <p className="text-sm font-semibold text-qd-ink dark:text-qd-white">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-qd-text-medium dark:text-qd-white/50">
                                        {t(`admin.roles.${roleKey}`)}
                                    </p>
                                </div>
                                <span className="flex size-9 items-center justify-center rounded-full bg-qd-teal-2/10 text-sm font-bold text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                                <ChevronDown
                                    aria-hidden="true"
                                    size={15}
                                    className="hidden text-qd-text-medium sm:block"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="font-normal">
                                    <p className="text-sm font-semibold text-qd-ink dark:text-qd-white">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-qd-text-medium dark:text-qd-white/50">
                                        {t(`admin.roles.${roleKey}`)}
                                    </p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={logout()} as="button" className="w-full">
                                        <LogOut aria-hidden="true" className="mr-2" />
                                        {t('admin.layout.logout')}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page header */}
                <div className="border-b border-qd-mist bg-qd-white px-4 py-6 sm:px-8 dark:border-qd-white/10 dark:bg-qd-surface">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-qd-ink dark:text-qd-white">
                                {title}
                            </h1>
                            {breadcrumbs.length > 0 && (
                                <nav
                                    aria-label="Breadcrumb"
                                    className="mt-2 flex flex-wrap items-center gap-1.5 text-sm text-qd-text-medium dark:text-qd-white/50"
                                >
                                    {breadcrumbs.map((crumb, index) => (
                                        <span key={crumb.title} className="flex items-center gap-1.5">
                                            {index > 0 && (
                                                <ChevronRight aria-hidden="true" size={14} />
                                            )}
                                            {crumb.href ? (
                                                <Link
                                                    href={crumb.href}
                                                    className="transition hover:text-qd-teal-2 dark:hover:text-qd-teal"
                                                >
                                                    {crumb.title}
                                                </Link>
                                            ) : (
                                                <span className="text-qd-text-high dark:text-qd-white/70">
                                                    {crumb.title}
                                                </span>
                                            )}
                                        </span>
                                    ))}
                                </nav>
                            )}
                        </div>
                        {actions && <div className="flex items-center gap-3">{actions}</div>}
                    </div>
                </div>

                {/* Content */}
                <main className="px-4 py-6 sm:px-8">{children}</main>
            </div>
        </div>
    );
}

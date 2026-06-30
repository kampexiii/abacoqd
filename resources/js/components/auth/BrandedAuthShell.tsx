import { ShieldCheck, Users } from 'lucide-react';
import type { ReactNode } from 'react';

import ThemeTogglerButton from '@/components/animate-ui/components/buttons/theme-toggler';
import MethodologyCube from '@/components/public/MethodologyCube';
import { useLanguage } from '@/hooks/use-language';

function BrandLockup({ className }: { readonly className?: string }) {
    return (
        <>
            <img
                src="/assets/branding/marca/logos/abacoqd-lockup.svg"
                alt="AbacoQD"
                className={`w-auto dark:hidden ${className ?? ''}`}
            />
            <img
                src="/assets/branding/marca/logos/abacoqd-lockup-inverse.svg"
                alt="AbacoQD"
                className={`hidden w-auto dark:block ${className ?? ''}`}
            />
        </>
    );
}

type BrandedAuthShellProps = {
    readonly eyebrow: string;
    readonly panelTitle: string;
    readonly panelSubtitle: string;
    readonly title: string;
    readonly subtitle: string;
    readonly children: ReactNode;
};

export default function BrandedAuthShell({
    eyebrow,
    panelTitle,
    panelSubtitle,
    title,
    subtitle,
    children,
}: BrandedAuthShellProps) {
    const { t, locale, setLocale } = useLanguage();
    const nextLocale = locale === 'es' ? 'en' : 'es';

    return (
        <div className="relative flex min-h-svh flex-col bg-qd-bg font-sans text-qd-ink dark:bg-qd-ink dark:text-qd-white">
            <header className="flex items-center justify-between px-5 py-5 sm:px-8">
                <a href="/" aria-label="AbacoQD" className="shrink-0">
                    <BrandLockup className="h-8" />
                </a>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setLocale(nextLocale)}
                        className="flex h-9 items-center rounded-lg border border-qd-mist px-3 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70"
                        aria-label={t('adminLogin.switchLanguage')}
                    >
                        {locale.toUpperCase()}
                    </button>
                    <ThemeTogglerButton modes={['light', 'dark', 'system']} />
                </div>
            </header>

            <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-stretch gap-8 px-5 py-8 sm:px-8 lg:grid-cols-2">
                <section className="relative hidden flex-col overflow-hidden rounded-3xl border border-qd-mist bg-qd-white p-10 lg:flex dark:border-qd-white/10 dark:bg-qd-surface">
                    <span className="text-xs font-bold tracking-[0.22em] text-qd-teal-2 dark:text-qd-teal">
                        {eyebrow}
                    </span>
                    <h1 className="mt-5 text-4xl leading-tight font-extrabold tracking-tight text-qd-ink dark:text-qd-white">
                        {panelTitle}
                    </h1>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-qd-text-high">
                        {panelSubtitle}
                    </p>

                    <div className="flex flex-1 items-center justify-center">
                        <div className="scale-125 sm:scale-150">
                            <MethodologyCube />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-5 text-xs font-semibold text-qd-text-medium dark:text-qd-white/50">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck
                                aria-hidden="true"
                                size={15}
                                className="text-qd-teal-2 dark:text-qd-teal"
                            />
                            {t('adminLogin.points.secure')}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Users
                                aria-hidden="true"
                                size={15}
                                className="text-qd-teal-2 dark:text-qd-teal"
                            />
                            {t('adminLogin.points.centralized')}
                        </span>
                    </div>
                </section>

                <section className="mx-auto flex w-full max-w-md flex-col justify-center rounded-3xl border border-qd-mist bg-qd-white p-8 shadow-[0_24px_80px_-48px_rgba(7,17,26,0.45)] sm:p-10 dark:border-qd-white/10 dark:bg-qd-surface">
                    <div className="flex flex-col items-center text-center">
                        <BrandLockup className="h-10" />
                        <h2 className="mt-7 text-2xl font-bold text-qd-ink dark:text-qd-white">
                            {title}
                        </h2>
                        <p className="mt-1.5 text-sm text-qd-text-medium dark:text-qd-white/50">
                            {subtitle}
                        </p>
                    </div>

                    {children}
                </section>
            </div>

            <footer className="px-5 py-6 text-center text-xs text-qd-text-medium sm:px-8 dark:text-qd-white/40">
                © {new Date().getFullYear()} AbacoQD. {t('adminLogin.rights')}
            </footer>
        </div>
    );
}

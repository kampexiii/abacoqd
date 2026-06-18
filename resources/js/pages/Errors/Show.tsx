import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Compass,
    Home,
    RefreshCw,
    Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { useLanguage } from '@/hooks/use-language';
import ErrorLayout from '@/layouts/error-layout';
import { cn } from '@/lib/utils';

type KnownErrorStatus = 404 | 500 | 503;

type ErrorPageProps = {
    readonly status: number;
};

type RecoveryLink = {
    readonly href: string;
    readonly key: 'blog' | 'contact' | 'home' | 'projects' | 'services';
};

const RECOVERY_LINKS: readonly RecoveryLink[] = [
    { key: 'home', href: '/' },
    { key: 'services', href: '/#servicios' },
    { key: 'projects', href: '/#colaboraciones' },
    { key: 'blog', href: '/#blog' },
    { key: 'contact', href: '/contacto' },
] as const;

const STATUS_ICONS: Record<KnownErrorStatus, LucideIcon> = {
    404: Compass,
    500: AlertTriangle,
    503: Wrench,
};

const isKnownErrorStatus = (status: number): status is KnownErrorStatus => {
    return status === 404 || status === 500 || status === 503;
};

function ErrorBrandMark({ mono = false }: { readonly mono?: boolean }) {
    const lightLogo = mono
        ? '/assets/branding/marca/logos/abacoqd-isotipo-mono-ink.svg'
        : '/assets/branding/marca/logos/abacoqd-isotipo.svg';
    const darkLogo = mono
        ? '/assets/branding/marca/logos/abacoqd-isotipo-mono-white.svg'
        : '/assets/branding/marca/logos/abacoqd-isotipo-inverse.svg';

    return (
        <span className="qd-error-brand-mark" aria-hidden="true">
            <img src={lightLogo} alt="" className="dark:hidden" />
            <img src={darkLogo} alt="" className="hidden dark:block" />
        </span>
    );
}

export default function ErrorShow({ status }: ErrorPageProps) {
    const normalizedStatus = isKnownErrorStatus(status) ? status : 500;
    const { t } = useLanguage();
    const StatusIcon = STATUS_ICONS[normalizedStatus];
    const translationKey = `errors.${normalizedStatus}`;
    const isNotFound = normalizedStatus === 404;
    const isServerError = normalizedStatus === 500;
    const isMaintenance = normalizedStatus === 503;

    const reloadPage = () => {
        window.location.reload();
    };

    return (
        <ErrorLayout
            showAccessibility={!isMaintenance}
            showChatbot={isNotFound}
            showFooter={!isMaintenance}
            showHeader={!isMaintenance}
            showWave={isNotFound}
        >
            <Head title={t(`${translationKey}.metaTitle`)}>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <section
                className={cn(
                    'qd-error-page',
                    `qd-error-page--${normalizedStatus}`,
                )}
                aria-labelledby="error-title"
            >
                {isNotFound ? (
                    <div className="qd-error-ambient-lines" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                    </div>
                ) : null}

                <div className="qd-error-card">
                    <div className="qd-error-card__header">
                        <div className="qd-error-brand">
                            <ErrorBrandMark mono={!isNotFound} />
                            <span>{t('errors.brand')}</span>
                        </div>
                        <div className="qd-error-icon" aria-hidden="true">
                            <StatusIcon size={20} strokeWidth={1.8} />
                        </div>
                    </div>

                    <p className="qd-error-code" aria-label={`${normalizedStatus}`}>
                        {normalizedStatus}
                    </p>

                    <div className="qd-error-copy">
                        <h1 id="error-title">{t(`${translationKey}.title`)}</h1>
                        <p>{t(`${translationKey}.subtitle`)}</p>
                    </div>

                    {isNotFound ? (
                        <nav
                            className="qd-error-recovery"
                            aria-label={t('errors.404.recoveryAria')}
                        >
                            {RECOVERY_LINKS.map((link) => (
                                <a
                                    key={link.key}
                                    href={link.href}
                                    className="qd-error-recovery__link"
                                >
                                    <span>{t(`errors.404.links.${link.key}`)}</span>
                                    <ArrowRight size={15} aria-hidden="true" />
                                </a>
                            ))}
                        </nav>
                    ) : null}

                    {isServerError ? (
                        <div className="qd-error-actions">
                            <button
                                type="button"
                                className="qd-error-button qd-error-button--primary"
                                onClick={reloadPage}
                            >
                                <RefreshCw size={17} aria-hidden="true" />
                                <span>{t('errors.500.reload')}</span>
                            </button>
                            <a
                                href="/"
                                className="qd-error-button qd-error-button--secondary"
                            >
                                <Home size={17} aria-hidden="true" />
                                <span>{t('errors.500.home')}</span>
                            </a>
                        </div>
                    ) : null}

                    {isMaintenance ? (
                        <p className="qd-error-maintenance-note">
                            {t('errors.503.status')}
                        </p>
                    ) : null}
                </div>
            </section>
        </ErrorLayout>
    );
}

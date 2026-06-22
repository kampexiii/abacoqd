import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import { ADMIN_NAV } from '@/components/admin/admin-nav';
import { useLanguage } from '@/hooks/use-language';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';

type DashboardProps = {
    readonly serviceStats: {
        readonly published: number;
        readonly draft: number;
        readonly hidden: number;
    };
};

export default function AdminDashboard({ serviceStats }: DashboardProps) {
    const { t } = useLanguage();

    const stats = [
        { key: 'published', value: serviceStats.published },
        { key: 'draft', value: serviceStats.draft },
        { key: 'hidden', value: serviceStats.hidden },
    ] as const;

    return (
        <AdminLayout title={t('admin.dashboard.title')}>
            <Head title={`${t('admin.dashboard.title')} · Admin AbacoQD`} />

            {/* Estado de servicios (contadores reales, sin analítica) */}
            <section className="mb-8">
                <h2 className="mb-3 text-sm font-bold tracking-wide text-qd-text-medium uppercase dark:text-qd-white/50">
                    {t('admin.dashboard.servicesStatus')}
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.key}
                            className="rounded-2xl border border-qd-mist bg-qd-white p-5 dark:border-qd-white/10 dark:bg-qd-surface"
                        >
                            <p className="text-3xl font-extrabold text-qd-ink dark:text-qd-white">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-sm text-qd-text-medium dark:text-qd-white/50">
                                {t(`admin.dashboard.stats.${stat.key}`)}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Accesos rápidos */}
            <section>
                <h2 className="mb-3 text-sm font-bold tracking-wide text-qd-text-medium uppercase dark:text-qd-white/50">
                    {t('admin.dashboard.quickAccess')}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {ADMIN_NAV.filter((item) => item.key !== 'dashboard').map((item) => {
                        const Icon = item.icon;
                        const label = t(`admin.nav.${item.key}`);

                        const inner = (
                            <>
                                <span
                                    className={cn(
                                        'flex size-11 items-center justify-center rounded-xl',
                                        item.enabled
                                            ? 'bg-qd-teal-2/10 text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal'
                                            : 'bg-qd-mist text-qd-text-medium/60 dark:bg-qd-white/5 dark:text-qd-white/30',
                                    )}
                                >
                                    <Icon aria-hidden="true" size={22} strokeWidth={1.7} />
                                </span>
                                <div className="flex-1">
                                    <p
                                        className={cn(
                                            'font-bold',
                                            item.enabled
                                                ? 'text-qd-ink dark:text-qd-white'
                                                : 'text-qd-text-medium/70 dark:text-qd-white/40',
                                        )}
                                    >
                                        {label}
                                    </p>
                                    {!item.enabled && (
                                        <p className="text-xs text-qd-text-medium/60 dark:text-qd-white/30">
                                            {t('admin.nav.pending')}
                                        </p>
                                    )}
                                </div>
                                {item.enabled && (
                                    <ArrowRight
                                        aria-hidden="true"
                                        size={18}
                                        className="text-qd-teal-2 dark:text-qd-teal"
                                    />
                                )}
                            </>
                        );

                        if (item.enabled && item.href !== null) {
                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className="flex items-center gap-4 rounded-2xl border border-qd-mist bg-qd-white p-5 transition hover:border-qd-teal-2/40 hover:shadow-sm dark:border-qd-white/10 dark:bg-qd-surface"
                                >
                                    {inner}
                                </Link>
                            );
                        }

                        return (
                            <div
                                key={item.key}
                                aria-disabled="true"
                                className="flex items-center gap-4 rounded-2xl border border-dashed border-qd-mist bg-qd-white/60 p-5 dark:border-qd-white/10 dark:bg-qd-surface/60"
                            >
                                {inner}
                            </div>
                        );
                    })}
                </div>
            </section>
        </AdminLayout>
    );
}

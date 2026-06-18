import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart2,
    CalendarDays,
    Code2,
    Cpu,
    FileCheck2,
    Gauge,
    GitMerge,
    LayoutDashboard,
    Rocket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import PublicPageHero from '@/components/public/PublicPageHero';
import { useLanguage } from '@/hooks/use-language';
import type { Locale } from '@/hooks/use-language';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import { show as bookingShow } from '@/routes/booking';
import { show as contactShow } from '@/routes/contact';

export type ServiceKey =
    | 'web'
    | 'apps'
    | 'ai'
    | 'crm'
    | 'integrations'
    | 'mvp';
export type MockupVariant =
    | 'web'
    | 'dashboard'
    | 'flow'
    | 'data'
    | 'integration'
    | 'mvp';

export type LocalizedText = {
    readonly es?: string | null;
    readonly en?: string | null;
};

export type PublicService = {
    readonly id: number;
    readonly title: LocalizedText;
    readonly slug: LocalizedText;
    readonly summary: LocalizedText;
    readonly icon: string | null;
    readonly isDetailEnabled: boolean;
    readonly settings: unknown;
};

type ServicePresentation = {
    readonly number: string;
    readonly icon: LucideIcon;
    readonly mockup: MockupVariant;
    readonly fallbackSlug: Record<Locale, string>;
};

export const SERVICE_PRESENTATION: Record<ServiceKey, ServicePresentation> = {
    web: {
        number: '01',
        icon: Code2,
        mockup: 'web',
        fallbackSlug: {
            es: 'desarrollo-web-rapido',
            en: 'fast-web-development',
        },
    },
    apps: {
        number: '02',
        icon: LayoutDashboard,
        mockup: 'dashboard',
        fallbackSlug: {
            es: 'aplicaciones-a-medida',
            en: 'custom-applications',
        },
    },
    ai: {
        number: '03',
        icon: Cpu,
        mockup: 'flow',
        fallbackSlug: {
            es: 'automatizacion-con-ia',
            en: 'ai-automation',
        },
    },
    crm: {
        number: '04',
        icon: BarChart2,
        mockup: 'data',
        fallbackSlug: {
            es: 'crm-datos-y-procesos',
            en: 'crm-data-and-processes',
        },
    },
    integrations: {
        number: '05',
        icon: GitMerge,
        mockup: 'integration',
        fallbackSlug: {
            es: 'integraciones-digitales',
            en: 'digital-integrations',
        },
    },
    mvp: {
        number: '06',
        icon: Rocket,
        mockup: 'mvp',
        fallbackSlug: {
            es: 'mvps-y-prototipos',
            en: 'mvps-and-prototypes',
        },
    },
};

const SERVICE_KEY_BY_SLUG: Record<string, ServiceKey> = {
    'desarrollo-web-rapido': 'web',
    'fast-web-development': 'web',
    'aplicaciones-a-medida': 'apps',
    'custom-applications': 'apps',
    'automatizacion-con-ia': 'ai',
    'ai-automation': 'ai',
    'crm-datos-y-procesos': 'crm',
    'crm-data-and-processes': 'crm',
    'integraciones-digitales': 'integrations',
    'digital-integrations': 'integrations',
    'mvps-y-prototipos': 'mvp',
    'mvps-and-prototypes': 'mvp',
};

export function resolveServiceKey(slug: LocalizedText): ServiceKey | null {
    const esKey = slug.es ? SERVICE_KEY_BY_SLUG[slug.es] : null;
    const enKey = slug.en ? SERVICE_KEY_BY_SLUG[slug.en] : null;

    return esKey ?? enKey ?? null;
}

export function localizedText(value: LocalizedText, locale: Locale): string {
    return value[locale] ?? value.es ?? value.en ?? '';
}

const CHIPS = [0, 1, 2] as const;

const CHOICE_CRITERIA: readonly {
    key: 'urgency' | 'complexity' | 'integration';
    icon: LucideIcon;
}[] = [
    { key: 'urgency', icon: Gauge },
    { key: 'complexity', icon: FileCheck2 },
    { key: 'integration', icon: GitMerge },
] as const;

export function ServiceMockup({
    variant,
}: {
    readonly variant: MockupVariant;
}) {
    if (variant === 'flow') {
        return (
            <div className="relative flex h-full items-center justify-center">
                <svg className="absolute inset-0 size-full" aria-hidden="true">
                    <path
                        d="M40 76 C95 30 150 122 220 64"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="7 7"
                        strokeWidth="1.5"
                        className="text-qd-teal-2/30 dark:text-qd-teal/35"
                    />
                </svg>
                {['01', 'IA', 'CRM'].map((label, index) => (
                    <span
                        key={label}
                        className={cn(
                            'absolute flex size-12 items-center justify-center rounded-xl border text-[11px] font-bold',
                            index === 1
                                ? 'border-qd-teal bg-qd-teal/15 text-qd-teal-2 dark:text-qd-teal'
                                : 'border-qd-teal-2/20 bg-qd-white/80 text-qd-text-medium dark:bg-qd-surface/80',
                        )}
                        style={{
                            left: `${18 + index * 32}%`,
                            top: index === 1 ? '24%' : '50%',
                        }}
                    >
                        {label}
                    </span>
                ))}
            </div>
        );
    }

    if (variant === 'integration') {
        return (
            <div className="relative flex h-full items-center justify-center">
                <span className="relative z-10 flex size-14 items-center justify-center rounded-2xl border border-qd-teal bg-qd-teal/15 text-xs font-bold text-qd-teal-2 dark:text-qd-teal">
                    API
                </span>
                {['Nube', 'CRM', 'ERP', 'Datos'].map((label, index) => {
                    const positions = [
                        'left-[12%] top-[18%]',
                        'right-[12%] top-[18%]',
                        'left-[12%] bottom-[18%]',
                        'right-[12%] bottom-[18%]',
                    ];

                    return (
                        <span
                            key={label}
                            className={cn(
                                'absolute flex h-9 w-16 items-center justify-center rounded-xl border border-qd-teal-2/20 bg-qd-white/80 text-[10px] font-semibold text-qd-text-medium dark:bg-qd-surface/80',
                                positions[index],
                            )}
                        >
                            {label}
                        </span>
                    );
                })}
                <span className="absolute h-px w-4/5 bg-qd-teal-2/20" />
                <span className="absolute h-4/5 w-px bg-qd-teal-2/20" />
            </div>
        );
    }

    if (variant === 'mvp') {
        return (
            <div className="flex h-full items-center justify-center gap-4">
                <div className="h-28 w-16 rounded-2xl border border-qd-teal-2/25 bg-qd-white/80 p-2 dark:bg-qd-surface/80">
                    <span className="mx-auto block h-1 w-6 rounded-full bg-qd-teal-2/25" />
                    <span className="mt-4 block h-12 rounded-xl bg-qd-teal-2/10" />
                    <span className="mt-3 block h-2 rounded-full bg-qd-teal-2/25" />
                    <span className="mt-2 block h-2 w-2/3 rounded-full bg-qd-teal-2/15" />
                </div>
                <div className="flex h-28 flex-1 flex-col justify-end gap-2 rounded-2xl border border-qd-teal-2/20 bg-qd-white/70 p-3 dark:bg-qd-surface/75">
                    {[42, 68, 52, 86, 74].map((height) => (
                        <span
                            key={height}
                            className="rounded-full bg-qd-teal/25"
                            style={{ height: 6, width: `${height}%` }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full overflow-hidden rounded-2xl border border-qd-teal-2/20 bg-qd-white/80 shadow-sm dark:bg-qd-surface/80">
            {(variant === 'dashboard' || variant === 'data') && (
                <div className="w-12 shrink-0 border-r border-qd-teal-2/10 bg-qd-ink/90 p-3">
                    {[0, 1, 2, 3].map((item) => (
                        <span
                            key={item}
                            className="mb-2 block size-2 rounded-full bg-qd-teal/55"
                        />
                    ))}
                </div>
            )}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-20 rounded-full bg-qd-teal-2/20" />
                    <span className="h-2 w-10 rounded-full bg-qd-lime/50" />
                    <span className="ml-auto size-3 rounded-full bg-qd-teal/45" />
                </div>
                <div className="grid flex-1 grid-cols-3 gap-3">
                    <span className="rounded-xl bg-qd-teal-2/10" />
                    <span className="rounded-xl bg-qd-teal-2/15" />
                    <span className="rounded-xl bg-qd-lime/20" />
                </div>
                <div className="flex h-9 items-end gap-1.5">
                    {[42, 58, 46, 74, 62, 88].map((height) => (
                        <span
                            key={height}
                            className="flex-1 rounded-t-md bg-qd-teal/35"
                            style={{ height: `${height}%` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

type ServicesProps = {
    readonly services: readonly PublicService[];
};

export default function Services({ services }: ServicesProps) {
    const { t, locale } = useLanguage();

    return (
        <PublicLayout>
            <Head title={t('servicesPage.metaTitle')} />

            <PublicPageHero
                eyebrow={t('servicesPage.hero.eyebrow')}
                title={t('servicesPage.hero.title')}
                subtitle={t('servicesPage.hero.subtitle')}
                currentLabel={t('navigation.items.servicios')}
                taglineTitle={t('servicesPage.heroTagline.title')}
                taglineSubtitle={t('servicesPage.heroTagline.subtitle')}
                taglineIcon={Rocket}
            />

            <section id="servicios" className="bg-qd-white dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {services.map((service) => {
                            const serviceKey =
                                resolveServiceKey(service.slug) ?? 'web';
                            const presentation =
                                SERVICE_PRESENTATION[serviceKey];
                            const Icon = presentation.icon;
                            const slug =
                                localizedText(service.slug, locale) ||
                                presentation.fallbackSlug[locale];
                            const servicePath = `servicesPage.items.${serviceKey}`;
                            const href = service.isDetailEnabled
                                ? `/servicios/${slug}`
                                : contactShow.url({
                                      query: { servicio: slug },
                                  });

                            return (
                                <article
                                    key={service.id}
                                    className="group flex min-h-[460px] flex-col rounded-2xl border border-qd-mist bg-qd-white p-6 shadow-[0_18px_60px_-42px_rgba(7,17,26,0.35)] transition duration-300 hover:-translate-y-1 hover:border-qd-teal-2/70 hover:shadow-[0_24px_70px_-42px_rgba(15,143,149,0.45)] dark:border-qd-white/10 dark:bg-qd-white/5 dark:hover:border-qd-teal/70"
                                >
                                    <div className="flex items-start justify-between gap-5">
                                        <span className="text-lg font-bold text-qd-teal-2 dark:text-qd-teal">
                                            {presentation.number}
                                        </span>
                                        <span className="flex size-14 items-center justify-center rounded-2xl border border-qd-teal-2/30 bg-qd-teal-2/10 text-qd-teal-2 dark:border-qd-teal/35 dark:bg-qd-teal/10 dark:text-qd-teal">
                                            <Icon
                                                aria-hidden="true"
                                                size={28}
                                                strokeWidth={1.7}
                                            />
                                        </span>
                                    </div>

                                    <h2 className="mt-7 text-2xl leading-tight font-bold text-qd-ink dark:text-qd-white">
                                        {localizedText(
                                            service.title,
                                            locale,
                                        ) || t(`${servicePath}.title`)}
                                    </h2>
                                    <p className="mt-3 text-sm leading-relaxed text-qd-text-high">
                                        {localizedText(
                                            service.summary,
                                            locale,
                                        ) || t(`${servicePath}.description`)}
                                    </p>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {CHIPS.map((chip) => (
                                            <span
                                                key={chip}
                                                className="rounded-full border border-qd-teal-2/10 bg-qd-mist/60 px-3 py-1.5 text-xs font-medium text-qd-text-high dark:border-qd-teal/15 dark:bg-qd-white/5"
                                            >
                                                {t(
                                                    `${servicePath}.chips.${chip}`,
                                                )}
                                            </span>
                                        ))}
                                    </div>

                                    <div
                                        aria-hidden="true"
                                        className="mt-6 h-36 overflow-hidden rounded-2xl bg-linear-to-br from-qd-mist to-qd-white p-3 dark:from-qd-surface dark:to-qd-ink"
                                    >
                                        <ServiceMockup
                                            variant={presentation.mockup}
                                        />
                                    </div>

                                    <a
                                        href={href}
                                        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-qd-teal-2 transition hover:text-qd-teal dark:text-qd-teal"
                                    >
                                        {t('servicesPage.cardCta')}
                                        <ArrowRight
                                            aria-hidden="true"
                                            size={16}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </a>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-qd-bg dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 pb-16 sm:px-8 sm:pb-20">
                    <div className="rounded-2xl border border-qd-teal-2/10 bg-qd-mist/75 p-7 dark:border-qd-teal/15 dark:bg-qd-white/5">
                        <h2 className="text-2xl font-bold text-qd-ink dark:text-qd-white">
                            {t('servicesPage.choose.title')}
                        </h2>
                        <div className="mt-7 grid gap-7 lg:grid-cols-3">
                            {CHOICE_CRITERIA.map((criterion) => {
                                const Icon = criterion.icon;

                                return (
                                    <div
                                        key={criterion.key}
                                        className="flex gap-4 lg:border-r lg:border-qd-ink/10 lg:pr-7 last:lg:border-r-0 dark:lg:border-qd-white/10"
                                    >
                                        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-qd-teal-2/30 bg-qd-white text-qd-teal-2 dark:bg-qd-surface dark:text-qd-teal">
                                            <Icon
                                                aria-hidden="true"
                                                size={23}
                                                strokeWidth={1.7}
                                            />
                                        </span>
                                        <div>
                                            <h3 className="text-sm font-bold text-qd-teal-2 dark:text-qd-teal">
                                                {t(
                                                    `servicesPage.choose.items.${criterion.key}.title`,
                                                )}
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-qd-text-high">
                                                {t(
                                                    `servicesPage.choose.items.${criterion.key}.description`,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-qd-bg pb-16 dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                    <div className="relative overflow-hidden rounded-2xl bg-qd-ink p-7 text-qd-white sm:p-9">
                        <div
                            aria-hidden="true"
                            className="absolute inset-y-0 right-0 w-2/3 opacity-70"
                            style={{
                                backgroundImage:
                                    'repeating-linear-gradient(155deg, rgba(24,183,176,0.34) 0px, rgba(24,183,176,0.34) 2px, transparent 2px, transparent 18px)',
                                maskImage:
                                    'linear-gradient(to left, black, transparent)',
                            }}
                        />
                        <div className="relative max-w-2xl">
                            <h2 className="text-2xl font-bold sm:text-3xl">
                                {t('servicesPage.cta.title')}
                            </h2>
                            <p className="mt-3 max-w-lg text-sm leading-relaxed text-qd-text-medium sm:text-base">
                                {t('servicesPage.cta.subtitle')}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <a
                                    href={contactShow.url()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-bold text-qd-ink transition hover:brightness-95"
                                >
                                    {t('servicesPage.cta.primary')}
                                    <ArrowRight
                                        aria-hidden="true"
                                        size={16}
                                    />
                                </a>
                                <a
                                    href={bookingShow.url()}
                                    className="inline-flex items-center gap-2 rounded-xl border border-qd-white/20 px-5 py-3 text-sm font-bold text-qd-white transition hover:border-qd-teal hover:text-qd-teal"
                                >
                                    {t('servicesPage.cta.secondary')}
                                    <CalendarDays
                                        aria-hidden="true"
                                        size={16}
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    Compass,
    GitBranch,
    Sparkles,
    Target,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import PublicPageHero from '@/components/public/PublicPageHero';
import { useLanguage } from '@/hooks/use-language';
import type { Locale } from '@/hooks/use-language';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import { show as bookingShow } from '@/routes/booking';
import { show as contactShow } from '@/routes/contact';

import {
    localizedText,
    resolveServiceKey,
    SERVICE_PRESENTATION,
    ServiceMockup,
} from './Services';
import type { LocalizedText, PublicService } from './Services';

type ServiceDetailRecord = PublicService & {
    readonly description: LocalizedText;
};

type ServiceDetailProps = {
    readonly service: ServiceDetailRecord;
};

const PROBLEM_INDEXES = [0, 1, 2] as const;
const CAPABILITY_INDEXES = [0, 1, 2, 3, 4, 5] as const;

const PROCESS_STEPS: readonly {
    key: 'understand' | 'scope' | 'build' | 'review' | 'deliver';
    icon: LucideIcon;
}[] = [
    { key: 'understand', icon: Target },
    { key: 'scope', icon: Compass },
    { key: 'build', icon: GitBranch },
    { key: 'review', icon: ClipboardCheck },
    { key: 'deliver', icon: CheckCircle2 },
] as const;

function serviceSlug(service: PublicService, locale: Locale): string {
    const serviceKey = resolveServiceKey(service.slug);

    return (
        service.slug[locale] ??
        service.slug.es ??
        service.slug.en ??
        (serviceKey ? SERVICE_PRESENTATION[serviceKey].fallbackSlug[locale] : '')
    );
}

function resolveSettingsCapabilities(
    settings: unknown,
    locale: Locale,
): string[] {
    if (!settings || typeof settings !== 'object') {
        return [];
    }

    const capacities = (settings as { readonly capacities?: unknown })
        .capacities;

    if (!Array.isArray(capacities)) {
        return [];
    }

    return capacities
        .map((capacity) => {
            if (typeof capacity === 'string') {
                return capacity;
            }

            if (capacity && typeof capacity === 'object') {
                return localizedText(capacity as LocalizedText, locale);
            }

            return '';
        })
        .filter((capacity): capacity is string => capacity.length > 0);
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
    const { t, locale } = useLanguage();
    const serviceKey = resolveServiceKey(service.slug);
    const presentation = SERVICE_PRESENTATION[serviceKey ?? 'web'];
    const translationPath = serviceKey
        ? `serviceDetail.items.${serviceKey}`
        : 'serviceDetail.fallback';
    const title =
        localizedText(service.title, locale) || t(`${translationPath}.title`);
    const summary =
        localizedText(service.summary, locale) ||
        t(`${translationPath}.summary`);
    const description = localizedText(service.description, locale) || summary;
    const slug = serviceSlug(service, locale);
    const contactUrl = contactShow.url({
        query: {
            servicio: slug,
        },
    });
    const settingsCapabilities = resolveSettingsCapabilities(
        service.settings,
        locale,
    );
    const capabilities =
        settingsCapabilities.length > 0
            ? settingsCapabilities
            : CAPABILITY_INDEXES.map((index) =>
                  t(`${translationPath}.capabilities.${index}`),
              );

    return (
        <PublicLayout>
            <Head title={`${title} | Abaco Developments`} />

            <PublicPageHero
                eyebrow={t('serviceDetail.hero.eyebrow')}
                title={title}
                subtitle={summary}
                currentLabel={title}
                parentLabel={t('navigation.items.servicios')}
                parentHref="/servicios"
                taglineTitle={t('serviceDetail.heroTagline.title')}
                taglineSubtitle={t('serviceDetail.heroTagline.subtitle')}
                taglineIcon={Sparkles}
                actions={
                    <>
                        <a
                            href={contactUrl}
                            className="inline-flex items-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-bold text-qd-ink transition hover:brightness-95"
                        >
                            {t('serviceDetail.hero.primary')}
                            <ArrowRight aria-hidden="true" size={16} />
                        </a>
                        <a
                            href={bookingShow.url()}
                            className="inline-flex items-center gap-2 rounded-xl border border-qd-ink/15 px-5 py-3 text-sm font-bold text-qd-ink transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-qd-white/20 dark:text-qd-white dark:hover:border-qd-teal dark:hover:text-qd-teal"
                        >
                            {t('serviceDetail.hero.secondary')}
                            <CalendarDays aria-hidden="true" size={16} />
                        </a>
                    </>
                }
            />

            <section className="bg-qd-white dark:bg-qd-ink">
                <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1fr_1.35fr]">
                    <section aria-labelledby="service-solves-title">
                        <h2
                            id="service-solves-title"
                            className="flex items-center gap-3 text-lg font-bold text-qd-ink dark:text-qd-white"
                        >
                            <Target
                                aria-hidden="true"
                                size={21}
                                className="text-qd-teal-2 dark:text-qd-teal"
                            />
                            {t('serviceDetail.solves.title')}
                        </h2>
                        <ul className="mt-6 flex flex-col gap-4">
                            {PROBLEM_INDEXES.map((index) => (
                                <li
                                    key={index}
                                    className="flex gap-3 text-sm leading-relaxed text-qd-text-high"
                                >
                                    <CheckCircle2
                                        aria-hidden="true"
                                        size={17}
                                        className="mt-0.5 shrink-0 text-qd-teal-2 dark:text-qd-teal"
                                    />
                                    {t(`${translationPath}.problems.${index}`)}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section aria-labelledby="service-approach-title">
                        <h2
                            id="service-approach-title"
                            className="flex items-center gap-3 text-lg font-bold text-qd-ink dark:text-qd-white"
                        >
                            <Compass
                                aria-hidden="true"
                                size={21}
                                className="text-qd-teal-2 dark:text-qd-teal"
                            />
                            {t('serviceDetail.approach.title')}
                        </h2>
                        <ol className="mt-6 flex flex-col gap-3">
                            {PROCESS_STEPS.map((step, index) => {
                                const Icon = step.icon;

                                return (
                                    <li
                                        key={step.key}
                                        className="flex items-start gap-4"
                                    >
                                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-qd-teal-2/30 bg-qd-teal-2/10 text-xs font-bold text-qd-teal-2 dark:border-qd-teal/35 dark:bg-qd-teal/10 dark:text-qd-teal">
                                            {String(index + 1).padStart(
                                                2,
                                                '0',
                                            )}
                                        </span>
                                        <div>
                                            <h3 className="flex items-center gap-2 text-sm font-bold text-qd-ink dark:text-qd-white">
                                                <Icon
                                                    aria-hidden="true"
                                                    size={15}
                                                    className="text-qd-teal-2 dark:text-qd-teal"
                                                />
                                                {t(
                                                    `serviceDetail.approach.steps.${step.key}.title`,
                                                )}
                                            </h3>
                                            <p className="mt-1 text-sm leading-relaxed text-qd-text-high">
                                                {t(
                                                    `serviceDetail.approach.steps.${step.key}.description`,
                                                )}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </section>

                    <section
                        aria-labelledby="service-visual-title"
                        className="grid gap-6"
                    >
                        <div>
                            <h2
                                id="service-visual-title"
                                className="flex items-center gap-3 text-lg font-bold text-qd-ink dark:text-qd-white"
                            >
                                <Sparkles
                                    aria-hidden="true"
                                    size={21}
                                    className="text-qd-teal-2 dark:text-qd-teal"
                                />
                                {t('serviceDetail.visual.title')}
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-qd-text-high">
                                {description}
                            </p>
                        </div>

                        <div
                            aria-hidden="true"
                            className="h-64 overflow-hidden rounded-2xl border border-qd-mist bg-linear-to-br from-qd-mist to-qd-white p-5 shadow-[0_18px_60px_-42px_rgba(7,17,26,0.35)] dark:border-qd-white/10 dark:from-qd-surface dark:to-qd-ink"
                        >
                            <ServiceMockup variant={presentation.mockup} />
                        </div>

                        <div>
                            <h2 className="flex items-center gap-3 text-lg font-bold text-qd-ink dark:text-qd-white">
                                <ClipboardCheck
                                    aria-hidden="true"
                                    size={21}
                                    className="text-qd-teal-2 dark:text-qd-teal"
                                />
                                {t('serviceDetail.capabilities.title')}
                            </h2>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {capabilities.map((capability, index) => (
                                    <span
                                        key={`${capability}-${index}`}
                                        className={cn(
                                            'rounded-full border border-qd-teal-2/10 bg-qd-mist/70 px-3 py-1.5 text-xs font-semibold text-qd-text-high dark:border-qd-teal/15 dark:bg-qd-white/5',
                                            index === 0 &&
                                                'border-qd-teal-2/25 text-qd-teal-2 dark:text-qd-teal',
                                        )}
                                    >
                                        {capability}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </section>

            <section className="bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-16 text-center text-qd-white sm:px-8 sm:py-20">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        {t('serviceDetail.cta.title')}
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-qd-text-medium sm:text-base">
                        {t('serviceDetail.cta.subtitle')}
                    </p>
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                        <a
                            href={contactUrl}
                            className="inline-flex items-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-bold text-qd-ink transition hover:brightness-95"
                        >
                            {t('serviceDetail.cta.primary')}
                            <ArrowRight aria-hidden="true" size={16} />
                        </a>
                        <a
                            href={bookingShow.url()}
                            className="inline-flex items-center gap-2 rounded-xl border border-qd-white/20 px-5 py-3 text-sm font-bold text-qd-white transition hover:border-qd-teal hover:text-qd-teal"
                        >
                            {t('serviceDetail.cta.secondary')}
                            <CalendarDays aria-hidden="true" size={16} />
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

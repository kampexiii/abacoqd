import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    Compass,
    GitBranch,
    LockKeyhole,
    Sparkles,
    ShieldCheck,
    Target,
    Users,
    Zap,
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
} from './Services';
import type { LocalizedText, PublicService } from './Services';

type ServiceDetailRecord = PublicService & {
    readonly description: LocalizedText;
};

type ServiceDetailProps = {
    readonly service: ServiceDetailRecord;
};

const PROBLEM_INDEXES = [0, 1, 2, 3] as const;
const CAPABILITY_INDEXES = [0, 1, 2, 3, 4, 5] as const;

const DETAIL_BENEFITS: readonly {
    key: 'agility' | 'quality' | 'support' | 'technology';
    icon: LucideIcon;
}[] = [
    { key: 'agility', icon: Zap },
    { key: 'quality', icon: ShieldCheck },
    { key: 'support', icon: Users },
    { key: 'technology', icon: LockKeyhole },
] as const;

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

function ServiceDeviceMockup({
    title,
    summary,
}: {
    readonly title: string;
    readonly summary: string;
}) {
    return (
        <div className="relative mx-auto flex min-h-64 max-w-md items-end justify-center">
            <div className="absolute inset-x-6 bottom-0 h-4 rounded-full bg-qd-ink/15 blur-xl dark:bg-black/40" />

            <div className="relative w-full rounded-[20px] border border-qd-ink/12 bg-qd-ink p-2 shadow-[0_28px_80px_-38px_rgba(7,17,26,0.65)] dark:border-white/12">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-qd-ink">
                    <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                        <span className="size-2 rounded-full bg-qd-teal" />
                        <span className="size-2 rounded-full bg-qd-cyan/80" />
                        <span className="size-2 rounded-full bg-qd-lime/70" />
                        <span className="ml-auto h-1.5 w-16 rounded-full bg-white/14" />
                    </div>

                    <div className="relative min-h-52 overflow-hidden px-6 py-7">
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 opacity-35"
                            style={{
                                backgroundImage:
                                    'linear-gradient(rgba(24,183,176,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(24,183,176,0.25) 1px, transparent 1px)',
                                backgroundSize: '28px 28px',
                            }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute top-8 right-10 size-28 rotate-45 border border-qd-teal/70 shadow-[0_0_50px_rgba(24,183,176,0.32)]"
                        >
                            <span className="absolute inset-x-1/2 top-0 h-full w-px bg-qd-teal/35" />
                            <span className="absolute inset-y-1/2 left-0 h-px w-full bg-qd-teal/35" />
                        </div>
                        <div className="relative max-w-52">
                            <p className="text-xs font-semibold tracking-[0.16em] text-qd-teal uppercase">
                                AbacoQD
                            </p>
                            <h3 className="mt-4 text-2xl leading-tight font-bold text-qd-white">
                                {title}
                            </h3>
                            <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-white/62">
                                {summary}
                            </p>
                            <span className="mt-5 inline-flex h-8 items-center rounded-lg bg-qd-teal px-3 text-xs font-bold text-qd-ink">
                                {title}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mx-auto mt-2 h-1.5 w-20 rounded-full bg-qd-ink/30 dark:bg-white/15" />
            </div>

            <div className="absolute right-2 bottom-5 w-24 rounded-[22px] border border-qd-ink/14 bg-qd-ink p-1.5 shadow-[0_24px_70px_-34px_rgba(7,17,26,0.7)] dark:border-white/15">
                <div className="overflow-hidden rounded-[17px] border border-white/10 bg-qd-surface">
                    <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-white/18" />
                    <div className="px-3 pt-5 pb-3">
                        <div className="h-2 w-10 rounded-full bg-qd-teal/70" />
                        <div className="mt-3 h-8 rounded-xl bg-white/8" />
                        <div className="mt-2 grid grid-cols-2 gap-1.5">
                            {[0, 1, 2, 3].map((index) => (
                                <span
                                    key={index}
                                    className="h-6 rounded-lg border border-qd-teal/20 bg-qd-teal/10"
                                />
                            ))}
                        </div>
                        <div className="mt-3 h-1.5 w-12 rounded-full bg-white/16" />
                        <div className="mt-1.5 h-1.5 w-9 rounded-full bg-white/10" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
    const { t, locale } = useLanguage();
    const serviceKey = resolveServiceKey(service.slug);
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
                <div className="mx-auto grid max-w-[1240px] px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_1.08fr_1.45fr_1fr]">
                    <section
                        aria-labelledby="service-solves-title"
                        className="border-b border-qd-ink/10 pb-8 lg:border-r lg:border-b-0 lg:pr-7 lg:pb-0 dark:border-white/10"
                    >
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

                    <section
                        aria-labelledby="service-approach-title"
                        className="border-b border-qd-ink/10 py-8 lg:border-r lg:border-b-0 lg:px-7 lg:py-0 dark:border-white/10"
                    >
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
                            {PROCESS_STEPS.map((step, index) => (
                                <li
                                    key={step.key}
                                    className="flex items-start gap-4"
                                >
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-qd-teal-2/30 bg-qd-teal-2/10 text-xs font-bold text-qd-teal-2 dark:border-qd-teal/35 dark:bg-qd-teal/10 dark:text-qd-teal">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <p className="pt-1 text-sm leading-relaxed text-qd-text-high">
                                        {t(
                                            `serviceDetail.approach.steps.${step.key}.description`,
                                        )}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section
                        aria-labelledby="service-visual-title"
                        className="border-b border-qd-ink/10 py-8 lg:border-r lg:border-b-0 lg:px-7 lg:py-0 dark:border-white/10"
                    >
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
                        <div
                            aria-hidden="true"
                            className="mt-6 overflow-hidden rounded-2xl border border-qd-ink/10 bg-linear-to-br from-qd-mist to-qd-white p-4 shadow-[0_18px_60px_-42px_rgba(7,17,26,0.42)] dark:border-white/10 dark:from-qd-surface dark:to-qd-ink"
                        >
                            <ServiceDeviceMockup
                                title={title}
                                summary={summary}
                            />
                        </div>
                    </section>

                    <section
                        aria-labelledby="service-capabilities-title"
                        className="pt-8 lg:pl-7 lg:pt-0"
                    >
                        <h2
                            id="service-capabilities-title"
                            className="flex items-center gap-3 text-lg font-bold text-qd-ink dark:text-qd-white"
                        >
                            <ClipboardCheck
                                aria-hidden="true"
                                size={21}
                                className="text-qd-teal-2 dark:text-qd-teal"
                            />
                            {t('serviceDetail.capabilities.title')}
                        </h2>
                        <div className="mt-6 flex flex-col gap-2.5">
                            {capabilities.map((capability, index) => (
                                <span
                                    key={`${capability}-${index}`}
                                    className={cn(
                                        'inline-flex items-center gap-2 rounded-full border border-qd-ink/8 bg-qd-mist/70 px-3 py-2 text-xs font-semibold text-qd-text-high dark:border-white/10 dark:bg-white/5',
                                        index === 0 &&
                                            'border-qd-teal-2/25 text-qd-teal-2 dark:text-qd-teal',
                                    )}
                                >
                                    <CheckCircle2
                                        aria-hidden="true"
                                        size={14}
                                        className="shrink-0 text-qd-teal-2 dark:text-qd-teal"
                                    />
                                    {capability}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            </section>

            <section className="relative overflow-hidden bg-qd-ink text-qd-white">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-35"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 18% 18%, rgba(24,183,176,0.22), transparent 30%), radial-gradient(circle at 84% 10%, rgba(183,243,74,0.12), transparent 22%), repeating-linear-gradient(115deg, rgba(24,183,176,0.11) 0px, rgba(24,183,176,0.11) 1px, transparent 1px, transparent 42px)',
                    }}
                />
                <div className="relative mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-16">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            {t('serviceDetail.cta.title')}
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                            {t('serviceDetail.cta.subtitle')}
                        </p>
                        <div className="mt-7 flex flex-wrap justify-center gap-3">
                            <a
                                href={contactUrl}
                                className="inline-flex items-center gap-2 rounded-xl bg-qd-teal px-6 py-3 text-sm font-bold text-qd-ink transition hover:brightness-110"
                            >
                                {t('serviceDetail.cta.primary')}
                                <ArrowRight aria-hidden="true" size={16} />
                            </a>
                            <a
                                href={bookingShow.url()}
                                className="inline-flex items-center gap-2 rounded-xl border border-qd-white/25 px-6 py-3 text-sm font-bold text-qd-white transition hover:border-qd-teal hover:text-qd-teal"
                            >
                                {t('serviceDetail.cta.secondary')}
                                <CalendarDays aria-hidden="true" size={16} />
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 grid gap-6 border-t border-white/10 pt-7 sm:grid-cols-2 lg:grid-cols-4">
                        {DETAIL_BENEFITS.map((benefit) => {
                            const Icon = benefit.icon;

                            return (
                                <article
                                    key={benefit.key}
                                    className="flex gap-4"
                                >
                                    <Icon
                                        aria-hidden="true"
                                        size={25}
                                        strokeWidth={1.8}
                                        className="mt-1 shrink-0 text-qd-teal"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-qd-white">
                                            {t(
                                                `serviceDetail.benefits.${benefit.key}.title`,
                                            )}
                                        </h3>
                                        <p className="mt-1 text-sm leading-relaxed text-white/68">
                                            {t(
                                                `serviceDetail.benefits.${benefit.key}.description`,
                                            )}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

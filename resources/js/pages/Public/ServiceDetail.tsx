import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    Compass,
    LockKeyhole,
    Sparkles,
    ShieldCheck,
    Target,
    Users,
    Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import PublicPageHero from '@/components/public/PublicPageHero';
import SeoHead from '@/components/seo/SeoHead';
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
import type { LocalizedText, PublicService, ServiceKey } from './Services';

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

const SERVICE_DETAIL_IMAGES: Record<ServiceKey, string> = {
    web: '/assets/services/details/desarrollo-web-rapido.webp',
    apps: '/assets/services/details/aplicaciones-a-medida.webp',
    ai: '/assets/services/details/automatizacion-con-ia.webp',
    crm: '/assets/services/details/crm-datos-y-procesos.webp',
    integrations: '/assets/services/details/integraciones-digitales.webp',
    mvp: '/assets/services/details/mvps-y-prototipos.webp',
};

const PROCESS_STEPS: readonly {
    key: 'understand' | 'scope' | 'build' | 'review' | 'deliver';
}[] = [
    { key: 'understand' },
    { key: 'scope' },
    { key: 'build' },
    { key: 'review' },
    { key: 'deliver' },
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
    const translationPath = serviceKey
        ? `serviceDetail.items.${serviceKey}`
        : 'serviceDetail.fallback';
    const title =
        localizedText(service.title, locale) || t(`${translationPath}.title`);
    const summary =
        localizedText(service.summary, locale) ||
        t(`${translationPath}.summary`);
    const detailImageSrc = SERVICE_DETAIL_IMAGES[serviceKey ?? 'web'];
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
            <SeoHead />

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
                <div className="mx-auto max-w-[1536px] px-5 py-12 sm:px-8 sm:py-16 xl:px-10">
                    {/* Fila 1: Qué resolvemos (25%) · Cómo lo abordamos (25%) · Imagen (50%) */}
                    <div className="grid gap-8 lg:grid-cols-[1fr_1fr_2fr] lg:gap-0">
                    <section
                        aria-labelledby="service-solves-title"
                        className="border-b border-qd-ink/10 pb-8 lg:border-r lg:border-b-0 lg:pr-8 lg:pb-0 dark:border-white/10"
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
                        className="border-b border-qd-ink/10 py-8 lg:border-r lg:border-b-0 lg:px-8 lg:py-0 dark:border-white/10"
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
                        aria-label={title}
                        className="py-8 lg:min-h-[430px] lg:py-0 lg:pl-8"
                    >
                        <figure
                            className="h-full overflow-hidden rounded-[24px] border border-qd-ink/10 bg-qd-white shadow-[0_26px_90px_-48px_rgba(7,17,26,0.55)] dark:border-white/10 dark:bg-qd-surface"
                        >
                            <img
                                src={detailImageSrc}
                                alt={title}
                                loading="lazy"
                                className="aspect-[16/9] h-full min-h-72 w-full object-cover lg:min-h-full"
                            />
                        </figure>
                    </section>

                    </div>

                    {/* Fila 2: Capacidades a ancho completo, chips en horizontal */}
                    <section
                        aria-labelledby="service-capabilities-title"
                        className="mt-12 border-t border-qd-ink/10 pt-8 dark:border-white/10"
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
                        <div className="mt-6 flex flex-wrap gap-2.5">
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
                <div className="relative mx-auto max-w-[1536px] px-5 py-14 sm:px-8 sm:py-16 xl:px-10">
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

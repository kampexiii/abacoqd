import {
    ArrowLeft,
    ArrowRight,
    BarChart3,
    Boxes,
    CalendarDays,
    Cpu,
    Layers,
    Mountain,
    Target,
    Users,
} from 'lucide-react';

import PublicPageHero from '@/components/public/PublicPageHero';
import SeoHead from '@/components/seo/SeoHead';
import { useLanguage } from '@/hooks/use-language';
import type { Locale } from '@/hooks/use-language';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import { show as bookingShow } from '@/routes/booking';
import { show as contactShow } from '@/routes/contact';

import { localizedText } from './Services';
import type { LocalizedText } from './Services';

type DevelopmentMode = 'solo' | 'cooperative';

type ProjectService = {
    readonly name: LocalizedText;
    readonly slug: string | null;
};

type ProjectPartner = {
    readonly id: number;
    readonly name: string;
    readonly logo: string | null;
    readonly logoDark: string | null;
    readonly logoAlt: string | null;
    readonly website: string | null;
};

type ProjectCardRecord = {
    readonly id: number;
    readonly title: LocalizedText;
    readonly slug: LocalizedText;
    readonly detailUrl: string | null;
    readonly summary: LocalizedText;
    readonly coverImage: string | null;
    readonly thumbnailImage: string | null;
    readonly year: number | null;
    readonly clientName: string | null;
    readonly clientLogo: string | null;
    readonly clientLogoDark: string | null;
    readonly clientLogoAlt: string | null;
    readonly services: readonly ProjectService[];
    readonly developmentMode: DevelopmentMode;
    readonly partners: readonly ProjectPartner[];
};

type ProjectDetailRecord = ProjectCardRecord & {
    readonly description: LocalizedText | null;
    readonly challenge: LocalizedText | null;
    readonly solution: LocalizedText | null;
    readonly result: LocalizedText | null;
    readonly gallery: readonly unknown[];
    readonly technologies: readonly unknown[];
    readonly externalUrl: string | null;
};

type ProjectDetailProps = {
    readonly project: ProjectDetailRecord;
    readonly related: readonly ProjectCardRecord[];
};

const ABACO_LOGO_LIGHT =
    '/assets/branding/marca/logos/abacoqd-lockup-mono-ink.svg';
const ABACO_LOGO_DARK =
    '/assets/branding/marca/logos/abacoqd-lockup-mono-white.svg';

const asStringList = (items: readonly unknown[]): string[] =>
    items.filter(
        (item): item is string => typeof item === 'string' && item.length > 0,
    );

const optionalText = (
    value: LocalizedText | null | undefined,
    locale: Locale,
): string => (value ? localizedText(value, locale) : '');

const projectUrl = (project: ProjectCardRecord, locale: Locale): string => {
    const slug = localizedText(project.slug, locale);

    return project.detailUrl ?? (slug ? `/proyectos/${slug}` : '/proyectos');
};

/** Logo de cliente con variante color (claro) / monocroma (oscuro). */
function ClientLogo({
    project,
    className,
}: {
    readonly project: ProjectCardRecord;
    readonly className?: string;
}) {
    const alt = project.clientLogoAlt ?? project.clientName ?? '';

    if (!project.clientLogo) {
        return (
            <span className="text-lg font-semibold tracking-wide text-qd-text-high">
                {project.clientName}
            </span>
        );
    }

    return (
        <span className={cn('inline-flex items-center', className)}>
            <img
                src={project.clientLogo}
                alt={alt}
                loading="lazy"
                className={cn(
                    'h-full w-auto object-contain',
                    project.clientLogoDark && 'dark:hidden',
                    !project.clientLogoDark && 'dark:brightness-0 dark:invert',
                )}
            />
            {project.clientLogoDark && (
                <img
                    src={project.clientLogoDark}
                    alt={alt}
                    loading="lazy"
                    className="hidden h-full w-auto object-contain dark:block"
                />
            )}
        </span>
    );
}

/** Logo AbacoQD (marca propia) con variante por tema. */
function AbacoLogo({ className }: { readonly className?: string }) {
    return (
        <span className={cn('inline-flex items-center', className)}>
            <img
                src={ABACO_LOGO_LIGHT}
                alt="AbacoQD"
                loading="lazy"
                className="h-full w-auto object-contain dark:hidden"
            />
            <img
                src={ABACO_LOGO_DARK}
                alt="AbacoQD"
                loading="lazy"
                className="hidden h-full w-auto object-contain dark:block"
            />
        </span>
    );
}

function PartnerLogo({ partner }: { readonly partner: ProjectPartner }) {
    const alt = partner.logoAlt ?? partner.name;

    if (!partner.logo) {
        return (
            <span className="text-sm font-semibold text-qd-text-high">
                {partner.name}
            </span>
        );
    }

    return (
        <span className="inline-flex h-9 items-center">
            <img
                src={partner.logo}
                alt={alt}
                loading="lazy"
                className={cn(
                    'h-full w-auto max-w-32 object-contain',
                    partner.logoDark && 'dark:hidden',
                    !partner.logoDark && 'dark:brightness-0 dark:invert',
                )}
            />
            {partner.logoDark && (
                <img
                    src={partner.logoDark}
                    alt={alt}
                    loading="lazy"
                    className="hidden h-full w-auto max-w-32 object-contain dark:block"
                />
            )}
        </span>
    );
}

export default function ProjectDetail({ project, related }: ProjectDetailProps) {
    const { t, locale } = useLanguage();
    const title = localizedText(project.title, locale);
    const summary = localizedText(project.summary, locale);
    const description = optionalText(project.description, locale);
    const technologies = asStringList(project.technologies);
    const gallery = asStringList(project.gallery);
    const cover =
        project.coverImage ?? project.thumbnailImage ?? gallery[0] ?? null;
    const contactUrl = contactShow.url({
        query: { proyecto: localizedText(project.slug, locale) },
    });
    const relatedItems = related.filter((item) => item.id !== project.id);

    const serviceNames = project.services.map((service) =>
        localizedText(service.name, locale),
    );
    const isCooperative =
        project.developmentMode === 'cooperative' && project.partners.length > 0;
    const developmentLabel = isCooperative
        ? t('projectDetail.development.cooperativeLabel')
        : t('projectDetail.development.soloLabel');

    const infoBlocks = [
        {
            key: 'context',
            icon: Target,
            title: t('projectDetail.blocks.context.title'),
            body: description || summary,
        },
        {
            key: 'challenge',
            icon: Mountain,
            title: t('projectDetail.blocks.challenge.title'),
            body: optionalText(project.challenge, locale),
        },
        {
            key: 'solution',
            icon: Boxes,
            title: t('projectDetail.blocks.solution.title'),
            body: optionalText(project.solution, locale),
        },
        {
            key: 'result',
            icon: BarChart3,
            title: t('projectDetail.blocks.result.title'),
            body: optionalText(project.result, locale),
        },
    ].filter((block) => block.body.length > 0);

    const meta = [
        project.year
            ? {
                  key: 'year',
                  icon: CalendarDays,
                  label: t('projectDetail.meta.year'),
                  value: String(project.year),
              }
            : null,
        serviceNames.length > 0
            ? {
                  key: 'capabilities',
                  icon: Layers,
                  label: t('projectDetail.meta.capabilities'),
                  value: serviceNames.join(' · '),
              }
            : null,
        {
            key: 'development',
            icon: Users,
            label: t('projectDetail.meta.development'),
            value: developmentLabel,
        },
        technologies.length > 0
            ? {
                  key: 'technologies',
                  icon: Cpu,
                  label: t('projectDetail.meta.technologies'),
                  value: technologies.slice(0, 3).join(' · '),
              }
            : null,
    ].filter((item): item is NonNullable<typeof item> => item !== null);

    const keyFactsTitle = locale === 'en' ? 'Key details' : 'Datos clave';

    return (
        <PublicLayout>
            <SeoHead />

            <PublicPageHero
                eyebrow={t('projectDetail.hero.eyebrow')}
                title={title}
                subtitle={summary}
                currentLabel={title}
                parentLabel={t('navigation.items.proyectos')}
                parentHref="/proyectos"
                taglineTitle={t('projectDetail.heroTagline.title')}
                taglineSubtitle={t('projectDetail.heroTagline.subtitle')}
                taglineIcon={Boxes}
                actions={
                    <>
                        <a
                            href={contactUrl}
                            className="inline-flex items-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-bold text-qd-ink transition hover:brightness-95"
                        >
                            {t('projectDetail.hero.primary')}
                            <ArrowRight aria-hidden="true" size={16} />
                        </a>
                        <a
                            href={bookingShow.url()}
                            className="inline-flex items-center gap-2 rounded-xl border border-qd-ink/15 px-5 py-3 text-sm font-bold text-qd-ink transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-qd-white/20 dark:text-qd-white dark:hover:border-qd-teal dark:hover:text-qd-teal"
                        >
                            {t('projectDetail.hero.secondary')}
                            <CalendarDays aria-hidden="true" size={16} />
                        </a>
                    </>
                }
            />

            {/* Banner: cliente + proyecto + servicios + desarrollo */}
            <section className="bg-qd-white dark:bg-qd-ink">
                <div className="mx-auto max-w-310 px-5 pt-12 sm:px-8 sm:pt-14">
                    <div className="flex flex-col gap-6 rounded-2xl border border-qd-ink/10 bg-qd-white p-7 shadow-[0_24px_70px_-52px_rgba(7,17,26,0.5)] sm:p-9 dark:border-qd-white/10 dark:bg-qd-surface">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-5">
                                <span className="flex h-12 items-center">
                                    <ClientLogo
                                        project={project}
                                        className="h-12"
                                    />
                                </span>
                                <div>
                                    {project.clientName && (
                                        <p className="text-sm font-semibold text-qd-text-medium">
                                            {project.clientName}
                                        </p>
                                    )}
                                    <h2 className="text-lg font-bold text-qd-ink sm:text-xl dark:text-qd-white">
                                        {title}
                                    </h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-qd-text-medium">
                                    {developmentLabel}
                                </span>
                                <AbacoLogo className="h-7" />
                                {isCooperative &&
                                    project.partners.map((partner) => (
                                        <PartnerLogo
                                            key={partner.id}
                                            partner={partner}
                                        />
                                    ))}
                            </div>
                        </div>
                        {serviceNames.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {serviceNames.map((name) => (
                                    <span
                                        key={name}
                                        className="rounded-full border border-qd-teal-2/15 bg-qd-teal-2/5 px-3 py-1 text-xs font-semibold text-qd-teal-2 dark:border-qd-teal/20 dark:bg-qd-teal/10 dark:text-qd-teal"
                                    >
                                        {name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Datos clave */}
            <section className="bg-qd-white dark:bg-qd-ink">
                <div className="mx-auto max-w-310 px-5 py-12 sm:px-8 sm:py-14">
                    <h2 className="text-2xl font-bold text-qd-ink dark:text-qd-white">
                        {keyFactsTitle}
                    </h2>
                    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {meta.map((item) => {
                            const Icon = item.icon;

                            return (
                                <article
                                    key={item.key}
                                    className="rounded-2xl border border-qd-ink/10 bg-qd-white p-6 shadow-[0_18px_58px_-48px_rgba(7,17,26,0.45)] dark:border-qd-white/10 dark:bg-qd-white/5"
                                >
                                    <Icon
                                        aria-hidden="true"
                                        size={24}
                                        strokeWidth={1.7}
                                        className="text-qd-teal-2 dark:text-qd-teal"
                                    />
                                    <h3 className="mt-4 text-sm font-bold text-qd-ink dark:text-qd-white">
                                        {item.label}
                                    </h3>
                                    {item.key === 'development' ? (
                                        <>
                                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                                <AbacoLogo className="h-6" />
                                                {isCooperative &&
                                                    project.partners.map(
                                                        (partner) => (
                                                            <PartnerLogo
                                                                key={partner.id}
                                                                partner={
                                                                    partner
                                                                }
                                                            />
                                                        ),
                                                    )}
                                            </div>
                                            <p className="mt-3 text-sm leading-relaxed text-qd-text-high">
                                                {item.value}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="mt-3 text-sm leading-relaxed text-qd-text-high">
                                            {item.value}
                                        </p>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Bloques narrativos (solo los que tienen contenido) */}
            {infoBlocks.length > 0 && (
                <section className="bg-qd-white dark:bg-qd-ink">
                    <div className="mx-auto max-w-310 px-5 pb-14 sm:px-8 sm:pb-16">
                        <div className="grid overflow-hidden rounded-2xl border border-qd-ink/10 bg-qd-white shadow-[0_28px_80px_-54px_rgba(7,17,26,0.55)] md:grid-cols-2 dark:border-qd-white/10 dark:bg-qd-surface">
                            {infoBlocks.map((block) => {
                                const Icon = block.icon;

                                return (
                                    <article
                                        key={block.key}
                                        className="border-b border-qd-ink/10 p-7 last:border-b-0 md:nth-[2n]:border-l md:nth-last-[-n+2]:border-b-0 dark:border-qd-white/10"
                                    >
                                        <Icon
                                            aria-hidden="true"
                                            size={32}
                                            strokeWidth={1.6}
                                            className="text-qd-teal-2 dark:text-qd-teal"
                                        />
                                        <h2 className="mt-4 text-lg font-bold text-qd-ink dark:text-qd-white">
                                            {block.title}
                                        </h2>
                                        <p className="mt-4 text-sm leading-relaxed text-qd-text-high">
                                            {block.body}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Imagen del proyecto */}
            {cover && (
                <section className="bg-qd-white dark:bg-qd-ink">
                    <div className="mx-auto max-w-310 px-5 pb-14 sm:px-8 sm:pb-16">
                        <figure className="group relative overflow-hidden rounded-3xl border border-qd-ink/10 bg-qd-bg p-1.5 shadow-[0_34px_90px_-52px_rgba(7,17,26,0.5)] dark:border-qd-white/10 dark:bg-qd-surface">
                            <div className="relative overflow-hidden rounded-[1.35rem]">
                                <img
                                    src={cover}
                                    alt={title}
                                    loading="lazy"
                                    className="aspect-video w-full object-cover transition duration-500 motion-safe:group-hover:scale-[1.02]"
                                />
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-qd-ink/80 via-qd-ink/10 to-transparent"
                                />
                                {project.clientName && (
                                    <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-6 sm:p-8">
                                        <span className="inline-flex items-center rounded-full bg-qd-white/12 px-3 py-1 text-xs font-semibold text-qd-white/90 backdrop-blur-sm">
                                            {project.clientName}
                                        </span>
                                    </figcaption>
                                )}
                            </div>
                        </figure>
                    </div>
                </section>
            )}

            {/* Tecnologías */}
            {technologies.length > 0 && (
                <section className="bg-qd-white dark:bg-qd-ink">
                    <div className="mx-auto max-w-310 px-5 py-12 sm:px-8 sm:py-14">
                        <h2 className="text-2xl font-bold text-qd-ink dark:text-qd-white">
                            {t('projectDetail.technologies.title')}
                        </h2>
                        <div className="mt-5 flex flex-wrap gap-3">
                            {technologies.map((technology) => (
                                <span
                                    key={technology}
                                    className="rounded-lg border border-qd-ink/10 bg-qd-white px-4 py-2 text-sm font-semibold text-qd-text-high dark:border-qd-white/10 dark:bg-qd-white/5"
                                >
                                    {technology}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Relacionados */}
            {relatedItems.length > 0 && (
                <section id="relacionados" className="bg-qd-white dark:bg-qd-ink">
                    <div className="mx-auto max-w-310 px-5 py-12 sm:px-8">
                        <h2 className="text-2xl font-bold text-qd-ink dark:text-qd-white">
                            {t('projectDetail.related.title')}
                        </h2>
                        <div className="mt-7 grid gap-5 md:grid-cols-3">
                            {relatedItems.map((item) => {
                                const itemTitle = localizedText(
                                    item.title,
                                    locale,
                                );
                                const itemSummary = localizedText(
                                    item.summary,
                                    locale,
                                );
                                const itemCover =
                                    item.coverImage ?? item.thumbnailImage;

                                return (
                                    <article
                                        key={item.id}
                                        className="grid grid-cols-[120px_1fr] gap-4 rounded-xl border border-qd-ink/10 bg-qd-white p-3 shadow-[0_20px_60px_-48px_rgba(7,17,26,0.5)] dark:border-qd-white/10 dark:bg-qd-white/5"
                                    >
                                        <a href={projectUrl(item, locale)}>
                                            {itemCover ? (
                                                <img
                                                    src={itemCover}
                                                    alt={itemTitle}
                                                    loading="lazy"
                                                    className="aspect-5/4 w-full rounded-lg object-cover"
                                                />
                                            ) : (
                                                <span className="flex aspect-5/4 w-full items-center justify-center rounded-lg bg-qd-ink">
                                                    <img
                                                        src="/assets/branding/marca/logos/abacoqd-isotipo-inverse.svg"
                                                        alt=""
                                                        className="h-8 w-8 opacity-80"
                                                        loading="lazy"
                                                    />
                                                </span>
                                            )}
                                        </a>
                                        <div className="min-w-0 py-1 pr-1">
                                            <h3 className="text-sm font-bold leading-snug text-qd-ink dark:text-qd-white">
                                                <a
                                                    href={projectUrl(
                                                        item,
                                                        locale,
                                                    )}
                                                    className="transition hover:text-qd-teal-2"
                                                >
                                                    {itemTitle}
                                                </a>
                                            </h3>
                                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-qd-text-high">
                                                {itemSummary}
                                            </p>
                                            <a
                                                href={projectUrl(item, locale)}
                                                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-qd-teal-2 transition hover:text-qd-teal"
                                            >
                                                {t('projectDetail.related.view')}
                                                <ArrowRight
                                                    aria-hidden="true"
                                                    size={13}
                                                />
                                            </a>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-qd-white pb-14 dark:bg-qd-ink">
                <div className="mx-auto max-w-310 px-5 sm:px-8">
                    <div className="flex flex-col gap-8 rounded-2xl border border-qd-white/10 bg-qd-ink p-8 text-qd-white shadow-[0_22px_80px_-46px_rgba(7,17,26,0.65)] sm:flex-row sm:items-center sm:justify-between sm:p-10">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {t('projectDetail.cta.title')}
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-qd-white/72">
                                {t('projectDetail.cta.subtitle')}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href={contactUrl}
                                className="inline-flex items-center gap-2 rounded-lg bg-qd-lime px-5 py-3 text-sm font-bold text-qd-ink transition hover:brightness-95"
                            >
                                {t('projectDetail.cta.primary')}
                                <ArrowRight aria-hidden="true" size={16} />
                            </a>
                            <a
                                href={bookingShow.url()}
                                className="inline-flex items-center gap-2 rounded-lg border border-qd-lime/45 px-5 py-3 text-sm font-bold text-qd-white transition hover:border-qd-lime hover:text-qd-lime"
                            >
                                {t('projectDetail.cta.secondary')}
                                <CalendarDays aria-hidden="true" size={16} />
                            </a>
                        </div>
                    </div>
                    <a
                        href="/proyectos"
                        className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-qd-teal-2 transition hover:text-qd-teal"
                    >
                        <ArrowLeft aria-hidden="true" size={15} />
                        {t('projectDetail.related.back')}
                    </a>
                </div>
            </section>
        </PublicLayout>
    );
}

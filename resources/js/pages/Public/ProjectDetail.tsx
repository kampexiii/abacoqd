import { Head } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    BarChart3,
    Boxes,
    CalendarDays,
    CheckCircle2,
    Cpu,
    ExternalLink,
    Mountain,
    Target,
    Users,
    Zap,
} from 'lucide-react';

import PublicPageHero from '@/components/public/PublicPageHero';
import { useLanguage } from '@/hooks/use-language';
import type { Locale } from '@/hooks/use-language';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import { show as bookingShow } from '@/routes/booking';
import { show as contactShow } from '@/routes/contact';

import { localizedText } from './Services';
import type { LocalizedText } from './Services';

type ProjectPartnerRole =
    | 'client'
    | 'collaborator'
    | 'technologyPartner'
    | 'brand'
    | 'other';

type ProjectPartner = {
    readonly id: number;
    readonly name: string;
    readonly logo: string | null;
    readonly logoDark: string | null;
    readonly logoAlt: string | null;
    readonly website: string | null;
    readonly roleKey: ProjectPartnerRole;
};

type RelatedProject = {
    readonly id: number;
    readonly title: LocalizedText;
    readonly slug: LocalizedText;
    readonly detailUrl: string | null;
    readonly summary: LocalizedText;
    readonly coverImage: string | null;
    readonly thumbnailImage: string | null;
    readonly partnerName: string | null;
    readonly clientName: string | null;
    readonly isHistorical: boolean;
    readonly isApproved: boolean;
};

type ProjectDetailRecord = RelatedProject & {
    readonly description: LocalizedText | null;
    readonly challenge: LocalizedText | null;
    readonly solution: LocalizedText | null;
    readonly result: LocalizedText | null;
    readonly gallery: readonly unknown[];
    readonly technologies: readonly unknown[];
    readonly year: number | null;
    readonly partnerLogo: string | null;
    readonly partnerLogoDark: string | null;
    readonly partnerLogoAlt: string | null;
    readonly executorName: string | null;
    readonly externalUrl: string | null;
    readonly permissionNotes: string | null;
    readonly permissionStatus: string;
    readonly settings: Record<string, unknown>;
    readonly partners: readonly ProjectPartner[];
};

type ProjectDetailProps = {
    readonly project: ProjectDetailRecord;
    readonly related: readonly RelatedProject[];
};

const asStringList = (items: readonly unknown[]): string[] =>
    items.filter((item): item is string => typeof item === 'string' && item.length > 0);

const optionalText = (
    value: LocalizedText | null | undefined,
    locale: Locale,
): string => (value ? localizedText(value, locale) : '');

const projectUrl = (project: RelatedProject, locale: Locale): string => {
    const slug = localizedText(project.slug, locale);

    return project.detailUrl ?? (slug ? `/proyectos/${slug}` : '/proyectos');
};

function BrandPattern({
    label,
    compact = false,
}: {
    readonly label: string;
    readonly compact?: boolean;
}) {
    return (
        <div
            className={cn(
                'flex w-full items-center justify-center bg-qd-ink',
                compact ? 'aspect-[5/4] rounded-xl p-4' : 'aspect-[16/9] rounded-2xl p-8',
            )}
            style={{
                backgroundImage:
                    'radial-gradient(circle at 28% 24%, rgba(24,183,176,0.26), transparent 42%), linear-gradient(rgba(24,183,176,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(24,183,176,0.16) 1px, transparent 1px)',
                backgroundSize: 'auto, 28px 28px, 28px 28px',
            }}
        >
            <div className="text-center">
                <img
                    src="/assets/branding/marca/logos/abacoqd-isotipo-inverse.svg"
                    alt=""
                    className={cn('mx-auto opacity-85', compact ? 'h-8 w-8' : 'h-14 w-14')}
                    loading="lazy"
                />
                {!compact && (
                    <p className="mt-4 text-sm font-semibold text-qd-white/72">
                        {label}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function ProjectDetail({ project, related }: ProjectDetailProps) {
    const { t, locale } = useLanguage();
    const title = localizedText(project.title, locale);
    const summary = localizedText(project.summary, locale);
    const description = optionalText(project.description, locale);
    const technologies = asStringList(project.technologies);
    const gallery = asStringList(project.gallery);
    const cover = project.coverImage ?? project.thumbnailImage ?? gallery[0] ?? null;
    const contactUrl = contactShow.url({
        query: { proyecto: localizedText(project.slug, locale) },
    });
    const relatedItems = related.filter((item) => item.id !== project.id);
    const client = project.partners.find((partner) => partner.roleKey === 'client');
    const executorPartner = project.partners.find(
        (partner) => partner.roleKey === 'collaborator',
    );
    const mainPartner = client ?? project.partners[0] ?? null;
    const partnerLabel =
        project.partnerName ?? project.clientName ?? mainPartner?.name ?? t('projectsPage.card.internalProject');
    const pendingLong = t('projectDetail.validation.pendingSection');
    const statusBadges = [
        project.isHistorical ? t('projectsPage.badge.historical') : null,
        !project.isApproved ? t('projectsPage.badge.pendingValidation') : null,
    ].filter((badge): badge is string => badge !== null);
    const processItems = [
        description || summary || t('projectDetail.validation.pendingSection'),
        t('projectDetail.process.validation'),
        technologies.length > 0
            ? `${t('projectDetail.process.capabilities')}: ${technologies.join(', ')}`
            : t('projectDetail.validation.pendingSection'),
    ];

    const infoBlocks = [
        {
            key: 'context',
            icon: Target,
            title: t('projectDetail.blocks.context.title'),
            body: description || summary || t('projectDetail.validation.pendingSection'),
        },
        {
            key: 'challenge',
            icon: Mountain,
            title: t('projectDetail.blocks.challenge.title'),
            body:
                optionalText(project.challenge, locale) ||
                t('projectDetail.validation.pendingSection'),
        },
        {
            key: 'solution',
            icon: Boxes,
            title: t('projectDetail.blocks.solution.title'),
            body:
                optionalText(project.solution, locale) ||
                t('projectDetail.validation.pendingSection'),
        },
        {
            key: 'result',
            icon: BarChart3,
            title: t('projectDetail.blocks.result.title'),
            body:
                optionalText(project.result, locale) ||
                t('projectDetail.validation.pendingResult'),
        },
    ] as const;

    const meta = [
        {
            key: 'year',
            icon: CalendarDays,
            label: t('projectDetail.meta.year'),
            value: project.year ? String(project.year) : t('projectDetail.validation.pendingShort'),
        },
        {
            key: 'capabilities',
            icon: Users,
            label: t('projectDetail.meta.capabilities'),
            value: technologies.slice(0, 2).join(' · ') || pendingLong,
        },
        {
            key: 'role',
            icon: Users,
            label: t('projectDetail.meta.role'),
            value: project.executorName ?? executorPartner?.name ?? pendingLong,
        },
        {
            key: 'technologies',
            icon: Cpu,
            label: t('projectDetail.meta.technologies'),
            value: technologies.slice(0, 3).join(' · ') || pendingLong,
        },
    ] as const;
    const keyFactsTitle = locale === 'en' ? 'Key details' : 'Datos clave';

    return (
        <PublicLayout>
            <Head title={`${title} | Abaco Developments`} />

            <PublicPageHero
                eyebrow={t('projectDetail.hero.eyebrow')}
                title={title}
                subtitle={summary || t('projectDetail.validation.pendingSection')}
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

            <section className="bg-qd-white dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-14">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <h2 className="text-2xl font-bold text-qd-ink dark:text-qd-white">
                            {keyFactsTitle}
                        </h2>
                        {statusBadges.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {statusBadges.map((badge) => (
                                    <span
                                        key={badge}
                                        className="inline-flex items-center gap-2 rounded-full border border-qd-teal-2/25 bg-qd-teal-2/10 px-3 py-1 text-xs font-bold text-qd-teal-2 dark:border-qd-lime/30 dark:bg-qd-lime/10 dark:text-qd-lime"
                                    >
                                        <span className="size-1.5 rounded-full bg-qd-teal-2 dark:bg-qd-lime" />
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
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
                                    <p className="mt-3 text-sm leading-relaxed text-qd-text-high">
                                        {item.value}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-qd-white dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 pb-14 sm:px-8 sm:pb-16">
                    <div className="grid overflow-hidden rounded-2xl border border-qd-ink/10 bg-qd-white shadow-[0_28px_80px_-54px_rgba(7,17,26,0.55)] md:grid-cols-2 lg:grid-cols-4 dark:border-qd-white/10 dark:bg-qd-surface">
                        {infoBlocks.map((block) => {
                            const Icon = block.icon;

                            return (
                                <article
                                    key={block.key}
                                    className="border-b border-qd-ink/10 p-7 md:[&:nth-child(2n)]:border-l lg:border-b-0 lg:border-l lg:first:border-l-0 dark:border-qd-white/10"
                                >
                                    <Icon
                                        aria-hidden="true"
                                        size={34}
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

            <section className="bg-qd-white dark:bg-qd-ink">
                <div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-14 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
                    <section aria-labelledby="project-how-title">
                        <h2
                            id="project-how-title"
                            className="text-2xl font-bold text-qd-ink dark:text-qd-white"
                        >
                            {t('projectDetail.process.title')}
                        </h2>
                        <p className="mt-5 text-sm leading-relaxed text-qd-text-high sm:text-base">
                            {description || summary || t('projectDetail.validation.pendingSection')}
                        </p>
                        <ul className="mt-8 divide-y divide-qd-ink/10 dark:divide-qd-white/10">
                            {processItems.map((item, index) => (
                                <li
                                    key={`${index}-${item}`}
                                    className="flex gap-3 py-4 text-sm leading-relaxed text-qd-text-high first:pt-0"
                                >
                                    <CheckCircle2
                                        aria-hidden="true"
                                        size={18}
                                        className="mt-0.5 shrink-0 text-qd-teal-2 dark:text-qd-teal"
                                    />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section aria-labelledby="project-tech-title">
                        <h2
                            id="project-tech-title"
                            className="text-2xl font-bold text-qd-ink dark:text-qd-white"
                        >
                            {t('projectDetail.technologies.title')}
                        </h2>
                        <div className="mt-5 flex flex-wrap gap-3">
                            {(technologies.length > 0
                                ? technologies
                                : [t('projectDetail.validation.pendingShort')]
                            ).map((technology) => (
                                <span
                                    key={technology}
                                    className="rounded-lg border border-qd-ink/10 bg-qd-white px-4 py-2 text-sm font-semibold text-qd-text-high dark:border-qd-white/10 dark:bg-qd-white/5"
                                >
                                    {technology}
                                </span>
                            ))}
                        </div>

                        <figure className="relative mt-8 overflow-hidden rounded-2xl border border-qd-ink/10 bg-qd-white shadow-[0_24px_80px_-48px_rgba(7,17,26,0.45)] dark:border-qd-white/10 dark:bg-qd-surface">
                            {cover ? (
                                <img
                                    src={cover}
                                    alt={title}
                                    loading="lazy"
                                    className="aspect-[16/9] w-full object-cover"
                                />
                            ) : (
                                <BrandPattern label={t('projectDetail.media.fallback')} />
                            )}
                            <div className="absolute bottom-0 left-0 flex w-full max-w-sm items-center gap-6 rounded-tr-2xl bg-qd-ink/94 px-7 py-5 text-qd-white backdrop-blur">
                                <div>
                                    <p className="text-2xl font-bold text-qd-white">
                                        {project.isApproved
                                            ? t('projectDetail.media.approved')
                                            : t('projectDetail.validation.pendingShort')}
                                    </p>
                                    <p className="mt-1 text-xs text-qd-white/68">
                                        {t('projectDetail.media.validation')}
                                    </p>
                                </div>
                                <span className="h-10 w-px bg-qd-white/12" />
                                <div>
                                    <p className="text-2xl font-bold text-qd-white">
                                        {project.permissionStatus}
                                    </p>
                                    <p className="mt-1 text-xs text-qd-white/68">
                                        {t('projectDetail.media.permission')}
                                    </p>
                                </div>
                            </div>
                        </figure>
                    </section>
                </div>
            </section>

            <section className="bg-[linear-gradient(90deg,#effaff_0%,#f8fdff_46%,#edf9fb_100%)] dark:bg-qd-surface">
                <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.75fr_1.25fr]">
                    <aside className="border-qd-ink/10 lg:border-r lg:pr-12 dark:border-qd-white/10">
                        <h2 className="text-base font-bold text-qd-ink dark:text-qd-white">
                            {mainPartner ? t('projectDetail.partners.partner') : t('projectDetail.partners.title')}
                        </h2>
                        <div className="mt-7">
                            {mainPartner?.logo ? (
                                <>
                                    <img
                                        src={mainPartner.logo}
                                        alt={mainPartner.logoAlt ?? mainPartner.name}
                                        className={cn(
                                            'max-h-16 w-auto max-w-52 object-contain',
                                            mainPartner.logoDark && 'dark:hidden',
                                            !mainPartner.logoDark && 'dark:brightness-0 dark:invert',
                                        )}
                                        loading="lazy"
                                    />
                                    {mainPartner.logoDark && (
                                        <img
                                            src={mainPartner.logoDark}
                                            alt={mainPartner.logoAlt ?? mainPartner.name}
                                            className="hidden max-h-16 w-auto max-w-52 object-contain dark:block"
                                            loading="lazy"
                                        />
                                    )}
                                </>
                            ) : (
                                <p className="text-2xl font-semibold tracking-wide text-qd-text-high">
                                    {partnerLabel}
                                </p>
                            )}
                        </div>
                        {mainPartner?.website && (
                            <a
                                href={mainPartner.website}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-qd-teal-2 transition hover:text-qd-teal"
                            >
                                {t('projectDetail.partners.website')}
                                <ExternalLink aria-hidden="true" size={15} />
                            </a>
                        )}
                    </aside>

                    <div>
                        <h2 className="text-base font-bold text-qd-ink dark:text-qd-white">
                            {t('projectDetail.partners.rolesTitle')}
                        </h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {project.partners.map((partner) => (
                                <div
                                    key={partner.id}
                                    className="rounded-xl border border-qd-ink/10 bg-qd-white/70 p-4 dark:border-qd-white/10 dark:bg-qd-white/5"
                                >
                                    <p className="font-semibold text-qd-ink dark:text-qd-white">
                                        {partner.name}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-qd-text-medium">
                                        {t(`projectDetail.roles.${partner.roleKey}`)}
                                    </p>
                                </div>
                            ))}
                            {project.partners.length === 0 && (
                                <p className="text-sm text-qd-text-high">
                                    {t('projectDetail.validation.pendingSection')}
                                </p>
                            )}
                        </div>
                        <p className="mt-6 text-sm leading-relaxed text-qd-text-high">
                            {t('projectDetail.partners.note')}
                        </p>
                    </div>
                </div>
            </section>

            <section id="relacionados" className="bg-qd-white dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8">
                    <h2 className="text-2xl font-bold text-qd-ink dark:text-qd-white">
                        {t('projectDetail.related.title')}
                    </h2>
                    <div className="mt-7 grid gap-5 md:grid-cols-3">
                        {relatedItems.map((item) => {
                            const itemTitle = localizedText(item.title, locale);
                            const itemSummary = localizedText(item.summary, locale);
                            const itemCover = item.coverImage ?? item.thumbnailImage;

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
                                                className="aspect-[5/4] w-full rounded-lg object-cover"
                                            />
                                        ) : (
                                            <BrandPattern
                                                label={t('projectDetail.media.fallback')}
                                                compact
                                            />
                                        )}
                                    </a>
                                    <div className="min-w-0 py-1 pr-1">
                                        <h3 className="text-sm font-bold leading-snug text-qd-ink dark:text-qd-white">
                                            <a
                                                href={projectUrl(item, locale)}
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
                                            <ArrowRight aria-hidden="true" size={13} />
                                        </a>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-qd-white pb-14 dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                    <div className="flex flex-col gap-8 rounded-2xl border border-qd-white/10 bg-qd-ink p-8 text-qd-white shadow-[0_22px_80px_-46px_rgba(7,17,26,0.65)] sm:flex-row sm:items-center sm:justify-between sm:p-10">
                        <div className="flex items-start gap-5">
                            <span className="hidden size-12 shrink-0 items-center justify-center text-qd-teal sm:flex">
                                <Zap aria-hidden="true" size={38} fill="currentColor" />
                            </span>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {t('projectDetail.cta.title')}
                                </h2>
                                <p className="mt-2 text-sm leading-relaxed text-qd-white/72">
                                    {t('projectDetail.cta.subtitle')}
                                </p>
                            </div>
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

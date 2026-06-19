import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    Boxes,
    CalendarDays,
    Layers,
    Send,
} from 'lucide-react';

import PublicPageHero from '@/components/public/PublicPageHero';
import { useLanguage } from '@/hooks/use-language';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import { show as bookingShow } from '@/routes/booking';
import { show as contactShow } from '@/routes/contact';

import { localizedText } from './Services';
import type { LocalizedText } from './Services';

type PublicProject = {
    readonly id: number;
    readonly title: LocalizedText;
    readonly slug: LocalizedText;
    readonly detailUrl: string | null;
    readonly summary: LocalizedText;
    readonly coverImage: string | null;
    readonly thumbnailImage: string | null;
    readonly technologies: readonly unknown[];
    readonly year: number | null;
    readonly clientName: string | null;
    readonly partnerName: string | null;
    readonly partnerLogo: string | null;
    readonly partnerLogoDark: string | null;
    readonly partnerLogoAlt: string | null;
    readonly executorName: string | null;
    readonly isFeatured: boolean;
    readonly isHistorical: boolean;
    readonly isApproved: boolean;
};

type PublicPartner = {
    readonly id: number;
    readonly name: string;
    readonly logo: string | null;
    readonly logoDark: string | null;
    readonly logoAlt: string | null;
    readonly website: string | null;
    readonly description: LocalizedText | null;
    readonly isHistorical: boolean;
    readonly isApproved: boolean;
};

type ProjectsProps = {
    readonly projects: readonly PublicProject[];
    readonly partners: readonly PublicPartner[];
};

export default function Projects({ projects, partners }: ProjectsProps) {
    const { t, locale } = useLanguage();
    const hasProjects = projects.length > 0;
    const hasPartners = partners.length > 0;

    return (
        <PublicLayout>
            <Head title={t('projectsPage.metaTitle')} />

            <PublicPageHero
                eyebrow={t('projectsPage.hero.eyebrow')}
                title={t('projectsPage.hero.title')}
                subtitle={t('projectsPage.hero.subtitle')}
                currentLabel={t('navigation.items.proyectos')}
                taglineTitle={t('projectsPage.heroTagline.title')}
                taglineSubtitle={t('projectsPage.heroTagline.subtitle')}
                taglineIcon={Layers}
            />

            <section className="bg-qd-bg dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
                    {/* Bloque introductorio */}
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-qd-teal-2/25 bg-qd-teal-2/10 text-qd-teal-2 dark:border-qd-teal/30 dark:bg-qd-teal/10 dark:text-qd-teal">
                            <Boxes aria-hidden="true" size={24} strokeWidth={1.7} />
                        </span>
                        <h2 className="mt-6 text-xl font-bold text-qd-ink sm:text-2xl dark:text-qd-white">
                            {t('projectsPage.intro.title')}
                        </h2>
                        <p className="mt-3 text-sm text-qd-text-medium sm:text-base">
                            {t('projectsPage.intro.line1')}
                        </p>
                        <p className="text-sm text-qd-text-medium sm:text-base">
                            {t('projectsPage.intro.line2')}
                        </p>
                    </div>

                    {hasProjects ? (
                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-qd-mist bg-qd-white p-8 text-center sm:p-10 dark:border-qd-white/10 dark:bg-qd-white/5">
                            <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-qd-teal-2/25 bg-qd-teal-2/10 text-qd-teal-2 dark:border-qd-teal/30 dark:bg-qd-teal/10 dark:text-qd-teal">
                                <Boxes aria-hidden="true" size={24} strokeWidth={1.7} />
                            </span>
                            <h3 className="mt-5 text-xl font-bold text-qd-ink dark:text-qd-white">
                                {t('projectsPage.empty.title')}
                            </h3>
                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-qd-text-high">
                                {t('projectsPage.empty.subtitle')}
                            </p>
                            <div className="mt-7 flex flex-wrap justify-center gap-3">
                                <a
                                    href="/servicios"
                                    className="inline-flex items-center gap-2 rounded-xl border border-qd-ink/15 px-5 py-3 text-sm font-bold text-qd-ink transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-qd-white/20 dark:text-qd-white dark:hover:border-qd-teal dark:hover:text-qd-teal"
                                >
                                    {t('projectsPage.empty.services')}
                                    <ArrowRight aria-hidden="true" size={16} />
                                </a>
                                <a
                                    href={contactShow.url()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-bold text-qd-ink transition hover:brightness-95"
                                >
                                    {t('projectsPage.empty.contact')}
                                    <Send aria-hidden="true" size={16} />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Bloque de partners: solo si hay marcas con permiso */}
                    {hasPartners && (
                        <div className="mt-10 rounded-3xl border border-qd-mist bg-qd-white p-7 sm:p-8 dark:border-qd-white/10 dark:bg-qd-white/5">
                            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:gap-10">
                                <h2 className="max-w-[220px] text-lg font-bold text-qd-ink dark:text-qd-white">
                                    {t('projectsPage.partners.title')}
                                </h2>
                                <ul className="flex flex-1 flex-wrap items-center gap-x-10 gap-y-6">
                                    {partners.map((partner) => (
                                        <li
                                            key={partner.id}
                                            className="flex items-center gap-3"
                                        >
                                            {partner.logo ? (
                                                <img
                                                    src={partner.logo}
                                                    alt={partner.logoAlt ?? partner.name}
                                                    className="h-9 w-auto object-contain"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <span className="flex size-9 items-center justify-center rounded-lg border border-qd-teal-2/25 bg-qd-teal-2/10 text-qd-teal-2 dark:border-qd-teal/30 dark:bg-qd-teal/10 dark:text-qd-teal">
                                                    <Layers aria-hidden="true" size={18} />
                                                </span>
                                            )}
                                            <span className="text-sm font-semibold text-qd-ink dark:text-qd-white">
                                                {partner.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <p className="mt-6 text-center text-xs text-qd-text-medium">
                                {partners.some(
                                    (partner) => partner.isHistorical && !partner.isApproved,
                                )
                                    ? t('projectsPage.partners.pendingNote')
                                    : t('projectsPage.partners.note')}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA final */}
            <section className="bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
                    <div className="relative flex flex-col gap-8 overflow-hidden rounded-3xl border border-qd-white/10 bg-qd-white/5 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-60"
                            style={{
                                backgroundImage:
                                    'repeating-linear-gradient(115deg, rgba(24,183,176,0.18) 0px, rgba(24,183,176,0.18) 1.5px, transparent 1.5px, transparent 26px)',
                                maskImage:
                                    'linear-gradient(to left, black, transparent)',
                            }}
                        />
                        <div className="relative flex items-start gap-4">
                            <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl border border-qd-teal/30 bg-qd-teal/10 text-qd-teal sm:flex">
                                <Boxes aria-hidden="true" size={24} />
                            </span>
                            <div>
                                <h2 className="text-2xl font-bold text-qd-white sm:text-3xl">
                                    {t('projectsPage.cta.title')}
                                </h2>
                                <p className="mt-2 max-w-md text-sm text-qd-text-medium sm:text-base">
                                    {t('projectsPage.cta.subtitle')}
                                </p>
                            </div>
                        </div>
                        <div className="relative flex flex-wrap items-center gap-3">
                            <a
                                href={contactShow.url()}
                                className="inline-flex items-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-bold text-qd-ink transition hover:brightness-95"
                            >
                                {t('projectsPage.cta.primary')}
                                <Send aria-hidden="true" size={16} />
                            </a>
                            <a
                                href={bookingShow.url()}
                                className="inline-flex items-center gap-2 rounded-xl border border-qd-white/20 px-5 py-3 text-sm font-bold text-qd-white transition hover:border-qd-teal hover:text-qd-teal"
                            >
                                {t('projectsPage.cta.secondary')}
                                <CalendarDays aria-hidden="true" size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );

    function ProjectCard({ project }: { readonly project: PublicProject }) {
        const title = localizedText(project.title, locale);
        const summary = localizedText(project.summary, locale);
        const slug = localizedText(project.slug, locale);
        const cover = project.coverImage ?? project.thumbnailImage;
        const technologies = project.technologies.filter(
            (tech): tech is string => typeof tech === 'string' && tech.length > 0,
        );
        const partnerLabel = project.partnerName ?? project.clientName ?? t('projectsPage.card.internalProject');
        const consultUrl = contactShow.url({ query: { proyecto: slug } });
        const detailUrl = project.detailUrl ?? (slug ? `/proyectos/${slug}` : null);
        const cardUrl = detailUrl ?? consultUrl;
        const statusBadges = [
            project.isHistorical ? t('projectsPage.badge.historical') : null,
            !project.isApproved
                ? t('projectsPage.badge.pendingValidation')
                : null,
        ].filter((badge): badge is string => badge !== null);

        return (
            <article className="group flex flex-col overflow-hidden rounded-2xl border border-qd-mist bg-qd-white shadow-[0_18px_60px_-42px_rgba(7,17,26,0.35)] transition duration-300 hover:-translate-y-1 hover:border-qd-teal-2/70 dark:border-qd-white/10 dark:bg-qd-white/5 dark:hover:border-qd-teal/70">
                <div className="relative">
                    {statusBadges.length > 0 && (
                        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-qd-ink/85 px-3 py-1 text-[11px] font-bold text-qd-white backdrop-blur-sm">
                            <span className="size-1.5 rounded-full bg-qd-lime" />
                            {statusBadges.join(' · ')}
                        </span>
                    )}
                    <a href={cardUrl} aria-label={`${t('projectsPage.card.viewProject')}: ${title}`}>
                        {cover ? (
                            <img
                                src={cover}
                                alt={title}
                                loading="lazy"
                                className="aspect-[16/10] w-full object-cover"
                            />
                        ) : (
                            <div
                                aria-hidden="true"
                                className="flex aspect-[16/10] w-full items-center justify-center bg-qd-ink"
                                style={{
                                    backgroundImage:
                                        'radial-gradient(circle at 30% 25%, rgba(24,183,176,0.22), transparent 45%), linear-gradient(rgba(24,183,176,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(24,183,176,0.16) 1px, transparent 1px)',
                                    backgroundSize: 'auto, 26px 26px, 26px 26px',
                                }}
                            >
                                <img
                                    src="/assets/branding/marca/logos/abacoqd-isotipo-inverse.svg"
                                    alt=""
                                    className="h-12 w-12 opacity-80"
                                />
                            </div>
                        )}
                    </a>
                </div>

                <div className="flex flex-1 flex-col p-6">
                    <div className="flex min-h-9 items-center gap-3">
                        {project.partnerLogo ? (
                            <span className="flex h-9 max-w-28 items-center">
                                <img
                                    src={project.partnerLogo}
                                    alt={project.partnerLogoAlt ?? partnerLabel}
                                    className={cn(
                                        'max-h-8 w-auto max-w-28 object-contain',
                                        project.partnerLogoDark && 'dark:hidden',
                                        !project.partnerLogoDark &&
                                            'dark:brightness-0 dark:invert',
                                    )}
                                    loading="lazy"
                                    decoding="async"
                                />
                                {project.partnerLogoDark && (
                                    <img
                                        src={project.partnerLogoDark}
                                        alt={project.partnerLogoAlt ?? partnerLabel}
                                        className="hidden max-h-8 w-auto max-w-28 object-contain dark:block"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                )}
                            </span>
                        ) : (
                            <span className="flex size-9 items-center justify-center rounded-lg border border-qd-teal-2/25 bg-qd-teal-2/10 text-qd-teal-2 dark:border-qd-teal/30 dark:bg-qd-teal/10 dark:text-qd-teal">
                                <Layers aria-hidden="true" size={17} />
                            </span>
                        )}
                        <span className="text-xs font-semibold text-qd-text-medium">
                            {partnerLabel}
                        </span>
                    </div>

                    {technologies.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {technologies.slice(0, 3).map((tech) => (
                                <span
                                    key={tech}
                                    className="rounded-full border border-qd-teal-2/10 bg-qd-mist/60 px-3 py-1 text-xs font-medium text-qd-text-high dark:border-qd-teal/15 dark:bg-qd-white/5"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}

                    <h3 className="mt-4 text-lg font-bold text-qd-ink dark:text-qd-white">
                        <a
                            href={cardUrl}
                            className="transition hover:text-qd-teal-2 dark:hover:text-qd-teal"
                        >
                            {title}
                        </a>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-qd-text-high">
                        {summary}
                    </p>

                    {project.executorName &&
                        project.executorName !== project.partnerName && (
                            <p className="mt-3 text-xs text-qd-text-medium">
                                {t('projectsPage.card.executorBy')}:{' '}
                                <span className="font-semibold text-qd-text-high">
                                    {project.executorName}
                                </span>
                            </p>
                        )}

                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-qd-mist pt-4 dark:border-qd-white/10">
                        <span className="flex items-center gap-2 text-xs text-qd-text-medium">
                            {project.year && (
                                <span className="inline-flex items-center gap-1">
                                    <CalendarDays aria-hidden="true" size={13} />
                                    {project.year}
                                </span>
                            )}
                            {project.year && <span aria-hidden="true">·</span>}
                            <span>{partnerLabel}</span>
                        </span>
                        <a
                            href={cardUrl}
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-qd-teal-2 transition hover:text-qd-teal dark:text-qd-teal"
                        >
                            {detailUrl
                                ? t('projectsPage.card.viewProject')
                                : t('projectsPage.card.consultSimilar')}
                            <ArrowUpRight
                                aria-hidden="true"
                                size={15}
                                className="transition-transform group-hover:translate-x-0.5"
                            />
                        </a>
                    </div>
                </div>
            </article>
        );
    }
}

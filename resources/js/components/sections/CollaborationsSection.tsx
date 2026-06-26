import { ArrowRight, CalendarDays, Layers, Send } from 'lucide-react';
import { useMemo } from 'react';

import { useInView } from '@/hooks/use-in-view';
import { useLanguage } from '@/hooks/use-language';
import type { Locale } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

// Texto bilingüe definido localmente para no acoplar este componente a una
// página de Inertia (importar desde `pages/**` rompe el chunking del manifest).
type LocalizedText = {
    readonly es?: string | null;
    readonly en?: string | null;
};

const localizedText = (value: LocalizedText, locale: Locale): string =>
    value[locale] ?? value.es ?? value.en ?? '';

type DevelopmentMode = 'solo' | 'cooperative';

type CollaborationPartner = {
    readonly name: string;
    readonly logo: string | null;
    readonly logoDark?: string | null;
    readonly logoAlt?: string | null;
};

export type CollaborationItem = {
    readonly id: number;
    readonly title: LocalizedText;
    readonly slug: string | null;
    readonly detailUrl: string | null;
    readonly clientName: string | null;
    readonly clientLogo: string | null;
    readonly clientLogoDark?: string | null;
    readonly clientLogoAlt?: string | null;
    readonly year: number | null;
    readonly developmentMode: DevelopmentMode;
    readonly services: readonly LocalizedText[];
    readonly partners: readonly CollaborationPartner[];
};

type CollaborationsSectionProps = {
    readonly items?: readonly CollaborationItem[];
};

const ABACO_LOGO_LIGHT =
    '/assets/branding/marca/logos/abacoqd-lockup-mono-ink.svg';
const ABACO_LOGO_DARK =
    '/assets/branding/marca/logos/abacoqd-lockup-mono-white.svg';

const isReadyItem = (item: CollaborationItem): boolean =>
    !!(item.title && (item.detailUrl || item.slug));

export default function CollaborationsSection({
    items,
}: CollaborationsSectionProps) {
    const { t, locale } = useLanguage();
    const projects = useMemo(
        () => (items ?? []).filter(isReadyItem),
        [items],
    );
    const hasProjects = projects.length > 0;
    const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.12 });

    return (
        <section id="colaboraciones" className="abaco-section">
            <div className="abaco-section__inner">
                <div className="qd-collab__inner">
                    <div
                        ref={ref}
                        className={cn(
                            'qd-collab__copy abaco-reveal',
                            inView && 'is-visible',
                        )}
                    >
                        <p className="abaco-section-eyebrow">
                            {t('home.collaborations.eyebrow')}
                        </p>
                        <h2 className="abaco-section-title">
                            {t('home.collaborations.title')}
                        </h2>
                        <p className="abaco-section-lead">
                            {t('home.collaborations.lead')}
                        </p>
                        <a href="/proyectos" className="qd-collab__text-cta">
                            {t('home.collaborations.cta')}
                            <ArrowRight aria-hidden="true" size={17} />
                        </a>
                    </div>

                    {hasProjects ? (
                        <div
                            className={cn(
                                'qd-collab-grid abaco-reveal',
                                inView && 'is-visible',
                            )}
                        >
                            {projects.map((project) => (
                                <CollaborationCard
                                    key={project.id}
                                    project={project}
                                    locale={locale}
                                    developmentLabel={
                                        project.developmentMode === 'cooperative'
                                            ? t(
                                                  'projectDetail.development.cooperativeLabel',
                                              )
                                            : t(
                                                  'projectDetail.development.soloLabel',
                                              )
                                    }
                                    viewLabel={t('projectDetail.related.view')}
                                />
                            ))}
                        </div>
                    ) : (
                        <div
                            className={cn(
                                'qd-collab-empty abaco-reveal',
                                inView && 'is-visible',
                            )}
                        >
                            <a
                                href="/proyectos"
                                className="qd-collab-empty__mark"
                                aria-label={t('home.collaborations.cta')}
                            >
                                <img
                                    src={ABACO_LOGO_LIGHT}
                                    alt=""
                                    aria-hidden="true"
                                    className="qd-collab-empty__mark-logo qd-collab-empty__mark-logo--light"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <img
                                    src={ABACO_LOGO_DARK}
                                    alt=""
                                    aria-hidden="true"
                                    className="qd-collab-empty__mark-logo qd-collab-empty__mark-logo--dark"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </a>
                            <h3 className="qd-collab-empty__title">
                                {t('home.collaborations.empty.title')}
                            </h3>
                            <p className="qd-collab-empty__text">
                                {t('home.collaborations.empty.subtitle')}
                            </p>
                            <div className="qd-collab-empty__actions">
                                <a
                                    href="/servicios"
                                    className="qd-collab-empty__cta qd-collab-empty__cta--ghost"
                                >
                                    {t('home.collaborations.empty.services')}
                                    <ArrowRight aria-hidden="true" size={16} />
                                </a>
                                <a
                                    href="/contacto"
                                    className="qd-collab-empty__cta qd-collab-empty__cta--solid"
                                >
                                    {t('home.collaborations.empty.contact')}
                                    <Send aria-hidden="true" size={16} />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function CollaborationCard({
    project,
    locale,
    developmentLabel,
    viewLabel,
}: {
    readonly project: CollaborationItem;
    readonly locale: 'es' | 'en';
    readonly developmentLabel: string;
    readonly viewLabel: string;
}) {
    const title = localizedText(project.title, locale);
    const clientLabel = project.clientName ?? '';
    const serviceNames = project.services.map((service) =>
        localizedText(service, locale),
    );
    const href = project.detailUrl ?? '/proyectos';

    return (
        <article className="qd-collab-card">
            <div className="qd-collab-card__head">
                {project.clientLogo ? (
                    <span className="qd-collab-card__logo">
                        <img
                            src={project.clientLogo}
                            alt={project.clientLogoAlt ?? clientLabel}
                            loading="lazy"
                            className={cn(
                                'qd-collab-card__logo-img',
                                project.clientLogoDark && 'dark:hidden',
                                !project.clientLogoDark &&
                                    'dark:brightness-0 dark:invert',
                            )}
                        />
                        {project.clientLogoDark && (
                            <img
                                src={project.clientLogoDark}
                                alt={project.clientLogoAlt ?? clientLabel}
                                loading="lazy"
                                className="qd-collab-card__logo-img hidden dark:block"
                            />
                        )}
                    </span>
                ) : (
                    <span className="qd-collab-card__logo qd-collab-card__logo--placeholder">
                        <Layers aria-hidden="true" size={18} />
                    </span>
                )}
                {clientLabel && (
                    <span className="qd-collab-card__client">{clientLabel}</span>
                )}
            </div>

            <h3 className="qd-collab-card__title">
                <a href={href}>{title}</a>
            </h3>

            {serviceNames.length > 0 && (
                <div className="qd-collab-card__chips">
                    {serviceNames.slice(0, 3).map((name) => (
                        <span key={name} className="qd-collab-card__chip">
                            {name}
                        </span>
                    ))}
                </div>
            )}

            <div className="qd-collab-card__foot">
                <span className="qd-collab-card__meta">
                    {project.year && (
                        <span className="qd-collab-card__year">
                            <CalendarDays aria-hidden="true" size={13} />
                            {project.year}
                        </span>
                    )}
                    {project.year && <span aria-hidden="true">·</span>}
                    <span>{developmentLabel}</span>
                </span>
                <a href={href} className="qd-collab-card__cta">
                    {viewLabel}
                    <ArrowRight aria-hidden="true" size={15} />
                </a>
            </div>
        </article>
    );
}

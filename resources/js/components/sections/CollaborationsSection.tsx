import { ArrowRight, CalendarDays, Layers, Send } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';

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
// Isotipo a color (paleta turquesa) para el centro de la noria: se ve igual en
// claro y oscuro sobre el pivote blanco.
const ABACO_ISOTIPO_COLOR =
    '/assets/branding/marca/logos/abacoqd-isotipo.svg';

const isReadyItem = (item: CollaborationItem): boolean =>
    !!(item.title && (item.detailUrl || item.slug));

const itemHref = (item: CollaborationItem): string =>
    item.detailUrl ?? (item.slug ? `/proyectos/${item.slug}` : '/proyectos');

// ----------------------------------------------------------------------------
// Noria orbital (desktop). Lógica recuperada de `9e3d695` y adaptada al payload
// actual de proyectos: cada burbuja es un proyecto/caso con su CLIENTE como
// protagonista (logo + nombre). El partner no aparece en la noria; acompaña en
// la lista móvil y en el detalle. Sin datos hardcodeados: todo viene de props.
// ----------------------------------------------------------------------------

const FULL_ROTATION_MS = 56_000;
const ORBIT_RADIUS_PERCENT = 35.5;
const DEFAULT_ORBIT_SIZE = 520;
const INITIAL_ACTIVE_ANGLE = 0;
const DESKTOP_QUERY = '(min-width: 1024px)';

type OrbitItem = {
    readonly key: string;
    readonly clientName: string;
    readonly logoLight: string;
    readonly alt: string;
    readonly href: string;
};

type OrbitState = {
    readonly active: boolean;
    readonly opacity: number;
    readonly scale: number;
    readonly visible: boolean;
    readonly x: number;
    readonly y: number;
    readonly zIndex: number;
};

const normalizeAngle = (angle: number): number => ((angle % 360) + 360) % 360;

const easeInOutSine = (progress: number): number =>
    -(Math.cos(Math.PI * progress) - 1) / 2;

const lerp = (from: number, to: number, progress: number): number =>
    from + (to - from) * progress;

const distanceFromThree = (angle: number): number =>
    Math.min(angle, 360 - angle);

// Arco visible: entra por las 12 (270°), máximo a las 3 (0°), sale por las 6
// (90°). Entre 7 y 11 (90°–270°) la burbuja sigue girando oculta.
const getClockProgress = (angle: number): number | null => {
    if (angle >= 270) {
        return (angle - 270) / 180;
    }

    if (angle <= 90) {
        return (angle + 90) / 180;
    }

    return null;
};

const getOrbitState = (angle: number, radius: number): OrbitState => {
    const normalizedAngle = normalizeAngle(angle);
    const radians = (normalizedAngle * Math.PI) / 180;
    const progress = getClockProgress(normalizedAngle);
    const x = Math.cos(radians) * radius;
    const y = Math.sin(radians) * radius;

    if (progress === null) {
        return {
            active: false,
            opacity: 0,
            scale: 0.74,
            visible: false,
            x,
            y,
            zIndex: 1,
        };
    }

    const isEntering = progress <= 0.5;
    const localProgress = isEntering ? progress / 0.5 : (progress - 0.5) / 0.5;
    const easedProgress = easeInOutSine(localProgress);
    const opacity = isEntering
        ? lerp(0.32, 1, easedProgress)
        : lerp(1, 0, easedProgress);
    const scale = isEntering
        ? lerp(0.82, 1.22, easedProgress)
        : lerp(1.22, 0.76, easedProgress);

    return {
        active: distanceFromThree(normalizedAngle) <= 18,
        opacity,
        scale,
        visible: opacity > 0.08,
        x,
        y,
        zIndex: 10 + Math.round(opacity * 90),
    };
};

const getItemAngle = (
    index: number,
    baseAngle: number,
    itemCount: number,
): number => {
    const step = 360 / Math.max(itemCount, 1);

    return normalizeAngle(INITIAL_ACTIVE_ANGLE + baseAngle + index * step);
};

const getInitialBubbleStyle = (
    index: number,
    itemCount: number,
): CSSProperties => {
    const radius = DEFAULT_ORBIT_SIZE * (ORBIT_RADIUS_PERCENT / 100);
    const state = getOrbitState(getItemAngle(index, 0, itemCount), radius);

    return {
        '--qd-collab-opacity': state.opacity.toFixed(3),
        '--qd-collab-scale': state.scale.toFixed(3),
        '--qd-collab-x': `${state.x.toFixed(2)}px`,
        '--qd-collab-y': `${state.y.toFixed(2)}px`,
        '--qd-collab-z': String(state.zIndex),
    } as CSSProperties;
};

const applyBubbleState = (
    element: HTMLAnchorElement,
    state: OrbitState,
): void => {
    element.style.setProperty('--qd-collab-opacity', state.opacity.toFixed(3));
    element.style.setProperty('--qd-collab-scale', state.scale.toFixed(3));
    element.style.setProperty('--qd-collab-x', `${state.x.toFixed(2)}px`);
    element.style.setProperty('--qd-collab-y', `${state.y.toFixed(2)}px`);
    element.style.setProperty('--qd-collab-z', String(state.zIndex));

    if (element.classList.contains('is-active') !== state.active) {
        element.classList.toggle('is-active', state.active);
    }

    if (element.classList.contains('is-visible') !== state.visible) {
        element.classList.toggle('is-visible', state.visible);
        element.tabIndex = state.visible ? 0 : -1;
        element.setAttribute('aria-hidden', state.visible ? 'false' : 'true');
    }
};

const isMotionPaused = (mediaQuery: MediaQueryList): boolean => {
    const root = document.documentElement;

    return (
        mediaQuery.matches ||
        root.dataset.reduceMotion === 'true' ||
        root.classList.contains('a11y-reduce-motion') ||
        root.classList.contains('reduce-motion')
    );
};

const toOrbitItem = (
    item: CollaborationItem,
    locale: Locale,
): OrbitItem | null => {
    // La noria es logo-céntrica: si el cliente no tiene logo, el item no entra
    // en la órbita (rompería la estética). Sí aparece en la lista móvil con una
    // marca textual sobria.
    if (!item.clientLogo) {
        return null;
    }

    const clientName = item.clientName ?? localizedText(item.title, locale);

    return {
        key: String(item.id),
        clientName,
        logoLight: item.clientLogo,
        alt: item.clientLogoAlt ?? clientName,
        href: itemHref(item),
    };
};

export default function CollaborationsSection({
    items,
}: CollaborationsSectionProps) {
    const { t, locale } = useLanguage();
    const projects = useMemo(
        () => (items ?? []).filter(isReadyItem),
        [items],
    );
    const orbitItems = useMemo(
        () =>
            projects
                .map((project) => toOrbitItem(project, locale))
                .filter((item): item is OrbitItem => item !== null),
        [projects, locale],
    );
    const hasProjects = projects.length > 0;
    const hasOrbit = orbitItems.length > 0;
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
                                'qd-collab__visual abaco-reveal',
                                inView && 'is-visible',
                            )}
                        >
                            {hasOrbit && (
                                <DesktopCollaborationsOrbit
                                    items={orbitItems}
                                    viewLabel={t('projectDetail.related.view')}
                                    visualAria={t(
                                        'home.collaborations.visualAria',
                                    )}
                                    pivotLabel={t('home.collaborations.cta')}
                                />
                            )}
                            <MobileCollaborationsList
                                projects={projects}
                                locale={locale}
                                viewLabel={t('projectDetail.related.view')}
                                withPartnerLabel={t('home.collaborations.with')}
                                showOnDesktop={!hasOrbit}
                            />
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

function DesktopCollaborationsOrbit({
    items,
    viewLabel,
    visualAria,
    pivotLabel,
}: {
    readonly items: readonly OrbitItem[];
    readonly viewLabel: string;
    readonly visualAria: string;
    readonly pivotLabel: string;
}) {
    const orbitRef = useRef<HTMLDivElement>(null);
    const bubbleRefs = useRef<Array<HTMLAnchorElement | null>>([]);
    const itemCount = items.length;

    useEffect(() => {
        const orbit = orbitRef.current;
        const bubbles = bubbleRefs.current.filter(
            (bubble): bubble is HTMLAnchorElement => bubble !== null,
        );

        if (!orbit || bubbles.length === 0) {
            return;
        }

        const motionQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );
        const desktopQuery = window.matchMedia(DESKTOP_QUERY);
        let frame = 0;
        let radius = 0;
        let startTime = 0;
        let pausedAt = 0;

        const updateRadius = () => {
            radius =
                Math.min(orbit.clientWidth, orbit.clientHeight) *
                (ORBIT_RADIUS_PERCENT / 100);
        };

        const applyFrame = (baseAngle: number) => {
            bubbles.forEach((bubble, index) => {
                applyBubbleState(
                    bubble,
                    getOrbitState(
                        getItemAngle(index, baseAngle, itemCount),
                        radius,
                    ),
                );
            });
        };

        const stop = () => {
            if (frame !== 0) {
                window.cancelAnimationFrame(frame);
                frame = 0;
            }
        };

        const tick = (time: number) => {
            if (isMotionPaused(motionQuery)) {
                orbit.dataset.motion = 'reduced';
                applyFrame(0);
                stop();

                return;
            }

            const interactionPaused =
                orbit.matches(':hover') ||
                orbit.contains(document.activeElement);

            if (interactionPaused) {
                pausedAt ||= time;
                frame = window.requestAnimationFrame(tick);

                return;
            }

            if (pausedAt !== 0) {
                startTime += time - pausedAt;
                pausedAt = 0;
            }

            startTime ||= time;
            orbit.dataset.motion = 'animated';
            applyFrame(((time - startTime) / FULL_ROTATION_MS) * 360);
            frame = window.requestAnimationFrame(tick);
        };

        const start = () => {
            stop();
            updateRadius();
            startTime = 0;
            pausedAt = 0;

            // Solo animamos en desktop (la noria está oculta por CSS por debajo
            // de `lg`). Con reduced-motion mostramos un fotograma estático.
            if (!desktopQuery.matches || isMotionPaused(motionQuery)) {
                orbit.dataset.motion = 'reduced';
                applyFrame(0);

                return;
            }

            frame = window.requestAnimationFrame(tick);
        };

        start();

        motionQuery.addEventListener('change', start);
        desktopQuery.addEventListener('change', start);

        const resizeObserver = new ResizeObserver(() => {
            updateRadius();
            applyFrame(0);
        });
        resizeObserver.observe(orbit);

        const htmlObserver = new MutationObserver(start);
        htmlObserver.observe(document.documentElement, {
            attributeFilter: ['class', 'data-reduce-motion'],
            attributes: true,
        });

        return () => {
            stop();
            resizeObserver.disconnect();
            htmlObserver.disconnect();
            motionQuery.removeEventListener('change', start);
            desktopQuery.removeEventListener('change', start);
        };
    }, [itemCount]);

    return (
        <div
            ref={orbitRef}
            className="qd-collab-orbital"
            role="group"
            aria-label={visualAria}
        >
            <span className="qd-collab-orbital__track" aria-hidden="true" />
            <span
                className="qd-collab-orbital__track qd-collab-orbital__track--inner"
                aria-hidden="true"
            />
            <span
                className="qd-collab-orbital__active-line"
                aria-hidden="true"
            />
            <a
                href="/proyectos"
                className="qd-collab-orbital__pivot"
                aria-label={pivotLabel}
            >
                <img
                    src={ABACO_ISOTIPO_COLOR}
                    alt=""
                    aria-hidden="true"
                    className="qd-collab-orbital__pivot-logo"
                    loading="lazy"
                    decoding="async"
                />
            </a>
            {items.map((item, index) => {
                const initialState = getOrbitState(
                    getItemAngle(index, 0, itemCount),
                    DEFAULT_ORBIT_SIZE * (ORBIT_RADIUS_PERCENT / 100),
                );

                return (
                    <a
                        key={item.key}
                        href={item.href}
                        ref={(node) => {
                            bubbleRefs.current[index] = node;
                        }}
                        className={cn(
                            'qd-collab-logo-bubble',
                            initialState.active && 'is-active',
                            initialState.visible && 'is-visible',
                        )}
                        aria-label={`${viewLabel}: ${item.clientName}`}
                        aria-hidden={!initialState.visible}
                        style={getInitialBubbleStyle(index, itemCount)}
                        tabIndex={initialState.visible ? 0 : -1}
                    >
                        {/* Logo de cliente a color sobre burbuja blanca: se ve
                            igual en claro y oscuro (sin variante monocroma). */}
                        <img
                            src={item.logoLight}
                            alt={item.alt}
                            loading="lazy"
                            decoding="async"
                            className="qd-collab-logo-img"
                        />
                    </a>
                );
            })}
        </div>
    );
}

function MobileCollaborationsList({
    projects,
    locale,
    viewLabel,
    withPartnerLabel,
    showOnDesktop,
}: {
    readonly projects: readonly CollaborationItem[];
    readonly locale: Locale;
    readonly viewLabel: string;
    readonly withPartnerLabel: string;
    readonly showOnDesktop: boolean;
}) {
    const scrollerRef = useRef<HTMLUListElement>(null);

    // Carrusel automático: avanza una card cada pocos segundos y reinicia al
    // final. Se pausa al interactuar (touch/hover/teclado) y respeta
    // reduced-motion. Solo en móvil (la lista está oculta en desktop).
    useEffect(() => {
        const scroller = scrollerRef.current;

        if (!scroller || showOnDesktop) {
            return;
        }

        const motionQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );
        const mobileQuery = window.matchMedia('(max-width: 1023.98px)');
        let paused = false;

        const advance = () => {
            if (paused || isMotionPaused(motionQuery) || !mobileQuery.matches) {
                return;
            }

            const first = scroller.firstElementChild as HTMLElement | null;

            if (!first) {
                return;
            }

            const gap = parseFloat(getComputedStyle(scroller).columnGap) || 16;
            const delta = first.offsetWidth + gap;
            const maxScroll = scroller.scrollWidth - scroller.clientWidth;

            if (scroller.scrollLeft >= maxScroll - 4) {
                scroller.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                scroller.scrollBy({ left: delta, behavior: 'smooth' });
            }
        };

        const timer = window.setInterval(advance, 3200);
        const pause = (): void => {
            paused = true;
        };
        const resume = (): void => {
            paused = false;
        };

        scroller.addEventListener('pointerdown', pause);
        scroller.addEventListener('pointerup', resume);
        scroller.addEventListener('mouseenter', pause);
        scroller.addEventListener('mouseleave', resume);
        scroller.addEventListener('focusin', pause);
        scroller.addEventListener('focusout', resume);

        return () => {
            window.clearInterval(timer);
            scroller.removeEventListener('pointerdown', pause);
            scroller.removeEventListener('pointerup', resume);
            scroller.removeEventListener('mouseenter', pause);
            scroller.removeEventListener('mouseleave', resume);
            scroller.removeEventListener('focusin', pause);
            scroller.removeEventListener('focusout', resume);
        };
    }, [projects.length, showOnDesktop]);

    return (
        <ul
            ref={scrollerRef}
            className={cn(
                'qd-collab-mobile',
                showOnDesktop && 'qd-collab-mobile--always',
            )}
        >
            {projects.map((project) => (
                <li key={project.id} className="qd-collab-mobile__item">
                    <MobileCollaborationCard
                        project={project}
                        locale={locale}
                        viewLabel={viewLabel}
                        withPartnerLabel={withPartnerLabel}
                    />
                </li>
            ))}
        </ul>
    );
}

function MobileCollaborationCard({
    project,
    locale,
    viewLabel,
    withPartnerLabel,
}: {
    readonly project: CollaborationItem;
    readonly locale: Locale;
    readonly viewLabel: string;
    readonly withPartnerLabel: string;
}) {
    const title = localizedText(project.title, locale);
    const clientLabel = project.clientName ?? '';
    const serviceNames = project.services.map((service) =>
        localizedText(service, locale),
    );
    const href = itemHref(project);
    const partner = project.partners[0] ?? null;

    return (
        <article className="qd-collab-card">
            <div className="qd-collab-card__head">
                {project.clientLogo ? (
                    <span className="qd-collab-card__logo">
                        <img
                            src={project.clientLogo}
                            alt={project.clientLogoAlt ?? clientLabel}
                            loading="lazy"
                            decoding="async"
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
                                decoding="async"
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
                    <span className="qd-collab-card__client">
                        {clientLabel}
                    </span>
                )}
            </div>

            <h3 className="qd-collab-card__title">
                <a href={href}>{title}</a>
            </h3>

            {serviceNames.length > 0 && (
                <div className="qd-collab-card__chips">
                    {serviceNames.slice(0, 2).map((name) => (
                        <span key={name} className="qd-collab-card__chip">
                            {name}
                        </span>
                    ))}
                </div>
            )}

            {partner && (
                <p className="qd-collab-card__partner">
                    {withPartnerLabel} <span>{partner.name}</span>
                </p>
            )}

            <div className="qd-collab-card__foot">
                <span className="qd-collab-card__meta">
                    {project.year && (
                        <span className="qd-collab-card__year">
                            <CalendarDays aria-hidden="true" size={13} />
                            {project.year}
                        </span>
                    )}
                </span>
                <a href={href} className="qd-collab-card__cta">
                    {viewLabel}
                    <ArrowRight aria-hidden="true" size={15} />
                </a>
            </div>
        </article>
    );
}

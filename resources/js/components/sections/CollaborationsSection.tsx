import { ArrowRight, Send } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

import type { CSSProperties } from 'react';
import { useInView } from '@/hooks/use-in-view';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

export type CollaborationItem = {
    readonly slug: string;
    readonly name: string;
    readonly logoLight: string | null;
    readonly logoDark?: string | null;
    readonly logoAlt?: string | null;
    readonly href?: string | null;
    readonly isHistorical?: boolean;
    readonly isApproved?: boolean;
};

type CollaborationsSectionProps = {
    readonly items?: readonly CollaborationItem[];
};

type OrbitLogo = {
    readonly slug: string;
    readonly name: string;
    readonly logoLight: string;
    readonly logoDark?: string | null;
    readonly alt: string;
    readonly href: string;
    readonly isHistorical: boolean;
    readonly isApproved: boolean;
};

const FULL_ROTATION_MS = 56_000;
const ORBIT_RADIUS_PERCENT = 35.5;
const DEFAULT_ORBIT_SIZE = 520;
const INITIAL_ACTIVE_ANGLE = 0;

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

const getLogoAngle = (
    index: number,
    baseAngle: number,
    logoCount: number,
): number => {
    const step = 360 / Math.max(logoCount, 1);

    return normalizeAngle(INITIAL_ACTIVE_ANGLE + baseAngle + index * step);
};

const getInitialBubbleStyle = (
    index: number,
    logoCount: number,
): CSSProperties => {
    const radius = DEFAULT_ORBIT_SIZE * (ORBIT_RADIUS_PERCENT / 100);
    const state = getOrbitState(getLogoAngle(index, 0, logoCount), radius);

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

const isReadyCollaborationItem = (
    item: CollaborationItem,
): item is CollaborationItem & { readonly logoLight: string } =>
    item.slug.length > 0 &&
    item.name.length > 0 &&
    typeof item.logoLight === 'string' &&
    item.logoLight.length > 0;

const toOrbitLogo = (
    item: CollaborationItem & { readonly logoLight: string },
): OrbitLogo => ({
    slug: item.slug,
    name: item.name,
    logoLight: item.logoLight,
    logoDark: item.logoDark,
    alt: item.logoAlt ?? `Logotipo de ${item.name}`,
    href: item.href ?? `/proyectos#${item.slug}`,
    isHistorical: item.isHistorical ?? false,
    isApproved: item.isApproved ?? false,
});

/**
 * La sección Colaboraciones se alimenta SOLO de datos reales desde BD
 * (`partners`/`projects` vía props). No hay fallback estático de marcas: si no
 * hay registros publicables, la sección muestra un estado vacío honesto, sin
 * mostrar logos de terceros.
 */
const resolveOrbitLogos = (
    items: readonly CollaborationItem[] | undefined,
): readonly OrbitLogo[] =>
    (items ?? []).filter(isReadyCollaborationItem).map(toOrbitLogo);

export default function CollaborationsSection({
    items,
}: CollaborationsSectionProps) {
    const { t } = useLanguage();
    const orbitLogos = useMemo(() => resolveOrbitLogos(items), [items]);
    const hasLogos = orbitLogos.length > 0;
    const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.12 });
    const orbitRef = useRef<HTMLDivElement>(null);
    const bubbleRefs = useRef<Array<HTMLAnchorElement | null>>([]);

    useEffect(() => {
        const orbit = orbitRef.current;
        const bubbles = bubbleRefs.current.filter(
            (bubble): bubble is HTMLAnchorElement => bubble !== null,
        );

        if (!orbit || bubbles.length === 0) {
            return;
        }

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
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
                        getLogoAngle(index, baseAngle, orbitLogos.length),
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
            if (isMotionPaused(mediaQuery)) {
                orbit.dataset.motion = 'reduced';
                applyFrame(0);
                stop();

                return;
            }

            const interactionPaused =
                orbit.matches(':hover') || orbit.contains(document.activeElement);

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

            if (isMotionPaused(mediaQuery)) {
                orbit.dataset.motion = 'reduced';
                applyFrame(0);

                return;
            }

            frame = window.requestAnimationFrame(tick);
        };

        start();

        mediaQuery.addEventListener('change', start);

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
            mediaQuery.removeEventListener('change', start);
        };
    }, [orbitLogos.length]);

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

                    {!hasLogos ? (
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
                                    src="/assets/branding/marca/logos/abacoqd-lockup-mono-ink.svg"
                                    alt=""
                                    aria-hidden="true"
                                    className="qd-collab-empty__mark-logo qd-collab-empty__mark-logo--light"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <img
                                    src="/assets/branding/marca/logos/abacoqd-lockup-mono-white.svg"
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
                    ) : (
                        <div
                            ref={orbitRef}
                            className={cn(
                                'qd-collab-orbital abaco-reveal',
                                inView && 'is-visible',
                            )}
                            aria-label={t('home.collaborations.visualAria')}
                        >
                        <span
                            className="qd-collab-orbital__track"
                            aria-hidden="true"
                        />
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
                            aria-label={t('home.collaborations.cta')}
                        >
                            <img
                                src="/assets/branding/marca/logos/abacoqd-lockup-mono-ink.svg"
                                alt=""
                                aria-hidden="true"
                                className="qd-collab-orbital__pivot-logo qd-collab-orbital__pivot-logo--light"
                                loading="lazy"
                                decoding="async"
                            />
                            <img
                                src="/assets/branding/marca/logos/abacoqd-lockup-mono-white.svg"
                                alt=""
                                aria-hidden="true"
                                className="qd-collab-orbital__pivot-logo qd-collab-orbital__pivot-logo--dark"
                                loading="lazy"
                                decoding="async"
                            />
                        </a>
                        {orbitLogos.map((logo, index) => {
                            const initialState = getOrbitState(
                                getLogoAngle(index, 0, orbitLogos.length),
                                DEFAULT_ORBIT_SIZE * (ORBIT_RADIUS_PERCENT / 100),
                            );
                            const statusBadges = [
                                logo.isHistorical
                                    ? t('projectsPage.badge.historical')
                                    : null,
                                !logo.isApproved
                                    ? t('projectsPage.badge.pendingValidation')
                                    : null,
                            ].filter((badge): badge is string => badge !== null);

                            return (
                                <a
                                    key={logo.slug}
                                    href={logo.href}
                                    ref={(node) => {
                                        bubbleRefs.current[index] = node;
                                    }}
                                    className={cn(
                                        'qd-collab-logo-bubble',
                                        initialState.active && 'is-active',
                                        initialState.visible && 'is-visible',
                                    )}
                                    aria-label={`${t('home.collaborations.cta')}: ${logo.name}${
                                        statusBadges.length > 0
                                            ? ` (${statusBadges.join(' · ')})`
                                            : ''
                                    }`}
                                    aria-hidden={!initialState.visible}
                                    style={getInitialBubbleStyle(
                                        index,
                                        orbitLogos.length,
                                    )}
                                    tabIndex={initialState.visible ? 0 : -1}
                                >
                                    <img
                                        src={logo.logoLight}
                                        alt={logo.alt}
                                        loading="lazy"
                                        decoding="async"
                                        className={cn(
                                            'qd-collab-logo-img',
                                            logo.logoDark && 'dark:hidden',
                                            !logo.logoDark &&
                                                'qd-collab-logo-img--invert',
                                        )}
                                    />
                                    {logo.logoDark && (
                                        <img
                                            src={logo.logoDark}
                                            alt={logo.alt}
                                            loading="lazy"
                                            decoding="async"
                                            className="qd-collab-logo-img hidden dark:block"
                                        />
                                    )}
                                    {statusBadges.length > 0 && (
                                        <span className="qd-collab-logo-status">
                                            {statusBadges.join(' · ')}
                                        </span>
                                    )}
                                </a>
                            );
                        })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

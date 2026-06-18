import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

type WaveBackgroundProps = {
    readonly hiddenUntilElementId?: string;
};

type WaveLayer = {
    readonly gradient: 'accent' | 'main' | 'soft';
    readonly opacity: number;
    readonly scaleY: number;
    readonly y: number;
};

const PABLO_WAVE_PATH =
    'm0 538.5 8.6-.4h8.6l8.6.3 4.3.3 4.3.4c11.4 1.1 22.8 2.9 34 5.4 22.5 5 44.3 12.4 65.6 21a730.8 730.8 0 0 1 62.3 28.7c20.3 10.3 40.3 21 60.2 31.7l29.8 15.9c9.9 5.2 19.9 10.3 29.9 15.3a727 727 0 0 0 60.7 27.2 360.6 360.6 0 0 0 62.6 18.3c10.6 2 21.2 3.4 31.8 4l8 .3 7.7-.1c2.6-.2 5.1-.2 7.7-.5l3.9-.4 1.9-.2 1.9-.3a177 177 0 0 0 30.8-7.4c10.2-3.3 20.2-7.5 30.1-12.1a448 448 0 0 0 57.5-33.2c37.2-24.9 72.1-53.7 106.7-82.8 34.6-29.1 68.7-59.1 105.7-85.8 9.3-6.6 18.7-13.1 28.5-19.1 9.8-6.1 19.8-11.7 30.3-16.7s21.3-9.4 32.7-12.6c11.4-3.2 23.2-5.3 35.3-5.7 12.1-.3 24.2 1.1 35.8 3.7 11.7 2.6 23 6.4 33.8 11 21.8 9.1 42 20.9 61.2 33.7 9.6 6.4 19 13.1 28.2 20a934 934 0 0 1 27.1 21.1c17.8 14.3 35.1 29 52.4 43.6 34.6 29.2 68.9 58.3 104.9 83.9 9 6.4 18.2 12.5 27.4 18.3 9.3 5.8 18.7 11.2 28.2 16.1 19.1 9.7 39 17.4 59 20.9l3.8.6 3.8.5 7.5.7 3.8.1 3.8.1h5.9l2-.1a243.7 243.7 0 0 0 63-10.6 388 388 0 0 0 31-10.3 706.6 706.6 0 0 0 60.9-26.6c20.1-9.8 40-20.3 60-30.8 20-10.6 40-21.2 60.4-31.4a875.4 875.4 0 0 1 62.3-28.5 430.2 430.2 0 0 1 65.5-20.9c11.2-2.5 22.6-4.3 34-5.5l4.3-.4 4.3-.3 8.6-.4 4.3-.1h4.3c2.9 0 5.7.2 8.6.3v3c-22.5 1.4-44.5 6-65.7 12.8a449 449 0 0 0-61.8 25.5c-40.1 19.7-78.4 43.3-117.4 66.4a1413.4 1413.4 0 0 1-59.3 33.9 675.1 675.1 0 0 1-62.4 29.9c-21.5 8.8-44 16.3-67.5 20.8a250.2 250.2 0 0 1-35.8 4.5l-2.3.1-2.3.1-4.6.1h-4.7l-4.7-.1-9.4-.7-4.6-.6-4.6-.7c-12.3-2-24.2-5.3-35.6-9.4-11.4-4.1-22.4-9-32.9-14.5a454.2 454.2 0 0 1-59.3-37.5c-37.3-27.5-71.2-58-105.1-88-16.9-15-33.8-30-50.8-44.5a845.7 845.7 0 0 0-52.2-41.8c-8.9-6.5-18-12.8-27.3-18.7a297 297 0 0 0-28.5-16.1c-9.7-4.7-19.7-8.8-30-11.8a128 128 0 0 0-31.2-5.2c-21.1-.5-42.6 4.8-62.9 13.4-20.3 8.6-39.7 20-58.2 32.6a590.9 590.9 0 0 0-27.3 19.7l-13.3 10.4-13.1 10.6a1788.2 1788.2 0 0 0-51.4 44.2c-33.9 29.9-67.2 60.8-103.3 89-18.1 14-37 27.3-57.5 38.7a267 267 0 0 1-31.9 15.2 191.4 191.4 0 0 1-34.6 10.1l-2.2.4-2.3.3-4.5.7-9.2 1-4.6.2c-1.5 0-3.1.2-4.6.1l-9-.1c-12-.3-23.9-1.6-35.5-3.7a340 340 0 0 1-67.4-19.9 674.5 674.5 0 0 1-62.6-29.3c-10.1-5.3-20.1-10.9-30-16.5l-14.8-8.5-14.7-8.6c-39.1-22.9-77.5-46.3-117.6-66.1-20-9.8-40.6-18.7-61.8-25.5A278.2 278.2 0 0 0 0 541.5v-3z';

const WAVE_LAYERS: readonly WaveLayer[] = [
    { gradient: 'soft', opacity: 0.14, scaleY: 0.52, y: -362 },
    { gradient: 'main', opacity: 0.18, scaleY: 0.6, y: -222 },
    { gradient: 'accent', opacity: 0.1, scaleY: 0.5, y: -82 },
    { gradient: 'main', opacity: 0.2, scaleY: 0.68, y: 92 },
    { gradient: 'soft', opacity: 0.15, scaleY: 0.56, y: 286 },
    { gradient: 'accent', opacity: 0.09, scaleY: 0.48, y: 452 },
] as const;

const SEAMLESS_COPIES = [-1920, 0, 1920] as const;

const gradientByLayer: Record<WaveLayer['gradient'], string> = {
    accent: 'url(#wave-gradient-accent)',
    main: 'url(#wave-gradient-main)',
    soft: 'url(#wave-gradient-soft)',
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

const readSpeedFactor = (root: HTMLElement): number => {
    const parsed = Number.parseFloat(
        getComputedStyle(root).getPropertyValue('--qd-wave-speed-factor'),
    );

    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0.25;
};

const createLineAnimation = (group: SVGGElement, speedFactor: number) => {
    const paths = gsap.utils.toArray<SVGPathElement>('.path', group);
    const timeline = gsap.timeline();
    const duration = gsap.utils.random(40, 80, 1) / speedFactor;
    const y = gsap.utils.random(-96, 96, 1);
    const rotate = gsap.utils.random(-4, 4, 0.1);
    const scaleXFrom = gsap.utils.random(1.08, 1.2, 0.01);
    const scaleXTo = gsap.utils.random(0.96, 1.06, 0.01);
    const scaleYFrom = gsap.utils.random(1.02, 1.14, 0.01);
    const scaleYTo = gsap.utils.random(0.86, 0.98, 0.01);
    const opacityFrom = gsap.utils.random(0.72, 0.82, 0.01);
    const opacityTo = gsap.utils.random(0.9, 1, 0.01);
    const ease = gsap.utils.random([
        'power2.inOut',
        'power3.inOut',
        'power4.inOut',
        'sine.inOut',
    ]);

    timeline.to(
        paths,
        {
            duration,
            ease: 'none',
            repeat: -1,
            x: -1920,
        },
        0,
    );

    timeline.fromTo(
        group,
        {
            opacity: opacityFrom,
            rotate,
            scaleX: scaleXFrom,
            scaleY: scaleYFrom,
            transformOrigin: '50% 50%',
            y,
        },
        {
            duration: duration * 0.25,
            ease,
            opacity: opacityTo,
            repeat: -1,
            rotate: rotate * -1,
            scaleX: scaleXTo,
            scaleY: scaleYTo,
            transformOrigin: '50% 50%',
            y: y * -1,
            yoyo: true,
            yoyoEase: ease,
        },
        0,
    );

    timeline.seek(gsap.utils.random(10, 20, 1) / speedFactor);
};

export default function WaveBackground({ hiddenUntilElementId }: WaveBackgroundProps) {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;

        if (!root) {
            return;
        }

        let animationContext: gsap.Context | undefined;
        let hiddenFrame = 0;
        let mounted = true;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const hideWhileExcludedElementIsVisible = () => {
            if (!hiddenUntilElementId) {
                root.removeAttribute('data-hidden-for-hero');

                return;
            }

            const excludedElement = document.getElementById(hiddenUntilElementId);
            const shouldHide =
                excludedElement !== null &&
                excludedElement.getBoundingClientRect().bottom > 0;

            root.toggleAttribute('data-hidden-for-hero', shouldHide);
        };

        const requestHiddenStateUpdate = () => {
            if (hiddenFrame !== 0) {
                return;
            }

            hiddenFrame = window.requestAnimationFrame(() => {
                hiddenFrame = 0;
                hideWhileExcludedElementIsVisible();
            });
        };

        const createAnimations = () => {
            animationContext?.revert();
            animationContext = undefined;

            if (!mounted) {
                return;
            }

            root.dataset.motion = isMotionPaused(mediaQuery) ? 'reduced' : 'animated';

            if (root.dataset.motion === 'reduced') {
                root.style.removeProperty('--qd-wave-runtime-opacity');

                return;
            }

            animationContext = gsap.context(() => {
                const speedFactor = readSpeedFactor(root);
                const targetOpacity =
                    getComputedStyle(root).getPropertyValue('--qd-wave-opacity').trim() ||
                    '0.42';

                gsap.fromTo(
                    root,
                    { '--qd-wave-runtime-opacity': '0' },
                    {
                        '--qd-wave-runtime-opacity': targetOpacity,
                        clearProps: '--qd-wave-runtime-opacity',
                        duration: 2.4,
                        ease: 'power2.out',
                    },
                );

                const groups = gsap.utils.toArray<SVGGElement>('.g', root);

                groups.forEach((group) => {
                    const paths = gsap.utils.toArray<SVGPathElement>(
                        '[data-wave-path]',
                        group,
                    );

                    paths.forEach((path) => {
                        const baseOpacity = Number(path.dataset.opacity ?? 0.14);
                        const opacityMin = Math.max(0.06, baseOpacity - 0.07);
                        const opacityMax = Math.min(0.32, baseOpacity + 0.08);

                        gsap.to(path, {
                            duration: gsap.utils.random(60, 112, 1) / speedFactor,
                            ease: 'sine.inOut',
                            opacity: gsap.utils.random(opacityMin, opacityMax, 0.01),
                            repeat: -1,
                            yoyo: true,
                        });
                    });

                    createLineAnimation(group, speedFactor);
                });
            }, root);
        };

        hideWhileExcludedElementIsVisible();
        createAnimations();

        mediaQuery.addEventListener('change', createAnimations);

        const htmlObserver = new MutationObserver(createAnimations);
        htmlObserver.observe(document.documentElement, {
            attributeFilter: ['class', 'data-reduce-motion'],
            attributes: true,
        });

        window.addEventListener('scroll', requestHiddenStateUpdate, { passive: true });
        window.addEventListener('resize', requestHiddenStateUpdate);

        return () => {
            mounted = false;

            if (hiddenFrame !== 0) {
                window.cancelAnimationFrame(hiddenFrame);
            }

            animationContext?.revert();
            htmlObserver.disconnect();
            mediaQuery.removeEventListener('change', createAnimations);
            window.removeEventListener('scroll', requestHiddenStateUpdate);
            window.removeEventListener('resize', requestHiddenStateUpdate);
        };
    }, [hiddenUntilElementId]);

    return (
        <div ref={rootRef} className="qd-wave pointer-events-none" aria-hidden="true">
            <svg
                className="qd-wave__svg"
                focusable="false"
                preserveAspectRatio="none"
                viewBox="0 0 1920 1080"
            >
                <defs>
                    <linearGradient
                        id="wave-gradient-main"
                        x1="0"
                        x2="1920"
                        y1="170.6"
                        y2="909.66"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0%" stopColor="var(--qd-wave-line-from)" />
                        <stop offset="54%" stopColor="var(--qd-wave-line-to)" />
                        <stop offset="100%" stopColor="var(--qd-wave-line-from)" />
                    </linearGradient>
                    <linearGradient
                        id="wave-gradient-soft"
                        x1="1920"
                        x2="0"
                        y1="170.6"
                        y2="909.66"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0%" stopColor="var(--qd-wave-line-soft)" />
                        <stop offset="52%" stopColor="var(--qd-wave-line-from)" />
                        <stop offset="100%" stopColor="var(--qd-wave-line-soft)" />
                    </linearGradient>
                    <linearGradient
                        id="wave-gradient-accent"
                        x1="0"
                        x2="1920"
                        y1="909.66"
                        y2="170.6"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0%" stopColor="var(--qd-wave-line-to)" />
                        <stop offset="72%" stopColor="var(--qd-wave-line-soft)" />
                        <stop offset="100%" stopColor="var(--qd-wave-line-to)" />
                    </linearGradient>
                    <filter
                        id="wave-blur-soft"
                        x="-16%"
                        y="-24%"
                        width="132%"
                        height="148%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feGaussianBlur stdDeviation="18" />
                    </filter>
                </defs>

                <g className="qd-wave__stage">
                    <g className="qd-wave__ambient" filter="url(#wave-blur-soft)">
                        {WAVE_LAYERS.slice(1, 5).map((layer, layerIndex) => (
                            <g
                                key={`ambient-${layerIndex}`}
                                transform={`translate(0 ${layer.y}) scale(1 ${layer.scaleY})`}
                            >
                                {SEAMLESS_COPIES.map((copy) => (
                                    <g
                                        key={`ambient-${layerIndex}-${copy}`}
                                        transform={`translate(${copy} 0)`}
                                    >
                                        <path
                                            className="qd-wave__path qd-wave__path--ambient"
                                            d={PABLO_WAVE_PATH}
                                            fill={gradientByLayer[layer.gradient]}
                                            opacity={layer.opacity}
                                        />
                                    </g>
                                ))}
                            </g>
                        ))}
                    </g>

                    {WAVE_LAYERS.map((layer, layerIndex) => (
                        <g
                            key={layerIndex}
                            className={`g qd-wave__group qd-wave__group--${layerIndex}`}
                        >
                            <g
                                className="qd-wave__shape"
                                transform={`translate(0 ${layer.y}) scale(1 ${layer.scaleY})`}
                            >
                                {SEAMLESS_COPIES.map((copy) => (
                                    <g
                                        key={`${layerIndex}-${copy}`}
                                        transform={`translate(${copy} 0)`}
                                    >
                                        <path
                                            className="path qd-wave__path"
                                            d={PABLO_WAVE_PATH}
                                            data-opacity={layer.opacity}
                                            data-wave-path
                                            fill={gradientByLayer[layer.gradient]}
                                            opacity={layer.opacity}
                                        />
                                    </g>
                                ))}
                            </g>
                        </g>
                    ))}
                </g>
            </svg>
        </div>
    );
}

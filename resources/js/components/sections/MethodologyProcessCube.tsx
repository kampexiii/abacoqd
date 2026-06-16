import {
    ChevronLeft,
    ChevronRight,
    ClipboardCheck,
    Code2,
    Compass,
    PenTool,
    Rocket,
    Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { A11y, Autoplay, EffectCube, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper/types';

import { useLanguage } from '@/hooks/use-language';

import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * Cube-effect carousel de 6 pasos para "Cómo trabajamos" (sección 2 landing).
 * docs/07_VISTAS/PUBLIC_02_METODOLOGIA_PROCESO.md §A.
 *
 * Carrusel con efecto cubo de Swiper (`effect: "cube"`): en reposo solo se ve
 * 1 cara y durante la transición como máximo 2 (la que sale y la que entra),
 * girando como un cubo 3D real. Autoplay lento con pausa en hover/focus,
 * navegación manual anterior/siguiente y dots, todo fuera del área de
 * contenido de la tarjeta. Reduced motion: sin autoplay ni transición.
 */

type ProcessFaceKey =
    | 'analysis'
    | 'study'
    | 'proposal'
    | 'development'
    | 'review'
    | 'delivery';

const FACES: readonly { key: ProcessFaceKey; icon: LucideIcon }[] = [
    { key: 'analysis', icon: Search },
    { key: 'study', icon: PenTool },
    { key: 'proposal', icon: Compass },
    { key: 'development', icon: Code2 },
    { key: 'review', icon: ClipboardCheck },
    { key: 'delivery', icon: Rocket },
] as const;

const AUTOPLAY_DELAY_MS = 4200;
const TRANSITION_SPEED_MS = 900;

function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');

        const handleChange = (event: MediaQueryListEvent) => {
            setReduced(event.matches);
        };

        query.addEventListener('change', handleChange);

        return () => query.removeEventListener('change', handleChange);
    }, []);

    return reduced;
}

// Visuales tecnológicos propios (sin fotografías) por paso: nodos, wireframe,
// checklist, editor de código, validación y despliegue en nube.
function FaceVisual({ face }: { face: ProcessFaceKey }) {
    switch (face) {
        case 'analysis':
            return (
                <svg viewBox="0 0 200 110" aria-hidden="true" className="qd-process-cube__art">
                    <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                    >
                        <path d="M40 70 80 35 130 55 170 30" opacity=".55" />
                        <path d="M40 70 75 90 130 55" opacity=".4" />
                    </g>
                    <g fill="currentColor">
                        <circle cx="40" cy="70" r="6" />
                        <circle cx="80" cy="35" r="5" opacity=".8" />
                        <circle cx="130" cy="55" r="7" />
                        <circle cx="170" cy="30" r="4" opacity=".6" />
                        <circle cx="75" cy="90" r="4" opacity=".6" />
                    </g>
                    <circle
                        cx="130"
                        cy="55"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity=".5"
                    />
                </svg>
            );
        case 'study':
            return (
                <svg viewBox="0 0 200 110" aria-hidden="true" className="qd-process-cube__art">
                    <rect
                        x="28"
                        y="18"
                        width="144"
                        height="74"
                        rx="6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity=".5"
                    />
                    <line x1="28" y1="36" x2="172" y2="36" stroke="currentColor" strokeWidth="2" opacity=".4" />
                    <rect x="40" y="48" width="58" height="10" rx="2" fill="currentColor" opacity=".35" />
                    <rect x="40" y="64" width="86" height="10" rx="2" fill="currentColor" opacity=".25" />
                    <rect x="136" y="48" width="24" height="26" rx="2" fill="currentColor" opacity=".2" />
                    <path
                        d="M150 78 168 60"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity=".7"
                    />
                    <circle cx="168" cy="60" r="3" fill="currentColor" />
                </svg>
            );
        case 'proposal':
            return (
                <svg viewBox="0 0 200 110" aria-hidden="true" className="qd-process-cube__art">
                    {[0, 1, 2, 3].map((row) => (
                        <g key={row} transform={`translate(0 ${18 + row * 21})`}>
                            <rect
                                x="34"
                                y="0"
                                width="14"
                                height="14"
                                rx="3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                opacity={row < 2 ? '.7' : '.35'}
                            />
                            {row < 2 && (
                                <path
                                    d="M37 7 41 11 47 3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            )}
                            <rect
                                x="58"
                                y="3"
                                width={120 - row * 14}
                                height="8"
                                rx="2"
                                fill="currentColor"
                                opacity={row < 2 ? '.3' : '.18'}
                            />
                        </g>
                    ))}
                </svg>
            );
        case 'development':
            return (
                <svg viewBox="0 0 200 110" aria-hidden="true" className="qd-process-cube__art">
                    <rect
                        x="24"
                        y="14"
                        width="152"
                        height="82"
                        rx="8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity=".45"
                    />
                    <line x1="24" y1="32" x2="176" y2="32" stroke="currentColor" strokeWidth="2" opacity=".35" />
                    <circle cx="36" cy="23" r="2.5" fill="currentColor" opacity=".5" />
                    <circle cx="46" cy="23" r="2.5" fill="currentColor" opacity=".4" />
                    <circle cx="56" cy="23" r="2.5" fill="currentColor" opacity=".3" />
                    <path
                        d="M44 48 32 60 44 72"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity=".8"
                    />
                    <path
                        d="M76 48 88 60 76 72"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity=".55"
                    />
                    <rect x="100" y="46" width="64" height="8" rx="2" fill="currentColor" opacity=".25" />
                    <rect x="100" y="62" width="44" height="8" rx="2" fill="currentColor" opacity=".35" />
                    <rect x="100" y="78" width="54" height="8" rx="2" fill="currentColor" opacity=".2" />
                </svg>
            );
        case 'review':
            return (
                <svg viewBox="0 0 200 110" aria-hidden="true" className="qd-process-cube__art">
                    {[0, 1, 2].map((row) => (
                        <g key={row} transform={`translate(0 ${18 + row * 26})`}>
                            <rect
                                x="34"
                                y="0"
                                width="22"
                                height="22"
                                rx="5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                opacity={row === 2 ? '.35' : '.7'}
                            />
                            {row !== 2 ? (
                                <path
                                    d="M39 11 46 18 53 6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ) : (
                                <circle cx="45" cy="11" r="3" fill="currentColor" opacity=".5" />
                            )}
                            <rect
                                x="70"
                                y="6"
                                width="100"
                                height="10"
                                rx="2"
                                fill="currentColor"
                                opacity={row === 2 ? '.18' : '.28'}
                            />
                        </g>
                    ))}
                </svg>
            );
        case 'delivery':
            return (
                <svg viewBox="0 0 200 110" aria-hidden="true" className="qd-process-cube__art">
                    <path
                        d="M58 70a22 22 0 0 1-4-43 28 28 0 0 1 54-10 24 24 0 0 1 32 23 20 20 0 0 1-4 30Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity=".5"
                    />
                    <path
                        d="M100 50v34M88 72l12 14 12-14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity=".85"
                    />
                    <circle cx="148" cy="32" r="4" fill="currentColor" opacity=".6" />
                    <circle cx="160" cy="46" r="3" fill="currentColor" opacity=".4" />
                </svg>
            );
        default:
            return null;
    }
}

export default function MethodologyProcessCube() {
    const { t } = useLanguage();
    const reducedMotion = useReducedMotion();
    const swiperRef = useRef<SwiperClass | null>(null);
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const paginationRef = useRef<HTMLDivElement>(null);

    // Conecta los botones y los dots externos (fuera de la tarjeta, para no
    // tapar el contenido) con la instancia de Swiper.
    const wireControls = useCallback(
        (swiper: SwiperClass) => {
            if (!prevRef.current || !nextRef.current || !paginationRef.current) {
                return;
            }

            swiper.params.navigation = {
                ...(typeof swiper.params.navigation === 'object'
                    ? swiper.params.navigation
                    : {}),
                prevEl: prevRef.current,
                nextEl: nextRef.current,
            };

            swiper.params.pagination = {
                ...(typeof swiper.params.pagination === 'object'
                    ? swiper.params.pagination
                    : {}),
                el: paginationRef.current,
                clickable: true,
                bulletElement: 'button',
                renderBullet: (index, className) => {
                    const face = FACES[index];
                    const label = `${t('home.methodology.stepLabel')} ${index + 1}: ${t(`home.methodology.steps.${face.key}.title`)}`;

                    return `<button type="button" class="${className}" aria-label="${label}"></button>`;
                },
            };

            swiper.navigation.destroy();
            swiper.navigation.init();
            swiper.navigation.update();

            swiper.pagination.destroy();
            swiper.pagination.init();
            swiper.pagination.render();
            swiper.pagination.update();
        },
        [t],
    );

    const handleSwiper = (swiper: SwiperClass) => {
        swiperRef.current = swiper;
        wireControls(swiper);
    };

    // Re-conecta los controles si cambia el idioma (etiquetas de los dots).
    useEffect(() => {
        if (swiperRef.current) {
            wireControls(swiperRef.current);
        }
    }, [wireControls]);

    // `pauseOnMouseEnter` no cubre el foco por teclado: paramos/retomamos el
    // autoplay manualmente cuando el carrusel recibe/pierde el foco.
    const handleFocusCapture = () => {
        swiperRef.current?.autoplay?.stop();
    };

    const handleBlurCapture = () => {
        if (!reducedMotion) {
            swiperRef.current?.autoplay?.start();
        }
    };

    return (
        <div
            className="qd-process-cube"
            role="region"
            aria-roledescription="carrusel"
            aria-label={t('home.methodology.cube.aria')}
            onFocusCapture={handleFocusCapture}
            onBlurCapture={handleBlurCapture}
        >
            <Swiper
                modules={[EffectCube, Autoplay, Navigation, Pagination, A11y]}
                effect="cube"
                grabCursor
                loop
                speed={reducedMotion ? 0 : TRANSITION_SPEED_MS}
                cubeEffect={{
                    shadow: false,
                    slideShadows: !reducedMotion,
                    shadowOffset: 20,
                    shadowScale: 0.94,
                }}
                autoplay={
                    reducedMotion
                        ? false
                        : {
                              delay: AUTOPLAY_DELAY_MS,
                              pauseOnMouseEnter: true,
                              disableOnInteraction: false,
                          }
                }
                a11y={{
                    enabled: true,
                    prevSlideMessage: t('home.methodology.cube.prev'),
                    nextSlideMessage: t('home.methodology.cube.next'),
                }}
                onSwiper={handleSwiper}
                className="qd-process-cube__swiper"
            >
                {FACES.map(({ key, icon: Icon }, index) => {
                    const number = String(index + 1).padStart(2, '0');

                    return (
                        <SwiperSlide key={key} className="qd-process-cube__slide">
                            <article className="qd-process-cube__card">
                                <div className="qd-process-cube__visual">
                                    <FaceVisual face={key} />
                                </div>
                                <div className="qd-process-cube__body">
                                    <div className="qd-process-cube__head">
                                        <span
                                            aria-hidden="true"
                                            className="qd-process-cube__number"
                                        >
                                            {number}
                                        </span>
                                        <span className="qd-process-cube__icon">
                                            <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
                                        </span>
                                    </div>
                                    <h3 className="qd-process-cube__title">
                                        {t(`home.methodology.steps.${key}.title`)}
                                    </h3>
                                    <p className="qd-process-cube__description">
                                        {t(`home.methodology.steps.${key}.description`)}
                                    </p>
                                    <span className="qd-process-cube__deliverable">
                                        {t('home.methodology.deliverableLabel')}:{' '}
                                        {t(`home.methodology.steps.${key}.deliverable`)}
                                    </span>
                                </div>
                            </article>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <div className="qd-process-cube__controls">
                <button
                    ref={prevRef}
                    type="button"
                    className="qd-process-cube__nav qd-process-cube__nav--prev"
                    aria-label={t('home.methodology.cube.prev')}
                >
                    <ChevronLeft aria-hidden="true" size={20} strokeWidth={2} />
                </button>

                <div
                    ref={paginationRef}
                    className="qd-process-cube__dots"
                    aria-label={t('home.methodology.stepsAria')}
                />

                <button
                    ref={nextRef}
                    type="button"
                    className="qd-process-cube__nav qd-process-cube__nav--next"
                    aria-label={t('home.methodology.cube.next')}
                >
                    <ChevronRight aria-hidden="true" size={20} strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}

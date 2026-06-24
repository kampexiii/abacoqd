import {
    ArrowRight,
    BarChart3,
    Bot,
    CheckCircle2,
    ClipboardCheck,
    ClipboardList,
    Code2,
    Compass,
    Eye,
    FileCheck2,
    Gauge,
    PenTool,
    Rocket,
    Search,
    Send,
    Sparkles,
    Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import PublicPageHero from '@/components/public/PublicPageHero';
import SeoHead from '@/components/seo/SeoHead';
import { useInView } from '@/hooks/use-in-view';
import { useLanguage } from '@/hooks/use-language';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import { show as bookingShow } from '@/routes/booking';
import { show as contactShow } from '@/routes/contact';

/**
 * Vista pública Metodología. docs/07_VISTAS/PUBLIC_02_METODOLOGIA_PROCESO.md
 * (sección B — página interna). No rehace la sección de metodología de la
 * landing (statement + cube-effect carousel en `MethodologySection.tsx`,
 * intacta); reutiliza el mismo contenido de los 6 pasos (`home.methodology.*`)
 * en una columna de proceso propia para esta página, sin timeline en zigzag.
 *
 * Los pasos siguen siendo contenido estático (`lang/*.json`), igual que en la
 * landing: `methodology_steps` ya existe en BD con el mismo contenido
 * canónico, pero conectar esta vista al admin es un paso aparte (Fase 4/5)
 * que no rompe este diseño cuando se haga.
 *
 * El paso 02 no publica la palabra "gratuito": la política comercial del
 * estudio inicial sigue pendiente de aprobación (mismo criterio que la
 * landing, que ya usa "Estudio inicial" sin esa palabra).
 */

type StepKey =
    | 'analysis'
    | 'study'
    | 'proposal'
    | 'development'
    | 'review'
    | 'delivery';

const STEPS: readonly {
    key: StepKey;
    icon: LucideIcon;
    highlighted: boolean;
}[] = [
    { key: 'analysis', icon: Search, highlighted: false },
    { key: 'study', icon: PenTool, highlighted: true },
    { key: 'proposal', icon: Compass, highlighted: false },
    { key: 'development', icon: Code2, highlighted: false },
    { key: 'review', icon: ClipboardCheck, highlighted: false },
    { key: 'delivery', icon: Rocket, highlighted: false },
] as const;

const PROCESS_BULLETS: readonly {
    key: 'vision' | 'data' | 'execution' | 'delivery';
    icon: LucideIcon;
}[] = [
    { key: 'vision', icon: Eye },
    { key: 'data', icon: BarChart3 },
    { key: 'execution', icon: Zap },
    { key: 'delivery', icon: CheckCircle2 },
] as const;

const TOOLS: readonly {
    key: 'analysis' | 'ai' | 'delivery';
    icon: LucideIcon;
}[] = [
    { key: 'analysis', icon: Gauge },
    { key: 'ai', icon: Bot },
    { key: 'delivery', icon: FileCheck2 },
] as const;

const BENEFITS: readonly { key: 'time' | 'price' | 'fit'; icon: LucideIcon }[] =
    [
        { key: 'time', icon: Gauge },
        { key: 'price', icon: Sparkles },
        { key: 'fit', icon: FileCheck2 },
    ] as const;

export default function Methodology() {
    const { t } = useLanguage();

    // Una llamada de hook por paso (lista fija de 6): cada tarjeta entra y
    // "rellena" su tramo de línea al 25% de visibilidad. Respeta
    // prefers-reduced-motion (useInView marca todo visible de inicio).
    const step0 = useInView<HTMLLIElement>({ threshold: 0.2 });
    const step1 = useInView<HTMLLIElement>({ threshold: 0.2 });
    const step2 = useInView<HTMLLIElement>({ threshold: 0.2 });
    const step3 = useInView<HTMLLIElement>({ threshold: 0.2 });
    const step4 = useInView<HTMLLIElement>({ threshold: 0.2 });
    const step5 = useInView<HTMLLIElement>({ threshold: 0.2 });
    const stepViews = [step0, step1, step2, step3, step4, step5];

    return (
        <PublicLayout>
            <SeoHead />

            <PublicPageHero
                eyebrow={t('methodologyPage.eyebrow')}
                title={t('methodologyPage.title')}
                subtitle={t('methodologyPage.subtitle')}
                currentLabel={t('methodologyPage.breadcrumbCurrent')}
                taglineTitle={t('methodologyPage.heroTagline.title')}
                taglineSubtitle={t('methodologyPage.heroTagline.subtitle')}
                taglineIcon={Rocket}
            />

            {/* 2. Bloque principal de proceso — columna fija + cards grandes */}
            <section className="bg-qd-bg dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
                    <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-10">
                        {/* Columna izquierda: statement, semi-sticky */}
                        <div className="lg:sticky lg:top-28 lg:self-start">
                            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-qd-teal-2 uppercase dark:text-qd-teal">
                                <ClipboardList aria-hidden="true" size={14} />
                                {t('methodologyPage.process.eyebrow')}
                            </p>

                            <h2 className="mt-5 text-4xl leading-[0.95] font-extrabold tracking-tight sm:text-5xl">
                                <span className="block bg-linear-to-r from-qd-teal to-qd-cyan bg-clip-text text-transparent">
                                    {t('home.methodology.statement.line1')}
                                </span>
                                <span className="block text-qd-ink dark:text-qd-white">
                                    {t('home.methodology.statement.line2')}
                                </span>
                                <span className="block bg-linear-to-r from-qd-teal to-qd-cyan bg-clip-text text-transparent">
                                    {t('home.methodology.statement.line3')}
                                </span>
                            </h2>

                            <p className="mt-6 max-w-md text-base leading-relaxed text-qd-text-high">
                                {t('methodologyPage.process.intro')}
                            </p>

                            <ul className="mt-6 flex flex-col gap-2.5">
                                {PROCESS_BULLETS.map((bullet) => (
                                    <li
                                        key={bullet.key}
                                        className="flex items-center gap-2.5 text-sm text-qd-text-high"
                                    >
                                        <bullet.icon
                                            aria-hidden="true"
                                            size={16}
                                            className="shrink-0 text-qd-teal-2 dark:text-qd-teal"
                                        />
                                        {t(
                                            `methodologyPage.process.bullets.${bullet.key}`,
                                        )}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={bookingShow.url()}
                                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-qd-lime px-5 py-2.5 text-sm font-semibold text-qd-ink transition hover:brightness-95"
                            >
                                {t('methodologyPage.process.cta')}
                                <ArrowRight aria-hidden="true" size={16} />
                            </a>
                        </div>

                        {/* Columna derecha: 6 cards de proceso, compactas, sin zigzag */}
                        <ol
                            aria-label={t('methodologyPage.timelineAria')}
                            className="flex flex-col gap-4"
                        >
                            {STEPS.map((step, index) => {
                                const { ref, inView } = stepViews[index];
                                const number = String(index + 1).padStart(
                                    2,
                                    '0',
                                );
                                const isLast = index === STEPS.length - 1;
                                const description =
                                    step.key === 'study'
                                        ? t('methodologyPage.studyDescription')
                                        : t(
                                              `home.methodology.steps.${step.key}.description`,
                                          );

                                return (
                                    <li
                                        key={step.key}
                                        ref={ref}
                                        className={cn(
                                            'flex items-stretch gap-3 transition-all duration-500 ease-out',
                                            inView
                                                ? 'translate-y-0 opacity-100'
                                                : 'translate-y-3 opacity-0',
                                        )}
                                    >
                                        {/* Número */}
                                        <div className="flex w-9 shrink-0 items-start justify-center pt-4">
                                            <span
                                                className={cn(
                                                    'text-2xl font-extrabold transition-colors duration-500',
                                                    inView
                                                        ? 'text-qd-teal-2 dark:text-qd-teal'
                                                        : 'text-qd-text-medium/50',
                                                )}
                                            >
                                                {number}
                                            </span>
                                        </div>

                                        {/* Punto + línea */}
                                        <div className="flex w-3 shrink-0 flex-col items-center pt-[22px]">
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-500',
                                                    inView
                                                        ? 'bg-qd-teal-2 dark:bg-qd-teal'
                                                        : 'bg-qd-mist dark:bg-white/15',
                                                )}
                                            />
                                            {!isLast && (
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'mt-1 w-px flex-1 transition-colors duration-700',
                                                        inView
                                                            ? 'bg-qd-teal-2/50 dark:bg-qd-teal/40'
                                                            : 'bg-qd-mist dark:bg-white/10',
                                                    )}
                                                />
                                            )}
                                        </div>

                                        {/* Card */}
                                        <div
                                            className={cn(
                                                'flex-1 rounded-xl border bg-qd-white p-4 sm:p-5 dark:bg-qd-white/5',
                                                step.highlighted
                                                    ? 'border-qd-teal-2/60 shadow-[0_0_0_1px_rgba(15,143,149,0.18),0_18px_36px_-26px_rgba(24,183,176,0.5)] dark:border-qd-teal/50'
                                                    : 'border-qd-mist dark:border-qd-white/10',
                                            )}
                                        >
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-qd-teal-2/10 text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal">
                                                        <step.icon
                                                            aria-hidden="true"
                                                            size={18}
                                                            strokeWidth={1.8}
                                                        />
                                                    </span>
                                                    <div>
                                                        <h3 className="text-base font-semibold text-qd-ink dark:text-qd-white">
                                                            {t(
                                                                `home.methodology.steps.${step.key}.title`,
                                                            )}
                                                        </h3>
                                                        <p className="mt-1 max-w-md text-sm leading-snug text-qd-text-high">
                                                            {description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="shrink-0 sm:max-w-[140px] sm:text-right">
                                                    <p className="text-[10px] font-semibold tracking-[0.12em] text-qd-text-medium uppercase">
                                                        {t(
                                                            'home.methodology.deliverableLabel',
                                                        )}
                                                    </p>
                                                    <p className="text-sm font-semibold text-qd-ink dark:text-qd-white">
                                                        {t(
                                                            `home.methodology.steps.${step.key}.deliverable`,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </div>
            </section>

            {/* 3. Herramientas propias aplicadas a tu proyecto */}
            <section className="bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-16 text-qd-white sm:px-8 sm:py-20">
                    <p className="text-sm font-semibold tracking-wide text-qd-lime">
                        {t('methodologyPage.tools.eyebrow')}
                    </p>
                    <h2 className="mt-2 max-w-xl text-2xl font-bold sm:text-3xl">
                        {t('methodologyPage.tools.title')}
                    </h2>

                    <div className="mt-10 grid gap-6 sm:grid-cols-3">
                        {TOOLS.map((tool) => (
                            <div
                                key={tool.key}
                                className="rounded-2xl border border-qd-teal/25 bg-qd-white/5 p-7"
                            >
                                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-qd-teal/15 text-qd-teal">
                                    <tool.icon aria-hidden="true" size={22} />
                                </span>
                                <h3 className="mt-5 text-lg font-semibold">
                                    {t(
                                        `methodologyPage.tools.items.${tool.key}.title`,
                                    )}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-qd-text-medium">
                                    {t(
                                        `methodologyPage.tools.items.${tool.key}.description`,
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. En qué se traduce para ti — fila plana, sin tarjeta */}
            <section className="bg-qd-bg dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center lg:gap-10">
                        <h2 className="text-2xl font-bold text-qd-ink sm:text-3xl dark:text-qd-white">
                            {t('methodologyPage.benefits.title')}
                        </h2>

                        <div className="grid gap-6 sm:grid-cols-3">
                            {BENEFITS.map((benefit) => (
                                <div
                                    key={benefit.key}
                                    className="flex items-start gap-3"
                                >
                                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-qd-teal-2/10 text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal">
                                        <benefit.icon
                                            aria-hidden="true"
                                            size={16}
                                        />
                                    </span>
                                    <div>
                                        <h3 className="font-semibold text-qd-ink dark:text-qd-white">
                                            {t(
                                                `methodologyPage.benefits.items.${benefit.key}.title`,
                                            )}
                                        </h3>
                                        <p className="mt-1 text-sm leading-relaxed text-qd-text-high">
                                            {t(
                                                `methodologyPage.benefits.items.${benefit.key}.description`,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CTA final — cierre de página, directamente sobre la banda oscura */}
            <section className="bg-qd-ink">
                <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
                    <div>
                        <h2 className="text-2xl font-bold text-qd-white sm:text-3xl">
                            {t('methodologyPage.cta.title')}
                        </h2>
                        <p className="mt-2 max-w-md text-sm text-qd-text-medium sm:text-base">
                            {t('methodologyPage.cta.subtitle')}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={bookingShow.url()}
                            className="inline-flex items-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-semibold text-qd-ink transition hover:brightness-95"
                        >
                            {t('methodologyPage.cta.primary')}
                            <Send aria-hidden="true" size={16} />
                        </a>
                        <a
                            href={contactShow.url()}
                            className="inline-flex items-center gap-2 rounded-xl border border-qd-white/20 px-5 py-3 text-sm font-semibold text-qd-white transition hover:border-qd-teal hover:text-qd-teal"
                        >
                            {t('methodologyPage.cta.secondary')}
                            <ArrowRight aria-hidden="true" size={16} />
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    Bot,
    ChevronRight,
    ClipboardCheck,
    Code2,
    Compass,
    FileCheck2,
    Gauge,
    PenTool,
    Rocket,
    Search,
    Send,
    Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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

const STEPS: readonly { key: StepKey; icon: LucideIcon; highlighted: boolean }[] = [
    { key: 'analysis', icon: Search, highlighted: false },
    { key: 'study', icon: PenTool, highlighted: true },
    { key: 'proposal', icon: Compass, highlighted: false },
    { key: 'development', icon: Code2, highlighted: false },
    { key: 'review', icon: ClipboardCheck, highlighted: false },
    { key: 'delivery', icon: Rocket, highlighted: false },
] as const;

const TOOLS: readonly { key: 'analysis' | 'ai' | 'delivery'; icon: LucideIcon }[] = [
    { key: 'analysis', icon: Gauge },
    { key: 'ai', icon: Bot },
    { key: 'delivery', icon: FileCheck2 },
] as const;

const BENEFITS: readonly { key: 'time' | 'price' | 'fit'; icon: LucideIcon }[] = [
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
            <Head title="Metodología de trabajo | Abaco Developments" />

            {/* 1. Hero compacto — banda oscura puntual, máxima presencia */}
            <section className="relative overflow-hidden bg-qd-ink">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-60 sm:w-1/2"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(115deg, rgba(24,183,176,0.22) 0px, rgba(24,183,176,0.22) 1.5px, transparent 1.5px, transparent 28px)',
                        maskImage: 'linear-gradient(to left, black, transparent)',
                    }}
                />
                <div className="relative mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
                    <nav aria-label="Breadcrumb" className="mb-6">
                        <ol className="flex items-center gap-1.5 text-xs text-white/50">
                            <li>
                                <a href="/" className="hover:text-qd-teal">
                                    {t('methodologyPage.breadcrumbHome')}
                                </a>
                            </li>
                            <li aria-hidden="true">
                                <ChevronRight size={12} />
                            </li>
                            <li aria-current="page" className="font-medium text-white">
                                {t('methodologyPage.breadcrumbCurrent')}
                            </li>
                        </ol>
                    </nav>

                    <p className="text-sm font-semibold tracking-wide text-qd-teal">
                        {t('methodologyPage.eyebrow')}
                    </p>
                    <h1 className="mt-3 max-w-2xl text-4xl font-bold text-white sm:text-5xl">
                        {t('methodologyPage.title')}
                    </h1>
                    <p className="mt-4 max-w-xl text-base text-white/70 sm:text-lg">
                        {t('methodologyPage.subtitle')}
                    </p>
                </div>
            </section>

            {/* 2. Bloque principal de proceso — columna fija + cards grandes */}
            <section className="bg-qd-bg dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
                    <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-10">
                        {/* Columna izquierda: statement, semi-sticky */}
                        <div className="lg:sticky lg:top-28 lg:self-start">
                            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-qd-teal-2 uppercase dark:text-qd-teal">
                                <span
                                    aria-hidden="true"
                                    className="inline-block h-[7px] w-[7px] rounded-full bg-qd-teal"
                                />
                                {t('home.methodology.eyebrow')}
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

                            <a
                                href={bookingShow.url()}
                                className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-qd-teal-2 transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:text-qd-teal dark:focus-visible:outline-qd-lime"
                            >
                                {t('methodologyPage.process.cta')}
                                <ArrowRight
                                    aria-hidden="true"
                                    size={16}
                                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                                />
                            </a>
                        </div>

                        {/* Columna derecha: 6 cards de proceso, sin zigzag */}
                        <ol aria-label={t('methodologyPage.timelineAria')} className="flex flex-col gap-6">
                            {STEPS.map((step, index) => {
                                const { ref, inView } = stepViews[index];
                                const number = String(index + 1).padStart(2, '0');
                                const isLast = index === STEPS.length - 1;
                                const description = step.key === 'study'
                                    ? t('methodologyPage.studyDescription')
                                    : t(`home.methodology.steps.${step.key}.description`);

                                return (
                                    <li
                                        key={step.key}
                                        ref={ref}
                                        className={cn(
                                            'flex gap-4 transition-all duration-500 ease-out sm:gap-5',
                                            inView
                                                ? 'translate-y-0 opacity-100'
                                                : 'translate-y-3 opacity-0',
                                        )}
                                    >
                                        {/* Número + línea */}
                                        <div className="flex w-12 shrink-0 flex-col items-center">
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold transition-colors duration-500',
                                                    inView
                                                        ? 'border-qd-teal-2 bg-qd-teal-2 text-white dark:border-qd-teal dark:bg-qd-teal dark:text-qd-ink'
                                                        : 'border-qd-mist bg-qd-white text-qd-text-medium dark:border-white/15 dark:bg-transparent',
                                                )}
                                            >
                                                {number}
                                            </span>
                                            {!isLast && (
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'mt-1 w-px flex-1 transition-colors duration-700',
                                                        inView
                                                            ? 'bg-gradient-to-b from-qd-teal-2 to-qd-lime'
                                                            : 'bg-qd-mist dark:bg-white/10',
                                                    )}
                                                />
                                            )}
                                        </div>

                                        {/* Card */}
                                        <div
                                            className={cn(
                                                'flex-1 rounded-2xl border bg-qd-white p-6 sm:p-7 dark:bg-white/[0.03]',
                                                step.highlighted
                                                    ? 'border-qd-teal-2/60 shadow-[0_0_0_1px_rgba(15,143,149,0.18),0_22px_45px_-28px_rgba(24,183,176,0.5)] dark:border-qd-teal/50'
                                                    : 'border-qd-mist dark:border-white/10',
                                            )}
                                        >
                                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="flex items-start gap-4">
                                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-qd-teal-2/10 text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal">
                                                        <step.icon aria-hidden="true" size={22} strokeWidth={1.8} />
                                                    </span>
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-qd-ink dark:text-qd-white">
                                                            {t(`home.methodology.steps.${step.key}.title`)}
                                                        </h3>
                                                        <p className="mt-2 max-w-md text-sm leading-relaxed text-qd-text-high">
                                                            {description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="shrink-0 border-t border-qd-mist pt-3 sm:max-w-[150px] sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5 sm:text-right dark:border-white/10">
                                                    <p className="text-[11px] font-semibold tracking-[0.14em] text-qd-text-medium uppercase">
                                                        {t('home.methodology.deliverableLabel')}
                                                    </p>
                                                    <p className="mt-1 text-sm font-semibold text-qd-ink dark:text-qd-white">
                                                        {t(`home.methodology.steps.${step.key}.deliverable`)}
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
                                className="rounded-2xl border border-white/10 bg-white/[0.02] p-7"
                            >
                                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-qd-teal/10 text-qd-teal">
                                    <tool.icon aria-hidden="true" size={22} />
                                </span>
                                <h3 className="mt-5 text-lg font-semibold">
                                    {t(`methodologyPage.tools.items.${tool.key}.title`)}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-qd-text-medium">
                                    {t(`methodologyPage.tools.items.${tool.key}.description`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. En qué se traduce para ti */}
            <section className="bg-qd-bg dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
                    <div className="rounded-3xl border border-qd-mist bg-qd-white p-8 sm:p-10 dark:border-white/10 dark:bg-white/[0.03]">
                        <h2 className="max-w-xl text-2xl font-bold text-qd-ink sm:text-3xl dark:text-qd-white">
                            {t('methodologyPage.benefits.title')}
                        </h2>

                        <div className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
                            {BENEFITS.map((benefit, index) => (
                                <div
                                    key={benefit.key}
                                    className={cn(
                                        'sm:pl-6',
                                        index > 0 &&
                                            'border-t border-qd-mist pt-6 sm:border-t-0 sm:border-l sm:pt-0 dark:border-white/10',
                                    )}
                                >
                                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-qd-teal-2/10 text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal">
                                        <benefit.icon aria-hidden="true" size={20} />
                                    </span>
                                    <h3 className="mt-4 text-lg font-semibold text-qd-ink dark:text-qd-white">
                                        {t(`methodologyPage.benefits.items.${benefit.key}.title`)}
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-qd-text-high">
                                        {t(`methodologyPage.benefits.items.${benefit.key}.description`)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CTA final — cierre de página */}
            <section className="bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
                    <div className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
                        <div>
                            <h2 className="text-2xl font-bold text-white sm:text-3xl">
                                {t('methodologyPage.cta.title')}
                            </h2>
                            <p className="mt-2 max-w-md text-sm text-white/60 sm:text-base">
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
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-qd-teal hover:text-qd-teal"
                            >
                                {t('methodologyPage.cta.secondary')}
                                <ArrowRight aria-hidden="true" size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

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
 * en un timeline propio para esta página.
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
    const step0 = useInView<HTMLLIElement>({ threshold: 0.25 });
    const step1 = useInView<HTMLLIElement>({ threshold: 0.25 });
    const step2 = useInView<HTMLLIElement>({ threshold: 0.25 });
    const step3 = useInView<HTMLLIElement>({ threshold: 0.25 });
    const step4 = useInView<HTMLLIElement>({ threshold: 0.25 });
    const step5 = useInView<HTMLLIElement>({ threshold: 0.25 });
    const stepViews = [step0, step1, step2, step3, step4, step5];

    return (
        <PublicLayout>
            <Head title="Metodología de trabajo | Abaco Developments" />

            {/* 1. Hero compacto */}
            <section className="relative overflow-hidden bg-qd-mist dark:bg-qd-surface">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 sm:block"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(115deg, rgba(24,183,176,0.2) 0px, rgba(24,183,176,0.2) 2px, transparent 2px, transparent 26px)',
                    }}
                />
                <div className="relative mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
                    <nav aria-label="Breadcrumb" className="mb-6">
                        <ol className="flex items-center gap-1.5 text-xs text-qd-text-medium">
                            <li>
                                <a href="/" className="hover:text-qd-teal-2 dark:hover:text-qd-teal">
                                    {t('methodologyPage.breadcrumbHome')}
                                </a>
                            </li>
                            <li aria-hidden="true">
                                <ChevronRight size={12} />
                            </li>
                            <li aria-current="page" className="font-medium text-qd-ink dark:text-qd-white">
                                {t('methodologyPage.breadcrumbCurrent')}
                            </li>
                        </ol>
                    </nav>

                    <p className="text-sm font-semibold tracking-wide text-qd-teal-2 dark:text-qd-teal">
                        {t('methodologyPage.eyebrow')}
                    </p>
                    <h1 className="mt-2 max-w-2xl text-3xl font-bold text-qd-ink sm:text-4xl dark:text-qd-white">
                        {t('methodologyPage.title')}
                    </h1>
                    <p className="mt-3 max-w-xl text-qd-text-high">
                        {t('methodologyPage.subtitle')}
                    </p>
                </div>
            </section>

            {/* 2. Timeline de 6 pasos */}
            <section className="bg-qd-white dark:bg-qd-ink">
                <div className="mx-auto max-w-[860px] px-5 py-16 sm:px-8">
                    <ol
                        aria-label={t('methodologyPage.timelineAria')}
                        className="relative flex flex-col gap-10"
                    >
                        {STEPS.map((step, index) => {
                            const { ref, inView } = stepViews[index];
                            const number = String(index + 1).padStart(2, '0');
                            const isLast = index === STEPS.length - 1;
                            const isEven = index % 2 === 0;

                            return (
                                <li
                                    key={step.key}
                                    ref={ref}
                                    className={cn(
                                        'grid grid-cols-[40px_1fr] gap-4 transition-all duration-500 ease-out lg:grid-cols-[1fr_56px_1fr] lg:gap-6',
                                        inView
                                            ? 'translate-x-0 opacity-100'
                                            : 'translate-x-4 opacity-0',
                                    )}
                                >
                                    {/* Columna número + línea: izquierda en mobile, centro en desktop */}
                                    <div className="order-1 flex flex-col items-center lg:order-2">
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-500',
                                                inView
                                                    ? 'border-qd-teal-2 bg-qd-teal-2 text-white dark:border-qd-teal dark:bg-qd-teal dark:text-qd-ink'
                                                    : 'border-qd-mist text-qd-text-medium dark:border-white/15',
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

                                    {/* Tarjeta del paso */}
                                    <div
                                        className={cn(
                                            'order-2 rounded-2xl border p-5',
                                            isEven
                                                ? 'lg:order-1 lg:text-right'
                                                : 'lg:order-3 lg:text-left',
                                            step.highlighted
                                                ? 'border-qd-teal-2/50 shadow-[0_0_0_1px_rgba(15,143,149,0.15),0_18px_40px_-24px_rgba(24,183,176,0.45)] dark:border-qd-teal/50'
                                                : 'border-qd-mist dark:border-white/10',
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'flex items-center gap-2',
                                                isEven && 'lg:flex-row-reverse',
                                            )}
                                        >
                                            <step.icon
                                                aria-hidden="true"
                                                size={18}
                                                className="text-qd-teal-2 dark:text-qd-teal"
                                            />
                                            <h2 className="text-lg font-semibold text-qd-ink dark:text-qd-white">
                                                {t(`home.methodology.steps.${step.key}.title`)}
                                            </h2>
                                        </div>
                                        <p className="mt-2 text-sm leading-relaxed text-qd-text-high">
                                            {t(`home.methodology.steps.${step.key}.description`)}
                                        </p>
                                        <p
                                            className={cn(
                                                'mt-3 inline-flex items-center gap-1.5 rounded-full bg-qd-mist px-3 py-1 text-xs font-medium text-qd-text-high dark:bg-white/5',
                                                isEven && 'lg:flex-row-reverse',
                                            )}
                                        >
                                            {t('home.methodology.deliverableLabel')}:{' '}
                                            {t(`home.methodology.steps.${step.key}.deliverable`)}
                                        </p>
                                    </div>

                                    {/* Espaciador del otro lado (solo desktop) */}
                                    <div
                                        className={cn(
                                            'hidden lg:block',
                                            isEven ? 'lg:order-3' : 'lg:order-1',
                                        )}
                                    />
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </section>

            {/* 3. Herramientas propias aplicadas a tu proyecto */}
            <section className="bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-16 text-qd-white sm:px-8">
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
                                className="rounded-2xl border border-white/10 p-5"
                            >
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-qd-teal/10 text-qd-teal">
                                    <tool.icon aria-hidden="true" size={20} />
                                </span>
                                <h3 className="mt-4 font-semibold">
                                    {t(`methodologyPage.tools.items.${tool.key}.title`)}
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-qd-text-medium">
                                    {t(`methodologyPage.tools.items.${tool.key}.description`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. En qué se traduce para ti */}
            <section className="bg-qd-white dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8">
                    <h2 className="max-w-xl text-2xl font-bold text-qd-ink sm:text-3xl dark:text-qd-white">
                        {t('methodologyPage.benefits.title')}
                    </h2>

                    <div className="mt-10 grid gap-6 sm:grid-cols-3">
                        {BENEFITS.map((benefit) => (
                            <div key={benefit.key} className="flex items-start gap-3">
                                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-qd-mist text-qd-teal-2 dark:bg-white/5 dark:text-qd-teal">
                                    <benefit.icon aria-hidden="true" size={18} />
                                </span>
                                <p className="text-base leading-relaxed text-qd-text-high">
                                    {t(`methodologyPage.benefits.items.${benefit.key}`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. CTA final */}
            <section className="bg-qd-ink">
                <div className="mx-auto flex max-w-[1240px] flex-col items-start gap-6 px-5 py-16 text-qd-white sm:px-8 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        {t('methodologyPage.cta.title')}
                    </h2>
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
                            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-qd-white transition hover:border-qd-teal hover:text-qd-teal"
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

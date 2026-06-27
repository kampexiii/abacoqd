import { ArrowRight, Send } from 'lucide-react';

import { useInView } from '@/hooks/use-in-view';
import { useLanguage } from '@/hooks/use-language';
import {
    localizedText,
    resolveServiceKey,
    SERVICE_PRESENTATION,
} from '@/lib/service-presentation';
import type { PublicService, ServiceKey } from '@/lib/service-presentation';
import { cn } from '@/lib/utils';
import { show as contactShow } from '@/routes/contact';

// ─── Abstract visual components (decorative, aria-hidden) ────────────────────
// Lenguaje visual propio de esta sección (cajitas/SVG con rgba literal), no
// compartido con `ServiceMockup` de `pages/Public/Services.tsx`: un componente
// de sección del landing no puede importar de `pages/**` sin romper el
// code-splitting de Inertia.

function VisualWeb() {
    return (
        <div className="w-36 rounded-xl border border-[rgba(8,127,140,0.18)] dark:border-[rgba(122,191,191,0.14)] bg-white/80 dark:bg-[rgba(8,27,38,0.8)] overflow-hidden">
            <div className="flex items-center gap-1 px-2 py-1.5 bg-[rgba(8,127,140,0.06)] dark:bg-[rgba(8,127,140,0.1)]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[rgba(8,127,140,0.3)]" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[rgba(8,127,140,0.18)]" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[rgba(8,127,140,0.1)]" />
                <span className="flex-1 ml-1 h-1.5 rounded-sm bg-[rgba(8,127,140,0.08)]" />
            </div>
            <div className="h-1.5 bg-[rgba(8,127,140,0.14)]" />
            <div className="p-2.5 space-y-1.5">
                <span className="block h-2.5 w-[70%] rounded-sm bg-[rgba(8,127,140,0.2)]" />
                <span className="block h-1.5 w-[45%] rounded-sm bg-[rgba(8,127,140,0.1)]" />
                <span className="block h-1.5 w-[60%] rounded-sm bg-[rgba(8,127,140,0.08)]" />
                <span className="block mt-2 h-5 w-[44%] rounded-full bg-[rgba(8,127,140,0.22)]" />
            </div>
        </div>
    );
}

function VisualApps() {
    return (
        <div className="w-36 h-[6.5rem] rounded-xl border border-[rgba(8,127,140,0.18)] dark:border-[rgba(122,191,191,0.14)] bg-white/80 dark:bg-[rgba(8,27,38,0.8)] overflow-hidden flex">
            <div className="w-8 shrink-0 bg-[rgba(8,127,140,0.07)] dark:bg-[rgba(8,127,140,0.12)] p-1.5 space-y-1.5 pt-2">
                <span className="block h-1.5 w-full rounded-sm bg-[rgba(8,127,140,0.35)]" />
                {[1, 2, 3, 4].map((i) => (
                    <span key={i} className="block h-1.5 w-[80%] rounded-sm bg-[rgba(8,127,140,0.12)]" />
                ))}
            </div>
            <div className="flex-1 p-2">
                <div className="flex gap-1 mb-2">
                    {[0.18, 0.12, 0.08].map((op, i) => (
                        <span key={i} className="flex-1 h-5 rounded-md" style={{ background: `rgba(8,127,140,${op})` }} />
                    ))}
                </div>
                <div className="flex items-end gap-0.5 h-9">
                    {[55, 70, 45, 80, 60, 90, 72].map((h, i) => (
                        <span key={i} className="flex-1 rounded-sm bg-[rgba(8,127,140,0.22)]" style={{ height: `${h}%` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function VisualTools() {
    return (
        <div className="w-36 space-y-1.5 rounded-xl border border-[rgba(8,127,140,0.18)] dark:border-[rgba(122,191,191,0.14)] bg-white/80 dark:bg-[rgba(8,27,38,0.8)] p-2.5">
            {[
                { w: '70%', on: true },
                { w: '55%', on: false },
                { w: '82%', on: true },
            ].map(({ w, on }, i) => (
                <div key={i} className="flex items-center justify-between gap-2 rounded-lg bg-[rgba(8,127,140,0.05)] dark:bg-[rgba(8,127,140,0.1)] px-2 py-1.5">
                    <span className="h-1.5 rounded-sm bg-[rgba(8,127,140,0.18)]" style={{ width: w }} />
                    <span
                        className={cn(
                            'inline-flex h-3 w-5.5 shrink-0 items-center rounded-full px-0.5',
                            on
                                ? 'justify-end bg-[rgba(8,127,140,0.4)]'
                                : 'justify-start bg-[rgba(8,127,140,0.14)]',
                        )}
                    >
                        <span className="block h-2 w-2 rounded-full bg-white" />
                    </span>
                </div>
            ))}
        </div>
    );
}

function VisualAI() {
    const nodes = [
        { label: 'Lead', hl: false },
        { label: 'IA', hl: true },
        { label: 'Email', hl: false },
        { label: 'CRM', hl: false },
    ];

    return (
        <div className="flex flex-col items-center gap-0">
            {nodes.map(({ label, hl }, i) => (
                <div key={i} className="flex flex-col items-center">
                    <span
                        className={cn(
                            'inline-flex items-center justify-center w-9 h-9 rounded-full text-[0.6rem] font-extrabold tracking-wide border',
                            hl
                                ? 'bg-[rgba(8,127,140,0.22)] text-[#087f8c] dark:text-[#7abfbf] border-[rgba(8,127,140,0.45)]'
                                : 'bg-[rgba(8,127,140,0.07)] text-[rgba(8,127,140,0.65)] dark:text-[rgba(122,191,191,0.65)] border-[rgba(8,127,140,0.18)]',
                        )}
                    >
                        {label}
                    </span>
                    {i < nodes.length - 1 && (
                        <span className="block w-px h-2.5 bg-[rgba(8,127,140,0.22)]" />
                    )}
                </div>
            ))}
        </div>
    );
}

function VisualCRM() {
    return (
        <div className="w-36 space-y-1.5">
            <div className="flex gap-1.5">
                {[
                    { w: '80%', op: 0.35 },
                    { w: '65%', op: 0.25 },
                ].map(({ w, op }, i) => (
                    <div key={i} className="flex-1 rounded-lg p-1.5 border border-[rgba(8,127,140,0.15)] bg-white/60 dark:bg-[rgba(8,27,38,0.7)] space-y-1">
                        <span className="block h-1 w-[60%] rounded-sm bg-[rgba(8,127,140,0.15)]" />
                        <span className="block h-2 rounded-sm bg-[rgba(8,127,140,0.35)]" style={{ width: w, opacity: op / 0.35 }} />
                    </div>
                ))}
            </div>
            <div className="flex items-end gap-0.5 h-9 rounded-lg border border-[rgba(8,127,140,0.12)] p-1.5 bg-white/40 dark:bg-[rgba(8,27,38,0.4)]">
                {[40, 65, 50, 82, 58, 76].map((h, i) => (
                    <span key={i} className="flex-1 rounded-sm bg-[rgba(8,127,140,0.24)]" style={{ height: `${h}%` }} />
                ))}
            </div>
        </div>
    );
}

function VisualIntegrations() {
    return (
        <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" aria-hidden>
                {['50% 16%', '84% 50%', '50% 84%', '16% 50%'].map((pos, i) => {
                    const [x2, y2] = pos.split(' ');

                    return (
                        <line
                            key={i}
                            x1="50%" y1="50%"
                            x2={x2} y2={y2}
                            stroke="rgba(8,127,140,0.25)"
                            strokeWidth="1"
                            strokeDasharray="3 2"
                        />
                    );
                })}
            </svg>
            <span className="relative z-10 inline-flex items-center justify-center w-11 h-11 rounded-full border border-[rgba(8,127,140,0.42)] bg-[rgba(8,127,140,0.14)] text-[0.6rem] font-extrabold text-[#087f8c] dark:text-[#7abfbf]">
                API
            </span>
            {[
                { top: '0', left: '50%', transform: 'translateX(-50%)' },
                { top: '50%', right: '0', transform: 'translateY(-50%)' },
                { bottom: '0', left: '50%', transform: 'translateX(-50%)' },
                { top: '50%', left: '0', transform: 'translateY(-50%)' },
            ].map((s, i) => (
                <span
                    key={i}
                    className="absolute inline-flex w-7 h-7 items-center justify-center rounded-lg border border-[rgba(8,127,140,0.22)] bg-white/70 dark:bg-[rgba(8,27,38,0.75)]"
                    style={s as React.CSSProperties}
                >
                    <span className="block w-2.5 h-2.5 rounded-sm bg-[rgba(8,127,140,0.2)]" />
                </span>
            ))}
        </div>
    );
}

function VisualMVP() {
    return (
        <div className="w-16 rounded-2xl border-2 border-[rgba(8,127,140,0.32)] bg-white/80 dark:bg-[rgba(8,27,38,0.85)] overflow-hidden">
            <div className="flex justify-center items-center h-2.5 bg-[rgba(8,127,140,0.08)]">
                <span className="w-4 h-1 rounded-full bg-[rgba(8,127,140,0.22)]" />
            </div>
            <div className="p-1.5 space-y-1">
                <span className="block h-8 w-full rounded-md bg-[rgba(8,127,140,0.16)]" />
                <span className="block h-1.5 w-[80%] rounded-sm bg-[rgba(8,127,140,0.14)]" />
                <span className="block h-1.5 w-[58%] rounded-sm bg-[rgba(8,127,140,0.09)]" />
                <span
                    className="inline-block rounded-full bg-[rgba(183,243,74,0.28)] text-[#4d7011] font-bold px-1.5 py-0.5"
                    style={{ fontSize: '0.48rem' }}
                >
                    ✓ Lista
                </span>
                <span className="block h-4 w-full rounded-full bg-[rgba(8,127,140,0.2)] mt-1" />
            </div>
            <div className="flex justify-center py-1.5">
                <span className="block w-6 h-0.5 rounded-full bg-[rgba(8,127,140,0.2)]" />
            </div>
        </div>
    );
}

function VisualEvolution() {
    return (
        <div className="flex items-end gap-3">
            <div className="flex h-16 items-end gap-1">
                {[20, 30, 18, 26].map((h, i) => (
                    <span key={i} className="w-2.5 rounded-t-sm bg-[rgba(8,127,140,0.14)]" style={{ height: h }} />
                ))}
            </div>
            <ArrowRight
                aria-hidden="true"
                size={16}
                className="shrink-0 text-[rgba(8,127,140,0.4)] dark:text-[rgba(122,191,191,0.4)]"
            />
            <div className="flex h-20 items-end gap-1">
                {[30, 46, 58, 74].map((h, i) => (
                    <span key={i} className="w-2.5 rounded-t-sm bg-[rgba(8,127,140,0.32)]" style={{ height: h }} />
                ))}
            </div>
        </div>
    );
}

const VISUALS: Record<ServiceKey, () => React.JSX.Element> = {
    web: VisualWeb,
    apps: VisualApps,
    tools: VisualTools,
    ai: VisualAI,
    crm: VisualCRM,
    integrations: VisualIntegrations,
    mvp: VisualMVP,
    evolution: VisualEvolution,
};

// ─── Component ────────────────────────────────────────────────────────────────

type ServicesSectionProps = {
    readonly services?: readonly PublicService[];
};

const CHIP_INDEXES = [0, 1, 2] as const;

export default function ServicesSection({
    services = [],
}: ServicesSectionProps) {
    const { t, locale } = useLanguage();
    const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
    const hasServices = services.length > 0;
    const visibleServices = services.slice(0, 3);

    return (
        <section id="servicios" className="abaco-section">
            <div className="abaco-section__inner">
                {/* Heading */}
                <div ref={ref} className={cn('abaco-reveal', inView && 'is-visible')}>
                    <p className="abaco-section-eyebrow">{t('home.services.eyebrow')}</p>
                    <h2 className="abaco-section-title">
                        {t('home.services.titlePrefix')}
                        <span style={{ color: 'var(--qd-teal)' }}>
                            {t('home.services.titleHighlight')}
                        </span>
                    </h2>
                    <p className="abaco-section-lead">{t('home.services.lead')}</p>
                </div>

                {hasServices ? (
                    <>
                        {/* Grid */}
                        <div className={cn('qd-srv-grid abaco-stagger', inView && 'is-visible')}>
                            {visibleServices.map((service) => {
                                const serviceKey =
                                    resolveServiceKey(service.slug) ?? 'web';
                                const presentation = SERVICE_PRESENTATION[serviceKey];
                                const Visual = VISUALS[serviceKey];
                                const servicePath = `home.services.items.${serviceKey}`;
                                const chips = CHIP_INDEXES.map((chip) =>
                                    t(`${servicePath}.chips.${chip}`),
                                );
                                const slug =
                                    localizedText(service.slug, locale) ||
                                    presentation.fallbackSlug[locale];
                                const title =
                                    localizedText(service.title, locale) ||
                                    t(`${servicePath}.title`);
                                const summary =
                                    localizedText(service.summary, locale) ||
                                    t(`${servicePath}.description`);
                                const href = service.isDetailEnabled
                                    ? `/servicios/${slug}`
                                    : contactShow.url({ query: { servicio: slug } });
                                const ctaLabel = service.isDetailEnabled
                                    ? t('home.services.cardView')
                                    : t('home.services.cardConsult');

                                return (
                                    <a
                                        key={service.id}
                                        href={href}
                                        className="qd-srv-card"
                                        aria-label={`${ctaLabel}: ${title}`}
                                    >
                                        <div className="qd-srv-card__media">
                                            {service.image ? (
                                                <img
                                                    src={service.image}
                                                    alt=""
                                                    loading="lazy"
                                                    className="qd-srv-card__image"
                                                />
                                            ) : (
                                                <div className="qd-srv-card__fallback" aria-hidden>
                                                    <Visual />
                                                </div>
                                            )}
                                            <span className="qd-srv-card__wash" aria-hidden />

                                            <div className="qd-srv-card__front">
                                                <span className="qd-srv-card__kicker">
                                                    {chips[0]}
                                                </span>
                                                <h3 className="qd-srv-card__title">
                                                    {title}
                                                </h3>
                                                <span className="qd-srv-card__front-cta">
                                                    {ctaLabel}
                                                    <ArrowRight size={15} aria-hidden />
                                                </span>
                                            </div>
                                        </div>

                                        <div className="qd-srv-card__reveal">
                                            <p className="qd-srv-card__desc">
                                                {summary}
                                            </p>
                                            <div className="qd-srv-card__chips">
                                                {chips.map((chip) => (
                                                    <span key={chip} className="qd-srv-chip">
                                                        {chip}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="qd-srv-card__cta">
                                                {ctaLabel}
                                                <ArrowRight size={14} aria-hidden />
                                            </span>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>

                        {/* Bottom CTA */}
                        <div className={cn('qd-srv-bottom abaco-reveal', inView && 'is-visible')}>
                            <div className="qd-srv-bottom__text">
                                <p className="qd-srv-bottom__q">{t('home.services.ctaQuestion')}</p>
                                <p className="qd-srv-bottom__p">{t('home.services.ctaSupport')}</p>
                            </div>
                            <a href="/servicios" className="qd-srv-bottom__btn">
                                {t('home.services.ctaBtn')}
                                <ArrowRight size={15} aria-hidden />
                            </a>
                        </div>
                    </>
                ) : (
                    <div className={cn('qd-srv-empty abaco-reveal', inView && 'is-visible')}>
                        <h3 className="qd-srv-empty__title">
                            {t('home.services.empty.title')}
                        </h3>
                        <p className="qd-srv-empty__text">
                            {t('home.services.empty.subtitle')}
                        </p>
                        <div className="qd-srv-empty__actions">
                            <a
                                href="/servicios"
                                className="qd-srv-empty__cta qd-srv-empty__cta--ghost"
                            >
                                {t('home.services.empty.services')}
                                <ArrowRight aria-hidden="true" size={16} />
                            </a>
                            <a
                                href="/contacto"
                                className="qd-srv-empty__cta qd-srv-empty__cta--solid"
                            >
                                {t('home.services.empty.contact')}
                                <Send aria-hidden="true" size={16} />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

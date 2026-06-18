import { ArrowRight } from 'lucide-react';

import { useInView } from '@/hooks/use-in-view';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

const POSTS = [
    { key: 'ai', visual: 'code', featured: true },
    { key: 'automation', visual: 'workflow', featured: false },
    { key: 'planning', visual: 'planning', featured: false },
] as const;

type BlogVisual = (typeof POSTS)[number]['visual'];

function CodeVisual() {
    return (
        <div className="qd-blog-code-visual" aria-hidden="true">
            <div className="qd-blog-code-bar">
                <span className="qd-blog-code-dot" />
                <span className="qd-blog-code-dot" />
                <span className="qd-blog-code-dot" />
                <span className="qd-blog-code-filename">procesar-lead.ts</span>
            </div>
            <div className="qd-blog-code-stage">
                <pre className="qd-blog-code-pre">
                    <code>
                        <span className="qd-code-kw">const</span> resultado ={' '}
                        <span className="qd-code-fn">clasificar</span>(lead);{'\n'}
                        <span className="qd-code-kw">
                            if
                        </span> (resultado.prioridad) {'{'}
                        {'\n'} crm.<span className="qd-code-fn">actualizar</span>
                        (lead);
                        {'\n'} email.<span className="qd-code-fn">enviar</span>
                        (respuesta);
                        {'\n'}
                        {'}'}
                        {'\n'}
                        <span className="qd-code-cm">
                            // IA supervisada, criterio humano.
                        </span>
                    </code>
                </pre>
                <div className="qd-blog-ai-flow">
                    {['Lead', 'IA', 'CRM', 'Email'].map((step, index) => (
                        <span key={step} className="contents">
                            <span
                                className={cn(
                                    'qd-blog-ai-step',
                                    step === 'IA' && 'is-ai',
                                )}
                            >
                                {step}
                            </span>
                            {index < 3 && <span className="qd-blog-ai-sep">→</span>}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FeaturedInsightVisual() {
    return (
        <div className="qd-blog-featured-insight" aria-hidden="true">
            <div className="qd-blog-featured-cube">
                <span className="qd-blog-featured-cube__face" />
                <span className="qd-blog-featured-cube__face qd-blog-featured-cube__face--back" />
            </div>
            <div className="qd-blog-featured-tags">
                <span>IA supervisada</span>
                <span>Criterio humano</span>
                <span>Entrega rápida</span>
            </div>
        </div>
    );
}

function WorkflowVisual() {
    return (
        <div className="qd-blog-wf-visual" aria-hidden="true">
            {['Pedido', 'Extraer', 'Validar', 'Actualizar'].map(
                (step, index) => (
                    <span key={step} className="contents">
                        <span className="qd-blog-wf-step">{step}</span>
                        {index < 3 && <span className="qd-blog-wf-sep">→</span>}
                    </span>
                ),
            )}
        </div>
    );
}

function PlanningVisual() {
    return (
        <div className="qd-blog-comp-visual" aria-hidden="true">
            <div className="qd-blog-comp-col">
                <span className="qd-blog-comp-label">brief</span>
                <span className="qd-blog-comp-bar" />
                <span className="qd-blog-comp-bar" />
                <span className="qd-blog-comp-bar" />
            </div>
            <div className="qd-blog-comp-col qd-blog-comp-col--custom">
                <span className="qd-blog-comp-label">alcance</span>
                <span className="qd-blog-comp-bar" />
                <span className="qd-blog-comp-bar" />
                <span className="qd-blog-comp-bar" />
            </div>
        </div>
    );
}

function BlogCardVisual({ visual }: { visual: BlogVisual }) {
    if (visual === 'code') {
        return <CodeVisual />;
    }

    if (visual === 'workflow') {
        return <WorkflowVisual />;
    }

    return <PlanningVisual />;
}

export default function BlogSection() {
    const { t } = useLanguage();
    const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.12 });

    return (
        <section id="blog" className="abaco-section">
            <div className="abaco-section__inner">
                <div
                    ref={ref}
                    className={cn(
                        'qd-blog__head abaco-reveal',
                        inView && 'is-visible',
                    )}
                >
                    <div className="qd-blog__head-text">
                        <p className="abaco-section-eyebrow">
                            {t('home.blog.eyebrow')}
                        </p>
                        <h2 className="abaco-section-title">
                            {t('home.blog.title')}
                        </h2>
                        <p className="abaco-section-lead">
                            {t('home.blog.lead')}
                        </p>
                    </div>
                    <a href="/blog" className="qd-blog__cta-all">
                        {t('home.blog.ctaAll')}
                        <ArrowRight aria-hidden="true" size={16} />
                    </a>
                </div>

                <div
                    className={cn(
                        'qd-blog-layout abaco-stagger',
                        inView && 'is-visible',
                    )}
                >
                    {POSTS.map((post) => (
                        <article
                            key={post.key}
                            className={
                                post.featured
                                    ? 'qd-blog-main'
                                    : 'qd-blog-secondary'
                            }
                        >
                            <div className="qd-blog-card__visual">
                                <BlogCardVisual visual={post.visual} />
                            </div>
                            {post.featured ? (
                                <div className="qd-blog-card__body qd-blog-card__body--featured">
                                    <div className="qd-blog-main__copy">
                                        <span className="qd-blog-card__cat">
                                            {t(`home.blog.items.${post.key}.category`)}
                                        </span>
                                        <h3 className="qd-blog-card__title">
                                            {t(`home.blog.items.${post.key}.title`)}
                                        </h3>
                                        <p className="qd-blog-card__summary">
                                            {t(`home.blog.items.${post.key}.summary`)}
                                        </p>
                                    </div>
                                    <FeaturedInsightVisual />
                                    <div className="qd-blog-main__footer">
                                        <span className="qd-blog-card__meta">
                                            {t(`home.blog.items.${post.key}.meta`)}
                                        </span>
                                        <a href="/blog" className="qd-blog-card__read">
                                            {t('home.blog.cta')}
                                            <ArrowRight aria-hidden="true" size={14} />
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="qd-blog-card__body">
                                    <span className="qd-blog-card__cat">
                                        {t(`home.blog.items.${post.key}.category`)}
                                    </span>
                                    <h3 className="qd-blog-card__title">
                                        {t(`home.blog.items.${post.key}.title`)}
                                    </h3>
                                    <p className="qd-blog-card__summary">
                                        {t(`home.blog.items.${post.key}.summary`)}
                                    </p>
                                    <span className="qd-blog-card__meta">
                                        {t(`home.blog.items.${post.key}.meta`)}
                                    </span>
                                    <a href="/blog" className="qd-blog-card__read">
                                        {t('home.blog.cta')}
                                        <ArrowRight aria-hidden="true" size={14} />
                                    </a>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { ArrowRight } from 'lucide-react';

import { useInView } from '@/hooks/use-in-view';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

import SectionIntro from './SectionIntro';

const POSTS = ['loyalty', 'data', 'automation'] as const;

export default function BlogSection() {
    const { t } = useLanguage();
    const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

    return (
        <section id="blog" className="abaco-section bg-brand-neutral dark:bg-surface-dark">
            <div className="abaco-section__inner">
                <div ref={ref} className={cn('abaco-reveal', inView && 'is-visible')}>
                    <SectionIntro
                        eyebrow={t('home.blog.eyebrow')}
                        title={t('home.blog.title')}
                        lead={t('home.blog.lead')}
                        align="center"
                    />
                </div>

                <div className={cn('abaco-blog-grid abaco-stagger', inView && 'is-visible')}>
                    {POSTS.map((key) => (
                        <article key={key} className="abaco-blog-card abaco-card-hover">
                            <span className="abaco-blog-card__category">{t(`home.blog.items.${key}.category`)}</span>
                            <h3>{t(`home.blog.items.${key}.title`)}</h3>
                            <p>{t(`home.blog.items.${key}.summary`)}</p>
                            <a className="abaco-blog-card__cta" href="#contacto">
                                <span>{t('home.blog.cta')}</span>
                                <ArrowRight aria-hidden="true" size={16} />
                            </a>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { ArrowRight, CalendarCheck } from 'lucide-react';

import { useInView } from '@/hooks/use-in-view';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

export default function CtaSection() {
    const { t } = useLanguage();
    const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });

    return (
        <section id="contacto" className="abaco-section abaco-cta-section">
            <div className="abaco-section__inner">
                <div ref={ref} className={cn('abaco-cta-panel abaco-grid-surface abaco-reveal', inView && 'is-visible')}>
                    <h2>{t('home.cta.title')}</h2>
                    <p>{t('home.cta.subtitle')}</p>
                    <div className="abaco-cta-panel__actions">
                        <a className="abaco-cta-panel__primary" href="#contacto">
                            <CalendarCheck aria-hidden="true" size={19} />
                            <span>{t('home.cta.primaryCta')}</span>
                        </a>
                        <a className="abaco-cta-panel__secondary" href="#footer">
                            <span>{t('home.cta.secondaryCta')}</span>
                            <ArrowRight aria-hidden="true" size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

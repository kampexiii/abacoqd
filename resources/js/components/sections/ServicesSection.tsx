import { BarChart3, BrainCircuit, Compass, Rocket, Users, Workflow } from 'lucide-react';

import { useInView } from '@/hooks/use-in-view';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

import SectionIntro from './SectionIntro';

const SERVICES = [
    { key: 'crm', icon: Users },
    { key: 'data', icon: BarChart3 },
    { key: 'automation', icon: Workflow },
    { key: 'ai', icon: BrainCircuit },
    { key: 'transformation', icon: Rocket },
    { key: 'consulting', icon: Compass },
] as const;

export default function ServicesSection() {
    const { t } = useLanguage();
    const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

    return (
        <section id="servicios" className="abaco-section bg-white dark:bg-surface-dark-elevated">
            <div className="abaco-section__inner">
                <div ref={ref} className={cn('abaco-reveal', inView && 'is-visible')}>
                    <SectionIntro
                        eyebrow={t('home.services.eyebrow')}
                        title={t('home.services.title')}
                        lead={t('home.services.lead')}
                        align="center"
                    />
                </div>

                <div className={cn('abaco-services-grid abaco-stagger', inView && 'is-visible')}>
                    {SERVICES.map(({ key, icon: Icon }) => (
                        <article key={key} className="abaco-service-card abaco-card-hover">
                            <span className="abaco-service-card__icon">
                                <Icon aria-hidden="true" size={22} />
                            </span>
                            <h3>{t(`home.services.items.${key}.title`)}</h3>
                            <p>{t(`home.services.items.${key}.description`)}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

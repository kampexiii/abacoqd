import { ArrowRight, CalendarCheck } from 'lucide-react';

import AbacoCrystalCube from '@/components/AbacoCrystalCube';
import HeroBrandRails from '@/components/HeroBrandRails';
import HeroParticleField from '@/components/HeroParticleField';
import { useLanguage } from '@/hooks/use-language';

/**
 * Hero de la home. La topbar canónica ya NO vive aquí: la monta PublicLayout
 * (un único <header> y un único <main id="contenido"> por vista). Este bloque
 * conserva el cubo protegido (AbacoCrystalCube) y su base visual; el copy/CTA
 * definitivos se reconstruyen desde el mockup final en el bloque de Hero.
 */
export default function AbacoHero() {
    const { t } = useLanguage();

    return (
        <section id="hero" className="abaco-hero">
            <HeroParticleField />

            <section className="abaco-hero__content" aria-labelledby="hero-title">
                <div className="abaco-hero__copy">
                    <p className="abaco-hero__eyebrow">
                        {t('home.hero.eyebrow')}
                    </p>
                    <h1 id="hero-title" className="abaco-hero__title">
                        <span>{t('home.hero.titleLine1')}</span>
                        <span>
                            {t('home.hero.titleLine2Prefix')}{' '}
                            <strong className="abaco-hero__highlight">
                                {t('home.hero.titleHighlight')}
                            </strong>
                        </span>
                        <span>{t('home.hero.titleLine3')}</span>
                    </h1>
                    <p className="abaco-hero__subtitle">
                        {t('home.hero.subtitle')}
                    </p>
                    <div className="abaco-hero__actions" aria-label={t('home.hero.actionsAriaLabel')}>
                        <a className="abaco-hero__primary" href="#contacto">
                            <CalendarCheck aria-hidden="true" size={19} />
                            <span>{t('home.hero.ctaPrimary')}</span>
                        </a>
                        <a className="abaco-hero__secondary" href="#servicios">
                            <span>{t('home.hero.ctaSecondary')}</span>
                            <ArrowRight aria-hidden="true" size={18} />
                        </a>
                    </div>
                </div>

                <div className="abaco-hero__cube-wrap">
                    <AbacoCrystalCube />
                </div>

                <HeroBrandRails />
            </section>
        </section>
    );
}

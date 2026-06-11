import { ArrowRight, CalendarCheck } from 'lucide-react';

import AbacoCrystalCube from '@/components/AbacoCrystalCube';
import FloatingHeader from '@/components/FloatingHeader';
import HeroBrandRails from '@/components/HeroBrandRails';
import HeroParticleField from '@/components/HeroParticleField';

export default function AbacoHero() {
    return (
        <main id="hero" className="abaco-hero">
            <HeroParticleField />
            <FloatingHeader />

            <section className="abaco-hero__content" aria-labelledby="hero-title">
                <div className="abaco-hero__copy">
                    <p className="abaco-hero__eyebrow">
                        CONSULTORÍA · CRM · DATOS · AUTOMATIZACIÓN
                    </p>
                    <h1 id="hero-title" className="abaco-hero__title">
                        <span>CRM, datos y automatización</span>
                        <span>
                            para{' '}
                            <strong className="abaco-hero__highlight">
                                fidelizar mejor
                            </strong>
                        </span>
                        <span>a tus clientes</span>
                    </h1>
                    <p className="abaco-hero__subtitle">
                        Ábaco Developments ayuda a empresas a conectar tecnología,
                        analítica y procesos comerciales para mejorar la relación
                        con sus clientes y tomar mejores decisiones.
                    </p>
                    <div className="abaco-hero__actions" aria-label="Acciones">
                        <a className="abaco-hero__primary" href="#contacto">
                            <CalendarCheck aria-hidden="true" size={19} />
                            <span>Reservar una consulta</span>
                        </a>
                        <a className="abaco-hero__secondary" href="#servicios">
                            <span>Ver servicios</span>
                            <ArrowRight aria-hidden="true" size={18} />
                        </a>
                    </div>
                </div>

                <div className="abaco-hero__cube-wrap">
                    <AbacoCrystalCube />
                </div>

                <HeroBrandRails />
            </section>
        </main>
    );
}

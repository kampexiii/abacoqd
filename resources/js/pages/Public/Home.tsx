import { Head } from '@inertiajs/react';

import AbacoHero from '@/components/AbacoHero';

export default function Home() {
    return (
        <>
            <Head title="Ábaco Developments" />
            <AbacoHero />
            {/* Secciones temporales para validar scroll y continuidad visual. */}
            <section className="abaco-test-section abaco-test-section--services">
                <div className="abaco-test-section__inner">
                    <p className="abaco-test-section__eyebrow">Validación visual</p>
                    <h2>Servicios para conectar datos, clientes y procesos</h2>
                    <p className="abaco-test-section__lead">
                        Una base visual de prueba para validar continuidad, scroll y
                        comportamiento del hero antes de construir el contenido
                        completo.
                    </p>
                    <div className="abaco-test-cards" aria-label="Servicios de prueba">
                        <article className="abaco-test-card">
                            <span>01</span>
                            <h3>CRM & fidelización</h3>
                            <p>
                                Arquitectura comercial enfocada en relaciones medibles
                                y seguimiento útil.
                            </p>
                        </article>
                        <article className="abaco-test-card">
                            <span>02</span>
                            <h3>Analítica y datos</h3>
                            <p>
                                Modelos de información claros para decidir con señales
                                fiables.
                            </p>
                        </article>
                        <article className="abaco-test-card">
                            <span>03</span>
                            <h3>Automatización comercial</h3>
                            <p>
                                Flujos que reducen fricción y mantienen el ritmo del
                                equipo.
                            </p>
                        </article>
                    </div>
                </div>
            </section>
            <section className="abaco-test-section abaco-test-section--growth">
                <div className="abaco-test-section__inner abaco-test-section__inner--split">
                    <div>
                        <p className="abaco-test-section__eyebrow">Bloque temporal</p>
                        <h2>Una experiencia digital preparada para crecer</h2>
                    </div>
                    <p className="abaco-test-section__lead">
                        Bloque temporal para comprobar transición visual, contraste,
                        responsive y rendimiento después del hero.
                    </p>
                </div>
            </section>
        </>
    );
}

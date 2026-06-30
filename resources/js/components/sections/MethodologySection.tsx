import { ArrowRight, PenTool } from 'lucide-react';

import { useLanguage } from '@/hooks/use-language';

import MethodologyProcessCube from './MethodologyProcessCube';

/**
 * Sección Metodología de la landing (sección 2, tras Hero, antes de Servicios).
 * docs/07_VISTAS/PUBLIC_02_METODOLOGIA_PROCESO.md §A · PUBLIC_01_HOME_LANDING.md §2.
 *
 * Split: statement de marca (CODE./QUICK./DELIVER.) + cube-effect carousel de
 * 6 pasos (`MethodologyProcessCube`), efecto cubo 3D infinito con una cara
 * activa por vez y máximo dos durante la transición, con toda la información
 * del paso en una única cara (sin frontal/back). Banda-puente "Estudio inicial"
 * sin promesa de gratuidad.
 */

// Destino del enlace de metodología.
const METODOLOGIA_HREF = '/metodologia';

export default function MethodologySection() {
    const { t } = useLanguage();

    return (
        <section
            id="metodologia"
            className="relative scroll-mt-24 py-20 sm:py-24"
            aria-labelledby="metodologia-title"
        >
            <div className="mx-auto grid w-full max-w-[1240px] items-stretch gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10">
                {/* Statement de marca */}
                <div className="qd-glass rounded-3xl p-8 sm:p-10">
                    <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-qd-teal-2 uppercase dark:text-qd-teal">
                        <span
                            aria-hidden="true"
                            className="inline-block h-[7px] w-[7px] rounded-full bg-qd-teal"
                        />
                        {t('home.methodology.eyebrow')}
                    </p>

                    <h2
                        id="metodologia-title"
                        className="mt-6 text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl"
                    >
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

                    <blockquote className="mt-8 border-l-2 border-qd-teal pl-4 text-base leading-relaxed text-qd-text-high">
                        {t('home.methodology.quote')}
                    </blockquote>

                    <a
                        href={METODOLOGIA_HREF}
                        className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-qd-teal-2 transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:text-qd-teal dark:focus-visible:outline-qd-lime"
                    >
                        {t('home.methodology.link')}
                        <ArrowRight
                            aria-hidden="true"
                            size={16}
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                    </a>
                </div>

                {/* Cube-effect carousel de 6 pasos (una cara activa por vez) */}
                <MethodologyProcessCube />
            </div>

            {/* Banda-puente "Estudio inicial" — acotada, sin promesa de gratuidad. */}
            <div className="mx-auto mt-12 w-full max-w-[1240px] px-4 sm:px-6">
                <div className="qd-glass flex flex-col gap-4 rounded-2xl border-qd-teal/30 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-7">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-qd-teal/30 bg-qd-teal/10 text-qd-teal-2 dark:text-qd-teal">
                        <PenTool
                            aria-hidden="true"
                            size={22}
                            strokeWidth={1.8}
                        />
                    </span>
                    <div>
                        <p className="text-xs font-semibold tracking-[0.16em] text-qd-teal-2 uppercase dark:text-qd-teal">
                            {t('home.methodology.bridge.label')}
                        </p>
                        <p className="mt-1.5 text-base font-semibold text-qd-ink dark:text-qd-white">
                            {t('home.methodology.bridge.message')}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-qd-text-high">
                            {t('home.methodology.bridge.support')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

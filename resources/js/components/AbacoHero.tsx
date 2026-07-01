import {
    ArrowRight,
    CalendarCheck,
    Cpu,
    Gauge,
    Code2,
    Sparkles,
    Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { lazy, Suspense } from 'react';

import AbacoCrystalCubeLite from '@/components/AbacoCrystalCubeLite';
import HeroParticleField from '@/components/HeroParticleField';
import { useLanguage } from '@/hooks/use-language';
import { useIsMobile } from '@/hooks/use-mobile';

// Variante experimental del cubo del hero (rama experiment/lightweight-hero-cube).
// 'lite' = cubo CSS ligero sin Three.js; 'webgl' = cubo original AbacoCrystalCube.
// El cubo WebGL va en carga diferida para que Three.js NO entre en el bundle
// inicial de Home cuando la variante activa es 'lite'. Cambiar a 'webgl' revierte.
const HERO_CUBE_VARIANT: 'lite' | 'webgl' = 'lite';
const AbacoCrystalCube = lazy(() => import('@/components/AbacoCrystalCube'));

/**
 * Hero principal de la landing pública.
 *
 * Conserva la estructura visual del hero y reutiliza el cubo como elemento
 * central dentro del sistema de estilos `qd-hero__*`.
 */

// Ruta del CTA de reserva.
const RESERVA_HREF = '/reserva';
const SERVICIOS_HREF = '/servicios';

const BENEFITS: readonly { key: string; icon: LucideIcon }[] = [
    { key: 'ai', icon: Sparkles },
    { key: 'custom', icon: Code2 },
    { key: 'fast', icon: Gauge },
    { key: 'price', icon: Wallet },
    { key: 'tech', icon: Cpu },
] as const;

export default function AbacoHero() {
    const { t } = useLanguage();
    // En móvil el hero se aligera: sin campo de partículas y con el cubo en
    // variante simplificada (sin descomposición por scroll ni mini cubos).
    // Sin SSR, useIsMobile ya resuelve bien en el primer render (no hay flash).
    const isMobile = useIsMobile();

    return (
        <section id="hero" className="qd-hero">
            {!isMobile && <HeroParticleField />}

            <section className="qd-hero__content" aria-labelledby="hero-title">
                <div className="qd-hero__copy">
                    <p className="qd-hero__eyebrow">{t('home.hero.eyebrow')}</p>
                    <h1 id="hero-title" className="qd-hero__title">
                        {t('home.hero.titlePrefix')}
                        <strong className="qd-hero__highlight">
                            {t('home.hero.titleHighlight')}
                        </strong>
                    </h1>
                    <p className="qd-hero__subtitle">
                        {t('home.hero.subtitle')}
                    </p>
                    <div
                        className="qd-hero__actions"
                        aria-label={t('home.hero.actionsAriaLabel')}
                    >
                        <a className="qd-hero__primary" href={RESERVA_HREF}>
                            <CalendarCheck aria-hidden="true" size={19} />
                            <span>{t('home.hero.ctaPrimary')}</span>
                        </a>
                        <a className="qd-hero__secondary" href={SERVICIOS_HREF}>
                            <span>{t('home.hero.ctaSecondary')}</span>
                            <ArrowRight aria-hidden="true" size={18} />
                        </a>
                    </div>
                </div>

                {/* La estructura del cubo se mantiene estable para preservar la
                    animación principal del hero. Variante seleccionable arriba. */}
                <div className="qd-hero__cube-wrap">
                    {HERO_CUBE_VARIANT === 'lite' ? (
                        <AbacoCrystalCubeLite simplified={isMobile} />
                    ) : (
                        <Suspense fallback={null}>
                            <AbacoCrystalCube />
                        </Suspense>
                    )}
                </div>

                <ul
                    className="qd-hero__benefits"
                    aria-label={t('home.hero.benefitsAria')}
                >
                    {BENEFITS.map(({ key, icon: Icon }) => (
                        <li key={key}>
                            <Icon aria-hidden="true" size={28} />
                            <span>{t(`home.hero.benefits.${key}`)}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
}

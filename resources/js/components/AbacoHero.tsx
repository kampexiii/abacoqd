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

import AbacoCrystalCube from '@/components/AbacoCrystalCube';
import HeroParticleField from '@/components/HeroParticleField';
import { useLanguage } from '@/hooks/use-language';

/**
 * Hero definitivo de la landing AbacoQD.
 * docs/07_VISTAS/PUBLIC_01_HOME_LANDING.md §1.
 *
 * Mantiene la estructura ORIGINAL centrada del hero (`.qd-hero__*`): el cubo
 * protegido conserva su tamaño y su reparto de fragmentos por toda la sección
 * (canvas a pantalla completa del hero). Respecto al original solo cambian copy,
 * CTAs, paleta qd-* y el fondo: el hero es transparente para dejar ver el
 * WaveBackground global compartido. La topbar la monta PublicLayout.
 */

// Destino del CTA de reserva. Provisional hasta que exista la ruta /reserva;
// cambiar aquí cuando se publique el flujo de reserva (un solo punto).
const RESERVA_HREF = '#contacto';
const SERVICIOS_HREF = '#servicios';

const BENEFITS: readonly { key: string; icon: LucideIcon }[] = [
    { key: 'ai', icon: Sparkles },
    { key: 'custom', icon: Code2 },
    { key: 'fast', icon: Gauge },
    { key: 'price', icon: Wallet },
    { key: 'tech', icon: Cpu },
] as const;

export default function AbacoHero() {
    const { t } = useLanguage();

    return (
        <section id="hero" className="qd-hero">
            <HeroParticleField />

            <section className="qd-hero__content" aria-labelledby="hero-title">
                <div className="qd-hero__copy">
                    <p className="qd-hero__eyebrow">{t('home.hero.eyebrow')}</p>
                    <h1 id="hero-title" className="qd-hero__title">
                        {t('home.hero.titlePrefix')}
                        <strong className="qd-hero__highlight">
                            {t('home.hero.titleHighlight')}
                        </strong>
                    </h1>
                    <p className="qd-hero__subtitle">{t('home.hero.subtitle')}</p>
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

                {/* Recurso visual: cubo protegido. El canvas escapa de este wrap
                    (mount absolute inset:0) y cubre toda la sección hero para
                    repartir los fragmentos. No tocar AbacoCrystalCube. */}
                <div className="qd-hero__cube-wrap">
                    <AbacoCrystalCube />
                </div>

                {/* Franja de beneficios (5 ítems, glass) */}
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

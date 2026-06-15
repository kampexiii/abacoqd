import { Linkedin, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import { SITE_CONFIG } from '@/config/site';
import { useLanguage } from '@/hooks/use-language';

/**
 * Footer canónico AbacoQD — 4 columnas con aire (Marca / Explorar / Servicios /
 * Contacto) + franja institucional discreta + barra legal.
 * docs/07_VISTAS/PUBLIC_09_LAYOUT_GLOBAL.md · PUBLIC_01_HOME_LANDING.md §7.
 *
 * Reutilizado por TODAS las vistas públicas (incluidas 404/500/503). Sin footer
 * genérico "Producto / Empresa / Legal". Datos de contacto confirmados (FASE 1
 * desde config/site; FASE 2+ desde `settings`).
 */

type FooterLink = { key: string; href: string };

const EXPLORE_LINKS: readonly FooterLink[] = [
    { key: 'inicio', href: '/' },
    { key: 'metodologia', href: '#metodologia' },
    { key: 'servicios', href: '#servicios' },
    { key: 'proyectos', href: '#colaboraciones' },
    { key: 'quienesSomos', href: '/quienes-somos' },
    { key: 'blog', href: '#blog' },
    { key: 'contacto', href: '#contacto' },
] as const;

const SERVICE_LINKS = ['web', 'apps', 'automation', 'uxui', 'consulting'] as const;

const LEGAL_LINKS: readonly FooterLink[] = [
    { key: 'privacy', href: '/privacidad' },
    { key: 'cookies', href: '/cookies' },
    { key: 'notice', href: '/aviso-legal' },
] as const;

export default function SiteFooter() {
    const { t } = useLanguage();

    return (
        <footer
            className="relative border-t border-white/10 bg-qd-ink text-qd-white"
            aria-label={t('footer.ariaLabel')}
        >
            {/* glow radial teal tenue */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(24,183,176,0.16),transparent_70%)]"
            />

            <div className="relative mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
                {/* Columna Marca */}
                <div className="flex flex-col gap-4">
                    <img
                        src="/assets/branding/marca/logos/abaco-white.svg"
                        alt="Abaco Developments"
                        width={168}
                        height={34}
                        className="h-8 w-auto"
                    />
                    <p className="max-w-xs text-sm leading-relaxed text-qd-text-medium">
                        {t('footer.brand.line1')}
                        <br />
                        {t('footer.brand.line2')}
                    </p>
                    <p className="max-w-xs text-sm leading-relaxed text-qd-text-high">
                        {t('footer.brand.tagline')}
                    </p>
                </div>

                {/* Columna Explorar */}
                <nav aria-label={t('footer.explore.title')}>
                    <h2 className="mb-4 text-sm font-semibold tracking-wide text-qd-white">
                        {t('footer.explore.title')}
                    </h2>
                    <ul className="flex flex-col gap-2.5">
                        {EXPLORE_LINKS.map((item) => (
                            <li key={item.key}>
                                <a
                                    href={item.href}
                                    className="text-sm text-qd-text-medium transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                                >
                                    {t(`footer.explore.${item.key}`)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Columna Servicios */}
                <nav aria-label={t('footer.services.title')}>
                    <h2 className="mb-4 text-sm font-semibold tracking-wide text-qd-white">
                        {t('footer.services.title')}
                    </h2>
                    <ul className="flex flex-col gap-2.5">
                        {SERVICE_LINKS.map((key) => (
                            <li key={key}>
                                <a
                                    href="#servicios"
                                    className="text-sm text-qd-text-medium transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                                >
                                    {t(`footer.services.${key}`)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Columna Contacto */}
                <div>
                    <h2 className="mb-4 text-sm font-semibold tracking-wide text-qd-white">
                        {t('footer.contact.title')}
                    </h2>
                    <ul className="flex flex-col gap-3 text-sm text-qd-text-medium">
                        <li className="flex items-start gap-2.5">
                            <MapPin aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-qd-teal" />
                            <span>{SITE_CONFIG.contact.address}</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Mail aria-hidden="true" size={16} className="shrink-0 text-qd-teal" />
                            <a
                                href={`mailto:${SITE_CONFIG.contact.email}`}
                                className="transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                            >
                                {SITE_CONFIG.contact.email}
                            </a>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Phone aria-hidden="true" size={16} className="shrink-0 text-qd-teal" />
                            <a
                                href={SITE_CONFIG.contact.phoneHref}
                                className="transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                            >
                                {SITE_CONFIG.contact.phone}
                            </a>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <MessageCircle aria-hidden="true" size={16} className="shrink-0 text-qd-teal" />
                            <a
                                href={SITE_CONFIG.contact.whatsappHref}
                                target="_blank"
                                rel="noreferrer"
                                className="transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                            >
                                {t('footer.contact.whatsappLabel')} {SITE_CONFIG.contact.whatsapp}
                            </a>
                        </li>
                    </ul>
                    <a
                        href={SITE_CONFIG.social.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t('footer.contact.linkedin')}
                        className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-qd-text-medium transition-colors hover:border-qd-teal hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                    >
                        <Linkedin aria-hidden="true" size={18} />
                    </a>
                </div>
            </div>

            {/* Franja institucional discreta (UE / FSE+ / Fondos Europeos).
                PENDIENTE: logos oficiales y ubicación final (docs §decisiones). */}
            <div className="relative mx-auto w-full max-w-[1240px] border-t border-white/10 px-5 py-5 sm:px-8">
                <p className="text-xs leading-relaxed text-qd-text-medium">
                    {t('footer.institutional.coFunded')} · {t('footer.institutional.funds')} · {t('footer.institutional.fse')}
                </p>
            </div>

            {/* Barra legal */}
            <div className="relative mx-auto flex w-full max-w-[1240px] flex-col gap-3 border-t border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <p className="text-xs text-qd-text-medium">{t('footer.legal.copyright')}</p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
                    {LEGAL_LINKS.map((item) => (
                        <li key={item.key}>
                            <a
                                href={item.href}
                                className="text-qd-text-medium transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                            >
                                {t(`footer.legal.${item.key}`)}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    );
}

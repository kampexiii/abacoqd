import { usePage } from '@inertiajs/react';
import {
    Linkedin,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Star,
} from 'lucide-react';

import { SITE_CONFIG } from '@/config/site';
import { useLanguage } from '@/hooks/use-language';
import { telHref, useSiteSettings, whatsappHref } from '@/lib/site';

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

type LocalizedText = {
    readonly es?: string | null;
    readonly en?: string | null;
};

type FooterService = {
    readonly id: number;
    readonly title: LocalizedText;
    readonly slug: LocalizedText;
    readonly isDetailEnabled: boolean;
};

type FooterPageProps = {
    readonly footerServices?: readonly FooterService[];
};

const EXPLORE_LINKS: readonly FooterLink[] = [
    { key: 'inicio', href: '/' },
    { key: 'metodologia', href: '/metodologia' },
    { key: 'servicios', href: '/servicios' },
    { key: 'proyectos', href: '/proyectos' },
    { key: 'quienesSomos', href: '/quienes-somos' },
    { key: 'blog', href: '/blog' },
    { key: 'contacto', href: '/contacto' },
] as const;

const LEGAL_LINKS: readonly FooterLink[] = [
    { key: 'privacy', href: '/privacidad' },
    { key: 'cookies', href: '/cookies' },
    { key: 'notice', href: '/aviso-legal' },
] as const;

const fondosEuropeosLogo =
    '/assets/branding/institucional/optimizados/fondos-europeos.svg';

function EuropeanUnionFlag() {
    const starAngles = Array.from({ length: 12 }, (_, index) => index * 30);

    return (
        <svg
            aria-label="Bandera de la Unión Europea"
            className="h-8 w-12 shrink-0"
            viewBox="0 0 48 32"
            role="img"
        >
            <rect width="48" height="32" fill="#003399" rx="1.5" />
            <g transform="translate(24 16)">
                {starAngles.map((angle) => (
                    <path
                        key={angle}
                        d="M0 -2.85 .67 -.88 2.74 -.88 1.07 .34 1.69 2.34 0 1.12 -1.69 2.34 -1.07 .34 -2.74 -.88 -.67 -.88Z"
                        fill="#FFCC00"
                        transform={`rotate(${angle}) translate(0 -9.6)`}
                    />
                ))}
            </g>
        </svg>
    );
}

function GoogleGlyph() {
    return (
        <svg aria-hidden="true" viewBox="0 0 48 48" className="size-4 shrink-0">
            <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
        </svg>
    );
}

function FacebookGlyph() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]">
            <path
                fill="currentColor"
                d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"
            />
        </svg>
    );
}

export default function SiteFooter() {
    const { t, locale } = useLanguage();
    const { footerServices = [] } = usePage<FooterPageProps>().props;
    const { contact, social, googleReviews } = useSiteSettings();
    const showGoogleReviews = googleReviews.url !== null || import.meta.env.DEV;

    return (
        <footer
            id="footer"
            className="relative border-t border-white/10 bg-qd-ink text-qd-white"
            aria-label={t('footer.ariaLabel')}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(24,183,176,0.16),transparent_70%)]"
            />

            <div className="relative mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
                {/* Columna Marca */}
                <div className="flex max-w-[352px] flex-col">
                    <img
                        src="/assets/branding/marca/logos/abacoqd-lockup-inverse.svg"
                        alt="AbacoQD Quick Developments"
                        width={164}
                        height={46}
                        className="h-auto w-[164px]"
                    />

                    <p className="mt-[22px] text-[15px] leading-[1.7] font-semibold text-[#94a3ad]">
                        {t('footer.brand.line1')}
                    </p>

                    <p className="mt-[18px] text-[13px] leading-6 font-bold text-[#b7c4cc]">
                        {t('footer.brand.tagline')}
                    </p>

                    <div className="mt-[16px] h-px w-full bg-white/8" />

                    <section
                        className="mt-[14px]"
                        aria-labelledby="footer-financing-title"
                    >
                        <h2
                            id="footer-financing-title"
                            className="text-[10px] leading-none font-extrabold tracking-[0.28em] text-[#18b7b0] uppercase"
                        >
                            {t('footer.institutional.title')}
                        </h2>

                        <div className="mt-[13px] flex items-center gap-[12px]">
                            <EuropeanUnionFlag />
                            <p className="text-[11px] leading-4 font-extrabold text-[#c4cbd1]">
                                {t('footer.institutional.coFunded')}
                            </p>
                        </div>

                        <div className="mt-[12px] flex flex-wrap items-center gap-2">
                            <span className="inline-flex h-[30px] items-center rounded-[8px] border border-white/12 bg-white px-3">
                                <img
                                    src={fondosEuropeosLogo}
                                    alt={t('footer.institutional.funds')}
                                    width={100}
                                    height={21}
                                    className="h-[16px] w-auto"
                                />
                            </span>
                        </div>

                        <p className="mt-[12px] text-[11px] leading-[1.45] font-medium text-[#7e8c96]">
                            {t('footer.institutional.fse')}
                        </p>
                    </section>
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
                        {footerServices.map((service) => {
                            const title =
                                service.title[locale] ??
                                service.title.es ??
                                service.title.en ??
                                '';
                            const slug =
                                service.slug[locale] ??
                                service.slug.es ??
                                service.slug.en ??
                                '';
                            const href = service.isDetailEnabled
                                ? `/servicios/${slug}`
                                : `/contacto?servicio=${encodeURIComponent(slug)}`;

                            return (
                                <li key={service.id}>
                                    <a
                                        href={href}
                                        className="text-sm text-qd-text-medium transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                                    >
                                        {title}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Columna Contacto */}
                <div>
                    <h2 className="mb-4 text-sm font-semibold tracking-wide text-qd-white">
                        {t('footer.contact.title')}
                    </h2>
                    <ul className="flex flex-col gap-3 text-sm text-qd-text-medium">
                        <li className="flex items-start gap-2.5">
                            <MapPin
                                aria-hidden="true"
                                size={16}
                                className="mt-0.5 shrink-0 text-qd-teal"
                            />
                            <span>{contact.address}</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Mail
                                aria-hidden="true"
                                size={16}
                                className="shrink-0 text-qd-teal"
                            />
                            <a
                                href={`mailto:${contact.email ?? ''}`}
                                className="transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                            >
                                {contact.email}
                            </a>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Phone
                                aria-hidden="true"
                                size={16}
                                className="shrink-0 text-qd-teal"
                            />
                            <a
                                href={telHref(contact.phone) ?? undefined}
                                className="transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                            >
                                {contact.phone}
                            </a>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <MessageCircle
                                aria-hidden="true"
                                size={16}
                                className="shrink-0 text-qd-teal"
                            />
                            <a
                                href={whatsappHref(contact.whatsapp) ?? undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                            >
                                {t('footer.contact.whatsappLabel')}{' '}
                                {contact.whatsapp}
                            </a>
                        </li>
                        {showGoogleReviews && (
                            <li>
                                {googleReviews.url !== null ? (
                                    <a
                                        href={googleReviews.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={t(
                                            'footer.contact.googleProfileLabel',
                                        )}
                                        className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 transition-colors hover:border-white/20 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                                    >
                                        <span className="flex min-w-0 items-center gap-2.5">
                                            <GoogleGlyph />
                                            <span className="min-w-0">
                                                <span className="block truncate text-[12px] leading-4 font-semibold text-qd-white">
                                                    {SITE_CONFIG.name}
                                                </span>
                                                <span className="block truncate text-[10px] leading-4 text-qd-text-medium">
                                                    {googleReviews.location}
                                                    {googleReviews.count !==
                                                    null
                                                        ? ` · ${googleReviews.count} ${t(
                                                              googleReviews.count ===
                                                                  1
                                                                  ? 'footer.contact.googleReviewVerified'
                                                                  : 'footer.contact.googleReviewsVerified',
                                                          )}`
                                                        : ''}
                                                </span>
                                            </span>
                                        </span>

                                        {googleReviews.rating !== null ? (
                                            <span className="flex shrink-0 items-center gap-1 text-[13px] font-bold text-qd-white">
                                                {googleReviews.rating.toFixed(
                                                    1,
                                                )}
                                                <Star
                                                    aria-hidden="true"
                                                    size={13}
                                                    strokeWidth={2}
                                                    className="fill-[#fbbc04] text-[#fbbc04]"
                                                />
                                            </span>
                                        ) : null}
                                    </a>
                                ) : (
                                    <span className="flex items-center gap-2.5 text-qd-text-medium/60 italic">
                                        <GoogleGlyph />
                                        {t(
                                            'footer.contact.googleReviewsUnavailable',
                                        )}
                                    </span>
                                )}
                            </li>
                        )}
                    </ul>
                    <div className="mt-4 flex items-center gap-2">
                        <a
                            href={social.linkedin ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t('footer.contact.linkedin')}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-qd-text-medium transition-colors hover:border-qd-teal hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                        >
                            <Linkedin aria-hidden="true" size={18} />
                        </a>
                        <a
                            href={social.facebook ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t('footer.contact.facebook')}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-qd-text-medium transition-colors hover:border-qd-teal hover:text-qd-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-lime"
                        >
                            <FacebookGlyph />
                        </a>
                    </div>
                </div>
            </div>

            {/* Barra legal */}
            <div className="relative mx-auto flex w-full max-w-[1240px] flex-col gap-3 border-t border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <p className="text-xs text-qd-text-medium">
                    {t('footer.legal.copyright')}
                </p>
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

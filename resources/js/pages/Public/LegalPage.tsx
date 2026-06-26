import { ArrowRight, ShieldCheck } from 'lucide-react';

import { COOKIE_NOTICE_STORAGE_KEY } from '@/components/cookies/CookieNotice';
import PublicPageHero from '@/components/public/PublicPageHero';
import SeoHead from '@/components/seo/SeoHead';
import { useLanguage } from '@/hooks/use-language';
import type { Locale } from '@/hooks/use-language';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import enLang from '../../../../lang/en.json';
import esLang from '../../../../lang/es.json';

/**
 * Plantilla común de las páginas legales públicas: Aviso legal, Privacidad y
 * Cookies (docs/07_VISTAS/PUBLIC_07_LEGAL_COOKIES_PRIVACIDAD.md). Una sola vista
 * parametrizada por `kind`; la ruta pasa el tipo vía `Route::inertia`.
 *
 * El contenido (secciones) es estructurado, no HTML libre, así que se lee
 * directamente del árbol i18n por idioma (el helper `t()` solo resuelve
 * strings). Las páginas comparten estructura y datos corporativos confirmados.
 *
 * Los datos corporativos van aquí como constante confirmada; cuando exista un
 * canal de `settings` públicos, el bloque de contacto debe leerlos de ahí.
 */

export type LegalPageKind = 'notice' | 'privacy' | 'cookies';

type LegalBlock =
    | { readonly type: 'p'; readonly text: string }
    | { readonly type: 'ul'; readonly items: readonly string[] }
    | {
          readonly type: 'table';
          readonly headers: readonly string[];
          readonly rows: readonly (readonly string[])[];
      };

type LegalSection = {
    readonly id: string;
    readonly heading: string;
    readonly blocks: readonly LegalBlock[];
};

type LegalContent = {
    readonly sections: readonly LegalSection[];
};

type LegalTree = Record<Locale, { legalPages: Record<LegalPageKind, LegalContent> }>;

const LEGAL_TREE = { es: esLang, en: enLang } as unknown as LegalTree;

// Datos corporativos confirmados; se mantienen aquí hasta centralizarlos en settings públicos.
const COMPANY = {
    legalName: 'ABACO DIGITAL DEVELOPMENTS, S.L.',
    cif: 'B-88229364',
    address:
        'Calle Núñez de Balboa 35 A, Piso 5, Oficina A1, 28001 Madrid, España',
    registry:
        'Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002',
    email: 'info@abacodev.com',
    phone: '+34 91 020 00 89',
    phoneHref: '+34910200089',
    domain: 'https://abacoqd.com/',
} as const;

const CROSS_LINKS: readonly {
    readonly kind: LegalPageKind;
    readonly href: string;
}[] = [
    { kind: 'notice', href: '/aviso-legal' },
    { kind: 'privacy', href: '/privacidad' },
    { kind: 'cookies', href: '/cookies' },
];

function sectionsFor(locale: Locale, kind: LegalPageKind): readonly LegalSection[] {
    const tree = LEGAL_TREE[locale] ?? LEGAL_TREE.es;

    return (tree.legalPages[kind] ?? LEGAL_TREE.es.legalPages[kind]).sections;
}

function LegalBlockView({ block }: { readonly block: LegalBlock }) {
    if (block.type === 'p') {
        return (
            <p className="mt-3 text-[0.95rem] leading-relaxed text-qd-text-high">
                {block.text}
            </p>
        );
    }

    if (block.type === 'ul') {
        return (
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.95rem] leading-relaxed text-qd-text-high">
                {block.items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        );
    }

    return (
        <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-160 border-collapse text-left text-sm">
                <thead>
                    <tr className="border-b border-qd-mist dark:border-white/10">
                        {block.headers.map((header) => (
                            <th
                                key={header}
                                scope="col"
                                className="py-2.5 pr-4 align-bottom font-bold text-qd-ink dark:text-qd-white"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {block.rows.map((row) => (
                        <tr
                            key={row[0]}
                            className="border-b border-qd-mist/70 align-top dark:border-white/5"
                        >
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className={cn(
                                        'py-2.5 pr-4 leading-relaxed text-qd-text-high',
                                        cellIndex === 0 &&
                                            'font-semibold text-qd-ink dark:text-qd-white',
                                    )}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function LegalPage({ kind }: { readonly kind: LegalPageKind }) {
    const { t, locale } = useLanguage();
    const base = `legalPages.${kind}`;
    const sections = sectionsFor(locale, kind);
    const showToc = sections.length >= 4;

    // Solo en /cookies: permite volver a mostrar el aviso simple de cookies
    // borrando la marca de localStorage y recargando. No abre panel ni gestiona
    // categorías; el aviso vuelve a aparecer al recargar al no haber aceptación.
    const reshowCookieNotice = (): void => {
        try {
            window.localStorage.removeItem(COOKIE_NOTICE_STORAGE_KEY);
        } catch {
            // Almacenamiento no disponible: nada que borrar.
        }

        window.location.reload();
    };

    return (
        <PublicLayout>
            <SeoHead />

            <PublicPageHero
                eyebrow={t(`${base}.eyebrow`)}
                title={t(`${base}.title`)}
                subtitle={t(`${base}.subtitle`)}
                currentLabel={t(`${base}.breadcrumb`)}
                taglineTitle={t('legalPages.common.taglineTitle')}
                taglineSubtitle={t('legalPages.common.taglineSubtitle')}
                taglineIcon={ShieldCheck}
            />

            <section className="bg-qd-bg dark:bg-qd-ink">
                <div
                    className={cn(
                        'mx-auto grid max-w-310 gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:gap-14',
                        showToc && 'lg:grid-cols-[minmax(0,1fr)_280px]',
                    )}
                >
                    <div className="min-w-0">
                        {/* Última actualización */}
                        <p className="text-sm text-qd-text-medium">
                            {t('legalPages.common.updatedLabel')}:{' '}
                            {t('legalPages.common.updatedValue')}
                        </p>

                        {/* Solo en /cookies: volver a mostrar el aviso simple */}
                        {kind === 'cookies' && (
                            <button
                                type="button"
                                onClick={reshowCookieNotice}
                                className="mt-5 inline-flex max-w-full items-center gap-1.5 rounded-full border border-qd-mist px-4 py-1.5 text-left text-sm leading-snug font-semibold text-qd-text-high transition hover:border-qd-teal-2 hover:text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2 dark:border-white/15 dark:text-qd-text-medium dark:hover:border-qd-teal dark:hover:text-qd-teal"
                            >
                                {t('cookieNotice.reopen')}
                            </button>
                        )}

                        {/* Cuerpo legal */}
                        <div className="mt-8 max-w-[70ch] space-y-10">
                            {sections.map((section) => (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-28"
                                >
                                    <h2 className="text-xl font-bold text-qd-ink dark:text-qd-white">
                                        {section.heading}
                                    </h2>
                                    {section.blocks.map((block, blockIndex) => (
                                        <LegalBlockView
                                            key={blockIndex}
                                            block={block}
                                        />
                                    ))}
                                </section>
                            ))}
                        </div>

                        {/* Bloque de contacto/legal */}
                        <div className="mt-12 rounded-2xl border border-qd-mist bg-qd-white p-6 sm:p-7 dark:border-white/10 dark:bg-qd-surface">
                            <h2 className="text-lg font-bold text-qd-ink dark:text-qd-white">
                                {t('legalPages.common.contact.title')}
                            </h2>
                            <p className="mt-2 text-sm text-qd-text-high">
                                {t('legalPages.common.contact.intro')}
                            </p>
                            <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                                {[
                                    {
                                        label: t(
                                            'legalPages.common.contact.company',
                                        ),
                                        value: COMPANY.legalName,
                                    },
                                    {
                                        label: t(
                                            'legalPages.common.contact.cif',
                                        ),
                                        value: COMPANY.cif,
                                    },
                                    {
                                        label: t(
                                            'legalPages.common.contact.address',
                                        ),
                                        value: COMPANY.address,
                                    },
                                    {
                                        label: t(
                                            'legalPages.common.contact.registry',
                                        ),
                                        value: COMPANY.registry,
                                    },
                                ].map((row) => (
                                    <div key={row.label}>
                                        <dt className="font-semibold text-qd-ink dark:text-qd-white">
                                            {row.label}
                                        </dt>
                                        <dd className="mt-0.5 text-qd-text-high">
                                            {row.value}
                                        </dd>
                                    </div>
                                ))}
                                <div>
                                    <dt className="font-semibold text-qd-ink dark:text-qd-white">
                                        {t('legalPages.common.contact.email')}
                                    </dt>
                                    <dd className="mt-0.5">
                                        <a
                                            href={`mailto:${COMPANY.email}`}
                                            className="text-qd-teal-2 underline underline-offset-2 dark:text-qd-teal"
                                        >
                                            {COMPANY.email}
                                        </a>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-qd-ink dark:text-qd-white">
                                        {t('legalPages.common.contact.phone')}
                                    </dt>
                                    <dd className="mt-0.5">
                                        <a
                                            href={`tel:${COMPANY.phoneHref}`}
                                            className="text-qd-teal-2 underline underline-offset-2 dark:text-qd-teal"
                                        >
                                            {COMPANY.phone}
                                        </a>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-qd-ink dark:text-qd-white">
                                        {t('legalPages.common.contact.web')}
                                    </dt>
                                    <dd className="mt-0.5">
                                        <a
                                            href={COMPANY.domain}
                                            className="text-qd-teal-2 underline underline-offset-2 dark:text-qd-teal"
                                        >
                                            {COMPANY.domain}
                                        </a>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Enlaces cruzados */}
                        <nav
                            aria-label={t('legalPages.common.crossTitle')}
                            className="mt-8"
                        >
                            <p className="text-sm font-bold text-qd-ink dark:text-qd-white">
                                {t('legalPages.common.crossTitle')}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {CROSS_LINKS.filter(
                                    (link) => link.kind !== kind,
                                ).map((link) => (
                                    <a
                                        key={link.kind}
                                        href={link.href}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-qd-mist px-4 py-1.5 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-white/15 dark:text-qd-text-medium dark:hover:border-qd-teal dark:hover:text-qd-teal"
                                    >
                                        {t(`legalPages.common.links.${link.kind}`)}
                                    </a>
                                ))}
                                <a
                                    href="/contacto"
                                    className="inline-flex items-center gap-1.5 rounded-full border border-qd-mist px-4 py-1.5 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-white/15 dark:text-qd-text-medium dark:hover:border-qd-teal dark:hover:text-qd-teal"
                                >
                                    {t('legalPages.common.links.contact')}
                                    <ArrowRight aria-hidden="true" size={14} />
                                </a>
                            </div>
                        </nav>
                    </div>

                    {showToc && (
                        <aside className="lg:sticky lg:top-28 lg:self-start">
                            <nav
                                aria-label={t('legalPages.common.tocTitle')}
                                className="hidden rounded-2xl border border-qd-mist bg-qd-white p-5 lg:block dark:border-white/10 dark:bg-qd-surface"
                            >
                                <p className="text-sm font-bold text-qd-ink dark:text-qd-white">
                                    {t('legalPages.common.tocTitle')}
                                </p>
                                <ul className="mt-3 flex flex-col gap-2">
                                    {sections.map((section) => (
                                        <li key={section.id}>
                                            <a
                                                href={`#${section.id}`}
                                                className="flex gap-2 text-sm text-qd-text-high transition hover:text-qd-teal-2 dark:hover:text-qd-teal"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-qd-teal-2/50 dark:bg-qd-teal/50"
                                                />
                                                {section.heading}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </aside>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}

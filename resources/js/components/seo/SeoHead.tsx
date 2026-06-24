import { Head, usePage } from '@inertiajs/react';

/**
 * SEO base de una página pública. Centraliza el `<Head>` cliente y lee el
 * payload `seo` que sirve el backend (resuelto desde `seo_metadata` con
 * fallbacks). El HTML inicial ya trae estos tags desde `app.blade.php`; aquí se
 * declaran con el mismo `head-key` para que Inertia los reconcilie (sin
 * duplicar) y los actualice al navegar entre páginas (SPA).
 *
 * Cubre title/description/canonical/robots y los metadatos sociales básicos
 * (Open Graph / Twitter Cards). og:url usa el canonical resuelto; og:image se
 * omite cuando el backend no resuelve una imagen social segura. JSON-LD y
 * hreflang quedan fuera.
 */
export type SeoPayload = {
    readonly title: string;
    readonly description: string;
    readonly canonical: string;
    readonly robots: string;
    readonly ogTitle: string;
    readonly ogDescription: string;
    readonly ogImage: string | null;
    readonly ogType: string;
};

type SeoHeadProps = {
    /** Sobrescribe el título servido. Por defecto usa `seo.title` del backend. */
    readonly title?: string;
};

// `head-key` no es un atributo HTML estándar (lo consume el head-manager de
// Inertia para reconciliar). Se inyecta por spread para no chocar con los tipos
// JSX de los elementos intrínsecos.
const headKey = (key: string): { 'head-key': string } => ({ 'head-key': key });

export default function SeoHead({ title }: SeoHeadProps) {
    const { seo } = usePage<{ seo?: SeoPayload }>().props;

    if (!seo) {
        return title ? <Head title={title} /> : null;
    }

    const ogTitle = title ?? seo.ogTitle;

    return (
        <Head title={title ?? seo.title}>
            <meta
                name="description"
                content={seo.description}
                {...headKey('seo-description')}
            />
            <link
                rel="canonical"
                href={seo.canonical}
                {...headKey('seo-canonical')}
            />
            <meta name="robots" content={seo.robots} {...headKey('seo-robots')} />

            {/* Open Graph: og:url = canonical; og:image solo si el backend
                resuelve una imagen social segura. */}
            <meta property="og:title" content={ogTitle} {...headKey('seo-og-title')} />
            <meta
                property="og:description"
                content={seo.ogDescription}
                {...headKey('seo-og-description')}
            />
            <meta property="og:url" content={seo.canonical} {...headKey('seo-og-url')} />
            <meta property="og:type" content={seo.ogType} {...headKey('seo-og-type')} />
            {seo.ogImage ? (
                <meta property="og:image" content={seo.ogImage} {...headKey('seo-og-image')} />
            ) : null}

            {/* Twitter Cards: reflejan los valores OG. */}
            <meta
                name="twitter:card"
                content="summary_large_image"
                {...headKey('seo-twitter-card')}
            />
            <meta name="twitter:title" content={ogTitle} {...headKey('seo-twitter-title')} />
            <meta
                name="twitter:description"
                content={seo.ogDescription}
                {...headKey('seo-twitter-description')}
            />
            {seo.ogImage ? (
                <meta
                    name="twitter:image"
                    content={seo.ogImage}
                    {...headKey('seo-twitter-image')}
                />
            ) : null}
        </Head>
    );
}

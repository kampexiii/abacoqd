import { Head, usePage } from '@inertiajs/react';

/**
 * SEO base de una página pública. Centraliza el `<Head>` cliente y lee el
 * payload `seo` que sirve el backend (resuelto desde `seo_metadata` con
 * fallbacks). El HTML inicial ya trae estos tags desde `app.blade.php`; aquí se
 * declaran con el mismo `head-key` para que Inertia los reconcilie (sin
 * duplicar) y los actualice al navegar entre páginas (SPA).
 *
 * Decisión del primer bloque: solo title/description/canonical/robots. Open
 * Graph, Twitter Cards y JSON-LD quedan fuera.
 */
export type SeoPayload = {
    readonly title: string;
    readonly description: string;
    readonly canonical: string;
    readonly robots: string;
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
        </Head>
    );
}

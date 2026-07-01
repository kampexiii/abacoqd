import type { Locale } from '@/hooks/use-language';

/**
 * Tipos y helpers de datos del Blog público compartidos entre `Blog.tsx`,
 * `BlogPost.tsx` y `BlogSection.tsx` (landing). Viven fuera de `pages/Public`
 * a propósito: si los componentes de la landing importaran directamente de
 * una página Inertia (`Blog.tsx`), Vite deja de tratar esa página como su
 * propio entry point del manifest (queda fusionada en un chunk compartido) y
 * la ruta `/blog` rompe en producción con "Unable to locate file in Vite
 * manifest". Mantener aquí el modelo de datos evita ese problema.
 */

export type LocalizedText = {
    readonly es?: string | null;
    readonly en?: string | null;
};

export function localizedText(
    value: LocalizedText | null | undefined,
    locale: Locale,
): string {
    if (!value) {
        return '';
    }

    return value[locale] ?? value.es ?? value.en ?? '';
}

export type BlogCategorySummary = {
    readonly name: LocalizedText;
    readonly slug: LocalizedText;
};

export type BlogPostSummary = {
    readonly id: number;
    readonly title: LocalizedText;
    readonly slug: LocalizedText;
    readonly excerpt: LocalizedText;
    readonly coverImage: string | null;
    readonly category: BlogCategorySummary | null;
    readonly publishedAt: string | null;
    readonly readingTime: number | null;
};

type BlogCoverImageAttributes = {
    readonly src: string;
    readonly srcSet?: string;
    readonly width?: number;
    readonly height?: number;
};

const BLOG_COVER_IMAGE_VARIANTS: Record<string, BlogCoverImageAttributes> = {
    '/uploads/blog/posts/ia-supervisada-acelerar-sin-perder-criterio-tecnico.webp':
        {
            src: '/uploads/blog/posts/ia-supervisada-acelerar-sin-perder-criterio-tecnico-960w.webp',
            srcSet: [
                '/uploads/blog/posts/ia-supervisada-acelerar-sin-perder-criterio-tecnico-640w.webp 640w',
                '/uploads/blog/posts/ia-supervisada-acelerar-sin-perder-criterio-tecnico-960w.webp 960w',
            ].join(', '),
            width: 960,
            height: 540,
        },
    '/uploads/blog/posts/que-es-abacoqd-y-como-trabaja.webp': {
        src: '/uploads/blog/posts/que-es-abacoqd-y-como-trabaja-960w.webp',
        srcSet: [
            '/uploads/blog/posts/que-es-abacoqd-y-como-trabaja-640w.webp 640w',
            '/uploads/blog/posts/que-es-abacoqd-y-como-trabaja-960w.webp 960w',
        ].join(', '),
        width: 960,
        height: 640,
    },
    '/uploads/blog/posts/abacoqd-renovamos-identidad-software-a-medida-rapidez-criterio.webp':
        {
            src: '/uploads/blog/posts/abacoqd-renovamos-identidad-software-a-medida-rapidez-criterio-960w.webp',
            srcSet: [
                '/uploads/blog/posts/abacoqd-renovamos-identidad-software-a-medida-rapidez-criterio-640w.webp 640w',
                '/uploads/blog/posts/abacoqd-renovamos-identidad-software-a-medida-rapidez-criterio-960w.webp 960w',
            ].join(', '),
            width: 960,
            height: 540,
        },
};

export function blogCoverImageAttributes(
    src: string,
): BlogCoverImageAttributes {
    return BLOG_COVER_IMAGE_VARIANTS[src] ?? { src };
}

/** Entrada del índice "En esta página" del detalle (un H2 por entrada). */
export type BlogTocItem = {
    readonly id: string;
    readonly text: string;
};

export function postHref(post: Pick<BlogPostSummary, 'slug'>): string | null {
    const slug = post.slug.es ?? post.slug.en ?? null;

    return slug ? `/blog/${slug}` : null;
}

export function formatPostDate(
    value: string | null,
    locale: Locale,
): string | null {
    if (!value) {
        return null;
    }

    return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
}

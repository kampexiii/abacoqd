import { ArrowRight, FileText } from 'lucide-react';

import { useInView } from '@/hooks/use-in-view';
import { useLanguage } from '@/hooks/use-language';
import type { BlogPostSummary } from '@/lib/blog';
import {
    blogCoverImageAttributes,
    formatPostDate,
    localizedText,
    postHref,
} from '@/lib/blog';
import { cn } from '@/lib/utils';

/**
 * Sección Blog de la landing. docs/07_VISTAS/PUBLIC_01_HOME_LANDING.md.
 *
 * Maquetación: 1 card grande (imagen superior + texto debajo, sin ilustración
 * lateral) + 2 pequeñas, vía `.qd-blog-layout`/`.qd-blog-main`/
 * `.qd-blog-secondary`. Los datos vienen de `HomeController`: `featuredPost`
 * de `Post::featured()` y `latestPosts` de los últimos publicados con
 * `show_on_home`. Sin destacado no se inventan posts: se muestra un estado
 * controlado.
 */

function CoverVisual({
    src,
    sizes,
}: {
    readonly src: string | null;
    readonly sizes: string;
}) {
    if (src) {
        const image = blogCoverImageAttributes(src);

        return (
            <img
                src={image.src}
                srcSet={image.srcSet}
                sizes={image.srcSet ? sizes : undefined}
                width={image.width}
                height={image.height}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
            />
        );
    }

    return (
        <div
            aria-hidden="true"
            className="qd-blog-code-visual items-center justify-center"
        >
            <FileText size={28} strokeWidth={1.5} className="text-white/15" />
        </div>
    );
}

function postMeta(
    post: BlogPostSummary,
    locale: 'es' | 'en',
    t: (key: string) => string,
): string {
    const date = formatPostDate(post.publishedAt, locale);
    const reading =
        post.readingTime !== null
            ? `${post.readingTime} ${t('blogPage.minutesShort')}`
            : null;

    return [date, reading].filter(Boolean).join(' · ');
}

type BlogSectionProps = {
    readonly featuredPost: BlogPostSummary | null;
    readonly latestPosts: readonly BlogPostSummary[];
};

export default function BlogSection({
    featuredPost,
    latestPosts,
}: BlogSectionProps) {
    const { t, locale } = useLanguage();
    const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.12 });

    return (
        <section id="blog" className="abaco-section">
            <div className="abaco-section__inner">
                <div
                    ref={ref}
                    className={cn(
                        'qd-blog__head abaco-reveal',
                        inView && 'is-visible',
                    )}
                >
                    <div className="qd-blog__head-text">
                        <p className="abaco-section-eyebrow">
                            {t('home.blog.eyebrow')}
                        </p>
                        <h2 className="abaco-section-title">
                            {t('home.blog.title')}
                        </h2>
                        <p className="abaco-section-lead">
                            {t('home.blog.lead')}
                        </p>
                    </div>
                    <a href="/blog" className="qd-blog__cta-all">
                        {t('home.blog.ctaAll')}
                        <ArrowRight aria-hidden="true" size={16} />
                    </a>
                </div>

                {featuredPost ? (
                    <div
                        className={cn(
                            'qd-blog-layout abaco-stagger',
                            inView && 'is-visible',
                        )}
                    >
                        <article className="qd-blog-main">
                            <div className="qd-blog-card__visual">
                                <CoverVisual
                                    src={featuredPost.coverImage}
                                    sizes="(min-width: 1024px) 52vw, calc(100vw - 2.5rem)"
                                />
                            </div>
                            <div className="qd-blog-card__body qd-blog-card__body--featured">
                                <div className="qd-blog-main__copy">
                                    {featuredPost.category && (
                                        <span className="qd-blog-card__cat">
                                            {localizedText(
                                                featuredPost.category.name,
                                                locale,
                                            )}
                                        </span>
                                    )}
                                    <h3 className="qd-blog-card__title">
                                        {localizedText(
                                            featuredPost.title,
                                            locale,
                                        )}
                                    </h3>
                                    <p className="qd-blog-card__summary">
                                        {localizedText(
                                            featuredPost.excerpt,
                                            locale,
                                        )}
                                    </p>
                                </div>
                                <div className="qd-blog-main__footer">
                                    <span className="qd-blog-card__meta">
                                        {postMeta(featuredPost, locale, t)}
                                    </span>
                                    <a
                                        href={postHref(featuredPost) ?? '/blog'}
                                        className="qd-blog-card__read"
                                    >
                                        {t('home.blog.cta')}
                                        <ArrowRight
                                            aria-hidden="true"
                                            size={14}
                                        />
                                    </a>
                                </div>
                            </div>
                        </article>

                        {latestPosts.map((post) => (
                            <article
                                key={post.id}
                                className="qd-blog-secondary"
                            >
                                <div className="qd-blog-card__visual">
                                    <CoverVisual
                                        src={post.coverImage}
                                        sizes="(min-width: 1024px) 38vw, calc(100vw - 2.5rem)"
                                    />
                                </div>
                                <div className="qd-blog-card__body">
                                    {post.category && (
                                        <span className="qd-blog-card__cat">
                                            {localizedText(
                                                post.category.name,
                                                locale,
                                            )}
                                        </span>
                                    )}
                                    <h3 className="qd-blog-card__title">
                                        {localizedText(post.title, locale)}
                                    </h3>
                                    <p className="qd-blog-card__summary">
                                        {localizedText(post.excerpt, locale)}
                                    </p>
                                    <span className="qd-blog-card__meta">
                                        {postMeta(post, locale, t)}
                                    </span>
                                    <a
                                        href={postHref(post) ?? '/blog'}
                                        className="qd-blog-card__read"
                                    >
                                        {t('home.blog.cta')}
                                        <ArrowRight
                                            aria-hidden="true"
                                            size={14}
                                        />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div
                        className={cn(
                            'abaco-reveal rounded-2xl border border-qd-mist bg-qd-white/60 p-10 text-center dark:border-white/10 dark:bg-white/5',
                            inView && 'is-visible',
                        )}
                    >
                        <p className="text-sm text-qd-text-high">
                            {t('home.blog.emptyText')}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

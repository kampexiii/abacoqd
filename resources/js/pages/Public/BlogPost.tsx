import { Head } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock, FileText, Tag as TagIcon } from 'lucide-react';

import PublicPageHero from '@/components/public/PublicPageHero';
import { useLanguage } from '@/hooks/use-language';
import PublicLayout from '@/layouts/public-layout';
import type { BlogPostSummary, LocalizedText } from '@/lib/blog';
import { formatPostDate, localizedText } from '@/lib/blog';
import { show as bookingShow } from '@/routes/booking';
import { show as contactShow } from '@/routes/contact';

import { PostCard } from './Blog';

/**
 * Detalle público de un post. docs/07_VISTAS/PUBLIC_05_BLOG.md.
 *
 * `contentHtml` ya viene renderizado desde Markdown vía `Str::markdown()` en
 * `BlogController` (CommonMark escapa HTML crudo del origen por defecto), así
 * que `dangerouslySetInnerHTML` aquí no abre una vía de XSS adicional.
 */

type BlogPostDetail = BlogPostSummary & {
    readonly contentHtml: LocalizedText;
    readonly tags: readonly { readonly name: LocalizedText; readonly slug: LocalizedText }[];
};

type BlogPostPageProps = {
    readonly post: BlogPostDetail;
    readonly related: readonly BlogPostSummary[];
};

export default function BlogPost({ post, related }: BlogPostPageProps) {
    const { t, locale } = useLanguage();
    const title = localizedText(post.title, locale);
    const excerpt = localizedText(post.excerpt, locale);
    const categoryName = post.category
        ? localizedText(post.category.name, locale)
        : null;
    const categorySlug = post.category
        ? post.category.slug.es ?? post.category.slug.en ?? null
        : null;
    const date = formatPostDate(post.publishedAt, locale);
    const contentHtml = localizedText(post.contentHtml, locale);

    return (
        <PublicLayout>
            <Head title={`${title} | Abaco Developments`} />

            <PublicPageHero
                eyebrow={categoryName ?? t('blogPage.hero.eyebrow')}
                title={title}
                subtitle={excerpt}
                currentLabel={title}
                parentLabel={t('navigation.items.blog')}
                parentHref="/blog"
                taglineTitle={t('blogDetailPage.heroTagline.title')}
                taglineSubtitle={t('blogDetailPage.heroTagline.subtitle')}
                taglineIcon={FileText}
            />

            <section className="bg-qd-bg dark:bg-qd-ink">
                <div className="mx-auto max-w-[820px] px-5 py-10 sm:px-8">
                    <div className="flex flex-wrap items-center gap-4 border-b border-qd-mist pb-6 text-sm font-semibold text-qd-text-medium dark:border-white/10">
                        <span>{t('blogDetailPage.author')}</span>
                        {date && (
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar aria-hidden="true" size={14} />
                                <time dateTime={post.publishedAt ?? undefined}>
                                    {date}
                                </time>
                            </span>
                        )}
                        {post.readingTime !== null && (
                            <span className="inline-flex items-center gap-1.5">
                                <Clock aria-hidden="true" size={14} />
                                {post.readingTime} {t('blogPage.minutesShort')}
                            </span>
                        )}
                    </div>

                    {post.coverImage && (
                        <img
                            src={post.coverImage}
                            alt=""
                            className="mt-8 w-full rounded-2xl object-cover"
                        />
                    )}

                    {contentHtml ? (
                        <div
                            className="qd-article-body mt-8"
                            // Seguro: ver nota de seguridad arriba (CommonMark
                            // escapa HTML crudo del Markdown origen).
                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                        />
                    ) : (
                        <p className="mt-8 text-sm text-qd-text-high">
                            {t('blogDetailPage.noContent')}
                        </p>
                    )}

                    {post.tags.length > 0 && (
                        <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-qd-mist pt-6 dark:border-white/10">
                            <TagIcon
                                aria-hidden="true"
                                size={14}
                                className="text-qd-text-medium"
                            />
                            {post.tags.map((tag) => {
                                const tagSlug = tag.slug.es ?? tag.slug.en;

                                return (
                                    <span
                                        key={tagSlug ?? localizedText(tag.name, locale)}
                                        className="rounded-full bg-qd-mist px-3 py-1 text-xs font-semibold text-qd-text-high dark:bg-white/5 dark:text-qd-text-medium"
                                    >
                                        {localizedText(tag.name, locale)}
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {categorySlug && (
                        <a
                            href={`/blog?categoria=${categorySlug}`}
                            className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-qd-teal-2 dark:text-qd-teal"
                        >
                            {t('blogDetailPage.backToCategory')}
                            <ArrowRight aria-hidden="true" size={14} />
                        </a>
                    )}
                </div>
            </section>

            {related.length > 0 && (
                <section className="bg-qd-white dark:bg-qd-ink">
                    <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8">
                        <h2 className="text-xl font-bold text-qd-ink sm:text-2xl dark:text-qd-white">
                            {t('blogDetailPage.relatedTitle')}
                        </h2>
                        <div className="mt-7 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((item) => (
                                <PostCard
                                    key={item.id}
                                    post={item}
                                    locale={locale}
                                    t={t}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="bg-qd-ink">
                <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
                    <div>
                        <h2 className="text-2xl font-bold text-qd-white sm:text-3xl">
                            {t('blogDetailPage.cta.title')}
                        </h2>
                        <p className="mt-2 max-w-md text-sm text-qd-text-medium sm:text-base">
                            {t('blogDetailPage.cta.subtitle')}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={contactShow.url()}
                            className="inline-flex items-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-semibold text-qd-ink transition hover:brightness-95"
                        >
                            {t('blogDetailPage.cta.primary')}
                            <ArrowRight aria-hidden="true" size={16} />
                        </a>
                        <a
                            href={bookingShow.url()}
                            className="inline-flex items-center gap-2 rounded-xl border border-qd-white/20 px-5 py-3 text-sm font-semibold text-qd-white transition hover:border-qd-teal hover:text-qd-teal"
                        >
                            {t('blogDetailPage.cta.secondary')}
                            <ArrowRight aria-hidden="true" size={16} />
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

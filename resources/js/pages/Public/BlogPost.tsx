import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    Check,
    ChevronRight,
    Clock,
    FileText,
    Folder,
    Home,
    Link2,
    Linkedin,
    MessageSquare,
    Twitter,
    User,
} from 'lucide-react';
import { useState } from 'react';

import { useLanguage } from '@/hooks/use-language';
import PublicLayout from '@/layouts/public-layout';
import type {
    BlogPostSummary,
    BlogTocItem,
    LocalizedText,
} from '@/lib/blog';
import { formatPostDate, localizedText, postHref } from '@/lib/blog';
import { cn } from '@/lib/utils';
import { show as bookingShow } from '@/routes/booking';
import { show as contactShow } from '@/routes/contact';

/**
 * Detalle público de un post. docs/07_VISTAS/PUBLIC_05_BLOG.md.
 *
 * Cabecera editorial propia (compatible con el sistema, no `PublicPageHero`):
 * el cover del post ocupa el lateral derecho del hero en vez del cubo. El
 * contenido se lee 100% desde BD; `contentHtml` viene renderizado desde
 * Markdown vía `Str::markdown()` en `BlogController` (CommonMark escapa el
 * HTML crudo del origen por defecto), así que `dangerouslySetInnerHTML` aquí
 * no abre una vía de XSS adicional.
 */

type LocalizedToc = {
    readonly es?: readonly BlogTocItem[] | null;
    readonly en?: readonly BlogTocItem[] | null;
};

type BlogPostDetail = BlogPostSummary & {
    readonly contentHtml: LocalizedText;
    readonly toc: LocalizedToc;
    readonly tags: readonly {
        readonly name: LocalizedText;
        readonly slug: LocalizedText;
    }[];
};

type BlogPostPageProps = {
    readonly post: BlogPostDetail;
    readonly related: readonly BlogPostSummary[];
};

export default function BlogPost({ post, related }: BlogPostPageProps) {
    const { t, locale } = useLanguage();
    const [copied, setCopied] = useState(false);

    const title = localizedText(post.title, locale);
    const excerpt = localizedText(post.excerpt, locale);
    const categoryName = post.category
        ? localizedText(post.category.name, locale)
        : null;
    const date = formatPostDate(post.publishedAt, locale);
    const contentHtml = localizedText(post.contentHtml, locale);
    const toc = post.toc[locale] ?? post.toc.es ?? post.toc.en ?? [];

    const shareUrl = (): string =>
        typeof window === 'undefined' ? '' : window.location.href;

    const openShare = (base: string): void => {
        window.open(base, '_blank', 'noopener,noreferrer');
    };

    const copyLink = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(shareUrl());
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <PublicLayout>
            <Head title={`${title} | Abaco Developments`} />

            {/* Cabecera editorial: texto a la izquierda, cover a la derecha */}
            <section className="relative overflow-hidden">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-qd-mist/55 dark:bg-qd-surface/55"
                />
                <div className="relative mx-auto max-w-[1240px] px-5 pt-28 pb-12 sm:px-8 sm:pt-32 sm:pb-16">
                    <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                        <div className="min-w-0">
                            <nav aria-label="Breadcrumb" className="mb-6">
                                <ol className="flex flex-wrap items-center gap-1.5 text-xs text-qd-text-medium">
                                    <li>
                                        <a
                                            href="/"
                                            className="flex items-center gap-1 hover:text-qd-teal-2 dark:hover:text-qd-teal"
                                        >
                                            <Home aria-hidden="true" size={12} />
                                            {t('navigation.breadcrumbHome')}
                                        </a>
                                    </li>
                                    <li aria-hidden="true">
                                        <ChevronRight size={12} />
                                    </li>
                                    <li>
                                        <a
                                            href="/blog"
                                            className="hover:text-qd-teal-2 dark:hover:text-qd-teal"
                                        >
                                            {t('navigation.items.blog')}
                                        </a>
                                    </li>
                                    <li aria-hidden="true">
                                        <ChevronRight size={12} />
                                    </li>
                                    <li
                                        aria-current="page"
                                        className="line-clamp-1 font-medium text-qd-ink dark:text-qd-white"
                                    >
                                        {title}
                                    </li>
                                </ol>
                            </nav>

                            <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-qd-teal-2 dark:text-qd-teal">
                                <span
                                    aria-hidden="true"
                                    className="inline-block size-1.5 rounded-full bg-qd-teal-2 dark:bg-qd-teal"
                                />
                                {t('blogPage.hero.eyebrow')}
                            </p>

                            <h1 className="mt-3 text-3xl font-bold text-qd-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] dark:text-qd-white">
                                {title}
                            </h1>

                            {excerpt && (
                                <p className="mt-4 max-w-xl text-base text-qd-text-high">
                                    {excerpt}
                                </p>
                            )}

                            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-qd-text-medium">
                                {categoryName && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Folder aria-hidden="true" size={14} />
                                        {categoryName}
                                    </span>
                                )}
                                {date && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Calendar aria-hidden="true" size={14} />
                                        <time
                                            dateTime={post.publishedAt ?? undefined}
                                        >
                                            {date}
                                        </time>
                                    </span>
                                )}
                                {post.readingTime !== null && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock aria-hidden="true" size={14} />
                                        {post.readingTime}{' '}
                                        {t('blogPage.minutesShort')}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1.5">
                                    <User aria-hidden="true" size={14} />
                                    {t('blogDetailPage.author')}
                                </span>
                            </div>
                        </div>

                        <div className="qd-blog-cover aspect-video w-full overflow-hidden rounded-2xl">
                            {post.coverImage ? (
                                <img
                                    src={post.coverImage}
                                    alt={title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div
                                    aria-hidden="true"
                                    className="flex h-full w-full items-center justify-center bg-linear-to-br from-qd-mist to-qd-white text-qd-teal-2 dark:from-qd-surface dark:to-qd-ink dark:text-qd-teal"
                                >
                                    <FileText size={40} strokeWidth={1.4} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Cuerpo + sidebar */}
            <section className="bg-qd-bg dark:bg-qd-ink">
                <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
                    <article className="min-w-0">
                        {contentHtml ? (
                            <div
                                className="qd-article-body"
                                // Seguro: ver nota de seguridad en la cabecera
                                // del archivo (CommonMark escapa el HTML crudo
                                // del Markdown origen).
                                dangerouslySetInnerHTML={{ __html: contentHtml }}
                            />
                        ) : (
                            <p className="text-sm text-qd-text-high">
                                {t('blogDetailPage.noContent')}
                            </p>
                        )}

                        {/* CTA contextual de cierre */}
                        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-qd-teal-2/20 bg-qd-teal-2/5 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-qd-teal/20 dark:bg-qd-teal/5">
                            <div className="flex items-start gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-qd-teal-2/10 text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal">
                                    <MessageSquare aria-hidden="true" size={20} />
                                </span>
                                <p className="max-w-md text-sm font-medium text-qd-ink dark:text-qd-white">
                                    {t('blogDetailPage.inlineCta.text')}
                                </p>
                            </div>
                            <a
                                href={contactShow.url()}
                                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-qd-lime px-5 py-2.5 text-sm font-semibold text-qd-ink transition hover:brightness-95"
                            >
                                {t('blogDetailPage.inlineCta.button')}
                                <ArrowRight aria-hidden="true" size={16} />
                            </a>
                        </div>

                        {/* Tags + compartir */}
                        <div className="mt-8 flex flex-col gap-5 border-t border-qd-mist pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                            {post.tags.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-semibold text-qd-text-medium">
                                        {t('blogDetailPage.tagsLabel')}
                                    </span>
                                    {post.tags.map((tag) => (
                                        <span
                                            key={
                                                tag.slug.es ??
                                                tag.slug.en ??
                                                localizedText(tag.name, locale)
                                            }
                                            className="rounded-full bg-qd-mist px-3 py-1 text-xs font-semibold text-qd-text-high dark:bg-white/5 dark:text-qd-text-medium"
                                        >
                                            {localizedText(tag.name, locale)}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-qd-text-medium">
                                    {t('blogDetailPage.share.label')}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        openShare(
                                            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl())}`,
                                        )
                                    }
                                    aria-label={t('blogDetailPage.share.linkedin')}
                                    className="flex size-9 items-center justify-center rounded-full border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-white/15 dark:text-qd-text-medium dark:hover:border-qd-teal dark:hover:text-qd-teal"
                                >
                                    <Linkedin aria-hidden="true" size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        openShare(
                                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl())}`,
                                        )
                                    }
                                    aria-label={t('blogDetailPage.share.x')}
                                    className="flex size-9 items-center justify-center rounded-full border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-white/15 dark:text-qd-text-medium dark:hover:border-qd-teal dark:hover:text-qd-teal"
                                >
                                    <Twitter aria-hidden="true" size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={copyLink}
                                    aria-label={
                                        copied
                                            ? t('blogDetailPage.share.copied')
                                            : t('blogDetailPage.share.copy')
                                    }
                                    className={cn(
                                        'flex size-9 items-center justify-center rounded-full border transition',
                                        copied
                                            ? 'border-qd-teal-2 text-qd-teal-2 dark:border-qd-teal dark:text-qd-teal'
                                            : 'border-qd-mist text-qd-text-high hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-white/15 dark:text-qd-text-medium dark:hover:border-qd-teal dark:hover:text-qd-teal',
                                    )}
                                >
                                    {copied ? (
                                        <Check aria-hidden="true" size={16} />
                                    ) : (
                                        <Link2 aria-hidden="true" size={16} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </article>

                    <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
                        {toc.length >= 3 && (
                            <nav
                                aria-label={t('blogDetailPage.tocTitle')}
                                className="hidden rounded-2xl border border-qd-mist bg-qd-white p-5 lg:block dark:border-white/10 dark:bg-qd-surface"
                            >
                                <p className="text-sm font-bold text-qd-ink dark:text-qd-white">
                                    {t('blogDetailPage.tocTitle')}
                                </p>
                                <ul className="mt-3 flex flex-col gap-2">
                                    {toc.map((item) => (
                                        <li key={item.id}>
                                            <a
                                                href={`#${item.id}`}
                                                className="flex gap-2 text-sm text-qd-text-high transition hover:text-qd-teal-2 dark:hover:text-qd-teal"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-qd-teal-2/50 dark:bg-qd-teal/50"
                                                />
                                                {item.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}

                        {related.length > 0 && (
                            <div className="rounded-2xl border border-qd-mist bg-qd-white p-5 dark:border-white/10 dark:bg-qd-surface">
                                <p className="text-sm font-bold text-qd-ink dark:text-qd-white">
                                    {t('blogDetailPage.relatedTitle')}
                                </p>
                                <ul className="mt-4 flex flex-col gap-4">
                                    {related.map((item) => {
                                        const href = postHref(item);
                                        const itemDate = formatPostDate(
                                            item.publishedAt,
                                            locale,
                                        );

                                        return (
                                            <li key={item.id}>
                                                <a
                                                    href={href ?? '/blog'}
                                                    className="group flex gap-3"
                                                >
                                                    <span className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-qd-mist bg-qd-mist dark:border-white/10 dark:bg-white/5">
                                                        {item.coverImage ? (
                                                            <img
                                                                src={
                                                                    item.coverImage
                                                                }
                                                                alt=""
                                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]"
                                                            />
                                                        ) : (
                                                            <span
                                                                aria-hidden="true"
                                                                className="flex h-full w-full items-center justify-center text-qd-teal-2 dark:text-qd-teal"
                                                            >
                                                                <FileText
                                                                    size={16}
                                                                />
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="min-w-0">
                                                        <span className="line-clamp-2 text-sm font-semibold text-qd-ink transition group-hover:text-qd-teal-2 dark:text-qd-white dark:group-hover:text-qd-teal">
                                                            {localizedText(
                                                                item.title,
                                                                locale,
                                                            )}
                                                        </span>
                                                        <span className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-qd-text-medium">
                                                            {itemDate && (
                                                                <time
                                                                    dateTime={
                                                                        item.publishedAt ??
                                                                        undefined
                                                                    }
                                                                >
                                                                    {itemDate}
                                                                </time>
                                                            )}
                                                            {item.readingTime !==
                                                                null && (
                                                                <span>
                                                                    ·{' '}
                                                                    {
                                                                        item.readingTime
                                                                    }{' '}
                                                                    {t(
                                                                        'blogPage.minutesShort',
                                                                    )}
                                                                </span>
                                                            )}
                                                        </span>
                                                    </span>
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        <div className="rounded-2xl bg-qd-ink p-6 text-qd-white">
                            <p className="text-base font-bold">
                                {t('blogDetailPage.sidebarCta.title')}
                            </p>
                            <p className="mt-2 text-sm text-qd-text-medium">
                                {t('blogDetailPage.sidebarCta.text')}
                            </p>
                            <a
                                href={bookingShow.url()}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-qd-teal-2 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 dark:bg-qd-lime dark:text-qd-ink dark:hover:brightness-95"
                            >
                                {t('blogDetailPage.sidebarCta.button')}
                                <ArrowRight aria-hidden="true" size={16} />
                            </a>
                        </div>
                    </aside>
                </div>
            </section>
        </PublicLayout>
    );
}

import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    Clock,
    FileText,
    Search,
    X,
} from 'lucide-react';

import PublicPageHero from '@/components/public/PublicPageHero';
import { useLanguage } from '@/hooks/use-language';
import type { Locale } from '@/hooks/use-language';
import PublicLayout from '@/layouts/public-layout';
import type { BlogCategorySummary, BlogPostSummary } from '@/lib/blog';
import { formatPostDate, localizedText, postHref } from '@/lib/blog';
import { cn } from '@/lib/utils';
import { show as bookingShow } from '@/routes/booking';
import { show as contactShow } from '@/routes/contact';

/**
 * Vista pública Blog. docs/07_VISTAS/PUBLIC_05_BLOG.md.
 *
 * Tipos y helpers de datos viven en `@/lib/blog` (no aquí): `BlogSection.tsx`
 * los necesita desde la landing (`Home.tsx`) y un componente fuera de
 * `pages/Public` no puede importar de una página Inertia sin romper el
 * manifest de Vite de esa página (ver comentario en `@/lib/blog`).
 */

type PaginatedPosts = {
    readonly data: readonly BlogPostSummary[];
    readonly current_page: number;
    readonly last_page: number;
};

type BlogFilters = {
    readonly search: string;
    readonly category: string;
};

type BlogProps = {
    readonly featuredPost: BlogPostSummary | null;
    readonly posts: PaginatedPosts;
    readonly categories: readonly BlogCategorySummary[];
    readonly filters: BlogFilters;
};

function buildBlogUrl(
    filters: Partial<BlogFilters> & { readonly page?: number },
): string {
    const params = new URLSearchParams();

    if (filters.search) {
        params.set('buscar', filters.search);
    }

    if (filters.category) {
        params.set('categoria', filters.category);
    }

    if (filters.page && filters.page > 1) {
        params.set('page', String(filters.page));
    }

    const query = params.toString();

    return query ? `/blog?${query}` : '/blog';
}

function getPageItems(
    current: number,
    last: number,
): readonly (number | 'ellipsis')[] {
    if (last <= 7) {
        return Array.from({ length: last }, (_, index) => index + 1);
    }

    const items: (number | 'ellipsis')[] = [1];

    if (current > 3) {
        items.push('ellipsis');
    }

    for (
        let page = Math.max(2, current - 1);
        page <= Math.min(last - 1, current + 1);
        page++
    ) {
        items.push(page);
    }

    if (current < last - 2) {
        items.push('ellipsis');
    }

    items.push(last);

    return items;
}

function CoverFallback() {
    return (
        <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-linear-to-br from-qd-mist to-qd-white text-qd-teal-2 dark:from-qd-surface dark:to-qd-ink dark:text-qd-teal"
        >
            <FileText size={28} strokeWidth={1.5} />
        </div>
    );
}

function PostMeta({
    post,
    locale,
    t,
}: {
    readonly post: BlogPostSummary;
    readonly locale: Locale;
    readonly t: (key: string) => string;
}) {
    const date = formatPostDate(post.publishedAt, locale);

    return (
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-qd-text-medium">
            {date && (
                <span className="inline-flex items-center gap-1.5">
                    <Calendar aria-hidden="true" size={13} />
                    <time dateTime={post.publishedAt ?? undefined}>
                        {date}
                    </time>
                </span>
            )}
            {post.readingTime !== null && (
                <span className="inline-flex items-center gap-1.5">
                    <Clock aria-hidden="true" size={13} />
                    {post.readingTime} {t('blogPage.minutesShort')}
                </span>
            )}
        </div>
    );
}

function FeaturedPostCard({
    post,
    locale,
    t,
}: {
    readonly post: BlogPostSummary;
    readonly locale: Locale;
    readonly t: (key: string) => string;
}) {
    const href = postHref(post);
    const title = localizedText(post.title, locale);
    const excerpt = localizedText(post.excerpt, locale);
    const category = post.category
        ? localizedText(post.category.name, locale)
        : null;

    return (
        <a
            href={href ?? '/blog'}
            className="group grid overflow-hidden rounded-3xl border border-qd-mist bg-qd-white transition hover:-translate-y-1 hover:border-qd-teal-2/60 hover:shadow-[0_24px_70px_-42px_rgba(15,143,149,0.45)] sm:grid-cols-2 dark:border-white/10 dark:bg-qd-surface dark:hover:border-qd-teal/60"
        >
            <div className="h-56 overflow-hidden sm:h-full">
                {post.coverImage ? (
                    <img
                        src={post.coverImage}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                ) : (
                    <CoverFallback />
                )}
            </div>
            <div className="flex flex-col gap-4 p-7 sm:p-9">
                {category && (
                    <span className="inline-flex w-fit rounded-full bg-qd-teal-2/10 px-3 py-1 text-xs font-bold tracking-wide text-qd-teal-2 uppercase dark:bg-qd-teal/10 dark:text-qd-teal">
                        {category}
                    </span>
                )}
                <h2 className="text-2xl font-bold text-qd-ink sm:text-3xl dark:text-qd-white">
                    {title}
                </h2>
                {excerpt && (
                    <p className="text-sm leading-relaxed text-qd-text-high sm:text-base">
                        {excerpt}
                    </p>
                )}
                <PostMeta post={post} locale={locale} t={t} />
                <span className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-qd-teal-2 dark:text-qd-teal">
                    {t('blogPage.readMore')}
                    <ArrowRight
                        aria-hidden="true"
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                    />
                </span>
            </div>
        </a>
    );
}

export function PostCard({
    post,
    locale,
    t,
}: {
    readonly post: BlogPostSummary;
    readonly locale: Locale;
    readonly t: (key: string) => string;
}) {
    const href = postHref(post);
    const title = localizedText(post.title, locale);
    const excerpt = localizedText(post.excerpt, locale);
    const category = post.category
        ? localizedText(post.category.name, locale)
        : null;

    return (
        <a
            href={href ?? '/blog'}
            className="group flex flex-col overflow-hidden rounded-2xl border border-qd-mist bg-qd-white transition hover:-translate-y-1 hover:border-qd-teal-2/60 hover:shadow-[0_18px_44px_-30px_rgba(15,143,149,0.4)] dark:border-white/10 dark:bg-qd-surface dark:hover:border-qd-teal/60"
        >
            <div className="h-44 overflow-hidden">
                {post.coverImage ? (
                    <img
                        src={post.coverImage}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                ) : (
                    <CoverFallback />
                )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
                {category && (
                    <span className="inline-flex w-fit rounded-full bg-qd-teal-2/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-qd-teal-2 uppercase dark:bg-qd-teal/10 dark:text-qd-teal">
                        {category}
                    </span>
                )}
                <h3 className="text-lg font-bold text-qd-ink dark:text-qd-white">
                    {title}
                </h3>
                {excerpt && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-qd-text-high">
                        {excerpt}
                    </p>
                )}
                <PostMeta post={post} locale={locale} t={t} />
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-qd-teal-2 dark:text-qd-teal">
                    {t('blogPage.readMore')}
                    <ArrowRight
                        aria-hidden="true"
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                    />
                </span>
            </div>
        </a>
    );
}

function EmptyState({
    hasSearch,
    hasCategory,
    t,
}: {
    readonly hasSearch: boolean;
    readonly hasCategory: boolean;
    readonly t: (key: string) => string;
}) {
    if (hasSearch) {
        return (
            <div className="mx-auto max-w-xl rounded-3xl border border-qd-mist bg-qd-white p-8 text-center sm:p-10 dark:border-white/10 dark:bg-qd-white/5">
                <h3 className="text-lg font-bold text-qd-ink dark:text-qd-white">
                    {t('blogPage.empty.searchTitle')}
                </h3>
                <a
                    href={buildBlogUrl({})}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-qd-teal-2/40 px-5 py-2.5 text-sm font-bold text-qd-teal-2 transition hover:bg-qd-teal-2/10 dark:border-qd-teal/40 dark:text-qd-teal dark:hover:bg-qd-teal/10"
                >
                    <X aria-hidden="true" size={14} />
                    {t('blogPage.search.clear')}
                </a>
            </div>
        );
    }

    if (hasCategory) {
        return (
            <div className="mx-auto max-w-xl rounded-3xl border border-qd-mist bg-qd-white p-8 text-center sm:p-10 dark:border-white/10 dark:bg-qd-white/5">
                <h3 className="text-lg font-bold text-qd-ink dark:text-qd-white">
                    {t('blogPage.empty.categoryTitle')}
                </h3>
                <a
                    href={buildBlogUrl({})}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-qd-teal-2/40 px-5 py-2.5 text-sm font-bold text-qd-teal-2 transition hover:bg-qd-teal-2/10 dark:border-qd-teal/40 dark:text-qd-teal dark:hover:bg-qd-teal/10"
                >
                    {t('blogPage.empty.viewAll')}
                    <ArrowRight aria-hidden="true" size={14} />
                </a>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-xl rounded-3xl border border-qd-mist bg-qd-white p-8 text-center sm:p-10 dark:border-white/10 dark:bg-qd-white/5">
            <h3 className="text-lg font-bold text-qd-ink dark:text-qd-white">
                {t('blogPage.empty.noPostsTitle')}
            </h3>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
                <a
                    href="/servicios"
                    className="inline-flex items-center gap-2 rounded-xl border border-qd-ink/15 px-5 py-2.5 text-sm font-bold text-qd-ink transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-white/20 dark:text-qd-white dark:hover:border-qd-teal dark:hover:text-qd-teal"
                >
                    {t('blogPage.empty.services')}
                </a>
                <a
                    href="/metodologia"
                    className="inline-flex items-center gap-2 rounded-xl border border-qd-ink/15 px-5 py-2.5 text-sm font-bold text-qd-ink transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-white/20 dark:text-qd-white dark:hover:border-qd-teal dark:hover:text-qd-teal"
                >
                    {t('blogPage.empty.methodology')}
                </a>
            </div>
        </div>
    );
}

export default function Blog({
    featuredPost,
    posts,
    categories,
    filters,
}: BlogProps) {
    const { t, locale } = useLanguage();
    const hasSearch = filters.search.trim() !== '';
    const hasCategory = filters.category.trim() !== '';
    const hasFilters = hasSearch || hasCategory;
    const pageItems = getPageItems(posts.current_page, posts.last_page);

    return (
        <PublicLayout>
            <Head title={t('blogPage.metaTitle')} />

            <PublicPageHero
                eyebrow={t('blogPage.hero.eyebrow')}
                title={t('blogPage.hero.title')}
                subtitle={t('blogPage.hero.subtitle')}
                currentLabel={t('navigation.items.blog')}
                taglineTitle={t('blogPage.heroTagline.title')}
                taglineSubtitle={t('blogPage.heroTagline.subtitle')}
                taglineIcon={FileText}
            />

            {/* Buscador + filtros */}
            <section className="bg-qd-bg dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 pt-4 pb-8 sm:px-8">
                    <form
                        method="GET"
                        action="/blog"
                        className="flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                        <label htmlFor="blog-search" className="sr-only">
                            {t('blogPage.search.label')}
                        </label>
                        <div className="relative flex-1">
                            <Search
                                aria-hidden="true"
                                size={16}
                                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-qd-text-medium"
                            />
                            <input
                                id="blog-search"
                                type="search"
                                name="buscar"
                                defaultValue={filters.search}
                                placeholder={t(
                                    'blogPage.search.placeholder',
                                )}
                                className="w-full rounded-xl border border-qd-mist bg-qd-white py-2.5 pr-4 pl-10 text-sm text-qd-ink placeholder:text-qd-text-medium focus:border-qd-teal-2 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-qd-white"
                            />
                            {hasCategory && (
                                <input
                                    type="hidden"
                                    name="categoria"
                                    value={filters.category}
                                />
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                className="rounded-xl bg-qd-teal-2 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95 dark:bg-qd-teal dark:text-qd-ink"
                            >
                                {t('blogPage.search.submit')}
                            </button>
                            {hasFilters && (
                                <a
                                    href={buildBlogUrl({})}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-qd-mist px-4 py-2.5 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-white/10 dark:text-qd-text-medium dark:hover:border-qd-teal dark:hover:text-qd-teal"
                                >
                                    <X aria-hidden="true" size={14} />
                                    {t('blogPage.search.clear')}
                                </a>
                            )}
                        </div>
                    </form>

                    {categories.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {categories.map((category) => {
                                const slug =
                                    category.slug.es ??
                                    category.slug.en ??
                                    '';
                                const isActive = filters.category === slug;

                                return (
                                    <a
                                        key={slug}
                                        href={buildBlogUrl({
                                            search: filters.search,
                                            category: isActive ? '' : slug,
                                        })}
                                        role="button"
                                        aria-pressed={isActive}
                                        className={cn(
                                            'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qd-teal-2',
                                            isActive
                                                ? 'border-qd-teal-2 bg-qd-teal-2 text-white dark:border-qd-teal dark:bg-qd-teal dark:text-qd-ink'
                                                : 'border-qd-mist text-qd-text-high hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-white/10 dark:text-qd-text-medium dark:hover:border-qd-teal dark:hover:text-qd-teal',
                                        )}
                                    >
                                        {localizedText(category.name, locale)}
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Post destacado fijo */}
            {featuredPost && (
                <section className="bg-qd-bg dark:bg-qd-ink">
                    <div className="mx-auto max-w-[1240px] px-5 pb-4 sm:px-8">
                        {hasFilters && (
                            <p className="mb-3 text-xs font-bold tracking-[0.14em] text-qd-text-medium uppercase">
                                {t('blogPage.featuredLabel')}
                            </p>
                        )}
                        <FeaturedPostCard
                            post={featuredPost}
                            locale={locale}
                            t={t}
                        />
                    </div>
                </section>
            )}

            {/* Grid paginado */}
            <section className="bg-qd-bg dark:bg-qd-ink">
                <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 sm:py-12">
                    {hasFilters && featuredPost && (
                        <p className="mb-6 text-xs font-bold tracking-[0.14em] text-qd-text-medium uppercase">
                            {t('blogPage.resultsLabel')}
                        </p>
                    )}

                    {posts.data.length > 0 ? (
                        <>
                            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                                {posts.data.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        locale={locale}
                                        t={t}
                                    />
                                ))}
                            </div>

                            {posts.last_page > 1 && (
                                <nav
                                    aria-label={t('blogPage.paginationAria')}
                                    className="mt-10 flex items-center justify-center gap-1.5"
                                >
                                    {posts.current_page > 1 ? (
                                        <a
                                            href={buildBlogUrl({
                                                ...filters,
                                                page: posts.current_page - 1,
                                            })}
                                            aria-label={t(
                                                'blogPage.pagination.previous',
                                            )}
                                            className="flex size-9 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-white/10 dark:text-qd-text-medium"
                                        >
                                            ‹
                                        </a>
                                    ) : (
                                        <span
                                            aria-hidden="true"
                                            className="flex size-9 items-center justify-center rounded-lg text-qd-text-medium/40"
                                        >
                                            ‹
                                        </span>
                                    )}

                                    {pageItems.map((item, index) =>
                                        item === 'ellipsis' ? (
                                            <span
                                                key={`ellipsis-${index}`}
                                                aria-hidden="true"
                                                className="px-1 text-sm text-qd-text-medium"
                                            >
                                                …
                                            </span>
                                        ) : (
                                            <a
                                                key={item}
                                                href={buildBlogUrl({
                                                    ...filters,
                                                    page: item,
                                                })}
                                                aria-current={
                                                    item ===
                                                    posts.current_page
                                                        ? 'page'
                                                        : undefined
                                                }
                                                className={cn(
                                                    'flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition',
                                                    item ===
                                                        posts.current_page
                                                        ? 'border-qd-teal-2 bg-qd-teal-2 text-white dark:border-qd-teal dark:bg-qd-teal dark:text-qd-ink'
                                                        : 'border-qd-mist text-qd-text-high hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-white/10 dark:text-qd-text-medium',
                                                )}
                                            >
                                                {item}
                                            </a>
                                        ),
                                    )}

                                    {posts.current_page < posts.last_page ? (
                                        <a
                                            href={buildBlogUrl({
                                                ...filters,
                                                page: posts.current_page + 1,
                                            })}
                                            aria-label={t(
                                                'blogPage.pagination.next',
                                            )}
                                            className="flex size-9 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-white/10 dark:text-qd-text-medium"
                                        >
                                            ›
                                        </a>
                                    ) : (
                                        <span
                                            aria-hidden="true"
                                            className="flex size-9 items-center justify-center rounded-lg text-qd-text-medium/40"
                                        >
                                            ›
                                        </span>
                                    )}
                                </nav>
                            )}
                        </>
                    ) : (
                        <EmptyState
                            hasSearch={hasSearch}
                            hasCategory={hasCategory}
                            t={t}
                        />
                    )}
                </div>
            </section>

            {/* CTA final */}
            <section className="bg-qd-ink">
                <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
                    <div>
                        <h2 className="text-2xl font-bold text-qd-white sm:text-3xl">
                            {t('blogPage.cta.title')}
                        </h2>
                        <p className="mt-2 max-w-md text-sm text-qd-text-medium sm:text-base">
                            {t('blogPage.cta.subtitle')}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={contactShow.url()}
                            className="inline-flex items-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-semibold text-qd-ink transition hover:brightness-95"
                        >
                            {t('blogPage.cta.primary')}
                            <ArrowRight aria-hidden="true" size={16} />
                        </a>
                        <a
                            href={bookingShow.url()}
                            className="inline-flex items-center gap-2 rounded-xl border border-qd-white/20 px-5 py-3 text-sm font-semibold text-qd-white transition hover:border-qd-teal hover:text-qd-teal"
                        >
                            {t('blogPage.cta.secondary')}
                            <ArrowRight aria-hidden="true" size={16} />
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

import { Head, Link, router } from '@inertiajs/react';
import {
    ExternalLink,
    FileText,
    MoreVertical,
    Pencil,
    Plus,
    Search,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPagination from '@/components/admin/AdminPagination';
import type { PaginatedData } from '@/components/admin/AdminPagination';
import AdminSelect from '@/components/admin/AdminSelect';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';

type LocalizedText = { readonly es: string | null; readonly en: string | null };

type PostRow = {
    readonly id: number;
    readonly title: LocalizedText | null;
    readonly slug: LocalizedText | null;
    readonly status: string;
    readonly categoryName: LocalizedText | null;
    readonly isFeatured: boolean;
    readonly publishedAt: string | null;
    readonly updatedAt: string | null;
    readonly publicUrl: string | null;
};

type IndexProps = {
    readonly posts: PaginatedData<PostRow>;
    readonly categories: readonly { value: number; label: string | null }[];
    readonly filters: {
        readonly q?: string;
        readonly status?: string;
        readonly category?: string;
    };
};

const STATUS_LABEL: Record<string, string> = {
    draft: 'Borrador',
    scheduled: 'Programado',
    published: 'Publicado',
    hidden: 'Oculto',
};

/**
 * Estado efectivo de cara al público. El dato real (`status`) NO se muta: un
 * post `scheduled` cuya fecha ya pasó es visible públicamente por la regla
 * `Post::scopePublished()`, así que el admin lo refleja sin cambiar el estado
 * ni depender de un cron. El cálculo se hace en cliente comparando instantes
 * (`publishedAt` llega como ISO8601 con offset), no horas de pared.
 */
function isScheduledVisible(post: PostRow): boolean {
    return (
        post.status === 'scheduled' &&
        post.publishedAt !== null &&
        new Date(post.publishedAt).getTime() <= Date.now()
    );
}

function isPubliclyVisible(post: PostRow): boolean {
    return (
        (post.status === 'published' && post.publishedAt !== null) ||
        isScheduledVisible(post)
    );
}

/**
 * Etiqueta del badge: un `scheduled` ya vencido se muestra como
 * "Visible · programado"; el resto conserva su estado real. El `scheduled`
 * futuro o sin fecha sigue siendo "Programado".
 */
function statusLabel(post: PostRow): string {
    if (isScheduledVisible(post)) {
        return 'Visible · programado';
    }

    return STATUS_LABEL[post.status] ?? post.status;
}

function patch(id: number, action: string) {
    router.patch(`/admin/posts/${id}/${action}`, {}, { preserveScroll: true });
}

export default function PostsIndex({ posts, categories, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.q ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [categoryFilter, setCategoryFilter] = useState(
        filters.category ?? '',
    );

    const title = (post: PostRow): string =>
        post.title?.es ?? post.title?.en ?? '—';
    const slug = (post: PostRow): string =>
        post.slug?.es ?? post.slug?.en ?? '';

    const applyFilters = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            '/admin/posts',
            {
                q: search,
                status: statusFilter,
                category: categoryFilter,
            },
            { preserveState: true, replace: true },
        );
    };

    const hasFilters = Boolean(filters.q || filters.status || filters.category);

    const formatDate = (value: string | null): string =>
        value
            ? new Date(value).toLocaleDateString('es', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
              })
            : '—';

    return (
        <AdminLayout
            title="Blog"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Blog' },
            ]}
            actions={
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/post-categories"
                        className="inline-flex items-center gap-2 rounded-lg border border-qd-mist px-4 py-2.5 text-sm font-semibold text-qd-text-high dark:border-qd-white/10 dark:text-qd-white/70"
                    >
                        Categorías
                    </Link>
                    <Link
                        href="/admin/tags"
                        className="inline-flex items-center gap-2 rounded-lg border border-qd-mist px-4 py-2.5 text-sm font-semibold text-qd-text-high dark:border-qd-white/10 dark:text-qd-white/70"
                    >
                        Tags
                    </Link>
                    <Link
                        href="/admin/posts/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 dark:bg-qd-teal dark:text-qd-ink"
                    >
                        <Plus aria-hidden="true" size={16} />
                        Nuevo post
                    </Link>
                </div>
            }
        >
            <Head title="Blog · Admin AbacoQD" />

            <div className="rounded-2xl border border-qd-mist bg-qd-white dark:border-qd-white/10 dark:bg-qd-surface">
                <form
                    onSubmit={applyFilters}
                    className="flex flex-wrap items-center gap-3 border-b border-qd-mist p-4 dark:border-qd-white/10"
                >
                    <div className="relative flex-1 sm:min-w-64">
                        <Search
                            aria-hidden="true"
                            size={16}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-qd-text-medium"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por título o slug..."
                            className="h-9 w-full rounded-lg border border-qd-mist bg-transparent pr-3 pl-9 text-sm outline-none focus-visible:border-qd-teal-2/50 dark:border-qd-white/10"
                        />
                    </div>
                    <AdminSelect
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-auto"
                    >
                        <option value="">Estado: todos</option>
                        {Object.entries(STATUS_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>
                                Estado: {label}
                            </option>
                        ))}
                    </AdminSelect>
                    <AdminSelect
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-auto"
                    >
                        <option value="">Categoría: todas</option>
                        {categories.map((c) => (
                            <option key={c.value} value={c.value}>
                                Categoría: {c.label}
                            </option>
                        ))}
                    </AdminSelect>
                    <button
                        type="submit"
                        className="h-9 rounded-lg bg-qd-teal-2 px-4 text-sm font-bold text-white dark:bg-qd-teal dark:text-qd-ink"
                    >
                        Filtrar
                    </button>
                </form>

                {posts.data.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState
                            icon={FileText}
                            title={
                                !hasFilters
                                    ? 'Aún no hay posts'
                                    : 'Sin resultados'
                            }
                            description={
                                !hasFilters
                                    ? 'Crea el primer post del blog.'
                                    : 'Ajusta los filtros de búsqueda.'
                            }
                            action={
                                !hasFilters ? (
                                    <Link
                                        href="/admin/posts/create"
                                        className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white dark:bg-qd-teal dark:text-qd-ink"
                                    >
                                        <Plus aria-hidden="true" size={16} />
                                        Nuevo post
                                    </Link>
                                ) : undefined
                            }
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-200 text-sm">
                            <thead>
                                <tr className="border-b border-qd-mist text-left text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:border-qd-white/10 dark:text-qd-white/50">
                                    <th className="px-4 py-3">Post</th>
                                    <th className="px-4 py-3">Categoría</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3 text-center">
                                        Destacado
                                    </th>
                                    <th className="px-4 py-3">Publicado</th>
                                    <th className="px-4 py-3 text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-qd-mist dark:divide-qd-white/10">
                                {posts.data.map((post) => (
                                    <tr key={post.id} className="align-middle">
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-qd-ink dark:text-qd-white">
                                                {title(post)}
                                            </p>
                                            <p className="text-xs text-qd-text-medium dark:text-qd-white/40">
                                                /{slug(post)}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-qd-text-high dark:text-qd-white/70">
                                            {post.categoryName?.es ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-qd-mist px-2.5 py-1 text-xs font-semibold dark:bg-qd-white/10">
                                                {statusLabel(post)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <RowToggle
                                                checked={post.isFeatured}
                                                onClick={() =>
                                                    patch(
                                                        post.id,
                                                        'toggle-featured',
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-qd-text-medium dark:text-qd-white/50">
                                            {formatDate(post.publishedAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/posts/${post.id}/edit`}
                                                    className="flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:border-qd-white/10 dark:text-qd-white/70"
                                                >
                                                    <Pencil
                                                        aria-hidden="true"
                                                        size={15}
                                                    />
                                                </Link>
                                                {post.publicUrl && (
                                                    <a
                                                        href={post.publicUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={cn(
                                                            'flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:border-qd-white/10 dark:text-qd-white/70',
                                                            !isPubliclyVisible(
                                                                post,
                                                            ) &&
                                                                'pointer-events-none opacity-40',
                                                        )}
                                                    >
                                                        <ExternalLink
                                                            aria-hidden="true"
                                                            size={15}
                                                        />
                                                    </a>
                                                )}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70">
                                                        <MoreVertical
                                                            aria-hidden="true"
                                                            size={15}
                                                        />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={() => {
                                                                if (
                                                                    window.confirm(
                                                                        '¿Archivar este post?',
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        `/admin/posts/${post.id}`,
                                                                        {
                                                                            preserveScroll: true,
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            Archivar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <AdminPagination pagination={posts} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function RowToggle({
    checked,
    onClick,
}: {
    readonly checked: boolean;
    readonly onClick: () => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={onClick}
            className={cn(
                'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full align-middle transition',
                checked
                    ? 'bg-qd-teal-2 dark:bg-qd-teal'
                    : 'bg-qd-mist dark:bg-qd-white/15',
            )}
        >
            <span
                className={cn(
                    'inline-block size-4 transform rounded-full bg-white shadow transition',
                    checked ? 'translate-x-4.5' : 'translate-x-0.5',
                )}
            />
        </button>
    );
}

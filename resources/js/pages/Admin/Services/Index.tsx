import { Head, Link, router } from '@inertiajs/react';
import {
    ExternalLink,
    MoreVertical,
    Pencil,
    Plus,
    Search,
    Wrench,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPagination from '@/components/admin/AdminPagination';
import type { PaginatedData } from '@/components/admin/AdminPagination';
import AdminSelect from '@/components/admin/AdminSelect';
import StatusBadge from '@/components/admin/StatusBadge';
import type { ServiceStatus } from '@/components/admin/StatusBadge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/use-language';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';

type LocalizedText = { readonly es: string | null; readonly en: string | null };

type ServiceRow = {
    readonly id: number;
    readonly title: LocalizedText | null;
    readonly slug: LocalizedText | null;
    readonly status: ServiceStatus;
    readonly isActive: boolean;
    readonly isFeatured: boolean;
    readonly isDetailEnabled: boolean;
    readonly sortOrder: number;
    readonly updatedAt: string | null;
    readonly publicUrl: string | null;
};

type IndexProps = {
    readonly services: PaginatedData<ServiceRow>;
    readonly filters: {
        readonly q?: string;
        readonly status?: string;
        readonly active?: string;
    };
    readonly counts: {
        readonly total: number;
        readonly published: number;
        readonly draft: number;
        readonly hidden: number;
    };
};

type TriState = '' | 'yes' | 'no';

function patch(id: number, action: string) {
    router.patch(
        `/admin/services/${id}/${action}`,
        {},
        { preserveScroll: true },
    );
}

export default function ServicesIndex({
    services,
    filters,
    counts,
}: IndexProps) {
    const { t, locale } = useLanguage();

    const [search, setSearch] = useState(filters.q ?? '');
    const [statusFilter, setStatusFilter] = useState<'' | ServiceStatus>(
        (filters.status as ServiceStatus | undefined) ?? '',
    );
    const [activeFilter, setActiveFilter] = useState<TriState>(
        (filters.active as TriState | undefined) ?? '',
    );

    const title = (service: ServiceRow): string =>
        service.title?.[locale] ??
        service.title?.es ??
        service.title?.en ??
        '—';
    const slug = (service: ServiceRow): string =>
        service.slug?.[locale] ?? service.slug?.es ?? service.slug?.en ?? '';

    const applyFilters = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            '/admin/services',
            {
                q: search,
                status: statusFilter,
                active: activeFilter,
            },
            { preserveState: true, replace: true },
        );
    };

    const hasFilters = Boolean(filters.q || filters.status || filters.active);

    const formatDate = (value: string | null): string =>
        value
            ? new Date(value).toLocaleDateString(locale, {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
              })
            : '—';

    return (
        <AdminLayout
            title={t('admin.services.title')}
            breadcrumbs={[
                { title: t('admin.nav.dashboard'), href: '/admin/dashboard' },
                { title: t('admin.services.title') },
            ]}
            actions={
                <Link
                    href="/admin/services/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 dark:bg-qd-teal dark:text-qd-ink"
                >
                    <Plus aria-hidden="true" size={16} />
                    {t('admin.services.new')}
                </Link>
            }
        >
            <Head title={`${t('admin.services.title')} · Admin AbacoQD`} />

            {/* Stat cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(['total', 'published', 'draft', 'hidden'] as const).map(
                    (key) => (
                        <div
                            key={key}
                            className="rounded-2xl border border-qd-mist bg-qd-white p-5 dark:border-qd-white/10 dark:bg-qd-surface"
                        >
                            <p className="text-3xl font-extrabold text-qd-ink dark:text-qd-white">
                                {counts[key]}
                            </p>
                            <p className="mt-1 text-sm text-qd-text-medium dark:text-qd-white/50">
                                {t(`admin.services.counts.${key}`)}
                            </p>
                        </div>
                    ),
                )}
            </div>

            {/* Filters + table */}
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
                            placeholder={t('admin.services.searchPlaceholder')}
                            className="h-9 w-full rounded-lg border border-qd-mist bg-transparent pr-3 pl-9 text-sm outline-none focus-visible:border-qd-teal-2/50 dark:border-qd-white/10"
                        />
                    </div>

                    <FilterSelect
                        label={t('admin.services.filters.status')}
                        value={statusFilter}
                        onChange={(v) =>
                            setStatusFilter(v as '' | ServiceStatus)
                        }
                        options={[
                            { value: '', label: t('admin.filters.all') },
                            {
                                value: 'published',
                                label: t('admin.status.published'),
                            },
                            { value: 'draft', label: t('admin.status.draft') },
                            {
                                value: 'hidden',
                                label: t('admin.status.hidden'),
                            },
                        ]}
                    />
                    <FilterSelect
                        label={t('admin.services.fields.isActive')}
                        value={activeFilter}
                        onChange={(v) => setActiveFilter(v as TriState)}
                        options={triOptions(t)}
                    />
                    <button
                        type="submit"
                        className="h-9 rounded-lg bg-qd-teal-2 px-4 text-sm font-bold text-white dark:bg-qd-teal dark:text-qd-ink"
                    >
                        Filtrar
                    </button>
                </form>

                {services.data.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState
                            icon={Wrench}
                            title={
                                !hasFilters && counts.total === 0
                                    ? t('admin.services.empty.title')
                                    : t('admin.services.noResults.title')
                            }
                            description={
                                !hasFilters && counts.total === 0
                                    ? t('admin.services.empty.description')
                                    : t('admin.services.noResults.description')
                            }
                            action={
                                !hasFilters && counts.total === 0 ? (
                                    <Link
                                        href="/admin/services/create"
                                        className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white dark:bg-qd-teal dark:text-qd-ink"
                                    >
                                        <Plus aria-hidden="true" size={16} />
                                        {t('admin.services.new')}
                                    </Link>
                                ) : undefined
                            }
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-275 text-sm">
                            <thead>
                                <tr className="border-b border-qd-mist text-left text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:border-qd-white/10 dark:text-qd-white/50">
                                    <th className="px-4 py-3">
                                        {t('admin.services.columns.service')}
                                    </th>
                                    <th className="px-4 py-3">
                                        {t('admin.services.columns.status')}
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        {t('admin.services.fields.isActive')}
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        {t('admin.services.fields.isFeatured')}
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        {t(
                                            'admin.services.fields.isDetailEnabled',
                                        )}
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        {t('admin.services.columns.order')}
                                    </th>
                                    <th className="px-4 py-3">
                                        {t('admin.services.columns.updated')}
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        {t('admin.services.columns.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-qd-mist dark:divide-qd-white/10">
                                {services.data.map((service) => (
                                    <tr
                                        key={service.id}
                                        className="align-middle"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-qd-ink dark:text-qd-white">
                                                {title(service)}
                                            </p>
                                            <p className="text-xs text-qd-text-medium dark:text-qd-white/40">
                                                /{slug(service)}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge
                                                status={service.status}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <RowToggle
                                                checked={service.isActive}
                                                onClick={() =>
                                                    patch(
                                                        service.id,
                                                        'toggle-active',
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <RowToggle
                                                checked={service.isFeatured}
                                                disabled={
                                                    !service.isFeatured &&
                                                    (!service.isActive ||
                                                        !service.isDetailEnabled)
                                                }
                                                title={
                                                    !service.isActive
                                                        ? t(
                                                              'admin.services.fields.isFeaturedRequiresActive',
                                                          )
                                                        : !service.isDetailEnabled
                                                          ? t(
                                                                'admin.services.fields.isFeaturedRequiresDetail',
                                                            )
                                                          : undefined
                                                }
                                                onClick={() =>
                                                    patch(
                                                        service.id,
                                                        'toggle-featured',
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <RowToggle
                                                checked={
                                                    service.isDetailEnabled
                                                }
                                                disabled={
                                                    !service.isActive &&
                                                    !service.isDetailEnabled
                                                }
                                                title={
                                                    !service.isActive
                                                        ? t(
                                                              'admin.services.fields.isDetailRequiresActive',
                                                          )
                                                        : undefined
                                                }
                                                onClick={() =>
                                                    patch(
                                                        service.id,
                                                        'toggle-detail',
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center text-qd-text-high dark:text-qd-white/70">
                                            {service.sortOrder}
                                        </td>
                                        <td className="px-4 py-3 text-qd-text-medium dark:text-qd-white/50">
                                            {formatDate(service.updatedAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/services/${service.id}/edit`}
                                                    className="flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:border-qd-white/10 dark:text-qd-white/70"
                                                    aria-label={t(
                                                        'admin.services.actions.edit',
                                                    )}
                                                >
                                                    <Pencil
                                                        aria-hidden="true"
                                                        size={15}
                                                    />
                                                </Link>
                                                {service.publicUrl && (
                                                    <a
                                                        href={service.publicUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={cn(
                                                            'flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:border-qd-white/10 dark:text-qd-white/70',
                                                            (service.status !==
                                                                'published' ||
                                                                !service.isActive ||
                                                                !service.isDetailEnabled) &&
                                                                'pointer-events-none opacity-40',
                                                        )}
                                                        aria-label={t(
                                                            'admin.services.actions.viewPublic',
                                                        )}
                                                    >
                                                        <ExternalLink
                                                            aria-hidden="true"
                                                            size={15}
                                                        />
                                                    </a>
                                                )}
                                                <RowActions service={service} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <AdminPagination pagination={services} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function triOptions(t: (key: string) => string) {
    return [
        { value: '', label: t('admin.filters.all') },
        { value: 'yes', label: t('admin.filters.yes') },
        { value: 'no', label: t('admin.filters.no') },
    ];
}

function FilterSelect({
    label,
    value,
    onChange,
    options,
}: {
    readonly label: string;
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly options: readonly {
        readonly value: string;
        readonly label: string;
    }[];
}) {
    return (
        <AdminSelect
            aria-label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-auto"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {label}: {option.label}
                </option>
            ))}
        </AdminSelect>
    );
}

function RowToggle({
    checked,
    disabled = false,
    title,
    onClick,
}: {
    readonly checked: boolean;
    readonly disabled?: boolean;
    readonly title?: string;
    readonly onClick: () => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            title={title}
            onClick={onClick}
            className={cn(
                'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full align-middle transition',
                checked
                    ? 'bg-qd-teal-2 dark:bg-qd-teal'
                    : 'bg-qd-mist dark:bg-qd-white/15',
                disabled && 'cursor-not-allowed opacity-45',
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

function RowActions({ service }: { readonly service: ServiceRow }) {
    const { t } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70"
                aria-label={t('admin.services.actions.more')}
            >
                <MoreVertical aria-hidden="true" size={15} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onSelect={() => patch(service.id, 'toggle-status')}
                >
                    {service.status === 'published'
                        ? t('admin.services.actions.hide')
                        : t('admin.services.actions.publish')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => {
                        if (
                            window.confirm(
                                t('admin.services.actions.archiveConfirm'),
                            )
                        ) {
                            router.delete(`/admin/services/${service.id}`, {
                                preserveScroll: true,
                            });
                        }
                    }}
                >
                    {t('admin.services.actions.archive')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

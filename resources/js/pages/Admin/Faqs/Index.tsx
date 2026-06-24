import { Head, Link, router } from '@inertiajs/react';
import { HelpCircle, MoreVertical, Pencil, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPagination from '@/components/admin/AdminPagination';
import type { PaginatedData } from '@/components/admin/AdminPagination';
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

type FaqRow = {
    readonly id: number;
    readonly question: LocalizedText | null;
    readonly category: string | null;
    readonly intent: string | null;
    readonly showInChatbot: boolean;
    readonly showOnPage: boolean;
    readonly isActive: boolean;
};

type IndexProps = {
    readonly faqs: PaginatedData<FaqRow>;
    readonly filters: { readonly q?: string };
};

function patch(id: number, action: string) {
    router.patch(`/admin/faqs/${id}/${action}`, {}, { preserveScroll: true });
}

export default function FaqsIndex({ faqs, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.q ?? '');

    const applyFilters = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            '/admin/faqs',
            { q: search },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout
            title="FAQs / Chatbot"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'FAQs' },
            ]}
            actions={
                <Link
                    href="/admin/faqs/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 dark:bg-qd-teal dark:text-qd-ink"
                >
                    <Plus aria-hidden="true" size={16} />
                    Nueva FAQ
                </Link>
            }
        >
            <Head title="FAQ · Admin AbacoQD" />

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
                            placeholder="Buscar por pregunta, categoría o intent..."
                            className="h-9 w-full rounded-lg border border-qd-mist bg-transparent pr-3 pl-9 text-sm outline-none focus-visible:border-qd-teal-2/50 dark:border-qd-white/10"
                        />
                    </div>
                    <button
                        type="submit"
                        className="h-9 rounded-lg bg-qd-teal-2 px-4 text-sm font-bold text-white dark:bg-qd-teal dark:text-qd-ink"
                    >
                        Filtrar
                    </button>
                </form>

                {faqs.data.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState
                            icon={HelpCircle}
                            title={
                                !filters.q
                                    ? 'Aún no hay FAQs'
                                    : 'Sin resultados'
                            }
                            description={
                                !filters.q
                                    ? 'Crea la primera pregunta frecuente.'
                                    : 'Ajusta la búsqueda.'
                            }
                            action={
                                !filters.q ? (
                                    <Link
                                        href="/admin/faqs/create"
                                        className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white dark:bg-qd-teal dark:text-qd-ink"
                                    >
                                        <Plus aria-hidden="true" size={16} />
                                        Nueva FAQ
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
                                    <th className="px-4 py-3">Pregunta</th>
                                    <th className="px-4 py-3">
                                        Categoría / Intent
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Chatbot
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Visible en página pública
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-qd-mist dark:divide-qd-white/10">
                                {faqs.data.map((faq) => (
                                    <tr key={faq.id} className="align-middle">
                                        <td className="px-4 py-3 font-semibold text-qd-ink dark:text-qd-white">
                                            {faq.question?.es ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-qd-text-high dark:text-qd-white/70">
                                            {faq.category ?? '—'}
                                            {faq.intent && (
                                                <span className="ml-1 text-xs text-qd-text-medium dark:text-qd-white/40">
                                                    ({faq.intent})
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <RowToggle
                                                checked={faq.showInChatbot}
                                                onClick={() =>
                                                    patch(
                                                        faq.id,
                                                        'toggle-chatbot',
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <RowToggle
                                                checked={faq.showOnPage}
                                                onClick={() =>
                                                    patch(faq.id, 'toggle-page')
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/faqs/${faq.id}/edit`}
                                                    className="flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:border-qd-white/10 dark:text-qd-white/70"
                                                >
                                                    <Pencil
                                                        aria-hidden="true"
                                                        size={15}
                                                    />
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70">
                                                        <MoreVertical
                                                            aria-hidden="true"
                                                            size={15}
                                                        />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onSelect={() =>
                                                                patch(
                                                                    faq.id,
                                                                    'toggle-active',
                                                                )
                                                            }
                                                        >
                                                            {faq.isActive
                                                                ? 'Desactivar'
                                                                : 'Activar'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={() => {
                                                                if (
                                                                    window.confirm(
                                                                        '¿Archivar esta FAQ?',
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        `/admin/faqs/${faq.id}`,
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
                        <AdminPagination pagination={faqs} />
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

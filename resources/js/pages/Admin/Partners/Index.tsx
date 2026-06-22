import { Head, Link, router } from '@inertiajs/react';
import { Handshake, MoreVertical, Pencil, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminSelect from '@/components/admin/AdminSelect';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';

type PartnerRow = {
    readonly id: number;
    readonly name: string;
    readonly slug: string;
    readonly type: string;
    readonly logo: string | null;
    readonly permissionStatus: string;
    readonly isActive: boolean;
    readonly showOnHome: boolean;
    readonly showInCollaborations: boolean;
    readonly showInProjects: boolean;
    readonly isFeatured: boolean;
};

type IndexProps = { readonly partners: readonly PartnerRow[] };

const TYPE_LABEL: Record<string, string> = {
    client: 'Cliente',
    collaborator: 'Colaborador',
    provider: 'Proveedor',
    institutional: 'Institucional',
    other: 'Otro',
};

const PERMISSION_LABEL: Record<string, string> = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    unknown: 'Desconocido',
};

function patch(id: number, action: string) {
    router.patch(`/admin/partners/${id}/${action}`, {}, { preserveScroll: true });
}

export default function PartnersIndex({ partners }: IndexProps) {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();

        return partners.filter((partner) => {
            if (term && !`${partner.name} ${partner.slug}`.toLowerCase().includes(term)) {
                return false;
            }

            return typeFilter === 'all' || partner.type === typeFilter;
        });
    }, [partners, search, typeFilter]);

    return (
        <AdminLayout
            title="Partners"
            breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Partners' }]}
            actions={
                <Link
                    href="/admin/partners/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 dark:bg-qd-teal dark:text-qd-ink"
                >
                    <Plus aria-hidden="true" size={16} />
                    Nuevo partner
                </Link>
            }
        >
            <Head title="Partners · Admin AbacoQD" />

            <div className="rounded-2xl border border-qd-mist bg-qd-white dark:border-qd-white/10 dark:bg-qd-surface">
                <div className="flex flex-wrap items-center gap-3 border-b border-qd-mist p-4 dark:border-qd-white/10">
                    <div className="relative flex-1 sm:min-w-64">
                        <Search aria-hidden="true" size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-qd-text-medium" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nombre o slug..."
                            className="h-9 w-full rounded-lg border border-qd-mist bg-transparent pr-3 pl-9 text-sm outline-none focus-visible:border-qd-teal-2/50 dark:border-qd-white/10"
                        />
                    </div>
                    <AdminSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-auto">
                        <option value="all">Tipo: todos</option>
                        {Object.entries(TYPE_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>
                                Tipo: {label}
                            </option>
                        ))}
                    </AdminSelect>
                </div>

                {filtered.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState
                            icon={Handshake}
                            title={partners.length === 0 ? 'Aún no hay partners' : 'Sin resultados'}
                            description={partners.length === 0 ? 'Crea el primer partner/colaborador.' : 'Ajusta los filtros de búsqueda.'}
                            action={
                                partners.length === 0 ? (
                                    <Link
                                        href="/admin/partners/create"
                                        className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white dark:bg-qd-teal dark:text-qd-ink"
                                    >
                                        <Plus aria-hidden="true" size={16} />
                                        Nuevo partner
                                    </Link>
                                ) : undefined
                            }
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-220 text-sm">
                            <thead>
                                <tr className="border-b border-qd-mist text-left text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:border-qd-white/10 dark:text-qd-white/50">
                                    <th className="px-4 py-3">Partner</th>
                                    <th className="px-4 py-3">Tipo</th>
                                    <th className="px-4 py-3">Permiso</th>
                                    <th className="px-4 py-3 text-center">Activo</th>
                                    <th className="px-4 py-3 text-center">Noria de Colaboraciones</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-qd-mist dark:divide-qd-white/10">
                                {filtered.map((partner) => (
                                    <tr key={partner.id} className="align-middle">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-qd-mist bg-qd-bg p-1 dark:border-qd-white/10 dark:bg-qd-ink">
                                                    {partner.logo ? (
                                                        <img src={partner.logo} alt="" className="h-full w-full object-contain" />
                                                    ) : (
                                                        <Handshake aria-hidden="true" size={14} className="text-qd-text-medium" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-qd-ink dark:text-qd-white">{partner.name}</p>
                                                    <p className="text-xs text-qd-text-medium dark:text-qd-white/40">/{partner.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-qd-text-high dark:text-qd-white/70">{TYPE_LABEL[partner.type] ?? partner.type}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={cn(
                                                    'rounded-full px-2.5 py-1 text-xs font-semibold',
                                                    partner.permissionStatus === 'approved'
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                        : 'bg-qd-mist dark:bg-qd-white/10',
                                                )}
                                            >
                                                {PERMISSION_LABEL[partner.permissionStatus] ?? partner.permissionStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <RowToggle checked={partner.isActive} onClick={() => patch(partner.id, 'toggle-active')} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <RowToggle checked={partner.showInCollaborations} onClick={() => patch(partner.id, 'toggle-collaborations')} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/partners/${partner.id}/edit`}
                                                    className="flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:border-qd-white/10 dark:text-qd-white/70"
                                                >
                                                    <Pencil aria-hidden="true" size={15} />
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70">
                                                        <MoreVertical aria-hidden="true" size={15} />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={() => {
                                                                if (window.confirm('¿Archivar este partner? Se ocultará en todas las superficies públicas.')) {
                                                                    router.delete(`/admin/partners/${partner.id}`, { preserveScroll: true });
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
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function RowToggle({ checked, onClick }: { readonly checked: boolean; readonly onClick: () => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={onClick}
            className={cn(
                'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full align-middle transition',
                checked ? 'bg-qd-teal-2 dark:bg-qd-teal' : 'bg-qd-mist dark:bg-qd-white/15',
            )}
        >
            <span className={cn('inline-block size-4 transform rounded-full bg-white shadow transition', checked ? 'translate-x-4.5' : 'translate-x-0.5')} />
        </button>
    );
}

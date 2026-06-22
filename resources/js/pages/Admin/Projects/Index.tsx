import { Head, Link, router } from '@inertiajs/react';
import { ExternalLink, FolderKanban, MoreVertical, Pencil, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import AdminEmptyState from '@/components/admin/AdminEmptyState';
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

type ProjectRow = {
    readonly id: number;
    readonly title: LocalizedText | null;
    readonly slug: LocalizedText | null;
    readonly status: string;
    readonly permissionStatus: string;
    readonly coverImage: string | null;
    readonly clientName: string | null;
    readonly year: number | null;
    readonly showOnHome: boolean;
    readonly showInProjects: boolean;
    readonly showInCollaborations: boolean;
    readonly isFeatured: boolean;
    readonly publicUrl: string | null;
};

type IndexProps = { readonly projects: readonly ProjectRow[] };

const STATUS_LABEL: Record<string, string> = {
    draft: 'Borrador',
    published: 'Publicado',
    hidden: 'Oculto',
};

const PERMISSION_LABEL: Record<string, string> = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    unknown: 'Desconocido',
};

function patch(id: number, action: string) {
    router.patch(`/admin/projects/${id}/${action}`, {}, { preserveScroll: true });
}

export default function ProjectsIndex({ projects }: IndexProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const title = (project: ProjectRow): string => project.title?.es ?? project.title?.en ?? '—';
    const slug = (project: ProjectRow): string => project.slug?.es ?? project.slug?.en ?? '';

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();

        return projects.filter((project) => {
            if (term && !`${title(project)} ${slug(project)}`.toLowerCase().includes(term)) {
                return false;
            }

            return statusFilter === 'all' || project.status === statusFilter;
        });
    }, [projects, search, statusFilter]);

    return (
        <AdminLayout
            title="Proyectos"
            breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Proyectos' }]}
            actions={
                <Link
                    href="/admin/projects/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 dark:bg-qd-teal dark:text-qd-ink"
                >
                    <Plus aria-hidden="true" size={16} />
                    Nuevo proyecto
                </Link>
            }
        >
            <Head title="Proyectos · Admin AbacoQD" />

            <div className="rounded-2xl border border-qd-mist bg-qd-white dark:border-qd-white/10 dark:bg-qd-surface">
                <div className="flex flex-wrap items-center gap-3 border-b border-qd-mist p-4 dark:border-qd-white/10">
                    <div className="relative flex-1 sm:min-w-64">
                        <Search aria-hidden="true" size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-qd-text-medium" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por título o slug..."
                            className="h-9 w-full rounded-lg border border-qd-mist bg-transparent pr-3 pl-9 text-sm outline-none focus-visible:border-qd-teal-2/50 dark:border-qd-white/10"
                        />
                    </div>
                    <AdminSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-auto">
                        <option value="all">Estado: todos</option>
                        {Object.entries(STATUS_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>
                                Estado: {label}
                            </option>
                        ))}
                    </AdminSelect>
                </div>

                {filtered.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState
                            icon={FolderKanban}
                            title={projects.length === 0 ? 'Aún no hay proyectos' : 'Sin resultados'}
                            description={projects.length === 0 ? 'Crea el primer proyecto.' : 'Ajusta los filtros de búsqueda.'}
                            action={
                                projects.length === 0 ? (
                                    <Link
                                        href="/admin/projects/create"
                                        className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white dark:bg-qd-teal dark:text-qd-ink"
                                    >
                                        <Plus aria-hidden="true" size={16} />
                                        Nuevo proyecto
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
                                    <th className="px-4 py-3">Proyecto</th>
                                    <th className="px-4 py-3">Cliente</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Permiso</th>
                                    <th className="px-4 py-3 text-center">Home</th>
                                    <th className="px-4 py-3 text-center">Destacado</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-qd-mist dark:divide-qd-white/10">
                                {filtered.map((project) => (
                                    <tr key={project.id} className="align-middle">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-qd-mist bg-qd-bg dark:border-qd-white/10 dark:bg-qd-ink">
                                                    {project.coverImage ? (
                                                        <img src={project.coverImage} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <FolderKanban aria-hidden="true" size={14} className="text-qd-text-medium" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-qd-ink dark:text-qd-white">{title(project)}</p>
                                                    <p className="text-xs text-qd-text-medium dark:text-qd-white/40">/{slug(project)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-qd-text-high dark:text-qd-white/70">{project.clientName ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-qd-mist px-2.5 py-1 text-xs font-semibold dark:bg-qd-white/10">
                                                {STATUS_LABEL[project.status] ?? project.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={cn(
                                                    'rounded-full px-2.5 py-1 text-xs font-semibold',
                                                    project.permissionStatus === 'approved'
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                        : 'bg-qd-mist dark:bg-qd-white/10',
                                                )}
                                            >
                                                {PERMISSION_LABEL[project.permissionStatus] ?? project.permissionStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <RowToggle checked={project.showOnHome} onClick={() => patch(project.id, 'toggle-home')} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <RowToggle checked={project.isFeatured} onClick={() => patch(project.id, 'toggle-featured')} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/projects/${project.id}/edit`}
                                                    className="flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:border-qd-white/10 dark:text-qd-white/70"
                                                >
                                                    <Pencil aria-hidden="true" size={15} />
                                                </Link>
                                                {project.publicUrl && (
                                                    <a
                                                        href={project.publicUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={cn(
                                                            'flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:border-qd-white/10 dark:text-qd-white/70',
                                                            project.status !== 'published' && 'pointer-events-none opacity-40',
                                                        )}
                                                    >
                                                        <ExternalLink aria-hidden="true" size={15} />
                                                    </a>
                                                )}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70">
                                                        <MoreVertical aria-hidden="true" size={15} />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onSelect={() => patch(project.id, 'toggle-projects')}>
                                                            {project.showInProjects ? 'Ocultar de Proyectos' : 'Mostrar en Proyectos'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onSelect={() => patch(project.id, 'toggle-collaborations')}>
                                                            {project.showInCollaborations ? 'Ocultar de Colaboraciones' : 'Mostrar en Colaboraciones'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={() => {
                                                                if (window.confirm('¿Archivar este proyecto?')) {
                                                                    router.delete(`/admin/projects/${project.id}`, { preserveScroll: true });
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

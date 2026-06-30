import { Head, Link, router } from '@inertiajs/react';
import {
    MoreVertical,
    Pencil,
    Plus,
    Search,
    Users as UsersIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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

type UserRow = {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly role: string;
    readonly createdAt: string | null;
};

type IndexProps = {
    readonly users: PaginatedData<UserRow>;
    readonly roles: readonly { value: string; label: string }[];
    readonly filters: { readonly q?: string };
};

function patch(id: number, action: string) {
    router.patch(`/admin/users/${id}/${action}`, {}, { preserveScroll: true });
}

export default function UsersIndex({ users, roles, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.q ?? '');

    const roleLabel = useMemo(() => {
        const map: Record<string, string> = {};
        roles.forEach((role) => {
            map[role.value] = role.label;
        });

        return map;
    }, [roles]);

    const applyFilters = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            '/admin/users',
            { q: search },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout
            title="Usuarios"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Usuarios' },
            ]}
            actions={
                <Link
                    href="/admin/users/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 dark:bg-qd-teal dark:text-qd-ink"
                >
                    <Plus aria-hidden="true" size={16} />
                    Nuevo usuario
                </Link>
            }
        >
            <Head title="Usuarios · Admin AbacoQD" />

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
                            placeholder="Buscar por nombre o email..."
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

                {users.data.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState
                            icon={UsersIcon}
                            title={
                                !filters.q
                                    ? 'Aún no hay usuarios'
                                    : 'Sin resultados'
                            }
                            description={
                                !filters.q
                                    ? 'Crea el primer usuario.'
                                    : 'Ajusta la búsqueda.'
                            }
                            action={
                                !filters.q ? (
                                    <Link
                                        href="/admin/users/create"
                                        className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white dark:bg-qd-teal dark:text-qd-ink"
                                    >
                                        <Plus aria-hidden="true" size={16} />
                                        Nuevo usuario
                                    </Link>
                                ) : undefined
                            }
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-160 text-sm">
                            <thead>
                                <tr className="border-b border-qd-mist text-left text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:border-qd-white/10 dark:text-qd-white/50">
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Rol</th>
                                    <th className="px-4 py-3 text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-qd-mist dark:divide-qd-white/10">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="align-middle">
                                        <td className="px-4 py-3 font-semibold text-qd-ink dark:text-qd-white">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-3 text-qd-text-high dark:text-qd-white/70">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-qd-mist px-2.5 py-1 text-xs font-semibold dark:bg-qd-white/10">
                                                {roleLabel[user.role] ??
                                                    user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
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
                                                            onSelect={() => {
                                                                if (
                                                                    window.confirm(
                                                                        '¿Generar una nueva contraseña temporal?',
                                                                    )
                                                                ) {
                                                                    patch(
                                                                        user.id,
                                                                        'reset-password',
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            Generar contraseña
                                                            temporal
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={() => {
                                                                if (
                                                                    window.confirm(
                                                                        '¿Eliminar este usuario?',
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        `/admin/users/${user.id}`,
                                                                        {
                                                                            preserveScroll: true,
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <AdminPagination pagination={users} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

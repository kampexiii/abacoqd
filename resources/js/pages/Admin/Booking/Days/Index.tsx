import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarDays, MoreVertical, Pencil, Plus } from 'lucide-react';

import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPagination from '@/components/admin/AdminPagination';
import type { PaginatedData } from '@/components/admin/AdminPagination';
import BookingSubNav from '@/components/admin/BookingSubNav';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';

type DayRow = {
    readonly id: number;
    readonly date: string;
    readonly title: string | null;
    readonly isAvailable: boolean;
    readonly adminBlocked: boolean;
    readonly blockReason: string | null;
    readonly slotsCount: number;
};

type IndexProps = { readonly days: PaginatedData<DayRow> };

function patch(id: number, action: string) {
    router.patch(
        `/admin/booking/days/${id}/${action}`,
        {},
        { preserveScroll: true },
    );
}

export default function BookingDaysIndex({ days }: IndexProps) {
    const page = usePage();

    return (
        <AdminLayout
            title="Días de reserva"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Reserva' },
                { title: 'Días' },
            ]}
            actions={
                <Link
                    href="/admin/booking/days/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 dark:bg-qd-teal dark:text-qd-ink"
                >
                    <Plus aria-hidden="true" size={16} />
                    Nuevo día
                </Link>
            }
        >
            <Head title="Reserva · Días · Admin AbacoQD" />
            <BookingSubNav currentUrl={page.url} />

            <div className="rounded-2xl border border-qd-mist bg-qd-white dark:border-qd-white/10 dark:bg-qd-surface">
                {days.data.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState
                            icon={CalendarDays}
                            title="Aún no hay días configurados"
                            description="Crea el primer día disponible para reservas."
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-180 text-sm">
                            <thead>
                                <tr className="border-b border-qd-mist text-left text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:border-qd-white/10 dark:text-qd-white/50">
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Título</th>
                                    <th className="px-4 py-3 text-center">
                                        Franjas
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Disponible
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Bloqueado
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-qd-mist dark:divide-qd-white/10">
                                {days.data.map((day) => (
                                    <tr key={day.id}>
                                        <td className="px-4 py-3 font-semibold text-qd-ink dark:text-qd-white">
                                            {day.date}
                                        </td>
                                        <td className="px-4 py-3 text-qd-text-high dark:text-qd-white/70">
                                            {day.title ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Link
                                                href={`/admin/booking/slots?day=${day.id}`}
                                                className="text-qd-teal-2 hover:underline dark:text-qd-teal"
                                            >
                                                {day.slotsCount}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <RowToggle
                                                checked={day.isAvailable}
                                                onClick={() =>
                                                    patch(
                                                        day.id,
                                                        'toggle-available',
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <RowToggle
                                                checked={day.adminBlocked}
                                                onClick={() =>
                                                    patch(
                                                        day.id,
                                                        'toggle-blocked',
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/booking/days/${day.id}/edit`}
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
                                                            variant="destructive"
                                                            onSelect={() => {
                                                                if (
                                                                    window.confirm(
                                                                        '¿Eliminar este día? Solo es posible si no tiene reservas activas.',
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        `/admin/booking/days/${day.id}`,
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
                        <AdminPagination pagination={days} />
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

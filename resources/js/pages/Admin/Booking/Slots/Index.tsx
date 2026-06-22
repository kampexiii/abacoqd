import { Head, Link, router, usePage } from '@inertiajs/react';
import { Clock, MoreVertical, Pencil, Plus } from 'lucide-react';

import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminSelect from '@/components/admin/AdminSelect';
import BookingSubNav from '@/components/admin/BookingSubNav';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';

type SlotRow = {
    readonly id: number;
    readonly dayId: number;
    readonly dayDate: string | null;
    readonly startsAt: string;
    readonly endsAt: string;
    readonly status: string;
    readonly adminBlocked: boolean;
    readonly capacity: number;
    readonly reservedCount: number;
};

type IndexProps = {
    readonly slots: readonly SlotRow[];
    readonly days: readonly { readonly value: number; readonly label: string }[];
    readonly filterDayId: number | null;
};

const STATUS_LABEL: Record<string, string> = {
    available: 'Disponible',
    reserved: 'Reservada',
    blocked: 'Bloqueada',
    cancelled: 'Cancelada',
    expired: 'Expirada',
};

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export default function BookingSlotsIndex({ slots, days, filterDayId }: IndexProps) {
    const page = usePage();

    return (
        <AdminLayout
            title="Franjas de reserva"
            breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Reserva' }, { title: 'Franjas' }]}
            actions={
                <Link
                    href="/admin/booking/slots/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 dark:bg-qd-teal dark:text-qd-ink"
                >
                    <Plus aria-hidden="true" size={16} />
                    Nueva franja
                </Link>
            }
        >
            <Head title="Reserva · Franjas · Admin AbacoQD" />
            <BookingSubNav currentUrl={page.url} />

            <div className="mb-4 flex items-center gap-2">
                <AdminSelect
                    value={filterDayId ?? ''}
                    onChange={(e) => router.get('/admin/booking/slots', e.target.value ? { day: e.target.value } : {})}
                    className="w-auto"
                >
                    <option value="">Todos los días</option>
                    {days.map((day) => (
                        <option key={day.value} value={day.value}>
                            {day.label}
                        </option>
                    ))}
                </AdminSelect>
            </div>

            <div className="rounded-2xl border border-qd-mist bg-qd-white dark:border-qd-white/10 dark:bg-qd-surface">
                {slots.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState icon={Clock} title="Sin franjas" description="Crea franjas horarias para un día disponible." />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-180 text-sm">
                            <thead>
                                <tr className="border-b border-qd-mist text-left text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:border-qd-white/10 dark:text-qd-white/50">
                                    <th className="px-4 py-3">Día</th>
                                    <th className="px-4 py-3">Horario</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3 text-center">Capacidad</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-qd-mist dark:divide-qd-white/10">
                                {slots.map((slot) => (
                                    <tr key={slot.id}>
                                        <td className="px-4 py-3 font-semibold text-qd-ink dark:text-qd-white">{slot.dayDate ?? '—'}</td>
                                        <td className="px-4 py-3 text-qd-text-high dark:text-qd-white/70">
                                            {formatTime(slot.startsAt)} - {formatTime(slot.endsAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={cn(
                                                    'rounded-full px-2.5 py-1 text-xs font-semibold',
                                                    slot.status === 'available'
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                        : 'bg-qd-mist dark:bg-qd-white/10',
                                                )}
                                            >
                                                {STATUS_LABEL[slot.status] ?? slot.status}
                                                {slot.adminBlocked ? ' · Bloqueada' : ''}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-qd-text-high dark:text-qd-white/70">
                                            {slot.reservedCount} / {slot.capacity}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/booking/slots/${slot.id}/edit`}
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
                                                            onSelect={() =>
                                                                router.patch(`/admin/booking/slots/${slot.id}/toggle-blocked`, {}, { preserveScroll: true })
                                                            }
                                                        >
                                                            {slot.adminBlocked ? 'Desbloquear' : 'Bloquear'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={() => {
                                                                if (window.confirm('¿Eliminar esta franja? Solo es posible sin reservas activas.')) {
                                                                    router.delete(`/admin/booking/slots/${slot.id}`, { preserveScroll: true });
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
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

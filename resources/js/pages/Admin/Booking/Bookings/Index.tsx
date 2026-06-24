import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, NotebookPen } from 'lucide-react';

import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPagination from '@/components/admin/AdminPagination';
import type { PaginatedData } from '@/components/admin/AdminPagination';
import BookingSubNav from '@/components/admin/BookingSubNav';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';

type BookingRow = {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly company: string | null;
    readonly status: string;
    readonly serviceName: string | null;
    readonly dayDate: string | null;
    readonly startsAt: string | null;
    readonly createdAt: string | null;
};

type IndexProps = { readonly bookings: PaginatedData<BookingRow> };

const STATUS_LABEL: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
    no_show: 'No se presentó',
};

const STATUS_CLASS: Record<string, string> = {
    confirmed:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    completed: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    no_show:
        'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
};

export default function BookingBookingsIndex({ bookings }: IndexProps) {
    const page = usePage();

    return (
        <AdminLayout
            title="Reservas"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Reserva' },
                { title: 'Reservas' },
            ]}
        >
            <Head title="Reserva · Reservas · Admin AbacoQD" />
            <BookingSubNav currentUrl={page.url} />

            <div className="rounded-2xl border border-qd-mist bg-qd-white dark:border-qd-white/10 dark:bg-qd-surface">
                {bookings.data.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState
                            icon={NotebookPen}
                            title="Aún no hay reservas"
                            description="Las reservas confirmadas desde /reserva aparecerán aquí."
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-200 text-sm">
                            <thead>
                                <tr className="border-b border-qd-mist text-left text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:border-qd-white/10 dark:text-qd-white/50">
                                    <th className="px-4 py-3">Contacto</th>
                                    <th className="px-4 py-3">Servicio</th>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3 text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-qd-mist dark:divide-qd-white/10">
                                {bookings.data.map((booking) => (
                                    <tr key={booking.id}>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-qd-ink dark:text-qd-white">
                                                {booking.name}
                                            </p>
                                            <p className="text-xs text-qd-text-medium dark:text-qd-white/40">
                                                {booking.email}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-qd-text-high dark:text-qd-white/70">
                                            {booking.serviceName ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-qd-text-high dark:text-qd-white/70">
                                            {booking.dayDate ?? '—'}
                                            {booking.startsAt && (
                                                <span className="ml-1 text-xs text-qd-text-medium dark:text-qd-white/40">
                                                    {new Date(
                                                        booking.startsAt,
                                                    ).toLocaleTimeString(
                                                        'es-ES',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={cn(
                                                    'rounded-full px-2.5 py-1 text-xs font-semibold',
                                                    STATUS_CLASS[
                                                        booking.status
                                                    ] ??
                                                        'bg-qd-mist dark:bg-qd-white/10',
                                                )}
                                            >
                                                {STATUS_LABEL[booking.status] ??
                                                    booking.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/admin/booking/bookings/${booking.id}`}
                                                className="inline-flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:border-qd-white/10 dark:text-qd-white/70"
                                            >
                                                <Eye
                                                    aria-hidden="true"
                                                    size={15}
                                                />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <AdminPagination pagination={bookings} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

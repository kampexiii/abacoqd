import { Head, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEvent } from 'react';

import { adminSelectClass as selectClass } from '@/components/admin/AdminSelect';
import FormSection from '@/components/admin/FormSection';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

type BookingDetail = {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly phone: string | null;
    readonly company: string | null;
    readonly message: string | null;
    readonly status: string;
    readonly serviceName: string | null;
    readonly dayDate: string | null;
    readonly startsAt: string | null;
    readonly endsAt: string | null;
    readonly adminNotes: string | null;
    readonly createdAt: string | null;
};

type ShowProps = { readonly booking: BookingDetail };

const textareaClass =
    'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

export default function BookingBookingsShow({ booking }: ShowProps) {
    const form = useForm({
        status: booking.status,
        admin_notes: booking.adminNotes ?? '',
    });

    const errors = form.errors as Record<string, string>;

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(`/admin/booking/bookings/${booking.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout
            title={`Reserva de ${booking.name}`}
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Reserva', href: '/admin/booking/bookings' },
                { title: 'Reservas', href: '/admin/booking/bookings' },
                { title: booking.name },
            ]}
        >
            <Head title={`Reserva de ${booking.name} · Admin AbacoQD`} />

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="flex flex-col gap-6">
                    <FormSection title="Datos del solicitante">
                        <dl className="grid gap-3 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-xs font-semibold text-qd-text-medium dark:text-qd-white/40">
                                    Nombre
                                </dt>
                                <dd className="text-qd-ink dark:text-qd-white">
                                    {booking.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold text-qd-text-medium dark:text-qd-white/40">
                                    Email
                                </dt>
                                <dd className="text-qd-ink dark:text-qd-white">
                                    {booking.email}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold text-qd-text-medium dark:text-qd-white/40">
                                    Teléfono
                                </dt>
                                <dd className="text-qd-ink dark:text-qd-white">
                                    {booking.phone ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold text-qd-text-medium dark:text-qd-white/40">
                                    Empresa
                                </dt>
                                <dd className="text-qd-ink dark:text-qd-white">
                                    {booking.company ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold text-qd-text-medium dark:text-qd-white/40">
                                    Servicio
                                </dt>
                                <dd className="text-qd-ink dark:text-qd-white">
                                    {booking.serviceName ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold text-qd-text-medium dark:text-qd-white/40">
                                    Fecha y hora
                                </dt>
                                <dd className="text-qd-ink dark:text-qd-white">
                                    {booking.dayDate ?? '—'}
                                    {booking.startsAt && booking.endsAt && (
                                        <>
                                            {' · '}
                                            {new Date(
                                                booking.startsAt,
                                            ).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}{' '}
                                            -{' '}
                                            {new Date(
                                                booking.endsAt,
                                            ).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </>
                                    )}
                                </dd>
                            </div>
                        </dl>
                        {booking.message && (
                            <div className="mt-4">
                                <p className="text-xs font-semibold text-qd-text-medium dark:text-qd-white/40">
                                    Mensaje
                                </p>
                                <p className="mt-1 text-sm text-qd-ink dark:text-qd-white">
                                    {booking.message}
                                </p>
                            </div>
                        )}
                    </FormSection>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <FormSection title="Gestión">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label>Estado</Label>
                                <select
                                    value={form.data.status}
                                    onChange={(e) =>
                                        form.setData('status', e.target.value)
                                    }
                                    className={selectClass}
                                >
                                    <option value="pending">Pendiente</option>
                                    <option value="confirmed">
                                        Confirmada
                                    </option>
                                    <option value="completed">
                                        Completada
                                    </option>
                                    <option value="cancelled">Cancelada</option>
                                    <option value="no_show">
                                        No se presentó
                                    </option>
                                </select>
                                {errors.status && (
                                    <p className="text-sm text-red-600">
                                        {errors.status}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Notas internas</Label>
                                <textarea
                                    value={form.data.admin_notes}
                                    onChange={(e) =>
                                        form.setData(
                                            'admin_notes',
                                            e.target.value,
                                        )
                                    }
                                    rows={5}
                                    className={textareaClass}
                                />
                                {errors.admin_notes && (
                                    <p className="text-sm text-red-600">
                                        {errors.admin_notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    </FormSection>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-qd-teal-2 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60 dark:bg-qd-teal dark:text-qd-ink"
                    >
                        {form.processing && (
                            <Loader2
                                aria-hidden="true"
                                size={16}
                                className="animate-spin"
                            />
                        )}
                        Guardar
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

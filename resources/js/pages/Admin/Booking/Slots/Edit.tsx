import { Head } from '@inertiajs/react';

import BookingSlotForm from '@/components/admin/BookingSlotForm';
import type { AdminBookingSlotRecord, DayOption } from '@/components/admin/BookingSlotForm';
import AdminLayout from '@/layouts/admin-layout';

type EditProps = { readonly slot: AdminBookingSlotRecord; readonly days: readonly DayOption[] };

export default function BookingSlotsEdit({ slot, days }: EditProps) {
    return (
        <AdminLayout
            title="Editar franja"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Reserva', href: '/admin/booking/slots' },
                { title: 'Franjas', href: '/admin/booking/slots' },
                { title: 'Editar' },
            ]}
        >
            <Head title="Editar franja · Admin AbacoQD" />
            <BookingSlotForm mode="edit" slot={slot} days={days} />
        </AdminLayout>
    );
}

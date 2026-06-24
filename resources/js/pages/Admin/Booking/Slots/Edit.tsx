import { Head } from '@inertiajs/react';

import BookingSlotForm from '@/components/admin/BookingSlotForm';
import type { AdminBookingSlotRecord } from '@/components/admin/BookingSlotForm';
import AdminLayout from '@/layouts/admin-layout';

type EditProps = { readonly slot: AdminBookingSlotRecord };

export default function BookingSlotsEdit({ slot }: EditProps) {
    return (
        <AdminLayout
            title="Editar franja"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Reserva', href: '/admin/booking/calendar' },
                { title: 'Franjas', href: '/admin/booking/slots' },
                { title: 'Editar' },
            ]}
        >
            <Head title="Editar franja · Admin AbacoQD" />
            <BookingSlotForm mode="edit" slot={slot} />
        </AdminLayout>
    );
}

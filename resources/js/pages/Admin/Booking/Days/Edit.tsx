import { Head } from '@inertiajs/react';

import BookingDayForm from '@/components/admin/BookingDayForm';
import type { AdminBookingDayRecord } from '@/components/admin/BookingDayForm';
import AdminLayout from '@/layouts/admin-layout';

type EditProps = { readonly day: AdminBookingDayRecord };

export default function BookingDaysEdit({ day }: EditProps) {
    return (
        <AdminLayout
            title="Editar día de reserva"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Reserva', href: '/admin/booking/days' },
                { title: 'Días', href: '/admin/booking/days' },
                { title: 'Editar' },
            ]}
        >
            <Head title="Editar día de reserva · Admin AbacoQD" />
            <BookingDayForm mode="edit" day={day} />
        </AdminLayout>
    );
}

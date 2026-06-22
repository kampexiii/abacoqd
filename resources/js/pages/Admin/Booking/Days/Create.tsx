import { Head } from '@inertiajs/react';

import BookingDayForm from '@/components/admin/BookingDayForm';
import AdminLayout from '@/layouts/admin-layout';

export default function BookingDaysCreate() {
    return (
        <AdminLayout
            title="Nuevo día de reserva"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Reserva', href: '/admin/booking/days' },
                { title: 'Días', href: '/admin/booking/days' },
                { title: 'Nuevo' },
            ]}
        >
            <Head title="Nuevo día de reserva · Admin AbacoQD" />
            <BookingDayForm mode="create" />
        </AdminLayout>
    );
}

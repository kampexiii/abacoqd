import { Head } from '@inertiajs/react';

import BookingSlotForm from '@/components/admin/BookingSlotForm';
import type { DayOption } from '@/components/admin/BookingSlotForm';
import AdminLayout from '@/layouts/admin-layout';

type CreateProps = { readonly days: readonly DayOption[] };

export default function BookingSlotsCreate({ days }: CreateProps) {
    return (
        <AdminLayout
            title="Nueva franja"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Reserva', href: '/admin/booking/slots' },
                { title: 'Franjas', href: '/admin/booking/slots' },
                { title: 'Nueva' },
            ]}
        >
            <Head title="Nueva franja · Admin AbacoQD" />
            <BookingSlotForm mode="create" days={days} />
        </AdminLayout>
    );
}

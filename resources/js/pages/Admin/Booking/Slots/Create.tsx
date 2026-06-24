import { Head } from '@inertiajs/react';

import BookingSlotForm from '@/components/admin/BookingSlotForm';
import AdminLayout from '@/layouts/admin-layout';

type CreateProps = { readonly defaultDate: string | null };

export default function BookingSlotsCreate({ defaultDate }: CreateProps) {
    return (
        <AdminLayout
            title="Nueva franja"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Reserva', href: '/admin/booking/calendar' },
                { title: 'Franjas', href: '/admin/booking/slots' },
                { title: 'Nueva' },
            ]}
        >
            <Head title="Nueva franja · Admin AbacoQD" />
            <BookingSlotForm mode="create" defaultDate={defaultDate} />
        </AdminLayout>
    );
}

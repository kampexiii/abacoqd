import { Head } from '@inertiajs/react';

import FaqForm from '@/components/admin/FaqForm';
import AdminLayout from '@/layouts/admin-layout';

type CreateProps = { readonly nextSortOrder: number };

export default function FaqsCreate({ nextSortOrder }: CreateProps) {
    return (
        <AdminLayout
            title="Nueva FAQ"
            breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'FAQs', href: '/admin/faqs' }, { title: 'Nueva' }]}
        >
            <Head title="Nueva FAQ · Admin AbacoQD" />
            <FaqForm mode="create" defaultSortOrder={nextSortOrder} />
        </AdminLayout>
    );
}

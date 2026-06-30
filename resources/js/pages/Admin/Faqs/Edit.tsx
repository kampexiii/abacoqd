import { Head } from '@inertiajs/react';

import FaqForm from '@/components/admin/FaqForm';
import type { AdminFaqRecord } from '@/components/admin/FaqForm';
import AdminLayout from '@/layouts/admin-layout';

type EditProps = { readonly faq: AdminFaqRecord };

export default function FaqsEdit({ faq }: EditProps) {
    return (
        <AdminLayout
            title="Editar FAQ"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'FAQs', href: '/admin/faqs' },
                { title: 'Editar' },
            ]}
        >
            <Head title="Editar FAQ · Admin AbacoQD" />
            <FaqForm mode="edit" faq={faq} />
        </AdminLayout>
    );
}

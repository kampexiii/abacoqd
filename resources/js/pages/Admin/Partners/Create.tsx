import { Head } from '@inertiajs/react';

import PartnerForm from '@/components/admin/PartnerForm';
import type { Option } from '@/components/admin/PartnerForm';
import AdminLayout from '@/layouts/admin-layout';

type CreateProps = {
    readonly types: readonly Option[];
    readonly nextSortOrder: number;
};

export default function PartnersCreate({ types, nextSortOrder }: CreateProps) {
    return (
        <AdminLayout
            title="Nuevo partner"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Partners', href: '/admin/partners' },
                { title: 'Nuevo' },
            ]}
        >
            <Head title="Nuevo partner · Admin AbacoQD" />
            <PartnerForm
                mode="create"
                types={types}
                defaultSortOrder={nextSortOrder}
            />
        </AdminLayout>
    );
}

import { Head } from '@inertiajs/react';

import PartnerForm from '@/components/admin/PartnerForm';
import type { AdminPartnerRecord, Option } from '@/components/admin/PartnerForm';
import AdminLayout from '@/layouts/admin-layout';

type EditProps = {
    readonly partner: AdminPartnerRecord;
    readonly types: readonly Option[];
};

export default function PartnersEdit({ partner, types }: EditProps) {
    return (
        <AdminLayout
            title={partner.name}
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Partners', href: '/admin/partners' },
                { title: 'Editar' },
            ]}
        >
            <Head title={`Editar · ${partner.name} · Admin AbacoQD`} />
            <PartnerForm mode="edit" types={types} partner={partner} />
        </AdminLayout>
    );
}

import { Head } from '@inertiajs/react';

import ServiceForm from '@/components/admin/ServiceForm';
import type {AdminServiceRecord, StatusOption} from '@/components/admin/ServiceForm';
import { useLanguage } from '@/hooks/use-language';
import AdminLayout from '@/layouts/admin-layout';

type EditProps = {
    readonly service: AdminServiceRecord;
    readonly statuses: readonly StatusOption[];
};

export default function ServicesEdit({ service, statuses }: EditProps) {
    const { t, locale } = useLanguage();

    const name =
        service.title?.[locale] ?? service.title?.es ?? service.title?.en ?? t('admin.services.editTitle');

    return (
        <AdminLayout
            title={name}
            breadcrumbs={[
                { title: t('admin.nav.dashboard'), href: '/admin/dashboard' },
                { title: t('admin.services.title'), href: '/admin/services' },
                { title: t('admin.services.editTitle') },
            ]}
        >
            <Head title={`${t('admin.services.editTitle')} · ${name} · Admin AbacoQD`} />
            <ServiceForm mode="edit" statuses={statuses} service={service} />
        </AdminLayout>
    );
}

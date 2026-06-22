import { Head } from '@inertiajs/react';

import ServiceForm from '@/components/admin/ServiceForm';
import type {StatusOption} from '@/components/admin/ServiceForm';
import { useLanguage } from '@/hooks/use-language';
import AdminLayout from '@/layouts/admin-layout';

type CreateProps = {
    readonly statuses: readonly StatusOption[];
    readonly nextSortOrder: number;
};

export default function ServicesCreate({ statuses, nextSortOrder }: CreateProps) {
    const { t } = useLanguage();

    return (
        <AdminLayout
            title={t('admin.services.createTitle')}
            breadcrumbs={[
                { title: t('admin.nav.dashboard'), href: '/admin/dashboard' },
                { title: t('admin.services.title'), href: '/admin/services' },
                { title: t('admin.services.createTitle') },
            ]}
        >
            <Head title={`${t('admin.services.createTitle')} · Admin AbacoQD`} />
            <ServiceForm mode="create" statuses={statuses} defaultSortOrder={nextSortOrder} />
        </AdminLayout>
    );
}

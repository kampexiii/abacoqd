import { Head } from '@inertiajs/react';

import ProjectForm from '@/components/admin/ProjectForm';
import type { Option, PartnerOption } from '@/components/admin/ProjectForm';
import AdminLayout from '@/layouts/admin-layout';

type CreateProps = {
    readonly statuses: readonly Option[];
    readonly permissionStatuses: readonly Option[];
    readonly partners: readonly PartnerOption[];
    readonly nextSortOrder: number;
};

export default function ProjectsCreate({ statuses, permissionStatuses, partners, nextSortOrder }: CreateProps) {
    return (
        <AdminLayout
            title="Nuevo proyecto"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Proyectos', href: '/admin/projects' },
                { title: 'Nuevo' },
            ]}
        >
            <Head title="Nuevo proyecto · Admin AbacoQD" />
            <ProjectForm
                mode="create"
                statuses={statuses}
                permissionStatuses={permissionStatuses}
                partners={partners}
                defaultSortOrder={nextSortOrder}
            />
        </AdminLayout>
    );
}

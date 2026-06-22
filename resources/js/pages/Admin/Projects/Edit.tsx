import { Head } from '@inertiajs/react';

import ProjectForm from '@/components/admin/ProjectForm';
import type { AdminProjectRecord, Option, PartnerOption } from '@/components/admin/ProjectForm';
import AdminLayout from '@/layouts/admin-layout';

type EditProps = {
    readonly project: AdminProjectRecord;
    readonly statuses: readonly Option[];
    readonly permissionStatuses: readonly Option[];
    readonly partners: readonly PartnerOption[];
};

export default function ProjectsEdit({ project, statuses, permissionStatuses, partners }: EditProps) {
    const name = project.title?.es ?? project.title?.en ?? 'Editar proyecto';

    return (
        <AdminLayout
            title={name}
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Proyectos', href: '/admin/projects' },
                { title: 'Editar' },
            ]}
        >
            <Head title={`Editar · ${name} · Admin AbacoQD`} />
            <ProjectForm mode="edit" statuses={statuses} permissionStatuses={permissionStatuses} partners={partners} project={project} />
        </AdminLayout>
    );
}

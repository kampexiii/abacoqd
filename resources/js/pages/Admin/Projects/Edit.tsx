import { Head } from '@inertiajs/react';

import ProjectForm from '@/components/admin/ProjectForm';
import type {
    AdminProjectRecord,
    Option,
    PartnerOption,
    ServiceOption,
} from '@/components/admin/ProjectForm';
import AdminLayout from '@/layouts/admin-layout';

type EditProps = {
    readonly project: AdminProjectRecord;
    readonly statuses: readonly Option[];
    readonly partners: readonly PartnerOption[];
    readonly services: readonly ServiceOption[];
};

export default function ProjectsEdit({ project, statuses, partners, services }: EditProps) {
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
            <ProjectForm mode="edit" statuses={statuses} partners={partners} services={services} project={project} />
        </AdminLayout>
    );
}

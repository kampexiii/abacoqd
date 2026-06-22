import { Head } from '@inertiajs/react';

import TeamMemberForm from '@/components/admin/TeamMemberForm';
import AdminLayout from '@/layouts/admin-layout';

type CreateProps = {
    readonly nextSortOrder: number;
};

export default function TeamMembersCreate({ nextSortOrder }: CreateProps) {
    return (
        <AdminLayout
            title="Nuevo miembro de equipo"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Equipo', href: '/admin/team-members' },
                { title: 'Nuevo' },
            ]}
        >
            <Head title="Nuevo miembro de equipo · Admin AbacoQD" />
            <TeamMemberForm mode="create" defaultSortOrder={nextSortOrder} />
        </AdminLayout>
    );
}

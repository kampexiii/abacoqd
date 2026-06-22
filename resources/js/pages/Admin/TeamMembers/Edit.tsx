import { Head } from '@inertiajs/react';

import TeamMemberForm from '@/components/admin/TeamMemberForm';
import type { AdminTeamMemberRecord } from '@/components/admin/TeamMemberForm';
import AdminLayout from '@/layouts/admin-layout';

type EditProps = {
    readonly member: AdminTeamMemberRecord;
};

export default function TeamMembersEdit({ member }: EditProps) {
    const title = `Editar ${member.name}`;

    return (
        <AdminLayout
            title={title}
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Equipo', href: '/admin/team-members' },
                { title: 'Editar' },
            ]}
        >
            <Head title={`${title} · Admin AbacoQD`} />
            <TeamMemberForm mode="edit" member={member} />
        </AdminLayout>
    );
}

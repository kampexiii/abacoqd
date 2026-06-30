import { Head } from '@inertiajs/react';

import UserForm from '@/components/admin/UserForm';
import type { AdminUserRecord, RoleOption } from '@/components/admin/UserForm';
import AdminLayout from '@/layouts/admin-layout';

type EditProps = {
    readonly user: AdminUserRecord;
    readonly roles: readonly RoleOption[];
    readonly isSelf: boolean;
};

export default function UsersEdit({ user, roles, isSelf }: EditProps) {
    return (
        <AdminLayout
            title="Editar usuario"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Usuarios', href: '/admin/users' },
                { title: 'Editar' },
            ]}
        >
            <Head title="Editar usuario · Admin AbacoQD" />
            <UserForm mode="edit" user={user} roles={roles} isSelf={isSelf} />
        </AdminLayout>
    );
}

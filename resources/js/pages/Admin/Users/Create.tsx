import { Head } from '@inertiajs/react';

import UserForm from '@/components/admin/UserForm';
import type { RoleOption } from '@/components/admin/UserForm';
import AdminLayout from '@/layouts/admin-layout';

type CreateProps = { readonly roles: readonly RoleOption[] };

export default function UsersCreate({ roles }: CreateProps) {
    return (
        <AdminLayout
            title="Nuevo usuario"
            breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Usuarios', href: '/admin/users' }, { title: 'Nuevo' }]}
        >
            <Head title="Nuevo usuario · Admin AbacoQD" />
            <UserForm mode="create" roles={roles} />
        </AdminLayout>
    );
}

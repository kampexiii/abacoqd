import { Head } from '@inertiajs/react';

import PostForm from '@/components/admin/PostForm';
import type { Option } from '@/components/admin/PostForm';
import AdminLayout from '@/layouts/admin-layout';

type CreateProps = {
    readonly statuses: readonly { value: string; label: string }[];
    readonly categories: readonly Option[];
    readonly tags: readonly Option[];
};

export default function PostsCreate({
    statuses,
    categories,
    tags,
}: CreateProps) {
    return (
        <AdminLayout
            title="Nuevo post"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Blog', href: '/admin/posts' },
                { title: 'Nuevo post' },
            ]}
        >
            <Head title="Nuevo post · Admin AbacoQD" />
            <PostForm
                mode="create"
                statuses={statuses}
                categories={categories}
                tags={tags}
            />
        </AdminLayout>
    );
}

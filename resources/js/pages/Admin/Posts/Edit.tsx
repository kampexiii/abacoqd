import { Head } from '@inertiajs/react';

import PostForm from '@/components/admin/PostForm';
import type { AdminPostRecord, Option } from '@/components/admin/PostForm';
import AdminLayout from '@/layouts/admin-layout';

type EditProps = {
    readonly post: AdminPostRecord;
    readonly statuses: readonly { value: string; label: string }[];
    readonly categories: readonly Option[];
    readonly tags: readonly Option[];
};

export default function PostsEdit({ post, statuses, categories, tags }: EditProps) {
    const name = post.title?.es ?? post.title?.en ?? 'Editar post';

    return (
        <AdminLayout
            title={name}
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Blog', href: '/admin/posts' },
                { title: 'Editar' },
            ]}
        >
            <Head title={`Editar · ${name} · Admin AbacoQD`} />
            <PostForm mode="edit" statuses={statuses} categories={categories} tags={tags} post={post} />
        </AdminLayout>
    );
}

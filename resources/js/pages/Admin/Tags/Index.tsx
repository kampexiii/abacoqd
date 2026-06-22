import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';

import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin-layout';

type TagRow = {
    readonly id: number;
    readonly name: { readonly es: string | null; readonly en: string | null } | null;
    readonly slug: { readonly es: string | null; readonly en: string | null } | null;
    readonly postsCount: number;
};

type IndexProps = { readonly tags: readonly TagRow[] };

export default function TagsIndex({ tags }: IndexProps) {
    const form = useForm({ name: { es: '', en: '' }, slug: { es: '', en: '' } });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/admin/tags', { preserveScroll: true, onSuccess: () => form.reset() });
    };

    return (
        <AdminLayout
            title="Tags del blog"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Blog', href: '/admin/posts' },
                { title: 'Tags' },
            ]}
        >
            <Head title="Tags del blog · Admin AbacoQD" />

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="overflow-x-auto rounded-2xl border border-qd-mist bg-qd-white dark:border-qd-white/10 dark:bg-qd-surface">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-qd-mist text-left text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:border-qd-white/10 dark:text-qd-white/50">
                                <th className="px-4 py-3">Nombre</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3 text-center">Posts</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-qd-mist dark:divide-qd-white/10">
                            {tags.map((tag) => (
                                <tr key={tag.id}>
                                    <td className="px-4 py-3 font-semibold text-qd-ink dark:text-qd-white">{tag.name?.es}</td>
                                    <td className="px-4 py-3 text-qd-text-medium dark:text-qd-white/50">/{tag.slug?.es}</td>
                                    <td className="px-4 py-3 text-center">{tag.postsCount}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm('¿Eliminar tag?')) {
                                                    router.delete(`/admin/tags/${tag.id}`, { preserveScroll: true });
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 aria-hidden="true" size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-qd-mist bg-qd-white p-5 dark:border-qd-white/10 dark:bg-qd-surface">
                    <h2 className="text-base font-bold text-qd-ink dark:text-qd-white">Nuevo tag</h2>
                    <Input placeholder="Nombre (ES)" value={form.data.name.es} onChange={(e) => form.setData('name', { ...form.data.name, es: e.target.value })} />
                    <Input placeholder="Nombre (EN)" value={form.data.name.en} onChange={(e) => form.setData('name', { ...form.data.name, en: e.target.value })} />
                    <Input placeholder="Slug (ES)" value={form.data.slug.es} onChange={(e) => form.setData('slug', { ...form.data.slug, es: e.target.value })} />
                    <Input placeholder="Slug (EN)" value={form.data.slug.en} onChange={(e) => form.setData('slug', { ...form.data.slug, en: e.target.value })} />
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-qd-teal-2 px-4 py-2 text-sm font-bold text-white disabled:opacity-60 dark:bg-qd-teal dark:text-qd-ink"
                    >
                        <Plus aria-hidden="true" size={15} />
                        Crear
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

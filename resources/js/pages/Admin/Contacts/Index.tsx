import { Head, Link, router } from '@inertiajs/react';
import { Eye, Mail, Trash2 } from 'lucide-react';
import { useState } from 'react';

import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminSelect from '@/components/admin/AdminSelect';
import AdminLayout from '@/layouts/admin-layout';

type LocalizedText = { readonly es: string | null; readonly en: string | null };

type ContactRow = {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly company: string | null;
    readonly status: string | null;
    readonly serviceTitle: LocalizedText | null;
    readonly createdAt: string | null;
};

type ServiceOption = { readonly id: number; readonly title: LocalizedText | null };

type Filters = {
    readonly status?: string;
    readonly service_id?: string;
    readonly email?: string;
    readonly name?: string;
    readonly company?: string;
    readonly q?: string;
    readonly date_from?: string;
    readonly date_to?: string;
};

type IndexProps = {
    readonly contacts: readonly ContactRow[];
    readonly services: readonly ServiceOption[];
    readonly statuses: readonly string[];
    readonly filters: Filters;
};

const STATUS_LABELS: Record<string, string> = {
    new: 'Nuevo',
    in_review: 'En revisión',
    contacted: 'Contactado',
    converted: 'Convertido',
    discarded: 'Descartado',
    spam: 'Spam',
    archived: 'Archivado',
};

export default function ContactsIndex({ contacts, services, statuses, filters }: IndexProps) {
    const [form, setForm] = useState<Filters>(filters);
    const [selected, setSelected] = useState<number[]>([]);

    function applyFilters() {
        router.get('/admin/contacts', form, { preserveState: true, preserveScroll: true });
    }

    function toggleSelected(id: number) {
        setSelected((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
    }

    function deleteOne(id: number) {
        if (window.confirm('¿Eliminar este contacto? Esta acción no se puede deshacer.')) {
            router.delete(`/admin/contacts/${id}`, { preserveScroll: true });
        }
    }

    function purgeSelected() {
        if (selected.length === 0) {
            return;
        }

        if (window.confirm(`¿Eliminar los ${selected.length} contactos seleccionados? Esta acción no se puede deshacer.`)) {
            router.delete('/admin/contacts', { data: { ids: selected }, preserveScroll: true });
            setSelected([]);
        }
    }

    function purgeAll() {
        const confirmation = window.prompt('Escribe PURGAR para eliminar todos los contactos. Esta acción no se puede deshacer.');

        if (confirmation === 'PURGAR') {
            router.delete('/admin/contacts', { data: { confirmation }, preserveScroll: true });
        }
    }

    return (
        <AdminLayout title="Contactos" breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Contactos' }]}>
            <Head title="Contactos · Admin AbacoQD" />

            <div className="rounded-2xl border border-qd-mist bg-qd-white dark:border-qd-white/10 dark:bg-qd-surface">
                <div className="grid grid-cols-1 gap-3 border-b border-qd-mist p-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-qd-white/10">
                    <input
                        type="search"
                        value={form.q ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, q: e.target.value }))}
                        placeholder="Buscar en el mensaje..."
                        className="h-9 rounded-lg border border-qd-mist bg-transparent px-3 text-sm outline-none focus-visible:border-qd-teal-2/50 dark:border-qd-white/10"
                    />
                    <input
                        type="text"
                        value={form.name ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Nombre"
                        className="h-9 rounded-lg border border-qd-mist bg-transparent px-3 text-sm outline-none focus-visible:border-qd-teal-2/50 dark:border-qd-white/10"
                    />
                    <input
                        type="text"
                        value={form.email ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Email"
                        className="h-9 rounded-lg border border-qd-mist bg-transparent px-3 text-sm outline-none focus-visible:border-qd-teal-2/50 dark:border-qd-white/10"
                    />
                    <input
                        type="text"
                        value={form.company ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                        placeholder="Empresa"
                        className="h-9 rounded-lg border border-qd-mist bg-transparent px-3 text-sm outline-none focus-visible:border-qd-teal-2/50 dark:border-qd-white/10"
                    />
                    <AdminSelect
                        value={form.status ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                    >
                        <option value="">Todos los estados</option>
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {STATUS_LABELS[status] ?? status}
                            </option>
                        ))}
                    </AdminSelect>
                    <AdminSelect
                        value={form.service_id ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, service_id: e.target.value }))}
                    >
                        <option value="">Todos los servicios</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.title?.es ?? service.title?.en ?? `#${service.id}`}
                            </option>
                        ))}
                    </AdminSelect>
                    <input
                        type="date"
                        value={form.date_from ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, date_from: e.target.value }))}
                        className="h-9 rounded-lg border border-qd-mist bg-transparent px-3 text-sm outline-none focus-visible:border-qd-teal-2/50 dark:border-qd-white/10"
                    />
                    <input
                        type="date"
                        value={form.date_to ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, date_to: e.target.value }))}
                        className="h-9 rounded-lg border border-qd-mist bg-transparent px-3 text-sm outline-none focus-visible:border-qd-teal-2/50 dark:border-qd-white/10"
                    />
                    <div className="flex items-center gap-2 lg:col-span-4">
                        <button
                            type="button"
                            onClick={applyFilters}
                            className="rounded-lg bg-qd-teal-2 px-4 py-2 text-sm font-bold text-white dark:bg-qd-teal dark:text-qd-ink"
                        >
                            Filtrar
                        </button>
                        <button
                            type="button"
                            onClick={purgeSelected}
                            disabled={selected.length === 0}
                            className="rounded-lg border border-qd-mist px-4 py-2 text-sm font-semibold text-qd-text-high disabled:opacity-40 dark:border-qd-white/10 dark:text-qd-white/70"
                        >
                            Eliminar seleccionados ({selected.length})
                        </button>
                        <button
                            type="button"
                            onClick={purgeAll}
                            className="ml-auto rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 dark:border-red-500/30 dark:text-red-400"
                        >
                            Purgar todo
                        </button>
                    </div>
                </div>

                {contacts.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState icon={Mail} title="Sin contactos" description="No hay mensajes que coincidan con los filtros." />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-200 text-sm">
                            <thead>
                                <tr className="border-b border-qd-mist text-left text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:border-qd-white/10 dark:text-qd-white/50">
                                    <th className="px-4 py-3"></th>
                                    <th className="px-4 py-3">Nombre / Email</th>
                                    <th className="px-4 py-3">Empresa</th>
                                    <th className="px-4 py-3">Servicio</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-qd-mist dark:divide-qd-white/10">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="align-middle">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(contact.id)}
                                                onChange={() => toggleSelected(contact.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-qd-ink dark:text-qd-white">{contact.name}</div>
                                            <div className="text-xs text-qd-text-medium dark:text-qd-white/40">{contact.email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-qd-text-high dark:text-qd-white/70">{contact.company ?? '—'}</td>
                                        <td className="px-4 py-3 text-qd-text-high dark:text-qd-white/70">
                                            {contact.serviceTitle?.es ?? contact.serviceTitle?.en ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-qd-text-high dark:text-qd-white/70">
                                            {STATUS_LABELS[contact.status ?? ''] ?? contact.status ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-qd-text-medium dark:text-qd-white/40">
                                            {contact.createdAt ? new Date(contact.createdAt).toLocaleString('es-ES') : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/contacts/${contact.id}`}
                                                    className="flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:border-qd-white/10 dark:text-qd-white/70"
                                                >
                                                    <Eye aria-hidden="true" size={15} />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteOne(contact.id)}
                                                    className="flex size-8 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-red-400/60 hover:text-red-500 dark:border-qd-white/10 dark:text-qd-white/70"
                                                >
                                                    <Trash2 aria-hidden="true" size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

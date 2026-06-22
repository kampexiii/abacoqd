import { Head, router, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';

import AdminSelect from '@/components/admin/AdminSelect';
import AdminLayout from '@/layouts/admin-layout';

type LocalizedText = { readonly es: string | null; readonly en: string | null };

type ContactRecord = {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly phone: string | null;
    readonly company: string | null;
    readonly status: string | null;
    readonly serviceTitle: LocalizedText | null;
    readonly message: string;
    readonly internalNotes: string | null;
    readonly ipAddress: string | null;
    readonly userAgent: string | null;
    readonly createdAt: string | null;
};

type ShowProps = { readonly contact: ContactRecord };

const STATUS_OPTIONS = [
    { value: 'new', label: 'Nuevo' },
    { value: 'in_review', label: 'En revisión' },
    { value: 'contacted', label: 'Contactado' },
    { value: 'converted', label: 'Convertido' },
    { value: 'discarded', label: 'Descartado' },
    { value: 'spam', label: 'Spam' },
    { value: 'archived', label: 'Archivado' },
];

export default function ContactsShow({ contact }: ShowProps) {
    const form = useForm({
        status: contact.status ?? 'new',
        internal_notes: contact.internalNotes ?? '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        form.put(`/admin/contacts/${contact.id}`, { preserveScroll: true });
    }

    function destroy() {
        if (window.confirm('¿Eliminar este contacto? Esta acción no se puede deshacer.')) {
            router.delete(`/admin/contacts/${contact.id}`);
        }
    }

    return (
        <AdminLayout
            title={`Contacto · ${contact.name}`}
            breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Contactos', href: '/admin/contacts' }, { title: contact.name }]}
            actions={
                <button
                    type="button"
                    onClick={destroy}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-bold text-red-600 dark:border-red-500/30 dark:text-red-400"
                >
                    <Trash2 aria-hidden="true" size={16} />
                    Eliminar
                </button>
            }
        >
            <Head title={`Contacto · ${contact.name} · Admin AbacoQD`} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-4 rounded-2xl border border-qd-mist bg-qd-white p-6 lg:col-span-2 dark:border-qd-white/10 dark:bg-qd-surface">
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:text-qd-white/50">Nombre</dt>
                            <dd className="text-sm text-qd-ink dark:text-qd-white">{contact.name}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:text-qd-white/50">Email</dt>
                            <dd className="text-sm text-qd-ink dark:text-qd-white">{contact.email}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:text-qd-white/50">Teléfono</dt>
                            <dd className="text-sm text-qd-ink dark:text-qd-white">{contact.phone ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:text-qd-white/50">Empresa</dt>
                            <dd className="text-sm text-qd-ink dark:text-qd-white">{contact.company ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:text-qd-white/50">
                                Servicio de interés
                            </dt>
                            <dd className="text-sm text-qd-ink dark:text-qd-white">
                                {contact.serviceTitle?.es ?? contact.serviceTitle?.en ?? '—'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:text-qd-white/50">
                                Fecha de envío
                            </dt>
                            <dd className="text-sm text-qd-ink dark:text-qd-white">
                                {contact.createdAt ? new Date(contact.createdAt).toLocaleString('es-ES') : '—'}
                            </dd>
                        </div>
                    </dl>

                    <div>
                        <dt className="text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:text-qd-white/50">Mensaje</dt>
                        <dd className="mt-1 whitespace-pre-wrap rounded-lg border border-qd-mist bg-qd-mist/20 p-3 text-sm text-qd-ink dark:border-qd-white/10 dark:bg-qd-white/5 dark:text-qd-white">
                            {contact.message}
                        </dd>
                    </div>

                    {(contact.ipAddress || contact.userAgent) && (
                        <div className="text-xs text-qd-text-medium dark:text-qd-white/40">
                            {contact.ipAddress && <div>IP: {contact.ipAddress}</div>}
                            {contact.userAgent && <div>User agent: {contact.userAgent}</div>}
                        </div>
                    )}
                </div>

                <form onSubmit={submit} className="space-y-4 rounded-2xl border border-qd-mist bg-qd-white p-6 dark:border-qd-white/10 dark:bg-qd-surface">
                    <div>
                        <label className="mb-1 block text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:text-qd-white/50">
                            Estado
                        </label>
                        <AdminSelect
                            value={form.data.status}
                            onChange={(e) => form.setData('status', e.target.value)}
                            className="h-10"
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </AdminSelect>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold tracking-wide text-qd-text-medium uppercase dark:text-qd-white/50">
                            Notas internas
                        </label>
                        <textarea
                            value={form.data.internal_notes}
                            onChange={(e) => form.setData('internal_notes', e.target.value)}
                            rows={6}
                            className="w-full rounded-lg border border-qd-mist bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-qd-teal-2/50 dark:border-qd-white/10"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="w-full rounded-lg bg-qd-teal-2 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50 dark:bg-qd-teal dark:text-qd-ink"
                    >
                        Guardar cambios
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

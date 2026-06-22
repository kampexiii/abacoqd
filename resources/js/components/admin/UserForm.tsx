import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

import { adminSelectClass as selectClass } from '@/components/admin/AdminSelect';
import FormSection from '@/components/admin/FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type RoleOption = { readonly value: string; readonly label: string };

export type AdminUserRecord = {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly role: string;
    readonly createdAt: string | null;
};

type UserFormData = {
    name: string;
    email: string;
    role: string;
};

type UserFormProps = {
    readonly mode: 'create' | 'edit';
    readonly user?: AdminUserRecord;
    readonly roles: readonly RoleOption[];
    readonly isSelf?: boolean;
};

export default function UserForm({ mode, user, roles, isSelf = false }: UserFormProps) {
    const form = useForm<UserFormData>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? roles[0]?.value ?? '',
    });

    const { data, setData, processing } = form;
    const errors = form.errors as Record<string, string>;

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (mode === 'create') {
            form.post('/admin/users', { preserveScroll: true });

            return;
        }

        form.put(`/admin/users/${user?.id}`, { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
                <FormSection title="Datos del usuario">
                    <div className="flex flex-col gap-4">
                        <Field label="Nombre" error={errors.name}>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        </Field>
                        <Field label="Email" error={errors.email}>
                            <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        </Field>
                    </div>
                </FormSection>
            </div>

            <div className="flex flex-col gap-6">
                <FormSection title="Rol" description={isSelf ? 'No puedes quitarte tu propio rol de super_admin.' : undefined}>
                    <Field label="Rol" error={errors.role}>
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className={selectClass}
                        >
                            {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                </FormSection>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60 dark:bg-qd-teal dark:text-qd-ink"
                    >
                        {processing && <Loader2 aria-hidden="true" size={16} className="animate-spin" />}
                        Guardar
                    </button>
                    <a href="/admin/users" className="text-sm font-semibold text-qd-text-medium hover:text-qd-text-high dark:text-qd-white/50">
                        Cancelar
                    </a>
                </div>
            </div>
        </form>
    );
}

function Field({ label, error, children }: { readonly label: string; readonly error?: string; readonly children: ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label>{label}</Label>
            {children}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

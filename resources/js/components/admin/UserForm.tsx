import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

import { adminSelectClass as selectClass } from '@/components/admin/AdminSelect';
import FormSection from '@/components/admin/FormSection';
import PasswordInput from '@/components/password-input';
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
    password: string;
    password_confirmation: string;
};

type UserFormProps = {
    readonly mode: 'create' | 'edit';
    readonly user?: AdminUserRecord;
    readonly roles: readonly RoleOption[];
    readonly isSelf?: boolean;
};

export default function UserForm({
    mode,
    user,
    roles,
    isSelf = false,
}: UserFormProps) {
    const form = useForm<UserFormData>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? roles[0]?.value ?? '',
        password: '',
        password_confirmation: '',
    });

    const { data, setData, processing } = form;
    const errors = form.errors as Record<string, string>;

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (mode === 'create') {
            form.transform(({ name, email, role }) => ({ name, email, role }));
            form.post('/admin/users', { preserveScroll: true });

            return;
        }

        form.transform((current) => ({
            ...current,
            password:
                current.password.trim() === '' ? undefined : current.password,
            password_confirmation:
                current.password_confirmation.trim() === ''
                    ? undefined
                    : current.password_confirmation,
        }));
        form.put(`/admin/users/${user?.id}`, {
            preserveScroll: true,
            onSuccess: () => form.reset('password', 'password_confirmation'),
        });
    };

    return (
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
                <FormSection title="Datos del usuario">
                    <div className="flex flex-col gap-4">
                        <Field label="Nombre" error={errors.name}>
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Email" error={errors.email}>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                        </Field>
                    </div>
                </FormSection>
            </div>

            <div className="flex flex-col gap-6">
                <FormSection
                    title="Rol"
                    description={
                        isSelf
                            ? 'No puedes quitarte tu propio rol de super_admin.'
                            : undefined
                    }
                >
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

                {mode === 'edit' && (
                    <FormSection
                        title="Cambiar contraseña"
                        description="Déjala en blanco si no quieres modificar la contraseña actual."
                    >
                        <div className="flex flex-col gap-4">
                            <Field
                                label="Nueva contraseña"
                                error={errors.password}
                            >
                                <PasswordInput
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    autoComplete="new-password"
                                    placeholder="Nueva contraseña"
                                />
                            </Field>

                            <Field
                                label="Confirmar nueva contraseña"
                                error={errors.password_confirmation}
                            >
                                <PasswordInput
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    autoComplete="new-password"
                                    placeholder="Repite la nueva contraseña"
                                />
                            </Field>
                        </div>
                    </FormSection>
                )}

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60 dark:bg-qd-teal dark:text-qd-ink"
                    >
                        {processing && (
                            <Loader2
                                aria-hidden="true"
                                size={16}
                                className="animate-spin"
                            />
                        )}
                        Guardar
                    </button>
                    <a
                        href="/admin/users"
                        className="text-sm font-semibold text-qd-text-medium hover:text-qd-text-high dark:text-qd-white/50"
                    >
                        Cancelar
                    </a>
                </div>
            </div>
        </form>
    );
}

function Field({
    label,
    error,
    children,
}: {
    readonly label: string;
    readonly error?: string;
    readonly children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label>{label}</Label>
            {children}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

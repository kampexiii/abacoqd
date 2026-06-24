import { Head, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

import AdminSelect from '@/components/admin/AdminSelect';
import BookingSubNav from '@/components/admin/BookingSubNav';
import FormSection from '@/components/admin/FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';

type BookingSettingRecord = {
    readonly provider: string | null;
    readonly url: string | null;
    readonly isEnabled: boolean;
    readonly fallbackToContact: boolean;
    readonly defaultDurationMinutes: number;
    readonly defaultCapacity: number;
    readonly minAdvanceHours: number;
    readonly maxAdvanceDays: number | null;
    readonly notifyEmail: string | null;
};

type EditProps = { readonly setting: BookingSettingRecord | null };

export default function BookingSettingsEdit({ setting }: EditProps) {
    const page = usePage();
    const form = useForm({
        provider: setting?.provider ?? '',
        url: setting?.url ?? '',
        is_enabled: setting?.isEnabled ?? false,
        fallback_to_contact: setting?.fallbackToContact ?? true,
        default_duration_minutes: setting?.defaultDurationMinutes ?? 60,
        default_capacity: setting?.defaultCapacity ?? 1,
        min_advance_hours: setting?.minAdvanceHours ?? 0,
        max_advance_days: setting?.maxAdvanceDays ?? '',
        notify_email: setting?.notifyEmail ?? '',
    });

    const errors = form.errors as Record<string, string>;

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put('/admin/booking/settings', { preserveScroll: true });
    };

    return (
        <AdminLayout
            title="Configuración de reserva"
            breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Reserva' }, { title: 'Configuración' }]}
        >
            <Head title="Reserva · Configuración · Admin AbacoQD" />
            <BookingSubNav currentUrl={page.url} />

            <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="flex flex-col gap-6">
                    <FormSection title="Agenda interna" description="Valores por defecto al generar disponibilidad y ventana de reserva pública.">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Duración por defecto" error={errors.default_duration_minutes}>
                                <AdminSelect
                                    value={form.data.default_duration_minutes}
                                    onChange={(e) => form.setData('default_duration_minutes', Number(e.target.value))}
                                >
                                    {[30, 45, 60, 90, 120].map((m) => (
                                        <option key={m} value={m}>
                                            {m} min
                                        </option>
                                    ))}
                                </AdminSelect>
                            </Field>
                            <Field label="Capacidad por defecto" error={errors.default_capacity}>
                                <Input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={form.data.default_capacity}
                                    onChange={(e) => form.setData('default_capacity', Number(e.target.value))}
                                />
                            </Field>
                            <Field label="Antelación mínima (horas)" error={errors.min_advance_hours}>
                                <Input
                                    type="number"
                                    min={0}
                                    max={720}
                                    value={form.data.min_advance_hours}
                                    onChange={(e) => form.setData('min_advance_hours', Number(e.target.value))}
                                />
                            </Field>
                            <Field label="Antelación máxima (días, opcional)" error={errors.max_advance_days}>
                                <Input
                                    type="number"
                                    min={1}
                                    max={365}
                                    value={form.data.max_advance_days}
                                    onChange={(e) => form.setData('max_advance_days', e.target.value === '' ? '' : Number(e.target.value))}
                                />
                            </Field>
                        </div>
                        <div className="mt-4">
                            <Field label="Email de notificación (opcional)" error={errors.notify_email}>
                                <Input
                                    type="email"
                                    value={form.data.notify_email}
                                    onChange={(e) => form.setData('notify_email', e.target.value)}
                                    placeholder="reservas@abacodev.com"
                                />
                            </Field>
                        </div>
                    </FormSection>

                    <FormSection title="Proveedor externo (opcional)" description="Alternativa a la agenda interna (cal.com / Calendly). Deshabilitado por defecto.">
                        <div className="flex flex-col gap-4">
                            <Field label="Proveedor" error={errors.provider}>
                                <Input value={form.data.provider} onChange={(e) => form.setData('provider', e.target.value)} placeholder="cal.com" />
                            </Field>
                            <Field label="URL" error={errors.url}>
                                <Input value={form.data.url} onChange={(e) => form.setData('url', e.target.value)} placeholder="https://cal.com/abacoqd" />
                            </Field>
                        </div>
                    </FormSection>
                </div>

                <div className="flex flex-col gap-6">
                    <FormSection title="Activación">
                        <div className="flex flex-col divide-y divide-qd-mist dark:divide-qd-white/10">
                            <ToggleRow label="Reservas habilitadas" checked={form.data.is_enabled} onChange={(v) => form.setData('is_enabled', v)} />
                            <ToggleRow
                                label="Volver a contacto si falla"
                                checked={form.data.fallback_to_contact}
                                onChange={(v) => form.setData('fallback_to_contact', v)}
                            />
                        </div>
                    </FormSection>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-qd-teal-2 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60 dark:bg-qd-teal dark:text-qd-ink"
                    >
                        {form.processing && <Loader2 aria-hidden="true" size={16} className="animate-spin" />}
                        Guardar
                    </button>
                </div>
            </form>
        </AdminLayout>
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

function ToggleRow({ label, checked, onChange }: { readonly label: string; readonly checked: boolean; readonly onChange: (value: boolean) => void }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <p className="text-sm font-medium text-qd-ink dark:text-qd-white">{label}</p>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={label}
                onClick={() => onChange(!checked)}
                className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition',
                    checked ? 'bg-qd-teal-2 dark:bg-qd-teal' : 'bg-qd-mist dark:bg-qd-white/15',
                )}
            >
                <span className={cn('inline-block size-5 transform rounded-full bg-white shadow transition', checked ? 'translate-x-5.5' : 'translate-x-0.5')} />
            </button>
        </div>
    );
}

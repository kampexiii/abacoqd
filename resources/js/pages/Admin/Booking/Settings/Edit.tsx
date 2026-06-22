import { Head, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEvent } from 'react';

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
};

type EditProps = { readonly setting: BookingSettingRecord | null };

export default function BookingSettingsEdit({ setting }: EditProps) {
    const page = usePage();
    const form = useForm({
        provider: setting?.provider ?? '',
        url: setting?.url ?? '',
        is_enabled: setting?.isEnabled ?? false,
        fallback_to_contact: setting?.fallbackToContact ?? true,
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

            <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                Esta sección controla un proveedor externo (cal.com / Calendly) que actualmente está deshabilitado. El flujo público en{' '}
                <strong>/reserva</strong> usa el sistema interno de días y franjas, gestionado en las pestañas «Días» y «Franjas».
            </div>

            <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <FormSection title="Proveedor externo">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label>Proveedor</Label>
                            <Input value={form.data.provider} onChange={(e) => form.setData('provider', e.target.value)} placeholder="cal.com" />
                            {errors.provider && <p className="text-sm text-red-600">{errors.provider}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>URL</Label>
                            <Input value={form.data.url} onChange={(e) => form.setData('url', e.target.value)} placeholder="https://cal.com/abacoqd" />
                            {errors.url && <p className="text-sm text-red-600">{errors.url}</p>}
                        </div>
                    </div>
                </FormSection>

                <div className="flex flex-col gap-6">
                    <FormSection title="Activación">
                        <div className="flex flex-col divide-y divide-qd-mist dark:divide-qd-white/10">
                            <ToggleRow label="Habilitado" checked={form.data.is_enabled} onChange={(v) => form.setData('is_enabled', v)} />
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

import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

import FormSection from '@/components/admin/FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type AdminBookingDayRecord = {
    readonly id: number;
    readonly date: string;
    readonly title: string | null;
    readonly notes: string | null;
    readonly isAvailable: boolean;
    readonly maxBookings: number | null;
    readonly adminBlocked: boolean;
    readonly blockReason: string | null;
    readonly sortOrder: number;
};

type BookingDayFormData = {
    date: string;
    title: string;
    notes: string;
    is_available: boolean;
    max_bookings: number | '';
    admin_blocked: boolean;
    block_reason: string;
    sort_order: number;
};

type BookingDayFormProps = {
    readonly mode: 'create' | 'edit';
    readonly day?: AdminBookingDayRecord;
};

export default function BookingDayForm({ mode, day }: BookingDayFormProps) {
    const form = useForm<BookingDayFormData>({
        date: day?.date ?? '',
        title: day?.title ?? '',
        notes: day?.notes ?? '',
        is_available: day?.isAvailable ?? true,
        max_bookings: day?.maxBookings ?? '',
        admin_blocked: day?.adminBlocked ?? false,
        block_reason: day?.blockReason ?? '',
        sort_order: day?.sortOrder ?? 0,
    });

    const { data, setData, processing } = form;
    const errors = form.errors as Record<string, string>;

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (mode === 'create') {
            form.post('/admin/booking/days', { preserveScroll: true });

            return;
        }

        form.put(`/admin/booking/days/${day?.id}`, { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
                <FormSection title="Día">
                    <div className="flex flex-col gap-4">
                        <Field label="Fecha" error={errors.date}>
                            <Input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} />
                        </Field>
                        <Field label="Título" error={errors.title}>
                            <Input value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        </Field>
                        <Field label="Notas internas" error={errors.notes}>
                            <textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={3} className={textareaClass} />
                        </Field>
                        <Field label="Máximo de reservas (opcional)" error={errors.max_bookings}>
                            <Input
                                type="number"
                                min={0}
                                value={data.max_bookings}
                                onChange={(e) => setData('max_bookings', e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </Field>
                        <Field label="Orden" error={errors.sort_order}>
                            <Input type="number" min={0} value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                        </Field>
                    </div>
                </FormSection>
            </div>

            <div className="flex flex-col gap-6">
                <FormSection title="Disponibilidad">
                    <div className="flex flex-col divide-y divide-qd-mist dark:divide-qd-white/10">
                        <ToggleRow label="Disponible" checked={data.is_available} onChange={(v) => setData('is_available', v)} />
                        <ToggleRow label="Bloqueado" checked={data.admin_blocked} onChange={(v) => setData('admin_blocked', v)} />
                    </div>
                    {data.admin_blocked && (
                        <div className="mt-4">
                            <Field label="Motivo del bloqueo" error={errors.block_reason}>
                                <Input value={data.block_reason} onChange={(e) => setData('block_reason', e.target.value)} />
                            </Field>
                        </div>
                    )}
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
                    <a href="/admin/booking/days" className="text-sm font-semibold text-qd-text-medium hover:text-qd-text-high dark:text-qd-white/50">
                        Cancelar
                    </a>
                </div>
            </div>
        </form>
    );
}

const textareaClass =
    'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

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

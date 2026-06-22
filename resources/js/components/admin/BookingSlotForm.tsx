import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

import { adminSelectClass as selectClass } from '@/components/admin/AdminSelect';
import FormSection from '@/components/admin/FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type DayOption = { readonly value: number; readonly label: string };

export type AdminBookingSlotRecord = {
    readonly id: number;
    readonly dayId: number;
    readonly startsAt: string;
    readonly endsAt: string;
    readonly durationMinutes: number;
    readonly status: string;
    readonly adminBlocked: boolean;
    readonly blockReason: string | null;
    readonly capacity: number;
    readonly reservedCount: number;
    readonly notes: string | null;
};

type BookingSlotFormData = {
    appointment_day_id: number | '';
    starts_at: string;
    ends_at: string;
    duration_minutes: number;
    capacity: number;
    status: string;
    admin_blocked: boolean;
    block_reason: string;
    notes: string;
};

type BookingSlotFormProps = {
    readonly mode: 'create' | 'edit';
    readonly days: readonly DayOption[];
    readonly slot?: AdminBookingSlotRecord;
    readonly defaultDayId?: number;
};

function toLocalInput(iso: string): string {
    return iso.slice(0, 16);
}

export default function BookingSlotForm({ mode, days, slot, defaultDayId }: BookingSlotFormProps) {
    const form = useForm<BookingSlotFormData>({
        appointment_day_id: slot?.dayId ?? defaultDayId ?? '',
        starts_at: slot ? toLocalInput(slot.startsAt) : '',
        ends_at: slot ? toLocalInput(slot.endsAt) : '',
        duration_minutes: slot?.durationMinutes ?? 120,
        capacity: slot?.capacity ?? 1,
        status: slot?.status === 'cancelled' ? 'cancelled' : 'available',
        admin_blocked: slot?.adminBlocked ?? false,
        block_reason: slot?.blockReason ?? '',
        notes: slot?.notes ?? '',
    });

    const { data, setData, processing } = form;
    const errors = form.errors as Record<string, string>;

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (mode === 'create') {
            form.post('/admin/booking/slots', { preserveScroll: true });

            return;
        }

        form.put(`/admin/booking/slots/${slot?.id}`, { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
                <FormSection title="Franja">
                    <div className="flex flex-col gap-4">
                        <Field label="Día" error={errors.appointment_day_id}>
                            <select
                                value={data.appointment_day_id}
                                onChange={(e) => setData('appointment_day_id', e.target.value === '' ? '' : Number(e.target.value))}
                                className={selectClass}
                            >
                                <option value="">Selecciona un día</option>
                                {days.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Inicio" error={errors.starts_at}>
                            <Input type="datetime-local" value={data.starts_at} onChange={(e) => setData('starts_at', e.target.value)} />
                        </Field>
                        <Field label="Fin" error={errors.ends_at}>
                            <Input type="datetime-local" value={data.ends_at} onChange={(e) => setData('ends_at', e.target.value)} />
                        </Field>
                        <Field label="Duración (minutos)" error={errors.duration_minutes}>
                            <Input
                                type="number"
                                min={15}
                                value={data.duration_minutes}
                                onChange={(e) => setData('duration_minutes', Number(e.target.value))}
                            />
                        </Field>
                        <Field label="Capacidad" error={errors.capacity}>
                            <Input type="number" min={1} value={data.capacity} onChange={(e) => setData('capacity', Number(e.target.value))} />
                        </Field>
                        {slot && (
                            <p className="text-xs text-qd-text-medium dark:text-qd-white/40">
                                Reservas activas: {slot.reservedCount} / {slot.capacity}
                            </p>
                        )}
                        <Field label="Notas internas" error={errors.notes}>
                            <textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={3} className={textareaClass} />
                        </Field>
                    </div>
                </FormSection>
            </div>

            <div className="flex flex-col gap-6">
                <FormSection title="Estado" description="Reservada y expirada las gestiona el sistema automáticamente.">
                    <div className="flex flex-col gap-4">
                        <Field label="Estado" error={errors.status}>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)} className={selectClass}>
                                <option value="available">Disponible</option>
                                <option value="cancelled">Cancelada</option>
                            </select>
                        </Field>
                    </div>
                    <div className="mt-4 flex flex-col divide-y divide-qd-mist dark:divide-qd-white/10">
                        <ToggleRow label="Bloqueada" checked={data.admin_blocked} onChange={(v) => setData('admin_blocked', v)} />
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
                    <a href="/admin/booking/slots" className="text-sm font-semibold text-qd-text-medium hover:text-qd-text-high dark:text-qd-white/50">
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

import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type AdminBookingSlotRecord = {
    readonly id: number;
    readonly date: string;
    readonly startTime: string;
    readonly endTime: string;
    readonly status: string;
    readonly adminBlocked: boolean;
    readonly blockReason: string | null;
    readonly capacity: number;
    readonly reservedCount: number;
    readonly notes: string | null;
};

type BookingSlotFormData = {
    date: string;
    start_time: string;
    end_time: string;
    capacity: number;
    admin_blocked: boolean;
    block_reason: string;
    notes: string;
};

type BookingSlotFormProps = {
    readonly mode: 'create' | 'edit';
    readonly slot?: AdminBookingSlotRecord;
    readonly defaultDate?: string | null;
};

export default function BookingSlotForm({
    mode,
    slot,
    defaultDate,
}: BookingSlotFormProps) {
    const form = useForm<BookingSlotFormData>({
        date: slot?.date ?? defaultDate ?? '',
        start_time: slot?.startTime ?? '10:00',
        end_time: slot?.endTime ?? '11:00',
        capacity: slot?.capacity ?? 1,
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
        <form onSubmit={submit} className="grid max-w-2xl gap-6">
            <div className="rounded-2xl border border-qd-mist bg-qd-white p-6 dark:border-qd-white/10 dark:bg-qd-surface">
                <p className="mb-4 text-xs text-qd-text-medium dark:text-qd-white/40">
                    Lo habitual es generar disponibilidad desde la agenda. Usa
                    este formulario solo para una franja puntual; el día se crea
                    automáticamente.
                </p>
                <div className="flex flex-col gap-4">
                    <Field label="Fecha" error={errors.date}>
                        <Input
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Hora inicio" error={errors.start_time}>
                            <Input
                                type="time"
                                value={data.start_time}
                                onChange={(e) =>
                                    setData('start_time', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Hora fin" error={errors.end_time}>
                            <Input
                                type="time"
                                value={data.end_time}
                                onChange={(e) =>
                                    setData('end_time', e.target.value)
                                }
                            />
                        </Field>
                    </div>
                    <Field label="Capacidad" error={errors.capacity}>
                        <Input
                            type="number"
                            min={1}
                            max={100}
                            value={data.capacity}
                            onChange={(e) =>
                                setData('capacity', Number(e.target.value))
                            }
                        />
                    </Field>
                    {slot && (
                        <p className="text-xs text-qd-text-medium dark:text-qd-white/40">
                            Reservas activas: {slot.reservedCount} /{' '}
                            {slot.capacity}
                        </p>
                    )}
                    <div className="flex flex-col divide-y divide-qd-mist dark:divide-qd-white/10">
                        <ToggleRow
                            label="Bloqueada"
                            checked={data.admin_blocked}
                            onChange={(v) => setData('admin_blocked', v)}
                        />
                    </div>
                    {data.admin_blocked && (
                        <Field
                            label="Motivo del bloqueo (interno)"
                            error={errors.block_reason}
                        >
                            <Input
                                value={data.block_reason}
                                onChange={(e) =>
                                    setData('block_reason', e.target.value)
                                }
                            />
                        </Field>
                    )}
                    <Field label="Nota interna (opcional)" error={errors.notes}>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={3}
                            className={textareaClass}
                        />
                    </Field>
                </div>
            </div>

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
                    href="/admin/booking/slots"
                    className="text-sm font-semibold text-qd-text-medium hover:text-qd-text-high dark:text-qd-white/50"
                >
                    Cancelar
                </a>
            </div>
        </form>
    );
}

const textareaClass =
    'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

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

function ToggleRow({
    label,
    checked,
    onChange,
}: {
    readonly label: string;
    readonly checked: boolean;
    readonly onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <p className="text-sm font-medium text-qd-ink dark:text-qd-white">
                {label}
            </p>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={label}
                onClick={() => onChange(!checked)}
                className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition',
                    checked
                        ? 'bg-qd-teal-2 dark:bg-qd-teal'
                        : 'bg-qd-mist dark:bg-qd-white/15',
                )}
            >
                <span
                    className={cn(
                        'inline-block size-5 transform rounded-full bg-white shadow transition',
                        checked ? 'translate-x-5.5' : 'translate-x-0.5',
                    )}
                />
            </button>
        </div>
    );
}

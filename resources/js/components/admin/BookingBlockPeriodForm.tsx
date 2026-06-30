import { useForm } from '@inertiajs/react';
import { Ban, Loader2, LockOpen } from 'lucide-react';
import type { ReactNode, SyntheticEvent } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type BlockFormData = {
    action: 'block' | 'unblock';
    date_from: string;
    date_to: string;
    time_from: string;
    time_to: string;
    weekdays: number[];
    reason: string;
};

const WEEKDAYS = [
    { iso: 1, label: 'Lun' },
    { iso: 2, label: 'Mar' },
    { iso: 3, label: 'Mié' },
    { iso: 4, label: 'Jue' },
    { iso: 5, label: 'Vie' },
    { iso: 6, label: 'Sáb' },
    { iso: 7, label: 'Dom' },
] as const;

export default function BookingBlockPeriodForm() {
    const form = useForm<BlockFormData>({
        action: 'block',
        date_from: '',
        date_to: '',
        time_from: '',
        time_to: '',
        weekdays: [],
        reason: '',
    });

    const { data, setData, processing } = form;
    const errors = form.errors as Record<string, string>;

    const toggleWeekday = (iso: number) => {
        setData(
            'weekdays',
            data.weekdays.includes(iso)
                ? data.weekdays.filter((d) => d !== iso)
                : [...data.weekdays, iso].sort(),
        );
    };

    const submit = (action: 'block' | 'unblock') => (event: SyntheticEvent) => {
        event.preventDefault();
        form.transform((current) => ({ ...current, action }));
        form.post('/admin/booking/calendar/block', { preserveScroll: true });
    };

    return (
        <form onSubmit={submit('block')} className="flex flex-col gap-4">
            <p className="text-xs text-qd-text-medium dark:text-qd-white/40">
                Deja las horas en blanco para afectar el día/rango completo. Las
                franjas con reservas activas no se bloquean.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Desde" error={errors.date_from}>
                    <Input
                        type="date"
                        value={data.date_from}
                        onChange={(e) => setData('date_from', e.target.value)}
                    />
                </Field>
                <Field label="Hasta" error={errors.date_to}>
                    <Input
                        type="date"
                        value={data.date_to}
                        onChange={(e) => setData('date_to', e.target.value)}
                    />
                </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Hora desde (opcional)" error={errors.time_from}>
                    <Input
                        type="time"
                        value={data.time_from}
                        onChange={(e) => setData('time_from', e.target.value)}
                    />
                </Field>
                <Field label="Hora hasta (opcional)" error={errors.time_to}>
                    <Input
                        type="time"
                        value={data.time_to}
                        onChange={(e) => setData('time_to', e.target.value)}
                    />
                </Field>
            </div>

            <Field label="Solo estos días (opcional)" error={errors.weekdays}>
                <div className="flex flex-wrap gap-1.5">
                    {WEEKDAYS.map((day) => {
                        const active = data.weekdays.includes(day.iso);

                        return (
                            <button
                                key={day.iso}
                                type="button"
                                onClick={() => toggleWeekday(day.iso)}
                                aria-pressed={active}
                                className={cn(
                                    'rounded-lg border px-3 py-1.5 text-sm font-semibold transition',
                                    active
                                        ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                                        : 'border-qd-mist text-qd-text-medium hover:border-amber-400/50 dark:border-qd-white/10 dark:text-qd-white/50',
                                )}
                            >
                                {day.label}
                            </button>
                        );
                    })}
                </div>
            </Field>

            <Field label="Motivo interno (opcional)" error={errors.reason}>
                <Input
                    value={data.reason}
                    onChange={(e) => setData('reason', e.target.value)}
                    placeholder="Vacaciones, evento, etc."
                />
            </Field>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60"
                >
                    {processing ? (
                        <Loader2
                            aria-hidden="true"
                            size={16}
                            className="animate-spin"
                        />
                    ) : (
                        <Ban aria-hidden="true" size={16} />
                    )}
                    Bloquear periodo
                </button>
                <button
                    type="button"
                    onClick={submit('unblock')}
                    disabled={processing}
                    className="inline-flex items-center gap-2 rounded-lg border border-qd-mist px-5 py-2.5 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 disabled:opacity-60 dark:border-qd-white/10 dark:text-qd-white/70"
                >
                    <LockOpen aria-hidden="true" size={16} />
                    Desbloquear periodo
                </button>
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

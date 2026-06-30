import { useForm } from '@inertiajs/react';
import { CalendarPlus, Loader2 } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

import AdminSelect from '@/components/admin/AdminSelect';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type GenerateFormData = {
    date_from: string;
    date_to: string;
    weekdays: number[];
    start_time: string;
    end_time: string;
    duration_minutes: number;
    break_minutes: number;
    capacity: number;
};

type Props = {
    readonly defaults: {
        readonly durationMinutes: number;
        readonly capacity: number;
    };
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

export default function BookingBulkAvailabilityForm({ defaults }: Props) {
    const form = useForm<GenerateFormData>({
        date_from: '',
        date_to: '',
        weekdays: [1, 2, 3, 4, 5],
        start_time: '10:00',
        end_time: '14:00',
        duration_minutes: defaults.durationMinutes,
        break_minutes: 0,
        capacity: defaults.capacity,
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

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/admin/booking/calendar/generate', { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
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

            <Field label="Días de la semana" error={errors.weekdays}>
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
                                        ? 'border-qd-teal-2 bg-qd-teal-2/10 text-qd-teal-2 dark:border-qd-teal dark:bg-qd-teal/10 dark:text-qd-teal'
                                        : 'border-qd-mist text-qd-text-medium hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/50',
                                )}
                            >
                                {day.label}
                            </button>
                        );
                    })}
                </div>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Hora inicio" error={errors.start_time}>
                    <Input
                        type="time"
                        value={data.start_time}
                        onChange={(e) => setData('start_time', e.target.value)}
                    />
                </Field>
                <Field label="Hora fin" error={errors.end_time}>
                    <Input
                        type="time"
                        value={data.end_time}
                        onChange={(e) => setData('end_time', e.target.value)}
                    />
                </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Duración" error={errors.duration_minutes}>
                    <AdminSelect
                        value={data.duration_minutes}
                        onChange={(e) =>
                            setData('duration_minutes', Number(e.target.value))
                        }
                    >
                        {[30, 45, 60, 90, 120].map((m) => (
                            <option key={m} value={m}>
                                {m} min
                            </option>
                        ))}
                    </AdminSelect>
                </Field>
                <Field label="Descanso" error={errors.break_minutes}>
                    <AdminSelect
                        value={data.break_minutes}
                        onChange={(e) =>
                            setData('break_minutes', Number(e.target.value))
                        }
                    >
                        {[0, 15, 30].map((m) => (
                            <option key={m} value={m}>
                                {m} min
                            </option>
                        ))}
                    </AdminSelect>
                </Field>
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
            </div>

            <div>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60 dark:bg-qd-teal dark:text-qd-ink"
                >
                    {processing ? (
                        <Loader2
                            aria-hidden="true"
                            size={16}
                            className="animate-spin"
                        />
                    ) : (
                        <CalendarPlus aria-hidden="true" size={16} />
                    )}
                    Generar franjas
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

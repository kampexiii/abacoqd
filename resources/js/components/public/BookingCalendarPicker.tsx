import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { Locale } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

type CalendarDay = {
    readonly id: number;
    readonly date: string;
};

type Props = {
    readonly days: readonly CalendarDay[];
    readonly selectedDate: string | null;
    readonly onSelect: (date: string, dayId: number) => void;
    readonly locale: Locale;
};

function toYmd(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default function BookingCalendarPicker({ days, selectedDate, onSelect, locale }: Props) {
    const intlLocale = locale === 'es' ? 'es-ES' : 'en-GB';

    const availability = useMemo(() => {
        const map = new Map<string, number>();
        days.forEach((day) => map.set(day.date, day.id));

        return map;
    }, [days]);

    const initialMonth = useMemo(() => {
        const base = selectedDate ?? days[0]?.date ?? null;

        return base ? startOfMonth(new Date(`${base}T00:00:00`)) : startOfMonth(new Date());
    }, [days, selectedDate]);

    const [viewMonth, setViewMonth] = useState<Date>(initialMonth);

    const weekdayLabels = useMemo(() => {
        // Lunes a domingo, abreviados según idioma.
        const ref = new Date(2024, 0, 1); // 1 enero 2024 = lunes

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(ref);
            d.setDate(ref.getDate() + i);

            return new Intl.DateTimeFormat(intlLocale, { weekday: 'short' }).format(d);
        });
    }, [intlLocale]);

    const cells = useMemo(() => {
        const monthStart = startOfMonth(viewMonth);
        const firstWeekday = (monthStart.getDay() + 6) % 7; // lunes = 0
        const gridStart = new Date(monthStart);
        gridStart.setDate(1 - firstWeekday);

        const today = toYmd(new Date());

        return Array.from({ length: 42 }, (_, i) => {
            const date = new Date(gridStart);
            date.setDate(gridStart.getDate() + i);
            const ymd = toYmd(date);

            return {
                ymd,
                day: date.getDate(),
                inMonth: date.getMonth() === viewMonth.getMonth(),
                isToday: ymd === today,
                isPast: ymd < today,
                dayId: availability.get(ymd) ?? null,
            };
        });
    }, [viewMonth, availability]);

    const monthLabel = new Intl.DateTimeFormat(intlLocale, { month: 'long', year: 'numeric' }).format(viewMonth);

    const goMonth = (delta: number) => {
        setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };

    return (
        <div className="rounded-2xl border border-qd-mist bg-qd-white p-4 sm:p-5 dark:border-white/10 dark:bg-white/5">
            <div className="mb-3 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => goMonth(-1)}
                    aria-label="Mes anterior"
                    className="flex size-9 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2 dark:border-white/10 dark:text-qd-white/70"
                >
                    <ChevronLeft aria-hidden="true" size={16} />
                </button>
                <span className="text-sm font-semibold text-qd-ink capitalize dark:text-qd-white">{monthLabel}</span>
                <button
                    type="button"
                    onClick={() => goMonth(1)}
                    aria-label="Mes siguiente"
                    className="flex size-9 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2 dark:border-white/10 dark:text-qd-white/70"
                >
                    <ChevronRight aria-hidden="true" size={16} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {weekdayLabels.map((label) => (
                    <div key={label} className="py-1 text-[11px] font-semibold tracking-wide text-qd-text-medium uppercase dark:text-qd-white/40">
                        {label}
                    </div>
                ))}

                {cells.map((cell) => {
                    const available = cell.dayId !== null;
                    const selected = cell.ymd === selectedDate;

                    return (
                        <button
                            key={cell.ymd}
                            type="button"
                            disabled={!available}
                            onClick={() => available && cell.dayId !== null && onSelect(cell.ymd, cell.dayId)}
                            aria-pressed={selected}
                            aria-label={cell.ymd}
                            className={cn(
                                'relative flex aspect-square items-center justify-center rounded-lg text-sm transition',
                                !cell.inMonth && 'opacity-40',
                                selected && 'bg-qd-teal-2 font-bold text-white dark:bg-qd-teal dark:text-qd-ink',
                                !selected && available && 'bg-emerald-100 font-semibold text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25',
                                !available && 'cursor-default text-qd-text-medium dark:text-qd-white/30',
                                cell.isToday && !selected && 'ring-1 ring-qd-teal-2/50 dark:ring-qd-teal/40',
                            )}
                        >
                            {cell.day}
                            {available && !selected && (
                                <span className="absolute bottom-1 size-1 rounded-full bg-emerald-500 dark:bg-emerald-400" aria-hidden="true" />
                            )}
                        </button>
                    );
                })}
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-xs text-qd-text-medium dark:text-qd-white/40">
                <span className="inline-block size-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
                Días con citas disponibles
            </p>
        </div>
    );
}

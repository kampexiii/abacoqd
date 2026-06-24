import { router } from '@inertiajs/react';
import { Ban, LockOpen, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';

export type CalendarSlot = {
    readonly id: number;
    readonly time: string;
    readonly endTime: string;
    readonly durationMinutes: number;
    readonly capacity: number;
    readonly reservedCount: number;
    readonly adminBlocked: boolean;
    readonly blockReason: string | null;
    readonly activeBookingsCount: number;
    readonly isPast: boolean;
    readonly state: 'available' | 'reserved' | 'blocked' | 'past';
};

export type CalendarDay = {
    readonly date: string;
    readonly weekdayIso: number;
    readonly isToday: boolean;
    readonly isPast: boolean;
    readonly slots: readonly CalendarSlot[];
};

const WEEKDAY_LABELS: Record<number, string> = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo',
};

const STATE_STYLES: Record<CalendarSlot['state'], string> = {
    available: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
    reserved: 'border-qd-teal-2/40 bg-qd-teal-2/10 text-qd-teal-2 dark:border-qd-teal/30 dark:bg-qd-teal/10 dark:text-qd-teal',
    blocked: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
    past: 'border-qd-mist bg-qd-mist/40 text-qd-text-medium dark:border-qd-white/10 dark:bg-qd-white/5 dark:text-qd-white/40',
};

const STATE_LABELS: Record<CalendarSlot['state'], string> = {
    available: 'Disponible',
    reserved: 'Reservada',
    blocked: 'Bloqueada',
    past: 'Pasada',
};

function toggleBlocked(slot: CalendarSlot) {
    router.patch(`/admin/booking/slots/${slot.id}/toggle-blocked`, {}, { preserveScroll: true });
}

function deleteSlot(slot: CalendarSlot) {
    if (slot.activeBookingsCount > 0) {
        window.alert('No se puede eliminar: esta franja tiene una reserva activa.');

        return;
    }

    if (window.confirm('¿Eliminar esta franja?')) {
        router.delete(`/admin/booking/slots/${slot.id}`, { preserveScroll: true });
    }
}

export default function BookingWeeklyCalendar({ days }: { readonly days: readonly CalendarDay[] }) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {days.map((day) => (
                <div
                    key={day.date}
                    className={cn(
                        'flex flex-col rounded-xl border bg-qd-white p-2.5 dark:bg-qd-surface',
                        day.isToday ? 'border-qd-teal-2 dark:border-qd-teal' : 'border-qd-mist dark:border-qd-white/10',
                    )}
                >
                    <div className="mb-2 flex items-baseline justify-between px-1">
                        <span className="text-xs font-bold tracking-wide text-qd-text-medium uppercase dark:text-qd-white/50">
                            {WEEKDAY_LABELS[day.weekdayIso]}
                        </span>
                        <span className={cn('text-sm font-semibold', day.isToday ? 'text-qd-teal-2 dark:text-qd-teal' : 'text-qd-ink dark:text-qd-white')}>
                            {day.date.slice(8, 10)}/{day.date.slice(5, 7)}
                        </span>
                    </div>

                    {day.slots.length === 0 ? (
                        <p className="px-1 py-3 text-xs text-qd-text-medium dark:text-qd-white/30">Sin franjas</p>
                    ) : (
                        <ul className="flex flex-col gap-1.5">
                            {day.slots.map((slot) => (
                                <li key={slot.id} className={cn('group rounded-lg border px-2 py-1.5 text-xs', STATE_STYLES[slot.state])}>
                                    <div className="flex items-center justify-between gap-1">
                                        <span className="font-bold">
                                            {slot.time}–{slot.endTime}
                                        </span>
                                        <span className="text-[10px] font-semibold uppercase opacity-70">{STATE_LABELS[slot.state]}</span>
                                    </div>
                                    <div className="mt-0.5 flex items-center justify-between gap-1">
                                        <span className="opacity-70">
                                            {slot.reservedCount}/{slot.capacity}
                                        </span>
                                        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                                            <button
                                                type="button"
                                                onClick={() => toggleBlocked(slot)}
                                                aria-label={slot.adminBlocked ? 'Desbloquear' : 'Bloquear'}
                                                title={slot.adminBlocked ? 'Desbloquear' : 'Bloquear'}
                                                className="rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10"
                                            >
                                                {slot.adminBlocked ? <LockOpen aria-hidden="true" size={13} /> : <Ban aria-hidden="true" size={13} />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteSlot(slot)}
                                                aria-label="Eliminar franja"
                                                title="Eliminar franja"
                                                className="rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10"
                                            >
                                                <Trash2 aria-hidden="true" size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}

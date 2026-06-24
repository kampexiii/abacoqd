import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarRange, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { useState } from 'react';

import BookingBlockPeriodForm from '@/components/admin/BookingBlockPeriodForm';
import BookingBulkAvailabilityForm from '@/components/admin/BookingBulkAvailabilityForm';
import BookingSubNav from '@/components/admin/BookingSubNav';
import BookingWeeklyCalendar from '@/components/admin/BookingWeeklyCalendar';
import type { CalendarDay } from '@/components/admin/BookingWeeklyCalendar';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';

type IndexProps = {
    readonly view: 'week' | 'month';
    readonly days: readonly CalendarDay[];
    readonly range: { readonly start: string; readonly end: string };
    readonly nav: { readonly today: string; readonly prev: string; readonly next: string };
    readonly defaults: { readonly durationMinutes: number; readonly capacity: number };
};

type Panel = 'none' | 'generate' | 'block';

function go(view: 'week' | 'month', date: string) {
    router.get('/admin/booking/calendar', { view, date }, { preserveScroll: true, preserveState: true });
}

function rangeLabel(view: 'week' | 'month', start: string, end: string): string {
    const startDate = new Date(`${start}T00:00:00`);

    if (view === 'month') {
        return startDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }

    const endDate = new Date(`${end}T00:00:00`);
    const startLabel = startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const endLabel = endDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

    return `${startLabel} – ${endLabel}`;
}

export default function BookingCalendarIndex({ view, days, range, nav, defaults }: IndexProps) {
    const page = usePage();
    const [panel, setPanel] = useState<Panel>('none');

    return (
        <AdminLayout
            title="Agenda de reservas"
            breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Reserva' }, { title: 'Agenda' }]}
            actions={
                <Link
                    href="/admin/booking/bookings"
                    className="inline-flex items-center gap-2 rounded-lg border border-qd-mist px-4 py-2.5 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70"
                >
                    <Inbox aria-hidden="true" size={16} />
                    Ver reservas
                </Link>
            }
        >
            <Head title="Reserva · Agenda · Admin AbacoQD" />
            <BookingSubNav currentUrl={page.url} />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => go(view, nav.prev)}
                        aria-label="Anterior"
                        className="flex size-9 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70"
                    >
                        <ChevronLeft aria-hidden="true" size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => go(view, nav.today)}
                        className="rounded-lg border border-qd-mist px-3 py-2 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70"
                    >
                        Hoy
                    </button>
                    <button
                        type="button"
                        onClick={() => go(view, nav.next)}
                        aria-label="Siguiente"
                        className="flex size-9 items-center justify-center rounded-lg border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70"
                    >
                        <ChevronRight aria-hidden="true" size={16} />
                    </button>
                    <span className="ml-2 text-sm font-bold text-qd-ink dark:text-qd-white">{rangeLabel(view, range.start, range.end)}</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex rounded-lg border border-qd-mist p-0.5 dark:border-qd-white/10">
                        {(['week', 'month'] as const).map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => go(mode, range.start)}
                                className={cn(
                                    'rounded-md px-3 py-1.5 text-sm font-semibold transition',
                                    view === mode
                                        ? 'bg-qd-teal-2/10 text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal'
                                        : 'text-qd-text-medium hover:text-qd-text-high dark:text-qd-white/50',
                                )}
                            >
                                {mode === 'week' ? 'Semana' : 'Mes'}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => setPanel(panel === 'generate' ? 'none' : 'generate')}
                        className="rounded-lg bg-qd-teal-2 px-4 py-2 text-sm font-bold text-white transition hover:brightness-95 dark:bg-qd-teal dark:text-qd-ink"
                    >
                        Generar disponibilidad
                    </button>
                    <button
                        type="button"
                        onClick={() => setPanel(panel === 'block' ? 'none' : 'block')}
                        className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/10"
                    >
                        Bloquear periodo
                    </button>
                </div>
            </div>

            {panel !== 'none' && (
                <div className="mb-5 rounded-2xl border border-qd-mist bg-qd-white p-5 dark:border-qd-white/10 dark:bg-qd-surface">
                    <h2 className="mb-4 text-sm font-bold text-qd-ink dark:text-qd-white">
                        {panel === 'generate' ? 'Generar disponibilidad en masa' : 'Bloquear / desbloquear periodo'}
                    </h2>
                    {panel === 'generate' ? <BookingBulkAvailabilityForm defaults={defaults} /> : <BookingBlockPeriodForm />}
                </div>
            )}

            <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-qd-text-medium dark:text-qd-white/50">
                <Legend className="bg-emerald-400" label="Disponible" />
                <Legend className="bg-qd-teal-2" label="Reservada" />
                <Legend className="bg-amber-400" label="Bloqueada" />
                <Legend className="bg-qd-mist dark:bg-qd-white/20" label="Pasada" />
                <span className="inline-flex items-center gap-1">
                    <CalendarRange aria-hidden="true" size={13} /> En público solo se muestran las disponibles.
                </span>
            </div>

            <BookingWeeklyCalendar days={days} />
        </AdminLayout>
    );
}

function Legend({ className, label }: { readonly className: string; readonly label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5">
            <span className={cn('inline-block size-3 rounded-sm', className)} />
            {label}
        </span>
    );
}

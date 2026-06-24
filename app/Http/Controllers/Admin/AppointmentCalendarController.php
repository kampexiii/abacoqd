<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AppointmentSlotStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BlockPeriodRequest;
use App\Http\Requests\Admin\GenerateAvailabilityRequest;
use App\Models\AppointmentDay;
use App\Models\AppointmentSlot;
use App\Models\BookingSetting;
use Carbon\CarbonImmutable;
use Carbon\CarbonPeriod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Agenda de reservas: experiencia principal del módulo. Muestra una semana
 * (o mes) con sus franjas y permite generar disponibilidad en masa y bloquear
 * periodos sin crear día a día ni franja a franja. Nunca pisa reservas: la
 * generación omite franjas existentes y el bloqueo respeta las reservadas.
 */
class AppointmentCalendarController extends Controller
{
    public function index(Request $request): Response
    {
        $view = $request->string('view')->toString() === 'month' ? 'month' : 'week';
        $anchor = $this->parseAnchor($request->string('date')->toString());

        [$rangeStart, $rangeEnd] = $view === 'month'
            ? [$anchor->startOfMonth()->startOfWeek(CarbonImmutable::MONDAY), $anchor->endOfMonth()->endOfWeek(CarbonImmutable::SUNDAY)]
            : [$anchor->startOfWeek(CarbonImmutable::MONDAY), $anchor->endOfWeek(CarbonImmutable::SUNDAY)];

        $slots = AppointmentSlot::query()
            ->with('day')
            ->withCount(['bookings' => fn ($query) => $query->active()])
            ->whereBetween('starts_at', [$rangeStart->startOfDay(), $rangeEnd->endOfDay()])
            ->ordered()
            ->get();

        $days = $this->buildDays($rangeStart, $rangeEnd, $slots);

        return Inertia::render('Admin/Booking/Calendar/Index', [
            'view' => $view,
            'days' => $days,
            'range' => [
                'start' => $rangeStart->toDateString(),
                'end' => $rangeEnd->toDateString(),
            ],
            'nav' => [
                'today' => CarbonImmutable::now()->toDateString(),
                'prev' => ($view === 'month' ? $anchor->subMonth() : $anchor->subWeek())->toDateString(),
                'next' => ($view === 'month' ? $anchor->addMonth() : $anchor->addWeek())->toDateString(),
            ],
            'defaults' => $this->generationDefaults(),
        ]);
    }

    public function generate(GenerateAvailabilityRequest $request): RedirectResponse
    {
        $dateFrom = CarbonImmutable::parse($request->validated('date_from'))->startOfDay();
        $dateTo = CarbonImmutable::parse($request->validated('date_to'))->startOfDay();
        /** @var list<int> $weekdays */
        $weekdays = array_map('intval', $request->validated('weekdays'));
        $duration = (int) $request->validated('duration_minutes');
        $break = (int) $request->validated('break_minutes');
        $capacity = (int) $request->validated('capacity');
        $startTime = $request->validated('start_time');
        $endTime = $request->validated('end_time');

        $created = 0;
        $skipped = 0;

        foreach (CarbonPeriod::create($dateFrom, $dateTo) as $date) {
            $date = CarbonImmutable::parse($date);

            if (! in_array($date->dayOfWeekIso, $weekdays, true)) {
                continue;
            }

            $day = $this->resolveDay($date->toDateString());

            $cursor = $date->setTimeFromTimeString($startTime);
            $dayEnd = $date->setTimeFromTimeString($endTime);

            while ($cursor->addMinutes($duration)->lessThanOrEqualTo($dayEnd)) {
                $startsAt = $cursor;
                $endsAt = $cursor->addMinutes($duration);

                if ($startsAt->isPast()) {
                    $skipped++;
                    $cursor = $endsAt->addMinutes($break);

                    continue;
                }

                $exists = AppointmentSlot::query()
                    ->where('appointment_day_id', $day->id)
                    ->where('starts_at', $startsAt->toDateTimeString())
                    ->exists();

                if ($exists) {
                    $skipped++;
                } else {
                    AppointmentSlot::create([
                        'appointment_day_id' => $day->id,
                        'starts_at' => $startsAt->toDateTimeString(),
                        'ends_at' => $endsAt->toDateTimeString(),
                        'duration_minutes' => $duration,
                        'status' => AppointmentSlotStatus::Available->value,
                        'capacity' => $capacity,
                        'reserved_count' => 0,
                    ]);
                    $created++;
                }

                $cursor = $endsAt->addMinutes($break);
            }
        }

        return back()->with('toast', [
            'type' => 'success',
            'message' => "Generadas {$created} franjas. Omitidas {$skipped} (existentes o pasadas).",
        ]);
    }

    public function block(BlockPeriodRequest $request): RedirectResponse
    {
        $block = $request->validated('action') === 'block';
        $dateFrom = CarbonImmutable::parse($request->validated('date_from'))->startOfDay();
        $dateTo = CarbonImmutable::parse($request->validated('date_to'))->endOfDay();
        $timeFrom = $request->validated('time_from');
        $timeTo = $request->validated('time_to');
        /** @var list<int>|null $weekdays */
        $weekdays = $request->validated('weekdays');
        $reason = $request->validated('reason');

        $query = AppointmentSlot::query()
            ->with('day')
            ->whereBetween('starts_at', [$dateFrom->toDateTimeString(), $dateTo->toDateTimeString()]);

        $slots = $query->get()->filter(function (AppointmentSlot $slot) use ($timeFrom, $timeTo, $weekdays): bool {
            $startsAt = CarbonImmutable::parse($slot->starts_at);

            if (is_array($weekdays) && $weekdays !== [] && ! in_array($startsAt->dayOfWeekIso, array_map('intval', $weekdays), true)) {
                return false;
            }

            if ($timeFrom !== null && $startsAt->format('H:i') < $timeFrom) {
                return false;
            }

            if ($timeTo !== null && $startsAt->format('H:i') >= $timeTo) {
                return false;
            }

            return true;
        });

        $affected = 0;
        $skipped = 0;

        foreach ($slots as $slot) {
            if ($block && $slot->bookings()->active()->exists()) {
                $skipped++;

                continue;
            }

            $slot->update([
                'admin_blocked' => $block,
                'block_reason' => $block ? $reason : null,
            ]);
            $affected++;
        }

        $verb = $block ? 'bloqueadas' : 'desbloqueadas';
        $note = $block && $skipped > 0 ? " Omitidas {$skipped} con reservas activas." : '';

        return back()->with('toast', [
            'type' => 'success',
            'message' => "{$affected} franjas {$verb}.{$note}",
        ]);
    }

    /**
     * @param  Collection<int, AppointmentSlot>  $slots
     * @return list<array<string, mixed>>
     */
    private function buildDays(CarbonImmutable $rangeStart, CarbonImmutable $rangeEnd, Collection $slots): array
    {
        $byDate = $slots->groupBy(fn (AppointmentSlot $slot): string => CarbonImmutable::parse($slot->starts_at)->toDateString());

        $days = [];

        foreach (CarbonPeriod::create($rangeStart, $rangeEnd) as $date) {
            $date = CarbonImmutable::parse($date);
            $key = $date->toDateString();
            /** @var Collection<int, AppointmentSlot> $daySlots */
            $daySlots = $byDate->get($key, collect());

            $days[] = [
                'date' => $key,
                'weekdayIso' => $date->dayOfWeekIso,
                'isToday' => $date->isToday(),
                'isPast' => $date->endOfDay()->isPast(),
                'slots' => $daySlots
                    ->map(fn (AppointmentSlot $slot): array => $this->slotSummary($slot))
                    ->values()
                    ->all(),
            ];
        }

        return $days;
    }

    /**
     * @return array<string, mixed>
     */
    private function slotSummary(AppointmentSlot $slot): array
    {
        $startsAt = CarbonImmutable::parse($slot->starts_at);

        return [
            'id' => $slot->id,
            'startsAt' => $startsAt->toIso8601String(),
            'endsAt' => CarbonImmutable::parse($slot->ends_at)->toIso8601String(),
            'time' => $startsAt->format('H:i'),
            'endTime' => CarbonImmutable::parse($slot->ends_at)->format('H:i'),
            'durationMinutes' => $slot->duration_minutes,
            'capacity' => $slot->capacity,
            'reservedCount' => $slot->reserved_count,
            'adminBlocked' => $slot->admin_blocked,
            'blockReason' => $slot->block_reason,
            'activeBookingsCount' => $slot->bookings_count ?? 0,
            'isPast' => $startsAt->isPast(),
            'state' => $this->slotState($slot),
        ];
    }

    private function slotState(AppointmentSlot $slot): string
    {
        if ($slot->admin_blocked) {
            return 'blocked';
        }

        if (($slot->bookings_count ?? 0) > 0 || $slot->reserved_count > 0) {
            return 'reserved';
        }

        if (CarbonImmutable::parse($slot->starts_at)->isPast()) {
            return 'past';
        }

        return 'available';
    }

    private function parseAnchor(string $value): CarbonImmutable
    {
        try {
            return $value !== '' ? CarbonImmutable::parse($value) : CarbonImmutable::now();
        } catch (\Throwable) {
            return CarbonImmutable::now();
        }
    }

    /**
     * Resuelve (o crea) el día por fecha. Usa whereDate para tolerar datos
     * históricos donde la columna `date` se guardó con hora (00:00:00) y evitar
     * violar la restricción única al regenerar disponibilidad.
     */
    private function resolveDay(string $date): AppointmentDay
    {
        $day = AppointmentDay::query()->whereDate('date', $date)->first();

        return $day ?? AppointmentDay::create(['date' => $date]);
    }

    /**
     * @return array<string, int>
     */
    private function generationDefaults(): array
    {
        $setting = BookingSetting::query()->first();
        $settings = $setting !== null && is_array($setting->settings) ? $setting->settings : [];

        return [
            'durationMinutes' => (int) ($settings['default_duration_minutes'] ?? 60),
            'capacity' => (int) ($settings['default_capacity'] ?? 1),
        ];
    }
}

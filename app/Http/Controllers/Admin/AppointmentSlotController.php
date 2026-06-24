<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AppointmentSlotStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AppointmentSlotRequest;
use App\Models\AppointmentDay;
use App\Models\AppointmentSlot;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Gestión admin de franjas de reserva (Fase 4). No se permite borrar una
 * franja con reservas activas: hay que cancelarlas o bloquearla primero.
 */
class AppointmentSlotController extends Controller
{
    public function index(Request $request): Response
    {
        $dayId = $request->integer('day') ?: null;

        $slots = AppointmentSlot::query()
            ->with('day')
            ->withCount(['bookings' => fn ($query) => $query->active()])
            ->when($dayId, fn ($query) => $query->where('appointment_day_id', $dayId))
            ->ordered()
            ->get()
            ->map(fn (AppointmentSlot $slot): array => $this->adminSummary($slot))
            ->values();

        return Inertia::render('Admin/Booking/Slots/Index', [
            'slots' => $slots,
            'days' => $this->dayOptions(),
            'filterDayId' => $dayId,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Admin/Booking/Slots/Create', [
            'defaultDate' => $request->string('date')->toString() ?: null,
        ]);
    }

    public function store(AppointmentSlotRequest $request): RedirectResponse
    {
        $attributes = $this->contentAttributes($request);
        $attributes['status'] = AppointmentSlotStatus::Available->value;
        $attributes['reserved_count'] = 0;

        AppointmentSlot::create($attributes);

        return to_route('admin.booking.slots.index')
            ->with('toast', ['type' => 'success', 'message' => 'Franja creada.']);
    }

    public function edit(AppointmentSlot $slot): Response
    {
        return Inertia::render('Admin/Booking/Slots/Edit', [
            'slot' => $this->adminRecord($slot),
        ]);
    }

    public function update(AppointmentSlotRequest $request, AppointmentSlot $slot): RedirectResponse
    {
        // Conserva el estado del sistema (reservada/expirada): aquí solo se
        // editan fecha/horas/capacidad/bloqueo, nunca el contador de reservas.
        $slot->update($this->contentAttributes($request));

        return to_route('admin.booking.slots.index')
            ->with('toast', ['type' => 'success', 'message' => 'Franja actualizada.']);
    }

    public function destroy(AppointmentSlot $slot): RedirectResponse
    {
        if ($slot->bookings()->active()->exists()) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'No se puede eliminar: esta franja tiene reservas activas. Cancélalas primero.',
            ]);
        }

        $slot->delete();

        return to_route('admin.booking.slots.index')
            ->with('toast', ['type' => 'success', 'message' => 'Franja eliminada.']);
    }

    public function toggleBlocked(AppointmentSlot $slot): RedirectResponse
    {
        $slot->update([
            'admin_blocked' => ! $slot->admin_blocked,
            'block_reason' => $slot->admin_blocked ? null : $slot->block_reason,
        ]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function contentAttributes(AppointmentSlotRequest $request): array
    {
        $date = CarbonImmutable::parse($request->validated('date'));
        $startsAt = $date->setTimeFromTimeString($request->validated('start_time'));
        $endsAt = $date->setTimeFromTimeString($request->validated('end_time'));

        $day = AppointmentDay::query()->whereDate('date', $date->toDateString())->first()
            ?? AppointmentDay::create(['date' => $date->toDateString()]);

        return [
            'appointment_day_id' => $day->id,
            'starts_at' => $startsAt->toDateTimeString(),
            'ends_at' => $endsAt->toDateTimeString(),
            'duration_minutes' => $startsAt->diffInMinutes($endsAt),
            'capacity' => (int) $request->validated('capacity'),
            'admin_blocked' => $request->boolean('admin_blocked'),
            'block_reason' => $request->boolean('admin_blocked') ? $request->validated('block_reason') : null,
            'notes' => $request->validated('notes'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminSummary(AppointmentSlot $slot): array
    {
        return [
            'id' => $slot->id,
            'dayId' => $slot->appointment_day_id,
            'dayDate' => $slot->day?->date->toDateString(),
            'startsAt' => $slot->starts_at->toIso8601String(),
            'endsAt' => $slot->ends_at->toIso8601String(),
            'durationMinutes' => $slot->duration_minutes,
            'status' => $slot->status->value,
            'adminBlocked' => $slot->admin_blocked,
            'blockReason' => $slot->block_reason,
            'capacity' => $slot->capacity,
            'reservedCount' => $slot->reserved_count,
            'activeBookingsCount' => $slot->bookings_count ?? null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminRecord(AppointmentSlot $slot): array
    {
        return [
            ...$this->adminSummary($slot),
            'date' => $slot->starts_at->toDateString(),
            'startTime' => $slot->starts_at->format('H:i'),
            'endTime' => $slot->ends_at->format('H:i'),
            'notes' => $slot->notes,
        ];
    }

    /**
     * @return array<int, array{value: int, label: string}>
     */
    private function dayOptions(): array
    {
        return AppointmentDay::query()->ordered()->get(['id', 'date'])
            ->map(fn (AppointmentDay $day): array => ['value' => $day->id, 'label' => $day->date->toDateString()])
            ->values()->all();
    }
}

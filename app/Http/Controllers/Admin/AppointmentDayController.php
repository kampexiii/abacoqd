<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAppointmentDayRequest;
use App\Http\Requests\Admin\UpdateAppointmentDayRequest;
use App\Models\AppointmentBooking;
use App\Models\AppointmentDay;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Gestión admin de días de reserva (Fase 4). No se permite borrar un día que
 * ya tenga reservas activas: primero hay que cancelarlas o bloquear el día.
 */
class AppointmentDayController extends Controller
{
    public function index(): Response
    {
        $days = AppointmentDay::query()
            ->withCount('slots')
            ->ordered()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (AppointmentDay $day): array => $this->adminSummary($day));

        return Inertia::render('Admin/Booking/Days/Index', [
            'days' => $days,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Booking/Days/Create');
    }

    public function store(StoreAppointmentDayRequest $request): RedirectResponse
    {
        AppointmentDay::create($this->contentAttributes($request));

        return to_route('admin.booking.days.index')
            ->with('toast', ['type' => 'success', 'message' => 'Día creado.']);
    }

    public function edit(AppointmentDay $day): Response
    {
        return Inertia::render('Admin/Booking/Days/Edit', [
            'day' => $this->adminRecord($day),
        ]);
    }

    public function update(UpdateAppointmentDayRequest $request, AppointmentDay $day): RedirectResponse
    {
        $day->update($this->contentAttributes($request));

        return to_route('admin.booking.days.index')
            ->with('toast', ['type' => 'success', 'message' => 'Día actualizado.']);
    }

    public function destroy(AppointmentDay $day): RedirectResponse
    {
        $hasActiveBookings = $day->slots()
            ->whereHas('bookings', function (Builder $query): void {
                /** @var Builder<AppointmentBooking> $query */
                $query->active();
            })
            ->exists();

        if ($hasActiveBookings) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'No se puede eliminar: este día tiene reservas activas. Bloquéalo o cancela las reservas primero.',
            ]);
        }

        $day->delete();

        return to_route('admin.booking.days.index')
            ->with('toast', ['type' => 'success', 'message' => 'Día eliminado.']);
    }

    public function toggleAvailable(AppointmentDay $day): RedirectResponse
    {
        $day->update(['is_available' => ! $day->is_available]);

        return back();
    }

    public function toggleBlocked(AppointmentDay $day): RedirectResponse
    {
        $day->update([
            'admin_blocked' => ! $day->admin_blocked,
            'block_reason' => $day->admin_blocked ? null : $day->block_reason,
        ]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function contentAttributes(StoreAppointmentDayRequest|UpdateAppointmentDayRequest $request): array
    {
        return [
            'date' => $request->validated('date'),
            'title' => $request->validated('title'),
            'notes' => $request->validated('notes'),
            'is_available' => $request->boolean('is_available'),
            'max_bookings' => $request->validated('max_bookings'),
            'admin_blocked' => $request->boolean('admin_blocked'),
            'block_reason' => $request->boolean('admin_blocked') ? $request->validated('block_reason') : null,
            'sort_order' => (int) $request->validated('sort_order'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminSummary(AppointmentDay $day): array
    {
        return [
            'id' => $day->id,
            'date' => $day->date->toDateString(),
            'title' => $day->title,
            'isAvailable' => $day->is_available,
            'adminBlocked' => $day->admin_blocked,
            'blockReason' => $day->block_reason,
            'slotsCount' => $day->slots_count,
            'sortOrder' => $day->sort_order,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminRecord(AppointmentDay $day): array
    {
        return [
            ...$this->adminSummary($day),
            'notes' => $day->notes,
            'maxBookings' => $day->max_bookings,
        ];
    }
}

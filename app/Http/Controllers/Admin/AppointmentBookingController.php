<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AppointmentBookingStatus;
use App\Enums\AppointmentSlotStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAppointmentBookingRequest;
use App\Models\AppointmentBooking;
use App\Models\AppointmentSlot;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Gestión admin de reservas (Fase 4). Los cambios de estado mantienen
 * sincronizado `reserved_count`/`status` de la franja bajo bloqueo
 * transaccional, igual que hace el flujo público al reservar.
 */
class AppointmentBookingController extends Controller
{
    private const ACTIVE_STATUSES = [
        AppointmentBookingStatus::Pending,
        AppointmentBookingStatus::Confirmed,
        AppointmentBookingStatus::Completed,
    ];

    public function index(): Response
    {
        $bookings = AppointmentBooking::query()
            ->with(['slot.day', 'service'])
            ->latest()
            ->get()
            ->map(fn (AppointmentBooking $booking): array => $this->adminSummary($booking))
            ->values();

        return Inertia::render('Admin/Booking/Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    public function show(AppointmentBooking $booking): Response
    {
        $booking->load(['slot.day', 'service']);

        return Inertia::render('Admin/Booking/Bookings/Show', [
            'booking' => $this->adminRecord($booking),
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function update(UpdateAppointmentBookingRequest $request, AppointmentBooking $booking): RedirectResponse
    {
        $newStatus = AppointmentBookingStatus::from($request->validated('status'));

        DB::transaction(function () use ($booking, $newStatus, $request): void {
            $wasActive = in_array($booking->status, self::ACTIVE_STATUSES, true);
            $isActive = in_array($newStatus, self::ACTIVE_STATUSES, true);

            $booking->update([
                'status' => $newStatus->value,
                'admin_notes' => $request->validated('admin_notes'),
                'cancelled_at' => $newStatus === AppointmentBookingStatus::Cancelled ? ($booking->cancelled_at ?? now()) : null,
            ]);

            if ($wasActive !== $isActive) {
                $this->syncSlotCounters($booking->appointment_slot_id, $isActive ? 1 : -1);
            }
        });

        return to_route('admin.booking.bookings.show', $booking)
            ->with('toast', ['type' => 'success', 'message' => 'Reserva actualizada.']);
    }

    private function syncSlotCounters(int $slotId, int $delta): void
    {
        $slot = AppointmentSlot::query()->whereKey($slotId)->lockForUpdate()->first();

        if (! $slot) {
            return;
        }

        $reservedCount = max(0, $slot->reserved_count + $delta);
        $status = $slot->status;

        if ($reservedCount < $slot->capacity && $status === AppointmentSlotStatus::Reserved) {
            $status = AppointmentSlotStatus::Available;
        }

        if ($reservedCount >= $slot->capacity && $status === AppointmentSlotStatus::Available) {
            $status = AppointmentSlotStatus::Reserved;
        }

        $slot->update(['reserved_count' => $reservedCount, 'status' => $status->value]);
    }

    /**
     * @return array<string, mixed>
     */
    private function adminSummary(AppointmentBooking $booking): array
    {
        return [
            'id' => $booking->id,
            'name' => $booking->name,
            'email' => $booking->email,
            'company' => $booking->company,
            'status' => $booking->status->value,
            'serviceName' => is_array($booking->service?->title) ? ($booking->service->title['es'] ?? null) : null,
            'dayDate' => $booking->slot?->day?->date->toDateString(),
            'startsAt' => $booking->slot?->starts_at->toIso8601String(),
            'createdAt' => $booking->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminRecord(AppointmentBooking $booking): array
    {
        return [
            ...$this->adminSummary($booking),
            'phone' => $booking->phone,
            'message' => $booking->message,
            'adminNotes' => $booking->admin_notes,
            'endsAt' => $booking->slot?->ends_at->toIso8601String(),
            'cancelledAt' => $booking->cancelled_at?->toIso8601String(),
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function statusOptions(): array
    {
        return [
            ['value' => AppointmentBookingStatus::Pending->value, 'label' => 'Pendiente'],
            ['value' => AppointmentBookingStatus::Confirmed->value, 'label' => 'Confirmada'],
            ['value' => AppointmentBookingStatus::Completed->value, 'label' => 'Completada'],
            ['value' => AppointmentBookingStatus::Cancelled->value, 'label' => 'Cancelada'],
            ['value' => AppointmentBookingStatus::NoShow->value, 'label' => 'No se presentó'],
        ];
    }
}

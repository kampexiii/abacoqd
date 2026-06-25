<?php

namespace App\Http\Controllers\Public;

use App\Enums\AppointmentBookingStatus;
use App\Enums\AppointmentSlotStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreAppointmentBookingRequest;
use App\Mail\AppointmentBookingReceived;
use App\Models\AppointmentBooking;
use App\Models\AppointmentDay;
use App\Models\AppointmentSlot;
use App\Models\BookingSetting;
use App\Models\Service;
use App\Support\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Show the booking flow: available days/slots, or an honest empty state.
     * docs/07_VISTAS/PUBLIC_06_CONTACTO_RESERVA.md (sección B).
     */
    public function create(Request $request): Response
    {
        $setting = BookingSetting::query()->first();
        $settings = $setting !== null && is_array($setting->settings) ? $setting->settings : [];
        $minAdvanceHours = (int) ($settings['min_advance_hours'] ?? 0);
        $maxAdvanceDays = isset($settings['max_advance_days']) ? (int) $settings['max_advance_days'] : null;

        $days = AppointmentDay::query()
            ->available()
            ->ordered()
            ->with(['slots' => function ($query) use ($minAdvanceHours, $maxAdvanceDays): void {
                $query->available()->ordered();

                if ($minAdvanceHours > 0) {
                    $query->where('starts_at', '>=', now()->addHours($minAdvanceHours));
                }

                if ($maxAdvanceDays !== null) {
                    $query->where('starts_at', '<=', now()->addDays($maxAdvanceDays)->endOfDay());
                }
            }])
            ->get()
            ->filter(fn (AppointmentDay $day): bool => $day->slots->isNotEmpty())
            ->map(fn (AppointmentDay $day): array => [
                'id' => $day->id,
                'date' => $day->date->toDateString(),
                'title' => $day->title,
                'slots' => $day->slots->map(fn (AppointmentSlot $slot): array => [
                    'id' => $slot->id,
                    'startsAt' => $slot->starts_at->toIso8601String(),
                    'endsAt' => $slot->ends_at->toIso8601String(),
                    // Hora de pared del negocio (no se convierte a la zona del
                    // visitante): el admin define 10:00 y se muestra 10:00.
                    'time' => $slot->starts_at->format('H:i'),
                    'endTime' => $slot->ends_at->format('H:i'),
                    'durationMinutes' => $slot->duration_minutes,
                ])->values(),
            ])
            ->values();

        return Inertia::render('Public/Booking', [
            'days' => $days,
            'services' => Service::query()->published()->active()->ordered()->get(['id', 'title']),
            'confirmedBooking' => $this->resolveConfirmedBooking($request),
        ]);
    }

    /**
     * Reserve a slot inside a transaction with row locking to prevent double booking.
     */
    public function store(StoreAppointmentBookingRequest $request): RedirectResponse
    {
        $booking = DB::transaction(function () use ($request): AppointmentBooking {
            $slot = AppointmentSlot::query()
                ->whereKey($request->validated('appointment_slot_id'))
                ->lockForUpdate()
                ->first();

            if (! $slot || ! $slot->isBookable()) {
                throw ValidationException::withMessages([
                    'appointment_slot_id' => 'Esta franja ya no está disponible. Elige otra hora.',
                ]);
            }

            $booking = AppointmentBooking::create([
                'appointment_slot_id' => $slot->id,
                'service_id' => $request->validated('service_id'),
                'name' => $request->validated('name'),
                'company' => $request->validated('company'),
                'email' => $request->validated('email'),
                'phone' => $request->validated('phone'),
                'message' => $request->validated('message'),
                'status' => AppointmentBookingStatus::Confirmed->value,
                'privacy_consent_accepted_at' => now(),
                'marketing_consent_accepted_at' => $request->boolean('marketing_consent') ? now() : null,
                'ip_address' => $request->ip(),
                'user_agent' => (string) $request->userAgent(),
            ]);

            $slot->increment('reserved_count');

            if ($slot->reserved_count >= $slot->capacity) {
                $slot->update(['status' => AppointmentSlotStatus::Reserved->value]);
            }

            return $booking;
        });

        // La reserva ya está confirmada y persistida (la transacción solo llega
        // aquí si el slot estaba disponible): si la notificación por email falla
        // (SMTP caído o mal configurado) se registra y se sigue, en vez de romper
        // la confirmación al visitante por algo que no afecta a la reserva.
        try {
            Mail::to(SiteSettings::bookingRecipient())
                ->send(new AppointmentBookingReceived($booking));
        } catch (\Throwable $e) {
            Log::error('No se pudo enviar la notificación de reserva.', [
                'appointment_booking_id' => $booking->id,
                'exception' => $e->getMessage(),
            ]);
        }

        return to_route('booking.show')->with('confirmedBookingId', $booking->id);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function resolveConfirmedBooking(Request $request): ?array
    {
        $confirmedBookingId = $request->session()->get('confirmedBookingId');

        if (! $confirmedBookingId) {
            return null;
        }

        $booking = AppointmentBooking::with('slot.day')
            ->where('id', $confirmedBookingId)
            ->first();

        if (! $booking || ! $booking->slot) {
            return null;
        }

        return [
            'name' => $booking->name,
            'email' => $booking->email,
            'date' => $booking->slot->day->date->toDateString(),
            'startsAt' => $booking->slot->starts_at->toIso8601String(),
            'endsAt' => $booking->slot->ends_at->toIso8601String(),
            'time' => $booking->slot->starts_at->format('H:i'),
            'endTime' => $booking->slot->ends_at->format('H:i'),
            'durationMinutes' => $booking->slot->duration_minutes,
        ];
    }
}

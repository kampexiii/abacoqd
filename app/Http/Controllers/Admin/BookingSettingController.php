<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BookingSettingRequest;
use App\Models\BookingSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Configuración admin de `booking_settings` (Fase 4). Es un registro único
 * (proveedor externo opcional); no se expone el JSON `settings` libre para
 * no romper las claves documentadas que ya gestiona el seeder.
 */
class BookingSettingController extends Controller
{
    public function edit(): Response
    {
        $setting = BookingSetting::query()->first();

        return Inertia::render('Admin/Booking/Settings/Edit', [
            'setting' => $setting ? $this->adminRecord($setting) : null,
        ]);
    }

    public function update(BookingSettingRequest $request): RedirectResponse
    {
        $setting = BookingSetting::query()->firstOrNew();

        // Preserva las claves documentadas del JSON (proveedor recomendado,
        // estado) y solo añade/actualiza los defaults operativos de la agenda.
        $settings = is_array($setting->settings) ? $setting->settings : [];
        $maxAdvance = $request->validated('max_advance_days');

        $settings = array_merge($settings, [
            'default_duration_minutes' => (int) $request->validated('default_duration_minutes'),
            'default_capacity' => (int) $request->validated('default_capacity'),
            'min_advance_hours' => (int) $request->validated('min_advance_hours'),
            'max_advance_days' => $maxAdvance !== null ? (int) $maxAdvance : null,
            'notify_email' => $request->validated('notify_email'),
        ]);

        $setting->fill([
            'provider' => $request->validated('provider'),
            'url' => $request->validated('url'),
            'is_enabled' => $request->boolean('is_enabled'),
            'fallback_to_contact' => $request->boolean('fallback_to_contact'),
            'settings' => $settings,
        ])->save();

        return to_route('admin.booking.settings.edit')
            ->with('toast', ['type' => 'success', 'message' => 'Configuración de reserva actualizada.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function adminRecord(BookingSetting $setting): array
    {
        $settings = is_array($setting->settings) ? $setting->settings : [];

        return [
            'provider' => $setting->provider,
            'url' => $setting->url,
            'isEnabled' => $setting->is_enabled,
            'fallbackToContact' => $setting->fallback_to_contact,
            'defaultDurationMinutes' => (int) ($settings['default_duration_minutes'] ?? 60),
            'defaultCapacity' => (int) ($settings['default_capacity'] ?? 1),
            'minAdvanceHours' => (int) ($settings['min_advance_hours'] ?? 0),
            'maxAdvanceDays' => isset($settings['max_advance_days']) ? (int) $settings['max_advance_days'] : null,
            'notifyEmail' => $settings['notify_email'] ?? null,
        ];
    }
}

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

        $setting->fill([
            'provider' => $request->validated('provider'),
            'url' => $request->validated('url'),
            'is_enabled' => $request->boolean('is_enabled'),
            'fallback_to_contact' => $request->boolean('fallback_to_contact'),
        ])->save();

        return to_route('admin.booking.settings.edit')
            ->with('toast', ['type' => 'success', 'message' => 'Configuración de reserva actualizada.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function adminRecord(BookingSetting $setting): array
    {
        return [
            'provider' => $setting->provider,
            'url' => $setting->url,
            'isEnabled' => $setting->is_enabled,
            'fallbackToContact' => $setting->fallback_to_contact,
        ];
    }
}

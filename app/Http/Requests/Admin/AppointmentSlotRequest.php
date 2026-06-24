<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Creación/edición manual de una franja concreta. Flujo secundario: lo normal
 * es generar disponibilidad en masa desde el calendario. Solo pide fecha,
 * horas, capacidad, bloqueo y nota; el día se resuelve/crea automáticamente y
 * la duración se deriva de las horas. "Reservada"/"expirada" las gestiona el
 * sistema según las reservas reales.
 */
class AppointmentSlotRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && in_array($user->role, [
            UserRole::SuperAdmin,
            UserRole::Admin,
        ], true);
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'admin_blocked' => $this->boolean('admin_blocked'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'capacity' => ['required', 'integer', 'min:1', 'max:100'],
            'admin_blocked' => ['boolean'],
            'block_reason' => ['nullable', 'required_if:admin_blocked,1', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}

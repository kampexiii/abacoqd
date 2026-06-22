<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Solo expone los estados editables a mano (disponible/cancelada). "Reservada"
 * y "expirada" las gestiona el sistema según las reservas reales.
 */
class AppointmentSlotRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && in_array($user->role, [
            UserRole::SuperAdmin,
            UserRole::Admin,
            UserRole::Editor,
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
            'appointment_day_id' => ['required', 'integer', 'exists:appointment_days,id'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
            'duration_minutes' => ['required', 'integer', 'min:15', 'max:1440'],
            'capacity' => ['required', 'integer', 'min:1', 'max:100'],
            'status' => ['required', Rule::in(['available', 'cancelled'])],
            'admin_blocked' => ['boolean'],
            'block_reason' => ['nullable', 'required_if:admin_blocked,1', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}

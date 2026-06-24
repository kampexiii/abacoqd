<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Generación masiva de franjas de disponibilidad. No crea duplicados ni pisa
 * reservas: la lógica del controlador omite franjas existentes y pasadas.
 */
class GenerateAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && in_array($user->role, [
            UserRole::SuperAdmin,
            UserRole::Admin,
        ], true);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'weekdays' => ['required', 'array', 'min:1'],
            'weekdays.*' => ['integer', 'between:1,7'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'duration_minutes' => ['required', 'integer', Rule::in([30, 45, 60, 90, 120])],
            'break_minutes' => ['required', 'integer', Rule::in([0, 15, 30])],
            'capacity' => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }
}

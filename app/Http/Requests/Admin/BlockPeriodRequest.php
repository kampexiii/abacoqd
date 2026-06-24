<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Bloqueo/desbloqueo de un periodo de franjas (día, rango, semana, franja
 * horaria o días de la semana concretos). El bloqueo nunca toca franjas con
 * reservas activas: el controlador las omite.
 */
class BlockPeriodRequest extends FormRequest
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
            'action' => ['required', Rule::in(['block', 'unblock'])],
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'time_from' => ['nullable', 'date_format:H:i'],
            'time_to' => ['nullable', 'date_format:H:i', 'after:time_from'],
            'weekdays' => ['nullable', 'array'],
            'weekdays.*' => ['integer', 'between:1,7'],
            'reason' => ['nullable', 'string', 'max:255'],
        ];
    }
}

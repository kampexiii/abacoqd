<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class AppointmentDayRequest extends FormRequest
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
            'is_available' => $this->boolean('is_available'),
            'admin_blocked' => $this->boolean('admin_blocked'),
        ]);
    }

    abstract protected function ignoreDayId(): ?int;

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date', Rule::unique('appointment_days', 'date')->ignore($this->ignoreDayId())],
            'title' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'is_available' => ['boolean'],
            'max_bookings' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'admin_blocked' => ['boolean'],
            'block_reason' => ['nullable', 'required_if:admin_blocked,1', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],
        ];
    }
}

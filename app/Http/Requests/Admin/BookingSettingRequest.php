<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BookingSettingRequest extends FormRequest
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
            'is_enabled' => $this->boolean('is_enabled'),
            'fallback_to_contact' => $this->boolean('fallback_to_contact'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'provider' => ['nullable', 'string', 'max:255'],
            'url' => ['nullable', 'url', 'max:2048'],
            'is_enabled' => ['boolean'],
            'fallback_to_contact' => ['boolean'],
            'default_duration_minutes' => ['required', 'integer', Rule::in([30, 45, 60, 90, 120])],
            'default_capacity' => ['required', 'integer', 'min:1', 'max:100'],
            'min_advance_hours' => ['required', 'integer', 'min:0', 'max:720'],
            'max_advance_days' => ['nullable', 'integer', 'min:1', 'max:365'],
            'notify_email' => ['nullable', 'email', 'max:255'],
        ];
    }
}

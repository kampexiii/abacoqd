<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'appointment_slot_id' => ['required', 'integer', Rule::exists('appointment_slots', 'id')],
            'name' => ['required', 'string', 'max:120'],
            'company' => ['nullable', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:180'],
            'phone' => ['nullable', 'string', 'max:40'],
            'service_id' => ['nullable', 'integer', Rule::exists('services', 'id')],
            'message' => ['nullable', 'string', 'max:2000'],
            'privacy_consent' => ['accepted'],
            'marketing_consent' => ['nullable', 'boolean'],
            'honeypot' => ['prohibited'],
        ];
    }
}

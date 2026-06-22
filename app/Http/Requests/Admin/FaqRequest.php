<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Reglas compartidas de validación de `faqs` para crear/editar.
 *
 * Pregunta y respuesta son obligatorias en español; el inglés es opcional.
 */
class FaqRequest extends FormRequest
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
            'show_in_chatbot' => $this->boolean('show_in_chatbot'),
            'show_on_page' => $this->boolean('show_on_page'),
            'is_active' => $this->boolean('is_active'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'question' => ['required', 'array'],
            'question.es' => ['required', 'string', 'max:500'],
            'question.en' => ['nullable', 'string', 'max:500'],

            'answer' => ['required', 'array'],
            'answer.es' => ['required', 'string', 'max:4000'],
            'answer.en' => ['nullable', 'string', 'max:4000'],

            'category' => ['nullable', 'string', 'max:255'],
            'intent' => ['nullable', 'string', 'max:255'],
            'redirect_url' => ['nullable', 'string', 'max:2048'],
            'redirect_section' => ['nullable', 'string', 'max:255'],

            'show_in_chatbot' => ['boolean'],
            'show_on_page' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'question.es.required' => 'La pregunta en español es obligatoria.',
            'answer.es.required' => 'La respuesta en español es obligatoria.',
        ];
    }
}

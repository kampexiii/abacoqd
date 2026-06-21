<?php

namespace App\Http\Requests\Admin;

use App\Enums\ServiceStatus;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Reglas compartidas de validación de `services` para crear/editar.
 *
 * Permite guardar borrador con campos incompletos, pero exige contenido
 * mínimo para publicar: un servicio publicado necesita título y slug en ES,
 * y resumen ES. Si el detalle está habilitado se exige descripción larga.
 */
abstract class ServiceRequest extends FormRequest
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

    /**
     * Id del servicio que se está editando, para ignorarlo en la unicidad de
     * slug. `null` al crear.
     */
    abstract protected function ignoreServiceId(): ?int;

    protected function prepareForValidation(): void
    {
        // Normaliza booleanos enviados como string vía multipart (cuando hay
        // imagen) para que la regla `boolean` sea estable.
        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'is_featured' => $this->boolean('is_featured'),
            'show_on_home' => $this->boolean('show_on_home'),
            'is_detail_enabled' => $this->boolean('is_detail_enabled'),
            'remove_image' => $this->boolean('remove_image'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $publishing = $this->input('status') === ServiceStatus::Published->value;
        $detailEnabled = $this->boolean('is_detail_enabled');
        $ignoreId = $this->ignoreServiceId();

        return [
            'title' => ['required', 'array'],
            'title.es' => [Rule::requiredIf($publishing), 'nullable', 'string', 'max:255'],
            'title.en' => ['nullable', 'string', 'max:255'],

            'slug' => ['required', 'array'],
            'slug.es' => [
                Rule::requiredIf($publishing),
                'nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('services', 'slug_es')->ignore($ignoreId),
            ],
            'slug.en' => [
                'nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('services', 'slug_en')->ignore($ignoreId),
            ],

            'summary' => ['nullable', 'array'],
            'summary.es' => [Rule::requiredIf($publishing), 'nullable', 'string', 'max:600'],
            'summary.en' => ['nullable', 'string', 'max:600'],

            'description' => ['nullable', 'array'],
            'description.es' => $detailEnabled
                ? ['required', 'string', 'min:40']
                : ['nullable', 'string'],
            'description.en' => ['nullable', 'string'],

            'icon' => ['nullable', 'string', 'max:50'],

            'cta' => ['nullable', 'array'],
            'cta.label' => ['nullable', 'array'],
            'cta.label.es' => ['nullable', 'string', 'max:80'],
            'cta.label.en' => ['nullable', 'string', 'max:80'],
            'cta.url' => ['nullable', 'array'],
            'cta.url.es' => ['nullable', 'string', 'max:2048'],
            'cta.url.en' => ['nullable', 'string', 'max:2048'],

            'status' => ['required', Rule::enum(ServiceStatus::class)],
            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],

            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'show_on_home' => ['boolean'],
            'is_detail_enabled' => ['boolean'],

            'image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'remove_image' => ['boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.es.required' => 'El título en español es obligatorio para publicar.',
            'slug.es.required' => 'El slug en español es obligatorio para publicar.',
            'slug.es.unique' => 'Ya existe un servicio con ese slug en español.',
            'slug.en.unique' => 'Ya existe un servicio con ese slug en inglés.',
            'slug.es.regex' => 'El slug solo admite minúsculas, números y guiones.',
            'slug.en.regex' => 'El slug solo admite minúsculas, números y guiones.',
            'summary.es.required' => 'El resumen en español es obligatorio para publicar.',
            'description.es.required' => 'La descripción larga es obligatoria si el detalle está habilitado.',
            'description.es.min' => 'La descripción larga debe tener al menos 40 caracteres.',
        ];
    }
}

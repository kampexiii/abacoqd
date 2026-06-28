<?php

namespace App\Http\Requests\Admin;

use App\Enums\PartnerType;
use App\Enums\UserRole;
use App\Rules\SafeSvgUpload;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Reglas compartidas de validación de `partners` para crear/editar.
 *
 * `name`/`slug` son columnas planas (no bilingües, a diferencia de
 * `services`/`posts`): el modelo y la migración cerrada de Fase 2 no
 * versionan partners por idioma. El permiso de publicación ya no se gestiona
 * desde el panel; el controlador persiste `permission_status = approved` para
 * el contenido creado/editado (la columna se conserva por compatibilidad).
 */
abstract class PartnerRequest extends FormRequest
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
     * Id del partner que se está editando, para ignorarlo en la unicidad de
     * slug. `null` al crear.
     */
    abstract protected function ignorePartnerId(): ?int;

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'show_in_collaborations' => $this->boolean('show_in_collaborations'),
            'remove_logo' => $this->boolean('remove_logo'),
            'remove_logo_dark' => $this->boolean('remove_logo_dark'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $ignoreId = $this->ignorePartnerId();

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('partners', 'slug')->ignore($ignoreId),
            ],
            'type' => ['required', Rule::enum(PartnerType::class)],

            'logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg', 'max:2048', new SafeSvgUpload],
            'remove_logo' => ['boolean'],
            'logo_dark' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg', 'max:2048', new SafeSvgUpload],
            'remove_logo_dark' => ['boolean'],
            'logo_alt' => ['nullable', 'string', 'max:255'],

            'website' => ['nullable', 'url', 'max:2048'],

            'social_links' => ['nullable', 'array'],
            'social_links.*.platform' => ['nullable', 'string', 'max:50'],
            'social_links.*.url' => ['nullable', 'string', 'max:2048'],

            'description' => ['nullable', 'array'],
            'description.es' => ['nullable', 'string', 'max:2000'],
            'description.en' => ['nullable', 'string', 'max:2000'],

            'show_in_collaborations' => ['boolean'],
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
            'name.required' => 'El nombre es obligatorio.',
            'slug.required' => 'El slug es obligatorio.',
            'slug.unique' => 'Ya existe un partner con ese slug.',
            'slug.regex' => 'El slug solo admite minúsculas, números y guiones.',
        ];
    }
}

<?php

namespace App\Http\Requests\Admin;

use App\Enums\PermissionStatus;
use App\Enums\ProjectStatus;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Reglas compartidas de validación de `projects` para crear/editar.
 *
 * Un proyecto publicado necesita título, slug y resumen en ES, además de
 * permiso aprobado (no se publica de cara al público sin permiso real del
 * cliente/colaborador).
 */
abstract class ProjectRequest extends FormRequest
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
     * Id del proyecto que se está editando, para ignorarlo en la unicidad de
     * slug. `null` al crear.
     */
    abstract protected function ignoreProjectId(): ?int;

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'is_featured' => $this->boolean('is_featured'),
            'show_on_home' => $this->boolean('show_on_home'),
            'show_in_projects' => $this->boolean('show_in_projects'),
            'show_in_collaborations' => $this->boolean('show_in_collaborations'),
            'remove_cover_image' => $this->boolean('remove_cover_image'),
            'remove_thumbnail_image' => $this->boolean('remove_thumbnail_image'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $publishing = $this->input('status') === ProjectStatus::Published->value;
        $ignoreId = $this->ignoreProjectId();

        return [
            'title' => ['required', 'array'],
            'title.es' => [Rule::requiredIf($publishing), 'nullable', 'string', 'max:255'],
            'title.en' => ['nullable', 'string', 'max:255'],

            'slug' => ['required', 'array'],
            'slug.es' => [
                Rule::requiredIf($publishing),
                'nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('projects', 'slug_es')->ignore($ignoreId),
            ],
            'slug.en' => [
                'nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('projects', 'slug_en')->ignore($ignoreId),
            ],

            'summary' => ['nullable', 'array'],
            'summary.es' => [Rule::requiredIf($publishing), 'nullable', 'string', 'max:600'],
            'summary.en' => ['nullable', 'string', 'max:600'],

            'description' => ['nullable', 'array'],
            'description.es' => ['nullable', 'string'],
            'description.en' => ['nullable', 'string'],

            'challenge' => ['nullable', 'array'],
            'challenge.es' => ['nullable', 'string'],
            'challenge.en' => ['nullable', 'string'],

            'solution' => ['nullable', 'array'],
            'solution.es' => ['nullable', 'string'],
            'solution.en' => ['nullable', 'string'],

            'result' => ['nullable', 'array'],
            'result.es' => ['nullable', 'string'],
            'result.en' => ['nullable', 'string'],

            'technologies' => ['nullable', 'array'],
            'technologies.*' => ['string', 'max:50'],

            'status' => ['required', Rule::enum(ProjectStatus::class)],
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'client_name' => ['nullable', 'string', 'max:255'],
            'client_partner_id' => ['nullable', 'integer', 'exists:partners,id'],
            'github_url' => ['nullable', 'url', 'max:2048'],
            'external_url' => ['nullable', 'url', 'max:2048'],

            'permission_status' => ['required', Rule::enum(PermissionStatus::class)],
            'permission_notes' => ['nullable', 'string', 'max:2000'],

            'show_on_home' => ['boolean'],
            'show_in_projects' => ['boolean'],
            'show_in_collaborations' => ['boolean'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],

            'cover_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'remove_cover_image' => ['boolean'],
            'thumbnail_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'remove_thumbnail_image' => ['boolean'],

            'partners' => ['nullable', 'array'],
            'partners.*.id' => ['required', 'integer', 'exists:partners,id'],
            'partners.*.role' => ['required', 'string', Rule::in(['client', 'collaborator', 'technology_partner', 'brand', 'other'])],
            'partners.*.sort_order' => ['nullable', 'integer', 'min:0'],
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
            'slug.es.unique' => 'Ya existe un proyecto con ese slug en español.',
            'slug.en.unique' => 'Ya existe un proyecto con ese slug en inglés.',
            'summary.es.required' => 'El resumen en español es obligatorio para publicar.',
        ];
    }
}

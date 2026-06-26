<?php

namespace App\Http\Requests\Admin;

use App\Enums\ProjectStatus;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Reglas compartidas de validación de `projects` para crear/editar.
 *
 * Un proyecto publicado necesita título, slug y resumen en ES. El permiso de
 * publicación ya no se gestiona desde el panel; el controlador persiste
 * `permission_status = approved` para el contenido creado/editado (la columna
 * se conserva por compatibilidad con scopes existentes).
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
            'show_on_home' => $this->boolean('show_on_home'),
            'show_in_projects' => $this->boolean('show_in_projects'),
            'show_in_collaborations' => $this->boolean('show_in_collaborations'),
            'remove_cover_image' => $this->boolean('remove_cover_image'),
            'remove_logo' => $this->boolean('remove_logo'),
            'remove_logo_dark' => $this->boolean('remove_logo_dark'),
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

            'show_on_home' => ['boolean'],
            'show_in_projects' => ['boolean'],
            'show_in_collaborations' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],

            // Imagen del proyecto: una sola subida que alimenta portada y
            // miniatura (el controlador copia la ruta a `thumbnail_image`). No
            // hay subida manual de miniatura.
            'cover_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'remove_cover_image' => ['boolean'],

            // Logo del cliente/empresa: color (modo claro) y monocromo (modo
            // oscuro). Admiten SVG (se conserva vectorial) además de raster.
            'logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg', 'max:2048'],
            'remove_logo' => ['boolean'],
            'logo_dark' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg', 'max:2048'],
            'remove_logo_dark' => ['boolean'],
            'logo_alt' => ['nullable', 'string', 'max:255'],

            'partners' => ['nullable', 'array'],
            'partners.*.id' => ['required', 'integer', 'exists:partners,id'],
            'partners.*.role' => ['required', 'string', Rule::in(['client', 'collaborator', 'technology_partner', 'brand', 'other'])],
            'partners.*.sort_order' => ['nullable', 'integer', 'min:0'],

            // Servicios/capacidades reales del proyecto (desde `services`, no
            // texto libre).
            'services' => ['nullable', 'array'],
            'services.*' => ['integer', 'exists:services,id'],
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

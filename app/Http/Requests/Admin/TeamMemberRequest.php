<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Reglas compartidas de validación de `team_members` para crear/editar.
 *
 * `name`/`slug` son columnas planas (no bilingües); `role`/`bio` son JSON
 * bilingüe. Solo se publica de cara al público (Quiénes somos) con
 * `is_visible = true`: enlaces sociales y CV solo con datos reales, nunca
 * inventados.
 */
abstract class TeamMemberRequest extends FormRequest
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
     * Id del miembro que se está editando, para ignorarlo en la unicidad de
     * slug. `null` al crear.
     */
    abstract protected function ignoreTeamMemberId(): ?int;

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_visible' => $this->boolean('is_visible'),
            'is_active' => $this->boolean('is_active'),
            'remove_photo' => $this->boolean('remove_photo'),
            'remove_cv' => $this->boolean('remove_cv'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $visible = $this->boolean('is_visible');
        $ignoreId = $this->ignoreTeamMemberId();

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('team_members', 'slug')->ignore($ignoreId),
            ],

            'role' => ['nullable', 'array'],
            'role.es' => [Rule::requiredIf($visible), 'nullable', 'string', 'max:255'],
            'role.en' => ['nullable', 'string', 'max:255'],

            'bio' => ['nullable', 'array'],
            'bio.es' => ['nullable', 'string', 'max:2000'],
            'bio.en' => ['nullable', 'string', 'max:2000'],

            'photo' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'remove_photo' => ['boolean'],
            'photo_alt' => [Rule::requiredIf($visible), 'nullable', 'string', 'max:255'],

            'cv' => ['nullable', 'file', 'mimes:pdf', 'max:8192'],
            'remove_cv' => ['boolean'],

            'linkedin_url' => ['nullable', 'url', 'max:2048'],
            'github_url' => ['nullable', 'url', 'max:2048'],
            'personal_url' => ['nullable', 'url', 'max:2048'],
            'email' => ['nullable', 'email', 'max:255'],

            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],
            'is_visible' => ['boolean'],
            'is_active' => ['boolean'],
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
            'slug.unique' => 'Ya existe un miembro de equipo con ese slug.',
            'slug.regex' => 'El slug solo admite minúsculas, números y guiones.',
            'role.es.required' => 'El rol en español es obligatorio para mostrar el perfil públicamente.',
            'photo_alt.required' => 'El texto alternativo de la foto es obligatorio para mostrar el perfil públicamente.',
        ];
    }
}

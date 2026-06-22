<?php

namespace App\Http\Requests\Admin;

use App\Enums\PostStatus;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Reglas compartidas de validación de `posts` para crear/editar.
 *
 * Mismo patrón que `ServiceRequest`: borrador con datos incompletos permitido,
 * publicar exige título/slug/extracto/contenido en ES y categoría.
 */
abstract class PostRequest extends FormRequest
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

    abstract protected function ignorePostId(): ?int;

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_featured' => $this->boolean('is_featured'),
            'show_on_home' => $this->boolean('show_on_home'),
            'remove_image' => $this->boolean('remove_image'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $publishing = in_array($this->input('status'), [
            PostStatus::Published->value,
            PostStatus::Scheduled->value,
        ], true);
        $ignoreId = $this->ignorePostId();

        return [
            'post_category_id' => ['required', 'integer', 'exists:post_categories,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['integer', 'exists:tags,id'],

            'title' => ['required', 'array'],
            'title.es' => [Rule::requiredIf($publishing), 'nullable', 'string', 'max:255'],
            'title.en' => ['nullable', 'string', 'max:255'],

            'slug' => ['required', 'array'],
            'slug.es' => [
                Rule::requiredIf($publishing),
                'nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('posts', 'slug_es')->ignore($ignoreId),
            ],
            'slug.en' => [
                'nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('posts', 'slug_en')->ignore($ignoreId),
            ],

            'excerpt' => ['nullable', 'array'],
            'excerpt.es' => [Rule::requiredIf($publishing), 'nullable', 'string', 'max:600'],
            'excerpt.en' => ['nullable', 'string', 'max:600'],

            'content' => ['nullable', 'array'],
            'content.es' => [Rule::requiredIf($publishing), 'nullable', 'string', 'min:40'],
            'content.en' => ['nullable', 'string'],

            'status' => ['required', Rule::enum(PostStatus::class)],
            'published_at' => ['nullable', 'date'],

            'is_featured' => ['boolean'],
            'show_on_home' => ['boolean'],

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
            'post_category_id.required' => 'La categoría es obligatoria.',
            'title.es.required' => 'El título en español es obligatorio para publicar.',
            'slug.es.required' => 'El slug en español es obligatorio para publicar.',
            'slug.es.unique' => 'Ya existe un post con ese slug en español.',
            'slug.en.unique' => 'Ya existe un post con ese slug en inglés.',
            'excerpt.es.required' => 'El extracto en español es obligatorio para publicar.',
            'content.es.required' => 'El contenido en español es obligatorio para publicar.',
            'content.es.min' => 'El contenido debe tener al menos 40 caracteres.',
        ];
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PostCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Gestión simple de `post_categories`: una sola pantalla con alta/edición
 * inline (sin Create/Edit separados), igual de funcional para un catálogo
 * pequeño que no necesita el patrón completo de `services`.
 */
class PostCategoryController extends Controller
{
    public function index(): Response
    {
        $categories = PostCategory::query()
            ->withCount('posts')
            ->ordered()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (PostCategory $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'sortOrder' => $category->sort_order,
                'isActive' => $category->is_active,
                'postsCount' => $category->posts_count,
            ]);

        return Inertia::render('Admin/PostCategories/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request, null);
        PostCategory::create($data);

        return back()->with('toast', ['type' => 'success', 'message' => 'Categoría creada.']);
    }

    public function update(Request $request, PostCategory $postCategory): RedirectResponse
    {
        $data = $this->validateData($request, $postCategory->id);
        $postCategory->update($data);

        return back()->with('toast', ['type' => 'success', 'message' => 'Categoría actualizada.']);
    }

    public function destroy(PostCategory $postCategory): RedirectResponse
    {
        if ($postCategory->posts()->exists()) {
            $postCategory->update(['is_active' => false]);

            return back()->with('toast', ['type' => 'info', 'message' => 'Tiene posts asociados: se desactivó en lugar de borrarla.']);
        }

        $postCategory->delete();

        return back()->with('toast', ['type' => 'success', 'message' => 'Categoría eliminada.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function validateData(Request $request, ?int $ignoreId): array
    {
        $validated = $request->validate([
            'name.es' => ['required', 'string', 'max:120'],
            'name.en' => ['nullable', 'string', 'max:120'],
            'slug.es' => ['required', 'string', 'max:120', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('post_categories', 'slug_es')->ignore($ignoreId)],
            'slug.en' => ['nullable', 'string', 'max:120', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('post_categories', 'slug_en')->ignore($ignoreId)],
            'description.es' => ['nullable', 'string', 'max:600'],
            'description.en' => ['nullable', 'string', 'max:600'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['boolean'],
        ]);

        return [
            'name' => ['es' => $validated['name']['es'], 'en' => $validated['name']['en'] ?? null],
            'slug' => ['es' => $validated['slug']['es'], 'en' => $validated['slug']['en'] ?? null],
            'description' => [
                'es' => $validated['description']['es'] ?? null,
                'en' => $validated['description']['en'] ?? null,
            ],
            'sort_order' => (int) $validated['sort_order'],
            'is_active' => $request->boolean('is_active'),
        ];
    }
}

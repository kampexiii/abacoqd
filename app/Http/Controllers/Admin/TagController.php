<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(): Response
    {
        $tags = Tag::query()
            ->withCount('posts')
            ->orderBy('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Tag $tag): array => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
                'postsCount' => $tag->posts_count,
            ]);

        return Inertia::render('Admin/Tags/Index', [
            'tags' => $tags,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Tag::create($this->validateData($request, null));

        return back()->with('toast', ['type' => 'success', 'message' => 'Tag creado.']);
    }

    public function update(Request $request, Tag $tag): RedirectResponse
    {
        $tag->update($this->validateData($request, $tag->id));

        return back()->with('toast', ['type' => 'success', 'message' => 'Tag actualizado.']);
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        if ($tag->posts()->exists()) {
            return back()->with('toast', ['type' => 'error', 'message' => 'No se puede eliminar: tiene posts asociados.']);
        }

        $tag->delete();

        return back()->with('toast', ['type' => 'success', 'message' => 'Tag eliminado.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function validateData(Request $request, ?int $ignoreId): array
    {
        $validated = $request->validate([
            'name.es' => ['required', 'string', 'max:80'],
            'name.en' => ['nullable', 'string', 'max:80'],
            'slug.es' => ['required', 'string', 'max:80', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('tags', 'slug_es')->ignore($ignoreId)],
            'slug.en' => ['nullable', 'string', 'max:80', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('tags', 'slug_en')->ignore($ignoreId)],
        ]);

        return [
            'name' => ['es' => $validated['name']['es'], 'en' => $validated['name']['en'] ?? null],
            'slug' => ['es' => $validated['slug']['es'], 'en' => $validated['slug']['en'] ?? null],
        ];
    }
}

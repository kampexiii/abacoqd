<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FaqRequest;
use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * CRUD admin de `faqs` (Fase 4). Alimenta tanto el chatbot como la página
 * pública de preguntas frecuentes. No hay borrado físico: "eliminar" archiva
 * (desactiva y oculta de ambos canales).
 */
class FaqController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim($request->string('q')->toString());

        $faqs = Faq::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('question', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%")
                        ->orWhere('intent', 'like', "%{$search}%");
                });
            })
            ->ordered()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Faq $faq): array => $this->adminSummary($faq));

        return Inertia::render('Admin/Faqs/Index', [
            'faqs' => $faqs,
            'filters' => $request->only(['q']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Faqs/Create', [
            'nextSortOrder' => (int) (Faq::max('sort_order') ?? 0) + 1,
        ]);
    }

    public function store(FaqRequest $request): RedirectResponse
    {
        Faq::create($this->contentAttributes($request));

        return to_route('admin.faqs.index')
            ->with('toast', ['type' => 'success', 'message' => 'FAQ creada.']);
    }

    public function edit(Faq $faq): Response
    {
        return Inertia::render('Admin/Faqs/Edit', [
            'faq' => $this->adminRecord($faq),
        ]);
    }

    public function update(FaqRequest $request, Faq $faq): RedirectResponse
    {
        $faq->update($this->contentAttributes($request));

        return to_route('admin.faqs.index')
            ->with('toast', ['type' => 'success', 'message' => 'FAQ actualizada.']);
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $faq->update([
            'is_active' => false,
            'show_in_chatbot' => false,
            'show_on_page' => false,
        ]);

        return to_route('admin.faqs.index')
            ->with('toast', ['type' => 'success', 'message' => 'FAQ archivada.']);
    }

    public function toggleActive(Faq $faq): RedirectResponse
    {
        $faq->update(['is_active' => ! $faq->is_active]);

        return back();
    }

    public function toggleChatbot(Faq $faq): RedirectResponse
    {
        $faq->update(['show_in_chatbot' => ! $faq->show_in_chatbot]);

        return back();
    }

    public function togglePage(Faq $faq): RedirectResponse
    {
        $faq->update(['show_on_page' => ! $faq->show_on_page]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function contentAttributes(FaqRequest $request): array
    {
        return [
            'question' => $this->localized($request->validated('question')),
            'answer' => $this->localized($request->validated('answer')),
            'category' => $request->validated('category'),
            'intent' => $request->validated('intent'),
            'redirect_url' => $request->validated('redirect_url'),
            'redirect_section' => $request->validated('redirect_section'),
            'show_in_chatbot' => $request->boolean('show_in_chatbot'),
            'show_on_page' => $request->boolean('show_on_page'),
            'is_active' => $request->boolean('is_active'),
            'sort_order' => (int) $request->validated('sort_order'),
        ];
    }

    /**
     * @return array<string, string|null>|null
     */
    private function localized(mixed $value): ?array
    {
        if (! is_array($value)) {
            return null;
        }

        $es = isset($value['es']) && is_string($value['es']) ? $value['es'] : null;
        $en = isset($value['en']) && is_string($value['en']) ? $value['en'] : null;

        if ($es === null && $en === null) {
            return null;
        }

        return ['es' => $es, 'en' => $en];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminSummary(Faq $faq): array
    {
        return [
            'id' => $faq->id,
            'question' => $faq->question,
            'category' => $faq->category,
            'intent' => $faq->intent,
            'showInChatbot' => $faq->show_in_chatbot,
            'showOnPage' => $faq->show_on_page,
            'isActive' => $faq->is_active,
            'sortOrder' => $faq->sort_order,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminRecord(Faq $faq): array
    {
        return [
            ...$this->adminSummary($faq),
            'answer' => $faq->answer,
            'redirectUrl' => $faq->redirect_url,
            'redirectSection' => $faq->redirect_section,
        ];
    }
}

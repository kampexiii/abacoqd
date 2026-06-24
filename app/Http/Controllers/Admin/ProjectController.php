<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PermissionStatus;
use App\Enums\ProjectStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest;
use App\Models\Partner;
use App\Models\Project;
use App\Services\Media\ProjectImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * CRUD admin de `projects` (Fase 4).
 *
 * El listado muestra todos los estados; la web pública filtra por
 * estado/visibilidad/permiso en `Public\ProjectController`. No hay borrado
 * físico: «eliminar» archiva el proyecto (status=hidden + is_active=false +
 * oculto en todas las superficies), conservando los datos y la relación
 * `partner_project`.
 */
class ProjectController extends Controller
{
    public function __construct(private readonly ProjectImageService $images) {}

    public function index(Request $request): Response
    {
        $search = trim($request->string('q')->toString());
        $status = $request->string('status')->toString();

        $projects = Project::query()
            ->with('clientPartner')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            })
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Project $project): array => $this->adminSummary($project));

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'filters' => $request->only(['q', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Projects/Create', [
            'statuses' => $this->statusOptions(),
            'permissionStatuses' => $this->permissionStatusOptions(),
            'partners' => $this->partnerOptions(),
            'nextSortOrder' => (int) (Project::max('sort_order') ?? 0) + 1,
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $project = new Project($this->contentAttributes($request));
        $project->save();

        $this->syncImages($request, $project);
        $this->syncPartners($request, $project);

        return to_route('admin.projects.index')
            ->with('toast', ['type' => 'success', 'message' => 'Proyecto creado.']);
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('Admin/Projects/Edit', [
            'project' => $this->adminRecord($project),
            'statuses' => $this->statusOptions(),
            'permissionStatuses' => $this->permissionStatusOptions(),
            'partners' => $this->partnerOptions(),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $project->fill($this->contentAttributes($request));
        $project->save();

        $this->syncImages($request, $project);
        $this->syncPartners($request, $project);

        return to_route('admin.projects.index')
            ->with('toast', ['type' => 'success', 'message' => 'Proyecto actualizado.']);
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->update([
            'status' => ProjectStatus::Hidden,
            'is_active' => false,
            'show_on_home' => false,
            'show_in_projects' => false,
            'show_in_collaborations' => false,
        ]);

        return to_route('admin.projects.index')
            ->with('toast', ['type' => 'success', 'message' => 'Proyecto archivado (oculto e inactivo).']);
    }

    public function toggleActive(Project $project): RedirectResponse
    {
        $project->update(['is_active' => ! $project->is_active]);

        return back();
    }

    public function toggleHome(Project $project): RedirectResponse
    {
        $project->update(['show_on_home' => ! $project->show_on_home]);

        return back();
    }

    public function toggleProjects(Project $project): RedirectResponse
    {
        $project->update(['show_in_projects' => ! $project->show_in_projects]);

        return back();
    }

    public function toggleCollaborations(Project $project): RedirectResponse
    {
        $project->update(['show_in_collaborations' => ! $project->show_in_collaborations]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function contentAttributes(StoreProjectRequest|UpdateProjectRequest $request): array
    {
        return [
            'title' => $this->localized($request->validated('title')),
            'slug' => $this->localized($request->validated('slug')),
            'summary' => $this->localized($request->validated('summary')),
            'description' => $this->localized($request->validated('description')),
            'challenge' => $this->localized($request->validated('challenge')),
            'solution' => $this->localized($request->validated('solution')),
            'result' => $this->localized($request->validated('result')),
            'technologies' => array_values($request->validated('technologies') ?? []),
            'status' => $request->validated('status'),
            'year' => $request->validated('year'),
            'client_name' => $request->validated('client_name'),
            'client_partner_id' => $request->validated('client_partner_id'),
            'github_url' => $request->validated('github_url'),
            'external_url' => $request->validated('external_url'),
            'permission_status' => $request->validated('permission_status'),
            'permission_notes' => $request->validated('permission_notes'),
            'show_on_home' => $request->boolean('show_on_home'),
            'show_in_projects' => $request->boolean('show_in_projects'),
            'show_in_collaborations' => $request->boolean('show_in_collaborations'),
            'is_active' => $request->boolean('is_active'),
            'sort_order' => (int) $request->validated('sort_order'),
        ];
    }

    private function syncImages(StoreProjectRequest|UpdateProjectRequest $request, Project $project): void
    {
        $slug = $project->slug_es ?? $project->slug_en ?? (string) $project->id;

        if ($request->hasFile('cover_image')) {
            $previous = $project->cover_image;
            $path = $this->images->storeFromPath($request->file('cover_image')->getRealPath(), $slug, 'cover');
            $project->update(['cover_image' => $path]);

            if ($previous !== null && $previous !== $path) {
                $this->images->delete($previous);
            }
        } elseif ($request->boolean('remove_cover_image') && $project->cover_image !== null) {
            $this->images->delete($project->cover_image);
            $project->update(['cover_image' => null]);
        }

        if ($request->hasFile('thumbnail_image')) {
            $previous = $project->thumbnail_image;
            $path = $this->images->storeFromPath($request->file('thumbnail_image')->getRealPath(), $slug, 'thumbnail');
            $project->update(['thumbnail_image' => $path]);

            if ($previous !== null && $previous !== $path) {
                $this->images->delete($previous);
            }
        } elseif ($request->boolean('remove_thumbnail_image') && $project->thumbnail_image !== null) {
            $this->images->delete($project->thumbnail_image);
            $project->update(['thumbnail_image' => null]);
        }
    }

    /**
     * Sincroniza la relación `partner_project` con rol y orden por partner,
     * evitando atribuciones falsas (cada fila declara su rol explícito).
     */
    private function syncPartners(StoreProjectRequest|UpdateProjectRequest $request, Project $project): void
    {
        $partners = $request->validated('partners') ?? [];

        $sync = [];

        foreach ($partners as $partner) {
            $sync[(int) $partner['id']] = [
                'role' => $partner['role'],
                'sort_order' => (int) ($partner['sort_order'] ?? 0),
            ];
        }

        $project->partners()->sync($sync);
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
    private function adminSummary(Project $project): array
    {
        return [
            'id' => $project->id,
            'title' => $project->title,
            'slug' => $project->slug,
            'status' => $project->status->value,
            'permissionStatus' => $project->permission_status->value,
            'coverImage' => $project->cover_image,
            'clientName' => $project->client_name ?? $project->clientPartner?->name,
            'year' => $project->year,
            'isActive' => $project->is_active,
            'showOnHome' => $project->show_on_home,
            'showInProjects' => $project->show_in_projects,
            'showInCollaborations' => $project->show_in_collaborations,
            'sortOrder' => $project->sort_order,
            'updatedAt' => $project->updated_at?->toIso8601String(),
            'publicUrl' => $this->publicUrl($project),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminRecord(Project $project): array
    {
        return [
            ...$this->adminSummary($project),
            'summary' => $project->summary,
            'description' => $project->description,
            'challenge' => $project->challenge,
            'solution' => $project->solution,
            'result' => $project->result,
            'thumbnailImage' => $project->thumbnail_image,
            'technologies' => is_array($project->technologies) ? array_values($project->technologies) : [],
            'clientPartnerId' => $project->client_partner_id,
            'githubUrl' => $project->github_url,
            'externalUrl' => $project->external_url,
            'permissionNotes' => $project->permission_notes,
            'partners' => $project->partners->map(fn (Partner $partner): array => [
                'id' => $partner->id,
                'name' => $partner->name,
                'role' => $partner->getRelationValue('pivot')?->role,
                'sortOrder' => $partner->getRelationValue('pivot')?->sort_order,
            ])->values(),
        ];
    }

    private function publicUrl(Project $project): ?string
    {
        $slug = $project->slug['es'] ?? $project->slug['en'] ?? null;

        return $slug !== null ? url('/proyectos/'.$slug) : null;
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function statusOptions(): array
    {
        return [
            ['value' => ProjectStatus::Draft->value, 'label' => 'Borrador'],
            ['value' => ProjectStatus::Published->value, 'label' => 'Publicado'],
            ['value' => ProjectStatus::Hidden->value, 'label' => 'Oculto'],
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function permissionStatusOptions(): array
    {
        return [
            ['value' => PermissionStatus::Pending->value, 'label' => 'Pendiente'],
            ['value' => PermissionStatus::Approved->value, 'label' => 'Aprobado'],
            ['value' => PermissionStatus::Rejected->value, 'label' => 'Rechazado'],
            ['value' => PermissionStatus::Unknown->value, 'label' => 'Desconocido'],
        ];
    }

    /**
     * @return list<array{value: int, label: string}>
     */
    private function partnerOptions(): array
    {
        return array_values(Partner::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Partner $partner): array => ['value' => $partner->id, 'label' => $partner->name])
            ->all());
    }
}

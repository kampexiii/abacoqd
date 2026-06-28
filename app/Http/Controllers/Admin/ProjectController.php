<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PermissionStatus;
use App\Enums\ProjectStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest;
use App\Models\Partner;
use App\Models\Project;
use App\Models\Service;
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
            'partners' => $this->partnerOptions(),
            'services' => $this->serviceOptions(),
            'nextSortOrder' => (int) (Project::max('sort_order') ?? 0) + 1,
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $project = new Project($this->contentAttributes($request));
        $project->save();

        $this->syncImages($request, $project);
        $this->syncPartners($request, $project);
        $this->syncServices($request, $project);

        return to_route('admin.projects.index')
            ->with('toast', ['type' => 'success', 'message' => 'Proyecto creado.']);
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('Admin/Projects/Edit', [
            'project' => $this->adminRecord($project),
            'statuses' => $this->statusOptions(),
            'partners' => $this->partnerOptions(),
            'services' => $this->serviceOptions(),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $project->fill($this->contentAttributes($request));
        $project->save();

        $this->syncImages($request, $project);
        $this->syncPartners($request, $project);
        $this->syncServices($request, $project);

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
            'logo_alt' => $request->validated('logo_alt'),
            // El permiso de publicación ya no se gestiona desde el panel: crear o
            // editar un proyecto implica que se puede publicar. Se persiste
            // `approved` internamente por compatibilidad con scopes/columna.
            'permission_status' => PermissionStatus::Approved->value,
            'show_on_home' => $request->boolean('show_on_home'),
            'show_in_projects' => $request->boolean('show_in_projects'),
            'show_in_collaborations' => $request->boolean('show_in_collaborations'),
            'is_active' => $request->boolean('is_active'),
            'sort_order' => (int) $request->validated('sort_order'),
        ];
    }

    /**
     * Sincroniza la imagen del proyecto (una sola subida que alimenta portada y
     * miniatura) y los logos color/monocromo del cliente. Borra el archivo
     * anterior al reemplazar/quitar, sin borrar dos veces la misma ruta.
     */
    private function syncImages(StoreProjectRequest|UpdateProjectRequest $request, Project $project): void
    {
        // `slug_es`/`slug_en` son columnas generadas por la BD y no se cargan en
        // memoria tras `save()`; resolvemos desde el atributo JSON `slug`, ya
        // poblado en store/update, con el id como último recurso.
        $slugData = is_array($project->slug) ? $project->slug : [];
        $slug = $slugData['es'] ?? $slugData['en'] ?? (string) $project->id;

        // Imagen del proyecto: la misma ruta alimenta `cover_image` y
        // `thumbnail_image` (no hay subida manual de miniatura).
        if ($request->hasFile('cover_image')) {
            $previousCover = $project->cover_image;
            $previousThumb = $project->thumbnail_image;
            $path = $this->images->storeFromPath($request->file('cover_image')->getRealPath(), $slug, 'cover');
            $project->update(['cover_image' => $path, 'thumbnail_image' => $path]);

            $this->deleteReplaced($previousCover, $path);

            if ($previousThumb !== $previousCover) {
                $this->deleteReplaced($previousThumb, $path);
            }
        } elseif ($request->boolean('remove_cover_image')) {
            $cover = $project->cover_image;
            $thumb = $project->thumbnail_image;

            if ($cover !== null) {
                $this->images->delete($cover);
            }

            if ($thumb !== null && $thumb !== $cover) {
                $this->images->delete($thumb);
            }

            $project->update(['cover_image' => null, 'thumbnail_image' => null]);
        }

        $this->syncLogo($request, $project, $slug, 'logo', 'logo', 'remove_logo');
        $this->syncLogo($request, $project, $slug, 'logo_dark', 'logo-dark', 'remove_logo_dark');
    }

    /**
     * Procesa un logo (color o monocromo): convierte/guarda y borra el anterior
     * si se reemplaza o se quita.
     */
    private function syncLogo(
        StoreProjectRequest|UpdateProjectRequest $request,
        Project $project,
        string $slug,
        string $field,
        string $variant,
        string $removeFlag,
    ): void {
        if ($request->hasFile($field)) {
            $file = $request->file($field);
            $previous = $project->{$field};
            $path = $this->images->storeFromPath($file->getRealPath(), $slug, $variant, $file->getClientOriginalExtension());
            $project->update([$field => $path]);

            $this->deleteReplaced($previous, $path);
        } elseif ($request->boolean($removeFlag) && $project->{$field} !== null) {
            $this->images->delete($project->{$field});
            $project->update([$field => null]);
        }
    }

    private function deleteReplaced(?string $previous, string $new): void
    {
        if ($previous !== null && $previous !== $new) {
            $this->images->delete($previous);
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
     * Sincroniza los servicios/capacidades del proyecto desde `services` (ids).
     * Sin texto libre; el orden de selección define `sort_order`.
     */
    private function syncServices(StoreProjectRequest|UpdateProjectRequest $request, Project $project): void
    {
        $ids = $request->validated('services') ?? [];

        $sync = [];
        $order = 0;

        foreach ($ids as $id) {
            $sync[(int) $id] = ['sort_order' => $order += 1];
        }

        $project->services()->sync($sync);
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
            'logo' => $project->logo,
            'logoDark' => $project->logo_dark,
            'logoAlt' => $project->logo_alt,
            'technologies' => is_array($project->technologies) ? array_values($project->technologies) : [],
            'clientPartnerId' => $project->client_partner_id,
            'githubUrl' => $project->github_url,
            'externalUrl' => $project->external_url,
            'serviceIds' => $project->services->pluck('id')->values(),
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

    /**
     * Servicios seleccionables (desde `services`). Los activos/publicables van
     * primero; los inactivos se marcan para no perder contexto en edición.
     *
     * @return list<array{value: int, label: string, inactive: bool}>
     */
    private function serviceOptions(): array
    {
        return array_values(Service::query()
            ->orderByDesc('is_active')
            ->ordered()
            ->get(['id', 'title', 'is_active'])
            ->map(function (Service $service): array {
                $es = data_get($service->title, 'es');
                $en = data_get($service->title, 'en');

                return [
                    'value' => $service->id,
                    'label' => is_string($es) ? $es : (is_string($en) ? $en : '—'),
                    'inactive' => ! $service->is_active,
                ];
            })
            ->all());
    }
}

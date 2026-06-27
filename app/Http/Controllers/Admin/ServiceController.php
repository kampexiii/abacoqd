<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ServiceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Models\Service;
use App\Services\Content\ServiceSnapshotWriter;
use App\Services\Media\ServiceImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * CRUD admin de `services` (Fase 4).
 *
 * El listado muestra todos los estados (también draft/hidden); la web pública
 * filtra por estado/visibilidad en `Public\ServiceController`. No hay borrado
 * físico: `services` no tiene soft deletes, así que «eliminar» archiva el
 * servicio (status=hidden + is_active=false) conservando los datos.
 */
class ServiceController extends Controller
{
    public function __construct(
        private readonly ServiceImageService $images,
        private readonly ServiceSnapshotWriter $snapshots,
    ) {}

    public function index(Request $request): Response
    {
        $search = trim($request->string('q')->toString());
        $status = $request->string('status')->toString();
        $active = $request->string('active')->toString();

        $services = Service::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            })
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->when($active === 'yes', fn ($query) => $query->where('is_active', true))
            ->when($active === 'no', fn ($query) => $query->where('is_active', false))
            ->ordered()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Service $service): array => $this->adminSummary($service));

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'filters' => $request->only(['q', 'status', 'active']),
            'counts' => [
                'total' => Service::query()->count(),
                'published' => Service::query()->where('status', ServiceStatus::Published->value)->count(),
                'draft' => Service::query()->where('status', ServiceStatus::Draft->value)->count(),
                'hidden' => Service::query()->where('status', ServiceStatus::Hidden->value)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Services/Create', [
            'statuses' => $this->statusOptions(),
            'nextSortOrder' => (int) (Service::max('sort_order') ?? 0) + 1,
        ]);
    }

    public function store(StoreServiceRequest $request): RedirectResponse
    {
        $service = new Service($this->contentAttributes($request));
        $service->save();

        $this->syncImage($request, $service);
        $this->snapshots->write();

        return to_route('admin.services.index')
            ->with('toast', ['type' => 'success', 'message' => 'Servicio creado.']);
    }

    public function edit(Service $service): Response
    {
        return Inertia::render('Admin/Services/Edit', [
            'service' => $this->adminRecord($service),
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $service->fill($this->contentAttributes($request));
        $service->save();

        $this->syncImage($request, $service);
        $this->snapshots->write();

        return to_route('admin.services.index')
            ->with('toast', ['type' => 'success', 'message' => 'Servicio actualizado.']);
    }

    /**
     * Archiva el servicio en lugar de borrarlo: `services` no usa soft deletes,
     * así que conserva la fila como oculta e inactiva.
     */
    public function destroy(Service $service): RedirectResponse
    {
        $service->update([
            'status' => ServiceStatus::Hidden,
            'is_active' => false,
        ]);

        $this->snapshots->write();

        return to_route('admin.services.index')
            ->with('toast', ['type' => 'success', 'message' => 'Servicio archivado (oculto e inactivo).']);
    }

    public function toggleStatus(Service $service): RedirectResponse
    {
        $service->update([
            'status' => $service->status === ServiceStatus::Published
                ? ServiceStatus::Hidden
                : ServiceStatus::Published,
        ]);

        return back();
    }

    public function toggleActive(Service $service): RedirectResponse
    {
        $isActive = ! $service->is_active;

        $service->update([
            'is_active' => $isActive,
            'is_featured' => $isActive ? $service->is_featured : false,
            'show_on_home' => $isActive ? $service->is_featured : false,
            'is_detail_enabled' => $isActive ? $service->is_detail_enabled : false,
        ]);

        return back();
    }

    public function toggleHome(Service $service): RedirectResponse
    {
        return $this->toggleFeatured($service);
    }

    public function toggleFeatured(Service $service): RedirectResponse
    {
        if ($service->is_featured) {
            $service->update([
                'is_featured' => false,
                'show_on_home' => false,
            ]);

            return back();
        }

        if (! $service->is_active) {
            return back()
                ->withErrors(['is_featured' => $this->featuredRequiresActiveMessage()])
                ->with('toast', ['type' => 'error', 'message' => $this->featuredRequiresActiveMessage()]);
        }

        if (! $service->is_detail_enabled) {
            return back()
                ->withErrors(['is_featured' => $this->featuredRequiresDetailMessage()])
                ->with('toast', ['type' => 'error', 'message' => $this->featuredRequiresDetailMessage()]);
        }

        if ($this->featuredLimitReached($service)) {
            return back()
                ->withErrors(['is_featured' => $this->featuredLimitMessage()])
                ->with('toast', ['type' => 'error', 'message' => $this->featuredLimitMessage()]);
        }

        $service->update([
            'is_featured' => true,
            'show_on_home' => true,
        ]);

        return back();
    }

    public function toggleDetail(Service $service): RedirectResponse
    {
        if (! $service->is_detail_enabled && ! $service->is_active) {
            return back()
                ->withErrors(['is_detail_enabled' => $this->detailRequiresActiveMessage()])
                ->with('toast', ['type' => 'error', 'message' => $this->detailRequiresActiveMessage()]);
        }

        $isDetailEnabled = ! $service->is_detail_enabled;

        $service->update([
            'is_detail_enabled' => $isDetailEnabled,
            'is_featured' => $isDetailEnabled ? $service->is_featured : false,
            'show_on_home' => $isDetailEnabled ? $service->is_featured : false,
        ]);

        return back();
    }

    /**
     * Atributos de contenido normalizados desde la request validada.
     *
     * @return array<string, mixed>
     */
    private function contentAttributes(StoreServiceRequest|UpdateServiceRequest $request): array
    {
        return [
            'title' => $this->localized($request->validated('title')),
            'slug' => $this->localized($request->validated('slug')),
            'summary' => $this->localized($request->validated('summary')),
            'description' => $this->localized($request->validated('description')),
            'icon' => $request->validated('icon'),
            'cta' => $this->normalizeCta($request->validated('cta')),
            'status' => $request->validated('status'),
            'sort_order' => (int) $request->validated('sort_order'),
            'is_active' => $request->boolean('is_active'),
            'is_featured' => $request->boolean('is_featured'),
            'show_on_home' => $request->boolean('is_featured'),
            'is_detail_enabled' => $request->boolean('is_detail_enabled'),
        ];
    }

    /**
     * Convierte/guarda la imagen subida (WebP) o la elimina si se pidió.
     */
    private function syncImage(StoreServiceRequest|UpdateServiceRequest $request, Service $service): void
    {
        if ($request->hasFile('image')) {
            $previous = $service->image;
            // `slug_es`/`slug_en` son columnas generadas en BD: tras un
            // `fill()->save()` en esta misma request (alta o cambio de slug)
            // el modelo en memoria aún no las refleja. Se usa el atributo
            // `slug` (recién asignado) en su lugar para no nombrar el
            // archivo con el slug antiguo o con el id.
            $slug = $service->slug['es'] ?? $service->slug['en'] ?? (string) $service->id;
            $path = $this->images->storeFromPath($request->file('image')->getRealPath(), $slug);

            $service->update(['image' => $path]);

            if ($previous !== null && $previous !== $path) {
                $this->images->delete($previous);
            }

            return;
        }

        if ($request->boolean('remove_image') && $service->image !== null) {
            $this->images->delete($service->image);
            $service->update(['image' => null]);
        }
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
     * @return array<string, mixed>|null
     */
    private function normalizeCta(mixed $value): ?array
    {
        if (! is_array($value)) {
            return null;
        }

        $label = $this->localized($value['label'] ?? null);
        $url = $this->localized($value['url'] ?? null);

        if ($label === null && $url === null) {
            return null;
        }

        return ['label' => $label, 'url' => $url];
    }

    /**
     * Datos de cada fila del listado admin.
     *
     * @return array<string, mixed>
     */
    private function adminSummary(Service $service): array
    {
        return [
            'id' => $service->id,
            'title' => $service->title,
            'slug' => $service->slug,
            'status' => $service->status->value,
            'isActive' => $service->is_active,
            'isFeatured' => $service->is_featured,
            'showOnHome' => $service->show_on_home,
            'isDetailEnabled' => $service->is_detail_enabled,
            'sortOrder' => $service->sort_order,
            'updatedAt' => $service->updated_at?->toIso8601String(),
            'publicUrl' => $this->publicUrl($service),
        ];
    }

    /**
     * Registro completo para el formulario de edición.
     *
     * @return array<string, mixed>
     */
    private function adminRecord(Service $service): array
    {
        return [
            ...$this->adminSummary($service),
            'summary' => $service->summary,
            'description' => $service->description,
            'icon' => $service->icon,
            'image' => $service->image,
            'cta' => $service->cta,
        ];
    }

    private function publicUrl(Service $service): ?string
    {
        $slug = $service->slug_es ?? $service->slug_en;

        return $slug !== null ? url('/servicios/'.$slug) : null;
    }

    private function featuredLimitReached(Service $service): bool
    {
        return Service::query()
            ->where('is_featured', true)
            ->whereKeyNot($service->id)
            ->count() >= Service::MAX_FEATURED_ON_HOME;
    }

    private function featuredLimitMessage(): string
    {
        return 'Solo se pueden destacar '.Service::MAX_FEATURED_ON_HOME.' servicios como máximo en la landing.';
    }

    private function featuredRequiresActiveMessage(): string
    {
        return 'Activa el servicio antes de destacarlo en la landing.';
    }

    private function featuredRequiresDetailMessage(): string
    {
        return 'Activa la página individual antes de destacar este servicio en la landing.';
    }

    private function detailRequiresActiveMessage(): string
    {
        return 'Activa el servicio antes de habilitar su página individual.';
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function statusOptions(): array
    {
        return [
            ['value' => ServiceStatus::Draft->value, 'label' => 'Borrador'],
            ['value' => ServiceStatus::Published->value, 'label' => 'Publicado'],
            ['value' => ServiceStatus::Hidden->value, 'label' => 'Oculto'],
        ];
    }
}

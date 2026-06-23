<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PartnerType;
use App\Enums\PermissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePartnerRequest;
use App\Http\Requests\Admin\UpdatePartnerRequest;
use App\Models\Partner;
use App\Services\Media\PartnerLogoService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * CRUD admin de `partners` (Fase 4).
 *
 * `partners` cubre empresas, marcas, clientes y colaboradores: no hay tabla
 * separada por tipo. No hay borrado físico: «eliminar» archiva el partner
 * (oculto en home/colaboraciones/proyectos + inactivo) conservando los datos
 * y su relación con `projects`/`reviews`.
 */
class PartnerController extends Controller
{
    public function __construct(private readonly PartnerLogoService $logos) {}

    public function index(): Response
    {
        $partners = Partner::query()
            ->ordered()
            ->get()
            ->map(fn (Partner $partner): array => $this->adminSummary($partner))
            ->values();

        return Inertia::render('Admin/Partners/Index', [
            'partners' => $partners,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Partners/Create', [
            'types' => $this->typeOptions(),
            'permissionStatuses' => $this->permissionStatusOptions(),
            'nextSortOrder' => (int) (Partner::max('sort_order') ?? 0) + 1,
        ]);
    }

    public function store(StorePartnerRequest $request): RedirectResponse
    {
        $partner = new Partner($this->contentAttributes($request));
        $partner->save();

        $this->syncLogos($request, $partner);

        return to_route('admin.partners.index')
            ->with('toast', ['type' => 'success', 'message' => 'Partner creado.']);
    }

    public function edit(Partner $partner): Response
    {
        return Inertia::render('Admin/Partners/Edit', [
            'partner' => $this->adminRecord($partner),
            'types' => $this->typeOptions(),
            'permissionStatuses' => $this->permissionStatusOptions(),
        ]);
    }

    public function update(UpdatePartnerRequest $request, Partner $partner): RedirectResponse
    {
        $partner->fill($this->contentAttributes($request));
        $partner->save();

        $this->syncLogos($request, $partner);

        return to_route('admin.partners.index')
            ->with('toast', ['type' => 'success', 'message' => 'Partner actualizado.']);
    }

    /**
     * Archiva el partner en lugar de borrarlo: oculto en todas las
     * superficies públicas e inactivo, conservando datos y relaciones.
     */
    public function destroy(Partner $partner): RedirectResponse
    {
        $partner->update([
            'show_on_home' => false,
            'show_in_collaborations' => false,
            'show_in_projects' => false,
            'is_active' => false,
        ]);

        return to_route('admin.partners.index')
            ->with('toast', ['type' => 'success', 'message' => 'Partner archivado (oculto e inactivo).']);
    }

    public function toggleActive(Partner $partner): RedirectResponse
    {
        $partner->update(['is_active' => ! $partner->is_active]);

        return back();
    }

    public function toggleFeatured(Partner $partner): RedirectResponse
    {
        $partner->update(['is_featured' => ! $partner->is_featured]);

        return back();
    }

    public function toggleHome(Partner $partner): RedirectResponse
    {
        $partner->update(['show_on_home' => ! $partner->show_on_home]);

        return back();
    }

    public function toggleCollaborations(Partner $partner): RedirectResponse
    {
        $partner->update(['show_in_collaborations' => ! $partner->show_in_collaborations]);

        return back();
    }

    public function toggleProjects(Partner $partner): RedirectResponse
    {
        $partner->update(['show_in_projects' => ! $partner->show_in_projects]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function contentAttributes(StorePartnerRequest|UpdatePartnerRequest $request): array
    {
        return [
            'name' => $request->validated('name'),
            'slug' => $request->validated('slug'),
            'type' => $request->validated('type'),
            'logo_alt' => $request->validated('logo_alt'),
            'website' => $request->validated('website'),
            'social_links' => $this->normalizeSocialLinks($request->validated('social_links')),
            'description' => $this->localized($request->validated('description')),
            'permission_status' => $request->validated('permission_status'),
            'permission_notes' => $request->validated('permission_notes'),
            'show_on_home' => $request->boolean('show_on_home'),
            'show_in_collaborations' => $request->boolean('show_in_collaborations'),
            'show_in_projects' => $request->boolean('show_in_projects'),
            'is_featured' => $request->boolean('is_featured'),
            'is_active' => $request->boolean('is_active'),
            'sort_order' => (int) $request->validated('sort_order'),
        ];
    }

    private function syncLogos(StorePartnerRequest|UpdatePartnerRequest $request, Partner $partner): void
    {
        if ($request->hasFile('logo')) {
            $previous = $partner->logo;
            $path = $this->logos->storeFromPath($request->file('logo')->getRealPath(), $partner->slug, 'logo');
            $partner->update(['logo' => $path]);

            if ($previous !== null && $previous !== $path) {
                $this->logos->delete($previous);
            }
        } elseif ($request->boolean('remove_logo') && $partner->logo !== null) {
            $this->logos->delete($partner->logo);
            $partner->update(['logo' => null]);
        }

        if ($request->hasFile('logo_dark')) {
            $previous = $partner->logo_dark;
            $path = $this->logos->storeFromPath($request->file('logo_dark')->getRealPath(), $partner->slug, 'logo-dark');
            $partner->update(['logo_dark' => $path]);

            if ($previous !== null && $previous !== $path) {
                $this->logos->delete($previous);
            }
        } elseif ($request->boolean('remove_logo_dark') && $partner->logo_dark !== null) {
            $this->logos->delete($partner->logo_dark);
            $partner->update(['logo_dark' => null]);
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
     * @return list<array{platform: string|null, url: string|null}>|null
     */
    private function normalizeSocialLinks(mixed $value): ?array
    {
        if (! is_array($value) || $value === []) {
            return null;
        }

        return array_values(array_filter(array_map(
            fn (mixed $link): ?array => is_array($link) && (! empty($link['platform']) || ! empty($link['url']))
                ? ['platform' => $link['platform'] ?? null, 'url' => $link['url'] ?? null]
                : null,
            $value,
        )));
    }

    /**
     * @return array<string, mixed>
     */
    private function adminSummary(Partner $partner): array
    {
        return [
            'id' => $partner->id,
            'name' => $partner->name,
            'slug' => $partner->slug,
            'type' => $partner->type->value,
            'logo' => $partner->logo,
            'permissionStatus' => $partner->permission_status->value,
            'isActive' => $partner->is_active,
            'showOnHome' => $partner->show_on_home,
            'showInCollaborations' => $partner->show_in_collaborations,
            'showInProjects' => $partner->show_in_projects,
            'isFeatured' => $partner->is_featured,
            'sortOrder' => $partner->sort_order,
            'updatedAt' => $partner->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminRecord(Partner $partner): array
    {
        return [
            ...$this->adminSummary($partner),
            'logoDark' => $partner->logo_dark,
            'logoAlt' => $partner->logo_alt,
            'website' => $partner->website,
            'socialLinks' => $partner->social_links,
            'description' => $partner->description,
            'permissionNotes' => $partner->permission_notes,
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function typeOptions(): array
    {
        return [
            ['value' => PartnerType::Client->value, 'label' => 'Cliente'],
            ['value' => PartnerType::Collaborator->value, 'label' => 'Colaborador'],
            ['value' => PartnerType::Provider->value, 'label' => 'Proveedor'],
            ['value' => PartnerType::Institutional->value, 'label' => 'Institucional'],
            ['value' => PartnerType::Other->value, 'label' => 'Otro'],
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
}

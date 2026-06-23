<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTeamMemberRequest;
use App\Http\Requests\Admin\UpdateTeamMemberRequest;
use App\Models\TeamMember;
use App\Services\Media\TeamMemberPhotoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * CRUD admin de `team_members` (Fase 4, Quiénes somos).
 *
 * No hay borrado físico: «eliminar» archiva el miembro (oculto e inactivo)
 * conservando los datos. Enlaces sociales y CV solo se guardan si son reales;
 * el formulario no inventa ningún dato.
 */
class TeamMemberController extends Controller
{
    private const CV_DISK = 'public_uploads';

    private const CV_DIRECTORY = 'team-members-cv';

    public function __construct(private readonly TeamMemberPhotoService $photos) {}

    public function index(): Response
    {
        $members = TeamMember::query()
            ->ordered()
            ->get()
            ->map(fn (TeamMember $member): array => $this->adminSummary($member))
            ->values();

        return Inertia::render('Admin/TeamMembers/Index', [
            'members' => $members,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/TeamMembers/Create', [
            'nextSortOrder' => (int) (TeamMember::max('sort_order') ?? 0) + 1,
        ]);
    }

    public function store(StoreTeamMemberRequest $request): RedirectResponse
    {
        $member = new TeamMember($this->contentAttributes($request));
        $member->save();

        $this->syncPhoto($request, $member);
        $this->syncCv($request, $member);

        return to_route('admin.team-members.index')
            ->with('toast', ['type' => 'success', 'message' => 'Miembro de equipo creado.']);
    }

    public function edit(TeamMember $teamMember): Response
    {
        return Inertia::render('Admin/TeamMembers/Edit', [
            'member' => $this->adminRecord($teamMember),
        ]);
    }

    public function update(UpdateTeamMemberRequest $request, TeamMember $teamMember): RedirectResponse
    {
        $teamMember->fill($this->contentAttributes($request));
        $teamMember->save();

        $this->syncPhoto($request, $teamMember);
        $this->syncCv($request, $teamMember);

        return to_route('admin.team-members.index')
            ->with('toast', ['type' => 'success', 'message' => 'Miembro de equipo actualizado.']);
    }

    public function destroy(TeamMember $teamMember): RedirectResponse
    {
        $teamMember->update([
            'is_visible' => false,
            'is_active' => false,
        ]);

        return to_route('admin.team-members.index')
            ->with('toast', ['type' => 'success', 'message' => 'Miembro archivado (oculto e inactivo).']);
    }

    public function toggleVisible(TeamMember $teamMember): RedirectResponse
    {
        $teamMember->update(['is_visible' => ! $teamMember->is_visible]);

        return back();
    }

    public function toggleActive(TeamMember $teamMember): RedirectResponse
    {
        $teamMember->update(['is_active' => ! $teamMember->is_active]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function contentAttributes(StoreTeamMemberRequest|UpdateTeamMemberRequest $request): array
    {
        return [
            'name' => $request->validated('name'),
            'slug' => $request->validated('slug'),
            'role' => $this->localized($request->validated('role')),
            'bio' => $this->localized($request->validated('bio')),
            'photo_alt' => $request->validated('photo_alt'),
            'linkedin_url' => $request->validated('linkedin_url'),
            'github_url' => $request->validated('github_url'),
            'personal_url' => $request->validated('personal_url'),
            'email' => $request->validated('email'),
            'sort_order' => (int) $request->validated('sort_order'),
            'is_visible' => $request->boolean('is_visible'),
            'is_active' => $request->boolean('is_active'),
        ];
    }

    private function syncPhoto(StoreTeamMemberRequest|UpdateTeamMemberRequest $request, TeamMember $member): void
    {
        if ($request->hasFile('photo')) {
            $previous = $member->photo;
            $path = $this->photos->storeFromPath($request->file('photo')->getRealPath(), $member->slug);
            $member->update(['photo' => $path]);

            if ($previous !== null && $previous !== $path) {
                $this->photos->delete($previous);
            }
        } elseif ($request->boolean('remove_photo') && $member->photo !== null) {
            $this->photos->delete($member->photo);
            $member->update(['photo' => null]);
        }
    }

    private function syncCv(StoreTeamMemberRequest|UpdateTeamMemberRequest $request, TeamMember $member): void
    {
        if ($request->hasFile('cv')) {
            $previous = $member->cv_path;
            $filename = "{$member->slug}.pdf";
            Storage::disk(self::CV_DISK)->putFileAs(self::CV_DIRECTORY, $request->file('cv'), $filename);
            $path = self::CV_DIRECTORY.'/'.$filename;
            $member->update(['cv_path' => '/uploads/'.$path]);

            if ($previous !== null && $previous !== '/uploads/'.$path) {
                $this->deleteCv($previous);
            }
        } elseif ($request->boolean('remove_cv') && $member->cv_path !== null) {
            $this->deleteCv($member->cv_path);
            $member->update(['cv_path' => null]);
        }
    }

    /**
     * Borra el PDF de CV anterior referenciado por su ruta pública
     * (`/uploads/team-members-cv/...`). Autocontenido: no depende de servicios
     * de media externos. No hace nada si la ruta es nula/vacía o no apunta al
     * directorio de CVs (p. ej. una URL externa).
     */
    private function deleteCv(?string $path): void
    {
        if ($path === null || $path === '') {
            return;
        }

        $relativePath = ltrim($path, '/');

        if (str_starts_with($relativePath, 'uploads/')) {
            $relativePath = substr($relativePath, strlen('uploads/'));
        }

        if (! str_starts_with($relativePath, self::CV_DIRECTORY.'/')) {
            return;
        }

        Storage::disk(self::CV_DISK)->delete($relativePath);
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
    private function adminSummary(TeamMember $member): array
    {
        return [
            'id' => $member->id,
            'name' => $member->name,
            'slug' => $member->slug,
            'role' => $member->role,
            'photo' => $member->photo,
            'isVisible' => $member->is_visible,
            'isActive' => $member->is_active,
            'sortOrder' => $member->sort_order,
            'updatedAt' => $member->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminRecord(TeamMember $member): array
    {
        return [
            ...$this->adminSummary($member),
            'bio' => $member->bio,
            'photoAlt' => $member->photo_alt,
            'cvPath' => $member->cv_path,
            'linkedinUrl' => $member->linkedin_url,
            'githubUrl' => $member->github_url,
            'personalUrl' => $member->personal_url,
            'email' => $member->email,
        ];
    }
}

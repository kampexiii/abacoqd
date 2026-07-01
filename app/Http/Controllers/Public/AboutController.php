<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Support\Media\ImageVariantService;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __construct(private readonly ImageVariantService $images) {}

    /**
     * Show the public Quiénes somos page.
     * docs/07_VISTAS/PUBLIC_10_QUIENES_SOMOS.md.
     *
     * Solo se listan miembros visibles y activos: si no hay ninguno, la vista
     * muestra un bloque corporativo neutro en lugar de un grid vacío.
     */
    public function index(): Response
    {
        $teamMembers = TeamMember::query()
            ->visible()
            ->active()
            ->ordered()
            ->get([
                'id',
                'name',
                'role',
                'bio',
                'photo',
                'photo_alt',
                'linkedin_url',
                'github_url',
                'personal_url',
                'cv_path',
            ]);

        return Inertia::render('Public/About', [
            'teamMembers' => $teamMembers
                ->map(fn (TeamMember $member): array => [
                    'id' => $member->id,
                    'name' => $member->name,
                    'role' => $member->role,
                    'bio' => $member->bio,
                    'photo' => $member->photo,
                    'photoAlt' => $member->photo_alt,
                    'photoVariants' => $this->images->existingVariants($member->photo, ImageVariantService::TEAM_MEMBER_WIDTHS),
                    'linkedinUrl' => $member->linkedin_url,
                    'githubUrl' => $member->github_url,
                    'personalUrl' => $member->personal_url,
                    'cvUrl' => $member->cv_path,
                ])
                ->values(),
        ]);
    }
}

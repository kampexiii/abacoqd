<?php

namespace App\Models;

use App\Enums\PermissionStatus;
use App\Enums\ProjectStatus;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

#[Fillable([
    'title',
    'slug',
    'summary',
    'description',
    'challenge',
    'solution',
    'result',
    'cover_image',
    'thumbnail_image',
    'gallery',
    'technologies',
    'status',
    'year',
    'client_name',
    'client_partner_id',
    'github_url',
    'external_url',
    'permission_status',
    'permission_notes',
    'show_on_home',
    'show_in_projects',
    'show_in_collaborations',
    'is_featured',
    'is_active',
    'sort_order',
    'settings',
])]
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Partner, $this>
     */
    public function clientPartner(): BelongsTo
    {
        return $this->belongsTo(Partner::class, 'client_partner_id');
    }

    /**
     * @return BelongsToMany<Partner, $this>
     */
    public function partners(): BelongsToMany
    {
        return $this->belongsToMany(Partner::class)
            ->withPivot(['role', 'sort_order'])
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    /**
     * @return HasMany<Review, $this>
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * @return MorphMany<SeoMetadata, $this>
     */
    public function seoMetadata(): MorphMany
    {
        return $this->morphMany(SeoMetadata::class, 'seoable');
    }

    public function seoMetadataFor(string $locale): ?SeoMetadata
    {
        return $this->seoMetadata->firstWhere('locale', $locale);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'title' => 'array',
            'slug' => 'array',
            'summary' => 'array',
            'description' => 'array',
            'challenge' => 'array',
            'solution' => 'array',
            'result' => 'array',
            'gallery' => 'array',
            'technologies' => 'array',
            'status' => ProjectStatus::class,
            'permission_status' => PermissionStatus::class,
            'show_on_home' => 'boolean',
            'show_in_projects' => 'boolean',
            'show_in_collaborations' => 'boolean',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'settings' => 'array',
        ];
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeCollaborations(Builder $query): void
    {
        $query->where('show_in_collaborations', true);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeFeatured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeHome(Builder $query): void
    {
        $query->where('show_on_home', true);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderByDesc('year')->orderBy('id');
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopePermitted(Builder $query): void
    {
        $query->where('permission_status', PermissionStatus::Approved->value);
    }

    /**
     * Publicable de cara al sitio: aprobado siempre; fuera de producción
     * también los marcados con `settings.show_in_local_preview` (históricos
     * en validación). Centraliza el gating de previsualización.
     *
     * @param  Builder<self>  $query
     */
    public function scopePubliclyListable(Builder $query): void
    {
        $query->where(function (Builder $inner): void {
            $inner->where('permission_status', PermissionStatus::Approved->value);

            if (! app()->isProduction()) {
                $inner->orWhere('settings->show_in_local_preview', true);
            }
        });
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeProjects(Builder $query): void
    {
        $query->where('show_in_projects', true);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', ProjectStatus::Published->value);
    }
}

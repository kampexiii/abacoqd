<?php

namespace App\Models;

use App\Enums\PartnerType;
use App\Enums\PermissionStatus;
use Database\Factories\PartnerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'slug',
    'type',
    'logo',
    'logo_dark',
    'logo_alt',
    'website',
    'social_links',
    'description',
    'permission_status',
    'permission_notes',
    'show_on_home',
    'show_in_collaborations',
    'show_in_projects',
    'is_featured',
    'is_active',
    'sort_order',
    'settings',
])]
class Partner extends Model
{
    /** @use HasFactory<PartnerFactory> */
    use HasFactory;

    /**
     * @return BelongsToMany<Project, $this>
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class)
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
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => PartnerType::class,
            'description' => 'array',
            'social_links' => 'array',
            'permission_status' => PermissionStatus::class,
            'show_on_home' => 'boolean',
            'show_in_collaborations' => 'boolean',
            'show_in_projects' => 'boolean',
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
        $query->orderBy('sort_order')->orderBy('name');
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
}

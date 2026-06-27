<?php

namespace App\Models;

use App\Enums\ServiceStatus;
use Database\Factories\ServiceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * @property string|null $slug_es Columna generada (`virtualAsJson`) a partir de `slug->es`.
 * @property string|null $slug_en Columna generada (`virtualAsJson`) a partir de `slug->en`.
 */
#[Fillable([
    'title',
    'slug',
    'summary',
    'description',
    'icon',
    'image',
    'cta',
    'status',
    'sort_order',
    'is_featured',
    'is_active',
    'show_on_home',
    'is_detail_enabled',
    'settings',
])]
class Service extends Model
{
    /** @use HasFactory<ServiceFactory> */
    use HasFactory;

    public const MAX_FEATURED_ON_HOME = 3;

    /**
     * @return HasMany<ContactMessage, $this>
     */
    public function contactMessages(): HasMany
    {
        return $this->hasMany(ContactMessage::class);
    }

    /**
     * Proyectos que aplican este servicio/capacidad.
     *
     * @return BelongsToMany<Project, $this>
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class)
            ->withPivot('sort_order')
            ->withTimestamps();
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
            'cta' => 'array',
            'status' => ServiceStatus::class,
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
            'is_detail_enabled' => 'boolean',
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
    public function scopePublished(Builder $query): void
    {
        $query->where('status', ServiceStatus::Published->value);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeDetailEnabled(Builder $query): void
    {
        $query->where('is_detail_enabled', true);
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
        $query->orderBy('sort_order')->orderBy('id');
    }
}

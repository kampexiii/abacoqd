<?php

namespace App\Models;

use Database\Factories\PageSectionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $page
 * @property string $key
 * @property array<string, string>|null $title
 * @property array<string, string>|null $subtitle
 * @property bool $is_active
 * @property bool $show_on_home
 */
#[Fillable([
    'page',
    'key',
    'name',
    'title',
    'subtitle',
    'content',
    'cta',
    'media_path',
    'icon',
    'sort_order',
    'is_active',
    'show_on_home',
    'settings',
])]
class PageSection extends Model
{
    /** @use HasFactory<PageSectionFactory> */
    use HasFactory;

    /**
     * @return HasMany<SectionBlock, $this>
     */
    public function blocks(): HasMany
    {
        return $this->hasMany(SectionBlock::class)->orderBy('sort_order');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'title' => 'array',
            'subtitle' => 'array',
            'content' => 'array',
            'cta' => 'array',
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
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

    /**
     * @param  Builder<self>  $query
     */
    public function scopePage(Builder $query, string $page): void
    {
        $query->where('page', $page);
    }
}

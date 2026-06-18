<?php

namespace App\Models;

use Database\Factories\SectionBlockFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'page_section_id',
    'type',
    'title',
    'content',
    'image',
    'icon',
    'cta',
    'sort_order',
    'is_active',
    'settings',
])]
class SectionBlock extends Model
{
    /** @use HasFactory<SectionBlockFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<PageSection, $this>
     */
    public function pageSection(): BelongsTo
    {
        return $this->belongsTo(PageSection::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'title' => 'array',
            'content' => 'array',
            'cta' => 'array',
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
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('id');
    }
}

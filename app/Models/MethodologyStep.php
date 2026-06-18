<?php

namespace App\Models;

use Database\Factories\MethodologyStepFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'number',
    'title',
    'slug',
    'summary',
    'description',
    'deliverable',
    'icon',
    'badge',
    'is_free_initial_study',
    'is_featured',
    'sort_order',
    'is_active',
    'settings',
])]
class MethodologyStep extends Model
{
    /** @use HasFactory<MethodologyStepFactory> */
    use HasFactory;

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
            'deliverable' => 'array',
            'is_free_initial_study' => 'boolean',
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
    public function scopeFeatured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeFreeInitialStudy(Builder $query): void
    {
        $query->where('is_free_initial_study', true);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('number');
    }
}

<?php

namespace App\Models;

use Database\Factories\SeoMetadataFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[Fillable([
    'seoable_type',
    'seoable_id',
    'page_key',
    'locale',
    'title',
    'description',
    'canonical_url',
    'robots',
    'og_title',
    'og_description',
    'og_image',
    'schema_type',
    'schema_data',
])]
class SeoMetadata extends Model
{
    /** @use HasFactory<SeoMetadataFactory> */
    use HasFactory;

    /**
     * @return MorphTo<Model, $this>
     */
    public function seoable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'schema_data' => 'array',
        ];
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeLocale(Builder $query, string $locale): void
    {
        $query->where('locale', $locale);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopePage(Builder $query, string $pageKey): void
    {
        $query->where('page_key', $pageKey);
    }
}

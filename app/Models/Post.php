<?php

namespace App\Models;

use App\Enums\PostStatus;
use Database\Factories\PostFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'post_category_id',
    'user_id',
    'title',
    'slug',
    'excerpt',
    'content',
    'featured_image',
    'status',
    'published_at',
    'is_featured',
    'featured_order',
    'show_on_home',
    'reading_time',
    'settings',
])]
class Post extends Model
{
    /** @use HasFactory<PostFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return BelongsTo<PostCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(PostCategory::class, 'post_category_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsToMany<Tag, $this>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
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
            'excerpt' => 'array',
            'content' => 'array',
            'status' => PostStatus::class,
            'published_at' => 'datetime',
            'is_featured' => 'boolean',
            'show_on_home' => 'boolean',
            'settings' => 'array',
        ];
    }

    /**
     * Único post destacado. No se ordena por `featured_order` (no se usa: solo
     * puede haber un destacado, así que no hay orden que mantener).
     *
     * @param  Builder<self>  $query
     */
    public function scopeFeatured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    /**
     * Posts visibles en público: estado `Published` y con fecha asignada.
     *
     * No se aplica la compuerta `published_at <= now()`. Hacerlo ocultaba un
     * post recién publicado durante horas: el editor elige la fecha en su hora
     * local (p. ej. España, UTC+2) y el `datetime-local` se guardaba como si
     * fuera UTC, quedando `published_at` por delante de `now()` (UTC) hasta que
     * pasaba el desfase. La programación real se modela con el estado
     * `Scheduled` (oculto hasta que un editor lo pasa a `Published`), no con una
     * fecha futura sobre un post ya marcado como publicado. `published_at` se
     * conserva para ordenar y para la fecha pública.
     *
     * @param  Builder<self>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', PostStatus::Published->value)
            ->whereNotNull('published_at');
    }

    /**
     * Búsqueda simple por coincidencia en título, extracto o contenido
     * (ambos locales a la vez, ya que son columnas JSON `{es, en}`).
     *
     * @param  Builder<self>  $query
     */
    public function scopeSearch(Builder $query, string $term): void
    {
        $like = '%'.$term.'%';

        $query->where(function (Builder $query) use ($like): void {
            $query->where('title', 'like', $like)
                ->orWhere('excerpt', 'like', $like)
                ->orWhere('content', 'like', $like);
        });
    }
}

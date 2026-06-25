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
     * Posts visibles en público. Compuerta única para /blog, /blog/{slug},
     * la landing y el sitemap, para que nunca diverjan.
     *
     * Es visible:
     * - `Published` con fecha asignada (se publica al guardar; sin compuerta
     *   temporal, igual que antes).
     * - `Scheduled` con `published_at <= now()`: un post programado se hace
     *   visible solo cuando llega su hora, sin cron ni cambio manual a
     *   `Published`. El futuro (`published_at > now()`) sigue oculto.
     *
     * La compuerta `published_at <= now()` es segura porque la app trabaja en
     * `Europe/Madrid` (config/app.php, .env, phpunit.xml): el `datetime-local`
     * que elige el editor y `now()` están en la misma zona. El antiguo desfase
     * (fecha guardada como UTC frente a `now()` UTC) ya no aplica.
     *
     * Quedan fuera: `Draft`, `Scheduled` futuro, `Hidden`, soft-deleted y, en
     * ambos casos, posts sin `published_at`. `published_at` se conserva además
     * para ordenar y para la fecha pública.
     *
     * @param  Builder<self>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where(function (Builder $query): void {
            $query->where(function (Builder $query): void {
                $query->where('status', PostStatus::Published->value)
                    ->whereNotNull('published_at');
            })->orWhere(function (Builder $query): void {
                $query->where('status', PostStatus::Scheduled->value)
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
            });
        });
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

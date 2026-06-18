<?php

namespace App\Models;

use App\Enums\SubscriberStatus;
use Database\Factories\BlogSubscriberFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'email',
    'name',
    'locale',
    'status',
    'consent_accepted_at',
    'confirmation_token',
    'confirmed_at',
    'unsubscribed_at',
    'source',
    'consent_ip',
])]
class BlogSubscriber extends Model
{
    /** @use HasFactory<BlogSubscriberFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => SubscriberStatus::class,
            'consent_accepted_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'unsubscribed_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeConfirmed(Builder $query): void
    {
        $query->where('status', SubscriberStatus::Confirmed->value);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeLocale(Builder $query, string $locale): void
    {
        $query->where('locale', $locale);
    }
}

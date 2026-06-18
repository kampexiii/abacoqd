<?php

namespace App\Models;

use Database\Factories\AppointmentDayFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'date',
    'title',
    'notes',
    'is_available',
    'max_bookings',
    'admin_blocked',
    'block_reason',
    'sort_order',
])]
class AppointmentDay extends Model
{
    /** @use HasFactory<AppointmentDayFactory> */
    use HasFactory;

    /**
     * @return HasMany<AppointmentSlot, $this>
     */
    public function slots(): HasMany
    {
        return $this->hasMany(AppointmentSlot::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'is_available' => 'boolean',
            'admin_blocked' => 'boolean',
        ];
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeAvailable(Builder $query): void
    {
        $query->where('is_available', true)
            ->where('admin_blocked', false)
            ->whereDate('date', '>=', now()->toDateString());
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('date')->orderBy('sort_order');
    }
}

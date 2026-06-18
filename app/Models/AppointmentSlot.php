<?php

namespace App\Models;

use App\Enums\AppointmentSlotStatus;
use Database\Factories\AppointmentSlotFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'appointment_day_id',
    'starts_at',
    'ends_at',
    'duration_minutes',
    'status',
    'admin_blocked',
    'block_reason',
    'capacity',
    'reserved_count',
    'notes',
])]
class AppointmentSlot extends Model
{
    /** @use HasFactory<AppointmentSlotFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<AppointmentDay, $this>
     */
    public function day(): BelongsTo
    {
        return $this->belongsTo(AppointmentDay::class, 'appointment_day_id');
    }

    /**
     * @return HasMany<AppointmentBooking, $this>
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(AppointmentBooking::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'status' => AppointmentSlotStatus::class,
            'admin_blocked' => 'boolean',
        ];
    }

    public function isBookable(): bool
    {
        return $this->status === AppointmentSlotStatus::Available
            && ! $this->admin_blocked
            && $this->reserved_count < $this->capacity
            && $this->starts_at->isFuture();
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeAvailable(Builder $query): void
    {
        $query->where('status', AppointmentSlotStatus::Available->value)
            ->where('admin_blocked', false)
            ->whereColumn('reserved_count', '<', 'capacity')
            ->where('starts_at', '>', now());
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('starts_at');
    }
}

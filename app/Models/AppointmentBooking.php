<?php

namespace App\Models;

use App\Enums\AppointmentBookingStatus;
use Database\Factories\AppointmentBookingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'appointment_slot_id',
    'service_id',
    'name',
    'company',
    'email',
    'phone',
    'message',
    'status',
    'cancellation_token',
    'cancelled_at',
    'privacy_consent_accepted_at',
    'marketing_consent_accepted_at',
    'ip_address',
    'user_agent',
    'admin_notes',
])]
class AppointmentBooking extends Model
{
    /** @use HasFactory<AppointmentBookingFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (self $booking): void {
            $booking->cancellation_token ??= Str::random(40);
        });
    }

    /**
     * @return BelongsTo<AppointmentSlot, $this>
     */
    public function slot(): BelongsTo
    {
        return $this->belongsTo(AppointmentSlot::class, 'appointment_slot_id');
    }

    /**
     * @return BelongsTo<Service, $this>
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => AppointmentBookingStatus::class,
            'cancelled_at' => 'datetime',
            'privacy_consent_accepted_at' => 'datetime',
            'marketing_consent_accepted_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->whereNotIn('status', [
            AppointmentBookingStatus::Cancelled->value,
            AppointmentBookingStatus::NoShow->value,
        ]);
    }
}

<?php

namespace App\Models;

use App\Enums\ContactMessageStatus;
use Database\Factories\ContactMessageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'service_id',
    'name',
    'email',
    'phone',
    'company',
    'subject',
    'message',
    'preferred_contact_method',
    'privacy_accepted_at',
    'commercial_consent',
    'commercial_consent_at',
    'source',
    'status',
    'ip_address',
    'user_agent',
    'metadata',
])]
class ContactMessage extends Model
{
    /** @use HasFactory<ContactMessageFactory> */
    use HasFactory;

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
            'privacy_accepted_at' => 'datetime',
            'commercial_consent' => 'boolean',
            'commercial_consent_at' => 'datetime',
            'status' => ContactMessageStatus::class,
            'metadata' => 'array',
        ];
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeArchived(Builder $query): void
    {
        $query->where('status', ContactMessageStatus::Archived->value);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeNewMessages(Builder $query): void
    {
        $query->where('status', ContactMessageStatus::New->value);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeRead(Builder $query): void
    {
        $query->where('status', ContactMessageStatus::Read->value);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeReplied(Builder $query): void
    {
        $query->where('status', ContactMessageStatus::Replied->value);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeStatus(Builder $query, ContactMessageStatus|string $status): void
    {
        $query->where('status', $status instanceof ContactMessageStatus ? $status->value : $status);
    }
}

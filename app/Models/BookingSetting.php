<?php

namespace App\Models;

use Database\Factories\BookingSettingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['provider', 'url', 'is_enabled', 'fallback_to_contact', 'settings'])]
class BookingSetting extends Model
{
    /** @use HasFactory<BookingSettingFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
            'fallback_to_contact' => 'boolean',
            'settings' => 'array',
        ];
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeEnabled(Builder $query): void
    {
        $query->where('is_enabled', true);
    }
}

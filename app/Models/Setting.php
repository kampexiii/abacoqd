<?php

namespace App\Models;

use Database\Factories\SettingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $group
 * @property string $key
 * @property mixed $value
 * @property string $type
 * @property bool $is_public
 */
#[Fillable(['group', 'key', 'value', 'type', 'is_public', 'description'])]
class Setting extends Model
{
    /** @use HasFactory<SettingFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'value' => 'array',
            'is_public' => 'boolean',
        ];
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeGroup(Builder $query, string $group): void
    {
        $query->where('group', $group);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopePublic(Builder $query): void
    {
        $query->where('is_public', true);
    }
}

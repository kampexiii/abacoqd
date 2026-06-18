<?php

namespace App\Models;

use Database\Factories\FaqFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'question',
    'answer',
    'category',
    'intent',
    'redirect_url',
    'redirect_section',
    'show_in_chatbot',
    'show_on_page',
    'sort_order',
    'is_active',
])]
class Faq extends Model
{
    /** @use HasFactory<FaqFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'question' => 'array',
            'answer' => 'array',
            'show_in_chatbot' => 'boolean',
            'show_on_page' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeCategory(Builder $query, string $category): void
    {
        $query->where('category', $category);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeChatbot(Builder $query): void
    {
        $query->where('show_in_chatbot', true);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('id');
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopePage(Builder $query): void
    {
        $query->where('show_on_page', true);
    }
}

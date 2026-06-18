<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add generated columns extracting a locale from a JSON slug column,
     * so each locale can be enforced unique at the database level.
     */
    private function addLocalizedSlugColumns(Blueprint $table): void
    {
        foreach (['es', 'en'] as $locale) {
            $column = $table->string("slug_{$locale}", 255)->nullable();
            $column['virtualAsJson'] = "slug->{$locale}";
        }

        $table->unique('slug_es');
        $table->unique('slug_en');
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('methodology_steps', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('number')->index();
            $table->json('title');
            $table->json('slug')->nullable();
            $table->json('summary')->nullable();
            $table->json('description')->nullable();
            $table->json('deliverable')->nullable();
            $table->string('icon')->nullable();
            $table->string('badge')->nullable();
            $table->boolean('is_free_initial_study')->default(false)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->unsignedSmallInteger('sort_order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->json('settings')->nullable();
            $table->timestamps();

            $this->addLocalizedSlugColumns($table);
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->json('title');
            $table->json('slug')->nullable();
            $table->json('summary')->nullable();
            $table->json('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('image')->nullable();
            $table->json('cta')->nullable();
            $table->string('status')->default('draft')->index();
            $table->unsignedSmallInteger('sort_order')->default(0)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('show_on_home')->default(true)->index();
            $table->boolean('is_detail_enabled')->default(false)->index();
            $table->json('settings')->nullable();
            $table->timestamps();

            $this->addLocalizedSlugColumns($table);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
        Schema::dropIfExists('methodology_steps');
    }
};

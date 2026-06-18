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
        Schema::create('post_categories', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('slug')->nullable();
            $table->json('description')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();

            $this->addLocalizedSlugColumns($table);
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('slug')->nullable();
            $table->timestamps();

            $this->addLocalizedSlugColumns($table);
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->json('title');
            $table->json('slug')->nullable();
            $table->json('excerpt')->nullable();
            $table->json('content')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('status')->default('draft')->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->unsignedTinyInteger('featured_order')->nullable()->index();
            $table->boolean('show_on_home')->default(false)->index();
            $table->unsignedSmallInteger('reading_time')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $this->addLocalizedSlugColumns($table);
        });

        Schema::create('post_tag', function (Blueprint $table) {
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->primary(['post_id', 'tag_id']);
        });

        Schema::create('blog_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->string('locale', 5)->default('es')->index();
            $table->string('status')->default('pending')->index();
            $table->timestamp('consent_accepted_at')->nullable();
            $table->string('confirmation_token')->nullable()->unique();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->string('source')->nullable();
            $table->string('consent_ip', 45)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_subscribers');
        Schema::dropIfExists('post_tag');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('post_categories');
    }
};

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
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('type')->default('other')->index();
            $table->string('logo')->nullable();
            $table->string('logo_dark')->nullable();
            $table->string('logo_alt')->nullable();
            $table->string('website')->nullable();
            $table->json('social_links')->nullable();
            $table->json('description')->nullable();
            $table->string('permission_status')->default('pending')->index();
            $table->text('permission_notes')->nullable();
            $table->boolean('show_on_home')->default(false)->index();
            $table->boolean('show_in_collaborations')->default(false)->index();
            $table->boolean('show_in_projects')->default(false)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_active')->default(false)->index();
            $table->unsignedSmallInteger('sort_order')->default(0)->index();
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->json('title');
            $table->json('slug')->nullable();
            $table->json('summary')->nullable();
            $table->json('description')->nullable();
            $table->json('challenge')->nullable();
            $table->json('solution')->nullable();
            $table->json('result')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('thumbnail_image')->nullable();
            $table->json('gallery')->nullable();
            $table->json('technologies')->nullable();
            $table->string('status')->default('draft')->index();
            $table->unsignedSmallInteger('year')->nullable()->index();
            $table->string('client_name')->nullable();
            $table->foreignId('client_partner_id')->nullable()->constrained('partners')->nullOnDelete();
            $table->string('github_url')->nullable();
            $table->string('external_url')->nullable();
            $table->string('permission_status')->default('pending')->index();
            $table->text('permission_notes')->nullable();
            $table->boolean('show_on_home')->default(false)->index();
            $table->boolean('show_in_projects')->default(false)->index();
            $table->boolean('show_in_collaborations')->default(false)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_active')->default(false)->index();
            $table->unsignedSmallInteger('sort_order')->default(0)->index();
            $table->json('settings')->nullable();
            $table->timestamps();

            $this->addLocalizedSlugColumns($table);
        });

        Schema::create('partner_project', function (Blueprint $table) {
            $table->foreignId('partner_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('other')->index();
            $table->unsignedSmallInteger('sort_order')->default(0)->index();
            $table->timestamps();

            $table->primary(['partner_id', 'project_id']);
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->string('author_name');
            $table->string('author_role')->nullable();
            $table->string('company_name')->nullable();
            $table->json('content');
            $table->unsignedTinyInteger('rating')->nullable();
            $table->string('source')->nullable();
            $table->string('source_url')->nullable();
            $table->string('permission_status')->default('pending')->index();
            $table->text('permission_notes')->nullable();
            $table->boolean('show_on_home')->default(false)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_active')->default(false)->index();
            $table->unsignedSmallInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('partner_project');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('partners');
    }
};

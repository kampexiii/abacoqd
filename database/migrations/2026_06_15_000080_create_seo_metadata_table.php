<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('seo_metadata', function (Blueprint $table) {
            $table->id();
            $table->nullableMorphs('seoable');
            $table->string('page_key')->nullable()->index();
            $table->string('locale', 5)->index();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('robots')->default('index,follow')->index();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('schema_type')->nullable();
            $table->json('schema_data')->nullable();
            $table->timestamps();

            $table->unique(['seoable_type', 'seoable_id', 'locale'], 'seo_metadata_seoable_locale_unique');
            $table->unique(['page_key', 'locale'], 'seo_metadata_page_locale_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seo_metadata');
    }
};

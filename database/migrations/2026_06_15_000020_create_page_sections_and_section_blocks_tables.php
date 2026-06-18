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
        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->string('page')->index();
            $table->string('key')->index();
            $table->string('name')->nullable();
            $table->json('title')->nullable();
            $table->json('subtitle')->nullable();
            $table->json('content')->nullable();
            $table->json('cta')->nullable();
            $table->string('media_path')->nullable();
            $table->string('icon')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('show_on_home')->default(false)->index();
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->unique(['page', 'key']);
        });

        Schema::create('section_blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_section_id')->constrained()->cascadeOnDelete();
            $table->string('type')->index();
            $table->json('title')->nullable();
            $table->json('content')->nullable();
            $table->string('image')->nullable();
            $table->string('icon')->nullable();
            $table->json('cta')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->json('settings')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('section_blocks');
        Schema::dropIfExists('page_sections');
    }
};

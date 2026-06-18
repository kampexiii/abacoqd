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
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->string('preferred_contact_method')->nullable();
            $table->timestamp('privacy_accepted_at')->nullable();
            $table->boolean('commercial_consent')->default(false)->index();
            $table->timestamp('commercial_consent_at')->nullable();
            $table->string('source')->nullable()->index();
            $table->string('status')->default('new')->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('booking_settings', function (Blueprint $table) {
            $table->id();
            $table->string('provider')->nullable()->index();
            $table->string('url')->nullable();
            $table->boolean('is_enabled')->default(false)->index();
            $table->boolean('fallback_to_contact')->default(true);
            $table->json('settings')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_settings');
        Schema::dropIfExists('contact_messages');
    }
};

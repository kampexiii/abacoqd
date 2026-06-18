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
        Schema::create('appointment_days', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();
            $table->string('title')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_available')->default(true)->index();
            $table->unsignedSmallInteger('max_bookings')->nullable();
            $table->boolean('admin_blocked')->default(false)->index();
            $table->string('block_reason')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('appointment_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_day_id')->constrained()->cascadeOnDelete();
            $table->dateTime('starts_at')->index();
            $table->dateTime('ends_at');
            $table->unsignedSmallInteger('duration_minutes')->default(120);
            $table->string('status')->default('available')->index();
            $table->boolean('admin_blocked')->default(false)->index();
            $table->string('block_reason')->nullable();
            $table->unsignedSmallInteger('capacity')->default(1);
            $table->unsignedSmallInteger('reserved_count')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('appointment_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_slot_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('pending')->index();
            $table->string('cancellation_token')->unique();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('privacy_consent_accepted_at');
            $table->timestamp('marketing_consent_accepted_at')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_bookings');
        Schema::dropIfExists('appointment_slots');
        Schema::dropIfExists('appointment_days');
    }
};

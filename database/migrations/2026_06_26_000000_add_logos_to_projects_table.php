<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Logo del cliente/empresa por proyecto (color + monocromo), espejo de los
 * campos de `partners`. Migración aditiva: no elimina ni renombra columnas
 * existentes (`cover_image`, `thumbnail_image`, `gallery` se conservan).
 *
 * - `logo`: versión color (modo claro).
 * - `logo_dark`: versión monocroma/adaptada (modo oscuro).
 * - `logo_alt`: texto alternativo del logo.
 *
 * Solo se guarda la ruta pública (`/uploads/projects/...`), nunca el binario.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('logo')->nullable()->after('gallery');
            $table->string('logo_dark')->nullable()->after('logo');
            $table->string('logo_alt')->nullable()->after('logo_dark');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['logo', 'logo_dark', 'logo_alt']);
        });
    }
};

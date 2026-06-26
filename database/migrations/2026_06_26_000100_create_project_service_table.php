<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Relación muchos-a-muchos entre `projects` y `services`: un proyecto declara
 * las capacidades/servicios reales aplicados, elegidos desde `services` (no
 * texto libre). Aditiva; no toca columnas existentes.
 *
 * - Si se borra el proyecto, se limpian sus relaciones (cascade).
 * - Si se borra el servicio, se limpia la relación sin romper el proyecto
 *   (cascade sobre la fila pivote, el proyecto sigue existiendo).
 * - En la práctica los servicios se desactivan, no se borran; un servicio
 *   inactivo asociado se sigue conservando aquí y se marca como tal en admin.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_service', function (Blueprint $table) {
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->primary(['project_id', 'service_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_service');
    }
};

<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ServiceStatus;
use App\Http\Controllers\Controller;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Dashboard admin: accesos rápidos + contadores simples reales.
 *
 * No es analítica: solo recuentos básicos de `services` (lo único cableado en
 * este bloque). El resto de módulos se muestran como accesos pendientes.
 */
class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'serviceStats' => [
                'published' => Service::query()->where('status', ServiceStatus::Published)->count(),
                'draft' => Service::query()->where('status', ServiceStatus::Draft)->count(),
                'hidden' => Service::query()->where('status', ServiceStatus::Hidden)->count(),
            ],
        ]);
    }
}

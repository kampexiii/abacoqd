<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Support\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Ajustes globales del sitio (acotados): datos de contacto, redes, Google
 * Reviews, dominios y receptor de formularios. Fuente editable = grupo `site`
 * de `settings`; los componentes públicos solo consumen estos datos vía la prop
 * compartida `siteSettings`. No es un CMS: SEO avanzado, legales editables,
 * cookies, analítica y scripts NO se gestionan aquí.
 */
class SettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Settings/Edit', [
            'settings' => SiteSettings::editable(),
        ]);
    }

    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        SiteSettings::persist($request->validated());

        return back()->with('toast', ['type' => 'success', 'message' => 'Ajustes del sitio guardados.']);
    }
}

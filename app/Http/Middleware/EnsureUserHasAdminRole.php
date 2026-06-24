<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Restringe el panel admin a roles de gestión de contenido.
 *
 * El acceso de lectura para `viewer` queda fuera de este primer bloque:
 * por ahora solo `super_admin`, `admin` y `editor` entran al admin. Esta
 * es solo la puerta de entrada a `/admin`; las restricciones finas por
 * módulo (usuarios, contactos/PII, reservas, settings) las aplica
 * `EnsureUserHasRole` (alias `role`) en routes/web.php.
 */
class EnsureUserHasAdminRole
{
    /**
     * @var list<UserRole>
     */
    private const ALLOWED_ROLES = [
        UserRole::SuperAdmin,
        UserRole::Admin,
        UserRole::Editor,
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        abort_unless(
            $user !== null && in_array($user->role, self::ALLOWED_ROLES, true),
            403,
        );

        return $next($request);
    }
}

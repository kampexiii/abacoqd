<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Restringe una ruta a un subconjunto de roles, por encima de la puerta
 * general `admin`. Uso: ->middleware('role:super_admin,admin').
 */
class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        $allowedRoles = array_map(fn (string $role): UserRole => UserRole::from($role), $roles);

        abort_unless(
            $user !== null && in_array($user->role, $allowedRoles, true),
            403,
        );

        return $next($request);
    }
}

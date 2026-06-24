<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * CRUD admin de usuarios/roles (Fase 4). Acceso restringido a super_admin
 * (ver UserRequest::authorize()). No hay borrado de la última cuenta
 * super_admin ni autopromoción a super_admin desde el propio formulario.
 */
class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim($request->string('q')->toString());

        $users = User::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $user): array => $this->adminSummary($user));

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $this->roleOptions(),
            'filters' => $request->only(['q']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => $this->roleOptions(),
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $temporaryPassword = Str::password(14);

        User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'role' => $request->validated('role'),
            'password' => Hash::make($temporaryPassword),
            'email_verified_at' => now(),
        ]);

        return to_route('admin.users.index')->with('toast', [
            'type' => 'success',
            'message' => "Usuario creado. Contraseña temporal: {$temporaryPassword}",
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $this->adminSummary($user),
            'roles' => $this->roleOptions(),
            'isSelf' => $user->is(request()->user()),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $authUser = $request->user();
        $newRole = UserRole::from($request->validated('role'));

        if ($authUser !== null && $user->is($authUser) && $authUser->role === UserRole::SuperAdmin && $newRole !== UserRole::SuperAdmin) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'No puedes quitarte a ti mismo el rol de super_admin.',
            ]);
        }

        if ($user->role === UserRole::SuperAdmin && $newRole !== UserRole::SuperAdmin && $this->isLastSuperAdmin($user)) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'No puedes quitar el rol de super_admin al último usuario con ese rol.',
            ]);
        }

        $user->update([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'role' => $newRole,
        ]);

        return to_route('admin.users.index')
            ->with('toast', ['type' => 'success', 'message' => 'Usuario actualizado.']);
    }

    public function destroy(User $user): RedirectResponse
    {
        $authUser = request()->user();

        if ($authUser !== null && $user->is($authUser)) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'No puedes eliminar tu propia cuenta.',
            ]);
        }

        if ($user->role === UserRole::SuperAdmin && $this->isLastSuperAdmin($user)) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'No puedes eliminar al último usuario super_admin.',
            ]);
        }

        $user->delete();

        return to_route('admin.users.index')
            ->with('toast', ['type' => 'success', 'message' => 'Usuario eliminado.']);
    }

    public function resetPassword(User $user): RedirectResponse
    {
        $temporaryPassword = Str::password(14);

        $user->update(['password' => Hash::make($temporaryPassword)]);

        return back()->with('toast', [
            'type' => 'success',
            'message' => "Contraseña temporal generada: {$temporaryPassword}",
        ]);
    }

    private function isLastSuperAdmin(User $user): bool
    {
        return User::query()
            ->where('role', UserRole::SuperAdmin)
            ->where('id', '!=', $user->id)
            ->doesntExist();
    }

    /**
     * @return array<string, mixed>
     */
    private function adminSummary(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role->value,
            'createdAt' => $user->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function roleOptions(): array
    {
        return [
            ['value' => UserRole::SuperAdmin->value, 'label' => 'Super Admin'],
            ['value' => UserRole::Admin->value, 'label' => 'Admin'],
            ['value' => UserRole::Editor->value, 'label' => 'Editor'],
            ['value' => UserRole::Viewer->value, 'label' => 'Viewer'],
        ];
    }
}

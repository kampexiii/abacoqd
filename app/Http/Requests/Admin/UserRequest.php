<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && $user->role === UserRole::SuperAdmin;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $route = $this->route('user');
        $userId = $route instanceof User ? $route->id : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'role' => ['required', Rule::enum(UserRole::class)],
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
        ];
    }
}

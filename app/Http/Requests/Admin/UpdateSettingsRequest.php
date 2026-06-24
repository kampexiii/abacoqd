<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Ajustes del sitio: solo SuperAdmin/Admin pueden modificarlos (afectan a datos
 * de contacto/marca públicos). La ruta de edición también está restringida a
 * estos roles a nivel de middleware (ver routes/web.php).
 */
class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && in_array($user->role, [UserRole::SuperAdmin, UserRole::Admin], true);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'contact_email' => ['nullable', 'email', 'max:180'],
            'contact_phone' => ['nullable', 'string', 'max:40'],
            'contact_whatsapp' => ['nullable', 'string', 'max:40'],
            'contact_address' => ['nullable', 'string', 'max:255'],
            'contact_city_country' => ['nullable', 'string', 'max:120'],
            'form_recipient_email' => ['nullable', 'email', 'max:180'],
            'social_linkedin' => ['nullable', 'url', 'max:2048'],
            'social_facebook' => ['nullable', 'url', 'max:2048'],
            'google_reviews_url' => ['nullable', 'url', 'max:2048'],
            'google_reviews_rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'google_reviews_count' => ['nullable', 'integer', 'min:0'],
            'footer_text' => ['nullable', 'string', 'max:255'],
            'canonical_domain' => ['nullable', 'url', 'max:2048'],
            'previous_domain' => ['nullable', 'url', 'max:2048'],
        ];
    }
}

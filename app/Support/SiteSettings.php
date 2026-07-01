<?php

namespace App\Support;

use App\Models\Setting;
use Throwable;

/**
 * Lectura/escritura centralizada de los ajustes del sitio editables desde el
 * admin (grupo `site` de `settings`), con fallback a `config/site.php`.
 *
 * Es la única fuente para el footer, la prueba social y el receptor de los
 * formularios públicos: los componentes solo consumen estos datos (no definen
 * URLs/rating/count inline). DB editable > config/env como fallback.
 */
class SiteSettings
{
    /**
     * Map clave => valor del grupo `site`. Vacío si la tabla aún no existe
     * (p. ej. durante migraciones) o no hay overrides guardados.
     *
     * @return array<string, mixed>
     */
    private static function overrides(): array
    {
        try {
            return Setting::query()->where('group', 'site')->pluck('value', 'key')->all();
        } catch (Throwable) {
            return [];
        }
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private static function value(array $overrides, string $key, mixed $fallback): mixed
    {
        $value = $overrides[$key] ?? null;

        return ($value === null || $value === '') ? $fallback : $value;
    }

    /**
     * Datos públicos expuestos a React vía Inertia (`siteSettings`).
     *
     * @return array<string, mixed>
     */
    public static function shared(): array
    {
        $o = self::overrides();
        $rating = self::value($o, 'google_reviews_rating', config('site.google_reviews.rating'));
        $count = self::value($o, 'google_reviews_count', config('site.google_reviews.count'));

        return [
            'contact' => [
                'email' => self::value($o, 'contact_email', config('site.contact.email')),
                'phone' => self::value($o, 'contact_phone', config('site.contact.phone')),
                'whatsapp' => self::value($o, 'contact_whatsapp', config('site.contact.whatsapp')),
                'address' => self::value($o, 'contact_address', config('site.contact.address')),
                'cityCountry' => self::value($o, 'contact_city_country', config('site.contact.city_country')),
            ],
            'social' => [
                'linkedin' => self::value($o, 'social_linkedin', config('site.social.linkedin')),
                'facebook' => self::value($o, 'social_facebook', config('site.social.facebook')),
            ],
            'googleReviews' => [
                'url' => self::value($o, 'google_reviews_url', config('site.google_reviews.url')),
                'rating' => is_numeric($rating) ? (float) $rating : null,
                'count' => is_numeric($count) ? (int) $count : null,
                'location' => config('site.google_reviews.location'),
            ],
            // `footer_text` sigue siendo editable/persistible desde el admin
            // (ver editable()), pero no se expone en el payload público porque
            // ninguna vista pública lo consume: exponerlo solo añadía un
            // `footer.text: null` inerte al JSON de props.
        ];
    }

    /**
     * Valores planos para el formulario admin (DB override o fallback config).
     *
     * @return array<string, mixed>
     */
    public static function editable(): array
    {
        $o = self::overrides();

        return [
            'contact_email' => self::value($o, 'contact_email', config('site.contact.email')),
            'contact_phone' => self::value($o, 'contact_phone', config('site.contact.phone')),
            'contact_whatsapp' => self::value($o, 'contact_whatsapp', config('site.contact.whatsapp')),
            'contact_address' => self::value($o, 'contact_address', config('site.contact.address')),
            'contact_city_country' => self::value($o, 'contact_city_country', config('site.contact.city_country')),
            'form_recipient_email' => self::value($o, 'form_recipient_email', config('site.contact.form_recipient')),
            'social_linkedin' => self::value($o, 'social_linkedin', config('site.social.linkedin')),
            'social_facebook' => self::value($o, 'social_facebook', config('site.social.facebook')),
            'google_reviews_url' => self::value($o, 'google_reviews_url', config('site.google_reviews.url')),
            'google_reviews_rating' => self::value($o, 'google_reviews_rating', config('site.google_reviews.rating')),
            'google_reviews_count' => self::value($o, 'google_reviews_count', config('site.google_reviews.count')),
            'footer_text' => self::value($o, 'footer_text', config('site.footer.text')),
            'canonical_domain' => self::value($o, 'canonical_domain', config('site.domain.canonical')),
            'previous_domain' => self::value($o, 'previous_domain', config('site.domain.previous')),
        ];
    }

    /**
     * Receptor de los formularios públicos (DB override o fallback config).
     */
    public static function formRecipient(): string
    {
        return (string) self::value(self::overrides(), 'form_recipient_email', config('site.contact.form_recipient'));
    }

    /**
     * Receptor de las notificaciones de reserva (DB override o fallback config).
     * Espejo de formRecipient(); el fallback de config ya cae al receptor de
     * contacto cuando no hay BOOKING_NOTIFY_EMAIL definido.
     */
    public static function bookingRecipient(): string
    {
        return (string) self::value(self::overrides(), 'booking_recipient_email', config('site.contact.booking_recipient'));
    }

    /**
     * Persiste un map clave => valor en el grupo `site`.
     *
     * @param  array<string, mixed>  $values
     */
    public static function persist(array $values): void
    {
        foreach ($values as $key => $value) {
            Setting::updateOrCreate(
                ['group' => 'site', 'key' => $key],
                ['value' => $value, 'type' => 'string', 'is_public' => true],
            );
        }
    }
}

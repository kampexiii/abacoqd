<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Seed confirmed corporate, contact, SEO and operational settings.
     */
    public function run(): void
    {
        $settings = [
            ['company', 'legal_name', 'ABACO DIGITAL DEVELOPMENTS, S.L.', 'string', true, 'Titular legal confirmado.'],
            ['company', 'trade_name', 'ABACO', 'string', true, 'Nombre abreviado confirmado.'],
            ['company', 'brand_name', 'AbacoQD', 'string', true, 'Nombre documental del proyecto.'],
            ['company', 'public_brand_name', 'Abaco Developments', 'string', true, 'Marca pública visible del sitio.'],
            ['company', 'cif', 'B-88229364', 'string', true, 'CIF confirmado.'],
            ['company', 'registry', 'Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002', 'string', true, 'Registro Mercantil confirmado.'],
            ['company', 'address_line_1', 'Calle Núñez de Balboa 35 A', 'string', true, 'Dirección confirmada.'],
            ['company', 'address_line_2', 'Piso 5, Oficina A1', 'string', true, 'Dirección confirmada.'],
            ['company', 'postal_code', '28001', 'string', true, 'Código postal confirmado.'],
            ['company', 'city', 'Madrid', 'string', true, 'Ciudad confirmada.'],
            ['company', 'country', 'España', 'string', true, 'País confirmado.'],
            ['company', 'website', 'https://abacoqd.com/', 'url', true, 'Dominio canónico final.'],
            ['contact', 'phone', '+34 91 020 00 89', 'string', true, 'Teléfono fijo confirmado.'],
            ['contact', 'whatsapp', '+34 647 51 81 00', 'string', true, 'WhatsApp / contacto directo Andrés.'],
            ['contact', 'email_primary', 'info@abacodev.com', 'email', true, 'Email principal confirmado.'],
            ['contact', 'email_secondary', 'abacodevelopments@gmail.com', 'email', false, 'Email secundario confirmado, no necesariamente público.'],
            ['contact', 'email_andres', 'andrescasanueva@abacodev.com', 'email', false, 'Email de Andrés confirmado, no necesariamente público.'],
            ['legal', 'owner', 'ABACO DIGITAL DEVELOPMENTS, S.L.', 'string', true, 'Responsable legal confirmado.'],
            ['legal', 'cif', 'B-88229364', 'string', true, 'CIF legal confirmado.'],
            ['legal', 'registry', 'Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002', 'string', true, 'Registro legal confirmado.'],
            ['legal', 'privacy_contact_email', 'info@abacodev.com', 'email', true, 'Email de privacidad confirmado.'],
            ['seo', 'canonical_domain', 'https://abacoqd.com/', 'url', true, 'Dominio canónico final.'],
            ['seo', 'public_brand_name', 'Abaco Developments', 'string', true, 'Marca pública para SEO.'],
            ['legacy', 'previous_domain', 'https://abacodev.com/', 'url', false, 'Dominio histórico/investigado.'],
            ['legacy', 'previous_legal_url', 'https://www.abacodev.com/', 'url', false, 'URL legal histórica aportada.'],
            ['legacy', 'redirect_policy', 'pendiente de confirmar', 'string', false, 'No hay 301 definitiva documentada.'],
            ['institutional', 'eu_fse_text', 'Cofinanciado por la Unión Europea (FSE+) Subvención para la contratación de jóvenes - Comunidad de Madrid.', 'string', true, 'Texto institucional aportado.'],
            ['institutional', 'benow_partner_logo', null, 'asset', false, 'Ruta definitiva pendiente.'],
            ['institutional', 'eu_cofunded_logo', null, 'asset', false, 'Ruta definitiva pendiente.'],
            ['institutional', 'european_funds_logo', null, 'asset', false, 'Ruta definitiva pendiente.'],
            ['theme', 'mode', 'system', 'string', true, 'Modo inicial: claro/oscuro/sistema.'],
            ['accessibility', 'defaults', ['reduced_motion' => false, 'high_contrast' => false, 'underline_links' => false, 'text_scale' => 'normal'], 'json', true, 'Defaults iniciales de accesibilidad.'],
            ['accessibility', 'chatbot_enabled', false, 'boolean', true, 'Asistente desactivable desde settings.'],
            ['booking', 'recommended_provider', 'Cal.com', 'string', false, 'Proveedor recomendado documentalmente.'],
            ['booking', 'fast_option', 'Calendly', 'string', false, 'Alternativa rápida documental.'],
            ['booking', 'wordpress_option', 'Amelia', 'string', false, 'Solo si el stack final fuera WordPress.'],
            ['analytics', 'recommended_stack', 'GTM + GA4 + Search Console', 'string', false, 'Stack recomendado, pendiente de confirmación.'],
            ['analytics', 'recommended_cmp', 'CookieYes', 'string', false, 'CMP recomendado, pendiente de confirmación.'],
            ['analytics', 'optional_session_insights', 'Clarity', 'string', false, 'Solo si se aprueba y queda bloqueado por consentimiento.'],
        ];

        foreach ($settings as [$group, $key, $value, $type, $isPublic, $description]) {
            Setting::updateOrCreate(
                ['group' => $group, 'key' => $key],
                [
                    'value' => $value,
                    'type' => $type,
                    'is_public' => $isPublic,
                    'description' => $description,
                ],
            );
        }
    }
}

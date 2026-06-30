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
            ['contact', 'whatsapp', '+34 647 51 81 00', 'string', true, 'WhatsApp / atención comercial.'],
            ['contact', 'email_primary', 'info@abacoqd.com', 'email', true, 'Email principal confirmado.'],
            ['contact', 'email_secondary', 'abacodevelopments@gmail.com', 'email', false, 'Email secundario, no expuesto por defecto.'],
            ['contact', 'email_andres', 'andrescasanueva@abacodev.com', 'email', false, 'Email comercial adicional, no expuesto por defecto.'],
            ['site', 'form_recipient_email', 'info@abacoqd.com', 'email', false, 'Receptor interno de mensajes de contacto.'],
            ['site', 'booking_recipient_email', 'info@abacoqd.com', 'email', false, 'Receptor interno de notificaciones de reserva.'],
            ['legal', 'owner', 'ABACO DIGITAL DEVELOPMENTS, S.L.', 'string', true, 'Responsable legal confirmado.'],
            ['legal', 'cif', 'B-88229364', 'string', true, 'CIF legal confirmado.'],
            ['legal', 'registry', 'Registro Mercantil de Madrid, Tomo 38273, Folio 65, Sección GNE, Hoja Nº 681002', 'string', true, 'Registro legal confirmado.'],
            ['legal', 'privacy_contact_email', 'info@abacoqd.com', 'email', true, 'Email de privacidad confirmado.'],
            ['seo', 'canonical_domain', 'https://abacoqd.com/', 'url', true, 'Dominio canónico final.'],
            ['seo', 'public_brand_name', 'Abaco Developments', 'string', true, 'Marca pública para SEO.'],
            ['legacy', 'previous_domain', 'https://abacodev.com/', 'url', false, 'Dominio histórico.'],
            ['legacy', 'previous_legal_url', 'https://www.abacodev.com/', 'url', false, 'URL legal histórica.'],
            ['legacy', 'redirect_policy', 'sin_decision_publica', 'string', false, 'Política de redirección aún no fijada.'],
            ['institutional', 'eu_fse_text', 'Cofinanciado por la Unión Europea (FSE+) Subvención para la contratación de jóvenes - Comunidad de Madrid.', 'string', true, 'Texto institucional de referencia.'],
            ['institutional', 'benow_partner_logo', null, 'asset', false, 'Asset institucional pendiente de validación antes de publicarse.'],
            ['institutional', 'eu_cofunded_logo', '/assets/branding/institucional/optimizados/eu-cofinanciado-dark.webp', 'asset', true, 'Emblema institucional aprobado para fondos oscuros.'],
            ['institutional', 'european_funds_logo', '/assets/branding/institucional/optimizados/fondos-europeos.svg', 'asset', true, 'Identificador institucional de fondos europeos.'],
            ['theme', 'mode', 'system', 'string', true, 'Modo inicial: claro/oscuro/sistema.'],
            ['accessibility', 'defaults', ['reduced_motion' => false, 'high_contrast' => false, 'underline_links' => false, 'text_scale' => 'normal'], 'json', true, 'Defaults iniciales de accesibilidad.'],
            ['accessibility', 'chatbot_enabled', false, 'boolean', true, 'Asistente desactivable desde settings.'],
            ['booking', 'recommended_provider', 'Cal.com', 'string', false, 'Proveedor recomendado documentalmente.'],
            ['booking', 'fast_option', 'Calendly', 'string', false, 'Alternativa rápida documental.'],
            ['booking', 'wordpress_option', 'Amelia', 'string', false, 'Solo si el stack final fuera WordPress.'],
            ['analytics', 'recommended_stack', null, 'string', false, 'No se usa analítica en el sitio público.'],
            ['analytics', 'recommended_cmp', null, 'string', false, 'No se usa CMP de terceros en el sitio público.'],
            ['analytics', 'optional_session_insights', null, 'string', false, 'No se usan herramientas de sesión en el sitio público.'],
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

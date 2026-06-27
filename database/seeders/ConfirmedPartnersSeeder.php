<?php

namespace Database\Seeders;

use App\Enums\PartnerType;
use App\Enums\PermissionStatus;
use App\Models\Partner;
use Illuminate\Database\Seeder;

/**
 * Partners del portfolio AbacoQD (clientes finales y colaboradores técnicos).
 * Se ejecuta antes de ConfirmedProjectsSeeder para resolver `client_partner_id`
 * y `partner_project` por slug. Idempotente por `slug`.
 */
class ConfirmedPartnersSeeder extends Seeder
{
    public function run(): void
    {
        // Logos de partner colaborador (ruta pública versionable en
        // `public/uploads/partners`, generada a partir de las entregas finales en
        // WebP). Los clientes finales NO llevan logo en su ficha de partner: su
        // logo se guarda en el proyecto (`projects.logo`/`logo_dark`).
        /** @var array<int, array{name: string, slug: string, type: PartnerType, website: string|null, logo?: string, logo_dark?: string}> $partners */
        $partners = [
            ['name' => 'Meliá Hotels International', 'slug' => 'melia-hotels-international', 'type' => PartnerType::Client, 'website' => 'https://www.meliahotelsinternational.com/es'],
            ['name' => 'Leroy Merlin', 'slug' => 'leroy-merlin', 'type' => PartnerType::Client, 'website' => 'https://www.leroymerlin.es/'],
            ['name' => 'Jack & Jones', 'slug' => 'jack-and-jones', 'type' => PartnerType::Client, 'website' => 'https://www.jackjones.com/'],
            ['name' => 'Malababa', 'slug' => 'malababa', 'type' => PartnerType::Client, 'website' => 'https://www.malababa.com/'],
            ['name' => 'WiBLE', 'slug' => 'wible', 'type' => PartnerType::Client, 'website' => 'https://www.wible.es/'],
            ['name' => 'Iberia', 'slug' => 'iberia', 'type' => PartnerType::Client, 'website' => 'https://www.iberia.com/'],
            ['name' => 'Devtia', 'slug' => 'devtia', 'type' => PartnerType::Client, 'website' => 'https://devtia.com/'],
            ['name' => 'Inspira', 'slug' => 'inspira', 'type' => PartnerType::Client, 'website' => null],
            ['name' => 'Jornada Perfecta', 'slug' => 'jornada-perfecta', 'type' => PartnerType::Client, 'website' => 'https://www.jornadaperfecta.com/'],
            ['name' => 'Urban Fisio', 'slug' => 'urban-fisio', 'type' => PartnerType::Client, 'website' => 'https://www.urbanfisio.com/'],
            ['name' => 'In Casa', 'slug' => 'in-casa', 'type' => PartnerType::Client, 'website' => null],
            ['name' => 'Control Cube', 'slug' => 'control-cube', 'type' => PartnerType::Client, 'website' => 'https://www.controlcube.com/'],

            ['name' => 'Cognodata', 'slug' => 'cognodata', 'type' => PartnerType::Collaborator, 'website' => 'https://www.cognodata.com/', 'logo' => '/uploads/partners/cognodata-logo.webp', 'logo_dark' => '/uploads/partners/cognodata-logo-dark.webp'],
            ['name' => 'Iksula', 'slug' => 'iksula', 'type' => PartnerType::Collaborator, 'website' => 'https://www.iksula.com/', 'logo' => '/uploads/partners/iksula-logo.webp', 'logo_dark' => '/uploads/partners/iksula-logo-dark.webp'],
            ['name' => 'I Feel Web', 'slug' => 'i-feel-web', 'type' => PartnerType::Collaborator, 'website' => 'https://ifeelweb.net/', 'logo' => '/uploads/partners/i-feel-web-logo.webp', 'logo_dark' => '/uploads/partners/i-feel-web-logo-dark.webp'],
            ['name' => 'YoSEO Marketing', 'slug' => 'yoseo-marketing', 'type' => PartnerType::Collaborator, 'website' => 'https://www.yoseomarketing.com/', 'logo' => '/uploads/partners/yoseo-marketing-logo.webp', 'logo_dark' => '/uploads/partners/yoseo-marketing-logo-dark.webp'],
            ['name' => 'RB', 'slug' => 'rb', 'type' => PartnerType::Collaborator, 'website' => null, 'logo' => '/uploads/partners/rb-logo.webp', 'logo_dark' => '/uploads/partners/rb-logo-dark.webp'],
        ];

        foreach ($partners as $index => $partner) {
            Partner::updateOrCreate(
                ['slug' => $partner['slug']],
                [
                    'name' => $partner['name'],
                    'type' => $partner['type']->value,
                    'logo' => $partner['logo'] ?? null,
                    'logo_dark' => $partner['logo_dark'] ?? null,
                    'logo_alt' => 'Logotipo de '.$partner['name'],
                    'website' => $partner['website'],
                    'permission_status' => PermissionStatus::Approved->value,
                    'permission_notes' => null,
                    'show_on_home' => false,
                    'show_in_collaborations' => false,
                    'show_in_projects' => false,
                    'is_featured' => false,
                    'is_active' => true,
                    'sort_order' => $index + 1,
                    'settings' => [],
                ],
            );
        }
    }
}

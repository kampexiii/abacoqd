<?php

namespace Database\Seeders;

use App\Enums\PartnerType;
use App\Enums\PermissionStatus;
use App\Enums\ProjectStatus;
use App\Models\Partner;
use App\Models\Project;
use Illuminate\Database\Seeder;

/**
 * Carga los proyectos/partners HISTÓRICOS aportados por Ábaco para poder
 * validar la maquetación de /proyectos y la sección Colaboraciones con datos
 * reales (no demo genérico). docs/90_LEGACY_ABACO_DEVELOPMENTS.md.
 *
 * NO son casos cerrados: quedan marcados como históricos y pendientes de
 * validación de permiso/logos/capturas. Se publican con `status=published`
 * para verlos en preview local, pero `permission_status=pending`, de modo que
 * en producción el controlador los oculta hasta que haya permiso aprobado.
 * El control fino vive en `settings.show_in_local_preview`.
 *
 * Los logos reutilizan los assets ya presentes en `branding/empresas/`; los
 * partners sin logo fiable quedan con patrón de marca (logo null).
 */
class AbacoHistoricalProjectsSeeder extends Seeder
{
    private const COLLAB = '/assets/branding/empresas/colaboraciones/optimizados';

    private const DIRECT = '/assets/branding/empresas/clientes-directos/optimizados';

    /**
     * Settings comunes que marcan el registro como histórico y previsualizable
     * solo en local. Nunca presentan el caso como permiso real.
     *
     * @return array<string, mixed>
     */
    private function historicalSettings(): array
    {
        return [
            'is_historical' => true,
            'validation_status' => 'pending_client_validation',
            'source' => 'datos aportados por Ábaco',
            'public_note' => 'Caso histórico pendiente de validación final',
            'show_in_local_preview' => true,
        ];
    }

    public function run(): void
    {
        // Registro de partners (ejecutores y clientes). slug => datos.
        $partners = [
            'abaco-developments' => ['Abaco Developments', PartnerType::Collaborator, null, null],
            'melia-hotels-international' => ['Meliá Hotels International', PartnerType::Client, self::DIRECT.'/melia-hotels-international.svg', null],
            'cognodata' => ['Cognodata', PartnerType::Collaborator, self::DIRECT.'/cognodata.svg', null],
            'leroy-merlin' => ['Leroy Merlin', PartnerType::Client, self::COLLAB.'/leroy-merlin.svg', null],
            'iksula' => ['Iksula', PartnerType::Collaborator, null, null],
            'jack-and-jones' => ['Jack & Jones', PartnerType::Client, self::COLLAB.'/jack-and-jones.svg', null],
            'i-feel-web' => ['I Feel Web', PartnerType::Collaborator, null, null],
            'malababa' => ['Malababa', PartnerType::Client, self::COLLAB.'/malababa.webp', self::COLLAB.'/malababa-dark.webp'],
            'yoseo-marketing' => ['YoSEO Marketing', PartnerType::Collaborator, self::DIRECT.'/yoseo-marketing.webp', self::DIRECT.'/yoseo-marketing-dark.webp'],
            'wible' => ['Wible', PartnerType::Client, self::COLLAB.'/wible.svg', self::COLLAB.'/wible-dark.svg'],
            'iberia' => ['Iberia', PartnerType::Client, self::COLLAB.'/iberia.svg', null],
            'devtia' => ['Devtia', PartnerType::Collaborator, self::COLLAB.'/devtia.webp', self::COLLAB.'/devtia-dark.webp'],
            'rb' => ['RB', PartnerType::Collaborator, null, null],
            'inspira' => ['Inspira', PartnerType::Client, null, null],
            'jornada-perfecta' => ['Jornada Perfecta', PartnerType::Client, null, null],
            'urban-fisio' => ['Urban Fisio', PartnerType::Client, self::DIRECT.'/urban-fisio.svg', null],
            'in-casa' => ['In Casa', PartnerType::Client, self::DIRECT.'/in-casa.webp', self::DIRECT.'/in-casa-dark.webp'],
        ];

        $partnerModels = [];
        $sort = 0;

        foreach ($partners as $slug => [$name, $type, $logo, $logoDark]) {
            $partnerModels[$slug] = Partner::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'type' => $type->value,
                    'logo' => $logo,
                    'logo_dark' => $logoDark,
                    'logo_alt' => 'Logotipo de '.$name,
                    'description' => null,
                    'permission_status' => PermissionStatus::Pending->value,
                    'permission_notes' => 'Histórico aportado por Ábaco; pendiente de confirmar permiso de uso de marca/logo.',
                    'show_on_home' => true,
                    'show_in_collaborations' => true,
                    'show_in_projects' => true,
                    'is_featured' => false,
                    'is_active' => true,
                    'sort_order' => $sort += 10,
                    'settings' => $this->historicalSettings(),
                ],
            );
        }

        // Proyectos históricos. exec = ejecutor (rol collaborator),
        // client = destinatario (rol client + client_partner_id).
        $projects = [
            [
                'exec' => 'abaco-developments', 'client' => 'melia-hotels-international',
                'slug' => ['es' => 'maestro-clientes-centralizado', 'en' => 'centralized-customer-master'],
                'title' => ['es' => 'Maestro de Clientes Centralizado', 'en' => 'Centralized Customer Master'],
                'summary' => ['es' => 'Construcción del Maestro de Clientes Centralizado y proyecto de Visión Única de Cliente.', 'en' => 'Build of the Centralized Customer Master and Single Customer View project.'],
                'description' => ['es' => 'Proyecto completo para la construcción del Maestro de Clientes Centralizado de la compañía. Proyecto Visión Única de Cliente.', 'en' => "Complete project to build the company's Centralized Customer Master. Single Customer View project."],
                'technologies' => ['CRM', 'Datos', 'Visión Única de Cliente', 'Sistemas internos'],
                'featured' => true,
            ],
            [
                'exec' => 'cognodata', 'client' => 'leroy-merlin',
                'slug' => ['es' => 'plataforma-crm-marketing-automation', 'en' => 'crm-marketing-automation-platform'],
                'title' => ['es' => 'Plataforma CRM y marketing automation', 'en' => 'CRM and marketing automation platform'],
                'summary' => ['es' => 'Plataforma CRM para analítica de comportamiento de clientes y marketing automation.', 'en' => 'CRM platform for customer behaviour analytics and marketing automation.'],
                'description' => ['es' => 'Construcción de la plataforma CRM para analítica de comportamiento de clientes y Marketing Automation con herramientas de SAS.', 'en' => 'Build of the CRM platform for customer behaviour analytics and Marketing Automation with SAS tools.'],
                'technologies' => ['CRM', 'Analítica', 'Marketing Automation', 'SAS'],
                'featured' => false,
            ],
            [
                'exec' => 'iksula', 'client' => 'jack-and-jones',
                'slug' => ['es' => 'transformacion-digital-ecommerce', 'en' => 'ecommerce-digital-transformation'],
                'title' => ['es' => 'Transformación digital eCommerce', 'en' => 'eCommerce digital transformation'],
                'summary' => ['es' => 'Transformación digital de la marca con eCommerce Magento, UI/UX y soporte.', 'en' => 'Digital transformation of the brand with Magento eCommerce, UI/UX and support.'],
                'description' => ['es' => 'Transformación digital de la marca con implementación de eCommerce Magento, servicios UI/UX, mantenimiento y soporte.', 'en' => 'Digital transformation of the brand with Magento eCommerce implementation, UI/UX services, maintenance and support.'],
                'technologies' => ['eCommerce', 'Magento', 'UI/UX', 'Soporte'],
                'featured' => false,
            ],
            [
                'exec' => 'i-feel-web', 'client' => 'malababa',
                'slug' => ['es' => 'estrategia-sem-medicion-digital', 'en' => 'sem-strategy-digital-measurement'],
                'title' => ['es' => 'Estrategia SEM y medición digital', 'en' => 'SEM strategy and digital measurement'],
                'summary' => ['es' => 'Campañas SEM en Google y redes con medición de resultados en Google Analytics.', 'en' => 'SEM campaigns on Google and social networks with results measured in Google Analytics.'],
                'description' => ['es' => 'Estrategia y ejecución de campañas SEM, Google y campañas promocionadas en Facebook e Instagram. Medición de resultados con Google Analytics.', 'en' => 'Strategy and execution of SEM, Google and promoted Facebook/Instagram campaigns. Results measured with Google Analytics.'],
                'technologies' => ['SEM', 'Analítica', 'Campañas', 'Medición'],
                'featured' => false,
            ],
            [
                'exec' => 'yoseo-marketing', 'client' => 'wible',
                'slug' => ['es' => 'estrategia-seo-desarrollo-web', 'en' => 'seo-strategy-web-development'],
                'title' => ['es' => 'Estrategia SEO y desarrollo web', 'en' => 'SEO strategy and web development'],
                'summary' => ['es' => 'Optimización y ejecución de la estrategia SEO con diseño y desarrollo web.', 'en' => 'SEO strategy optimization and execution with web design and development.'],
                'description' => ['es' => 'Optimización y ejecución de la estrategia SEO junto con diseños y desarrollos web.', 'en' => 'SEO strategy optimization and execution together with web design and development.'],
                'technologies' => ['SEO', 'Diseño web', 'Desarrollo web'],
                'featured' => false,
            ],
            [
                'exec' => 'abaco-developments', 'client' => 'iberia',
                'slug' => ['es' => 'reporting-corporativo-power-bi', 'en' => 'corporate-reporting-power-bi'],
                'title' => ['es' => 'Reporting corporativo en Power BI', 'en' => 'Corporate reporting in Power BI'],
                'summary' => ['es' => 'Desarrollos sobre Power BI del reporting corporativo y ayudas de negocio.', 'en' => 'Power BI development for corporate reporting and business support.'],
                'description' => ['es' => 'Ejecución y desarrollos sobre Power BI del reporting corporativo y ayudas de negocio.', 'en' => 'Execution and development on Power BI of corporate reporting and business support.'],
                'technologies' => ['Power BI', 'Reporting', 'BI', 'Datos'],
                'featured' => false,
            ],
            [
                'exec' => 'devtia', 'client' => 'abaco-developments',
                'slug' => ['es' => 'plataforma-gestion-crm-lms', 'en' => 'management-crm-lms-platform'],
                'title' => ['es' => 'Plataforma de gestión, CRM y LMS', 'en' => 'Management, CRM and LMS platform'],
                'summary' => ['es' => 'Plataforma de gestión, CRM y LMS a medida.', 'en' => 'Custom management platform, CRM and LMS.'],
                'description' => ['es' => 'Desarrollo de una plataforma de gestión, un CRM y un LMS a medida.', 'en' => 'Development of a custom management platform, a CRM and an LMS.'],
                'technologies' => ['CRM', 'LMS', 'Plataforma a medida', 'Gestión'],
                'featured' => true,
            ],
            [
                'exec' => 'rb', 'client' => 'inspira',
                'slug' => ['es' => 'crm-reporting-automatizacion-anuncios', 'en' => 'crm-reporting-ad-automation'],
                'title' => ['es' => 'CRM con reporting y automatización de anuncios', 'en' => 'CRM with reporting and ad automation'],
                'summary' => ['es' => 'CRM con sistema de reporting y automatización de anuncios.', 'en' => 'CRM with reporting and ad automation.'],
                'description' => ['es' => 'Desarrollo de CRM con sistema de reporting y automatización de anuncios.', 'en' => 'Development of a CRM with reporting and ad automation.'],
                'technologies' => ['CRM', 'Reporting', 'Automatización', 'Anuncios'],
                'featured' => false,
            ],
            [
                'exec' => 'abaco-developments', 'client' => 'jornada-perfecta',
                'slug' => ['es' => 'sistema-ia-recomendaciones-automaticas', 'en' => 'ai-automatic-recommendations'],
                'title' => ['es' => 'Sistema de IA para recomendaciones automáticas', 'en' => 'AI system for automatic recommendations'],
                'summary' => ['es' => 'Sistema de Inteligencia Artificial para recomendaciones automáticas.', 'en' => 'Artificial Intelligence system for automatic recommendations.'],
                'description' => ['es' => 'Desarrollo del sistema de Inteligencia Artificial para recomendaciones automáticas.', 'en' => 'Development of the Artificial Intelligence system for automatic recommendations.'],
                'technologies' => ['IA', 'Recomendaciones', 'Automatización', 'Producto digital'],
                'featured' => true,
            ],
            [
                'exec' => 'abaco-developments', 'client' => 'urban-fisio',
                'slug' => ['es' => 'estrategia-crm', 'en' => 'crm-strategy'],
                'title' => ['es' => 'Estrategia CRM', 'en' => 'CRM strategy'],
                'summary' => ['es' => 'Estrategia CRM desde el ámbito conceptual hasta la implantación.', 'en' => 'CRM strategy from concept to implementation.'],
                'description' => ['es' => 'Desarrollo de la estrategia CRM desde el ámbito conceptual hasta la implantación.', 'en' => 'Development of the CRM strategy from concept to implementation.'],
                'technologies' => ['CRM', 'Estrategia', 'Implantación', 'Procesos'],
                'featured' => false,
            ],
            [
                'exec' => 'abaco-developments', 'client' => 'in-casa',
                'slug' => ['es' => 'ia-iot-hogares-personas-mayores', 'en' => 'ai-iot-elderly-homes'],
                'title' => ['es' => 'IA aplicada a IoT en hogares de personas mayores', 'en' => 'AI applied to IoT in homes for the elderly'],
                'summary' => ['es' => 'Inteligencia Artificial aplicada a IoT en hogares de personas mayores.', 'en' => 'Artificial Intelligence applied to IoT in homes for the elderly.'],
                'description' => ['es' => 'Desarrollo de Inteligencia Artificial aplicada a ámbitos IoT en hogares de personas mayores.', 'en' => 'Development of Artificial Intelligence applied to IoT in homes for the elderly.'],
                'technologies' => ['IA', 'IoT', 'Automatización', 'Producto digital'],
                'featured' => true,
            ],
        ];

        $projectSort = 0;

        foreach ($projects as $data) {
            $client = $partnerModels[$data['client']]
                ?? throw new \RuntimeException("Partner cliente no registrado: {$data['client']}");
            $executor = $partnerModels[$data['exec']]
                ?? throw new \RuntimeException("Partner ejecutor no registrado: {$data['exec']}");

            $attributes = [
                'title' => $data['title'],
                'slug' => $data['slug'],
                'summary' => $data['summary'],
                'description' => $data['description'],
                'challenge' => null,
                'solution' => null,
                'result' => null,
                'technologies' => $data['technologies'],
                'status' => ProjectStatus::Published->value,
                'year' => null,
                'client_name' => $client->name,
                'client_partner_id' => $client->id,
                'permission_status' => PermissionStatus::Pending->value,
                'permission_notes' => 'Caso histórico aportado por Ábaco; pendiente de validación de permiso, logos y capturas.',
                'show_on_home' => true,
                'show_in_projects' => true,
                'show_in_collaborations' => true,
                'is_featured' => $data['featured'],
                'is_active' => true,
                'sort_order' => $projectSort += 10,
                'settings' => $this->historicalSettings(),
            ];

            $project = Project::query()->where('slug_es', $data['slug']['es'])->first();

            if ($project) {
                $project->update($attributes);
            } else {
                $project = Project::create($attributes);
            }

            // Roles: cliente/destinatario y ejecutor/colaborador.
            $pivot = [
                $client->id => ['role' => 'client', 'sort_order' => 1],
            ];

            if ($executor->id !== $client->id) {
                $pivot[$executor->id] = ['role' => 'collaborator', 'sort_order' => 2];
            }

            $project->partners()->sync($pivot);
        }
    }
}

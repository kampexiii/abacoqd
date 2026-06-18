<?php

namespace Database\Seeders;

use App\Enums\ServiceStatus;
use App\Models\SeoMetadata;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Seed the six documented initial services.
     */
    public function run(): void
    {
        $services = [
            [
                'Desarrollo web rápido',
                'Fast web development',
                'Webs y landings listas para comunicar, captar y evolucionar sin deuda innecesaria.',
                'Websites and landing pages ready to communicate, convert and evolve without unnecessary debt.',
                'code',
            ],
            [
                'Aplicaciones a medida',
                'Custom applications',
                'Herramientas internas y productos digitales adaptados a procesos reales.',
                'Internal tools and digital products adapted to real processes.',
                'blocks',
            ],
            [
                'Automatización con IA',
                'AI automation',
                'Flujos asistidos por IA para reducir trabajo repetitivo y conectar decisiones.',
                'AI-assisted flows to reduce repetitive work and connect decisions.',
                'sparkles',
            ],
            [
                'CRM, datos y procesos',
                'CRM, data and processes',
                'Estructura de datos, seguimiento comercial y procesos más medibles.',
                'Data structure, commercial tracking and more measurable processes.',
                'database',
            ],
            [
                'Integraciones digitales',
                'Digital integrations',
                'Conexión entre herramientas, APIs y sistemas que ya utiliza el negocio.',
                'Connections between tools, APIs and systems already used by the business.',
                'plug',
            ],
            [
                'MVPs y prototipos',
                'MVPs and prototypes',
                'Primeras versiones para validar enfoque, experiencia y viabilidad técnica.',
                'First versions to validate approach, experience and technical feasibility.',
                'rocket',
            ],
        ];

        foreach ($services as $index => [$titleEs, $titleEn, $summaryEs, $summaryEn, $icon]) {
            $sortOrder = $index + 1;

            $service = Service::updateOrCreate(
                ['sort_order' => $sortOrder],
                [
                    'title' => ['es' => $titleEs, 'en' => $titleEn],
                    'slug' => [
                        'es' => str($titleEs)->slug()->toString(),
                        'en' => str($titleEn)->slug()->toString(),
                    ],
                    'summary' => ['es' => $summaryEs, 'en' => $summaryEn],
                    'description' => ['es' => $summaryEs, 'en' => $summaryEn],
                    'icon' => $icon,
                    'image' => null,
                    'cta' => null,
                    'status' => ServiceStatus::Published->value,
                    'is_featured' => false,
                    'is_active' => true,
                    'show_on_home' => true,
                    'is_detail_enabled' => true,
                    'settings' => null,
                ],
            );

            $seoTitles = ['es' => $titleEs.' | Abaco Developments', 'en' => $titleEn.' | Abaco Developments'];
            $seoDescriptions = ['es' => $summaryEs, 'en' => $summaryEn];

            foreach (['es', 'en'] as $locale) {
                SeoMetadata::updateOrCreate(
                    ['seoable_type' => Service::class, 'seoable_id' => $service->id, 'locale' => $locale],
                    [
                        'page_key' => null,
                        'title' => $seoTitles[$locale],
                        'description' => $seoDescriptions[$locale],
                        'robots' => 'index,follow',
                        'og_title' => $seoTitles[$locale],
                        'og_description' => $seoDescriptions[$locale],
                    ],
                );
            }
        }
    }
}

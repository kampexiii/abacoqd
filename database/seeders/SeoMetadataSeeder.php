<?php

namespace Database\Seeders;

use App\Models\SeoMetadata;
use Illuminate\Database\Seeder;

class SeoMetadataSeeder extends Seeder
{
    /**
     * Seed basic static-page SEO metadata for ES/EN.
     */
    public function run(): void
    {
        $pages = [
            'home' => [
                'es' => ['', 'Abaco Developments - Consultoría tecnológica, CRM e IA aplicada', 'Consultoría tecnológica, CRM, datos, desarrollo digital e IA aplicada para proyectos a medida.'],
                'en' => ['en', 'Abaco Developments - Technology consulting, CRM and applied AI', 'Technology consulting, CRM, data, digital development and applied AI for custom projects.'],
            ],
            'methodology' => [
                'es' => ['metodologia', 'Metodología | Abaco Developments', 'Cómo trabajamos para construir soluciones rápidas, claras y a medida.'],
                'en' => ['en/methodology', 'Methodology | Abaco Developments', 'How we work to build fast, clear and custom digital solutions.'],
            ],
            'services' => [
                'es' => ['servicios', 'Servicios | Abaco Developments', 'Servicios de desarrollo web rápido, aplicaciones a medida, automatización con IA, CRM, integraciones y MVPs.'],
                'en' => ['en/services', 'Services | Abaco Developments', 'Services for fast web development, custom applications, AI automation, CRM, integrations and MVPs.'],
            ],
            'projects' => [
                'es' => ['proyectos', 'Proyectos | Abaco Developments', 'Proyectos y colaboraciones publicables de Abaco Developments.'],
                'en' => ['en/projects', 'Projects | Abaco Developments', 'Publishable projects and collaborations by Abaco Developments.'],
            ],
            'about' => [
                'es' => ['quienes-somos', 'Quiénes somos | Abaco Developments', 'Origen, enfoque y forma de trabajo de Abaco Developments.'],
                'en' => ['en/about', 'About us | Abaco Developments', 'Origin, approach and way of working of Abaco Developments.'],
            ],
            'blog' => [
                'es' => ['blog', 'Blog de CRM, datos e IA aplicada | Abaco Developments', 'Ideas sobre desarrollo rápido, IA aplicada, CRM, datos y automatización.'],
                'en' => ['en/blog', 'CRM, data and applied AI blog | Abaco Developments', 'Ideas about fast development, applied AI, CRM, data and automation.'],
            ],
            'contact' => [
                'es' => ['contacto', 'Contacto | Abaco Developments', 'Cuéntanos tu proyecto y te responderemos con un primer enfoque.'],
                'en' => ['en/contact', 'Contact | Abaco Developments', 'Tell us about your project and we will reply with an initial approach.'],
            ],
            'booking' => [
                'es' => ['reserva', 'Reserva hora | Abaco Developments', 'Reserva una primera sesión o usa el fallback de contacto.'],
                'en' => ['en/book', 'Book a call | Abaco Developments', 'Book an initial session or use the contact fallback.'],
            ],
            'legal-notice' => [
                'es' => ['aviso-legal', 'Aviso legal | Abaco Developments', 'Información legal de ABACO DIGITAL DEVELOPMENTS, S.L.'],
                'en' => ['en/legal-notice', 'Legal notice | Abaco Developments', 'Legal information for ABACO DIGITAL DEVELOPMENTS, S.L.'],
            ],
            'privacy' => [
                'es' => ['privacidad', 'Privacidad | Abaco Developments', 'Información sobre tratamiento de datos y derechos de privacidad.'],
                'en' => ['en/privacy', 'Privacy | Abaco Developments', 'Information about data processing and privacy rights.'],
            ],
            'cookies' => [
                'es' => ['cookies', 'Cookies | Abaco Developments', 'Información sobre cookies técnicas y preferencias de consentimiento.'],
                'en' => ['en/cookies', 'Cookies | Abaco Developments', 'Information about technical cookies and consent preferences.'],
            ],
        ];

        foreach ($pages as $pageKey => $locales) {
            foreach ($locales as $locale => [$path, $title, $description]) {
                SeoMetadata::updateOrCreate(
                    ['page_key' => $pageKey, 'locale' => $locale],
                    [
                        'title' => $title,
                        'description' => $description,
                        'canonical_url' => 'https://abacoqd.com/'.($path === '' ? '' : $path),
                        'robots' => 'index,follow',
                        'og_title' => $title,
                        'og_description' => $description,
                        'og_image' => null,
                        'schema_type' => null,
                        'schema_data' => null,
                    ],
                );
            }
        }
    }
}

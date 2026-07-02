<?php

namespace Database\Seeders;

use App\Models\SeoMetadata;
use Illuminate\Database\Seeder;

class SeoMetadataSeeder extends Seeder
{
    /**
     * Seed basic static-page SEO metadata for ES/EN.
     *
     * Decisión cerrada del primer bloque de SEO: por ahora solo ES es indexable
     * y no existen rutas `/en` reales. Se conservan los registros EN (datos
     * traducibles: title/description) pero NO se genera canonical EN: emitir
     * `https://abacoqd.com/en/...` apuntaría a URLs inexistentes. El canonical EN
     * se rellenará cuando se publiquen las rutas EN.
     */
    public function run(): void
    {
        $pages = [
            'home' => [
                'es' => ['', 'AbacoQD | Desarrollo a medida rápido y seguro', 'AbacoQD desarrolla webs, aplicaciones, automatizaciones, CRM, integraciones y herramientas internas a medida, con procesos ágiles, IA supervisada y criterio técnico de Abaco Developments.'],
                'en' => ['en', 'AbacoQD | Fast and secure custom development', 'AbacoQD builds custom websites, applications, automations, CRM systems, integrations and internal tools with agile processes, supervised AI and the technical criteria of Abaco Developments.'],
            ],
            'methodology' => [
                'es' => ['metodologia', 'Metodología | AbacoQD', 'Cómo trabajamos para construir soluciones rápidas, claras y a medida.'],
                'en' => ['en/methodology', 'Methodology | AbacoQD', 'How we work to build fast, clear and custom digital solutions.'],
            ],
            'services' => [
                'es' => ['servicios', 'Servicios | AbacoQD', 'Servicios de desarrollo web rápido, aplicaciones a medida, automatización con IA, CRM, integraciones y MVPs.'],
                'en' => ['en/services', 'Services | AbacoQD', 'Services for fast web development, custom applications, AI automation, CRM, integrations and MVPs.'],
            ],
            'projects' => [
                'es' => ['proyectos', 'Proyectos | AbacoQD', 'Proyectos y colaboraciones publicables de AbacoQD.'],
                'en' => ['en/projects', 'Projects | AbacoQD', 'Publishable projects and collaborations by AbacoQD.'],
            ],
            'about' => [
                'es' => ['quienes-somos', 'Quiénes somos | AbacoQD', 'Origen, enfoque y forma de trabajo de AbacoQD.'],
                'en' => ['en/about', 'About us | AbacoQD', 'Origin, approach and way of working of AbacoQD.'],
            ],
            'blog' => [
                'es' => ['blog', 'Blog de desarrollo rápido, datos e IA aplicada | AbacoQD', 'Ideas sobre desarrollo rápido, IA aplicada, CRM, datos y automatización.'],
                'en' => ['en/blog', 'Blog on fast development, data and applied AI | AbacoQD', 'Ideas about fast development, applied AI, CRM, data and automation.'],
            ],
            'contact' => [
                'es' => ['contacto', 'Contacto | AbacoQD', 'Cuéntanos tu proyecto y te responderemos con un primer enfoque.'],
                'en' => ['en/contact', 'Contact | AbacoQD', 'Tell us about your project and we will reply with an initial approach.'],
            ],
            'booking' => [
                'es' => ['reserva', 'Reserva hora | AbacoQD', 'Reserva una primera sesión o usa el fallback de contacto.'],
                'en' => ['en/book', 'Book a call | AbacoQD', 'Book an initial session or use the contact fallback.'],
            ],
            'legal-notice' => [
                'es' => ['aviso-legal', 'Aviso legal | AbacoQD', 'Información legal de ABACO DIGITAL DEVELOPMENTS, S.L.'],
                'en' => ['en/legal-notice', 'Legal notice | AbacoQD', 'Legal information for ABACO DIGITAL DEVELOPMENTS, S.L.'],
            ],
            'privacy' => [
                'es' => ['privacidad', 'Privacidad | AbacoQD', 'Información sobre tratamiento de datos y derechos de privacidad.'],
                'en' => ['en/privacy', 'Privacy | AbacoQD', 'Information about data processing and privacy rights.'],
            ],
            'cookies' => [
                'es' => ['cookies', 'Cookies | AbacoQD', 'Información sobre cookies técnicas y preferencias de consentimiento.'],
                'en' => ['en/cookies', 'Cookies | AbacoQD', 'Information about technical cookies and consent preferences.'],
            ],
        ];

        foreach ($pages as $pageKey => $locales) {
            foreach ($locales as $locale => [$path, $title, $description]) {
                // Solo ES emite canonical real. EN queda sin canonical hasta que
                // existan rutas /en (no se sirve una URL inexistente).
                $canonical = $locale === 'es'
                    ? 'https://abacoqd.com/'.$path
                    : null;

                SeoMetadata::updateOrCreate(
                    ['page_key' => $pageKey, 'locale' => $locale],
                    [
                        'title' => $title,
                        'description' => $description,
                        'canonical_url' => $canonical,
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

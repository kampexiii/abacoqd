<?php

namespace Database\Seeders;

use App\Enums\ServiceStatus;
use App\Models\SeoMetadata;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Seed the eight confirmed services, replacing the previous six.
     *
     * Upsert por slug: busca primero por el slug nuevo (ejecuciones repetidas
     * del seeder) y, si no existe, por el slug antiguo conocido (primera
     * migración de contenido), para conservar el `id` y no romper relaciones
     * `project_service` ya creadas. No se sobreescribe `image`: si el admin ya
     * subió una imagen, una reejecución del seeder no debe borrarla.
     */
    public function run(): void
    {
        $services = [
            [
                'old_slug' => 'desarrollo-web-rapido',
                'slug_es' => 'desarrollo-web-rapido',
                'slug_en' => 'fast-web-development',
                'title_es' => 'Desarrollo web rápido',
                'title_en' => 'Fast web development',
                'summary_es' => 'Creamos webs corporativas, landing pages y páginas de presentación para empresas que necesitan una presencia digital clara, moderna y preparada para captar contactos. Desarrollamos con una estructura cuidada, diseño responsive, SEO básico, buen rendimiento y una base fácil de mantener.',
                'summary_en' => 'We build corporate websites, landing pages and presentation sites for businesses that need a clear, modern digital presence ready to capture leads. We develop with a careful structure, responsive design, basic SEO, good performance and an easy-to-maintain base.',
                'icon' => 'code',
                'is_featured' => true,
            ],
            [
                'old_slug' => 'aplicaciones-a-medida',
                'slug_es' => 'aplicaciones-gestion-medida',
                'slug_en' => 'custom-management-applications',
                'title_es' => 'Aplicaciones de gestión a medida',
                'title_en' => 'Custom management applications',
                'summary_es' => 'Desarrollamos aplicaciones internas para empresas que necesitan ordenar su operativa diaria. Por ejemplo, plataformas tipo CIETE, con gestión de trabajos, pedidos, facturación, usuarios, estados, filtros, paneles y procesos adaptados a la forma real de trabajar de cada equipo.',
                'summary_en' => 'We build internal applications for businesses that need to organise their daily operations. For example, CIETE-style platforms with job, order and invoicing management, users, statuses, filters, panels and processes adapted to how each team really works.',
                'icon' => 'blocks',
                'is_featured' => true,
            ],
            [
                'old_slug' => null,
                'slug_es' => 'herramientas-internas-paneles-administracion',
                'slug_en' => 'internal-tools-admin-panels',
                'title_es' => 'Herramientas internas y paneles de administración',
                'title_en' => 'Internal tools and admin panels',
                'summary_es' => 'Creamos paneles privados para gestionar contenido, clientes, servicios, proyectos, mensajes, reservas, documentación o cualquier información importante del negocio. El objetivo es que la empresa pueda controlar su información sin depender constantemente de cambios en código.',
                'summary_en' => 'We build private panels to manage content, clients, services, projects, messages, bookings, documentation or any other important business information, so the company can control its own information without constantly depending on code changes.',
                'icon' => 'settings',
                'is_featured' => false,
            ],
            [
                'old_slug' => 'automatizacion-con-ia',
                'slug_es' => 'automatizacion-procesos-ia',
                'slug_en' => 'ai-process-automation',
                'title_es' => 'Automatización de procesos con IA',
                'title_en' => 'AI process automation',
                'summary_es' => 'Diseñamos automatizaciones para reducir tareas repetitivas, ordenar información y acelerar procesos internos. Podemos aplicar IA supervisada para clasificar datos, generar borradores, apoyar revisiones, conectar flujos de trabajo o facilitar tareas que antes se hacían manualmente.',
                'summary_en' => 'We design automations to reduce repetitive tasks, organise information and speed up internal processes. We can apply supervised AI to classify data, draft content, support reviews, connect workflows or simplify tasks that used to be done manually.',
                'icon' => 'sparkles',
                'is_featured' => true,
            ],
            [
                'old_slug' => 'crm-datos-y-procesos',
                'slug_es' => 'crm-datos-reporting',
                'slug_en' => 'crm-data-reporting',
                'title_es' => 'CRM, datos y reporting',
                'title_en' => 'CRM, data and reporting',
                'summary_es' => 'Construimos soluciones para centralizar información de clientes, procesos o actividad comercial. Incluye CRM personalizados, cuadros de mando, filtros avanzados, métricas, reportes y vistas de control para que la empresa pueda tomar decisiones con datos más claros.',
                'summary_en' => 'We build solutions to centralise customer, process and commercial activity information. This includes custom CRMs, dashboards, advanced filters, metrics, reports and control views so the company can make decisions with clearer data.',
                'icon' => 'database',
                'is_featured' => false,
            ],
            [
                'old_slug' => 'integraciones-digitales',
                'slug_es' => 'integraciones-digitales',
                'slug_en' => 'digital-integrations',
                'title_es' => 'Integraciones digitales',
                'title_en' => 'Digital integrations',
                'summary_es' => 'Conectamos herramientas, bases de datos, formularios, APIs, plataformas externas y sistemas internos para que la información fluya mejor entre aplicaciones. Esto permite evitar duplicidades, reducir errores manuales y mejorar la continuidad de los procesos.',
                'summary_en' => 'We connect tools, databases, forms, APIs, external platforms and internal systems so information flows better between applications. This avoids duplication, reduces manual errors and improves process continuity.',
                'icon' => 'plug',
                'is_featured' => false,
            ],
            [
                'old_slug' => 'mvps-y-prototipos',
                'slug_es' => 'mvps-prototipos-funcionales',
                'slug_en' => 'functional-mvps-prototypes',
                'title_es' => 'MVPs y prototipos funcionales',
                'title_en' => 'Functional MVPs and prototypes',
                'summary_es' => 'Ayudamos a convertir una idea en una primera versión funcional para validarla antes de invertir en un desarrollo completo. Creamos prototipos, paneles iniciales, flujos de prueba o MVPs que permiten comprobar si la solución encaja con el negocio.',
                'summary_en' => 'We help turn an idea into a first working version to validate it before investing in full development. We build prototypes, initial panels, test flows or MVPs to check whether the solution fits the business.',
                'icon' => 'rocket',
                'is_featured' => false,
            ],
            [
                'old_slug' => null,
                'slug_es' => 'mejora-evolucion-software-existente',
                'slug_en' => 'improving-existing-software',
                'title_es' => 'Mejora y evolución de software existente',
                'title_en' => 'Improving existing software',
                'summary_es' => 'Revisamos aplicaciones, webs o herramientas ya creadas para mejorar su estructura, rendimiento, diseño, seguridad o facilidad de uso. También podemos añadir nuevos módulos, ordenar código existente y preparar el proyecto para seguir creciendo de forma más estable.',
                'summary_en' => 'We review existing applications, websites or tools to improve their structure, performance, design, security or usability. We can also add new modules, tidy up existing code and prepare the project to keep growing more stably.',
                'icon' => 'refresh',
                'is_featured' => false,
            ],
        ];

        foreach ($services as $index => $data) {
            $sortOrder = $index + 1;

            $service = Service::query()->where('slug_es', $data['slug_es'])->first();

            if ($service === null && $data['old_slug'] !== null) {
                $service = Service::query()->where('slug_es', $data['old_slug'])->first();
            }

            $service ??= new Service;

            $service->fill([
                'title' => ['es' => $data['title_es'], 'en' => $data['title_en']],
                'slug' => ['es' => $data['slug_es'], 'en' => $data['slug_en']],
                'summary' => ['es' => $data['summary_es'], 'en' => $data['summary_en']],
                'description' => ['es' => $data['summary_es'], 'en' => $data['summary_en']],
                'icon' => $data['icon'],
                'cta' => null,
                'status' => ServiceStatus::Published->value,
                'is_featured' => $data['is_featured'],
                'is_active' => true,
                'show_on_home' => true,
                'is_detail_enabled' => true,
                'sort_order' => $sortOrder,
                'settings' => null,
            ]);

            $service->save();

            $seoTitles = [
                'es' => $data['title_es'].' | Abaco Developments',
                'en' => $data['title_en'].' | Abaco Developments',
            ];
            $seoDescriptions = [
                'es' => $data['summary_es'],
                'en' => $data['summary_en'],
            ];

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

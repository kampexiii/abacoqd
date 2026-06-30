<?php

namespace Database\Seeders;

use App\Enums\PermissionStatus;
use App\Enums\ProjectStatus;
use App\Models\Partner;
use App\Models\Project;
use App\Models\SeoMetadata;
use App\Models\Service;
use Illuminate\Database\Seeder;

/**
 * Catálogo inicial de proyectos del portfolio.
 *
 * El seeder localiza por `slug_es`, actualiza sin duplicar y mantiene las
 * relaciones de cliente, servicios y colaboradores.
 */
class ConfirmedProjectsSeeder extends Seeder
{
    public function run(): void
    {
        $partnersBySlug = Partner::query()->pluck('id', 'slug')->all();

        foreach ($this->projects() as $data) {
            $clientPartnerId = isset($data['client_partner_slug'])
                ? ($partnersBySlug[$data['client_partner_slug']] ?? null)
                : null;

            $attributes = [
                'title' => $data['title'],
                'slug' => $data['slug'],
                'summary' => $data['summary'],
                'description' => $data['description'],
                'challenge' => $data['challenge'],
                'solution' => $data['solution'],
                'result' => $data['result'],
                'technologies' => $data['technologies'],
                'status' => ProjectStatus::Published->value,
                'year' => $data['year'],
                'client_name' => $data['client_name'],
                'client_partner_id' => $clientPartnerId,
                'github_url' => null,
                'external_url' => null,
                'permission_status' => PermissionStatus::Approved->value,
                'permission_notes' => null,
                'logo_alt' => $data['logo_alt'],
                'show_on_home' => false,
                'show_in_projects' => true,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => $data['sort_order'],
                'settings' => $data['settings'],
            ];

            // La portada y la miniatura se resuelven con la convención pública
            // de assets versionados en `public/uploads/projects`.
            $slugEs = $data['slug']['es'];
            $coverPath = "/uploads/projects/{$slugEs}-cover.webp";

            $attributes['cover_image'] = $coverPath;
            $attributes['thumbnail_image'] = $coverPath;

            // El logo solo se asigna cuando el proyecto dispone de asset
            // específico para cliente o marca asociada.
            if ($data['has_client_logo'] ?? true) {
                $attributes['logo'] = "/uploads/projects/{$slugEs}-logo.webp";
                $attributes['logo_dark'] = "/uploads/projects/{$slugEs}-logo-dark.webp";
            }

            $project = Project::query()->where('slug_es', $slugEs)->first();

            if ($project) {
                // `show_in_collaborations` se conserva para respetar la curación
                // realizada desde el panel.
                $project->update($attributes);
            } else {
                $project = Project::create($attributes + [
                    'gallery' => [],
                    'show_in_collaborations' => true,
                ]);
            }

            foreach (['es', 'en'] as $locale) {
                SeoMetadata::updateOrCreate(
                    ['seoable_type' => Project::class, 'seoable_id' => $project->id, 'locale' => $locale],
                    [
                        'page_key' => null,
                        'title' => $data['seo'][$locale]['title'],
                        'description' => $data['seo'][$locale]['description'],
                        'robots' => 'index,follow',
                        'og_title' => $data['seo'][$locale]['title'],
                        'og_description' => $data['seo'][$locale]['description'],
                    ],
                );
            }

            // Las asociaciones de servicios se resuelven por slug.
            $services = [];
            $order = 0;

            foreach ($data['service_slugs'] as $slug) {
                $service = Service::query()->where('slug_es', $slug)->first();

                if ($service !== null) {
                    $services[$service->id] = ['sort_order' => $order += 1];
                }
            }

            $project->services()->sync($services);

            // Los colaboradores técnicos se sincronizan sobre `partner_project`.
            $partnerSync = [];
            $partnerOrder = 0;

            foreach ($data['collaborator_slugs'] ?? [] as $slug) {
                $partnerId = $partnersBySlug[$slug] ?? null;

                if ($partnerId !== null) {
                    $partnerSync[$partnerId] = ['role' => 'collaborator', 'sort_order' => $partnerOrder += 1];
                }
            }

            if (count($partnerSync) > 0) {
                $project->partners()->sync($partnerSync);
            }
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function projects(): array
    {
        return [
            [
                'slug' => [
                    'es' => 'erp-ciete-gestion-interna-trabajos-pedidos-facturacion',
                    'en' => 'erp-ciete-internal-management-jobs-orders-invoicing',
                ],
                'title' => [
                    'es' => 'ERP CIETE — Gestión interna de trabajos, pedidos y facturación',
                    'en' => 'ERP CIETE — Internal management of jobs, orders and invoicing',
                ],
                'summary' => [
                    'es' => 'Aplicación interna a medida para centralizar trabajos, pedidos, facturas, estaciones de servicio, usuarios, roles y estados, sustituyendo una operativa dispersa en Excel.',
                    'en' => 'Custom internal application to centralize jobs, orders, invoices, service stations, users, roles and statuses, replacing a fragmented Excel-based workflow.',
                ],
                'description' => [
                    'es' => 'CIETE gestionaba una parte importante de su actividad mediante múltiples hojas Excel, con trabajos, pedidos, facturas, estaciones, responsables y estados separados por cliente. Esta operativa generaba problemas de concurrencia, control de cambios, trazabilidad e informes.',
                    'en' => 'CIETE managed a significant part of its operations through multiple Excel files, including jobs, orders, invoices, service stations, responsible users and statuses separated by client. This created issues with concurrency, change control, traceability and reporting.',
                ],
                'challenge' => [
                    'es' => 'Convertir una operativa compleja basada en Excel en una plataforma interna centralizada, segura y ordenada, capaz de separar la información por cliente, controlar usuarios y reflejar la lógica real de trabajos, pedidos, tarifas y facturación.',
                    'en' => 'To transform a complex Excel-based workflow into a centralized, secure and structured internal platform, capable of separating information by client, managing users and reflecting the real logic of jobs, orders, tariffs and invoicing.',
                ],
                'solution' => [
                    'es' => 'Desarrollamos una aplicación interna a medida para centralizar la gestión de trabajos, pedidos, facturas, estaciones de servicio, usuarios, roles y estados. La plataforma se diseñó para adaptarse a la forma real de trabajar de CIETE y preparar la migración progresiva desde Excel.',
                    'en' => 'We developed a custom internal application to centralize the management of jobs, orders, invoices, service stations, users, roles and statuses. The platform was designed around CIETE’s real workflow and prepared for a progressive migration from Excel.',
                ],
                'result' => [
                    'es' => 'CIETE obtuvo una base digital más clara, controlada y escalable para gestionar su operativa diaria, reducir errores manuales, mejorar la trazabilidad y preparar futuros módulos de reporting, importación y control avanzado.',
                    'en' => 'CIETE gained a clearer, more controlled and scalable digital foundation to manage daily operations, reduce manual errors, improve traceability and prepare future reporting, import and advanced control modules.',
                ],
                'technologies' => [
                    'Laravel',
                    'Inertia.js',
                    'React',
                    'Tailwind CSS',
                    'PHP',
                    'MySQL/MariaDB',
                    'JavaScript/TypeScript',
                    'Roles y permisos',
                    'Auditoría',
                    'Importación desde Excel',
                ],
                'year' => 2026,
                'client_name' => 'CIETE Arquitectos S.L.',
                'logo_alt' => 'Logotipo de CIETE Arquitectos S.L.',
                'service_slugs' => [
                    'aplicaciones-gestion-medida',
                    'crm-datos-reporting',
                    'integraciones-digitales',
                ],
                'sort_order' => 1,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto ERP CIETE desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'ERP CIETE — Gestión interna de trabajos, pedidos y facturación | AbacoQD',
                        'description' => 'Aplicación interna a medida para centralizar trabajos, pedidos, facturas, usuarios, roles y trazabilidad operativa en CIETE Arquitectos S.L.',
                    ],
                    'en' => [
                        'title' => 'ERP CIETE — Internal management of jobs, orders and invoicing | AbacoQD',
                        'description' => 'Custom internal ERP platform to centralize jobs, orders, invoicing, users, roles and operational traceability for CIETE Arquitectos S.L.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'erp-crm-control-cube',
                    'en' => 'erp-crm-control-cube-platform',
                ],
                'title' => [
                    'es' => 'ERP + CRM para Control Cube',
                    'en' => 'ERP + CRM for Control Cube',
                ],
                'summary' => [
                    'es' => 'ERP + CRM a medida para Control Cube, orientado a ofertas, obras, planificación, facturación, rentabilidad y control operativo.',
                    'en' => 'Custom ERP + CRM for Control Cube, focused on quotes, projects, planning, invoicing, profitability and operational control.',
                ],
                'description' => [
                    'es' => 'Control Cube necesitaba una herramienta interna para centralizar su operativa diaria y trabajar desde las fases iniciales de preparación de ofertas hasta la finalización de las obras y su cobro. La plataforma gestiona ofertas, obras, trabajos, pedidos, planificación, facturación, importaciones, usuarios y estados de gestión. Se partía de un ERP antiguo a medida que, por antigüedad, no se podía reutilizar, por lo que el nuevo desarrollo comenzó desde cero e incorporó funcionalidades CRM inexistentes en el sistema anterior.',
                    'en' => 'Control Cube needed an internal tool to centralize its daily operations and work from the early stages of preparing quotes through to the completion of projects and their invoicing. The platform manages quotes, projects, jobs, orders, planning, invoicing, imports, users and management statuses. It started from an old custom ERP that, due to its age, could not be reused, so the new development began from scratch and added CRM capabilities the previous system lacked.',
                ],
                'challenge' => [
                    'es' => 'Crear una nueva plataforma desde cero que sustituyera un ERP antiguo, incorporara capacidades CRM, permitiera presupuestos complejos, generara alertas para optimizar el tiempo de venta, automatizara procesos comerciales y reflejara la rentabilidad de la compañía con desglose por obras.',
                    'en' => 'To build a new platform from scratch to replace an old ERP, add CRM capabilities, support complex quotes, generate alerts to optimize sales time, automate commercial processes and reflect the company’s profitability with a breakdown by project.',
                ],
                'solution' => [
                    'es' => 'Desarrollamos una aplicación web de gestión a medida, con panel interno, módulos diferenciados, control de usuarios, filtros avanzados, vistas de trabajo y gestión de pedidos, trabajos, facturas e importaciones. La solución se planteó con estructura modular para poder mantenerse, ampliarse y adaptarse a nuevas necesidades.',
                    'en' => 'We developed a custom web management application, with an internal panel, differentiated modules, user control, advanced filters, work views and management of orders, jobs, invoices and imports. The solution was designed with a modular structure so it can be maintained, extended and adapted to new needs.',
                ],
                'result' => [
                    'es' => 'El proyecto permitió disponer de una plataforma interna más ordenada, centralizada y preparada para gestionar procesos clave desde un único entorno, facilitando el seguimiento de la actividad, reduciendo la dispersión de información y dejando una base técnica preparada para futuras mejoras.',
                    'en' => 'The project provided a more organized, centralized internal platform ready to manage key processes from a single environment, easing activity tracking, reducing information fragmentation and leaving a technical foundation prepared for future improvements.',
                ],
                'technologies' => [
                    'Node.js',
                    'Express',
                    'React',
                    'MySQL/MariaDB',
                    'API Facturadirecta',
                    'ERP',
                    'CRM',
                ],
                'year' => 2026,
                'client_name' => 'Control Cube',
                'client_partner_slug' => 'control-cube',
                'logo_alt' => 'Logotipo de Control Cube',
                'service_slugs' => [
                    'aplicaciones-gestion-medida',
                    'crm-datos-reporting',
                    'integraciones-digitales',
                ],
                'sort_order' => 2,
                'settings' => [
                    'year_range' => '2025-2026',
                    'cover_image_alt' => 'Imagen corporativa del proyecto ERP + CRM para Control Cube desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'ERP + CRM para Control Cube | AbacoQD',
                        'description' => 'Aplicación ERP y CRM a medida para Control Cube, con gestión de obras, ofertas, facturación, planificación y rentabilidad.',
                    ],
                    'en' => [
                        'title' => 'ERP + CRM for Control Cube | AbacoQD',
                        'description' => 'Custom ERP and CRM application for Control Cube, with management of projects, quotes, invoicing, planning and profitability.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'erp-modular-generico',
                    'en' => 'generic-modular-erp',
                ],
                'title' => [
                    'es' => 'ERP Modular Genérico',
                    'en' => 'Generic Modular ERP',
                ],
                'summary' => [
                    'es' => 'ERP modular propio de AbacoQD, creado como base reutilizable para desarrollar soluciones de gestión a medida para distintos sectores.',
                    'en' => 'AbacoQD’s own modular ERP, built as a reusable foundation to develop custom management solutions for different sectors.',
                ],
                'description' => [
                    'es' => 'AbacoQD necesitaba disponer de una base ERP propia, flexible y reutilizable, que permitiera acelerar el desarrollo de soluciones de gestión para nuevos clientes. En lugar de comenzar cada proyecto desde cero, la plataforma actúa como núcleo funcional sobre el que adaptar procesos, activar módulos existentes y desarrollar módulos nuevos a medida según el sector, el tamaño y la forma de trabajar de cada empresa.',
                    'en' => 'AbacoQD needed its own flexible, reusable ERP foundation to speed up the development of management solutions for new clients. Instead of starting each project from scratch, the platform acts as a functional core on which to adapt processes, enable existing modules and develop new custom modules according to each company’s sector, size and way of working.',
                ],
                'challenge' => [
                    'es' => 'Construir una solución suficientemente completa para cubrir procesos comunes de gestión empresarial y, a la vez, modular para adaptarse a clientes con necesidades distintas, organizando la operativa, centralizando información, controlando estados, gestionando usuarios y permisos, midiendo rentabilidad y facilitando futuras integraciones sin crear una arquitectura rígida.',
                    'en' => 'To build a solution complete enough to cover common business management processes and, at the same time, modular enough to adapt to clients with different needs: organizing operations, centralizing information, controlling statuses, managing users and permissions, measuring profitability and enabling future integrations without creating a rigid architecture.',
                ],
                'solution' => [
                    'es' => 'Desarrollamos una aplicación web ERP modular con arquitectura preparada para evolucionar por bloques funcionales. La plataforma incluye módulos base como clientes, CRM, ofertas, proyectos, trabajos, planificación, horas, gastos, compras, proveedores, almacén, inventario, facturación, calidad, recursos, formación, documentos, informes, usuarios y configuración. Sobre esta base, cada cliente puede recibir una solución adaptada reutilizando módulos existentes, modificando flujos, añadiendo reglas de negocio, integrando herramientas externas o desarrollando módulos específicos.',
                    'en' => 'We developed a modular web ERP with an architecture ready to evolve by functional blocks. The platform includes base modules such as clients, CRM, quotes, projects, jobs, planning, time tracking, expenses, purchasing, suppliers, warehouse, inventory, invoicing, quality, resources, training, documents, reports, users and configuration. On this foundation, each client can receive an adapted solution by reusing existing modules, modifying flows, adding business rules, integrating external tools or developing specific modules.',
                ],
                'result' => [
                    'es' => 'AbacoQD cuenta con una base ERP sólida, reutilizable y escalable para ofrecer desarrollos a medida con menor tiempo de entrega y mayor calidad técnica, facilitando plataformas internas centralizadas para distintos tipos de empresas y dejando una base preparada para futuras ampliaciones, automatizaciones e integraciones.',
                    'en' => 'AbacoQD has a solid, reusable and scalable ERP foundation to offer custom developments with shorter delivery times and higher technical quality, enabling centralized internal platforms for different types of companies and leaving a base ready for future extensions, automations and integrations.',
                ],
                'technologies' => [
                    'Java 21',
                    'Spring Boot 3.4',
                    'Spring Security',
                    'JWT',
                    'PostgreSQL',
                    'Flyway',
                    'React 19',
                    'TypeScript',
                    'Vite',
                    'Tailwind CSS',
                    'Radix UI / shadcn',
                    'TanStack Table',
                    'Recharts',
                    'Docker Compose',
                ],
                'year' => 2026,
                'client_name' => 'AbacoQD',
                'logo_alt' => 'Logotipo de AbacoQD',
                'service_slugs' => [
                    'aplicaciones-gestion-medida',
                    'crm-datos-reporting',
                    'integraciones-digitales',
                    'mvps-prototipos-funcionales',
                ],
                'has_client_logo' => false,
                'sort_order' => 3,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto ERP Modular Genérico desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'ERP Modular Genérico | AbacoQD',
                        'description' => 'ERP modular propio de AbacoQD para crear soluciones de gestión a medida con CRM, proyectos, facturación, informes y permisos.',
                    ],
                    'en' => [
                        'title' => 'Generic Modular ERP | AbacoQD',
                        'description' => 'AbacoQD’s own modular ERP to build custom management solutions with CRM, projects, invoicing, reports and permissions.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'maestro-clientes-centralizado-melia',
                    'en' => 'centralized-customer-master-melia',
                ],
                'title' => [
                    'es' => 'Maestro de Clientes Centralizado — Visión Única de Cliente',
                    'en' => 'Centralized Customer Master — Single Customer View',
                ],
                'summary' => [
                    'es' => 'Construcción del Maestro de Clientes Centralizado de Meliá Hotels International, una solución orientada a unificar información y avanzar hacia una Visión Única de Cliente.',
                    'en' => 'Construction of Meliá Hotels International’s Centralized Customer Master, a solution focused on unifying information and advancing towards a Single Customer View.',
                ],
                'description' => [
                    'es' => 'Meliá Hotels International necesitaba avanzar hacia una visión unificada de sus clientes, centralizando información clave y creando una base común para su consulta, gestión y análisis. El proyecto abordó la construcción del Maestro de Clientes Centralizado de la compañía dentro de la iniciativa Visión Única de Cliente.',
                    'en' => 'Meliá Hotels International needed to move towards a unified view of its customers, centralizing key information and creating a common foundation for its consultation, management and analysis. The project addressed the construction of the company’s Centralized Customer Master within the Single Customer View initiative.',
                ],
                'challenge' => [
                    'es' => 'Unificar información de cliente dispersa en una base centralizada, fiable y consultable, que sirviera como punto común para la gestión y el análisis dentro de la iniciativa Visión Única de Cliente.',
                    'en' => 'To unify scattered customer information into a centralized, reliable and queryable foundation that would serve as a common point for management and analysis within the Single Customer View initiative.',
                ],
                'solution' => [
                    'es' => 'Desarrollamos el Maestro de Clientes Centralizado como base unificada de información de cliente, diseñada para integrar datos, ordenar su consulta y soportar una Visión Única de Cliente sobre la que apoyar la gestión y el análisis.',
                    'en' => 'We developed the Centralized Customer Master as a unified customer information foundation, designed to integrate data, structure its consultation and support a Single Customer View on which to base management and analysis.',
                ],
                'result' => [
                    'es' => 'Meliá dispuso de una base de cliente más unificada y estructurada, preparada para sostener la consulta, la gestión y el análisis de la información bajo un mismo criterio.',
                    'en' => 'Meliá gained a more unified and structured customer foundation, ready to support the consultation, management and analysis of information under a single criterion.',
                ],
                'technologies' => [
                    'CRM',
                    'Integración de datos',
                    'Modelo de datos de cliente',
                    'Base de datos relacional',
                    'Procesos ETL',
                ],
                'year' => 2019,
                'client_name' => 'Meliá Hotels International',
                'client_partner_slug' => 'melia-hotels-international',
                'logo_alt' => 'Logotipo de Meliá Hotels International',
                'service_slugs' => [
                    'aplicaciones-gestion-medida',
                    'crm-datos-reporting',
                    'integraciones-digitales',
                ],
                'sort_order' => 4,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto Maestro de Clientes Centralizado desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'Maestro de Clientes Centralizado para Meliá | AbacoQD',
                        'description' => 'Proyecto para Meliá Hotels International: construcción de un Maestro de Clientes Centralizado orientado a Visión Única de Cliente.',
                    ],
                    'en' => [
                        'title' => 'Centralized Customer Master for Meliá | AbacoQD',
                        'description' => 'Project for Meliá Hotels International: building a Centralized Customer Master focused on a Single Customer View.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'reporting-corporativo-power-bi-iberia',
                    'en' => 'corporate-reporting-power-bi-iberia',
                ],
                'title' => [
                    'es' => 'Reporting Corporativo en Power BI',
                    'en' => 'Corporate Reporting in Power BI',
                ],
                'summary' => [
                    'es' => 'Desarrollos sobre Power BI para Iberia, orientados a reporting corporativo y ayudas de negocio basadas en datos.',
                    'en' => 'Power BI developments for Iberia, focused on corporate reporting and data-driven business support.',
                ],
                'description' => [
                    'es' => 'El proyecto abordó la ejecución y el desarrollo sobre Power BI del reporting corporativo y de herramientas de apoyo al negocio, con cuadros de mando y visualización de datos para la toma de decisiones.',
                    'en' => 'The project addressed the execution and development on Power BI of corporate reporting and business support tools, with dashboards and data visualization for decision-making.',
                ],
                'challenge' => [
                    'es' => 'Desarrollar un reporting corporativo claro sobre Power BI, con cuadros de mando y visualizaciones que sirvieran de apoyo al negocio.',
                    'en' => 'To develop clear corporate reporting on Power BI, with dashboards and visualizations that would support the business.',
                ],
                'solution' => [
                    'es' => 'Desarrollamos sobre Power BI el reporting corporativo y ayudas de negocio, con cuadros de mando y visualización de datos orientados a facilitar la lectura y el análisis.',
                    'en' => 'We developed corporate reporting and business support on Power BI, with dashboards and data visualization aimed at easing reading and analysis.',
                ],
                'result' => [
                    'es' => 'Iberia dispuso de desarrollos de reporting corporativo sobre Power BI, con cuadros de mando y visualizaciones de apoyo a la toma de decisiones.',
                    'en' => 'Iberia gained corporate reporting developments on Power BI, with dashboards and visualizations supporting decision-making.',
                ],
                'technologies' => [
                    'Power BI',
                    'Reporting corporativo',
                    'Dashboards',
                    'Visualización de datos',
                ],
                'year' => 2019,
                'client_name' => 'Iberia',
                'client_partner_slug' => 'iberia',
                'logo_alt' => 'Logotipo de Iberia',
                'service_slugs' => [
                    'crm-datos-reporting',
                    'aplicaciones-gestion-medida',
                ],
                'sort_order' => 5,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto Reporting Corporativo en Power BI desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'Reporting Power BI para Iberia | AbacoQD',
                        'description' => 'Desarrollos sobre Power BI para Iberia, centrados en reporting corporativo y ayudas de negocio basadas en datos.',
                    ],
                    'en' => [
                        'title' => 'Power BI Reporting for Iberia | AbacoQD',
                        'description' => 'Power BI developments for Iberia focused on corporate reporting and data-driven business support.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'plataforma-crm-analitica-marketing-automation-leroy-merlin',
                    'en' => 'analytical-crm-marketing-automation-leroy-merlin',
                ],
                'title' => [
                    'es' => 'Plataforma CRM Analítica y Marketing Automation',
                    'en' => 'Analytical CRM and Marketing Automation Platform',
                ],
                'summary' => [
                    'es' => 'Construcción de una plataforma CRM para Leroy Merlin, orientada a analítica de comportamiento de clientes y marketing automation con herramientas SAS.',
                    'en' => 'Construction of a CRM platform for Leroy Merlin, focused on customer behavior analytics and marketing automation using SAS tools.',
                ],
                'description' => [
                    'es' => 'El proyecto abordó la construcción de una plataforma CRM orientada a analizar el comportamiento de los clientes, activar acciones de marketing automation y trabajar los datos de forma más estructurada, apoyándose en herramientas de SAS.',
                    'en' => 'The project addressed the construction of a CRM platform focused on analyzing customer behavior, activating marketing automation actions and working with data in a more structured way, supported by SAS tools.',
                ],
                'challenge' => [
                    'es' => 'Disponer de una plataforma CRM capaz de ordenar y analizar el comportamiento de los clientes y de soportar acciones de marketing automation sobre una base de datos estructurada.',
                    'en' => 'To have a CRM platform able to organize and analyze customer behavior and to support marketing automation actions on a structured database.',
                ],
                'solution' => [
                    'es' => 'En colaboración con Cognodata, desarrollamos una plataforma CRM para analítica de comportamiento de clientes y marketing automation apoyada en herramientas de SAS, con los datos organizados para su explotación.',
                    'en' => 'Together with Cognodata, we developed a CRM platform for customer behavior analytics and marketing automation supported by SAS tools, with data organized for exploitation.',
                ],
                'result' => [
                    'es' => 'Leroy Merlin contó con una plataforma CRM preparada para analizar comportamiento de clientes y activar marketing automation sobre una base de datos más estructurada.',
                    'en' => 'Leroy Merlin had a CRM platform ready to analyze customer behavior and activate marketing automation on a more structured database.',
                ],
                'technologies' => [
                    'SAS',
                    'CRM',
                    'Marketing Automation',
                    'Analítica de clientes',
                    'Integración de datos',
                ],
                'year' => 2018,
                'client_name' => 'Leroy Merlin',
                'client_partner_slug' => 'leroy-merlin',
                'collaborator_slugs' => ['cognodata'],
                'logo_alt' => 'Logotipo de Leroy Merlin',
                'service_slugs' => [
                    'crm-datos-reporting',
                    'automatizacion-procesos-ia',
                    'integraciones-digitales',
                ],
                'sort_order' => 6,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto Plataforma CRM Analítica y Marketing Automation desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'CRM Analítico para Leroy Merlin | AbacoQD',
                        'description' => 'Plataforma CRM para Leroy Merlin con analítica de comportamiento de clientes y marketing automation mediante herramientas SAS.',
                    ],
                    'en' => [
                        'title' => 'Analytical CRM for Leroy Merlin | AbacoQD',
                        'description' => 'CRM platform for Leroy Merlin with customer behavior analytics and marketing automation using SAS tools.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'transformacion-digital-ecommerce-magento-jack-and-jones',
                    'en' => 'magento-ecommerce-digital-transformation-jack-and-jones',
                ],
                'title' => [
                    'es' => 'Transformación Digital eCommerce Magento',
                    'en' => 'Magento eCommerce Digital Transformation',
                ],
                'summary' => [
                    'es' => 'Implementación y evolución de un eCommerce Magento para Jack & Jones, con servicios UI/UX, mantenimiento y soporte.',
                    'en' => 'Implementation and evolution of a Magento eCommerce for Jack & Jones, with UI/UX services, maintenance and support.',
                ],
                'description' => [
                    'es' => 'El proyecto abordó la transformación digital de la marca mediante la implementación de un eCommerce Magento, junto a servicios de UI/UX, mantenimiento y soporte para su evolución continua.',
                    'en' => 'The project addressed the brand’s digital transformation through the implementation of a Magento eCommerce, alongside UI/UX, maintenance and support services for its continuous evolution.',
                ],
                'challenge' => [
                    'es' => 'Implementar y hacer evolucionar un eCommerce Magento sólido, cuidando la experiencia de usuario y manteniendo la plataforma operativa con mantenimiento y soporte continuos.',
                    'en' => 'To implement and evolve a solid Magento eCommerce, caring for the user experience and keeping the platform operational with continuous maintenance and support.',
                ],
                'solution' => [
                    'es' => 'En colaboración con Iksula, implementamos y evolucionamos el eCommerce Magento de Jack & Jones, incorporando mejoras de UI/UX y un servicio de mantenimiento y soporte.',
                    'en' => 'Together with Iksula, we implemented and evolved Jack & Jones’ Magento eCommerce, adding UI/UX improvements and a maintenance and support service.',
                ],
                'result' => [
                    'es' => 'Jack & Jones dispuso de un eCommerce Magento implementado y mantenido, con una experiencia de usuario cuidada y soporte para su evolución.',
                    'en' => 'Jack & Jones gained an implemented and maintained Magento eCommerce, with a refined user experience and support for its evolution.',
                ],
                'technologies' => [
                    'Magento',
                    'eCommerce',
                    'UI/UX',
                    'Mantenimiento web',
                    'Soporte evolutivo',
                ],
                'year' => 2018,
                'client_name' => 'Jack & Jones',
                'client_partner_slug' => 'jack-and-jones',
                'collaborator_slugs' => ['iksula'],
                'logo_alt' => 'Logotipo de Jack & Jones',
                'service_slugs' => [
                    'desarrollo-web-rapido',
                    'integraciones-digitales',
                ],
                'sort_order' => 7,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto Transformación Digital eCommerce Magento desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'eCommerce Magento para Jack & Jones | AbacoQD',
                        'description' => 'Proyecto de transformación digital para Jack & Jones con eCommerce Magento, servicios UI/UX, mantenimiento y soporte.',
                    ],
                    'en' => [
                        'title' => 'Magento eCommerce for Jack & Jones | AbacoQD',
                        'description' => 'Digital transformation project for Jack & Jones with a Magento eCommerce, UI/UX services, maintenance and support.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'sistema-ia-recomendaciones-automaticas-jornada-perfecta',
                    'en' => 'ai-system-automatic-recommendations-jornada-perfecta',
                ],
                'title' => [
                    'es' => 'Sistema de Inteligencia Artificial para Recomendaciones Automáticas',
                    'en' => 'Artificial Intelligence System for Automatic Recommendations',
                ],
                'summary' => [
                    'es' => 'Sistema de Inteligencia Artificial para Jornada Perfecta, capaz de generar recomendaciones automáticas mediante predicciones periódicas basadas en datos.',
                    'en' => 'Artificial Intelligence system for Jornada Perfecta, able to generate automatic recommendations through periodic data-driven predictions.',
                ],
                'description' => [
                    'es' => 'El proyecto trasladó un proceso de recomendación, antes basado en criterio humano, a un sistema automatizado de IA a medida. El desarrollo se ejecuta de forma periódica sobre un servidor externo, procesa un amplio conjunto de parámetros que determinan la predicción, guarda el resultado en la base de datos de Jornada Perfecta y permite consultarlo desde la aplicación de la empresa. El sistema sigue vigente años después con mantenimientos mínimos.',
                    'en' => 'The project moved a recommendation process, previously based on human judgement, to a custom automated AI system. The development runs periodically on an external server, processes a broad set of parameters that determine the prediction, stores the result in Jornada Perfecta’s database and makes it available from the company’s application. The system remains in operation years later with minimal maintenance.',
                ],
                'challenge' => [
                    'es' => 'Automatizar mediante IA un proceso de recomendación que antes dependía del criterio humano, ejecutándolo de forma periódica e integrándolo con la base de datos y la aplicación de la empresa.',
                    'en' => 'To automate, through AI, a recommendation process that previously relied on human judgement, running it periodically and integrating it with the company’s database and application.',
                ],
                'solution' => [
                    'es' => 'Desarrollamos un sistema de IA a medida en Python que se ejecuta periódicamente sobre un servidor externo, procesa los parámetros que determinan la predicción, almacena los resultados en la base de datos de Jornada Perfecta y los deja disponibles para su consulta desde la aplicación.',
                    'en' => 'We developed a custom AI system in Python that runs periodically on an external server, processes the parameters that determine the prediction, stores the results in Jornada Perfecta’s database and makes them available for consultation from the application.',
                ],
                'result' => [
                    'es' => 'Jornada Perfecta dispuso de un sistema de recomendaciones automáticas integrado en su aplicación, que sigue en funcionamiento años después con un mantenimiento mínimo.',
                    'en' => 'Jornada Perfecta gained an automatic recommendation system integrated into its application, still running years later with minimal maintenance.',
                ],
                'technologies' => [
                    'Python',
                    'MySQL',
                    'Inteligencia Artificial',
                    'Procesos programados',
                    'Integración de datos',
                ],
                'year' => 2022,
                'client_name' => 'Jornada Perfecta',
                'client_partner_slug' => 'jornada-perfecta',
                'logo_alt' => 'Logotipo de Jornada Perfecta',
                'service_slugs' => [
                    'automatizacion-procesos-ia',
                    'aplicaciones-gestion-medida',
                    'integraciones-digitales',
                ],
                'sort_order' => 8,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto Sistema de Inteligencia Artificial para Recomendaciones Automáticas desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'IA para Jornada Perfecta | AbacoQD',
                        'description' => 'Sistema de IA para Jornada Perfecta con predicciones automáticas, ejecución periódica en Python e integración con su base de datos.',
                    ],
                    'en' => [
                        'title' => 'AI for Jornada Perfecta | AbacoQD',
                        'description' => 'AI system for Jornada Perfecta with automatic predictions, periodic execution in Python and integration with its database.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'plataforma-gestion-crm-lms-medida-devtia',
                    'en' => 'custom-management-crm-lms-platform-devtia',
                ],
                'title' => [
                    'es' => 'Plataforma de Gestión, CRM y LMS a Medida',
                    'en' => 'Custom Management, CRM and LMS Platform',
                ],
                'summary' => [
                    'es' => 'Desarrollo de una plataforma a medida para Devtia, integrando gestión interna, CRM y LMS en un único entorno digital.',
                    'en' => 'Development of a custom platform for Devtia, integrating internal management, CRM and LMS in a single digital environment.',
                ],
                'description' => [
                    'es' => 'El proyecto desarrolló una plataforma a medida que combina gestión operativa, relación con clientes (CRM) y formación/aprendizaje (LMS) en un único entorno, con gestión de usuarios y procesos.',
                    'en' => 'The project developed a custom platform that combines operational management, customer relationship (CRM) and training/learning (LMS) in a single environment, with user and process management.',
                ],
                'challenge' => [
                    'es' => 'Unificar en una sola plataforma la gestión interna, la relación con clientes y la formación, evitando herramientas dispersas y adaptándose a la operativa real de Devtia.',
                    'en' => 'To unify internal management, customer relationship and training in a single platform, avoiding scattered tools and adapting to Devtia’s real workflow.',
                ],
                'solution' => [
                    'es' => 'Desarrollamos una plataforma a medida que integra gestión, CRM y LMS, con gestión de usuarios, procesos y formación en un mismo entorno digital.',
                    'en' => 'We developed a custom platform that integrates management, CRM and LMS, with user, process and training management in a single digital environment.',
                ],
                'result' => [
                    'es' => 'Devtia dispuso de un entorno unificado para gestionar su operativa, su relación con clientes y su formación, con una base preparada para crecer por módulos.',
                    'en' => 'Devtia gained a unified environment to manage its operations, customer relationships and training, with a foundation ready to grow by modules.',
                ],
                'technologies' => [
                    'CRM',
                    'LMS',
                    'Plataforma de gestión',
                    'Aplicación a medida',
                    'Gestión de usuarios',
                ],
                'year' => 2021,
                'client_name' => 'Devtia',
                'client_partner_slug' => 'devtia',
                'logo_alt' => 'Logotipo de Devtia',
                'service_slugs' => [
                    'aplicaciones-gestion-medida',
                    'crm-datos-reporting',
                ],
                'sort_order' => 9,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto Plataforma de Gestión, CRM y LMS a Medida desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'CRM y LMS a medida para Devtia | AbacoQD',
                        'description' => 'Plataforma de gestión, CRM y LMS desarrollada a medida para Devtia por AbacoQD.',
                    ],
                    'en' => [
                        'title' => 'Custom CRM and LMS for Devtia | AbacoQD',
                        'description' => 'Custom management, CRM and LMS platform developed for Devtia by AbacoQD.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'crm-reporting-automatizacion-anuncios-inspira',
                    'en' => 'crm-reporting-ad-automation-inspira',
                ],
                'title' => [
                    'es' => 'CRM con Reporting y Automatización de Anuncios',
                    'en' => 'CRM with Reporting and Ad Automation',
                ],
                'summary' => [
                    'es' => 'Desarrollo de un CRM para Inspira con reporting y automatización de anuncios, orientado a mejorar el control y el seguimiento de procesos.',
                    'en' => 'Development of a CRM for Inspira with reporting and ad automation, focused on improving control and process tracking.',
                ],
                'description' => [
                    'es' => 'El proyecto desarrolló un CRM con un sistema de reporting y automatización de anuncios, orientado a ordenar la información, facilitar el seguimiento y apoyar los procesos de activación publicitaria.',
                    'en' => 'The project developed a CRM with a reporting system and ad automation, focused on organizing information, easing tracking and supporting advertising activation processes.',
                ],
                'challenge' => [
                    'es' => 'Ordenar la información comercial y de activación publicitaria en un CRM con reporting y automatización, mejorando el control y el seguimiento de los procesos.',
                    'en' => 'To organize commercial and advertising-activation information in a CRM with reporting and automation, improving control and process tracking.',
                ],
                'solution' => [
                    'es' => 'Junto a RB, desarrollamos un CRM con sistema de reporting y automatización de anuncios, orientado a centralizar la información y apoyar el seguimiento de los procesos.',
                    'en' => 'Together with RB, we developed a CRM with a reporting system and ad automation, focused on centralizing information and supporting process tracking.',
                ],
                'result' => [
                    'es' => 'Inspira contó con un CRM con reporting y automatización que ordenó la información y facilitó el seguimiento y el control de sus procesos.',
                    'en' => 'Inspira gained a CRM with reporting and automation that organized information and eased the tracking and control of its processes.',
                ],
                'technologies' => [
                    'CRM',
                    'Reporting',
                    'Automatización de anuncios',
                    'Procesos comerciales',
                    'Datos',
                ],
                'year' => 2021,
                'client_name' => 'Inspira',
                'client_partner_slug' => 'inspira',
                'collaborator_slugs' => ['rb'],
                'logo_alt' => 'Logotipo de Inspira',
                'service_slugs' => [
                    'crm-datos-reporting',
                    'automatizacion-procesos-ia',
                    'integraciones-digitales',
                ],
                'sort_order' => 10,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto CRM con Reporting y Automatización de Anuncios desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'CRM y Reporting para Inspira | AbacoQD',
                        'description' => 'CRM para Inspira con sistema de reporting y automatización de anuncios, desarrollado junto a RB.',
                    ],
                    'en' => [
                        'title' => 'CRM and Reporting for Inspira | AbacoQD',
                        'description' => 'CRM for Inspira with a reporting system and ad automation, developed together with RB.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'estrategia-sem-medicion-digital-malababa',
                    'en' => 'sem-strategy-digital-measurement-malababa',
                ],
                'title' => [
                    'es' => 'Estrategia SEM y Medición Digital',
                    'en' => 'SEM Strategy and Digital Measurement',
                ],
                'summary' => [
                    'es' => 'Estrategia y ejecución de campañas SEM para Malababa, con activación en Google, Facebook e Instagram y medición mediante Google Analytics.',
                    'en' => 'Strategy and execution of SEM campaigns for Malababa, with activation on Google, Facebook and Instagram and measurement through Google Analytics.',
                ],
                'description' => [
                    'es' => 'El proyecto definió y ejecutó una estrategia de captación y medición digital para ordenar campañas, canales y lectura de resultados, con campañas SEM en Google y campañas promocionadas en Facebook e Instagram, midiendo el rendimiento con Google Analytics.',
                    'en' => 'The project defined and executed a digital acquisition and measurement strategy to organize campaigns, channels and results reading, with SEM campaigns on Google and promoted campaigns on Facebook and Instagram, measuring performance with Google Analytics.',
                ],
                'challenge' => [
                    'es' => 'Ordenar la captación digital de la marca a través de campañas SEM y sociales, con una medición consistente que permitiera leer los resultados de cada canal.',
                    'en' => 'To organize the brand’s digital acquisition through SEM and social campaigns, with consistent measurement that allowed reading the results of each channel.',
                ],
                'solution' => [
                    'es' => 'Junto a I Feel Web, definimos y ejecutamos campañas SEM en Google y promocionadas en Facebook e Instagram, con medición de resultados mediante Google Analytics.',
                    'en' => 'Together with I Feel Web, we defined and executed SEM campaigns on Google and promoted campaigns on Facebook and Instagram, with results measured through Google Analytics.',
                ],
                'result' => [
                    'es' => 'Malababa dispuso de una estrategia de captación y medición digital más ordenada, con campañas activas en varios canales y una lectura de resultados centralizada.',
                    'en' => 'Malababa gained a more organized digital acquisition and measurement strategy, with active campaigns across several channels and centralized results reading.',
                ],
                'technologies' => [
                    'Google Ads',
                    'Facebook Ads',
                    'Instagram Ads',
                    'Google Analytics',
                    'SEM',
                ],
                'year' => 2018,
                'client_name' => 'Malababa',
                'client_partner_slug' => 'malababa',
                'collaborator_slugs' => ['i-feel-web'],
                'logo_alt' => 'Logotipo de Malababa',
                'service_slugs' => [
                    'crm-datos-reporting',
                    'integraciones-digitales',
                ],
                'sort_order' => 11,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto Estrategia SEM y Medición Digital desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'Estrategia SEM para Malababa | AbacoQD',
                        'description' => 'Campañas SEM para Malababa en Google, Facebook e Instagram, con medición de resultados mediante Google Analytics.',
                    ],
                    'en' => [
                        'title' => 'SEM Strategy for Malababa | AbacoQD',
                        'description' => 'SEM campaigns for Malababa across Google, Facebook and Instagram, with results measured through Google Analytics.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'estrategia-seo-desarrollo-web-wible',
                    'en' => 'seo-strategy-web-development-wible',
                ],
                'title' => [
                    'es' => 'Estrategia SEO y Desarrollo Web',
                    'en' => 'SEO Strategy and Web Development',
                ],
                'summary' => [
                    'es' => 'Optimización SEO, diseño y desarrollo web para WiBLE, dentro de una estrategia orientada a mejorar estructura, presencia digital y visibilidad.',
                    'en' => 'SEO optimization, design and web development for WiBLE, within a strategy focused on improving structure, digital presence and visibility.',
                ],
                'description' => [
                    'es' => 'El proyecto combinó optimización SEO con diseño y desarrollo web para mejorar la estructura, la presencia digital y la visibilidad de WiBLE, ejecutando la estrategia de forma conjunta.',
                    'en' => 'The project combined SEO optimization with design and web development to improve WiBLE’s structure, digital presence and visibility, executing the strategy jointly.',
                ],
                'challenge' => [
                    'es' => 'Mejorar la presencia digital y la visibilidad de WiBLE combinando una estrategia SEO sólida con diseño y desarrollo web alineados.',
                    'en' => 'To improve WiBLE’s digital presence and visibility by combining a solid SEO strategy with aligned design and web development.',
                ],
                'solution' => [
                    'es' => 'En colaboración con YoSEO Marketing, optimizamos el SEO y trabajamos diseños y desarrollos web orientados a mejorar la estructura y la presencia digital de WiBLE.',
                    'en' => 'Together with YoSEO Marketing, we optimized SEO and worked on web designs and developments aimed at improving WiBLE’s structure and digital presence.',
                ],
                'result' => [
                    'es' => 'WiBLE avanzó hacia una presencia digital más cuidada, con una base SEO trabajada y desarrollos web alineados con su estrategia.',
                    'en' => 'WiBLE moved towards a more refined digital presence, with a worked SEO foundation and web developments aligned with its strategy.',
                ],
                'technologies' => [
                    'SEO',
                    'Diseño web',
                    'Desarrollo web',
                    'Optimización web',
                    'Analítica digital',
                ],
                'year' => 2019,
                'client_name' => 'WiBLE',
                'client_partner_slug' => 'wible',
                'collaborator_slugs' => ['yoseo-marketing'],
                'logo_alt' => 'Logotipo de WiBLE',
                'service_slugs' => [
                    'desarrollo-web-rapido',
                    'crm-datos-reporting',
                ],
                'sort_order' => 12,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto Estrategia SEO y Desarrollo Web desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'SEO y Desarrollo Web para WiBLE | AbacoQD',
                        'description' => 'Proyecto para WiBLE centrado en optimización SEO, diseño y desarrollos web junto a YoSEO Marketing.',
                    ],
                    'en' => [
                        'title' => 'SEO and Web Development for WiBLE | AbacoQD',
                        'description' => 'Project for WiBLE focused on SEO optimization, design and web development together with YoSEO Marketing.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'estrategia-crm-implantacion-operativa-urban-fisio',
                    'en' => 'crm-strategy-operational-implementation-urban-fisio',
                ],
                'title' => [
                    'es' => 'Estrategia CRM e Implantación Operativa',
                    'en' => 'CRM Strategy and Operational Implementation',
                ],
                'summary' => [
                    'es' => 'Desarrollo de la estrategia CRM de Urban Fisio, desde la definición conceptual hasta su implantación operativa.',
                    'en' => 'Development of Urban Fisio’s CRM strategy, from conceptual definition through to its operational implementation.',
                ],
                'description' => [
                    'es' => 'El proyecto acompañó a Urban Fisio en el desarrollo completo de su estrategia CRM, desde el planteamiento conceptual hasta la implantación, ordenando la relación con clientes, los procesos y los datos.',
                    'en' => 'The project supported Urban Fisio in the full development of its CRM strategy, from conceptual planning through to implementation, organizing customer relationships, processes and data.',
                ],
                'challenge' => [
                    'es' => 'Definir e implantar una estrategia CRM completa que ordenara la relación con clientes, los procesos y los datos, desde lo conceptual hasta lo operativo.',
                    'en' => 'To define and implement a complete CRM strategy that organized customer relationships, processes and data, from the conceptual to the operational.',
                ],
                'solution' => [
                    'es' => 'Desarrollamos la estrategia CRM de Urban Fisio desde su definición conceptual hasta la implantación operativa, alineando procesos, datos y relación con clientes.',
                    'en' => 'We developed Urban Fisio’s CRM strategy from its conceptual definition through to operational implementation, aligning processes, data and customer relationships.',
                ],
                'result' => [
                    'es' => 'Urban Fisio dispuso de una estrategia CRM definida e implantada, con procesos y relación con clientes más ordenados.',
                    'en' => 'Urban Fisio gained a defined and implemented CRM strategy, with more organized processes and customer relationships.',
                ],
                'technologies' => [
                    'CRM',
                    'Estrategia de cliente',
                    'Implantación operativa',
                    'Datos',
                    'Procesos',
                ],
                'year' => 2020,
                'client_name' => 'Urban Fisio',
                'client_partner_slug' => 'urban-fisio',
                'logo_alt' => 'Logotipo de Urban Fisio',
                'service_slugs' => [
                    'crm-datos-reporting',
                    'aplicaciones-gestion-medida',
                ],
                'sort_order' => 13,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto Estrategia CRM e Implantación Operativa desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'Estrategia CRM para Urban Fisio | AbacoQD',
                        'description' => 'Proyecto CRM para Urban Fisio, desde el planteamiento conceptual hasta la implantación operativa.',
                    ],
                    'en' => [
                        'title' => 'CRM Strategy for Urban Fisio | AbacoQD',
                        'description' => 'CRM project for Urban Fisio, from conceptual planning to operational implementation.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'inteligencia-artificial-iot-hogares-personas-mayores-in-casa',
                    'en' => 'ai-iot-elderly-homes-in-casa',
                ],
                'title' => [
                    'es' => 'Inteligencia Artificial e IoT para Hogares de Personas Mayores',
                    'en' => 'Artificial Intelligence and IoT for Elderly People’s Homes',
                ],
                'summary' => [
                    'es' => 'Desarrollo de Inteligencia Artificial aplicada a entornos IoT para In Casa, en el contexto de hogares de personas mayores.',
                    'en' => 'Development of Artificial Intelligence applied to IoT environments for In Casa, in the context of elderly people’s homes.',
                ],
                'description' => [
                    'es' => 'El proyecto desarrolló Inteligencia Artificial aplicada sobre entornos IoT en hogares de personas mayores, orientada a trabajar con la información procedente de sistemas conectados.',
                    'en' => 'The project developed Artificial Intelligence applied to IoT environments in elderly people’s homes, focused on working with information coming from connected systems.',
                ],
                'challenge' => [
                    'es' => 'Aplicar Inteligencia Artificial sobre entornos IoT en hogares de personas mayores, trabajando con la información procedente de sistemas conectados.',
                    'en' => 'To apply Artificial Intelligence to IoT environments in elderly people’s homes, working with information coming from connected systems.',
                ],
                'solution' => [
                    'es' => 'Desarrollamos la Inteligencia Artificial sobre los ámbitos IoT de In Casa, orientada a procesar y aprovechar la información de los sistemas conectados en hogares de personas mayores.',
                    'en' => 'We developed the Artificial Intelligence over In Casa’s IoT environments, focused on processing and leveraging information from connected systems in elderly people’s homes.',
                ],
                'result' => [
                    'es' => 'In Casa dispuso de una base de Inteligencia Artificial aplicada a sus entornos IoT, preparada para trabajar con la información de sus sistemas conectados.',
                    'en' => 'In Casa gained an Artificial Intelligence foundation applied to its IoT environments, ready to work with the information from its connected systems.',
                ],
                'technologies' => [
                    'Inteligencia Artificial',
                    'IoT',
                    'Teleasistencia',
                    'Monitorización',
                    'Análisis de datos',
                ],
                'year' => 2021,
                'client_name' => 'In Casa',
                'client_partner_slug' => 'in-casa',
                'logo_alt' => 'Logotipo de In Casa',
                'service_slugs' => [
                    'automatizacion-procesos-ia',
                    'integraciones-digitales',
                    'aplicaciones-gestion-medida',
                ],
                'sort_order' => 14,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto Inteligencia Artificial e IoT para Hogares de Personas Mayores desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'IA e IoT para In Casa | AbacoQD',
                        'description' => 'Proyecto de IA aplicada a entornos IoT para In Casa, orientado a hogares de personas mayores.',
                    ],
                    'en' => [
                        'title' => 'AI and IoT for In Casa | AbacoQD',
                        'description' => 'AI applied to IoT environments for In Casa, focused on elderly people’s homes.',
                    ],
                ],
            ],

            [
                'slug' => [
                    'es' => 'erp-generico-gestion-obras-rentabilidad',
                    'en' => 'generic-works-management-erp',
                ],
                'title' => [
                    'es' => 'ERP Genérico de Gestión de Obras y Rentabilidad',
                    'en' => 'Generic Works Management ERP',
                ],
                'summary' => [
                    'es' => 'ERP genérico propio de AbacoQD sobre Node.js, concebido como base reutilizable para construir soluciones de gestión de obras a medida con control de rentabilidad por obra.',
                    'en' => 'AbacoQD’s own generic ERP built on Node.js, conceived as a reusable foundation to build custom works-management solutions with per-project profitability control.',
                ],
                'description' => [
                    'es' => 'AbacoQD necesitaba un desarrollo genérico de ERP que permitiera, a partir de una base común, crear desarrollos a medida para sus clientes. Es una herramienta interna para centralizar la operativa diaria y trabajar todas las gestiones de obras o proyectos: obras, trabajos, pedidos, planificación, facturación, importaciones, usuarios y estados de gestión.',
                    'en' => 'AbacoQD needed a generic ERP development that, from a common base, would allow creating custom developments for its clients. It is an internal tool to centralize daily operations and manage all works or projects: works, jobs, orders, planning, invoicing, imports, users and management statuses.',
                ],
                'challenge' => [
                    'es' => 'Partir de requerimientos genéricos para un ERP y construirlo desde cero, con el objetivo principal de que la parte analítica reflejara la rentabilidad de la compañía con la facultad de desglosarla por obras, además de planificar y verificar los trabajos del personal y controlar la calidad.',
                    'en' => 'To start from generic ERP requirements and build it from scratch, with the main goal that the analytical layer would reflect the company’s profitability with the ability to break it down by project, alongside planning and verifying staff work and controlling quality.',
                ],
                'solution' => [
                    'es' => 'Desarrollamos una aplicación web de gestión a medida, con panel interno, módulos diferenciados, control de usuarios, filtros avanzados, vistas de trabajo y gestión de pedidos, trabajos, facturas e importaciones. La solución se planteó con estructura modular para poder mantenerse, ampliarse y adaptarse a nuevas necesidades.',
                    'en' => 'We developed a custom web management application, with an internal panel, differentiated modules, user control, advanced filters, work views and management of orders, jobs, invoices and imports. The solution was designed with a modular structure so it can be maintained, extended and adapted to new needs.',
                ],
                'result' => [
                    'es' => 'AbacoQD dispuso de una base ERP genérica, ordenada y centralizada, preparada para gestionar procesos clave de obra desde un único entorno y servir de punto de partida en desarrollos a medida, dejando una base técnica preparada para futuras mejoras.',
                    'en' => 'AbacoQD gained a generic, organized and centralized ERP foundation, ready to manage key project processes from a single environment and to serve as a starting point for custom developments, leaving a technical foundation prepared for future improvements.',
                ],
                'technologies' => [
                    'Node.js',
                    'Express',
                    'React',
                    'Arquitectura MVC',
                    'MySQL/MariaDB',
                    'API Facturadirecta',
                    'ERP',
                ],
                'year' => 2026,
                'client_name' => 'AbacoQD',
                'logo_alt' => 'Logotipo de AbacoQD',
                'service_slugs' => [
                    'aplicaciones-gestion-medida',
                    'crm-datos-reporting',
                    'integraciones-digitales',
                ],
                'has_client_logo' => false,
                'sort_order' => 15,
                'settings' => [
                    'cover_image_alt' => 'Imagen corporativa del proyecto ERP Genérico de Gestión de Obras y Rentabilidad desarrollado por AbacoQD',
                ],
                'seo' => [
                    'es' => [
                        'title' => 'ERP Genérico de Gestión de Obras y Rentabilidad | AbacoQD',
                        'description' => 'ERP genérico propio de AbacoQD sobre Node.js para gestión de obras, planificación, facturación y análisis de rentabilidad por obra.',
                    ],
                    'en' => [
                        'title' => 'Generic Works Management ERP | AbacoQD',
                        'description' => 'AbacoQD’s own generic Node.js ERP for works management, planning, invoicing and per-project profitability analysis.',
                    ],
                ],
            ],
        ];
    }
}

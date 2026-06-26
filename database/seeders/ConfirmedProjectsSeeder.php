<?php

namespace Database\Seeders;

use App\Enums\PermissionStatus;
use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\SeoMetadata;
use Illuminate\Database\Seeder;

/**
 * Proyectos REALES confirmados por Pablo, los únicos publicables.
 *
 * El seeder de casos legacy/demo aportados por Ábaco se retiró en el Bloque 7
 * (limpieza de proyectos/partners sin confirmar). Este seeder solo contiene
 * proyectos verificados que sí pueden publicarse y persiste
 * `permission_status=approved` por compatibilidad con los scopes existentes
 * (la gestión visible de permisos se eliminó del panel). Irá creciendo conforme
 * se confirmen más proyectos; no sustituye al futuro sistema de snapshots.
 *
 * Reglas respetadas:
 * - No toca imágenes/logos: cover/thumbnail/gallery quedan vacíos y se cargan a
 *   mano desde el CRUD admin (`settings.images_pending_manual_upload = true`).
 * - No crea Partner ni relación `partner_project`: proyectos en solitario.
 * - Idempotente: busca por `slug_es` y actualiza/crea, sin duplicar ni tocar
 *   otros proyectos ni partners.
 * - SEO por entidad siguiendo el patrón polimórfico de `ServiceSeeder`.
 */
class ConfirmedProjectsSeeder extends Seeder
{
    public function run(): void
    {
        /** @var array<int, array<string, mixed>> $projects */
        $projects = [
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
                'permission_notes' => 'Proyecto real confirmado por Pablo. Realizado en solitario, sin partner ni colaborador. Imágenes/logos pendientes de carga manual desde el CRUD.',
                'sort_order' => 1,
                'settings' => [
                    'source' => 'confirmed_by_pablo',
                    'confirmed_at' => '2026-06-26',
                    'project_kind' => 'internal_erp',
                    'has_partner' => false,
                    'images_pending_manual_upload' => true,
                ],
                'seo' => [
                    'es' => [
                        'title' => 'ERP CIETE — Gestión interna de trabajos, pedidos y facturación | Abaco Developments',
                        'description' => 'Aplicación interna a medida para centralizar trabajos, pedidos, facturas, usuarios, roles y trazabilidad operativa en CIETE Arquitectos S.L.',
                    ],
                    'en' => [
                        'title' => 'ERP CIETE — Internal management of jobs, orders and invoicing | Abaco Developments',
                        'description' => 'Custom internal ERP platform to centralize jobs, orders, invoicing, users, roles and operational traceability for CIETE Arquitectos S.L.',
                    ],
                ],
            ],
        ];

        foreach ($projects as $data) {
            $attributes = [
                'title' => $data['title'],
                'slug' => $data['slug'],
                'summary' => $data['summary'],
                'description' => $data['description'],
                'challenge' => $data['challenge'],
                'solution' => $data['solution'],
                'result' => $data['result'],
                'cover_image' => null,
                'thumbnail_image' => null,
                'gallery' => [],
                'technologies' => $data['technologies'],
                'status' => ProjectStatus::Published->value,
                'year' => $data['year'],
                'client_name' => $data['client_name'],
                'client_partner_id' => null,
                'github_url' => null,
                'external_url' => null,
                'permission_status' => PermissionStatus::Approved->value,
                'permission_notes' => $data['permission_notes'],
                'show_on_home' => false,
                'show_in_projects' => true,
                'show_in_collaborations' => false,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => $data['sort_order'],
                'settings' => $data['settings'],
            ];

            // Idempotente: localizar por slug ES (columna generada) sin duplicar.
            $project = Project::query()->where('slug_es', $data['slug']['es'])->first();

            if ($project) {
                $project->update($attributes);
            } else {
                $project = Project::create($attributes);
            }

            // SEO por entidad (patrón polimórfico de ServiceSeeder).
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
        }
    }
}

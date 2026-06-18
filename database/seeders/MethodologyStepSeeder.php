<?php

namespace Database\Seeders;

use App\Models\MethodologyStep;
use Illuminate\Database\Seeder;

class MethodologyStepSeeder extends Seeder
{
    /**
     * Seed the documented methodology sequence.
     */
    public function run(): void
    {
        $steps = [
            [
                1,
                ['es' => 'Análisis', 'en' => 'Analysis'],
                ['es' => 'Entendemos el contexto, objetivos y restricciones antes de proponer alcance.', 'en' => 'We understand context, goals and constraints before proposing scope.'],
                ['es' => 'Analizamos tu situación, procesos y necesidades para evitar soluciones genéricas.', 'en' => 'We review your situation, processes and needs to avoid generic solutions.'],
                ['es' => 'Resumen de contexto, objetivos y restricciones detectadas.', 'en' => 'Summary of detected context, goals and constraints.'],
                'search',
                null,
                false,
                false,
            ],
            [
                2,
                ['es' => 'Estudio inicial gratuito', 'en' => 'Free initial study'],
                ['es' => 'Antes de pedirte que avances, preferimos enseñarte cómo podría verse.', 'en' => 'Before asking you to move forward, we prefer to show you what it could look like.'],
                ['es' => 'Preparamos un primer enfoque visual y técnico para validar encaje antes de construir.', 'en' => 'We prepare an initial visual and technical approach to validate fit before building.'],
                ['es' => 'Primer enfoque visual y técnico para validar encaje antes de construir.', 'en' => 'Initial visual and technical approach to validate fit before building.'],
                'sparkles',
                'Gratuito',
                true,
                true,
            ],
            [
                3,
                ['es' => 'Propuesta y enfoque', 'en' => 'Proposal and approach'],
                ['es' => 'Definimos alcance, prioridades y una ruta de entrega realista.', 'en' => 'We define scope, priorities and a realistic delivery path.'],
                ['es' => 'Convertimos el análisis en un plan de ejecución claro, medible y revisable.', 'en' => 'We turn the analysis into a clear, measurable and reviewable execution plan.'],
                ['es' => 'Propuesta de alcance, prioridades y ruta de entrega.', 'en' => 'Proposal of scope, priorities and delivery path.'],
                'route',
                null,
                false,
                false,
            ],
            [
                4,
                ['es' => 'Desarrollo', 'en' => 'Development'],
                ['es' => 'Construimos rápido con control técnico, revisión y criterio senior.', 'en' => 'We build quickly with technical control, review and senior judgement.'],
                ['es' => 'Usamos herramientas modernas, IA supervisada y procesos propios sin sacrificar mantenibilidad.', 'en' => 'We use modern tools, supervised AI and internal processes without sacrificing maintainability.'],
                ['es' => 'Construcción del producto sobre la propuesta validada.', 'en' => 'Product build based on the validated proposal.'],
                'code',
                null,
                false,
                false,
            ],
            [
                5,
                ['es' => 'Revisión', 'en' => 'Review'],
                ['es' => 'Validamos resultado, accesibilidad, SEO técnico y funcionamiento.', 'en' => 'We validate outcome, accessibility, technical SEO and behavior.'],
                ['es' => 'Probamos lo entregado, ajustamos detalles y evitamos dejar deuda innecesaria.', 'en' => 'We test the delivery, refine details and avoid unnecessary debt.'],
                ['es' => 'Informe de pruebas, ajustes y verificación de calidad.', 'en' => 'Testing report, fixes and quality verification.'],
                'check-circle',
                null,
                false,
                false,
            ],
            [
                6,
                ['es' => 'Entrega', 'en' => 'Delivery'],
                ['es' => 'Dejamos una base preparada para operar, medir y evolucionar.', 'en' => 'We leave a base ready to operate, measure and evolve.'],
                ['es' => 'Entregamos con documentación mínima útil y próximos pasos claros.', 'en' => 'We deliver with useful minimum documentation and clear next steps.'],
                ['es' => 'Entrega final con documentación mínima útil y próximos pasos.', 'en' => 'Final delivery with useful minimum documentation and next steps.'],
                'rocket',
                null,
                false,
                false,
            ],
        ];

        foreach ($steps as [$number, $title, $summary, $description, $deliverable, $icon, $badge, $isFreeInitialStudy, $isFeatured]) {
            MethodologyStep::updateOrCreate(
                ['number' => $number],
                [
                    'title' => $title,
                    'slug' => [
                        'es' => str($title['es'])->slug()->toString(),
                        'en' => str($title['en'])->slug()->toString(),
                    ],
                    'summary' => $summary,
                    'description' => $description,
                    'deliverable' => $deliverable,
                    'icon' => $icon,
                    'badge' => $badge,
                    'is_free_initial_study' => $isFreeInitialStudy,
                    'is_featured' => $isFeatured,
                    'sort_order' => $number,
                    'is_active' => true,
                    'settings' => null,
                ],
            );
        }
    }
}

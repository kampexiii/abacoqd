<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Seed documented operational FAQs for the future assistant.
     */
    public function run(): void
    {
        $faqs = [
            [
                'services',
                'services_overview',
                ['es' => '¿Qué servicios ofrecéis?', 'en' => 'What services do you offer?'],
                ['es' => 'Trabajamos en desarrollo web rápido, aplicaciones a medida, automatización con IA, CRM, datos, procesos, integraciones digitales, MVPs y prototipos.', 'en' => 'We work on fast web development, custom applications, AI automation, CRM, data, processes, digital integrations, MVPs and prototypes.'],
                '/servicios',
            ],
            [
                'process',
                'project_time',
                ['es' => '¿Cuánto tarda un proyecto?', 'en' => 'How long does a project take?'],
                ['es' => 'Depende del alcance. Trabajamos por fases con entregas rápidas: un MVP o prototipo puede estar en pocas semanas. Tras una primera consulta te damos una estimación concreta.', 'en' => 'It depends on the scope. We work in phases with fast deliveries: an MVP or prototype can be ready in a few weeks. After a first consultation we give you a concrete estimate.'],
                '/metodologia',
            ],
            [
                'budget',
                'project_budget',
                ['es' => '¿Cómo se presupuesta?', 'en' => 'How is a project quoted?'],
                ['es' => 'Cada proyecto se presupuesta a medida según alcance, integraciones y plazos. Cuéntanos qué necesitas en una consulta y preparamos una propuesta adaptada, sin compromiso.', 'en' => 'Each project is quoted individually based on scope, integrations and timeline. Tell us what you need in a consultation and we will prepare a tailored proposal, with no obligation.'],
                '/contacto',
            ],
            [
                'ai',
                'ai_usage',
                ['es' => '¿Cómo usáis la IA en los proyectos?', 'en' => 'How do you use AI in projects?'],
                ['es' => 'Usamos IA y herramientas internas propias para acelerar el desarrollo, automatizar procesos y reducir costes, manteniendo calidad y control humano en cada fase.', 'en' => 'We use AI and our own in-house tools to speed up development, automate processes and cut costs, keeping quality and human oversight at every phase.'],
                '/metodologia',
            ],
            [
                'booking',
                'how_to_book',
                ['es' => '¿Cómo reservo una consulta?', 'en' => 'How do I book a consultation?'],
                ['es' => 'Puedes reservar una consulta desde la página de reserva. Si la reserva online no está disponible, te ofrecemos contacto directo por email o WhatsApp.', 'en' => 'You can book a consultation from the booking page. If online booking is not available, we offer direct contact by email or WhatsApp.'],
                '/reserva',
            ],
            [
                'contact',
                'contact_channels',
                ['es' => '¿Cómo puedo contactar?', 'en' => 'How can I get in touch?'],
                ['es' => 'Puedes escribir a info@abacoqd.com, llamar al +34 91 020 00 89 o usar WhatsApp en el +34 647 51 81 00. También desde la página de contacto.', 'en' => 'You can email info@abacoqd.com, call +34 91 020 00 89 or use WhatsApp at +34 647 51 81 00. You can also use the contact page.'],
                '/contacto',
            ],
        ];

        foreach ($faqs as $index => [$category, $intent, $question, $answer, $redirectUrl]) {
            Faq::updateOrCreate(
                ['intent' => $intent],
                [
                    'question' => $question,
                    'answer' => $answer,
                    'category' => $category,
                    'redirect_url' => $redirectUrl,
                    'show_in_chatbot' => true,
                    'show_on_page' => true,
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ],
            );
        }
    }
}

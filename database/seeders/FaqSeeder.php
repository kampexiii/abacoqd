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
                ['es' => '¿Qué servicios ofrece Abaco Developments?', 'en' => 'What services does Abaco Developments offer?'],
                ['es' => 'Trabajamos en desarrollo web rápido, aplicaciones a medida, automatización con IA, CRM, datos, procesos, integraciones digitales, MVPs y prototipos.', 'en' => 'We work on fast web development, custom applications, AI automation, CRM, data, processes, digital integrations, MVPs and prototypes.'],
            ],
            [
                'contact',
                'contact_channels',
                ['es' => '¿Cómo puedo contactar?', 'en' => 'How can I get in touch?'],
                ['es' => 'Puedes escribir a info@abacodev.com, llamar al +34 91 020 00 89 o usar WhatsApp en el +34 647 51 81 00.', 'en' => 'You can email info@abacodev.com, call +34 91 020 00 89 or use WhatsApp at +34 647 51 81 00.'],
            ],
            [
                'booking',
                'booking_fallback',
                ['es' => '¿Qué ocurre si la reserva no está activa?', 'en' => 'What happens if booking is not enabled?'],
                ['es' => 'La página de reserva mostrará un fallback a contacto o WhatsApp hasta confirmar el proveedor definitivo.', 'en' => 'The booking page will show a contact or WhatsApp fallback until the final provider is confirmed.'],
            ],
        ];

        foreach ($faqs as $index => [$category, $intent, $question, $answer]) {
            Faq::updateOrCreate(
                ['intent' => $intent],
                [
                    'question' => $question,
                    'answer' => $answer,
                    'category' => $category,
                    'show_in_chatbot' => true,
                    'show_on_page' => false,
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ],
            );
        }
    }
}

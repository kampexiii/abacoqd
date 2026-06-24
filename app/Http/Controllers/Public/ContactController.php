<?php

namespace App\Http\Controllers\Public;

use App\Enums\ContactMessageStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreContactMessageRequest;
use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use App\Models\Service;
use App\Support\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Show the contact form.
     * docs/07_VISTAS/PUBLIC_06_CONTACTO_RESERVA.md (sección A).
     */
    public function create(Request $request): Response
    {
        $services = Service::query()
            ->published()
            ->active()
            ->ordered()
            ->get(['id', 'title', 'slug_es', 'slug_en']);

        $requestedSlug = $request->query('servicio');

        $preselectedServiceId = $requestedSlug
            ? $services->first(function (Service $service) use ($requestedSlug): bool {
                return $service->slug_es === $requestedSlug || $service->slug_en === $requestedSlug;
            })?->id
            : null;

        return Inertia::render('Public/Contact', [
            'services' => $services,
            'preselectedServiceId' => $preselectedServiceId,
            'submitted' => (bool) $request->session()->get('contactSubmitted'),
        ]);
    }

    /**
     * Persist a contact message submitted from the public form.
     */
    public function store(StoreContactMessageRequest $request): RedirectResponse
    {
        $contactMessage = ContactMessage::create([
            'service_id' => $request->validated('service_id'),
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'phone' => $request->validated('phone'),
            'company' => $request->validated('company'),
            'message' => $request->validated('message'),
            'preferred_contact_method' => 'email',
            'privacy_accepted_at' => now(),
            'commercial_consent' => $request->boolean('marketing_consent'),
            'commercial_consent_at' => $request->boolean('marketing_consent') ? now() : null,
            'source' => 'web',
            'status' => ContactMessageStatus::New->value,
            'ip_address' => $request->ip(),
            'user_agent' => (string) $request->userAgent(),
        ]);

        // El lead ya está persistido: si la notificación por email falla (SMTP
        // caído o mal configurado) se registra y se sigue, en vez de devolver un
        // 500 al visitante por algo que no afecta a la captura del contacto.
        try {
            Mail::to(SiteSettings::formRecipient())
                ->send(new ContactMessageReceived($contactMessage));
        } catch (\Throwable $e) {
            Log::error('No se pudo enviar la notificación de contacto.', [
                'contact_message_id' => $contactMessage->id,
                'exception' => $e->getMessage(),
            ]);
        }

        return to_route('contact.show')->with('contactSubmitted', true);
    }
}

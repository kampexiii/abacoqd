<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContactMessageStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ContactMessageUpdateRequest;
use App\Models\ContactMessage;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Registro interno de leads/contactos recibidos desde el formulario público
 * (Fase 4). No es una bandeja de email: solo lectura, cambio de estado, notas
 * internas y purga. No se envían respuestas desde aquí.
 */
class ContactMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ContactMessage::query()->with('service')->latest();

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        if ($serviceId = $request->integer('service_id')) {
            $query->where('service_id', $serviceId);
        }

        if ($email = trim($request->string('email')->toString())) {
            $query->where('email', 'like', "%{$email}%");
        }

        if ($name = trim($request->string('name')->toString())) {
            $query->where('name', 'like', "%{$name}%");
        }

        if ($company = trim($request->string('company')->toString())) {
            $query->where('company', 'like', "%{$company}%");
        }

        if ($text = trim($request->string('q')->toString())) {
            $query->where('message', 'like', "%{$text}%");
        }

        if ($from = $request->string('date_from')->toString()) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to = $request->string('date_to')->toString()) {
            $query->whereDate('created_at', '<=', $to);
        }

        $contacts = $query
            ->paginate(15)
            ->withQueryString()
            ->through(fn (ContactMessage $contact): array => $this->adminSummary($contact));

        $services = Service::query()->orderBy('id')->get(['id', 'title']);

        return Inertia::render('Admin/Contacts/Index', [
            'contacts' => $contacts,
            'services' => $services->map(fn (Service $service): array => [
                'id' => $service->id,
                'title' => $service->title,
            ])->values(),
            'statuses' => array_map(fn (ContactMessageStatus $status): string => $status->value, ContactMessageStatus::cases()),
            'filters' => $request->only(['status', 'service_id', 'email', 'name', 'company', 'q', 'date_from', 'date_to']),
        ]);
    }

    public function show(ContactMessage $contactMessage): Response
    {
        $contactMessage->load('service');

        return Inertia::render('Admin/Contacts/Show', [
            'contact' => $this->adminRecord($contactMessage),
        ]);
    }

    public function update(ContactMessageUpdateRequest $request, ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->update([
            'status' => $request->validated('status'),
            'internal_notes' => $request->validated('internal_notes'),
        ]);

        return back()->with('toast', ['type' => 'success', 'message' => 'Contacto actualizado.']);
    }

    public function destroy(Request $request, ContactMessage $contactMessage): RedirectResponse
    {
        if (! $this->canDestroy($request)) {
            return back()->with('toast', ['type' => 'error', 'message' => 'No tienes permiso para eliminar contactos.']);
        }

        $contactMessage->delete();

        return to_route('admin.contacts.index')->with('toast', ['type' => 'success', 'message' => 'Contacto eliminado.']);
    }

    public function purge(Request $request): RedirectResponse
    {
        if (! $this->canDestroy($request)) {
            return back()->with('toast', ['type' => 'error', 'message' => 'No tienes permiso para purgar contactos.']);
        }

        $ids = $request->input('ids');

        if (is_array($ids) && $ids !== []) {
            ContactMessage::query()->whereIn('id', $ids)->delete();

            return to_route('admin.contacts.index')->with('toast', ['type' => 'success', 'message' => 'Contactos seleccionados eliminados.']);
        }

        if ($request->string('confirmation')->toString() !== 'PURGAR') {
            return back()->with('toast', ['type' => 'error', 'message' => 'Escribe PURGAR para confirmar el borrado total.']);
        }

        ContactMessage::query()->delete();

        return to_route('admin.contacts.index')->with('toast', ['type' => 'success', 'message' => 'Todos los contactos han sido purgados.']);
    }

    private function canDestroy(Request $request): bool
    {
        $user = $request->user();

        return $user !== null && in_array($user->role, [UserRole::SuperAdmin, UserRole::Admin], true);
    }

    /**
     * @return array<string, mixed>
     */
    private function adminSummary(ContactMessage $contact): array
    {
        return [
            'id' => $contact->id,
            'name' => $contact->name,
            'email' => $contact->email,
            'company' => $contact->company,
            'status' => $contact->status->value,
            'serviceTitle' => $contact->service?->title,
            'createdAt' => $contact->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminRecord(ContactMessage $contact): array
    {
        return [
            ...$this->adminSummary($contact),
            'phone' => $contact->phone,
            'message' => $contact->message,
            'internalNotes' => $contact->internal_notes,
            'ipAddress' => $contact->ip_address,
            'userAgent' => $contact->user_agent,
        ];
    }
}

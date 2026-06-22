<x-mail::message>
# Nuevo contacto desde AbacoQD

**Nombre:** {{ $contactMessage->name }}

**Email:** {{ $contactMessage->email }}

@if ($contactMessage->phone)
**Teléfono:** {{ $contactMessage->phone }}
@endif

@if ($contactMessage->company)
**Empresa:** {{ $contactMessage->company }}
@endif

@if ($serviceTitle)
**Servicio de interés:** {{ $serviceTitle }}
@endif

**Fecha/hora:** {{ $contactMessage->created_at?->format('d/m/Y H:i') }}

@if ($contactMessage->source)
**Origen:** {{ $contactMessage->source }}
@endif

**Mensaje:**

{{ $contactMessage->message }}

<x-mail::panel>
Este mensaje ha quedado registrado en el panel de administración como contacto/lead, en estado "{{ $contactMessage->status?->value }}".
</x-mail::panel>
</x-mail::message>

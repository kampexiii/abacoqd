<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use InvalidArgumentException;

/**
 * Bloquea SVG peligroso (logos de partners/proyectos pueden llegar en SVG).
 *
 * Un SVG es XML+markup: puede llevar `<script>`, manejadores `on*=`,
 * `javascript:` en `href`, o referencias a recursos externos. Como el logo se
 * sirve después con `Content-Type: image/svg+xml` (navegación directa al
 * archivo, no solo `<img>`), un SVG con script ejecuta en el mismo origen del
 * sitio. Sin dependencias nuevas: usa `DOMDocument`/libxml (núcleo de PHP),
 * no un sanitizador de Composer. Bloquea en vez de reescribir: un logo
 * rechazado da un error claro; reescribir el XML a ciegas es más fácil de
 * hacer mal.
 *
 * Usado tanto por la validación de subida (`Rules\SafeSvgUpload`, antes de
 * guardar nada) como por los servicios de media (defensa en profundidad para
 * cualquier otra vía de escritura, p. ej. seeders).
 */
class SvgSafetyGuard
{
    /**
     * @throws InvalidArgumentException si el SVG no es seguro.
     */
    public static function ensureSafe(string $contents): void
    {
        if (stripos($contents, '<!entity') !== false) {
            throw new InvalidArgumentException('El SVG declara entidades externas (XXE), no permitido.');
        }

        $previousErrors = libxml_use_internal_errors(true);

        $document = new DOMDocument;
        $loaded = $document->loadXML($contents, LIBXML_NONET);

        libxml_clear_errors();
        libxml_use_internal_errors($previousErrors);

        if (! $loaded || ! $document->documentElement instanceof DOMElement) {
            throw new InvalidArgumentException('El SVG no es XML válido.');
        }

        if (strtolower($document->documentElement->localName) !== 'svg') {
            throw new InvalidArgumentException('El elemento raíz del archivo no es <svg>.');
        }

        self::assertElementIsSafe($document->documentElement);
    }

    private static function assertElementIsSafe(DOMElement $element): void
    {
        $deniedTags = [
            'script', 'foreignobject', 'iframe', 'embed', 'object',
            'audio', 'video', 'animate', 'animatetransform', 'animatemotion', 'set',
        ];

        if (in_array(strtolower($element->localName), $deniedTags, true)) {
            throw new InvalidArgumentException("Elemento no permitido en el SVG: <{$element->localName}>.");
        }

        foreach ($element->attributes ?? [] as $attribute) {
            $name = strtolower($attribute->localName ?? $attribute->name);
            $value = trim((string) $attribute->value);
            $normalizedValue = strtolower(preg_replace('/[\s\x00-\x1f]+/', '', $value) ?? $value);

            if (str_starts_with($name, 'on')) {
                throw new InvalidArgumentException("Atributo de evento no permitido en el SVG: `{$name}`.");
            }

            if (str_contains($normalizedValue, 'javascript:') || str_contains($normalizedValue, 'data:text/html')) {
                throw new InvalidArgumentException("Atributo `{$name}` con esquema no permitido en el SVG.");
            }

            $isReference = $name === 'href' || $name === 'xlink:href' || str_ends_with($name, ':href');

            if ($isReference && $value !== '' && ! str_starts_with($value, '#') && ! str_starts_with($normalizedValue, 'data:image/')) {
                throw new InvalidArgumentException("Referencia externa no permitida en el SVG: `{$name}`.");
            }
        }

        foreach ($element->childNodes as $child) {
            if ($child instanceof DOMElement) {
                self::assertElementIsSafe($child);
            }
        }
    }
}

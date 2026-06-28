<?php

namespace App\Rules;

use App\Support\SvgSafetyGuard;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;
use InvalidArgumentException;

/**
 * Aplica `SvgSafetyGuard` durante la validación del FormRequest, antes de que
 * el controlador guarde nada. Así un SVG peligroso falla con un 422 normal en
 * el campo (`logo`/`logo_dark`), en vez de reventar a medio guardar el
 * registro (el modelo ya se persiste antes de procesar la imagen en
 * `ProjectController`/`PartnerController`).
 *
 * No hace nada con archivos que no sean SVG: el resto de formatos (PNG/JPEG/
 * WebP) ya quedan cubiertos por `mimes:` + `image`/`file` en el FormRequest.
 */
class SafeSvgUpload implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value instanceof UploadedFile) {
            return;
        }

        $isSvg = strtolower($value->getClientOriginalExtension()) === 'svg'
            || $value->getMimeType() === 'image/svg+xml';

        if (! $isSvg) {
            return;
        }

        $contents = @file_get_contents($value->getRealPath());

        if ($contents === false || ! str_contains($contents, '<svg')) {
            $fail('El archivo no es un SVG válido.');

            return;
        }

        try {
            SvgSafetyGuard::ensureSafe($contents);
        } catch (InvalidArgumentException) {
            $fail('El SVG contiene contenido no permitido (scripts, eventos o referencias externas) y se ha rechazado.');
        }
    }
}

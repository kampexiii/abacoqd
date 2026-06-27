<?php

namespace App\Services\Content;

use App\Models\Service;

/**
 * Vuelca el contenido actual de `services` a un array PHP versionable en
 * `database/seeders/snapshots/services.generated.php`, para poder
 * regenerar el catálogo si se pierde contenido editado desde el admin.
 *
 * Se invoca explícitamente tras crear/editar/archivar un servicio desde
 * `Admin\ServiceController`; no se cuelga de un evento de modelo (`saved()`)
 * para que tests/factories/seeders no ensucien el snapshot con datos de
 * prueba.
 */
class ServiceSnapshotWriter
{
    public function __construct(
        private readonly ?string $path = null,
    ) {}

    public function write(): void
    {
        // Sin ruta explícita (uso normal vía DI desde el admin), en entorno de
        // test no escribimos: si no, cada test que pase por
        // store()/update()/destroy() sobreescribiría el snapshot real con
        // datos de factory. Con ruta explícita (test dedicado del writer)
        // sí se escribe, para poder probar la lógica de exportación.
        if ($this->path === null && app()->environment('testing')) {
            return;
        }

        $services = Service::query()
            ->ordered()
            ->get()
            ->map(fn (Service $service): array => [
                'title' => $service->title,
                'slug' => $service->slug,
                'summary' => $service->summary,
                'description' => $service->description,
                'icon' => $service->icon,
                'image' => $service->image,
                'cta' => $service->cta,
                'status' => $service->status->value,
                'sort_order' => $service->sort_order,
                'is_featured' => $service->is_featured,
                'is_active' => $service->is_active,
                'show_on_home' => $service->show_on_home,
                'is_detail_enabled' => $service->is_detail_enabled,
                'settings' => $service->settings,
            ])
            ->all();

        $directory = dirname($this->path());

        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        file_put_contents($this->path(), $this->render($services));
    }

    private function path(): string
    {
        return $this->path ?? database_path('seeders/snapshots/services.generated.php');
    }

    /**
     * @param  array<int, array<string, mixed>>  $services
     */
    private function render(array $services): string
    {
        $comment = "<?php\n\n".
            "// Snapshot generado automáticamente desde /admin/services.\n".
            "// No editar a mano: se sobreescribe en cada alta, edición o archivado de un servicio.\n\n".
            'return ';

        return $comment.$this->export($services, 0).";\n";
    }

    private function export(mixed $value, int $depth): string
    {
        if (is_array($value)) {
            return $this->exportArray($value, $depth);
        }

        if (is_string($value)) {
            return "'".str_replace(['\\', "'"], ['\\\\', "\\'"], $value)."'";
        }

        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if ($value === null) {
            return 'null';
        }

        return (string) $value;
    }

    /**
     * @param  array<int|string, mixed>  $value
     */
    private function exportArray(array $value, int $depth): string
    {
        if ($value === []) {
            return '[]';
        }

        $indent = str_repeat('    ', $depth + 1);
        $closingIndent = str_repeat('    ', $depth);
        $isList = array_is_list($value);

        $lines = [];

        foreach ($value as $key => $item) {
            $exported = $this->export($item, $depth + 1);

            $lines[] = $isList
                ? "{$indent}{$exported},"
                : "{$indent}'{$key}' => {$exported},";
        }

        return "[\n".implode("\n", $lines)."\n{$closingIndent}]";
    }
}

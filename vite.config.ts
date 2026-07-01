import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const esToolkitGlobalThisShim = fileURLToPath(
    new URL('./resources/js/vendor/es-toolkit-global-this.ts', import.meta.url),
);

function isEsToolkitGlobalThis(source: string, importer?: string): boolean {
    if (!source.includes('globalThis')) {
        return false;
    }

    const normalizedSource = source.replace(/\\/g, '/');
    const normalizedImporter = importer?.replace(/\\/g, '/') ?? '';
    const isEsToolkitImporter = normalizedImporter.includes('/node_modules/es-toolkit/dist/');
    const isEsToolkitRelativeGlobalThis =
        isEsToolkitImporter &&
        [
            './globalThis.mjs',
            './globalThis.js',
            '../_internal/globalThis.mjs',
            '../_internal/globalThis.js',
        ].includes(normalizedSource);

    return (
        source === 'es-toolkit/dist/_internal/globalThis.mjs' ||
        source === 'es-toolkit/dist/_internal/globalThis.js' ||
        normalizedSource.endsWith('node_modules/es-toolkit/dist/_internal/globalThis.mjs') ||
        normalizedSource.endsWith('node_modules/es-toolkit/dist/_internal/globalThis.js') ||
        isEsToolkitRelativeGlobalThis
    );
}

function cspSafeEsToolkitGlobalThis(): Plugin {
    return {
        name: 'csp-safe-es-toolkit-global-this',
        enforce: 'pre',
        resolveId(source, importer) {
            if (isEsToolkitGlobalThis(source, importer)) {
                return esToolkitGlobalThisShim;
            }

            return null;
        },
    };
}

export default defineConfig({
    optimizeDeps: {
        rolldownOptions: {
            plugins: [cspSafeEsToolkitGlobalThis()],
        },
    },
    build: {
        rollupOptions: {
            output: {
                // Agrupa TODOS los iconos de lucide-react en un único chunk
                // `icons` en vez de decenas de archivos minúsculos (uno por
                // icono). Reduce el número de peticiones y de <link
                // modulepreload> del <head> en cada página, acortando el árbol
                // de dependencias de red (la principal palanca de perf en móvil).
                manualChunks(id: string) {
                    if (id.includes('node_modules/lucide-react')) {
                        return 'icons';
                    }

                    return undefined;
                },
            },
        },
    },
    plugins: [
        cspSafeEsToolkitGlobalThis(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
});

/**
 * Cubo decorativo para heroes internos públicos. CSS puro (sin Three.js,
 * sin dependencias), girando lentamente con `prefers-reduced-motion` respetado.
 * Implementación propia y aislada: no reutiliza ni modifica
 * `AbacoCrystalCube.tsx` (zona protegida del hero principal).
 *
 * Las 6 caras llevan el isotipo de AbacoQD y usan tokens de la paleta para
 * leerse igual en modo claro y oscuro (cara de cristal translúcida con borde
 * teal; isotipo a color sobre claro / versión inversa sobre oscuro).
 */
// translateZ = mitad de la arista de la cara (w-44 = 176px → 88px) para que
// las 6 caras cierren el cubo. El cubo solo se muestra en `sm:` y superiores.
const FACE_TRANSFORMS: readonly string[] = [
    'translateZ(88px)',
    'rotateY(180deg) translateZ(88px)',
    'rotateY(90deg) translateZ(88px)',
    'rotateY(-90deg) translateZ(88px)',
    'rotateX(90deg) translateZ(88px)',
    'rotateX(-90deg) translateZ(88px)',
];

function CubeFace({ transform }: { readonly transform: string }) {
    return (
        <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl border border-qd-teal/40 bg-qd-white/60 backdrop-blur-sm backface-hidden dark:bg-qd-surface/85"
            style={{ transform }}
        >
            <img
                src="/assets/branding/marca/logos/abacoqd-isotipo.svg"
                alt=""
                className="h-16 w-16 opacity-90 dark:hidden"
            />
            <img
                src="/assets/branding/marca/logos/abacoqd-isotipo-inverse.svg"
                alt=""
                className="hidden h-16 w-16 opacity-90 dark:block"
            />
        </div>
    );
}

export default function MethodologyCube() {
    return (
        <div
            aria-hidden="true"
            className="hidden h-44 w-44 shrink-0 perspective-[1000px] sm:block"
        >
            <div
                className="relative h-full w-full animate-[qd-mini-cube-spin_16s_linear_infinite] transform-3d motion-reduce:animate-none"
                style={{ transform: 'rotateX(-18deg)' }}
            >
                {FACE_TRANSFORMS.map((transform) => (
                    <CubeFace key={transform} transform={transform} />
                ))}
            </div>
        </div>
    );
}

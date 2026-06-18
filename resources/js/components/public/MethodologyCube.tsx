/**
 * Cubo decorativo del hero de /metodologia. CSS puro (sin Three.js, sin
 * dependencias), girando lentamente con `prefers-reduced-motion` respetado.
 * Implementación propia y aislada: no reutiliza ni modifica
 * `AbacoCrystalCube.tsx` (zona protegida del hero principal).
 */
export default function MethodologyCube() {
    const faceClass =
        'absolute inset-0 rounded-2xl border [backface-visibility:hidden]';

    return (
        <div
            aria-hidden="true"
            className="hidden h-32 w-32 shrink-0 [perspective:900px] sm:block sm:h-36 sm:w-36"
        >
            <div
                className="relative h-full w-full animate-[qd-mini-cube-spin_16s_linear_infinite] motion-reduce:animate-none [transform-style:preserve-3d]"
                style={{ transform: 'rotateX(-18deg)' }}
            >
                <div
                    className={`${faceClass} flex items-center justify-center border-qd-teal/40 bg-qd-surface/90`}
                    style={{ transform: 'translateZ(64px)' }}
                >
                    <img
                        src="/assets/branding/marca/logos/abacoqd-isotipo-inverse.svg"
                        alt=""
                        className="h-12 w-12 opacity-90"
                    />
                </div>
                <div
                    className={`${faceClass} border-qd-teal/25 bg-qd-ink/80`}
                    style={{ transform: 'rotateY(90deg) translateZ(64px)' }}
                />
                <div
                    className={`${faceClass} border-qd-teal/15 bg-qd-ink/60`}
                    style={{ transform: 'rotateY(-90deg) translateZ(64px)' }}
                />
                <div
                    className={`${faceClass} border-qd-teal/20 bg-qd-surface/70`}
                    style={{ transform: 'rotateX(90deg) translateZ(64px)' }}
                />
                <div
                    className={`${faceClass} border-qd-teal/10 bg-qd-ink/90`}
                    style={{ transform: 'rotateY(180deg) translateZ(64px)' }}
                />
            </div>
        </div>
    );
}

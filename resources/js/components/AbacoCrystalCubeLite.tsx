import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

/**
 * Variante experimental LIGERA del cubo del hero (rama
 * experiment/lightweight-hero-cube). NO usa Three.js/WebGL: es un cubo CSS 3D
 * con caras de cristal + un núcleo de energía simulado con gradientes + una
 * dispersión de fragmentos ligada al scroll. Objetivo: conservar la sensación
 * (cubo protagonista, volumen, energía, descomposición) sacando Three.js del
 * bundle inicial de Home.
 *
 * No sustituye a `AbacoCrystalCube.tsx` (que se conserva intacto); AbacoHero
 * elige la variante con una constante.
 *
 * Solo se animan `transform`/`opacity` (compuestas). Respeta reduced-motion del
 * SO y del widget de accesibilidad (clase `html.a11y-reduce-motion`), pausa el
 * trabajo de scroll cuando el hero sale del viewport y limpia sus listeners.
 */

// 16 fragmentos en lugar de los 42 del cubo WebGL: bastan para sugerir la
// descomposición sin el coste de 42 nodos. Disposición determinista por índice
// (dirección de dispersión, profundidad Z, tamaño, retardo y eje/velocidad de
// giro fijos), así el cubo se descompone igual en cada carga.
const SHARD_COUNT = 16;

const rand = (seed: number): number => {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;

    return value - Math.floor(value);
};

type Shard = {
    readonly sx: number;
    readonly sy: number;
    readonly sz: number;
    readonly size: number;
    readonly delay: number;
    readonly depth: number;
    readonly ax: number;
    readonly ay: number;
    readonly az: number;
    readonly spin: number;
};

const SHARDS: readonly Shard[] = Array.from({ length: SHARD_COUNT }, (_, i) => {
    const angle = rand(i * 3 + 1) * Math.PI * 2;
    const distance = 95 + rand(i * 5 + 2) * 150;

    return {
        sx: Math.cos(angle) * distance,
        sy: Math.sin(angle) * distance * 0.82,
        // Profundidad ±130px para que se dispersen en 3D, no en un plano.
        sz: (rand(i * 9 + 6) - 0.5) * 260,
        size: 16 + rand(i * 11 + 4) * 30,
        delay: rand(i * 13 + 5) * 4,
        depth: 0.5 + rand(i * 7 + 3) * 0.9,
        ax: rand(i * 17 + 7),
        ay: rand(i * 19 + 8),
        // az siempre ≥0.3: evita un eje de rotación degenerado (0 0 0).
        az: 0.3 + rand(i * 23 + 9) * 0.7,
        spin: 120 + rand(i * 29 + 10) * 240,
    };
});

// Las 6 caras cierran el cubo; `--qd-litecube-half` = mitad de la arista.
const FACE_TRANSFORMS: readonly string[] = [
    'translateZ(var(--qd-litecube-half))',
    'rotateY(180deg) translateZ(var(--qd-litecube-half))',
    'rotateY(90deg) translateZ(var(--qd-litecube-half))',
    'rotateY(-90deg) translateZ(var(--qd-litecube-half))',
    'rotateX(90deg) translateZ(var(--qd-litecube-half))',
    'rotateX(-90deg) translateZ(var(--qd-litecube-half))',
];

export default function AbacoCrystalCubeLite() {
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const root = rootRef.current;

        if (!root) {
            return undefined;
        }

        const prefersReduced = (): boolean =>
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            document.documentElement.classList.contains('a11y-reduce-motion');

        let frame: number | null = null;
        let running = false;

        // Descomposición ligada al scroll del hero: al bajar, los fragmentos se
        // dispersan y el cubo retrocede. Solo escribe la variable --decompose;
        // el reparto lo hace el CSS con transform/opacity.
        const update = (): void => {
            frame = null;

            const hero = root.closest('.qd-hero');

            if (!hero) {
                return;
            }

            if (prefersReduced()) {
                root.style.setProperty('--decompose', '0');

                return;
            }

            const rect = hero.getBoundingClientRect();
            const progress = Math.max(
                0,
                Math.min(1, -rect.top / (rect.height * 0.9)),
            );
            root.style.setProperty('--decompose', progress.toFixed(3));
        };

        const request = (): void => {
            if (frame !== null || !running) {
                return;
            }

            frame = window.requestAnimationFrame(update);
        };

        const start = (): void => {
            if (running) {
                return;
            }

            running = true;
            window.addEventListener('scroll', request, { passive: true });
            window.addEventListener('resize', request);
            update();
        };

        const stop = (): void => {
            if (!running) {
                return;
            }

            running = false;
            window.removeEventListener('scroll', request);
            window.removeEventListener('resize', request);

            if (frame !== null) {
                window.cancelAnimationFrame(frame);
                frame = null;
            }
        };

        // Pausa el trabajo de scroll cuando el hero no está en viewport.
        const visibilityObserver =
            typeof IntersectionObserver !== 'undefined'
                ? new IntersectionObserver(
                      (entries) => {
                          const entry = entries[0];

                          if (!entry) {
                              return;
                          }

                          if (entry.isIntersecting) {
                              start();
                          } else {
                              stop();
                          }
                      },
                      { rootMargin: '160px' },
                  )
                : null;

        if (visibilityObserver) {
            visibilityObserver.observe(root);
        } else {
            start();
        }

        // Reevalúa al togglear "pausar animaciones" en el widget (cambia la clase
        // en <html>): recalcula --decompose; las animaciones idle las corta el CSS.
        const motionObserver = new MutationObserver(request);
        motionObserver.observe(document.documentElement, {
            attributeFilter: ['class'],
            attributes: true,
        });

        return () => {
            visibilityObserver?.disconnect();
            motionObserver.disconnect();
            stop();
        };
    }, []);

    return (
        <div ref={rootRef} className="qd-litecube" aria-hidden="true">
            <div className="qd-litecube__scene">
                <div className="qd-litecube__core" />

                <div className="qd-litecube__cube">
                    {FACE_TRANSFORMS.map((transform) => (
                        <div
                            key={transform}
                            className="qd-litecube__face"
                            style={{ transform }}
                        >
                            <img
                                src="/assets/branding/marca/logos/abacoqd-isotipo.svg"
                                alt=""
                                className="qd-litecube__logo qd-litecube__logo--light"
                            />
                            <img
                                src="/assets/branding/marca/logos/abacoqd-isotipo-inverse.svg"
                                alt=""
                                className="qd-litecube__logo qd-litecube__logo--dark"
                            />
                        </div>
                    ))}
                </div>

                <div className="qd-litecube__shards">
                    {SHARDS.map((shard, index) => (
                        <span
                            key={index}
                            className="qd-litecube__shard"
                            style={
                                {
                                    '--sx': `${shard.sx.toFixed(1)}px`,
                                    '--sy': `${shard.sy.toFixed(1)}px`,
                                    '--sz': `${shard.sz.toFixed(1)}px`,
                                    '--size': `${shard.size.toFixed(1)}px`,
                                    '--delay': `${shard.delay.toFixed(2)}s`,
                                    '--depth': shard.depth.toFixed(2),
                                    '--ax': shard.ax.toFixed(3),
                                    '--ay': shard.ay.toFixed(3),
                                    '--az': shard.az.toFixed(3),
                                    '--spin': shard.spin.toFixed(1),
                                } as CSSProperties
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

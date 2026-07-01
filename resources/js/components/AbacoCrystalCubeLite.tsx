import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

/**
 * Variante experimental LIGERA del cubo del hero (rama
 * experiment/lightweight-hero-cube). NO usa Three.js/WebGL: es un cubo CSS 3D
 * con caras de cristal + un núcleo de energía simulado con gradientes. Al hacer
 * scroll el cubo principal se encoge como bloque, un flash central oculta la
 * desaparición y desde ese flash salen MINI CUBOS (réplicas del principal, hasta
 * ~20% de su tamaño) repartidos por ancho, alto y profundidad del hero. Objetivo:
 * conservar la sensación (cubo protagonista, volumen, energía, descomposición en
 * cubos) sacando Three.js del bundle inicial de Home.
 *
 * No sustituye a `AbacoCrystalCube.tsx` (que se conserva intacto); AbacoHero
 * elige la variante con una constante.
 *
 * Solo se animan `transform`/`opacity` (compuestas). Respeta reduced-motion del
 * SO y del widget de accesibilidad (clase `html.a11y-reduce-motion`), pausa el
 * trabajo de scroll cuando el hero sale del viewport y limpia sus listeners.
 */

// 20 mini cubos (vs. 42 fragmentos del cubo WebGL): llenan mejor el hero sin
// ensuciar la composición. Cada uno es un cubo CSS 3D completo (6 caras de
// cristal con isotipo), no una cara ni un prisma plano.
const MINI_CUBE_MAX_SIZE = 0.2;

const rand = (seed: number): number => {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;

    return value - Math.floor(value);
};

const ISOTYPE_LIGHT = '/assets/branding/marca/logos/abacoqd-isotipo.svg';
const ISOTYPE_DARK = '/assets/branding/marca/logos/abacoqd-isotipo-inverse.svg';

type Shard = {
    // Destino disperso del mini cubo, en vw/vh relativos al centro del cubo, de
    // modo que las piezas se reparten por todo el ancho/alto del hero.
    readonly tx: number;
    readonly ty: number;
    // Profundidad Z en px. Menor Z = más lejos = menor escala final.
    readonly tz: number;
    // Arista base del mini cubo como fracción del cubo principal (máx. 20%).
    readonly msize: number;
    // Cercanía (0.74–1): controla escala final/opacidad para simular profundidad.
    readonly depth: number;
    // Eje y magnitud del giro que gana con el scroll.
    readonly ax: number;
    readonly ay: number;
    readonly az: number;
    readonly spin: number;
    // Inclinación base fija: garantiza que siempre se vean tres caras (aspecto
    // de cubo, no de cuadrado plano) desde que la pieza aparece.
    readonly tiltX: number;
    readonly tiltY: number;
};

type ShardTarget = Pick<Shard, 'tx' | 'ty' | 'tz'>;

// Campo final controlado y repetible, repartido por TODO el hero en cinco
// bandas verticales (de arriba del todo a abajo del todo) y balanceado
// izquierda/derecha. Las bandas extremas (muy arriba / muy abajo) sí pueden
// acercarse al centro porque quedan por encima del título o por debajo de los
// CTAs; en la franja del texto (ty ~ -30..+5) las piezas se mantienen a los
// lados (|tx| alto) para no invadir título, subtítulo ni botones. Z variado
// para dar profundidad (piezas lejanas más pequeñas y tenues).
const SHARD_TARGETS: readonly ShardTarget[] = [
    // Banda superior (por encima del título)
    { tx: -34, ty: -42, tz: -380 },
    { tx: -11, ty: -46, tz: -300 },
    { tx: 15, ty: -44, tz: -330 },
    { tx: 36, ty: -40, tz: -410 },
    // Franja superior lateral (lejos del título)
    { tx: -47, ty: -24, tz: -170 },
    { tx: -29, ty: -19, tz: -70 },
    { tx: 30, ty: -22, tz: -130 },
    { tx: 45, ty: -25, tz: -210 },
    // Franja media (muy abiertos a los lados)
    { tx: -50, ty: -3, tz: 40 },
    { tx: -33, ty: 5, tz: -30 },
    { tx: 34, ty: -2, tz: 60 },
    { tx: 49, ty: 7, tz: 120 },
    // Franja inferior media
    { tx: -44, ty: 23, tz: 190 },
    { tx: -19, ty: 27, tz: 80 },
    { tx: 19, ty: 21, tz: 150 },
    { tx: 43, ty: 25, tz: 240 },
    // Banda inferior (por debajo de los CTAs)
    { tx: -31, ty: 41, tz: 70 },
    { tx: -8, ty: 45, tz: -50 },
    { tx: 13, ty: 42, tz: 130 },
    { tx: 35, ty: 38, tz: 210 },
];

const SHARDS: readonly Shard[] = SHARD_TARGETS.map(({ tx, ty, tz }, i) => {
    const depth = 0.74 + Math.max(0, Math.min(1, (tz + 420) / 720)) * 0.26;

    return {
        tx,
        ty,
        tz,
        msize: MINI_CUBE_MAX_SIZE,
        depth,
        ax: rand(i * 17 + 7),
        ay: rand(i * 19 + 8),
        // az siempre ≥0.3: evita un eje de rotación degenerado (0 0 0).
        az: 0.3 + rand(i * 23 + 9) * 0.7,
        spin: 90 + rand(i * 29 + 10) * 200,
        tiltX: -20 - rand(i * 13 + 5) * 16,
        tiltY: 20 + rand(i * 31 + 12) * 40,
    };
});

// Las 6 caras del cubo principal permanecen cerradas: el bloque completo se
// encoge/desvanece, nunca se separan caras.
const FACE_TRANSFORMS: readonly string[] = [
    'translateZ(var(--qd-litecube-half))',
    'rotateY(180deg) translateZ(var(--qd-litecube-half))',
    'rotateY(90deg) translateZ(var(--qd-litecube-half))',
    'rotateY(-90deg) translateZ(var(--qd-litecube-half))',
    'rotateX(90deg) translateZ(var(--qd-litecube-half))',
    'rotateX(-90deg) translateZ(var(--qd-litecube-half))',
];

// Las 6 caras de cada mini cubo; `--qd-minicube-half` = mitad de su arista (se
// deriva de --msize en app.css). Misma disposición que el cubo grande → cada
// pieza es una réplica en pequeño.
const MINI_FACE_TRANSFORMS: readonly string[] = [
    'translateZ(var(--qd-minicube-half))',
    'rotateY(180deg) translateZ(var(--qd-minicube-half))',
    'rotateY(90deg) translateZ(var(--qd-minicube-half))',
    'rotateY(-90deg) translateZ(var(--qd-minicube-half))',
    'rotateX(90deg) translateZ(var(--qd-minicube-half))',
    'rotateX(-90deg) translateZ(var(--qd-minicube-half))',
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
        let targetProgress = 0;
        let currentProgress = 0;

        // Descomposición ligada al scroll del hero: el cubo principal se encoge,
        // el flash central cubre el cambio y los mini cubos viajan a destino.
        // Solo escribe --decompose; el reparto lo hace CSS con transform/opacity.
        const readTargetProgress = (): number => {
            const hero = root.closest('.qd-hero');

            if (!hero) {
                return targetProgress;
            }

            if (prefersReduced()) {
                return 0;
            }

            const rect = hero.getBoundingClientRect();
            const travel = Math.min(260, Math.max(150, rect.height * 0.25));

            return Math.max(0, Math.min(1, -rect.top / travel));
        };

        const tick = (): void => {
            frame = null;

            const delta = targetProgress - currentProgress;

            if (Math.abs(delta) < 0.001) {
                currentProgress = targetProgress;
            } else {
                currentProgress += delta * 0.18;
            }

            root.style.setProperty('--decompose', currentProgress.toFixed(3));

            if (
                running &&
                Math.abs(targetProgress - currentProgress) >= 0.001
            ) {
                frame = window.requestAnimationFrame(tick);
            }
        };

        const request = (): void => {
            if (!running) {
                return;
            }

            targetProgress = readTargetProgress();

            if (prefersReduced()) {
                currentProgress = 0;
                root.style.setProperty('--decompose', '0');

                return;
            }

            if (frame === null) {
                frame = window.requestAnimationFrame(tick);
            }
        };

        const start = (): void => {
            if (running) {
                return;
            }

            running = true;
            window.addEventListener('scroll', request, { passive: true });
            window.addEventListener('resize', request);
            request();
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
                                src={ISOTYPE_LIGHT}
                                alt=""
                                className="qd-litecube__logo qd-litecube__logo--light"
                            />
                            <img
                                src={ISOTYPE_DARK}
                                alt=""
                                className="qd-litecube__logo qd-litecube__logo--dark"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="qd-litecube__burst" />

            {/* Campo de mini cubos (fuera de la escena inclinada para repartirse
                en el plano de la pantalla). Cada uno es un cubo 3D completo. */}
            <div className="qd-litecube__shards">
                {SHARDS.map((shard, index) => (
                    <div
                        key={index}
                        className="qd-litecube__shard"
                        style={
                            {
                                '--tx': shard.tx.toFixed(2),
                                '--ty': shard.ty.toFixed(2),
                                '--tz': shard.tz.toFixed(1),
                                '--msize': shard.msize.toFixed(3),
                                '--depth': shard.depth.toFixed(2),
                                '--ax': shard.ax.toFixed(3),
                                '--ay': shard.ay.toFixed(3),
                                '--az': shard.az.toFixed(3),
                                '--spin': shard.spin.toFixed(1),
                                '--tiltX': shard.tiltX.toFixed(1),
                                '--tiltY': shard.tiltY.toFixed(1),
                            } as CSSProperties
                        }
                    >
                        <div className="qd-litecube__minicube">
                            {MINI_FACE_TRANSFORMS.map((transform) => (
                                <div
                                    key={transform}
                                    className="qd-litecube__miniface"
                                    style={{ transform }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

import type { CSSProperties } from 'react';

type ParticleStyle = CSSProperties & {
    '--delay': string;
    '--drift-x': string;
    '--drift-y': string;
    '--duration': string;
    '--opacity': string;
    '--size': string;
    '--x': string;
    '--y': string;
};

const PARTICLES = Array.from({ length: 104 }, (_, index) => {
    const x = (index * 37 + 11) % 100;
    const y = 4 + ((index * 53 + 19) % 90);
    const soft = index % 6 === 0;
    const size = soft ? 6 + (index % 4) * 2.4 : 1.7 + (index % 4) * 1;
    const opacity = soft
        ? 0.24 + (index % 3) * 0.08
        : 0.32 + (index % 5) * 0.08;
    const duration = 7 + (index % 8) * 1.2;
    const delay = -((index * 0.47) % 9);
    const driftX = ((index * 29) % 64) - 32;
    const driftY = -16 - ((index * 17) % 42);

    return { delay, driftX, driftY, duration, opacity, size, soft, x, y };
});

export default function HeroParticleField() {
    return (
        <div className="abaco-particles" aria-hidden="true">
            {PARTICLES.map((particle, index) => {
                const style: ParticleStyle = {
                    '--delay': `${particle.delay}s`,
                    '--drift-x': `${particle.driftX}px`,
                    '--drift-y': `${particle.driftY}px`,
                    '--duration': `${particle.duration}s`,
                    '--opacity': `${particle.opacity}`,
                    '--size': `${particle.size}px`,
                    '--x': `${particle.x}%`,
                    '--y': `${particle.y}%`,
                };

                return (
                    <span
                        key={`${particle.x}-${particle.y}-${index}`}
                        className={
                            particle.soft
                                ? 'abaco-particle abaco-particle--soft'
                                : 'abaco-particle'
                        }
                        style={style}
                    />
                );
            })}
        </div>
    );
}

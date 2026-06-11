import { CalendarCheck, Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';

import { useAppearance } from '@/hooks/use-appearance';

const NAV_ITEMS = [
    'Inicio',
    'Servicios',
    'Casos de Éxito',
    'Sobre nosotros',
    'Blog',
    'Contacto',
];

const toAnchor = (label: string): string => {
    return `#${label
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, '-')}`;
};

const subscribeNoop = () => () => {};

export default function FloatingHeader() {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    // El tema real solo se conoce en cliente; en SSR se asume claro. Se
    // resuelve tras hidratar para que coincida con el HTML del servidor.
    const hydrated = useSyncExternalStore(
        subscribeNoop,
        () => true,
        () => false,
    );
    const isDark = hydrated && resolvedAppearance === 'dark';

    return (
        <header className="abaco-header" aria-label="Navegación principal">
            <a
                className="abaco-header__brand"
                href="#hero"
                aria-label="Ábaco inicio"
            >
                <img
                    src="/assets/branding/marca/logos/abaco.svg"
                    alt="Ábaco Developments"
                    width="168"
                    height="36"
                />
            </a>

            <nav className="abaco-header__nav" aria-label="Secciones">
                {NAV_ITEMS.map((item) => (
                    <a key={item} href={toAnchor(item)}>
                        {item}
                    </a>
                ))}
            </nav>

            <div className="abaco-header__actions">
                <a className="abaco-header__cta" href="#contacto">
                    <CalendarCheck aria-hidden="true" size={17} />
                    <span>Reservar cita</span>
                </a>
                <button
                    className="abaco-header__lang"
                    type="button"
                    aria-label="Idioma"
                >
                    ES
                </button>
                <button
                    className="abaco-header__theme"
                    type="button"
                    aria-label={
                        isDark ? 'Activar modo claro' : 'Activar modo oscuro'
                    }
                    onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
                >
                    {isDark ? (
                        <Sun aria-hidden="true" size={17} />
                    ) : (
                        <Moon aria-hidden="true" size={17} />
                    )}
                </button>
            </div>
        </header>
    );
}

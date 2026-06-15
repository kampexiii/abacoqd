/**
 * Wave Background global — fondo vivo, no protagonista.
 * docs/04_IDENTIDAD_UI_COMPONENTES.md §8.
 *
 * Capa fija detrás de todo el contenido público (z-index inferior,
 * pointer-events: none). Variables de color/opacidad/velocidad se definen por
 * tema en resources/css/tokens.css (--wave-*) y la animación vive en app.css
 * (.qd-wave). Respeta prefers-reduced-motion y la opción "Pausar animaciones"
 * del widget de accesibilidad (clase html.a11y-reduce-motion).
 *
 * Decorativo puro: aria-hidden y sin foco.
 */
export default function WaveBackground() {
    return (
        <div className="qd-wave" aria-hidden="true">
            <div className="qd-wave__layer qd-wave__layer--a" />
            <div className="qd-wave__layer qd-wave__layer--b" />
        </div>
    );
}

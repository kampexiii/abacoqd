import type { ReactNode } from 'react';

import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';

export const formFieldInputClass =
    'w-full rounded-xl border border-qd-mist bg-qd-white px-3.5 py-2.5 text-sm text-qd-ink shadow-sm transition outline-none focus:border-qd-teal-2 focus:ring-2 focus:ring-qd-teal-2/30 dark:border-white/10 dark:bg-white/5 dark:text-qd-white';

/**
 * Estilo de `<select>` públicos, incluido el texto de cada `<option>`.
 * El navegador pinta el desplegable de opciones con su propio tema nativo
 * (claro/oscuro del sistema) si no se fija `color-scheme`; sin esto, el
 * `<select>` cerrado podía verse en modo oscuro pero el listado abierto
 * salía con fondo claro y texto apenas legible (o al revés). Fijar
 * `color-scheme` por el modo de la app, además del color/fondo explícito
 * de cada `option`, garantiza contraste correcto en ambos modos.
 */
export const formFieldSelectClass = cn(
    formFieldInputClass,
    '[color-scheme:light] dark:[color-scheme:dark]',
    '[&>option]:bg-qd-white [&>option]:text-qd-ink dark:[&>option]:bg-qd-surface dark:[&>option]:text-qd-white',
);

type FormFieldProps = {
    readonly label: string;
    readonly error?: string;
    readonly children: ReactNode;
};

/**
 * Campo de formulario público (label visible + control + error inline).
 * docs/07_VISTAS/PUBLIC_06_CONTACTO_RESERVA.md — accesibilidad: labels
 * siempre visibles, errores anunciados junto al campo.
 */
export default function FormField({ label, error, children }: FormFieldProps) {
    return (
        <label className="flex flex-col gap-1.5 text-sm font-medium text-qd-ink dark:text-qd-white">
            {label}
            {children}
            <InputError message={error} />
        </label>
    );
}

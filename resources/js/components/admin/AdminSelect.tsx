import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

/**
 * Estilo unificado de `<select>` del panel admin, claro/oscuro/sistema.
 *
 * El navegador pinta el desplegable de opciones con su tema nativo si no se
 * fija `color-scheme`; sin esto, en modo oscuro el listado abierto salía con
 * fondo blanco/azul nativo y rompía la estética. Fijar `color-scheme` por el
 * modo de la app, más el color/fondo explícito de cada `option`, garantiza
 * contraste correcto en ambos modos. Mismo patrón que los selects públicos
 * (`formFieldSelectClass`).
 */
export const adminSelectClass = cn(
    'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none transition',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    '[color-scheme:light] dark:[color-scheme:dark]',
    '[&>option]:bg-qd-white [&>option]:text-qd-ink dark:[&>option]:bg-qd-surface dark:[&>option]:text-qd-white',
);

type AdminSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

/**
 * `<select>` nativo con el estilo admin unificado. Acepta `className` para
 * ajustar ancho/tamaño puntual (twMerge resuelve conflictos de utilidades).
 */
export default function AdminSelect({ className, ...props }: AdminSelectProps) {
    return <select className={cn(adminSelectClass, className)} {...props} />;
}

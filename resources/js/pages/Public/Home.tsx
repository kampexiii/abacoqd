import { Head } from '@inertiajs/react';

import AbacoHero from '@/components/AbacoHero';
import MethodologySection from '@/components/sections/MethodologySection';
import PublicLayout from '@/layouts/public-layout';

/**
 * Home / Landing pública AbacoQD.
 * docs/07_VISTAS/PUBLIC_01_HOME_LANDING.md (fuente de verdad única).
 *
 * Orden final de la landing (7 secciones): Hero · Metodología · Servicios ·
 * Colaboraciones · Blog · CTA final · Footer.
 *
 * Bloque 2: marco global (PublicLayout) + Hero definitivo (cubo conservado) +
 * Metodología landing. Servicios, Colaboraciones, Blog y CTA final se
 * reconstruyen desde el mockup final en bloques siguientes. Las secciones
 * legacy (Transición, Sistema, Testimonios, Casos, Partners) quedan ELIMINADAS
 * de la landing por no existir en la documentación final.
 */
export default function Home() {
    return (
        <PublicLayout>
            <Head title="Abaco Developments — Consultoría tecnológica, CRM e IA aplicada" />
            <AbacoHero />
            <MethodologySection />
        </PublicLayout>
    );
}

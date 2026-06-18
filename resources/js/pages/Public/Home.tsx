import { Head } from '@inertiajs/react';

import AbacoHero from '@/components/AbacoHero';
import BlogSection from '@/components/sections/BlogSection';
import CollaborationsSection from '@/components/sections/CollaborationsSection';
import FinalCtaSection from '@/components/sections/FinalCtaSection';
import MethodologySection from '@/components/sections/MethodologySection';
import ServicesSection from '@/components/sections/ServicesSection';
import PublicLayout from '@/layouts/public-layout';

/**
 * Home / Landing pública AbacoQD.
 * docs/07_VISTAS/PUBLIC_01_HOME_LANDING.md (fuente de verdad única).
 *
 * Orden final de la landing (7 secciones): Hero · Metodología · Servicios ·
 * Colaboraciones · Blog · CTA final · Footer.
 *
 * Footer global montado por PublicLayout. Las secciones legacy (Transición,
 * Sistema, Testimonios, Casos, Partners) quedan fuera por no existir en la
 * documentación final.
 */
export default function Home() {
    return (
        <PublicLayout waveHiddenUntilElementId="hero">
            <Head title="Abaco Developments — Consultoría tecnológica, CRM e IA aplicada" />
            <AbacoHero />
            <MethodologySection />
            <ServicesSection />
            <CollaborationsSection />
            <BlogSection />
            <FinalCtaSection />
        </PublicLayout>
    );
}

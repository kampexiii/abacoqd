import { useEffect } from 'react';

import AbacoHero from '@/components/AbacoHero';
import { trackEvent } from '@/components/analytics/events';
import BlogSection from '@/components/sections/BlogSection';
import CollaborationsSection from '@/components/sections/CollaborationsSection';
import type { CollaborationItem } from '@/components/sections/CollaborationsSection';
import FinalCtaSection from '@/components/sections/FinalCtaSection';
import MethodologySection from '@/components/sections/MethodologySection';
import ServicesSection from '@/components/sections/ServicesSection';
import SeoHead from '@/components/seo/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import type { BlogPostSummary } from '@/lib/blog';
import { show as bookingShow } from '@/routes/booking';
import { show as contactShow } from '@/routes/contact';

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
type HomeProps = {
    readonly collaborations?: readonly CollaborationItem[];
    readonly featuredPost?: BlogPostSummary | null;
    readonly latestPosts?: readonly BlogPostSummary[];
};

export default function Home({
    collaborations = [],
    featuredPost = null,
    latestPosts = [],
}: HomeProps) {
    // Evento interno no invasivo (sin PII): clic en CTA hacia conversión
    // (contacto/reserva), incluida la CTA principal del hero y la CTA final.
    // Delegación a nivel de documento para no tocar el hero protegido ni las
    // secciones; no altera navegación ni enlaces.
    useEffect(() => {
        const conversionPaths = [contactShow.url(), bookingShow.url()];

        const handleCtaClick = (event: MouseEvent): void => {
            const anchor = (event.target as HTMLElement | null)?.closest(
                'a[href]',
            );

            if (!(anchor instanceof HTMLAnchorElement)) {
                return;
            }

            const path = new URL(anchor.href, window.location.origin).pathname;

            if (conversionPaths.some((cta) => path.startsWith(cta))) {
                trackEvent('cta_click', { location: 'home', label: path });
            }
        };

        document.addEventListener('click', handleCtaClick, true);

        return () =>
            document.removeEventListener('click', handleCtaClick, true);
    }, []);

    return (
        <PublicLayout waveHiddenUntilElementId="hero">
            <SeoHead />
            <AbacoHero />
            <MethodologySection />
            <ServicesSection />
            <CollaborationsSection items={collaborations} />
            <BlogSection
                featuredPost={featuredPost}
                latestPosts={latestPosts}
            />
            <FinalCtaSection />
        </PublicLayout>
    );
}

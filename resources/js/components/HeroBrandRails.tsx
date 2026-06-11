import LogoCarousel from '@/components/LogoCarousel';
import { COLLABORATION_LOGOS, DIRECT_CLIENT_LOGOS } from '@/data/company-logos';

export default function HeroBrandRails() {
    return (
        <aside className="abaco-brand-rails" aria-label="Empresas destacadas">
            <LogoCarousel
                title="Colaboraciones en proyectos"
                items={COLLABORATION_LOGOS}
            />
            <LogoCarousel
                title="Trabajos realizados como Treecore Studio"
                items={DIRECT_CLIENT_LOGOS}
                reverse
            />
        </aside>
    );
}

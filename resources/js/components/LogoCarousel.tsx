import type { CompanyLogo } from '@/data/company-logos';

type LogoCarouselProps = {
    readonly title: string;
    readonly items: readonly CompanyLogo[];
    readonly reverse?: boolean;
};

function LogoCard({ company }: { readonly company: CompanyLogo }) {
    const hasDarkVariant =
        company.logoReady &&
        typeof company.logoDark === 'string' &&
        company.logoDark.length > 0;
    const hasLightVariant =
        company.logoReady &&
        typeof company.logoLight === 'string' &&
        company.logoLight.length > 0;
    const content = hasLightVariant ? (
        <span className="abaco-logo-card__media">
            <img
                className={
                    hasDarkVariant
                        ? 'abaco-logo-card__image abaco-logo-card__image--light'
                        : 'abaco-logo-card__image'
                }
                src={company.logoLight}
                alt={company.alt}
                loading="lazy"
                decoding="async"
                draggable="false"
            />
            {hasDarkVariant ? (
                <img
                    className="abaco-logo-card__image abaco-logo-card__image--dark"
                    src={company.logoDark}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                    draggable="false"
                />
            ) : null}
        </span>
    ) : (
        <span className="abaco-logo-card__fallback">{company.name}</span>
    );

    if (!company.url) {
        return <div className="abaco-logo-card">{content}</div>;
    }

    return (
        <a
            className="abaco-logo-card"
            href={company.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${company.name}: abrir sitio web`}
        >
            {content}
        </a>
    );
}

export default function LogoCarousel({
    title,
    items,
    reverse = false,
}: LogoCarouselProps) {
    const duplicatedItems = [items, items] as const;

    return (
        <section className="abaco-logo-carousel" aria-label={title}>
            <div className="abaco-logo-carousel__heading">
                <p>{title}</p>
            </div>

            <div className="abaco-logo-carousel__viewport">
                <div
                    className={
                        reverse
                            ? 'abaco-logo-carousel__track abaco-logo-carousel__track--reverse'
                            : 'abaco-logo-carousel__track'
                    }
                >
                    {duplicatedItems.map((group, groupIndex) => (
                        <ul
                            key={`${title}-${groupIndex}`}
                            className="abaco-logo-carousel__list"
                            aria-hidden={groupIndex === 1}
                        >
                            {group.map((company) => (
                                <li
                                    key={`${groupIndex}-${company.slug}`}
                                    className="abaco-logo-carousel__item"
                                >
                                    <LogoCard company={company} />
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>
        </section>
    );
}

export type ImageVariant = {
    readonly width: number;
    readonly src: string;
};

type ResponsiveImageOptions = {
    readonly sizes?: string;
    readonly width?: number;
    readonly height?: number;
};

type ResponsiveImageAttributes = {
    readonly src: string;
    readonly srcSet?: string;
    readonly sizes?: string;
    readonly width?: number;
    readonly height?: number;
};

export function responsiveImageAttributes(
    src: string,
    variants: readonly ImageVariant[] | null | undefined,
    options: ResponsiveImageOptions = {},
): ResponsiveImageAttributes {
    const sortedVariants = Array.from(
        new Map(
            (variants ?? [])
                .filter((variant) => variant.width > 0 && variant.src !== '')
                .map((variant) => [variant.width, variant] as const),
        ).values(),
    ).sort((a, b) => a.width - b.width);

    return {
        src,
        srcSet:
            sortedVariants.length > 0
                ? sortedVariants
                      .map((variant) => `${variant.src} ${variant.width}w`)
                      .join(', ')
                : undefined,
        sizes: sortedVariants.length > 0 ? options.sizes : undefined,
        width: options.width,
        height: options.height,
    };
}

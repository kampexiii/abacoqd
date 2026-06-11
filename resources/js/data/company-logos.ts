export type CompanyLogoType = 'colaboracion' | 'cliente_directo';

export type CompanyLogo = {
    readonly name: string;
    readonly slug: string;
    readonly type: CompanyLogoType;
    readonly logoLight?: string;
    readonly logoDark?: string;
    readonly logoReady: boolean;
    readonly alt: string;
    readonly url?: string;
    readonly order: number;
    readonly active: boolean;
};

const COLLABORATION_BASE_PATH =
    '/assets/branding/empresas/colaboraciones/optimizados';
const DIRECT_CLIENT_BASE_PATH =
    '/assets/branding/empresas/clientes-directos/optimizados';

const companyPath = (basePath: string, slug: string) =>
    `${basePath}/${slug}.svg`;

export const COMPANY_LOGOS: readonly CompanyLogo[] = [
    {
        name: 'Iberia',
        slug: 'iberia',
        type: 'colaboracion',
        logoLight: companyPath(COLLABORATION_BASE_PATH, 'iberia'),
        logoReady: false,
        alt: 'Logotipo de Iberia',
        order: 10,
        active: true,
    },
    {
        name: 'Iksula',
        slug: 'iksula',
        type: 'colaboracion',
        logoLight: companyPath(COLLABORATION_BASE_PATH, 'iksula'),
        logoReady: false,
        alt: 'Logotipo de Iksula',
        order: 20,
        active: true,
    },
    {
        name: 'Leroy Merlin',
        slug: 'leroy-merlin',
        type: 'colaboracion',
        logoLight: companyPath(COLLABORATION_BASE_PATH, 'leroy-merlin'),
        logoReady: false,
        alt: 'Logotipo de Leroy Merlin',
        order: 30,
        active: true,
    },
    {
        name: 'IFW',
        slug: 'ifw',
        type: 'colaboracion',
        logoLight: companyPath(COLLABORATION_BASE_PATH, 'ifw'),
        logoReady: false,
        alt: 'Logotipo de IFW',
        order: 40,
        active: true,
    },
    {
        name: 'Devtia',
        slug: 'devtia',
        type: 'colaboracion',
        logoLight: companyPath(COLLABORATION_BASE_PATH, 'devtia'),
        logoReady: false,
        alt: 'Logotipo de Devtia',
        order: 50,
        active: true,
    },
    {
        name: 'Malababa',
        slug: 'malababa',
        type: 'colaboracion',
        logoLight: companyPath(COLLABORATION_BASE_PATH, 'malababa'),
        logoReady: false,
        alt: 'Logotipo de Malababa',
        order: 60,
        active: true,
    },
    {
        name: 'Jack & Jones',
        slug: 'jack-and-jones',
        type: 'colaboracion',
        logoLight: companyPath(COLLABORATION_BASE_PATH, 'jack-and-jones'),
        logoReady: false,
        alt: 'Logotipo de Jack & Jones',
        order: 70,
        active: true,
    },
    {
        name: 'Wible',
        slug: 'wible',
        type: 'colaboracion',
        logoLight: companyPath(COLLABORATION_BASE_PATH, 'wible'),
        logoReady: false,
        alt: 'Logotipo de Wible',
        order: 80,
        active: true,
    },
    {
        name: 'Cognodata',
        slug: 'cognodata',
        type: 'cliente_directo',
        logoLight: companyPath(DIRECT_CLIENT_BASE_PATH, 'cognodata'),
        logoReady: false,
        alt: 'Logotipo de Cognodata',
        order: 10,
        active: true,
    },
    {
        name: 'In Casa',
        slug: 'in-casa',
        type: 'cliente_directo',
        logoLight: companyPath(DIRECT_CLIENT_BASE_PATH, 'in-casa'),
        logoReady: false,
        alt: 'Logotipo de In Casa',
        order: 20,
        active: true,
    },
    {
        name: 'Urban Fisio',
        slug: 'urban-fisio',
        type: 'cliente_directo',
        logoLight: companyPath(DIRECT_CLIENT_BASE_PATH, 'urban-fisio'),
        logoReady: false,
        alt: 'Logotipo de Urban Fisio',
        order: 30,
        active: true,
    },
    {
        name: 'Fantasy JP',
        slug: 'fantasy-jp',
        type: 'cliente_directo',
        logoLight: companyPath(DIRECT_CLIENT_BASE_PATH, 'fantasy-jp'),
        logoReady: false,
        alt: 'Logotipo de Fantasy JP',
        order: 40,
        active: true,
    },
    {
        name: 'RB',
        slug: 'rb',
        type: 'cliente_directo',
        logoLight: companyPath(DIRECT_CLIENT_BASE_PATH, 'rb'),
        logoReady: false,
        alt: 'Logotipo de RB',
        order: 50,
        active: true,
    },
    {
        name: 'YoSEO Marketing',
        slug: 'yoseo-marketing',
        type: 'cliente_directo',
        logoLight: companyPath(DIRECT_CLIENT_BASE_PATH, 'yoseo-marketing'),
        logoReady: false,
        alt: 'Logotipo de YoSEO Marketing',
        order: 60,
        active: true,
    },
    {
        name: 'I Feel Web',
        slug: 'i-feel-web',
        type: 'cliente_directo',
        logoLight: companyPath(DIRECT_CLIENT_BASE_PATH, 'i-feel-web'),
        logoReady: false,
        alt: 'Logotipo de I Feel Web',
        order: 70,
        active: true,
    },
    {
        name: 'Meliá Hotels International',
        slug: 'melia-hotels-international',
        type: 'cliente_directo',
        logoLight: companyPath(
            DIRECT_CLIENT_BASE_PATH,
            'melia-hotels-international',
        ),
        logoReady: false,
        alt: 'Logotipo de Meliá Hotels International',
        order: 80,
        active: true,
    },
] as const;

const sortByOrder = (items: readonly CompanyLogo[]) =>
    [...items].sort((left, right) => left.order - right.order);

export const COLLABORATION_LOGOS = sortByOrder(
    COMPANY_LOGOS.filter(
        (company) => company.active && company.type === 'colaboracion',
    ),
);

export const DIRECT_CLIENT_LOGOS = sortByOrder(
    COMPANY_LOGOS.filter(
        (company) => company.active && company.type === 'cliente_directo',
    ),
);

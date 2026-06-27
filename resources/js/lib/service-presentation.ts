import {
    BarChart2,
    Code2,
    Cpu,
    GitMerge,
    LayoutDashboard,
    RefreshCcw,
    Rocket,
    Settings2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { Locale } from '@/hooks/use-language';

export type ServiceKey =
    | 'web'
    | 'apps'
    | 'tools'
    | 'ai'
    | 'crm'
    | 'integrations'
    | 'mvp'
    | 'evolution';

export type MockupVariant =
    | 'web'
    | 'dashboard'
    | 'panel'
    | 'flow'
    | 'data'
    | 'integration'
    | 'mvp'
    | 'evolution';

export type LocalizedText = {
    readonly es?: string | null;
    readonly en?: string | null;
};

export type PublicService = {
    readonly id: number;
    readonly title: LocalizedText;
    readonly slug: LocalizedText;
    readonly summary: LocalizedText;
    readonly icon: string | null;
    readonly image: string | null;
    readonly isDetailEnabled: boolean;
    readonly settings: unknown;
};

export type ServicePresentation = {
    readonly number: string;
    readonly icon: LucideIcon;
    readonly mockup: MockupVariant;
    readonly fallbackSlug: Record<Locale, string>;
};

export const SERVICE_PRESENTATION: Record<ServiceKey, ServicePresentation> = {
    web: {
        number: '01',
        icon: Code2,
        mockup: 'web',
        fallbackSlug: {
            es: 'desarrollo-web-rapido',
            en: 'fast-web-development',
        },
    },
    apps: {
        number: '02',
        icon: LayoutDashboard,
        mockup: 'dashboard',
        fallbackSlug: {
            es: 'aplicaciones-gestion-medida',
            en: 'custom-management-applications',
        },
    },
    tools: {
        number: '03',
        icon: Settings2,
        mockup: 'panel',
        fallbackSlug: {
            es: 'herramientas-internas-paneles-administracion',
            en: 'internal-tools-admin-panels',
        },
    },
    ai: {
        number: '04',
        icon: Cpu,
        mockup: 'flow',
        fallbackSlug: {
            es: 'automatizacion-procesos-ia',
            en: 'ai-process-automation',
        },
    },
    crm: {
        number: '05',
        icon: BarChart2,
        mockup: 'data',
        fallbackSlug: {
            es: 'crm-datos-reporting',
            en: 'crm-data-reporting',
        },
    },
    integrations: {
        number: '06',
        icon: GitMerge,
        mockup: 'integration',
        fallbackSlug: {
            es: 'integraciones-digitales',
            en: 'digital-integrations',
        },
    },
    mvp: {
        number: '07',
        icon: Rocket,
        mockup: 'mvp',
        fallbackSlug: {
            es: 'mvps-prototipos-funcionales',
            en: 'functional-mvps-prototypes',
        },
    },
    evolution: {
        number: '08',
        icon: RefreshCcw,
        mockup: 'evolution',
        fallbackSlug: {
            es: 'mejora-evolucion-software-existente',
            en: 'improving-existing-software',
        },
    },
};

const SERVICE_KEY_BY_SLUG: Record<string, ServiceKey> = {
    'desarrollo-web-rapido': 'web',
    'fast-web-development': 'web',
    'aplicaciones-gestion-medida': 'apps',
    'custom-management-applications': 'apps',
    'herramientas-internas-paneles-administracion': 'tools',
    'internal-tools-admin-panels': 'tools',
    'automatizacion-procesos-ia': 'ai',
    'ai-process-automation': 'ai',
    'crm-datos-reporting': 'crm',
    'crm-data-reporting': 'crm',
    'integraciones-digitales': 'integrations',
    'digital-integrations': 'integrations',
    'mvps-prototipos-funcionales': 'mvp',
    'functional-mvps-prototypes': 'mvp',
    'mejora-evolucion-software-existente': 'evolution',
    'improving-existing-software': 'evolution',
};

export function resolveServiceKey(slug: LocalizedText): ServiceKey | null {
    const esKey = slug.es ? SERVICE_KEY_BY_SLUG[slug.es] : null;
    const enKey = slug.en ? SERVICE_KEY_BY_SLUG[slug.en] : null;

    return esKey ?? enKey ?? null;
}

export function localizedText(value: LocalizedText, locale: Locale): string {
    return value[locale] ?? value.es ?? value.en ?? '';
}

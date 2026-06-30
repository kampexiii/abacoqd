import {
    CalendarClock,
    FileText,
    FolderKanban,
    HelpCircle,
    Handshake,
    LayoutDashboard,
    Mail,
    Settings,
    Users,
    UsersRound,
    Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type AdminNavKey =
    | 'dashboard'
    | 'services'
    | 'blog'
    | 'projects'
    | 'partners'
    | 'team'
    | 'contacts'
    | 'booking'
    | 'faqs'
    | 'users'
    | 'settings';

export type AdminNavItem = {
    readonly key: AdminNavKey;
    readonly href: string | null;
    readonly icon: LucideIcon;
    readonly enabled: boolean;
};

/**
 * Navegación principal del panel administrativo.
 *
 * Incluye únicamente módulos gestionados desde el propio panel.
 */
export const ADMIN_NAV: readonly AdminNavItem[] = [
    {
        key: 'dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
        enabled: true,
    },
    { key: 'services', href: '/admin/services', icon: Wrench, enabled: true },
    { key: 'blog', href: '/admin/posts', icon: FileText, enabled: true },
    {
        key: 'projects',
        href: '/admin/projects',
        icon: FolderKanban,
        enabled: true,
    },
    {
        key: 'partners',
        href: '/admin/partners',
        icon: Handshake,
        enabled: true,
    },
    {
        key: 'team',
        href: '/admin/team-members',
        icon: UsersRound,
        enabled: true,
    },
    { key: 'contacts', href: '/admin/contacts', icon: Mail, enabled: true },
    {
        key: 'booking',
        href: '/admin/booking/calendar',
        icon: CalendarClock,
        enabled: true,
    },
    { key: 'faqs', href: '/admin/faqs', icon: HelpCircle, enabled: true },
    { key: 'users', href: '/admin/users', icon: Users, enabled: true },
    { key: 'settings', href: '/admin/settings', icon: Settings, enabled: true },
] as const;

/**
 * Claves visibles por rol en la capa de navegación.
 *
 * La autorización efectiva se aplica en backend.
 */
const ROLE_NAV_KEYS: Record<string, readonly AdminNavKey[]> = {
    super_admin: [
        'dashboard',
        'services',
        'blog',
        'projects',
        'partners',
        'team',
        'contacts',
        'booking',
        'faqs',
        'users',
        'settings',
    ],
    admin: [
        'dashboard',
        'services',
        'blog',
        'projects',
        'partners',
        'team',
        'contacts',
        'booking',
        'faqs',
        'settings',
    ],
    editor: [
        'dashboard',
        'services',
        'blog',
        'projects',
        'partners',
        'team',
        'faqs',
    ],
    viewer: [
        'dashboard',
        'services',
        'blog',
        'projects',
        'partners',
        'team',
        'faqs',
    ],
};

export function adminNavForRole(
    role: string | undefined,
): readonly AdminNavItem[] {
    const allowedKeys = ROLE_NAV_KEYS[role ?? ''] ?? ROLE_NAV_KEYS.editor;

    return ADMIN_NAV.filter((item) => allowedKeys.includes(item.key));
}

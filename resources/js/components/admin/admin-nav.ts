import {
    CalendarClock,
    FileText,
    FolderKanban,
    HelpCircle,
    Handshake,
    LayoutDashboard,
    Mail,
    Scale,
    Search,
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
    | 'messages'
    | 'booking'
    | 'legal'
    | 'settings'
    | 'seo'
    | 'faqs'
    | 'users';

export type AdminNavItem = {
    readonly key: AdminNavKey;
    readonly href: string | null;
    readonly icon: LucideIcon;
    readonly enabled: boolean;
};

/**
 * Navegación canónica del panel admin. En este primer bloque (Fase 4) solo
 * `dashboard` y `services` están habilitados; el resto se muestra como
 * "pendiente" para no generar rutas rotas.
 */
export const ADMIN_NAV: readonly AdminNavItem[] = [
    { key: 'dashboard', href: '/admin/dashboard', icon: LayoutDashboard, enabled: true },
    { key: 'services', href: '/admin/services', icon: Wrench, enabled: true },
    { key: 'blog', href: null, icon: FileText, enabled: false },
    { key: 'projects', href: null, icon: FolderKanban, enabled: false },
    { key: 'partners', href: null, icon: Handshake, enabled: false },
    { key: 'team', href: null, icon: UsersRound, enabled: false },
    { key: 'messages', href: null, icon: Mail, enabled: false },
    { key: 'booking', href: null, icon: CalendarClock, enabled: false },
    { key: 'legal', href: null, icon: Scale, enabled: false },
    { key: 'settings', href: null, icon: Settings, enabled: false },
    { key: 'seo', href: null, icon: Search, enabled: false },
    { key: 'faqs', href: null, icon: HelpCircle, enabled: false },
    { key: 'users', href: null, icon: Users, enabled: false },
] as const;

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
    | 'contacts'
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
 * Navegación canónica del panel admin (Fase 4). Los módulos sin implementar
 * se muestran como "pendiente" (enabled: false) para no generar rutas rotas.
 * Reseñas no tiene entrada propia: pasa a ser integración de Google Reviews
 * de solo lectura (pendiente), no un CRUD manual.
 */
export const ADMIN_NAV: readonly AdminNavItem[] = [
    { key: 'dashboard', href: '/admin/dashboard', icon: LayoutDashboard, enabled: true },
    { key: 'services', href: '/admin/services', icon: Wrench, enabled: true },
    { key: 'blog', href: '/admin/posts', icon: FileText, enabled: true },
    { key: 'projects', href: '/admin/projects', icon: FolderKanban, enabled: true },
    { key: 'partners', href: '/admin/partners', icon: Handshake, enabled: true },
    { key: 'team', href: '/admin/team-members', icon: UsersRound, enabled: true },
    { key: 'contacts', href: '/admin/contacts', icon: Mail, enabled: true },
    { key: 'booking', href: '/admin/booking/days', icon: CalendarClock, enabled: true },
    { key: 'legal', href: null, icon: Scale, enabled: false },
    { key: 'settings', href: null, icon: Settings, enabled: false },
    { key: 'seo', href: null, icon: Search, enabled: false },
    { key: 'faqs', href: '/admin/faqs', icon: HelpCircle, enabled: true },
    { key: 'users', href: '/admin/users', icon: Users, enabled: true },
] as const;

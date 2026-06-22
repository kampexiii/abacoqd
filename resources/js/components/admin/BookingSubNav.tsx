import { Link } from '@inertiajs/react';

import { cn } from '@/lib/utils';

const ITEMS = [
    { href: '/admin/booking/days', label: 'Días' },
    { href: '/admin/booking/slots', label: 'Franjas' },
    { href: '/admin/booking/bookings', label: 'Reservas' },
    { href: '/admin/booking/settings', label: 'Configuración' },
] as const;

export default function BookingSubNav({ currentUrl }: { readonly currentUrl: string }) {
    return (
        <div className="mb-6 flex flex-wrap gap-2 border-b border-qd-mist pb-4 dark:border-qd-white/10">
            {ITEMS.map((item) => {
                const isActive = currentUrl.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'rounded-lg px-3.5 py-2 text-sm font-semibold transition',
                            isActive
                                ? 'bg-qd-teal-2/10 text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal'
                                : 'text-qd-text-medium hover:bg-qd-mist/70 hover:text-qd-text-high dark:text-qd-white/50 dark:hover:bg-qd-white/5',
                        )}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );
}

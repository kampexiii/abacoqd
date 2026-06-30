import { CheckCircle2, CircleDashed, EyeOff } from 'lucide-react';

import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

export type ServiceStatus = 'draft' | 'published' | 'hidden';

const STATUS_META: Record<
    ServiceStatus,
    { readonly icon: typeof CheckCircle2; readonly className: string }
> = {
    published: {
        icon: CheckCircle2,
        className:
            'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400',
    },
    draft: {
        icon: CircleDashed,
        className:
            'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400',
    },
    hidden: {
        icon: EyeOff,
        className:
            'bg-neutral-100 text-neutral-600 ring-neutral-500/20 dark:bg-white/5 dark:text-white/50',
    },
};

export default function StatusBadge({
    status,
}: {
    readonly status: ServiceStatus;
}) {
    const { t } = useLanguage();
    const meta = STATUS_META[status];
    const Icon = meta.icon;

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                meta.className,
            )}
        >
            <Icon aria-hidden="true" size={13} />
            {t(`admin.status.${status}`)}
        </span>
    );
}

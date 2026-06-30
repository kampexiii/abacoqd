import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type AdminEmptyStateProps = {
    readonly icon: LucideIcon;
    readonly title: string;
    readonly description?: string;
    readonly action?: ReactNode;
};

export default function AdminEmptyState({
    icon: Icon,
    title,
    description,
    action,
}: AdminEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-qd-mist bg-qd-white px-6 py-16 text-center dark:border-qd-white/10 dark:bg-qd-surface">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-qd-teal-2/10 text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal">
                <Icon aria-hidden="true" size={26} strokeWidth={1.7} />
            </span>
            <h3 className="mt-5 text-lg font-bold text-qd-ink dark:text-qd-white">
                {title}
            </h3>
            {description && (
                <p className="mt-1.5 max-w-sm text-sm text-qd-text-medium dark:text-qd-white/50">
                    {description}
                </p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

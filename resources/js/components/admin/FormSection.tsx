import type { ReactNode } from 'react';

type FormSectionProps = {
    readonly title: string;
    readonly description?: string;
    readonly children: ReactNode;
};

export default function FormSection({ title, description, children }: FormSectionProps) {
    return (
        <section className="rounded-2xl border border-qd-mist bg-qd-white p-5 sm:p-6 dark:border-qd-white/10 dark:bg-qd-surface">
            <div className="mb-5">
                <h2 className="text-lg font-bold text-qd-ink dark:text-qd-white">{title}</h2>
                {description && (
                    <p className="mt-1 text-sm text-qd-text-medium dark:text-qd-white/50">
                        {description}
                    </p>
                )}
            </div>
            {children}
        </section>
    );
}

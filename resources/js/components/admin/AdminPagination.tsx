import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type PaginationLink = {
    readonly url: string | null;
    readonly label: string;
    readonly active: boolean;
};

export type PaginatedData<T> = {
    readonly data: readonly T[];
    readonly links: readonly PaginationLink[];
    readonly current_page: number;
    readonly last_page: number;
    readonly from: number | null;
    readonly to: number | null;
    readonly total: number;
};

type AdminPaginationProps = {
    readonly pagination: Pick<
        PaginatedData<unknown>,
        'links' | 'current_page' | 'last_page' | 'from' | 'to' | 'total'
    >;
};

export default function AdminPagination({ pagination }: AdminPaginationProps) {
    if (pagination.total === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-qd-mist px-4 py-3 text-xs text-qd-text-medium dark:border-qd-white/10 dark:text-qd-white/50">
            <span>
                Mostrando {pagination.from}–{pagination.to} de{' '}
                {pagination.total}
            </span>

            {pagination.last_page > 1 ? (
                <nav
                    aria-label="Paginación"
                    className="flex items-center gap-1"
                >
                    {pagination.links.map((link, index) => {
                        const isPrevious = index === 0;
                        const isNext = index === pagination.links.length - 1;
                        const label = isPrevious
                            ? 'Página anterior'
                            : isNext
                              ? 'Página siguiente'
                              : `Página ${link.label}`;
                        const content: ReactNode = isPrevious ? (
                            <ChevronLeft aria-hidden="true" size={16} />
                        ) : isNext ? (
                            <ChevronRight aria-hidden="true" size={16} />
                        ) : (
                            link.label
                        );
                        const className = cn(
                            'flex min-w-8 items-center justify-center rounded-lg border border-qd-mist px-2 py-1.5 font-semibold transition dark:border-qd-white/10',
                            link.active
                                ? 'border-qd-teal-2 bg-qd-teal-2 text-white dark:border-qd-teal dark:bg-qd-teal dark:text-qd-ink'
                                : 'text-qd-text-high hover:border-qd-teal-2/40 hover:text-qd-teal-2 dark:text-qd-white/70',
                            link.url === null &&
                                'pointer-events-none opacity-40',
                        );

                        return link.url === null ? (
                            <span
                                key={`${link.label}-${index}`}
                                aria-label={label}
                                aria-disabled="true"
                                className={className}
                            >
                                {content}
                            </span>
                        ) : (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url}
                                preserveScroll
                                preserveState
                                aria-label={label}
                                aria-current={link.active ? 'page' : undefined}
                                className={className}
                            >
                                {content}
                            </Link>
                        );
                    })}
                </nav>
            ) : null}
        </div>
    );
}

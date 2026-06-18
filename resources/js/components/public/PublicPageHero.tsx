import { ChevronRight, Home, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { useLanguage } from '@/hooks/use-language';

import MethodologyCube from './MethodologyCube';

type PublicPageHeroProps = {
    readonly eyebrow: string;
    readonly title: string;
    readonly subtitle: string;
    readonly currentLabel: string;
    readonly taglineTitle: string;
    readonly taglineSubtitle: string;
    readonly taglineIcon?: LucideIcon;
};

export default function PublicPageHero({
    eyebrow,
    title,
    subtitle,
    currentLabel,
    taglineTitle,
    taglineSubtitle,
    taglineIcon: TaglineIcon = Rocket,
}: PublicPageHeroProps) {
    const { t } = useLanguage();

    return (
        <section className="relative overflow-hidden bg-qd-mist dark:bg-qd-surface">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-60 sm:w-1/2"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(115deg, rgba(24,183,176,0.18) 0px, rgba(24,183,176,0.18) 1.5px, transparent 1.5px, transparent 28px)',
                    maskImage: 'linear-gradient(to left, black, transparent)',
                }}
            />
            <div className="relative mx-auto max-w-[1240px] px-5 pt-28 pb-16 sm:px-8 sm:pt-32 sm:pb-20">
                <div className="flex items-start justify-between gap-10">
                    <div className="max-w-2xl">
                        <nav aria-label="Breadcrumb" className="mb-6">
                            <ol className="flex items-center gap-1.5 text-xs text-qd-text-medium">
                                <li>
                                    <a
                                        href="/"
                                        className="flex items-center gap-1 hover:text-qd-teal-2 dark:hover:text-qd-teal"
                                    >
                                        <Home aria-hidden="true" size={12} />
                                        {t('navigation.breadcrumbHome')}
                                    </a>
                                </li>
                                <li aria-hidden="true">
                                    <ChevronRight size={12} />
                                </li>
                                <li
                                    aria-current="page"
                                    className="font-medium text-qd-ink dark:text-qd-white"
                                >
                                    {currentLabel}
                                </li>
                            </ol>
                        </nav>

                        <p className="text-sm font-semibold tracking-wide text-qd-teal-2 dark:text-qd-teal">
                            {eyebrow}
                        </p>
                        <h1 className="mt-3 text-4xl font-bold text-qd-ink sm:text-5xl dark:text-qd-white">
                            {title}
                        </h1>
                        <p className="mt-4 max-w-xl text-base text-qd-text-high sm:text-lg">
                            {subtitle}
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-qd-teal/15 text-qd-teal-2 dark:text-qd-teal">
                                <TaglineIcon aria-hidden="true" size={16} />
                            </span>
                            <p className="text-sm leading-snug">
                                <span className="font-semibold text-qd-ink dark:text-qd-white">
                                    {taglineTitle}
                                </span>
                                <br />
                                <span className="text-qd-text-medium">
                                    {taglineSubtitle}
                                </span>
                            </p>
                        </div>
                    </div>

                    <MethodologyCube />
                </div>
            </div>
        </section>
    );
}

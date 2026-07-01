import {
    ArrowRight,
    Bot,
    Building2,
    CalendarDays,
    Compass,
    Download,
    Github,
    Globe,
    Layers,
    Linkedin,
    MessageSquare,
    Puzzle,
    Target,
    UsersRound,
    Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import PublicPageHero from '@/components/public/PublicPageHero';
import SeoHead from '@/components/seo/SeoHead';
import { useInView } from '@/hooks/use-in-view';
import { useLanguage } from '@/hooks/use-language';
import type { Locale } from '@/hooks/use-language';
import PublicLayout from '@/layouts/public-layout';
import { responsiveImageAttributes } from '@/lib/media';
import type { ImageVariant } from '@/lib/media';
import { cn } from '@/lib/utils';
import { show as bookingShow } from '@/routes/booking';
import { show as contactShow } from '@/routes/contact';

/**
 * Vista pública Quiénes somos. docs/07_VISTAS/PUBLIC_10_QUIENES_SOMOS.md.
 *
 * No repite metodología/proceso (eso vive en `/metodologia`): se centra en
 * identidad (Abaco Developments / AbacoQD), en qué nos define y en el equipo.
 *
 * La sección de equipo lee `team_members` real (sin datos inventados): si no
 * hay miembros visibles/activos se muestra un bloque corporativo en vez de un
 * grid vacío. El botón "Descargar CV" solo aparece cuando `cv_path` existe.
 */

type LocalizedText = {
    readonly es?: string | null;
    readonly en?: string | null;
};

function localizedText(value: LocalizedText | null, locale: Locale): string {
    if (!value) {
        return '';
    }

    return value[locale] ?? value.es ?? value.en ?? '';
}

function paragraphs(text: string): readonly string[] {
    return text
        .split('\n\n')
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
}

function initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';

    return `${first}${second}`.toUpperCase();
}

type AboutTeamMember = {
    readonly id: number;
    readonly name: string;
    readonly role: LocalizedText | null;
    readonly bio: LocalizedText | null;
    readonly photo: string | null;
    readonly photoVariants?: readonly ImageVariant[];
    readonly photoAlt: string | null;
    readonly linkedinUrl: string | null;
    readonly githubUrl: string | null;
    readonly personalUrl: string | null;
    readonly cvUrl: string | null;
};

type AboutProps = {
    readonly teamMembers: readonly AboutTeamMember[];
};

function TeamMemberCard({
    member,
    locale,
    cvCtaLabel,
    cvAriaLabel,
}: {
    readonly member: AboutTeamMember;
    readonly locale: Locale;
    readonly cvCtaLabel: string;
    readonly cvAriaLabel: string;
}) {
    const role = localizedText(member.role, locale);
    const bio = localizedText(member.bio, locale);
    const hasSocial =
        member.linkedinUrl || member.githubUrl || member.personalUrl;
    const photo = member.photo
        ? responsiveImageAttributes(member.photo, member.photoVariants, {
              sizes: '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 2.5rem)',
              width: 768,
              height: 960,
          })
        : null;

    return (
        <article className="abaco-card-hover flex h-full w-full flex-col rounded-2xl border border-qd-mist bg-qd-white p-8 text-center hover:-translate-y-1 hover:border-qd-teal-2/50 dark:border-qd-white/10 dark:bg-qd-surface dark:hover:border-qd-teal/50">
            <div className="overflow-hidden rounded-xl border border-qd-mist bg-qd-mist p-1.5 dark:border-qd-teal/15 dark:bg-qd-white/5">
                {photo ? (
                    <img
                        src={photo.src}
                        srcSet={photo.srcSet}
                        sizes={photo.sizes}
                        width={photo.width}
                        height={photo.height}
                        alt={member.photoAlt ?? member.name}
                        loading="lazy"
                        decoding="async"
                        className="aspect-4/5 w-full rounded-lg object-cover object-[center_18%]"
                    />
                ) : (
                    <div
                        aria-hidden="true"
                        className="flex aspect-4/5 w-full items-center justify-center rounded-lg bg-qd-mist text-4xl font-bold text-qd-teal-2 dark:bg-qd-white/5 dark:text-qd-teal"
                    >
                        {initials(member.name)}
                    </div>
                )}
            </div>

            <h3 className="mt-6 text-lg font-bold text-qd-ink dark:text-qd-white">
                {member.name}
            </h3>
            {role && (
                <p className="mt-1 text-sm font-semibold text-qd-teal-2 dark:text-qd-teal">
                    {role}
                </p>
            )}
            {bio && (
                <p className="mt-3 text-sm leading-relaxed break-words text-qd-text-high">
                    {bio}
                </p>
            )}

            {(hasSocial || member.cvUrl) && (
                <div className="mt-auto flex flex-wrap items-center justify-center gap-3 pt-7">
                    {member.linkedinUrl && (
                        <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`LinkedIn — ${member.name}`}
                            className="flex size-9 items-center justify-center rounded-full border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-qd-white/15 dark:text-qd-text-medium dark:hover:border-qd-teal dark:hover:text-qd-teal"
                        >
                            <Linkedin aria-hidden="true" size={16} />
                        </a>
                    )}
                    {member.githubUrl && (
                        <a
                            href={member.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`GitHub — ${member.name}`}
                            className="flex size-9 items-center justify-center rounded-full border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-qd-white/15 dark:text-qd-text-medium dark:hover:border-qd-teal dark:hover:text-qd-teal"
                        >
                            <Github aria-hidden="true" size={16} />
                        </a>
                    )}
                    {member.personalUrl && (
                        <a
                            href={member.personalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Web — ${member.name}`}
                            className="flex size-9 items-center justify-center rounded-full border border-qd-mist text-qd-text-high transition hover:border-qd-teal-2 hover:text-qd-teal-2 dark:border-qd-white/15 dark:text-qd-text-medium dark:hover:border-qd-teal dark:hover:text-qd-teal"
                        >
                            <Globe aria-hidden="true" size={16} />
                        </a>
                    )}
                    {member.cvUrl && (
                        <a
                            href={member.cvUrl}
                            download
                            aria-label={`${cvAriaLabel} ${member.name}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-qd-teal-2/40 px-3 py-1.5 text-xs font-bold text-qd-teal-2 transition hover:bg-qd-teal-2/10 dark:border-qd-teal/40 dark:text-qd-teal dark:hover:bg-qd-teal/10"
                        >
                            {cvCtaLabel}
                            <Download aria-hidden="true" size={13} />
                        </a>
                    )}
                </div>
            )}
        </article>
    );
}

const VALUE_ITEMS: readonly {
    key: 'tailored' | 'speed' | 'criteria' | 'clarity' | 'technology';
    icon: LucideIcon;
}[] = [
    { key: 'tailored', icon: Puzzle },
    { key: 'speed', icon: Zap },
    { key: 'criteria', icon: Target },
    { key: 'clarity', icon: MessageSquare },
    { key: 'technology', icon: Layers },
] as const;

export default function About({ teamMembers }: AboutProps) {
    const { t, locale } = useLanguage();
    const leadMember = teamMembers[0] ?? null;
    const supportingMembers = teamMembers.slice(1);

    const { ref: identityRef, inView: identityInView } =
        useInView<HTMLDivElement>({ threshold: 0.2 });
    const { ref: valuesRef, inView: valuesInView } = useInView<HTMLDivElement>({
        threshold: 0.2,
    });
    const { ref: teamRef, inView: teamInView } = useInView<HTMLDivElement>({
        threshold: 0.1,
    });

    return (
        <PublicLayout>
            <SeoHead />

            <PublicPageHero
                eyebrow={t('aboutPage.hero.eyebrow')}
                title={t('aboutPage.hero.title')}
                subtitle={t('aboutPage.hero.subtitle')}
                currentLabel={t('navigation.items.quienesSomos')}
                taglineTitle={t('aboutPage.heroTagline.title')}
                taglineSubtitle={t('aboutPage.heroTagline.subtitle')}
                taglineIcon={Compass}
            />

            {/* 2-3. Quién es Abaco Developments + Qué es AbacoQD */}
            <section className="bg-qd-bg dark:bg-qd-ink">
                <div className="mx-auto max-w-310 px-5 py-16 sm:px-8 sm:py-20">
                    <div
                        ref={identityRef}
                        className={cn(
                            'abaco-stagger grid gap-10 lg:grid-cols-2 lg:gap-14',
                            identityInView && 'is-visible',
                        )}
                    >
                        <div>
                            <span className="inline-flex size-12 items-center justify-center rounded-xl border border-qd-teal-2/30 bg-qd-teal-2/10 text-qd-teal-2 dark:border-qd-teal/35 dark:bg-qd-teal/10 dark:text-qd-teal">
                                <Building2
                                    aria-hidden="true"
                                    size={22}
                                    strokeWidth={1.7}
                                />
                            </span>
                            <h2 className="mt-5 text-2xl font-bold text-qd-ink sm:text-3xl dark:text-qd-white">
                                {t('aboutPage.abacoDevelopments.title')}
                            </h2>
                            <div className="mt-4 space-y-3 text-sm leading-relaxed text-qd-text-high sm:text-base">
                                {paragraphs(
                                    t('aboutPage.abacoDevelopments.text'),
                                ).map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-qd-teal-2/20 bg-qd-white p-7 sm:p-9 dark:border-qd-teal/25 dark:bg-qd-white/5">
                            <span className="inline-flex size-12 items-center justify-center rounded-xl border border-qd-teal-2/30 bg-qd-teal-2/10 text-qd-teal-2 dark:border-qd-teal/35 dark:bg-qd-teal/10 dark:text-qd-teal">
                                <Bot
                                    aria-hidden="true"
                                    size={22}
                                    strokeWidth={1.7}
                                />
                            </span>
                            <h2 className="mt-5 text-2xl font-bold text-qd-ink sm:text-3xl dark:text-qd-white">
                                {t('aboutPage.abacoQD.title')}
                            </h2>
                            <div className="mt-4 space-y-3 text-sm leading-relaxed text-qd-text-high sm:text-base">
                                {paragraphs(t('aboutPage.abacoQD.text')).map(
                                    (paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Qué nos define */}
            <section className="bg-qd-white dark:bg-qd-ink">
                <div className="mx-auto max-w-310 px-5 py-16 sm:px-8 sm:py-20">
                    <h2 className="text-2xl font-bold text-qd-ink sm:text-3xl dark:text-qd-white">
                        {t('aboutPage.values.title')}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-qd-text-high sm:text-base">
                        {t('aboutPage.values.subtitle')}
                    </p>

                    <div
                        ref={valuesRef}
                        className={cn(
                            'abaco-stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5',
                            valuesInView && 'is-visible',
                        )}
                    >
                        {VALUE_ITEMS.map((item) => (
                            <div
                                key={item.key}
                                className="abaco-card-hover rounded-2xl border border-qd-mist bg-qd-white p-6 hover:-translate-y-1 hover:border-qd-teal-2/60 dark:border-qd-white/10 dark:bg-qd-white/5 dark:hover:border-qd-teal/60"
                            >
                                <span className="flex size-11 items-center justify-center rounded-xl border border-qd-teal-2/30 bg-qd-teal-2/10 text-qd-teal-2 dark:border-qd-teal/30 dark:bg-qd-teal/10 dark:text-qd-teal">
                                    <item.icon
                                        aria-hidden="true"
                                        size={20}
                                        strokeWidth={1.7}
                                    />
                                </span>
                                <h3 className="mt-4 text-base font-bold text-qd-ink dark:text-qd-white">
                                    {t(
                                        `aboutPage.values.items.${item.key}.title`,
                                    )}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-qd-text-high">
                                    {t(
                                        `aboutPage.values.items.${item.key}.description`,
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Equipo / plantilla futura */}
            <section className="bg-qd-bg dark:bg-qd-ink">
                <div className="mx-auto max-w-310 px-5 py-16 sm:px-8 sm:py-20">
                    <div className="flex items-center justify-center gap-4">
                        <span
                            aria-hidden="true"
                            className="h-px max-w-40 flex-1 bg-qd-mist dark:bg-white/10"
                        />
                        <span className="flex items-center gap-2 text-center text-xl font-bold text-qd-ink sm:text-2xl dark:text-qd-white">
                            <UsersRound
                                aria-hidden="true"
                                size={20}
                                className="text-qd-teal-2 dark:text-qd-teal"
                            />
                            {t('aboutPage.team.title')}
                        </span>
                        <span
                            aria-hidden="true"
                            className="h-px max-w-40 flex-1 bg-qd-mist dark:bg-white/10"
                        />
                    </div>
                    <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-qd-text-high">
                        {t('aboutPage.team.subtitle')}
                    </p>

                    {teamMembers.length > 0 ? (
                        <div ref={teamRef} className="mt-12">
                            {leadMember && (
                                <div
                                    className={cn(
                                        'abaco-stagger grid gap-8 sm:grid-cols-2 lg:grid-cols-3',
                                        teamInView && 'is-visible',
                                    )}
                                >
                                    <div className="sm:col-span-2 sm:mx-auto sm:w-[calc(50%_-_1rem)] lg:col-span-1 lg:col-start-2 lg:w-auto">
                                        <TeamMemberCard
                                            member={leadMember}
                                            locale={locale}
                                            cvCtaLabel={t(
                                                'aboutPage.team.cvCta',
                                            )}
                                            cvAriaLabel={t(
                                                'aboutPage.team.cvAriaLabel',
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

                            {supportingMembers.length > 0 && (
                                <div
                                    className={cn(
                                        'abaco-stagger mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3',
                                        teamInView && 'is-visible',
                                    )}
                                >
                                    {supportingMembers.map((member) => (
                                        <TeamMemberCard
                                            key={member.id}
                                            member={member}
                                            locale={locale}
                                            cvCtaLabel={t(
                                                'aboutPage.team.cvCta',
                                            )}
                                            cvAriaLabel={t(
                                                'aboutPage.team.cvAriaLabel',
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-qd-mist bg-qd-white p-8 text-center sm:p-10 dark:border-qd-white/10 dark:bg-qd-white/5">
                            <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-qd-teal-2/25 bg-qd-teal-2/10 text-qd-teal-2 dark:border-qd-teal/30 dark:bg-qd-teal/10 dark:text-qd-teal">
                                <UsersRound
                                    aria-hidden="true"
                                    size={24}
                                    strokeWidth={1.7}
                                />
                            </span>
                            <h3 className="mt-5 text-xl font-bold text-qd-ink dark:text-qd-white">
                                {t('aboutPage.team.emptyTitle')}
                            </h3>
                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-qd-text-high">
                                {t('aboutPage.team.emptyText')}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* 6. CTA final */}
            <section className="bg-qd-ink">
                <div className="mx-auto flex max-w-310 flex-col gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
                    <div>
                        <h2 className="text-2xl font-bold text-qd-white sm:text-3xl">
                            {t('aboutPage.cta.title')}
                        </h2>
                        <p className="mt-2 max-w-md text-sm text-qd-text-medium sm:text-base">
                            {t('aboutPage.cta.subtitle')}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={contactShow.url()}
                            className="inline-flex items-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-semibold text-qd-ink transition hover:brightness-95"
                        >
                            {t('aboutPage.cta.primary')}
                            <ArrowRight aria-hidden="true" size={16} />
                        </a>
                        <a
                            href={bookingShow.url()}
                            className="inline-flex items-center gap-2 rounded-xl border border-qd-white/20 px-5 py-3 text-sm font-semibold text-qd-white transition hover:border-qd-teal hover:text-qd-teal"
                        >
                            {t('aboutPage.cta.secondary')}
                            <CalendarDays aria-hidden="true" size={16} />
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

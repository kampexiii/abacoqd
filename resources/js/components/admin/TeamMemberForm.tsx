import { useForm } from '@inertiajs/react';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

import FormSection from '@/components/admin/FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Locale } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

export type LocalizedInput = { es: string; en: string };

export type AdminTeamMemberRecord = {
    readonly id: number;
    readonly name: string;
    readonly slug: string;
    readonly role: Partial<LocalizedInput> | null;
    readonly bio: Partial<LocalizedInput> | null;
    readonly photo: string | null;
    readonly photoAlt: string | null;
    readonly cvPath: string | null;
    readonly linkedinUrl: string | null;
    readonly githubUrl: string | null;
    readonly personalUrl: string | null;
    readonly email: string | null;
    readonly isVisible: boolean;
    readonly isActive: boolean;
    readonly sortOrder: number;
};

type TeamMemberFormData = {
    name: string;
    slug: string;
    role: LocalizedInput;
    bio: LocalizedInput;
    photo: File | null;
    remove_photo: boolean;
    photo_alt: string;
    cv: File | null;
    remove_cv: boolean;
    linkedin_url: string;
    github_url: string;
    personal_url: string;
    email: string;
    sort_order: number;
    is_visible: boolean;
    is_active: boolean;
};

type TeamMemberFormProps = {
    readonly mode: 'create' | 'edit';
    readonly member?: AdminTeamMemberRecord;
    readonly defaultSortOrder?: number;
};

function localized(
    value: Partial<LocalizedInput> | null | undefined,
): LocalizedInput {
    return { es: value?.es ?? '', en: value?.en ?? '' };
}

export default function TeamMemberForm({
    mode,
    member,
    defaultSortOrder = 1,
}: TeamMemberFormProps) {
    const [activeLocale, setActiveLocale] = useState<Locale>('es');

    const form = useForm<TeamMemberFormData>({
        name: member?.name ?? '',
        slug: member?.slug ?? '',
        role: localized(member?.role),
        bio: localized(member?.bio),
        photo: null,
        remove_photo: false,
        photo_alt: member?.photoAlt ?? '',
        cv: null,
        remove_cv: false,
        linkedin_url: member?.linkedinUrl ?? '',
        github_url: member?.githubUrl ?? '',
        personal_url: member?.personalUrl ?? '',
        email: member?.email ?? '',
        sort_order: member?.sortOrder ?? defaultSortOrder,
        is_visible: member?.isVisible ?? false,
        is_active: member?.isActive ?? true,
    });

    const { data, setData, processing } = form;
    const errors = form.errors as Record<string, string>;

    const photoPreview = useMemo(() => {
        if (data.photo instanceof File) {
            return URL.createObjectURL(data.photo);
        }

        if (member?.photo && !data.remove_photo) {
            return member.photo;
        }

        return null;
    }, [data.photo, data.remove_photo, member?.photo]);

    const cvName = useMemo(() => {
        if (data.cv instanceof File) {
            return data.cv.name;
        }

        if (member?.cvPath && !data.remove_cv) {
            return member.cvPath.split('/').pop();
        }

        return null;
    }, [data.cv, data.remove_cv, member]);

    const setRole = (locale: Locale, value: string) =>
        setData('role', { ...data.role, [locale]: value });
    const setBio = (locale: Locale, value: string) =>
        setData('bio', { ...data.bio, [locale]: value });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        const options = { forceFormData: true, preserveScroll: true } as const;

        if (mode === 'create') {
            form.post('/admin/team-members', options);

            return;
        }

        form.transform((current) => ({ ...current, _method: 'put' }));
        form.post(`/admin/team-members/${member?.id}`, options);
    };

    return (
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
                <FormSection
                    title="Datos del miembro"
                    description="Nombre y slug no son bilingües."
                >
                    <div className="flex flex-col gap-4">
                        <Field label="Nombre" error={errors.name}>
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="Slug"
                            hint="Solo minúsculas, números y guiones."
                            error={errors.slug}
                        >
                            <Input
                                value={data.slug}
                                onChange={(e) =>
                                    setData('slug', e.target.value)
                                }
                            />
                        </Field>

                        <Field label="Email" error={errors.email}>
                            <Input
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="nombre@abacoqd.com"
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection
                    title="Rol y biografía"
                    description="Bilingüe ES/EN."
                >
                    <LocaleTabs
                        activeLocale={activeLocale}
                        onChange={setActiveLocale}
                    />
                    <div className="mt-4 flex flex-col gap-4">
                        <Field
                            label="Rol"
                            error={errors[`role.${activeLocale}`]}
                        >
                            <Input
                                value={data.role[activeLocale]}
                                onChange={(e) =>
                                    setRole(activeLocale, e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Biografía"
                            error={errors[`bio.${activeLocale}`]}
                        >
                            <textarea
                                value={data.bio[activeLocale]}
                                onChange={(e) =>
                                    setBio(activeLocale, e.target.value)
                                }
                                rows={5}
                                className={textareaClass}
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection
                    title="Enlaces"
                    description="Solo datos reales: no se inventan perfiles ni CV."
                >
                    <div className="flex flex-col gap-4">
                        <Field label="LinkedIn" error={errors.linkedin_url}>
                            <Input
                                value={data.linkedin_url}
                                onChange={(e) =>
                                    setData('linkedin_url', e.target.value)
                                }
                                placeholder="https://linkedin.com/in/..."
                            />
                        </Field>
                        <Field label="GitHub" error={errors.github_url}>
                            <Input
                                value={data.github_url}
                                onChange={(e) =>
                                    setData('github_url', e.target.value)
                                }
                                placeholder="https://github.com/..."
                            />
                        </Field>
                        <Field label="Web personal" error={errors.personal_url}>
                            <Input
                                value={data.personal_url}
                                onChange={(e) =>
                                    setData('personal_url', e.target.value)
                                }
                                placeholder="https://..."
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection title="Foto y CV">
                    <div className="flex flex-wrap items-start gap-8">
                        <div className="flex flex-col gap-2">
                            <Label>Foto</Label>
                            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-dashed border-qd-mist bg-qd-bg dark:border-qd-white/10 dark:bg-qd-ink">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs text-qd-text-medium dark:text-qd-white/40">
                                        Sin foto
                                    </span>
                                )}
                            </div>
                            <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-qd-mist px-3 py-1.5 text-xs font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70">
                                <Upload aria-hidden="true" size={13} />
                                Subir
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={(e) => {
                                        setData(
                                            'photo',
                                            e.target.files?.[0] ?? null,
                                        );
                                        setData('remove_photo', false);
                                    }}
                                />
                            </label>
                            {photoPreview && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('photo', null);
                                        setData('remove_photo', true);
                                    }}
                                    className="inline-flex w-fit items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                                >
                                    <X aria-hidden="true" size={12} />
                                    Quitar
                                </button>
                            )}
                            {errors.photo && (
                                <p className="text-xs text-red-600">
                                    {errors.photo}
                                </p>
                            )}
                            <Field
                                label="Texto alternativo"
                                error={errors.photo_alt}
                            >
                                <Input
                                    value={data.photo_alt}
                                    onChange={(e) =>
                                        setData('photo_alt', e.target.value)
                                    }
                                />
                            </Field>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>CV (PDF)</Label>
                            <div className="flex h-28 w-44 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-qd-mist bg-qd-bg p-2 text-center dark:border-qd-white/10 dark:bg-qd-ink">
                                {cvName ? (
                                    <>
                                        <FileText
                                            aria-hidden="true"
                                            size={20}
                                            className="text-qd-text-medium"
                                        />
                                        <span className="truncate text-xs text-qd-text-medium dark:text-qd-white/40">
                                            {cvName}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-xs text-qd-text-medium dark:text-qd-white/40">
                                        Sin CV
                                    </span>
                                )}
                            </div>
                            <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-qd-mist px-3 py-1.5 text-xs font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70">
                                <Upload aria-hidden="true" size={13} />
                                Subir
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        setData(
                                            'cv',
                                            e.target.files?.[0] ?? null,
                                        );
                                        setData('remove_cv', false);
                                    }}
                                />
                            </label>
                            {cvName && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('cv', null);
                                        setData('remove_cv', true);
                                    }}
                                    className="inline-flex w-fit items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                                >
                                    <X aria-hidden="true" size={12} />
                                    Quitar
                                </button>
                            )}
                            {errors.cv && (
                                <p className="text-xs text-red-600">
                                    {errors.cv}
                                </p>
                            )}
                        </div>
                    </div>
                </FormSection>
            </div>

            <div className="flex flex-col gap-6">
                <FormSection title="Publicación">
                    <div className="flex flex-col gap-4">
                        <Field label="Orden" error={errors.sort_order}>
                            <Input
                                type="number"
                                min={0}
                                value={data.sort_order}
                                onChange={(e) =>
                                    setData(
                                        'sort_order',
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection title="Visibilidad">
                    <div className="flex flex-col divide-y divide-qd-mist dark:divide-qd-white/10">
                        <ToggleRow
                            label="Activo"
                            checked={data.is_active}
                            onChange={(v) => setData('is_active', v)}
                        />
                        <ToggleRow
                            label="Visible en Quiénes somos"
                            checked={data.is_visible}
                            onChange={(v) => setData('is_visible', v)}
                        />
                    </div>
                </FormSection>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60 dark:bg-qd-teal dark:text-qd-ink"
                    >
                        {processing && (
                            <Loader2
                                aria-hidden="true"
                                size={16}
                                className="animate-spin"
                            />
                        )}
                        Guardar
                    </button>
                    <a
                        href="/admin/team-members"
                        className="text-sm font-semibold text-qd-text-medium hover:text-qd-text-high dark:text-qd-white/50"
                    >
                        Cancelar
                    </a>
                </div>
            </div>
        </form>
    );
}

const textareaClass =
    'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

function LocaleTabs({
    activeLocale,
    onChange,
}: {
    readonly activeLocale: Locale;
    readonly onChange: (locale: Locale) => void;
}) {
    const locales: readonly Locale[] = ['es', 'en'];

    return (
        <div className="inline-flex rounded-lg border border-qd-mist p-1 dark:border-qd-white/10">
            {locales.map((locale) => (
                <button
                    key={locale}
                    type="button"
                    onClick={() => onChange(locale)}
                    className={cn(
                        'rounded-md px-4 py-1.5 text-sm font-semibold transition',
                        activeLocale === locale
                            ? 'bg-qd-teal-2/10 text-qd-teal-2 dark:bg-qd-teal/10 dark:text-qd-teal'
                            : 'text-qd-text-medium hover:text-qd-text-high dark:text-qd-white/50',
                    )}
                >
                    {locale.toUpperCase()}
                </button>
            ))}
        </div>
    );
}

function Field({
    label,
    hint,
    error,
    children,
}: {
    readonly label: string;
    readonly hint?: string;
    readonly error?: string;
    readonly children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label>{label}</Label>
            {children}
            {hint && !error && (
                <p className="text-xs text-qd-text-medium dark:text-qd-white/40">
                    {hint}
                </p>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

function ToggleRow({
    label,
    checked,
    onChange,
}: {
    readonly label: string;
    readonly checked: boolean;
    readonly onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <p className="text-sm font-medium text-qd-ink dark:text-qd-white">
                {label}
            </p>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={label}
                onClick={() => onChange(!checked)}
                className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition',
                    checked
                        ? 'bg-qd-teal-2 dark:bg-qd-teal'
                        : 'bg-qd-mist dark:bg-qd-white/15',
                )}
            >
                <span
                    className={cn(
                        'inline-block size-5 transform rounded-full bg-white shadow transition',
                        checked ? 'translate-x-5.5' : 'translate-x-0.5',
                    )}
                />
            </button>
        </div>
    );
}

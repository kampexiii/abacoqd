import { useForm } from '@inertiajs/react';
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

import { adminSelectClass as selectClass } from '@/components/admin/AdminSelect';
import FormSection from '@/components/admin/FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type LocalizedInput = { es: string; en: string };
export type Option = { readonly value: string; readonly label: string };
export type SocialLink = {
    readonly platform: string | null;
    readonly url: string | null;
};

export type AdminPartnerRecord = {
    readonly id: number;
    readonly name: string;
    readonly slug: string;
    readonly type: string;
    readonly logo: string | null;
    readonly logoDark: string | null;
    readonly logoAlt: string | null;
    readonly website: string | null;
    readonly socialLinks: readonly SocialLink[] | null;
    readonly description: Partial<LocalizedInput> | null;
    readonly permissionStatus: string;
    readonly permissionNotes: string | null;
    readonly showOnHome: boolean;
    readonly showInCollaborations: boolean;
    readonly showInProjects: boolean;
    readonly isFeatured: boolean;
    readonly isActive: boolean;
    readonly sortOrder: number;
};

type PartnerFormData = {
    name: string;
    slug: string;
    type: string;
    logo: File | null;
    remove_logo: boolean;
    logo_dark: File | null;
    remove_logo_dark: boolean;
    logo_alt: string;
    website: string;
    social_links: { platform: string; url: string }[];
    description: LocalizedInput;
    permission_status: string;
    permission_notes: string;
    show_on_home: boolean;
    show_in_collaborations: boolean;
    show_in_projects: boolean;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
};

type PartnerFormProps = {
    readonly mode: 'create' | 'edit';
    readonly types: readonly Option[];
    readonly permissionStatuses: readonly Option[];
    readonly partner?: AdminPartnerRecord;
    readonly defaultSortOrder?: number;
};

function localized(
    value: Partial<LocalizedInput> | null | undefined,
): LocalizedInput {
    return { es: value?.es ?? '', en: value?.en ?? '' };
}

export default function PartnerForm({
    mode,
    types,
    permissionStatuses,
    partner,
    defaultSortOrder = 1,
}: PartnerFormProps) {
    const [activeLocale, setActiveLocale] = useState<'es' | 'en'>('es');

    const form = useForm<PartnerFormData>({
        name: partner?.name ?? '',
        slug: partner?.slug ?? '',
        type: partner?.type ?? types[0]?.value ?? 'other',
        logo: null,
        remove_logo: false,
        logo_dark: null,
        remove_logo_dark: false,
        logo_alt: partner?.logoAlt ?? '',
        website: partner?.website ?? '',
        social_links: (partner?.socialLinks ?? []).map((link) => ({
            platform: link.platform ?? '',
            url: link.url ?? '',
        })),
        description: localized(partner?.description),
        permission_status: partner?.permissionStatus ?? 'pending',
        permission_notes: partner?.permissionNotes ?? '',
        show_on_home: partner?.showOnHome ?? false,
        show_in_collaborations: partner?.showInCollaborations ?? true,
        show_in_projects: partner?.showInProjects ?? true,
        is_featured: partner?.isFeatured ?? false,
        is_active: partner?.isActive ?? true,
        sort_order: partner?.sortOrder ?? defaultSortOrder,
    });

    const { data, setData, processing } = form;
    const errors = form.errors as Record<string, string>;

    const logoPreview = useMemo(() => {
        if (data.logo instanceof File) {
            return URL.createObjectURL(data.logo);
        }

        if (partner?.logo && !data.remove_logo) {
            return partner.logo;
        }

        return null;
    }, [data.logo, data.remove_logo, partner?.logo]);

    const logoDarkPreview = useMemo(() => {
        if (data.logo_dark instanceof File) {
            return URL.createObjectURL(data.logo_dark);
        }

        if (partner?.logoDark && !data.remove_logo_dark) {
            return partner.logoDark;
        }

        return null;
    }, [data.logo_dark, data.remove_logo_dark, partner]);

    const setDescription = (locale: 'es' | 'en', value: string) => {
        setData('description', { ...data.description, [locale]: value });
    };

    const addSocialLink = () => {
        setData('social_links', [
            ...data.social_links,
            { platform: '', url: '' },
        ]);
    };

    const updateSocialLink = (
        index: number,
        field: 'platform' | 'url',
        value: string,
    ) => {
        setData(
            'social_links',
            data.social_links.map((link, i) =>
                i === index ? { ...link, [field]: value } : link,
            ),
        );
    };

    const removeSocialLink = (index: number) => {
        setData(
            'social_links',
            data.social_links.filter((_, i) => i !== index),
        );
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        const options = { forceFormData: true, preserveScroll: true } as const;

        if (mode === 'create') {
            form.post('/admin/partners', options);

            return;
        }

        form.transform((current) => ({ ...current, _method: 'put' }));
        form.post(`/admin/partners/${partner?.id}`, options);
    };

    return (
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
                <FormSection
                    title="Datos del partner"
                    description="Nombre, slug y tipo (no es bilingüe)."
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

                        <Field label="Tipo" error={errors.type}>
                            <select
                                value={data.type}
                                onChange={(e) =>
                                    setData('type', e.target.value)
                                }
                                className={selectClass}
                            >
                                {types.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Sitio web" error={errors.website}>
                            <Input
                                value={data.website}
                                onChange={(e) =>
                                    setData('website', e.target.value)
                                }
                                placeholder="https://..."
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection
                    title="Descripción"
                    description="Texto bilingüe opcional para fichas de partner."
                >
                    <LocaleTabs
                        activeLocale={activeLocale}
                        onChange={setActiveLocale}
                    />
                    <div className="mt-4">
                        <Field
                            label="Descripción"
                            error={errors[`description.${activeLocale}`]}
                        >
                            <textarea
                                value={data.description[activeLocale]}
                                onChange={(e) =>
                                    setDescription(activeLocale, e.target.value)
                                }
                                rows={4}
                                className={textareaClass}
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection title="Redes sociales">
                    <div className="flex flex-col gap-3">
                        {data.social_links.map((link, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <Input
                                    placeholder="Plataforma (ej. LinkedIn)"
                                    value={link.platform}
                                    onChange={(e) =>
                                        updateSocialLink(
                                            index,
                                            'platform',
                                            e.target.value,
                                        )
                                    }
                                    className="w-40"
                                />
                                <Input
                                    placeholder="URL"
                                    value={link.url}
                                    onChange={(e) =>
                                        updateSocialLink(
                                            index,
                                            'url',
                                            e.target.value,
                                        )
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSocialLink(index)}
                                    className="flex size-9 shrink-0 items-center justify-center text-red-600 hover:text-red-700"
                                >
                                    <Trash2 aria-hidden="true" size={15} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addSocialLink}
                            className="inline-flex w-fit items-center gap-2 rounded-lg border border-qd-mist px-3 py-2 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70"
                        >
                            <Plus aria-hidden="true" size={15} />
                            Añadir red social
                        </button>
                    </div>
                </FormSection>

                <FormSection
                    title="Logos"
                    description="PNG/JPEG/WebP se convierten a WebP; SVG se conserva tal cual."
                >
                    <div className="flex flex-wrap gap-8">
                        <LogoUpload
                            label="Logo claro"
                            preview={logoPreview}
                            onUpload={(file) => {
                                setData('logo', file);
                                setData('remove_logo', false);
                            }}
                            onRemove={() => {
                                setData('logo', null);
                                setData('remove_logo', true);
                            }}
                            error={errors.logo}
                        />
                        <LogoUpload
                            label="Logo oscuro"
                            preview={logoDarkPreview}
                            onUpload={(file) => {
                                setData('logo_dark', file);
                                setData('remove_logo_dark', false);
                            }}
                            onRemove={() => {
                                setData('logo_dark', null);
                                setData('remove_logo_dark', true);
                            }}
                            error={errors.logo_dark}
                        />
                    </div>
                    <div className="mt-4">
                        <Field
                            label="Texto alternativo del logo"
                            hint="Obligatorio si el permiso está aprobado."
                            error={errors.logo_alt}
                        >
                            <Input
                                value={data.logo_alt}
                                onChange={(e) =>
                                    setData('logo_alt', e.target.value)
                                }
                            />
                        </Field>
                    </div>
                </FormSection>
            </div>

            <div className="flex flex-col gap-6">
                <FormSection
                    title="Permiso de marca"
                    description="Solo partners aprobados se publican."
                >
                    <div className="flex flex-col gap-4">
                        <Field
                            label="Estado del permiso"
                            error={errors.permission_status}
                        >
                            <select
                                value={data.permission_status}
                                onChange={(e) =>
                                    setData('permission_status', e.target.value)
                                }
                                className={selectClass}
                            >
                                {permissionStatuses.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field
                            label="Notas de permiso"
                            error={errors.permission_notes}
                        >
                            <textarea
                                value={data.permission_notes}
                                onChange={(e) =>
                                    setData('permission_notes', e.target.value)
                                }
                                rows={3}
                                className={textareaClass}
                            />
                        </Field>

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

                <FormSection
                    title="Visibilidad"
                    description="Si está activo, el partner existe en el sistema. La noria de Colaboraciones del landing solo muestra los marcados aquí. Dentro de un proyecto, el partner aparece por su relación con ese proyecto, no por estos ajustes."
                >
                    <div className="flex flex-col divide-y divide-qd-mist dark:divide-qd-white/10">
                        <ToggleRow
                            label="Activo"
                            checked={data.is_active}
                            onChange={(v) => setData('is_active', v)}
                        />
                        <ToggleRow
                            label="Mostrar en la noria de Colaboraciones"
                            checked={data.show_in_collaborations}
                            onChange={(v) =>
                                setData('show_in_collaborations', v)
                            }
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
                        href="/admin/partners"
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
    readonly activeLocale: 'es' | 'en';
    readonly onChange: (locale: 'es' | 'en') => void;
}) {
    const locales: readonly ('es' | 'en')[] = ['es', 'en'];

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

function LogoUpload({
    label,
    preview,
    onUpload,
    onRemove,
    error,
}: {
    readonly label: string;
    readonly preview: string | null;
    readonly onUpload: (file: File | null) => void;
    readonly onRemove: () => void;
    readonly error?: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            <div className="flex h-20 w-32 items-center justify-center overflow-hidden rounded-xl border border-dashed border-qd-mist bg-qd-bg p-2 dark:border-qd-white/10 dark:bg-qd-ink">
                {preview ? (
                    <img
                        src={preview}
                        alt=""
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <span className="text-xs text-qd-text-medium dark:text-qd-white/40">
                        Sin logo
                    </span>
                )}
            </div>
            <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-qd-mist px-3 py-1.5 text-xs font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70">
                <Upload aria-hidden="true" size={13} />
                Subir
                <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
                />
            </label>
            {preview && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="inline-flex w-fit items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                >
                    <X aria-hidden="true" size={12} />
                    Quitar
                </button>
            )}
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}

import { useForm } from '@inertiajs/react';
import { Loader2, Upload, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

import AdminSelect, {
    adminSelectClass as selectClass,
} from '@/components/admin/AdminSelect';
import FormSection from '@/components/admin/FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Locale } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

export type LocalizedInput = { es: string; en: string };
export type Option = { readonly value: string; readonly label: string };
export type PartnerOption = { readonly value: number; readonly label: string };
export type ServiceOption = {
    readonly value: number;
    readonly label: string;
    readonly inactive: boolean;
};
export type ProjectPartner = {
    readonly id: number;
    readonly name: string;
    readonly role: string | null;
    readonly sortOrder: number | null;
};

export type AdminProjectRecord = {
    readonly id: number;
    readonly title: Partial<LocalizedInput> | null;
    readonly slug: Partial<LocalizedInput> | null;
    readonly summary: Partial<LocalizedInput> | null;
    readonly description: Partial<LocalizedInput> | null;
    readonly challenge: Partial<LocalizedInput> | null;
    readonly solution: Partial<LocalizedInput> | null;
    readonly result: Partial<LocalizedInput> | null;
    readonly coverImage: string | null;
    readonly logo: string | null;
    readonly logoDark: string | null;
    readonly logoAlt: string | null;
    readonly technologies: readonly string[];
    readonly status: string;
    readonly year: number | null;
    readonly clientName: string | null;
    readonly clientPartnerId: number | null;
    readonly githubUrl: string | null;
    readonly externalUrl: string | null;
    readonly showOnHome: boolean;
    readonly showInProjects: boolean;
    readonly showInCollaborations: boolean;
    readonly isActive: boolean;
    readonly sortOrder: number;
    readonly partners: readonly ProjectPartner[];
    readonly serviceIds: readonly number[];
};

const ROLE_OPTIONS = [
    { value: 'client', label: 'Cliente' },
    { value: 'collaborator', label: 'Colaborador' },
    { value: 'technology_partner', label: 'Partner tecnológico' },
    { value: 'brand', label: 'Marca' },
    { value: 'other', label: 'Otro' },
];

type ProjectFormData = {
    title: LocalizedInput;
    slug: LocalizedInput;
    summary: LocalizedInput;
    description: LocalizedInput;
    challenge: LocalizedInput;
    solution: LocalizedInput;
    result: LocalizedInput;
    technologies: string;
    status: string;
    year: number | '';
    client_name: string;
    client_partner_id: number | '';
    github_url: string;
    external_url: string;
    show_on_home: boolean;
    show_in_projects: boolean;
    show_in_collaborations: boolean;
    is_active: boolean;
    sort_order: number;
    cover_image: File | null;
    remove_cover_image: boolean;
    logo: File | null;
    remove_logo: boolean;
    logo_dark: File | null;
    remove_logo_dark: boolean;
    logo_alt: string;
    partners: { id: number; role: string; sort_order: number }[];
    services: number[];
};

type ProjectFormProps = {
    readonly mode: 'create' | 'edit';
    readonly statuses: readonly Option[];
    readonly partners: readonly PartnerOption[];
    readonly services: readonly ServiceOption[];
    readonly project?: AdminProjectRecord;
    readonly defaultSortOrder?: number;
};

function localized(
    value: Partial<LocalizedInput> | null | undefined,
): LocalizedInput {
    return { es: value?.es ?? '', en: value?.en ?? '' };
}

export default function ProjectForm({
    mode,
    statuses,
    partners,
    services,
    project,
    defaultSortOrder = 1,
}: ProjectFormProps) {
    const [activeLocale, setActiveLocale] = useState<Locale>('es');

    const form = useForm<ProjectFormData>({
        title: localized(project?.title),
        slug: localized(project?.slug),
        summary: localized(project?.summary),
        description: localized(project?.description),
        challenge: localized(project?.challenge),
        solution: localized(project?.solution),
        result: localized(project?.result),
        technologies: (project?.technologies ?? []).join(', '),
        status: project?.status ?? 'draft',
        year: project?.year ?? '',
        client_name: project?.clientName ?? '',
        client_partner_id: project?.clientPartnerId ?? '',
        github_url: project?.githubUrl ?? '',
        external_url: project?.externalUrl ?? '',
        show_on_home: project?.showOnHome ?? false,
        show_in_projects: project?.showInProjects ?? true,
        show_in_collaborations: project?.showInCollaborations ?? false,
        is_active: project?.isActive ?? true,
        sort_order: project?.sortOrder ?? defaultSortOrder,
        cover_image: null,
        remove_cover_image: false,
        logo: null,
        remove_logo: false,
        logo_dark: null,
        remove_logo_dark: false,
        logo_alt: project?.logoAlt ?? '',
        partners: (project?.partners ?? []).map((p) => ({
            id: p.id,
            role: p.role ?? 'other',
            sort_order: p.sortOrder ?? 0,
        })),
        services: [...(project?.serviceIds ?? [])],
    });

    const { data, setData, processing } = form;
    const errors = form.errors as Record<string, string>;

    const coverPreview = useMemo(() => {
        if (data.cover_image instanceof File) {
            return URL.createObjectURL(data.cover_image);
        }

        if (project?.coverImage && !data.remove_cover_image) {
            return project.coverImage;
        }

        return null;
    }, [data.cover_image, data.remove_cover_image, project?.coverImage]);

    const logoPreview = useMemo(() => {
        if (data.logo instanceof File) {
            return URL.createObjectURL(data.logo);
        }

        if (project?.logo && !data.remove_logo) {
            return project.logo;
        }

        return null;
    }, [data.logo, data.remove_logo, project]);

    const logoDarkPreview = useMemo(() => {
        if (data.logo_dark instanceof File) {
            return URL.createObjectURL(data.logo_dark);
        }

        if (project?.logoDark && !data.remove_logo_dark) {
            return project.logoDark;
        }

        return null;
    }, [data.logo_dark, data.remove_logo_dark, project]);

    const setLocalized = (
        field:
            | 'title'
            | 'slug'
            | 'summary'
            | 'description'
            | 'challenge'
            | 'solution'
            | 'result',
        locale: Locale,
        value: string,
    ) => {
        setData(field, { ...data[field], [locale]: value });
    };

    const togglePartner = (id: number) => {
        const exists = data.partners.find((p) => p.id === id);

        setData(
            'partners',
            exists
                ? data.partners.filter((p) => p.id !== id)
                : [
                      ...data.partners,
                      { id, role: 'other', sort_order: data.partners.length },
                  ],
        );
    };

    const toggleService = (id: number) => {
        setData(
            'services',
            data.services.includes(id)
                ? data.services.filter((serviceId) => serviceId !== id)
                : [...data.services, id],
        );
    };

    const updatePartnerRole = (id: number, role: string) => {
        setData(
            'partners',
            data.partners.map((p) => (p.id === id ? { ...p, role } : p)),
        );
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        const options = { forceFormData: true, preserveScroll: true } as const;
        const technologies = data.technologies
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);

        form.transform((current) => ({
            ...current,
            technologies,
            ...(mode === 'edit' ? { _method: 'put' } : {}),
        }));

        if (mode === 'create') {
            form.post('/admin/projects', options);

            return;
        }

        form.post(`/admin/projects/${project?.id}`, options);
    };

    return (
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
                <FormSection
                    title="Contenido"
                    description="Título, slug, resumen y narrativa en ES/EN."
                >
                    <LocaleTabs
                        activeLocale={activeLocale}
                        onChange={setActiveLocale}
                    />

                    <div className="mt-5 flex flex-col gap-4">
                        <Field
                            label="Título"
                            error={errors[`title.${activeLocale}`]}
                        >
                            <Input
                                value={data.title[activeLocale]}
                                onChange={(e) =>
                                    setLocalized(
                                        'title',
                                        activeLocale,
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>

                        <Field
                            label="Slug"
                            hint="Solo minúsculas, números y guiones."
                            error={errors[`slug.${activeLocale}`]}
                        >
                            <Input
                                value={data.slug[activeLocale]}
                                onChange={(e) =>
                                    setLocalized(
                                        'slug',
                                        activeLocale,
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>

                        <Field
                            label="Resumen"
                            error={errors[`summary.${activeLocale}`]}
                        >
                            <textarea
                                value={data.summary[activeLocale]}
                                onChange={(e) =>
                                    setLocalized(
                                        'summary',
                                        activeLocale,
                                        e.target.value,
                                    )
                                }
                                rows={3}
                                className={textareaClass}
                            />
                        </Field>

                        <Field
                            label="Descripción"
                            error={errors[`description.${activeLocale}`]}
                        >
                            <textarea
                                value={data.description[activeLocale]}
                                onChange={(e) =>
                                    setLocalized(
                                        'description',
                                        activeLocale,
                                        e.target.value,
                                    )
                                }
                                rows={5}
                                className={textareaClass}
                            />
                        </Field>

                        <Field
                            label="Reto"
                            error={errors[`challenge.${activeLocale}`]}
                        >
                            <textarea
                                value={data.challenge[activeLocale]}
                                onChange={(e) =>
                                    setLocalized(
                                        'challenge',
                                        activeLocale,
                                        e.target.value,
                                    )
                                }
                                rows={3}
                                className={textareaClass}
                            />
                        </Field>

                        <Field
                            label="Solución"
                            error={errors[`solution.${activeLocale}`]}
                        >
                            <textarea
                                value={data.solution[activeLocale]}
                                onChange={(e) =>
                                    setLocalized(
                                        'solution',
                                        activeLocale,
                                        e.target.value,
                                    )
                                }
                                rows={3}
                                className={textareaClass}
                            />
                        </Field>

                        <Field
                            label="Resultado"
                            error={errors[`result.${activeLocale}`]}
                        >
                            <textarea
                                value={data.result[activeLocale]}
                                onChange={(e) =>
                                    setLocalized(
                                        'result',
                                        activeLocale,
                                        e.target.value,
                                    )
                                }
                                rows={3}
                                className={textareaClass}
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection
                    title="Servicios / capacidades"
                    description="Selecciona los servicios relacionados con este proyecto. Se eligen desde Servicios; no es texto libre."
                >
                    {services.length === 0 ? (
                        <p className="text-sm text-qd-text-medium dark:text-qd-white/50">
                            No hay servicios disponibles. Crea servicios primero.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {services.map((service) => (
                                <label
                                    key={service.value}
                                    className="flex items-center gap-2 rounded-lg border border-qd-mist p-2 dark:border-qd-white/10"
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.services.includes(
                                            service.value,
                                        )}
                                        onChange={() =>
                                            toggleService(service.value)
                                        }
                                        className="size-4"
                                    />
                                    <span className="flex-1 text-sm text-qd-ink dark:text-qd-white">
                                        {service.label}
                                    </span>
                                    {service.inactive && (
                                        <span className="rounded-full bg-qd-mist px-2 py-0.5 text-xs font-semibold text-qd-text-medium dark:bg-qd-white/10">
                                            Inactivo
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>
                    )}
                </FormSection>

                <FormSection
                    title="Tecnologías"
                    description="Separadas por comas."
                >
                    <Input
                        value={data.technologies}
                        onChange={(e) =>
                            setData('technologies', e.target.value)
                        }
                        placeholder="Laravel, React, TypeScript"
                    />
                </FormSection>

                <FormSection
                    title="Imagen del proyecto"
                    description="Una sola imagen: se usará como portada y miniatura del proyecto. Raster se convierte a WebP."
                >
                    <ImageUpload
                        label="Imagen del proyecto"
                        preview={coverPreview}
                        onUpload={(file) => {
                            setData('cover_image', file);
                            setData('remove_cover_image', false);
                        }}
                        onRemove={() => {
                            setData('cover_image', null);
                            setData('remove_cover_image', true);
                        }}
                        error={errors.cover_image}
                    />
                    <p className="mt-3 text-xs text-qd-text-medium dark:text-qd-white/40">
                        La miniatura se genera automáticamente desde esta imagen.
                    </p>
                </FormSection>

                <FormSection
                    title="Logo del cliente / empresa"
                    description="PNG/JPEG/WebP se convierten a WebP; SVG se conserva tal cual."
                >
                    <div className="flex flex-wrap gap-8">
                        <ImageUpload
                            label="Logo color"
                            hint="Se usa principalmente en modo claro."
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
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
                        <ImageUpload
                            label="Logo monocromo"
                            hint="Se usa principalmente en modo oscuro."
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
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
                            hint="Describe el logo para accesibilidad (recomendado)."
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

                <FormSection
                    title="Partners asociados"
                    description="Rol explícito por partner para evitar atribuciones falsas."
                >
                    <div className="flex flex-col gap-2">
                        {partners.map((option) => {
                            const assigned = data.partners.find(
                                (p) => p.id === option.value,
                            );

                            return (
                                <div
                                    key={option.value}
                                    className="flex items-center gap-2 rounded-lg border border-qd-mist p-2 dark:border-qd-white/10"
                                >
                                    <input
                                        type="checkbox"
                                        checked={!!assigned}
                                        onChange={() =>
                                            togglePartner(option.value)
                                        }
                                        className="size-4"
                                    />
                                    <span className="flex-1 text-sm text-qd-ink dark:text-qd-white">
                                        {option.label}
                                    </span>
                                    {assigned && (
                                        <AdminSelect
                                            value={assigned.role}
                                            onChange={(e) =>
                                                updatePartnerRole(
                                                    option.value,
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 w-auto px-2 text-xs"
                                        >
                                            {ROLE_OPTIONS.map((role) => (
                                                <option
                                                    key={role.value}
                                                    value={role.value}
                                                >
                                                    {role.label}
                                                </option>
                                            ))}
                                        </AdminSelect>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </FormSection>
            </div>

            <div className="flex flex-col gap-6">
                <FormSection title="Publicación">
                    <div className="flex flex-col gap-4">
                        <Field label="Estado" error={errors.status}>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className={selectClass}
                            >
                                {statuses.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Año" error={errors.year}>
                            <Input
                                type="number"
                                value={data.year}
                                onChange={(e) =>
                                    setData(
                                        'year',
                                        e.target.value === ''
                                            ? ''
                                            : Number(e.target.value),
                                    )
                                }
                            />
                        </Field>

                        <Field
                            label="Cliente (nombre libre)"
                            error={errors.client_name}
                        >
                            <Input
                                value={data.client_name}
                                onChange={(e) =>
                                    setData('client_name', e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="Partner cliente principal"
                            error={errors.client_partner_id}
                        >
                            <select
                                value={data.client_partner_id}
                                onChange={(e) =>
                                    setData(
                                        'client_partner_id',
                                        e.target.value === ''
                                            ? ''
                                            : Number(e.target.value),
                                    )
                                }
                                className={selectClass}
                            >
                                <option value="">Sin partner asociado</option>
                                {partners.map((option) => (
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
                            label="URL del repositorio"
                            error={errors.github_url}
                        >
                            <Input
                                value={data.github_url}
                                onChange={(e) =>
                                    setData('github_url', e.target.value)
                                }
                                placeholder="https://github.com/..."
                            />
                        </Field>

                        <Field label="URL externa" error={errors.external_url}>
                            <Input
                                value={data.external_url}
                                onChange={(e) =>
                                    setData('external_url', e.target.value)
                                }
                                placeholder="https://..."
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

                <FormSection title="Visibilidad">
                    <div className="flex flex-col divide-y divide-qd-mist dark:divide-qd-white/10">
                        <ToggleRow
                            label="Activo"
                            checked={data.is_active}
                            onChange={(v) => setData('is_active', v)}
                        />
                        <ToggleRow
                            label="Mostrar en home"
                            checked={data.show_on_home}
                            onChange={(v) => setData('show_on_home', v)}
                        />
                        <ToggleRow
                            label="Mostrar en Proyectos"
                            checked={data.show_in_projects}
                            onChange={(v) => setData('show_in_projects', v)}
                        />
                        <ToggleRow
                            label="Mostrar en Colaboraciones"
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
                        href="/admin/projects"
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

function ImageUpload({
    label,
    hint,
    accept = 'image/png,image/jpeg,image/webp',
    preview,
    onUpload,
    onRemove,
    error,
}: {
    readonly label: string;
    readonly hint?: string;
    readonly accept?: string;
    readonly preview: string | null;
    readonly onUpload: (file: File | null) => void;
    readonly onRemove: () => void;
    readonly error?: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            <div className="flex h-28 w-44 items-center justify-center overflow-hidden rounded-xl border border-dashed border-qd-mist bg-qd-bg dark:border-qd-white/10 dark:bg-qd-ink">
                {preview ? (
                    <img
                        src={preview}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-xs text-qd-text-medium dark:text-qd-white/40">
                        Sin imagen
                    </span>
                )}
            </div>
            <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-qd-mist px-3 py-2 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70">
                <Upload aria-hidden="true" size={15} />
                Subir
                <input
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
                />
            </label>
            {hint && !error && (
                <p className="text-xs text-qd-text-medium dark:text-qd-white/40">
                    {hint}
                </p>
            )}
            {preview && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
                >
                    <X aria-hidden="true" size={14} />
                    Quitar
                </button>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

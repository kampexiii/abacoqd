import { useForm } from '@inertiajs/react';
import { Loader2, Upload, X } from 'lucide-react';
import { useMemo, useState   } from 'react';
import type {FormEvent, ReactNode} from 'react';

import { adminSelectClass as selectClass } from '@/components/admin/AdminSelect';
import FormSection from '@/components/admin/FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/use-language';
import type { Locale } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

export type LocalizedInput = { es: string; en: string };

export type StatusOption = { readonly value: string; readonly label: string };

export type AdminServiceRecord = {
    readonly id: number;
    readonly title: Partial<LocalizedInput> | null;
    readonly slug: Partial<LocalizedInput> | null;
    readonly summary: Partial<LocalizedInput> | null;
    readonly description: Partial<LocalizedInput> | null;
    readonly icon: string | null;
    readonly image: string | null;
    readonly cta: {
        readonly label: Partial<LocalizedInput> | null;
        readonly url: Partial<LocalizedInput> | null;
    } | null;
    readonly status: string;
    readonly isActive: boolean;
    readonly showOnHome: boolean;
    readonly isDetailEnabled: boolean;
    readonly sortOrder: number;
};

type ServiceFormData = {
    title: LocalizedInput;
    slug: LocalizedInput;
    summary: LocalizedInput;
    description: LocalizedInput;
    icon: string;
    cta: { label: LocalizedInput; url: LocalizedInput };
    status: string;
    sort_order: number;
    is_active: boolean;
    show_on_home: boolean;
    is_detail_enabled: boolean;
    image: File | null;
    remove_image: boolean;
};

type ServiceFormProps = {
    readonly mode: 'create' | 'edit';
    readonly statuses: readonly StatusOption[];
    readonly service?: AdminServiceRecord;
    readonly defaultSortOrder?: number;
};

function localized(value: Partial<LocalizedInput> | null | undefined): LocalizedInput {
    return { es: value?.es ?? '', en: value?.en ?? '' };
}

export default function ServiceForm({
    mode,
    statuses,
    service,
    defaultSortOrder = 1,
}: ServiceFormProps) {
    const { t } = useLanguage();
    const [activeLocale, setActiveLocale] = useState<Locale>('es');

    const form = useForm<ServiceFormData>({
        title: localized(service?.title),
        slug: localized(service?.slug),
        summary: localized(service?.summary),
        description: localized(service?.description),
        icon: service?.icon ?? '',
        cta: {
            label: localized(service?.cta?.label),
            url: localized(service?.cta?.url),
        },
        status: service?.status ?? 'draft',
        sort_order: service?.sortOrder ?? defaultSortOrder,
        is_active: service?.isActive ?? true,
        show_on_home: service?.showOnHome ?? true,
        is_detail_enabled: service?.isDetailEnabled ?? false,
        image: null,
        remove_image: false,
    });

    const { data, setData, processing } = form;
    const errors = form.errors as Record<string, string>;

    const imagePreview = useMemo(() => {
        if (data.image instanceof File) {
            return URL.createObjectURL(data.image);
        }

        if (service?.image && !data.remove_image) {
            return service.image;
        }

        return null;
    }, [data.image, data.remove_image, service?.image]);

    const setLocalized = (
        field: 'title' | 'slug' | 'summary' | 'description',
        locale: Locale,
        value: string,
    ) => {
        setData(field, { ...data[field], [locale]: value });
    };

    const setCta = (group: 'label' | 'url', locale: Locale, value: string) => {
        setData('cta', {
            ...data.cta,
            [group]: { ...data.cta[group], [locale]: value },
        });
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        const options = { forceFormData: true, preserveScroll: true } as const;

        if (mode === 'create') {
            form.post('/admin/services', options);

            return;
        }

        form.transform((current) => ({ ...current, _method: 'put' }));
        form.post(`/admin/services/${service?.id}`, options);
    };

    return (
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
                <FormSection
                    title={t('admin.services.form.contentTitle')}
                    description={t('admin.services.form.contentHint')}
                >
                    <LocaleTabs activeLocale={activeLocale} onChange={setActiveLocale} />

                    <div className="mt-5 flex flex-col gap-4">
                        <Field
                            label={t('admin.services.fields.title')}
                            error={errors[`title.${activeLocale}`]}
                        >
                            <Input
                                value={data.title[activeLocale]}
                                onChange={(e) => setLocalized('title', activeLocale, e.target.value)}
                            />
                        </Field>

                        <Field
                            label={t('admin.services.fields.slug')}
                            hint={t('admin.services.fields.slugHint')}
                            error={errors[`slug.${activeLocale}`]}
                        >
                            <Input
                                value={data.slug[activeLocale]}
                                onChange={(e) => setLocalized('slug', activeLocale, e.target.value)}
                            />
                        </Field>

                        <Field
                            label={t('admin.services.fields.summary')}
                            error={errors[`summary.${activeLocale}`]}
                        >
                            <textarea
                                value={data.summary[activeLocale]}
                                onChange={(e) =>
                                    setLocalized('summary', activeLocale, e.target.value)
                                }
                                rows={3}
                                className={textareaClass}
                            />
                        </Field>

                        <Field
                            label={t('admin.services.fields.description')}
                            hint={t('admin.services.fields.descriptionHint')}
                            error={errors[`description.${activeLocale}`]}
                        >
                            <textarea
                                value={data.description[activeLocale]}
                                onChange={(e) =>
                                    setLocalized('description', activeLocale, e.target.value)
                                }
                                rows={6}
                                className={textareaClass}
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection title={t('admin.services.form.ctaTitle')}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label={t('admin.services.fields.ctaLabel')}
                            error={errors[`cta.label.${activeLocale}`]}
                        >
                            <Input
                                value={data.cta.label[activeLocale]}
                                onChange={(e) => setCta('label', activeLocale, e.target.value)}
                            />
                        </Field>
                        <Field
                            label={t('admin.services.fields.ctaUrl')}
                            error={errors[`cta.url.${activeLocale}`]}
                        >
                            <Input
                                value={data.cta.url[activeLocale]}
                                onChange={(e) => setCta('url', activeLocale, e.target.value)}
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection
                    title={t('admin.services.form.mediaTitle')}
                    description={t('admin.services.form.mediaHint')}
                >
                    <div className="flex flex-wrap items-center gap-5">
                        <div className="flex h-28 w-44 items-center justify-center overflow-hidden rounded-xl border border-dashed border-qd-mist bg-qd-bg dark:border-qd-white/10 dark:bg-qd-ink">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-xs text-qd-text-medium dark:text-qd-white/40">
                                    {t('admin.services.form.noImage')}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-qd-mist px-3 py-2 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70">
                                <Upload aria-hidden="true" size={15} />
                                {t('admin.services.form.uploadImage')}
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={(e) => {
                                        setData('image', e.target.files?.[0] ?? null);
                                        setData('remove_image', false);
                                    }}
                                />
                            </label>
                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('image', null);
                                        setData('remove_image', true);
                                    }}
                                    className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
                                >
                                    <X aria-hidden="true" size={14} />
                                    {t('admin.services.form.removeImage')}
                                </button>
                            )}
                            {errors.image && (
                                <p className="text-sm text-red-600">{errors.image}</p>
                            )}
                        </div>
                    </div>
                </FormSection>
            </div>

            <div className="flex flex-col gap-6">
                <FormSection title={t('admin.services.form.publishTitle')}>
                    <div className="flex flex-col gap-4">
                        <Field label={t('admin.services.fields.status')} error={errors.status}>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className={selectClass}
                            >
                                {statuses.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field
                            label={t('admin.services.fields.sortOrder')}
                            error={errors.sort_order}
                        >
                            <Input
                                type="number"
                                min={0}
                                value={data.sort_order}
                                onChange={(e) =>
                                    setData('sort_order', Number(e.target.value))
                                }
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection title={t('admin.services.form.visibilityTitle')}>
                    <div className="flex flex-col divide-y divide-qd-mist dark:divide-qd-white/10">
                        <ToggleRow
                            label={t('admin.services.fields.isActive')}
                            checked={data.is_active}
                            onChange={(value) => setData('is_active', value)}
                        />
                        <ToggleRow
                            label={t('admin.services.fields.isDetailEnabled')}
                            description={t('admin.services.fields.isDetailEnabledHint')}
                            checked={data.is_detail_enabled}
                            onChange={(value) => setData('is_detail_enabled', value)}
                        />
                    </div>
                </FormSection>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60 dark:bg-qd-teal dark:text-qd-ink"
                    >
                        {processing && <Loader2 aria-hidden="true" size={16} className="animate-spin" />}
                        {t('admin.services.form.save')}
                    </button>
                    <a
                        href="/admin/services"
                        className="text-sm font-semibold text-qd-text-medium hover:text-qd-text-high dark:text-qd-white/50"
                    >
                        {t('admin.services.form.cancel')}
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
                <p className="text-xs text-qd-text-medium dark:text-qd-white/40">{hint}</p>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

function ToggleRow({
    label,
    description,
    checked,
    onChange,
}: {
    readonly label: string;
    readonly description?: string;
    readonly checked: boolean;
    readonly onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div>
                <p className="text-sm font-medium text-qd-ink dark:text-qd-white">{label}</p>
                {description && (
                    <p className="mt-0.5 text-xs text-qd-text-medium dark:text-qd-white/40">
                        {description}
                    </p>
                )}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={label}
                onClick={() => onChange(!checked)}
                className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition',
                    checked ? 'bg-qd-teal-2 dark:bg-qd-teal' : 'bg-qd-mist dark:bg-qd-white/15',
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

import { useForm } from '@inertiajs/react';
import { Loader2, Upload, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

import { adminSelectClass as selectClass } from '@/components/admin/AdminSelect';
import FormSection from '@/components/admin/FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Locale } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

export type LocalizedInput = { es: string; en: string };
export type Option = { readonly value: number | string; readonly label: string | null };

export type AdminPostRecord = {
    readonly id: number;
    readonly title: Partial<LocalizedInput> | null;
    readonly slug: Partial<LocalizedInput> | null;
    readonly excerpt: Partial<LocalizedInput> | null;
    readonly content: Partial<LocalizedInput> | null;
    readonly featuredImage: string | null;
    readonly status: string;
    readonly publishedAt: string | null;
    readonly categoryId: number | null;
    readonly tagIds: readonly number[];
    readonly isFeatured: boolean;
};

/**
 * Convierte el `published_at` ISO 8601 (UTC) que envía el backend al formato
 * `YYYY-MM-DDTHH:mm` que exige el input `datetime-local`. La app trabaja en UTC
 * (config/app.php), así que se corta la cadena sin conversión de zona horaria:
 * lo que se ve en el campo es exactamente lo que se persiste (round-trip exacto)
 * y editar un post deja de borrar su fecha de publicación.
 */
function toDateTimeLocal(iso: string | null | undefined): string {
    return iso ? iso.slice(0, 16) : '';
}

type PostFormData = {
    post_category_id: number | '';
    tags: number[];
    title: LocalizedInput;
    slug: LocalizedInput;
    excerpt: LocalizedInput;
    content: LocalizedInput;
    status: string;
    published_at: string;
    is_featured: boolean;
    image: File | null;
    remove_image: boolean;
};

type PostFormProps = {
    readonly mode: 'create' | 'edit';
    readonly statuses: readonly { value: string; label: string }[];
    readonly categories: readonly Option[];
    readonly tags: readonly Option[];
    readonly post?: AdminPostRecord;
};

function localized(value: Partial<LocalizedInput> | null | undefined): LocalizedInput {
    return { es: value?.es ?? '', en: value?.en ?? '' };
}

export default function PostForm({ mode, statuses, categories, tags, post }: PostFormProps) {
    const [activeLocale, setActiveLocale] = useState<Locale>('es');

    const form = useForm<PostFormData>({
        post_category_id: post?.categoryId ?? (categories[0]?.value as number) ?? '',
        tags: [...(post?.tagIds ?? [])],
        title: localized(post?.title),
        slug: localized(post?.slug),
        excerpt: localized(post?.excerpt),
        content: localized(post?.content),
        status: post?.status ?? 'draft',
        published_at: toDateTimeLocal(post?.publishedAt),
        is_featured: post?.isFeatured ?? false,
        image: null,
        remove_image: false,
    });

    const { data, setData, processing } = form;
    const errors = form.errors as Record<string, string>;

    const imagePreview = useMemo(() => {
        if (data.image instanceof File) {
            return URL.createObjectURL(data.image);
        }

        if (post?.featuredImage && !data.remove_image) {
            return post.featuredImage;
        }

        return null;
    }, [data.image, data.remove_image, post?.featuredImage]);

    const setLocalized = (field: 'title' | 'slug' | 'excerpt' | 'content', locale: Locale, value: string) => {
        setData(field, { ...data[field], [locale]: value });
    };

    const toggleTag = (id: number) => {
        setData('tags', data.tags.includes(id) ? data.tags.filter((t) => t !== id) : [...data.tags, id]);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        const options = { forceFormData: true, preserveScroll: true } as const;

        if (mode === 'create') {
            form.post('/admin/posts', options);

            return;
        }

        form.transform((current) => ({ ...current, _method: 'put' }));
        form.post(`/admin/posts/${post?.id}`, options);
    };

    return (
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
                <FormSection title="Contenido" description="Título, slug, extracto y cuerpo en ES/EN.">
                    <LocaleTabs activeLocale={activeLocale} onChange={setActiveLocale} />

                    <div className="mt-5 flex flex-col gap-4">
                        <Field label="Título" error={errors[`title.${activeLocale}`]}>
                            <Input
                                value={data.title[activeLocale]}
                                onChange={(e) => setLocalized('title', activeLocale, e.target.value)}
                            />
                        </Field>

                        <Field label="Slug" hint="Solo minúsculas, números y guiones." error={errors[`slug.${activeLocale}`]}>
                            <Input
                                value={data.slug[activeLocale]}
                                onChange={(e) => setLocalized('slug', activeLocale, e.target.value)}
                            />
                        </Field>

                        <Field label="Extracto" error={errors[`excerpt.${activeLocale}`]}>
                            <textarea
                                value={data.excerpt[activeLocale]}
                                onChange={(e) => setLocalized('excerpt', activeLocale, e.target.value)}
                                rows={3}
                                className={textareaClass}
                            />
                        </Field>

                        <Field label="Contenido (Markdown)" error={errors[`content.${activeLocale}`]}>
                            <textarea
                                value={data.content[activeLocale]}
                                onChange={(e) => setLocalized('content', activeLocale, e.target.value)}
                                rows={14}
                                className={cn(textareaClass, 'font-mono text-xs')}
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection title="Portada" description="Se convierte automáticamente a WebP.">
                    <div className="flex flex-wrap items-center gap-5">
                        <div className="flex h-28 w-44 items-center justify-center overflow-hidden rounded-xl border border-dashed border-qd-mist bg-qd-bg dark:border-qd-white/10 dark:bg-qd-ink">
                            {imagePreview ? (
                                <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-xs text-qd-text-medium dark:text-qd-white/40">Sin imagen</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-qd-mist px-3 py-2 text-sm font-semibold text-qd-text-high transition hover:border-qd-teal-2/40 dark:border-qd-white/10 dark:text-qd-white/70">
                                <Upload aria-hidden="true" size={15} />
                                Subir imagen
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
                                    Quitar imagen
                                </button>
                            )}
                            {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                        </div>
                    </div>
                </FormSection>
            </div>

            <div className="flex flex-col gap-6">
                <FormSection title="Publicación">
                    <div className="flex flex-col gap-4">
                        <Field label="Categoría" error={errors.post_category_id}>
                            <select
                                value={data.post_category_id}
                                onChange={(e) => setData('post_category_id', Number(e.target.value))}
                                className={selectClass}
                            >
                                {categories.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Estado" error={errors.status}>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)} className={selectClass}>
                                {statuses.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Fecha de publicación" error={errors.published_at}>
                            <Input
                                type="datetime-local"
                                value={data.published_at}
                                onChange={(e) => setData('published_at', e.target.value)}
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection title="Tags">
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <button
                                key={tag.value}
                                type="button"
                                onClick={() => toggleTag(Number(tag.value))}
                                className={cn(
                                    'rounded-full border px-3 py-1 text-xs font-semibold transition',
                                    data.tags.includes(Number(tag.value))
                                        ? 'border-qd-teal-2 bg-qd-teal-2/10 text-qd-teal-2 dark:border-qd-teal dark:bg-qd-teal/10 dark:text-qd-teal'
                                        : 'border-qd-mist text-qd-text-medium dark:border-qd-white/10 dark:text-qd-white/50',
                                )}
                            >
                                {tag.label}
                            </button>
                        ))}
                    </div>
                </FormSection>

                <FormSection title="Destacados" description="Solo puede haber un post destacado: marcarlo desmarca automáticamente cualquier otro.">
                    <div className="flex flex-col divide-y divide-qd-mist dark:divide-qd-white/10">
                        <ToggleRow label="Destacado en landing (único)" checked={data.is_featured} onChange={(v) => setData('is_featured', v)} />
                    </div>
                </FormSection>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-lg bg-qd-teal-2 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60 dark:bg-qd-teal dark:text-qd-ink"
                    >
                        {processing && <Loader2 aria-hidden="true" size={16} className="animate-spin" />}
                        Guardar
                    </button>
                    <a href="/admin/posts" className="text-sm font-semibold text-qd-text-medium hover:text-qd-text-high dark:text-qd-white/50">
                        Cancelar
                    </a>
                </div>
            </div>
        </form>
    );
}

const textareaClass =
    'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

function LocaleTabs({ activeLocale, onChange }: { readonly activeLocale: Locale; readonly onChange: (locale: Locale) => void }) {
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

function Field({ label, hint, error, children }: { readonly label: string; readonly hint?: string; readonly error?: string; readonly children: ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label>{label}</Label>
            {children}
            {hint && !error && <p className="text-xs text-qd-text-medium dark:text-qd-white/40">{hint}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

function ToggleRow({ label, checked, onChange }: { readonly label: string; readonly checked: boolean; readonly onChange: (value: boolean) => void }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <p className="text-sm font-medium text-qd-ink dark:text-qd-white">{label}</p>
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
                <span className={cn('inline-block size-5 transform rounded-full bg-white shadow transition', checked ? 'translate-x-5.5' : 'translate-x-0.5')} />
            </button>
        </div>
    );
}

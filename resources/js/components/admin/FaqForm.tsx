import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

import FormSection from '@/components/admin/FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Locale } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

export type LocalizedInput = { es: string; en: string };

export type AdminFaqRecord = {
    readonly id: number;
    readonly question: Partial<LocalizedInput> | null;
    readonly answer: Partial<LocalizedInput> | null;
    readonly category: string | null;
    readonly intent: string | null;
    readonly redirectUrl: string | null;
    readonly redirectSection: string | null;
    readonly showInChatbot: boolean;
    readonly showOnPage: boolean;
    readonly isActive: boolean;
    readonly sortOrder: number;
};

type FaqFormData = {
    question: LocalizedInput;
    answer: LocalizedInput;
    category: string;
    intent: string;
    redirect_url: string;
    redirect_section: string;
    show_in_chatbot: boolean;
    show_on_page: boolean;
    is_active: boolean;
    sort_order: number;
};

type FaqFormProps = {
    readonly mode: 'create' | 'edit';
    readonly faq?: AdminFaqRecord;
    readonly defaultSortOrder?: number;
};

function localized(
    value: Partial<LocalizedInput> | null | undefined,
): LocalizedInput {
    return { es: value?.es ?? '', en: value?.en ?? '' };
}

export default function FaqForm({
    mode,
    faq,
    defaultSortOrder = 1,
}: FaqFormProps) {
    const [activeLocale, setActiveLocale] = useState<Locale>('es');

    const form = useForm<FaqFormData>({
        question: localized(faq?.question),
        answer: localized(faq?.answer),
        category: faq?.category ?? '',
        intent: faq?.intent ?? '',
        redirect_url: faq?.redirectUrl ?? '',
        redirect_section: faq?.redirectSection ?? '',
        show_in_chatbot: faq?.showInChatbot ?? true,
        show_on_page: faq?.showOnPage ?? false,
        is_active: faq?.isActive ?? true,
        sort_order: faq?.sortOrder ?? defaultSortOrder,
    });

    const { data, setData, processing } = form;
    const errors = form.errors as Record<string, string>;

    const setQuestion = (locale: Locale, value: string) =>
        setData('question', { ...data.question, [locale]: value });
    const setAnswer = (locale: Locale, value: string) =>
        setData('answer', { ...data.answer, [locale]: value });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (mode === 'create') {
            form.post('/admin/faqs', { preserveScroll: true });

            return;
        }

        form.put(`/admin/faqs/${faq?.id}`, { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
                <FormSection
                    title="Contenido"
                    description="Bilingüe ES/EN, español obligatorio."
                >
                    <LocaleTabs
                        activeLocale={activeLocale}
                        onChange={setActiveLocale}
                    />
                    <div className="mt-4 flex flex-col gap-4">
                        <Field
                            label="Pregunta"
                            error={errors[`question.${activeLocale}`]}
                        >
                            <Input
                                value={data.question[activeLocale]}
                                onChange={(e) =>
                                    setQuestion(activeLocale, e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Respuesta"
                            error={errors[`answer.${activeLocale}`]}
                        >
                            <textarea
                                value={data.answer[activeLocale]}
                                onChange={(e) =>
                                    setAnswer(activeLocale, e.target.value)
                                }
                                rows={5}
                                className={textareaClass}
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection
                    title="Clasificación y enlace"
                    description="Usados por el chatbot para enrutar la respuesta."
                >
                    <div className="flex flex-col gap-4">
                        <Field label="Categoría" error={errors.category}>
                            <Input
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
                                }
                                placeholder="services, contact, booking..."
                            />
                        </Field>
                        <Field label="Intent" error={errors.intent}>
                            <Input
                                value={data.intent}
                                onChange={(e) =>
                                    setData('intent', e.target.value)
                                }
                                placeholder="services_overview"
                            />
                        </Field>
                        <Field
                            label="URL de redirección"
                            error={errors.redirect_url}
                        >
                            <Input
                                value={data.redirect_url}
                                onChange={(e) =>
                                    setData('redirect_url', e.target.value)
                                }
                                placeholder="/servicios"
                            />
                        </Field>
                        <Field
                            label="Sección de redirección"
                            error={errors.redirect_section}
                        >
                            <Input
                                value={data.redirect_section}
                                onChange={(e) =>
                                    setData('redirect_section', e.target.value)
                                }
                            />
                        </Field>
                    </div>
                </FormSection>
            </div>

            <div className="flex flex-col gap-6">
                <FormSection title="Orden">
                    <Field label="Orden" error={errors.sort_order}>
                        <Input
                            type="number"
                            min={0}
                            value={data.sort_order}
                            onChange={(e) =>
                                setData('sort_order', Number(e.target.value))
                            }
                        />
                    </Field>
                </FormSection>

                <FormSection title="Visibilidad">
                    <div className="flex flex-col divide-y divide-qd-mist dark:divide-qd-white/10">
                        <ToggleRow
                            label="Activa"
                            checked={data.is_active}
                            onChange={(v) => setData('is_active', v)}
                        />
                        <ToggleRow
                            label="Mostrar en chatbot"
                            checked={data.show_in_chatbot}
                            onChange={(v) => setData('show_in_chatbot', v)}
                        />
                        <ToggleRow
                            label="Mostrar en página de FAQs"
                            checked={data.show_on_page}
                            onChange={(v) => setData('show_on_page', v)}
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
                        href="/admin/faqs"
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
    error,
    children,
}: {
    readonly label: string;
    readonly error?: string;
    readonly children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label>{label}</Label>
            {children}
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

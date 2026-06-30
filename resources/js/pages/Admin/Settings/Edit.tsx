import { Head, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';

import FormSection from '@/components/admin/FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

type SettingsForm = {
    contact_email: string;
    contact_phone: string;
    contact_whatsapp: string;
    contact_address: string;
    contact_city_country: string;
    form_recipient_email: string;
    social_linkedin: string;
    social_facebook: string;
    google_reviews_url: string;
    google_reviews_rating: string;
    google_reviews_count: string;
    footer_text: string;
    canonical_domain: string;
    previous_domain: string;
};

type EditProps = {
    readonly settings: Record<keyof SettingsForm, string | number | null>;
};

function str(value: string | number | null | undefined): string {
    return value === null || value === undefined ? '' : String(value);
}

export default function SettingsEdit({ settings }: EditProps) {
    const form = useForm<SettingsForm>({
        contact_email: str(settings.contact_email),
        contact_phone: str(settings.contact_phone),
        contact_whatsapp: str(settings.contact_whatsapp),
        contact_address: str(settings.contact_address),
        contact_city_country: str(settings.contact_city_country),
        form_recipient_email: str(settings.form_recipient_email),
        social_linkedin: str(settings.social_linkedin),
        social_facebook: str(settings.social_facebook),
        google_reviews_url: str(settings.google_reviews_url),
        google_reviews_rating: str(settings.google_reviews_rating),
        google_reviews_count: str(settings.google_reviews_count),
        footer_text: str(settings.footer_text),
        canonical_domain: str(settings.canonical_domain),
        previous_domain: str(settings.previous_domain),
    });

    const { data, setData, processing } = form;
    const errors = form.errors as Record<string, string>;

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put('/admin/settings', { preserveScroll: true });
    };

    const field = (key: keyof SettingsForm) => ({
        value: data[key],
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
            setData(key, e.target.value),
    });

    return (
        <AdminLayout
            title="Ajustes del sitio"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Ajustes' },
            ]}
        >
            <Head title="Ajustes · Admin AbacoQD" />

            <form onSubmit={submit} className="flex max-w-3xl flex-col gap-6">
                <FormSection
                    title="Datos de contacto"
                    description="Se muestran en el footer, la página de contacto y el asistente."
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="Email principal"
                            error={errors.contact_email}
                        >
                            <Input type="email" {...field('contact_email')} />
                        </Field>
                        <Field
                            label="Email receptor de formularios"
                            hint="Adónde llegan los contactos enviados desde la web."
                            error={errors.form_recipient_email}
                        >
                            <Input
                                type="email"
                                {...field('form_recipient_email')}
                            />
                        </Field>
                        <Field
                            label="Teléfono fijo"
                            error={errors.contact_phone}
                        >
                            <Input {...field('contact_phone')} />
                        </Field>
                        <Field label="WhatsApp" error={errors.contact_whatsapp}>
                            <Input {...field('contact_whatsapp')} />
                        </Field>
                        <Field
                            label="Dirección visible"
                            error={errors.contact_address}
                        >
                            <Input {...field('contact_address')} />
                        </Field>
                        <Field
                            label="Ciudad / país"
                            error={errors.contact_city_country}
                        >
                            <Input {...field('contact_city_country')} />
                        </Field>
                    </div>
                </FormSection>

                <FormSection title="Redes y prueba social">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="LinkedIn (URL)"
                            error={errors.social_linkedin}
                        >
                            <Input
                                {...field('social_linkedin')}
                                placeholder="https://..."
                            />
                        </Field>
                        <Field
                            label="Facebook (URL)"
                            error={errors.social_facebook}
                        >
                            <Input
                                {...field('social_facebook')}
                                placeholder="https://..."
                            />
                        </Field>
                        <Field
                            label="Google Reviews (URL)"
                            hint="Sin URL, el bloque del footer se oculta."
                            error={errors.google_reviews_url}
                        >
                            <Input
                                {...field('google_reviews_url')}
                                placeholder="https://..."
                            />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field
                                label="Rating (0–5)"
                                error={errors.google_reviews_rating}
                            >
                                <Input
                                    type="number"
                                    step="0.1"
                                    min={0}
                                    max={5}
                                    {...field('google_reviews_rating')}
                                />
                            </Field>
                            <Field
                                label="Nº reseñas"
                                error={errors.google_reviews_count}
                            >
                                <Input
                                    type="number"
                                    min={0}
                                    {...field('google_reviews_count')}
                                />
                            </Field>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-qd-text-medium dark:text-qd-white/40">
                        Sin rating/recuento se muestra solo el enlace, sin
                        inventar cifras.
                    </p>
                </FormSection>

                <FormSection title="Sitio">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="Texto corto del footer"
                            error={errors.footer_text}
                        >
                            <Input {...field('footer_text')} />
                        </Field>
                        <div />
                        <Field
                            label="Dominio canónico"
                            error={errors.canonical_domain}
                        >
                            <Input
                                {...field('canonical_domain')}
                                placeholder="https://..."
                            />
                        </Field>
                        <Field
                            label="Dominio histórico"
                            error={errors.previous_domain}
                        >
                            <Input
                                {...field('previous_domain')}
                                placeholder="https://..."
                            />
                        </Field>
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
                        Guardar ajustes
                    </button>
                </div>
            </form>
        </AdminLayout>
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

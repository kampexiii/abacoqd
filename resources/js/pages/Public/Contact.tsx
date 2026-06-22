import { Form, Head } from '@inertiajs/react';
import {
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
    ShieldCheck,
} from 'lucide-react';

import FormField, {
    formFieldInputClass,
    formFieldSelectClass,
} from '@/components/public/FormField';
import HoneypotField from '@/components/public/HoneypotField';
import PublicPageHero from '@/components/public/PublicPageHero';
import { SITE_CONFIG } from '@/config/site';
import { useInView } from '@/hooks/use-in-view';
import { useLanguage } from '@/hooks/use-language';
import PublicLayout from '@/layouts/public-layout';
import { show as bookingShow } from '@/routes/booking';
import { store } from '@/routes/contact';

type ServiceOption = {
    readonly id: number;
    readonly title: { readonly es: string; readonly en: string };
};

type ContactProps = {
    readonly services: ServiceOption[];
    readonly preselectedServiceId: number | null;
    readonly submitted: boolean;
};

/**
 * Vista pública Contacto. docs/07_VISTAS/PUBLIC_06_CONTACTO_RESERVA.md (sección A).
 */
export default function Contact({
    services,
    preselectedServiceId,
    submitted,
}: ContactProps) {
    const { t, locale } = useLanguage();
    const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

    return (
        <PublicLayout>
            <Head title="Contacto · AbacoQD" />

            <PublicPageHero
                eyebrow={t('contact.eyebrow')}
                title={t('contact.title')}
                subtitle={t('contact.subtitle')}
                currentLabel={t('navigation.items.contacto')}
                taglineTitle={t('contact.heroTagline.title')}
                taglineSubtitle={t('contact.heroTagline.subtitle')}
                taglineIcon={MessageCircle}
            />

            <section className="bg-qd-white dark:bg-qd-ink">
                <div
                    ref={ref}
                    className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[2fr_3fr]"
                >
                    <div className="flex flex-col gap-8">
                        <div>
                            <h2 className="text-lg font-semibold text-qd-ink dark:text-qd-white">
                                {t('contact.context.title')}
                            </h2>
                            <ul className="mt-3 flex flex-col gap-2 text-sm text-qd-text-high">
                                <li>{t('contact.context.steps.read')}</li>
                                <li>{t('contact.context.steps.evaluate')}</li>
                                <li>{t('contact.context.steps.reply')}</li>
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-qd-mist bg-qd-mist/40 p-5 dark:border-white/10 dark:bg-white/5">
                            <p className="text-sm font-semibold text-qd-ink dark:text-qd-white">
                                {t('contact.context.alternativeTitle')}
                            </p>
                            <a
                                href={bookingShow.url()}
                                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-qd-lime px-4 py-2.5 text-sm font-semibold text-qd-ink transition hover:brightness-95"
                            >
                                {t('contact.context.alternativeCta')}
                            </a>
                        </div>

                        <ul className="flex flex-col gap-3 text-sm text-qd-text-high">
                            <li className="flex items-center gap-2.5">
                                <Mail
                                    aria-hidden="true"
                                    size={16}
                                    className="shrink-0 text-qd-teal-2 dark:text-qd-teal"
                                />
                                <a
                                    href={`mailto:${SITE_CONFIG.contact.email}`}
                                    className="hover:text-qd-teal-2 dark:hover:text-qd-teal"
                                >
                                    {SITE_CONFIG.contact.email}
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone
                                    aria-hidden="true"
                                    size={16}
                                    className="shrink-0 text-qd-teal-2 dark:text-qd-teal"
                                />
                                <a
                                    href={SITE_CONFIG.contact.phoneHref}
                                    className="hover:text-qd-teal-2 dark:hover:text-qd-teal"
                                >
                                    {SITE_CONFIG.contact.phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <MessageCircle
                                    aria-hidden="true"
                                    size={16}
                                    className="shrink-0 text-qd-teal-2 dark:text-qd-teal"
                                />
                                <a
                                    href={SITE_CONFIG.contact.whatsappHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-qd-teal-2 dark:hover:text-qd-teal"
                                >
                                    {t('contact.details.whatsapp')}:{' '}
                                    {SITE_CONFIG.contact.whatsapp}
                                </a>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MapPin
                                    aria-hidden="true"
                                    size={16}
                                    className="mt-0.5 shrink-0 text-qd-teal-2 dark:text-qd-teal"
                                />
                                <span>{SITE_CONFIG.contact.address}</span>
                            </li>
                        </ul>

                        <p className="text-xs text-qd-text-medium">
                            {t('contact.context.trustHuman')}{' '}
                            {t('contact.context.trustPrivacy')}{' '}
                            <a
                                href="/privacidad"
                                className="underline hover:text-qd-teal-2 dark:hover:text-qd-teal"
                            >
                                {t('contact.context.trustPrivacyLink')}
                            </a>
                            .
                        </p>
                    </div>

                    <div
                        className={
                            inView
                                ? 'opacity-100 transition-opacity duration-500'
                                : 'opacity-0'
                        }
                    >
                        {submitted ? (
                            <div
                                role="status"
                                className="flex flex-col items-center gap-4 rounded-2xl border border-qd-mist bg-qd-mist/30 p-10 text-center dark:border-white/10 dark:bg-white/5"
                            >
                                <ShieldCheck
                                    aria-hidden="true"
                                    size={36}
                                    className="text-qd-teal-2 dark:text-qd-teal"
                                />
                                <h2 className="text-xl font-semibold text-qd-ink dark:text-qd-white">
                                    {t('contact.success.title')}
                                </h2>
                                <p className="max-w-sm text-sm text-qd-text-high">
                                    {t('contact.success.subtitle')}
                                </p>
                                <a
                                    href={bookingShow.url()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-qd-lime px-5 py-2.5 text-sm font-semibold text-qd-ink transition hover:brightness-95"
                                >
                                    {t('contact.success.cta')}
                                </a>
                            </div>
                        ) : (
                            <Form
                                {...store.form()}
                                disableWhileProcessing
                                className="flex flex-col gap-5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                label={t('contact.form.name')}
                                                error={errors.name}
                                            >
                                                <input
                                                    name="name"
                                                    required
                                                    autoComplete="name"
                                                    className={
                                                        formFieldInputClass
                                                    }
                                                />
                                            </FormField>
                                            <FormField
                                                label={t(
                                                    'contact.form.company',
                                                )}
                                                error={errors.company}
                                            >
                                                <input
                                                    name="company"
                                                    autoComplete="organization"
                                                    className={
                                                        formFieldInputClass
                                                    }
                                                />
                                            </FormField>
                                            <FormField
                                                label={t('contact.form.email')}
                                                error={errors.email}
                                            >
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoComplete="email"
                                                    className={
                                                        formFieldInputClass
                                                    }
                                                />
                                            </FormField>
                                            <FormField
                                                label={t('contact.form.phone')}
                                                error={errors.phone}
                                            >
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    autoComplete="tel"
                                                    className={
                                                        formFieldInputClass
                                                    }
                                                />
                                            </FormField>
                                        </div>

                                        {services.length > 0 && (
                                            <FormField
                                                label={t(
                                                    'contact.form.service',
                                                )}
                                                error={errors.service_id}
                                            >
                                                <select
                                                    name="service_id"
                                                    defaultValue={
                                                        preselectedServiceId ??
                                                        ''
                                                    }
                                                    className={
                                                        formFieldSelectClass
                                                    }
                                                >
                                                    <option value="">
                                                        {t(
                                                            'contact.form.servicePlaceholder',
                                                        )}
                                                    </option>
                                                    {services.map((service) => (
                                                        <option
                                                            key={service.id}
                                                            value={service.id}
                                                        >
                                                            {service.title[
                                                                locale
                                                            ] ??
                                                                service.title
                                                                    .es}
                                                        </option>
                                                    ))}
                                                    <option value="">
                                                        {t(
                                                            'contact.form.serviceOther',
                                                        )}
                                                    </option>
                                                </select>
                                            </FormField>
                                        )}

                                        <FormField
                                            label={t('contact.form.message')}
                                            error={errors.message}
                                        >
                                            <textarea
                                                name="message"
                                                required
                                                rows={5}
                                                placeholder={t(
                                                    'contact.form.messagePlaceholder',
                                                )}
                                                className={formFieldInputClass}
                                            />
                                        </FormField>

                                        <label className="flex items-start gap-2.5 text-sm text-qd-text-high">
                                            <input
                                                type="checkbox"
                                                name="privacy_consent"
                                                required
                                                className="mt-1 size-4 rounded border-qd-mist text-qd-teal-2 focus-visible:outline-2 focus-visible:outline-qd-teal-2"
                                            />
                                            <span>
                                                {t(
                                                    'contact.form.privacyConsent',
                                                )}{' '}
                                                <a
                                                    href="/privacidad"
                                                    className="underline hover:text-qd-teal-2 dark:hover:text-qd-teal"
                                                >
                                                    {t(
                                                        'contact.form.privacyConsentLink',
                                                    )}
                                                </a>
                                                .
                                            </span>
                                        </label>
                                        {errors.privacy_consent && (
                                            <p
                                                role="alert"
                                                className="text-sm text-red-600 dark:text-red-400"
                                            >
                                                {errors.privacy_consent}
                                            </p>
                                        )}

                                        <label className="flex items-start gap-2.5 text-sm text-qd-text-high">
                                            <input
                                                type="checkbox"
                                                name="marketing_consent"
                                                className="mt-1 size-4 rounded border-qd-mist text-qd-teal-2"
                                            />
                                            <span>
                                                {t(
                                                    'contact.form.marketingConsent',
                                                )}
                                            </span>
                                        </label>

                                        <HoneypotField id="contact-honeypot" />

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-qd-lime px-5 py-3 text-sm font-semibold text-qd-ink transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                        >
                                            {processing
                                                ? t('contact.form.submitting')
                                                : t('contact.form.submit')}
                                            <Send
                                                aria-hidden="true"
                                                size={16}
                                            />
                                        </button>
                                    </>
                                )}
                            </Form>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
